const productModels = require('../models/productModel')
const validator = require("../validations/validator")



// -------------------- UPDATE PRODUCT---------------------


const updateProduct = async (req,res) => {
    try {
        let productId = req.params.productId

        //----------- db call for checking Product Id------------------

        let checkProduct = await productModels.find({ _id: productId})
        if (!checkProduct)  { return res.status(404).send({ status: false, message: "product not found" }) }

        let productData = req.body
        let { title, description, price, isFreeShipping, productImage, style, availableSizes } = productData


        //  ---------------------- validation for request body ----------------

        if (Object.keys(productData).length < 1)  { return res.status(400).send({ status: false, message: "Insert Data : BAD REQUEST" }); }


        //  ---------------------- title ----------------------
    
        if (title) {
            if (!validator.isValidName(title))  { return res.status(400).send({ status: false, message: "wrong title" }) }
        }

        // ---------------- description -------------------------

        if (description) {
            if (!validator.isValidName(description))  { return res.status(400).send({ status: false, message: "wrong description" }) }
        }


        // ------------------ price --------------------------

        if (price) {
            if (!validator.isValidNumber(price))  { return res.status(400).send({ status: false, message: "price is missing" }) }
        }

         //--------------------if we want to free shipping-------------------
         if (typeof isFreeShipping != 'undefined') {
            isFreeShipping = isFreeShipping.trim()
            if (!["true", "false"].includes(isFreeShipping)) { return res.status(400).send({ status: false, message: "isFreeShipping is a boolean type only" }) }
        }

        //--------------------if we want to update address-------------------
        if (productImage) {
            if (!validator.isValidProfile(productImage)) { return res.status(400).send({ status: false, message: "productImage is missing" }) }
        }

        //--------------------if we want to style-------------------
        if (style) {
            if (!validator.isValidName(style)) { return res.status(400).send({ status: false, message: "style is missing" }) }
        }

        //--------------------if we want to available sizes-------------------
        if (availableSizes) {
            let size = ["S", "XS", "M", "X", "L", "XXL", "XL"];
            if (!size.includes(availableSizes))
                return res.status(400).send({ status: false, msg: "Invalid size,select from 'S','XS',M','X','L','XXL','XL'" });
        }

        let UpdateProductData = await productModel.findOneAndUpdate({ _id: productId }, productData, { new: true })
        return res.status(201).send({ status: true, message: "product Updated", productData: UpdateProductData })


    } catch (error) {
        
    }
}



module.exports = { updateProduct }