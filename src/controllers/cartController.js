
const productModel  = require('../models/productModel');
const userModel = require('../models/userModel');
const cartModel = require('../models/cartModel');
const { isValidObjectId } = require('mongoose');

// =================== Create Cart Api ========================
const CreateCart = async (req,res)=> {
    try {
        let userId = req.params.userId
        if(!isValidObjectId(userId))
          { return res.status(404).send({ status: false, message: "Invalid UserId" }) }

        //   ========== DB Call For  Checking UserId from UserModel===========

        let checkId = await userModel.findById(userId)
        if(!checkId)
        return res.status(200).send({ status: true, msg: "Not ok" })

        let cart = req.body
        let { productId } = cart
        if (Object.keys(cart).length < 1) { return res.status(400).send({ status: false, message: "create cart" }) }
         if (!isValidObjectId(productId)) { return res.status(404).send({ status: false, message: "Invalid productId" }) }

         
        // -----------------------DB CALL FOR CHECKING PRODUCT ID FROM PRODUCT MODEL------------------
        let productIdNew = await productModel.findOne({ _id: productId, isDeleted: false })
        if (!productIdNew) {
            return res.status(200).send({ status: true, message: "Not ok productId" })
        }

        // -------------------------------TO CREATE A NEW CART-----------------
        let arr1 = []
        let products = {
            productId: productId,
            quantity: 1
        }
        arr1.push(products)
        let priceCalculated = productIdNew.price * products.quantity

        // -------------------------------IF CART IS NOT CREATED OF A PARTICULAR USER IT WILL CREATE IT-----------------
        let cartData = await cartModel.findOne({ userId: userId })
        if (!cartData) {
            let createCart = {
                userId: userId, items: arr1,
                totalPrice: priceCalculated, totalItems: 1
            }
            let saveData = await cartModel.create(createCart)
            return res.status(201).send({ status: true, message: "newCart", data: saveData })
        }

        // -------------------------------WHEN CART IS ALREADY CREATED IT WILL UPDATE THE CART BY ITEMS(PRODUCT,QUANTITY,PRICE,ITEMS)------------------
        if (cartData) {
            let arr2 = cartData.items
            let productAdded = {
                productId: productId,
                quantity: 1
            }

            // ------------------COMPARE THE PRODUCT ID IF NOT PRESENT IT WILL CREATE ONE IF PRESENT IT WILL UPDATE THE QUANTITY------------------
            let compareProductId = arr2.findIndex((obj) => obj.productId == productId);
            if (compareProductId == -1) {
                arr2.push(productAdded)
            } else {
                arr2[compareProductId].quantity += 1;
            }

            let priceUpdated = cartData.totalPrice + (productIdNew.price * products.quantity)
            let itemsUpdated = arr2.length

            // -------------------------------CREATE THE UPDATED CART------------------
            let createCartNew = {
                items: arr2,
                totalPrice: priceUpdated, totalItems: itemsUpdated
            }
            let saveData = await cartModel.findOneAndUpdate({ userId: userId }, createCartNew, { new: true })
            return res.status(201).send({ status: true, message: "addCart", data: saveData })
        }
      
    } catch (error) {
      return res.status(500).send({ status: false, message: error.message })
    }
}









const getCart =async function (req,res){
    try{
        let Id =req.params.userId
        if (!Id) return res.status(400).send({ status: false, message: "id must be present in params" })
        if (!mongoose.isValidObjectId(Id)) return res.status(400).send({ status: false, message: "invalid Id" })
         
       
        let checkUserId = await UserModel.findOne({ _id: userId })
        if (!checkUserId) {
            return res.status(404).send({ status: false, message: `User details are not found with this userId ${userId}` })
        }

        if (req.decodedToken != userId)
        return res.status(403).send({ status: false, message: "Error, authorization failed" });

        let getData = await CartModel.findOne({ userId });
        if (getData.items.length == 0)
            return res.status(400).send({ status: false, message: "No items present" });

        if (!getData) {
            return res.status(404).send({ status: false, message: `Cart does not Exist with this userId :${userId}` })
        }

        res.status(200).send({ status: true, message: 'Success', data: getData })


    }catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

const deleteCart =async function (req,res){
    try{
        let  Id =req.params.userId

        if (!Id) return res.status(400).send({ status: false, message: "id must be present in params" })
        if (!mongoose.isValidObjectId(Id)) return res.status(400).send({ status: false, message: "invalid Id" })


        const userSearch = await UserModel.findById({ _id: userId })
        if (!userSearch) {
            return res.status(404).send({ status: false, message: `User details are not found with this userId ${userId}` })
        }

        // AUTHORISATION
        if (req.decodedToken != userId)
            return res.status(403).send({ status: false, message: "Error, authorization failed" })

        // To check cart is present or not
        const cartSearch = await CartModel.findOne({ userId })
        if (!cartSearch) {
            return res.status(404).send({ status: false, message: "Cart details are not found " })
        }

        const cartDelete = await CartModel.findOneAndUpdate({ userId }, { $set: { items: [], totalItems: 0, totalPrice: 0 } }, { new: true })
        return res.status(204).send({ status: true, message: 'Success', data: "Cart is deleted successfully" })

    }catch(err){
        return res.status(500).send({status:false,message:err.message})
    }
}

module.exports ={deleteCart,getCart,CreateCart }