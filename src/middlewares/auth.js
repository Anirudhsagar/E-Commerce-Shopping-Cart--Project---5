const jwt = require('jsonwebtoken')
const validator = require("../validator/validator")
const userModel = require("../model/userModel")
//======================================authentication==============================================================
const authentication = async function (req, res, next) {
    try {
        let token = req.headers["authorization"]
        if (!token) { return res.status(401).send({ msg: "required token " }) }
        let splittoken = token.split(' ') //converting into array
        // decoding token  
        jwt.verify(splittoken[1], "Project-5-shoppingCart-group18"
            , (err, decoded) => {
                if (err) {
                    return res
                        .status(401)
                        .send({ status: false, message: err.message });
                } else {
                    req.decoded = decoded;
                    next();
                }
            })
    } catch (error) {
        res.status(500).send({ status: false, message: err.message })
    }
}
//=========================================authorization===============================================================
const authorization = async function (req, res, next) {
    try {
        let userId = req.params.userId
        if (!validator.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "invalid user Id" })
        }
        const user = await userModel.findById(userId)
        if (!user) {
            return res.status(404).send({ status: false, message: "User Not Found" })
        }
        let decoded = req.decoded.userId
        if (userId !== decoded) { return res.status(403).send({ status: false, msg: "you are not authorized" }) }
        next()
    } catch (error) {
        return res.status(500).send({ status: false, message: err.message })
    }

}

module.exports = { authentication, authorization }