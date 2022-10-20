
const productModel  = require('../models/productModel');
const userModel = require('../models/userModel');
const cartModel = require('../models/cartModel');
const { isValidObjectId } = require('mongoose');
const validator = require("../validations/validator")

// =================== Create Cart Api ========================
// const CreateCart = async (req,res)=> {
//     try {
//         let userId = req.params.userId
//         if(!isValidObjectId(userId))
//           { return res.status(404).send({ status: false, message: "Invalid UserId" }) }

//         //   ========== DB Call For  Checking UserId from UserModel===========

//         let checkId = await userModel.findById(userId)
//         if(!checkId)
//         return res.status(200).send({ status: true, msg: "Not ok" })

//         let cart = req.body
//         let { productId } = cart
//         if (Object.keys(cart).length < 1) { return res.status(400).send({ status: false, message: "create cart" }) }
//          if (!isValidObjectId(productId)) { return res.status(404).send({ status: false, message: "Invalid productId" }) }

//          console.log(productId)
         
//         // -----------------------DB CALL FOR CHECKING PRODUCT ID FROM PRODUCT MODEL------------------
//         let productIdNew = await productModel.findOne({_id:productId, isDeleted: false })
//         if (!productIdNew) {
//             return res.status(200).send({ status: true, message: "Not ok productId" })
//         }
//         console.log(productIdNew)

//         // -------------------------------TO CREATE A NEW CART-----------------
//         let arr1 = []
//         let products = {
//             productId: productId,
//             quantity: 1
//         }
//         arr1.push(products)
//         let priceCalculated = productIdNew.price * products.quantity

//         // -------------------------------IF CART IS NOT CREATED OF A PARTICULAR USER IT WILL CREATE IT-----------------
//         let cartData = await cartModel.findOne({ userId: userId })
//         if (!cartData) {
//             let createCart = {
//                 userId: userId, items: arr1,
//                 totalPrice: priceCalculated, totalItems: 1
//             }
//             let saveData = await cartModel.create(createCart)
//             return res.status(201).send({ status: true, message: "newCart", data: saveData })
//         }

//         // -------------------------------WHEN CART IS ALREADY CREATED IT WILL UPDATE THE CART BY ITEMS(PRODUCT,QUANTITY,PRICE,ITEMS)------------------
//         if (cartData) {
//             let arr2 = cartData.items
//             let productAdded = {
//                 productId: productId,
//                 quantity: 1
//             }

//             // ------------------COMPARE THE PRODUCT ID IF NOT PRESENT IT WILL CREATE ONE IF PRESENT IT WILL UPDATE THE QUANTITY------------------
//             let compareProductId = arr2.findIndex((obj) => obj.productId == productId);
//             if (compareProductId == -1) {
//                 arr2.push(productAdded)
//             } else {
//                 arr2[compareProductId].quantity += 1;
//             }

//             let priceUpdated = cartData.totalPrice + (productIdNew.price * products.quantity)
//             let itemsUpdated = arr2.length

//             // -------------------------------CREATE THE UPDATED CART------------------
//             let createCartNew = {
//                 items: arr2,
//                 totalPrice: priceUpdated, totalItems: itemsUpdated
//             }
//             let saveData = await cartModel.findOneAndUpdate({ userId: userId }, createCartNew, { new: true })
//             return res.status(201).send({ status: true, message: "addCart", data: saveData })
//         }
      
//     } catch (error) {
//       return res.status(500).send({ status: false, message: error.message })
//     }
// }




// =============================================

const CreateCart = async function (req, res) {
  try {

      let userIdByparam = req.params.userId;
      let data = req.body;
      let userIdbytoken = req.userId

      const { productId,cartId } = data


      if (!isValidObjectId(userIdByparam)) {
          return res.status(400).send({ status: false, msg: "userId is invalid" });
      }


      const userByuserId = await userModel.findById(userIdByparam);

      if (!userByuserId) {
          return res.status(404).send({ status: false, message: 'user not found.' });
      }

      
      if (!validator.isValid1(productId)) {
          return res.status(400).send({ status: false, message: "productId is required" })
      }

      if (!isValidObjectId(productId)) {
          return res.status(400).send({ status: false, message: "productId is not valid" })
      }

      let findProduct = await productModel.findOne({ _id: productId, isDeleted: false })
      if (!findProduct) {
          return res.status(400).send({ status: false, message: "product is not found" })
      }

      let existCart = await cartModel.findOne({ userId: userIdByparam })

      if (!existCart) {

          let newCart = {
              productId: findProduct._id,
              quantity: 1
          }
          productPrice = (findProduct.price * newCart.quantity)
          let createCart = await cartModel.create({ userId: userIdByparam, items: newCart, totalPrice: productPrice, totalItems: 1 })
          return res.status(201).send({ status: true, message: "Cart is create Successfully", data: createCart })

      }

      if (existCart) {
          if(!cartId){
              return res.status(400).send({status:false,message:"please enter cart id"})
          } 
           let findUserFromCart=await cartModel.findById(cartId)
          if (userIdbytoken !== findUserFromCart.userId.toString()) return res.status(403).send({ status: false, message: "not authorized to update this cart" })
   
           let findProduct = await productModel.findOne({ _id: productId, isDeleted: false })
          const newTotalPrice = (existCart.totalPrice) + ((findProduct.price) * 1)
          let flag = 0;
          const items = existCart.items
          for (let i = 0; i < items.length; i++) {
              if (items[i].productId.toString() === productId) {
                  console.log("productIds are similar")
                  items[i].quantity = items[i].quantity + 1
                  var newCartData = {
                      items: items,
                      totalPrice: newTotalPrice,
                      quantity: 1
                  }
                  flag = 1
                  const saveData = await cartModel.findOneAndUpdate(
                      { userId: userIdByparam },
                      newCartData, { new: true }).populate({
                          path: 'items.productId',
                          select:
                              'title price productImage -_id ',
                      });
                  return res.status(201).send({
                      status: true,
                      message: "product added to the cart successfully", data: saveData
                  })
              }
          }
          if (flag === 0) {
              console.log("productIds are not similar")
              let addItems = {
                  productId: productId,
                  quantity: 1
              }
              const saveData = await cartModel.findOneAndUpdate(
                  { userId: userIdByparam },
                  { $addToSet: { items: addItems }, $inc: { totalItems: 1, totalPrice: ((findProduct.price) * 1) } },
                  { new: true, upsert: true })
              return res.status(201).send({ status: true, message: "product added to the cart successfully", data: saveData })
          }
      }
  } catch (error) {
      return res.status(500).send({ status: false, message: error.message });
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
      return res.status(400).send({ status: false, message: "Cart is already empty" });
  }
      await cartModel.updateOne({ _id: findCart._id },
      { items: [], totalPrice: 0, totalItems: 0 });
  return res.status(200).send({ status: false, message: "Deleted Successfully"});

} catch (error) {
  return res.status(500).send({ status: false, message: error.message });
}
}






module.exports ={deleteCart,getCart,CreateCart , updateCart}