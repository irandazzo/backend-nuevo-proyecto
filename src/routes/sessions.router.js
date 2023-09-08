import { Router } from "express";

import usersController from "../dao/controllers/users.controller.js";

class sessionsRouter {
    constructor() {
        this.users = Router();
        /* Registro del Usuario */
        this.users.post('/register', usersController.register);
        this.users.get('/failedregister', usersController.failedRegister);
        /* Login del Usuario */
        this.users.post('/login', usersController.login);
        this.users.get('/failedlogin', usersController.failedLogin);
        /* Login con Github */
        this.users.get('/github', usersController.github);
        this.users.get('/githubcallback', usersController.githubCallback);
        /* Reseteo de Password */
        this.users.get('/resetpassword', usersController.resetPassword);
        /* Verificar si existe Usuario autenticado */
        this.users.get('/current', usersController.currentUser);
    }
}
export default new sessionsRouter().users;