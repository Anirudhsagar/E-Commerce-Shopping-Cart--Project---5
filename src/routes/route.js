const express = require('express');
const router = express.Router();
const userController= require("../controllers/userController")
const{authentication,authorization} = require("../middlewares/auth");
const productController = require("../controllers/productController")
const cartController = require("../controllers/cartController")
const orderController = require("../controllers/orderController");






// =================== for User ==================================

router.post("/register",userController.createUser)
router.post("/login",userController.login)

router.get("/user/:userId/profile",userController.getUser)

router.put("/user/:userId/profile",authentication,authorization,userController.updateUser)



//--------------------for products--------------------

router.post("/products", productController.createProduct)

router.get("/products", productController.getProduct)

router.get("/products/:productId", productController.getProductById)

router.put('/products/:productId',productController.updateProduct);

router.delete('/products/:productId', productController.deleteProduct)
  
// -------------------- for cart-------------------------

router.post('/users/:userId/cart',authentication,authorization,cartController.CreateCart);

router.put('/users/:userId/cart',authentication,authorization,cartController.updateCart);

router.get('/users/:userId/cart',authentication,authorization,cartController.getCart);

router.delete('/users/:userId/cart',authentication,authorization,cartController.deleteCart)



// ========================== order ===============================

router.post('/users/:userId/orders', orderController.createOrder );

router.put('/users/:userId/orders', orderController.updateOrder );









//Error Handing
router.all('/*', (req, res) => {
    res.status(404).send({ status: false, message: "URL Not Found" })
})







module.exports = router