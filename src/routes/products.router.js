import { Router } from "express";

import ProductsController from "../dao/services/products.service.js";

class productsRouter {
    constructor() {
        this.products = Router();
        /* Se obtienen todos los productos o se limita la cantidad */
        this.products.get('/', ProductsController.getProducts);
        /* Obtiene el producto especifico x ID */
        this.products.get('/:productId', ProductsController.getProductById);
        /* Agrega un producto */
        this.products.post('/', ProductsController.addProduct);
        /* Actualiza el producto especifico x ID */
        this.products.put('/:productId', ProductsController.updateProducts);
        /* Elimina el producto especifico x ID */
        this.products.delete('/:productId', ProductsController.deleteProduct);
    }
}

export default new productsRouter().products;