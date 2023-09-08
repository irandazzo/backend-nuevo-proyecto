import Carts from '../services/carts.service.js';

const cartManager = new Carts();

class CartsController {
    async getCarts(req, res) {
        let getCarts = await cartManager.getCarts();
        let limit = req.query.limit;
    
        if(!limit) return res.send({ getCarts });

        let carts = getCarts.slice(0, limit);
        res.status(200).send({status: 'success', payload: carts});
    }

    async getCartById (req, res) {
        let cartId = req.params.cartId;
        let getCarts = await cartManager.getCarts(cartId);
        if(!cartId) return res.status(400).send({status: 'error', error: 'Carrito no encontrado'});
        res.status(200).send({ status: 'success', payload: getCarts[0]})
    }
    
    async addCarts(req, res){
        let carts = await cartManager.addCarts();
        res.status(200).send({ status:'success', payload: `Carrito creado correctamente: ${carts}`})
    }

    async addProductsToCart(req, res) {
        const { cartId, productId } = req.params;
        try {
            await cartManager.addProductToCart(cartId, productId);
            res.status(200).send({ status: 'success', payload:`Producto agregado correctamente al carrito: ${cartId}`})
        }catch (error){
            res.status(400).send({ status: 'error', error: `Ocurrió un error al intentar agregar el producto al carrito ${cartId}`})
        }
    }
    
    async deleteProductFromCart(req, res) {
        const { cartId, productId } = req.params;
        try{
            await cartManager.deleteProductFromCart(cartId, productId);
            res.status(200).send({ status:'success', payload: `Producto eliminado del carrito: ${cartId}`})
        }catch(error){
            res.status(400).send({status: 'error', error: `Ocurrió un error al intentar eliminar el producto del carrito: ${cartId}`})
        }
    }

    async emptyCart(req, res){
        const {cartId} = req.params;
        try{
            await cartManager.emptyCart(cartId)
            res.status(200).send({status:'success', payload: `Productos eliminados correctamente del carrito: ${cartId}`})
        }catch (error){
            res.status(400).send({status:'error', error: `Ocurrió un error al intentar remover los productos del carrito: ${cartId}`})
        }
    }

    async updateCartProducts(req, res) {
        const {cartId} = req.params;
        const {products} = req.body;

        try{
            await cartManager.updateCartProducts(cartId, products);
            res.status(200).send({status:'success', payload:'Carrito actualizado correctamente.'})
        }catch(error){
            res.status(400).send({status: 'error', error: `Ocurrió un error al intentar actualizar el carrito: ${cartId}`})
        }
    }

    async updateProductQuantity(req,res){
        const {cartId, productId} = req.params;
        const { quantity } = req.body;

        try{
            await cartManager.updateProductQuantity(cartId, productId, quantity);
            res.status(200).send({status:'success', payload:`Producto en carrito: ${cartId}, actualizado correctamente`})
        }catch(error){
            res.status(400).send({status:'error', error: `Ocurrió un error al intentar actualizar el producto: ${productId} en el carrito: ${cartId}`})
        }
    }
}

export default new CartsController();