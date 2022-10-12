const productModels =require('../models/productModel')
const validator = require("../validations/validator")

const createProduct = async function(req ,res){
    try{

let data= req.body
let {title,description ,price ,currencyId ,productImage} = data
if(!validator.isValid(data)){
    return res.status(400).send({status:false ,msg:"body is empty"})
}


let allproduct = await productModels.create(data)


    }
    catch(err) { return  res.status(500).send({status:fasle , msg: err.message})
    }
}

module.exports={createProduct}