const productModels = require('../models/productModel')
const validator = require("../validations/validator")
const aws = require("../AWS/aws")
const mongoose = require("mongoose");

// ====================== create product =====================

const createProduct = async function (req, res) {
    try {

        let data = req.body
        let files = req.files

        if (validator.isValid(data)) {
            return res.status(400).send({ status: false, msg: "body is empty" })
        }
        let { title, description, price, currencyId, currencyFormat, installments, isFreeShipping, style } = data


        // i
        if (!title) {
            return res.status(400).send({ status: false, msg: "title is mandatory" })


        }
        const titlepresent = await productModels.findOne({ title: title })
        if (titlepresent) {
            return res.status(400).send({ status: false, msg: "title is already exist" })

        }
        if (!description) {
            return res.status(400).send({ status: false, msg: "description is mandetory" })
        }
        if (!validator.isValid1(description)) {
            return res.status(400).send({ status: false, msg: "description is plz provide valid" });
        }
        if (!price) {
            return res.status(400).send({ status: false, msg: "price is mandetory" })
        }





        if (!validator.isValidPrice(price)) {
            return res.status(400).send({ status: false, msg: "please prvide valid price" })
        }
        // regex for price
        if (!currencyId) {

            return res.status(400).send({ status: false, msg: "currencyId is mandetory" })
        }
        if (currencyId !== "INR") {
            return res.status(400).send({ status: false, msg: "plese provide valid currencyId only INR" })
        }
        if (!currencyFormat) {

            return res.status(400).send({ status: false, msg: "currencyFormat is mandetory" })
        }
        if (currencyFormat !== "₹") {

            return res.status(400).send({ status: false, msg: "currencyFormat is invalid" })
        }

        //regex for  curencyId

        //productImage


        // if(!validator.isValid1(productImage)){
        //     return res.status(400).send({status:false ,msg:" productImage is plz provide valid"});
        // }


        if (!data.availableSizes) {

            return res.status(400).send({ status: false, msg: "availableSizes is mandetory" })
        }


        availableSizes = data.availableSizes.split(",")

        for (let i = 0; i < availableSizes.length; i++) {


            if (!["S", "XS", "M", "X", "L", "XXL", "XL"].includes(availableSizes[i])) {

                return res.status(400).send({ status: false, msg: "size note availevel" })
            }
            data.availableSizes = availableSizes

        }

        // if(validator.isValidString(currencyFormat)){
        //     return res.status(400).send({status:false ,msg:"currencyFormat must should be ₹ "})
        // }

        if (installments) {


            if (!Number(installments)) {
                return res.status(400).send({ status: false, msg: "installments ony accept in intiger number " })
            }
        }
        if (isFreeShipping) {


            if (isFreeShipping !== "boolean") {
                return res.status(400).send({ status: false, msg: `isFreeShipping is noly accept true & false ` })
            }
        }

        if (validator.isValidString(style)) {
            return res.status(400).send({ status: false, msg: `please provide corect style ` })
        }



        if (files.length==0) {
            return res.status(400).send({ status: false, msg: "productImage is mandetory" })
        }
if(files.length>0){
        let productImgUrl = await aws.uploadFile(files[0])
        data.productImage = productImgUrl
}


        //=========================================================



        let allproduct = await productModels.create(data)

        return res.status(201).send({ status: true, message: "Success" ,data: allproduct })


    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

// -------------------- GET PRODUCT---------------------


const getProduct = async function(req,res) {
    try{
        let data = req.query
        let filter ={isDeleted:false};
        let{size,name,priceGreaterThan,priceLessThan}= data;
        if(size){
            filter.availableSizes = size
        }
        if(name){
            filter.title = name
        }
        console.log(filter)
        if(priceGreaterThan && priceLessThan){
            let price = {$gt:priceGreaterThan,$lt:priceLessThan}
            filter.price = price
        }
        if(priceGreaterThan && !(priceLessThan)){
            let Price={$gt:priceGreaterThan}
            filter.price= Price
        }
        if(priceLessThan&&!(priceGreaterThan)){
            let Price={$lt:priceLessThan}
            filter.price= Price
        }
        let product = await productModels.find(filter).sort({price:1})
        
        if(product.length == 0) return res.status(404).send({status:false,message:'No such product exist'})
        // finalProduct = product.sort(function (a,b){return a.price.localeCompare(b.price);})
         res.status(200).send({status:true,message:'Success',data:product})
        

    }catch(err) { return res.status(500).send({status: false, message: err.message})}
}

// -------------------- GET PRODUCT------------------------------



const getProductById = async function (req, res) {
    try {
        let id = req.params.productId
        if (!id) return res.status(400).send({ status: false, message: "id must be present in params" })
        if (!mongoose.isValidObjectId(id)) return res.status(400).send({ status: false, message: "invalid productId" })
        const foundProduct = await productModels.findOne({ _id: id})
        if (!foundProduct) return res.status(404).send({ status: false, message: "product not found" })

        return res.status(200).send({ status: true, message: "Success" , data: foundProduct })
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}



// -------------------- UPDATE PRODUCT---------------------


const updateProduct = async (req,res) => {
    try {
        let productId = req.params.productId
        if (!validator.isValidObjectId(productId)){ return res.status(404).send({ status: false, message: "product " }) }

        //----------- db call for checking Product Id------------------

        let checkProduct = await productModels.findOne({ _id: productId})
        if (!checkProduct)  { return res.status(404).send({ status: false, message: "product not found" }) }

        let productData = req.body
        let files = req.files
        let { title, description, price, isFreeShipping, style, availableSizes } = productData


        //  ---------------------- validation for request body ----------------

        if (Object.keys(productData).length < 1)  { return res.status(400).send({ status: false, message: "Insert Data : BAD REQUEST" }); }


        //  ---------------------- title ----------------------
     

        // db call
        if (title) {
            if (!validator.isValid1(title))  { return res.status(400).send({ status: false, message: "wrong title" }) }
        }
        let duplicateTitle =await productModels.findOne({
            title:title
        })
        if (duplicateTitle) 
        // if (duplicateTitle.title.toUpperCase()==title.toUpperCase().trim())
         { return res.status(400).send({ status: false, message: "title is already present" }) }


 
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
       
if(files.length>0){
        let productImgUrl = await aws.uploadFile(files[0])
        data.productImage = productImgUrl
}


        //--------------------if we want to style-------------------
        if (style) {
            if (!validator.isValidName(style)) { return res.status(400).send({ status: false, message: "style is missing" }) }
        }

        //--------------------if we want to available sizes-------------------
        // if (availableSizes) {
        //     let size = ["S", "XS", "M", "X", "L", "XXL", "XL"];
        //     if (!size.includes(availableSizes))
        //         return res.status(400).send({ status: false, msg: "Invalid size,select from 'S','XS',M','X','L','XXL','XL'" });
        // }


if(productData.availableSizes){
        availableSizes = productData.availableSizes.split(",")

        for (let i = 0; i < availableSizes.length; i++) {


            if (!["S", "XS", "M", "X", "L", "XXL", "XL"].includes(availableSizes[i])) {

                return res.status(400).send({ status: false, msg: "size note available" })
            }
            productData.availableSizes = availableSizes

        }
    }


        let UpdateProductData = await productModels.findByIdAndUpdate({ _id: productId }, productData, { new: true })
        return res.status(200).send({ status: true, message: "Update product details is successful", productData: UpdateProductData })


    } catch (error) {
        return res.status(500).send({ status: false, message : error.message })
    }
}



//  ============================= DELETE ================================

const deleteProduct = async function (req, res) {
    try {
        const productId = req.params.productId;

        
        if (!validator.isValidObjectId(productId))
            return res.status(400).send({ status: false, message: "Please provide valid format of productId" });

    
        const deletedProduct = await productModels.findOneAndUpdate({ _id: productId, isDeleted: false }, { isDeleted: true, deletedAt: Date.now() }, { new: true });
        if (!deletedProduct)
            return res.status(404).send({ status: false, message: `No product is found with this Id: ${productId}, or it must be deleted` })

        return res.status(200).send({ status: true, message: "Success", data: "Product is deleted successfully" })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }


}
module.exports = { updateProduct, createProduct,getProductById,getProduct, deleteProduct }