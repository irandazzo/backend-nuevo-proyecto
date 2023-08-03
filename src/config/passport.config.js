import passport from "passport";
import local from "passport-local";
import { userModel } from '../dao/models/users.model.js';
import { createHast, isValidPassword } from "../utils.js";

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
                    password: createHast(userPassword)
                }
                let result = await userModel.create(newUser);
                return done(null, result);
            } catch (error) {
                return done('Hubo un error en tu usuario ' + error);
            }
        }
    ));


    passport.use('login', new LocalStrategy({ passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
        try {
            let role = 'user';
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
