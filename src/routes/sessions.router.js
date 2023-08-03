import { Router } from "express";
import { userModel } from "../dao/models/users.model.js";
import { createHast } from "../utils.js";
import passport from 'passport';

const sessions = Router();

/* Registro de Usuario */
sessions.post('/register', passport.authenticate('register', { failureRedirect: '/failedregister' }), async (req, res) => {
    res.send({ status: 'Success', message: 'Usuario registrado correctamente.'})
});

sessions.get('/failedregister', async (req, res) => {
    console.log('Failed register strategy.')
    res.send({ error: 'failed' })
});

/* Login del Usuario */
sessions.post('/login', passport.authenticate('login', { failureRedirect: '/failedlogin' }), async (req, res) => {
    if (!req.user) return res.status(400).send({ status: 'Error', Error: 'Email y/o contraseña invalidos' })

    req.session.user = {
        name: `${req.user.first_name} ${req.user.last_name}`,
        email: req.user.email,
        age: req.user.age,
        role: req.user.role
    }

    res.send({ status: 'Success', payload: req.session.user, message: 'Usuario logueado correctamente.' });
});

sessions.get('/failedlogin', (req, res) => {
    res.send({ status: 'Error', Error: 'Failed login strategy.' })
});

/* Reset de Contraseña */
sessions.post('/resetpassword', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send({ status: 'Error', Error: 'Datos incompletos'});
    const user = await userModel.findOne({ email });

    if (!user) return res.status({ status: 'Error', Error: 'Usuario no encontrado'});
    const newPassword = createHast(password);
    await userModel.updateOne({ _id: user._id }, { $set: { password: newPassword } });
    res.send({ status: 'Success', payload: user, message: 'Contraseña actualizada correctamente.'})
});

export default sessions;