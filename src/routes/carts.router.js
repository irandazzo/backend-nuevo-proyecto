import { Router } from "express";
import Carts from "../dao/dbManagers/carts.js";

const router = Router();
const cartManager = new Carts();

/* Obtener los Carritos */
router.get('/', async (req, res) => {
    let getCarts = await cartManager.getCarts();
    let limit = req.query.limit;

    if (!limit) return res.send({ getCarts });

    let carts = getCarts.slice(0, limit);
    res.status(200).send({ status: 'Success', payload: carts });
    console.log(getCarts);
});

/* Agregar Carrito con Array de productos Vacío  */
router.post('/', async (req, res) => {
    let carts = await cartManager.addCarts();
    res.status(200).send({ status: 'Success', payload: `Carrito Creado Correctamente: ${carts}`});
});

/* Obtener Carrito x ID */
router.get('/:cartId', async (req, res) => {
    let cartId = req.params.cartId;
    let getCarts = await cartManager.getCarts(cartId);
    if (!cartId) return res.status(400).send({ status: 'error', error: 'Cart not found.' });
    res.status(200).send({ status: 'Success', payload: getCarts[0] })
});

/* Eliminar Carrito x ID */
router.delete('/:cartId', async (req, res) => {
    const { cartId } = req.params;
    try {
        await cartManager.emptyCart(cartId)
        res.status(200).send({ status: 'Success', payload: `Productos eliminados del Carrito: ${cartId}.`})
    } catch (error) {
        res.status(400).send({ status: 'error', error: `Error al eliminar los productos del Carrito: ${cartId}.`})
    }
});

/* Actualizar Carrito x ID */
router.put('/:cartId', async (req, res) => {
    const { cartId } = req.params;
    const { products } = req.body;
    try {
        await cartManager.updateCartProducts(cartId, products);
        res.status(200).send({ status: 'Success', payload: 'Carrito Actualizado Correctamente'});
    } catch (error) {
        res.status(400).send({ status: 'error', error: `Error al Actualizar el Carrito: ${cartId}`})
    }
});

/* Actualizar un producto de products al Carrito x ID */
router.put("/:cartId/products/:productId", async (req, res) => {
    const { cartId, productId } = req.params;
    const { quantity } = req.body;
    try {
        await cartManager.updateProductQuantity(cartId, productId, quantity);
        res.status(200).send({ status: 'Success', payload: `Producto en Carrito: ${cartId}, actualizado correctamente`});
    } catch (error) {
        res.status(400).send({ status: 'error', error: `Error al actualizar el producto: ${productId} en el Carrito: ${cartId}.`})
    }
})

/* Agregar un producto de products al Carrito x ID */
router.post("/:cartId/products/:productId", async (req, res) => {
    const { cartId, productId } = req.params;
    try {
        await cartManager.addProductToCart(cartId, productId);
        res.status(200).send({ status: 'Success', payload: `Producto agregado correctamente al Carrito: ${cartId}.`})
    } catch (error) {
        res.status(400).send({ status: 'error', error: `Error al agregar producto al Carrito: ${cartId}`})
    }
});

/* Eliminar un producto del Carrito x ID */
router.delete('/:cartId/products/:productId', async (req, res) => {
    const { cartId, productId } = req.params;
    try {
        await cartManager.deleteProductFromCart(cartId, productId);
        res.status(200).send({ status: 'Success', payload: `Producto eliminado del Carrito: ${cartId}.`})
    } catch (error) {
        res.status(400).send({ status: 'error', error: `Error al eliminar el producto del Carrito: ${cartId}`})
    }
});

export default router;