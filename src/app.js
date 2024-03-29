import express from 'express';
import session from 'express-session';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import viewsRouter from './routes/views.router.js';
import cartsRouter from './routes/carts.router.js';
import productsRouter from './routes/products.router.js';
import sessionsRouter from './routes/sessions.router.js';
import passport from "passport";
import initializePassport from './config/passport.config.js';
import config from './config/config.js';

const app = express ();
const PORT = config.PORT;

/* Capitalize */
const hbs = handlebars.create({
    helpers: {
        capitalize: (string) => string.charAt(0).toUpperCase() + string.slice(1)
    }
});

/* Conexión con base de datos Mongo DB */
const environment = async () => {
    mongoose.set('strictQuery', false)
    await mongoose.connect(`mongodb+srv://${config.MONGO_USER}:${config.MONGO_PASS}@cluster0.0xjxasx.mongodb.net/${config.DB_NAME}?retryWrites=true&w=majority`);
}
environment();
initializePassport();

app.use(session({
    store: MongoStore.create({
        mongoUrl: `mongodb+srv://${config.MONGO_USER}:${config.MONGO_PASS}@cluster0.0xjxasx.mongodb.net/${config.DB_NAME}?retryWrites=true&w=majority`,
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
    }),
    secret: config.SECRET_KEY,
    resave: false,
    saveUninitialized: false
}));

/* Passport */

app.use(passport.initialize());
app.use(passport.session());

/* Servidor */
const httpServer = app.listen(PORT, () => console.log(`Servidor Arriba en puerto ${PORT}`));
const io = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

app.use('/', viewsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/products', productsRouter);
app.use('/api/sessions', sessionsRouter);


/* Conexión con WebSocket Chat en Vivo */
import { messageModel } from "./dao/models/messages.model.js"
let messages = [];

io.on('connection', async socket => {
    console.log('Ingreso nuevo cliente');

    socket.on('message', data => {
        messages.push(data);
        io.emit('messagesLogs', messages);
        messageModel.create({
            user: data.user,
            message: data.message
        });
    });

    socket.on('authenticated', data => {
        socket.broadcast.emit('Nuevo Usuario Conectado', data);
    });
});