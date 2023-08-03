import { Router } from "express";
import { productModel } from "../dao/models/products.model.js";

const views = Router();

const userLogged = (req, res, next) => {
    if (!req.session.user) {
        res.redirect('/login');
    } else {
        next();
    }
}

views.get('/', userLogged, async (req, res) => {
    let { page, sort, category, limit } = req.query;
    let sortDirection;

    if (!page) {
        page = 1
    };

    if (!limit) {
        limit = 10
    };

    if (sort === 'asc') {
        sortDirection = 1;
    } else if (sort === 'desc') {
        sortDirection = -1;
    } else {
        sortDirection = 0;
    }

    const queryObject = {};
    if (category) {
        category = category.toLowerCase();
        queryObject.category = category;
    }

    const sortOptions = sortDirection ? { price: sortDirection } : {};

    const { docs, hasPrevPage, hasNextPage, nextPage, prevPage, totalPages } = await productModel.paginate(queryObject, { page, limit, sort: sortOptions, lean: true });

    const products = docs;
    res.status(200).render('home', {
        status: 'success',
        payload: products,
        page: page,
        limit,
        category,
        sort,
        totalPages,
        hasNextPage,
        hasPrevPage,
        nextPage,
        prevPage,
        style: 'index.css',
        title: 'Productos',
        user: req.session.user
    });
});

views.get('/register', async (req, res) => {
    res.render('register');
});

views.get('/login', async (req, res) => {
    res.render('login');
});

views.get('/profile', userLogged, async (req, res) => {
    res.render('profile', {
        user: req.session.user,
    });
});

views.get('/logout', async (req, res) => {
    req.session.destroy(error => {
        if (!error) res.render('login');
        else res.send({ status: 'Logout ERROR', body: error });
    })
});

views.get('/resetpassword', async (req, res) => {
    res.render('resetPassword');
});

views.get('/realtimeproducts', userLogged, async (req, res) => {
    res.render('realTimeProducts', {
        style: 'index.css',
        title: 'Real Time Products',
    })
});

views.get('/chat', (req, res) => {
    res.render('chat', {
        style: 'index.css',
        title: 'Chat en Vivo!'
    })
});

export default views;
