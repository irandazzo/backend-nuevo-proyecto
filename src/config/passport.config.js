import passport from "passport";
import local from "passport-local";
import { userModel } from '../dao/models/users.model.js';
import { createHash, isValidPassword } from "../utils.js";
import GitHubStrategy from 'passport-github2';
import config from "./config.js";

const LocalStrategy = local.Strategy;

const initializePassport = () => {
    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' }, async (req, username, userPassword, done) => {
            try {
                let user = await userModel.findOne({ email: username });
                if (user) {
                    console.log('Usuario ya existe.')
                    return done(null, false, { message: 'Usuario ya existe.' });
                }
                const { first_name, last_name, email, age } = req.body;
                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(userPassword),
                    cart: null,
                    role: 'user'
                }
                let result = await userModel.create(newUser);
                return done(null, result);
            } catch (error) {
                return done('Hubo un error en tu usuario' + error);
            }
        }
    ));

    passport.use('github', new GitHubStrategy({
        clientID: config.GITHUB_CLIENT_ID,
        clientSecret: config.GITHUB_CLIENT_SECRET, 
        callbackURL: config.GITHUB_CALLBACK_URL
        /* clientID: "Iv1.f507b43688478f47",
        clientSecret: "e484c85b014433339c71024f20f1e3b6ce6fb099", 
        callbackURL: "http://localhost:8080/api/sessions/githubcallback" */
    }, async (accessToken, refreshToken, profile, done) =>{
        try {
            let user = await userModel.findOne({email:profile._json.email});
            if (!user){
                let newUser = {
                    first_name: profile._json.name,
                    last_name: '',
                    email: profile._json.email,
                    age: '',
                    password: '',
                    cart: null,
                    role:'user'
                }
                console.log(newUser);
                let result = await userModel.create(newUser);
                return done(null, result);
            }else{
                return done(null, user);
            }
        }catch(error){
            return done('Hubo un error al intentar buscar tu usuario ' + error);
        }
    }))
    passport.use('login', new LocalStrategy({ passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
        try {
            let role = 'user';
            if(username === `${config.ADMIN_EMAIL}` && password === `${config.ADMIN_PASS}`){
                role = 'admin'
            }
            const user = await userModel.findOne({ email: username })
            if (!user) {
                console.log("El Usuario no existe")
                return done(null, false);
            }
            if (!isValidPassword(user, password)) return done(null, false);
            user.role = role;
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await userModel.findById(id);
        done(null, user);
    });
}

export default initializePassport;
