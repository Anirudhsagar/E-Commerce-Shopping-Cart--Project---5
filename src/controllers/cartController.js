
const productModel  = require('../models/productModel');
const userModel = require('../models/userModel');
const cartModel = require('../models/cartModel');
const { isValidObjectId } = require('mongoose');
const validator = require("../validations/validator")

// 
const CreateCart = async function (req, res) {

    try {
      const data = req.body;
  
      const userId = req.params.userId;
      let { productId, cartId } = data
      // console.log(userId)
      // console.log(req.userId)
  
      if (!isValidObjectId(userId)) {
        return res.status(400).send({ status: false, message: "Please give a valid userId" })
  
      }
      if (validator.isValidBody(data)) {
        return res.status(400).send({ status: false, message: "Please give some data for create cart" })
      }
      if (cartId) {
        if (!validator.isValid1(cartId)) {
          return res.status(400).status({ status: false, message: "cardId should not be empty" })
        }
        if (!isValidObjectId(cartId)) {
          return res.status(400).send({ staus: false, message: "Please provide a valid cartId" })
        }
      }
      if (!validator.isValid1(productId)) {
        return res.status(400).send({ status: false, message: "Please provide a productId" })
      }
      if (!isValidObjectId(productId)) {
        return res.status(400).send({ status: false, message: "Please provide a valid productId" })
      }
      const product = await productModel.findOne({ _id: productId, isDeleted: false })
      if (!product) {
        return res.status(404).send({ status: false, message: "product is not exist or already deleted" })
      }
      const cart = await cartModel.findOne({ userId: userId })
      if (!cart) {
        if (cartId) return res.status(400).send({ status: false, message: "This cart is not exist for this particular user" })//when user create cart for first time then he have not any cartId so if he enter a cartid in body then it throw the error
        let addCart = {
          userId: userId,
          items: [{ productId: productId, quantity: 1 }],
          totalPrice: product.price,
          totalItems: 1,
        }
  
  
        const create = await cartModel.create(addCart)
        return res.status(201).send({ status: true, message: "Success", data: create })
      }
  
      if (cart) {
        if (!cartId) {
          return res.status(400).send({ status: false, message: "please provide cartId for this particuler user" })
  
        }
  
  
        if (cart._id.toString() != cartId) {
          return res.status(404).send({ status: false, message: "Cart id is not correct" })
        }
      }
  
      let arr = cart.items;
  
      // console.log(arr.length)
      for (let i = 0; i < arr.length; i++) {
        console.log(arr[i].productId)
        console.log(productId)
  
        if (arr[i].productId.toString() == productId) {
  
  
          arr[i].quantity = arr[i].quantity + 1
  
          let updateCart = await cartModel.findOneAndUpdate({ userId: userId }, { items: arr, totalPrice: cart.totalPrice + product.price, totalItems: arr.length }, { new: true })
          return res.status(201).send({ status: true, message: "Success", data: updateCart })
        }
      }
  
  
  
  
      
          let newCart = {
            $addToSet: { items: { productId: product._id, quantity: 1 } },
            totalPrice: product.price + cart.totalPrice,
            totalItems: cart.totalItems + 1
          }
         let  updateCart = await cartModel.findOneAndUpdate({ userId: userId }, newCart, { new: true })
         return res.status(201).send({ status: true, message: "Success", data: updateCart })
  
  
        
  
  
  
      
      // return res.status(201).send({ status: true, message: "Success", data: updateCart })
  
  
  
  
  
  
    } catch (error) {
      return res.status(500).send({ status: false, message: error.message })
    }
  }

// ===============================update =============================

const updateCart = async function (req, res) {
    try {
      let userId = req.params.userId;
      let data = req.body;
      let { cartId, productId, removeProduct } = data;
      if (!isValidObjectId(userId)) {
        res.status(400).send({ status: false, message: "invalid userId" })
      }

    
      // ===================================================
      if (validator.isValidBody(data)) {
        return res.status(400).send({ status: false, message: "please provide data to be update" })
  
      }
      /////cartId validation
      if (!validator.isValid1(cartId)) {
        return res.status(400).send({ status: false, message: "Please provide a cart id" })
      }
      if (!isValidObjectId(cartId)) {
        return res.status(400).send({ status: false, message: "Invalid cartId" })
      }
      ///productId validation
      if (!validator.isValid1(productId)) {
        return res.status(400).send({ status: false, message: "Please provide productId" })
      }
      if (!isValidObjectId(productId)) {
        return res.status(400).send({ status: false, message: "Invalid product Id" })
      }
      //////removeProduct validation
      if (!validator.isValid1(removeProduct)) {
        return res.status(400).send({ stataus: false, message: "please provide removeProduct " })
      }
      if (!/^(0|1)$/.test(removeProduct)) {
        return res.status(400).send({ status: false, message: "Remove product must be 0 0r 1" })
      }
      let product = await productModel.findOne({ _id: productId, isDeleted: false })
      if (!product) {
        return res.status(404).send({ status: false, message: "Product is not exist or already deleted" })
      }
  
      let cart = await cartModel.findOne({ _id: cartId, "items.productId": productId })
      //{items:{$elemMatch:{productId:productId}}}
  
      if (!cart) {
        return res.status(404).send({ status: false, message: "Cart is not exist or product is not available in this cart" })
      }
  
      if (removeProduct == 1) {
        let updateCart = await cartModel.findOneAndUpdate({ _id: cartId, "items.productId": productId }, { $inc: { totalPrice: -product.price, "items.$.quantity": -1 } }, { new: true })
        // console.log(updateCart.items)
  
        //  return res.status(200).send({status:true,message:"success",data:updateCart})
  
        let quantity = updateCart.items.filter((item) => item.productId.toString() === productId)[0].quantity
        if (quantity == 0) {
          let result = await cartModel.findOneAndUpdate({ _id: cartId, "productId": productId }, { $inc: { totalItems: -1 }, $pull: { items: { productId: productId } } }, { new: true })
          return res.status(200).send({ status: true, message: "Success", data: result })
        }
        return res.status(200).send({ status: true, message: "Success", data: updateCart })
      }
      if (removeProduct == 0) {
        let quantity = cart.items.filter((item) => item.productId.toString() === productId)[0].quantity
        let result = await cartModel.findOneAndUpdate({ _id: cartId, "items.productId": productId }, { $inc: { totalPrice: -(product.price * quantity), totalItems: -1 }, $pull: { items: { productId: productId } } }, { new: true })
        return res.status(200).send({ status: true, message:"Success", data: result })
  
      }
  
  
    } catch (error) {
      return res.status(500).send({ status: false, message: error.message })
     }
}






//===================================================================================
const getCart = async (req, res) => {
  
  try {
      let userId = req.params.userId
      if (!validator.isValidObjectId(userId))
          return res.status(400).send({ status: false, message: "Invalid userId ID" })

      let validUser = await userModel.findOne({ _id: userId })
      if (!validUser) return res.status(404).send({ status: false, message: "User does not exists" })

      let validCart = await cartModel.findOne({ userId: userId }).select({ "items._id": 0, __v: 0 })
      if (!validCart) return res.status(404).send({ status: false, message: "No cart found" })
      return res.status(200).send({ status: true, message: 'Success', data: validCart })
  }
  catch (err) {
      return res.status(500).send({ status: false, err: err.message });
  }
}
//====================================================================================
const deleteCart = async (req, res) => {
try {
  let userId = req.params.userId;

  //checking if the cart is present with this userId or not
  let findCart = await cartModel.findOne({ userId: userId });

  if (findCart.items.length == 0) {
      return res.status(204).send({ status: false, message: "Cart is already empty" });
  }
      await cartModel.updateOne({ _id: findCart._id },
      { items: [], totalPrice: 0, totalItems: 0 });
  return res.status(200).send({ status: false, message: "Deleted Successfully"});

} catch (error) {
  return res.status(500).send({ status: false, message: error.message });
}
}






module.exports ={deleteCart,getCart,CreateCart , updateCart}