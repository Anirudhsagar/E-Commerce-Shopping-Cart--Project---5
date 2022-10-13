const productModels = require('../models/productModel')
const validator = require("../validations/validator")

const createProduct = async function (req, res) {
    try {

        let data = req.body
        let files = req.files

        if (!validator.isValid(data)) {
            return res.status(400).send({ status: false, msg: "body is empty" })
        }

        if (!validator.isValid)

            let { title, description, price, currencyId, currencyFormat, productImage, isFreeShipping, } = data

        // i
        const titlepresent = await productModels.findOne({ title: title })
        if (validator.isValid1(titlepresent)) {
            return res.status(400).send({ status: false, msg: "title is already exist" })

        }
        if (!description) {
            return res.status(400).send({ status: false, msg: "description is mandetory" })
        }
        if (validator.isValid1(description)) {
            return res.status(400).send({ status: false, msg: "description is plz provide valid" })
        }
        if (!price) {
            return res.status(400).send({ status: false, msg: "price is mandetory" })
        }


        if (validator.isValid1(price)) {
            return res.status(400).send({ status: false, msg: "description is plz provide valid" })
        }
        // regex for price
        if (!currencyId) {
            return res.status(400).send({ status: false, msg: "currencyId is mandetory" })
        }
        if (validator.isValid1(currencyId)) {
            return res.status(400).send({ status: false, msg: "currencyId is plz provide valid" })
        }
        //regex for  curencyId

        //productImage

        if(!productImage){
            return res.status(400).send({status:false ,msg:"productImage is mandetory"})
        }
        if(validator.isValid1(productImage)){
            return res.status(400).send({status:false ,msg:"currencyId is plz provide valid"})
        }

    }



let allproduct = await productModels.create(data)


}
    catch (err) {
    return res.status(500).send({ status: fasle, msg: err.message })
}
}

module.exports = { createProduct }