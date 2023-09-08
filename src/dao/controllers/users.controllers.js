import passport from "passport";
import { userModel } from "../models/users.model.js";
import { createHash } from "../../utils.js";

class UsersController {
    register(req, res, next) {
        passport.authenticate('register', { failureRedirect: '/failedregister' }, (err, user, info) => {
            if (err) {
                console.error('Fallo en estrategia de registro');
                res.status(500).send(err);
            }
            if (!user) {
                return res.status(400).send(info);
            }
            req.login(user, err => {
                if (err) {
                    console.error(err);
                    return res.status(500).send(err);
                }
                return res.send({ status: 'Success', message: 'Usuario registrado correctamente' });
            })
        })(req, res, next);
    }

    failedRegister(req, res) {
        console.log('Fallo en estrategia de registro');
        res.send({ error: 'failed' })
    }

    login(req, res, next) {
        passport.authenticate('login', { failureRedirect: '/failedlogin' }, (err, user) => {
            if (err) {
                console.error(err);
                res.status(500).send(err);
            }
            if (!user) {
                return res.status(400).send({ status: 'Error', Error: 'Email o contraseña incorrectos' });
            }
            req.login(user, err => {
                if (err) {
                    console.error(err);
                    return res.status(500).send(err);
                }
                req.session.user = {
                    name: `${req.user.first_name} ${req.user.last_name}`,
                    email: req.user.email,
                    age: req.user.age,
                    role: req.user.role
                }
                res.send({ status: 'Success', payload: req.session.user, message: 'Usuario logueado correctamente.' });
            })
        })(req, res, next);
    }

    failedLogin(req, res) {
        res.send({ 
            status: 'Error', 
            Error: 'Fallo estrategia de logueo' 
        })(req, res);
    }

    github(req, res) {
        passport.authenticate('github', { 
            scope: ['user: email'] }, () => { 
            })(req, res);
    }

    githubCallback(req, res) {
        passport.authenticate('github', { failureRedirect: '/login' }, (err, user) => {
            if (err) {
                console.error(err);
                res.status(500).send(err);
            }
            if (!user) {
                return res.status(400).send({ status: 'Error', Error: 'Error al autenticar con Github' });
            }
            req.login(user, err => {
                if (err) {
                    console.error(err);
                    res.status(500).send(err);
                }
                req.session.user = {
                    name: `${req.user.first_name} ${req.user.last_name}`,
                    email: req.user.email,
                    age: req.user.age,
                    role: 'user'
                };
                res.redirect('/');
            })
        })(req, res);
    }

    async resetPassword(req, res) {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).send({ status: 'Error', Error: 'Valores incompletos' });
        const user = await userModel.findOne({ email });

        if (!user) return res.status({ status: 'Error', Error: 'Usuario no encontrado'});
        const newPassword = createHash(password);
        await userModel.updateOne({ _id: user._id }, { $set: { password: newPassword } });
        res.send({ status: 'Success', payload: user, message: 'Contraseña actualizada exitosamente' })
    }

    currentUser(req, res) {
        if (req.isAuthenticated()) {
            res.json(req.user);
        } else {
            res.status(401).json({ error: 'No hay usuario ingresado' });
        }
    }
}

export default new UsersController();