import { Router } from "express";

import CartsController from "../dao/services/carts.service.js";

class cartsRouter {
    constructor() {
        this.carts = Router();
        /* Obtiene todos los carritos */
        this.carts.get('/', CartsController.getCarts);
        /* Agregar carrito con aray de products vacío */
        this.carts.post('/', CartsController.addCarts);
        /* Obtener productos de un carrito especifico x ID */
        this.carts.get('/:cartId', CartsController.getCartById);
        /* Elimina productos de un carrito especifico x ID */
        this.carts.delete('/:cartId', CartsController.emptyCart);
        /* Actualiza productos de un carrito especifico x ID */
        this.carts.put('/:cartId', CartsController.updateCartProducts);
        /* Actualiza cantidad de productos de un carrito especifico x ID */
        this.carts.put("/:cartId/products/:productId", CartsController.updateProductQuantity);
        /* Agregar un producto de products al carrito especifico x ID */
        this.carts.post("/:cartId/products/:productId", CartsController.addProductToCart);
        /* Elimina un producto del carrito especifico x ID */
        this.carts.delete('/:cartId/products/:productId', CartsController.deleteProductFromCart);
    }
}

export default new cartsRouter().carts;