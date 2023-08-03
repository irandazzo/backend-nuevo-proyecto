import { Router } from "express";
import Products from "../dao/dbManagers/products.js"

const router = Router();
const manager = new Products();

router.get('/', async (req, res) => {
    let getProducts = await manager.getProducts();
    let limit = req.query.limit;

    if (!limit) return res.send({ getProducts });

    let products = getProducts.slice(0, limit);
    res.send({ status: "Ok", payload: products});
});

router.post('/', async (req, res) => {
    const product = req.body;
    let products = await manager.addProduct(product);

    if (!product.title ||
        !product.description ||
        !product.code ||
        !product.price ||
        !product.status ||
        !product.stock ||
        !product.category) {
        return res.status(400).send({ status: 'error', error: 'Por favor complete todos los campos.'});
    }

    res.send({ status: 'Ok', message: 'Producto creado'})
});

router.get('/:productId', async (req, res) => {
    let getProducts = await manager.getProducts();
    let productId = req.params.productId;

    let product = getProducts.find(p => p.id.toString() === productId);
    if (!product) return res.status(400).send({ status: 'error', error: 'Producto no encontrado.'});
    res.send(product);
});

router.put('/:productId', async (req, res) => {
    let getProducts = await manager.getProducts();
    let productId = req.params.productId;

    let productIndex = getProducts.findIndex(p => p.id.toString() === productId);
    if (productIndex === -1) return res.status(400).send({ status: 'error', error: 'Producto no encontrado.'});

    let updatedProduct = { ...getProducts[productIndex], ...req.body };
    getProducts[productIndex] = updatedProduct;

    await manager.updateProducts(getProducts);

    res.send(updatedProduct);
});

router.delete('/:productId', async (req, res) => {
    let getProducts = await manager.getProducts();
    let productId = req.params.productId;
    let product = getProducts.find(p => p.id === productId);

    if (product) {
        manager.deleteProduct(productId)
        res.send({ status: 'Ok', message: 'Producto eliminado correctamente'})
    } else {
        res.status(400).send({ status: 'error', error: 'Producto no encontrado'})
    }
});

export default router;