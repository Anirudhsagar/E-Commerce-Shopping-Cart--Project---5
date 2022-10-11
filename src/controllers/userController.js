const { emit } = require("../models/userModel")
const userModel = require("../models/userModel")
const {
    isValid,
    phoneNumber,
    isValidEmail,
    isValidPincode,
    checkPassword,
    checkname,

} = require('../validations/validator')
const objectid = /^[0-9a-fA-F]{24}$/

const createUser = async function (req, res) {
    try {
        let data = req.body
        let address=data.address
        let requirefield = ["fname", "lname", "email", "phone", "password", "profileImage"]
        let err = []
        for (field of requirefield) {
            if (!data.hasOwnProperty(field)) {
                err.push(`${field} is mandotry in requwest body`)
                continue

            }
            if (!isValid(data[field])) {
                if (field === "phone") {
                    err.push(`value of ${field} must be String and conatai something`);
                    continue
                }
            }
            if (!isValid(data[field])) {

                err.push(`value of ${field} must be String and conatai something`);
                continue
            }

            if (field == 'fname') {
                if (!checkname(data.fname)) {
                    err.push("fname is invalid")
                    continue
                }
            }
            if (field == 'lname') {
                if (!checkname(data.lname)) {
                    err.push("lname is invalid")
                    continue
                }
            }
            if (field == "phone") {
                if (!phoneNumber(data.phone)) {
                    err.push("invalid phone number")
                }
            }
            if (field == 'password') {
                if (!checkPassword(data.password)) {
                    err.push(" password is invalid")
                }
            }
            if (field == "email") {
                if (!isValidEmail(data[field])) {
                    err.push("email is invalid");
                    continue

                }
            }
        }
       // address = JSON.parse(address)
        if (address) {
            if (typeof address != "object") return res.status(400).send({ status: false, message: "address is in incorrect format" })

            //*SHIPPING*    
            if (address.shipping) {
                if (address.shipping.street) {
                    if (!isValid(address.shipping.street)) return res.status(400).send({ status: false, message: "shipping street is in incorrect format" })
                } else return res.status(400).send({ status: false, message: "address.shipping.street is required" })

                if (address.shipping.city) {
                    if (!isValid(address.shipping.city)) return res.status(400).send({ status: false, message: "shipping city is in incorrect format" })
                } else return res.status(400).send({ status: false, message: "address.shipping.city is required" })

                if (address.shipping.pincode) {
                    if (typeof address.shipping.pincode != "number") return res.status(400).send({ status: false, message: "shipping pincode is in incorrect format" })
                    if (!isValidPincode(address.shipping.pincode)) return res.status(400).send({ status: false, message: "Pincode should be 6 characters long" })
                } else return res.status(400).send({ status: false, message: "address.shipping.pincode is required" })

            } else return res.status(400).send({ status: false, message: "address.shipping is required" })




            if (address.billing) {
                if (address.billing.street) {
                    if (!isValid(address.billing.street)) return res.status(400).send({ status: false, message: "billing street is in incorrect format" })
                } else return res.status(400).send({ status: false, message: "address.billing.street is required" })

                if (address.billing.city) {
                    if (!isValid(address.billing.city)) return res.status(400).send({ status: false, message: "billing city is in incorrect format" })
                } else return res.status(400).send({ status: false, message: "address.billing.city is required" })


                if (address.billing.pincode) {
                    if (typeof address.billing.pincode != "number") return res.status(400).send({ status: false, message: "billing pincode is in incorrect format" })
                    if (!isValidPincode(address.billing.pincode)) return res.status(400).send({ status: false, message: "Pincode should be 6 characters long" })
                }

                else return res.status(400).send({ status: false, message: "address.billing.pincode is required" })

            } else return res.status(400).send({ status: false, message: "address.billing is required" })

        } else return res.status(400).send({ status: false, message: "address is required" })


        
        

        let checkimail = await userModel.findOne({ email: data.email })
        if (checkimail) {
            err.push("email is already register")
        }

        let checkphone = await userModel.findOne({ phone: data.phone })
        if (checkphone) {
            err.push("phone  is already register")
        }

        //==========================================================
        // if(field=='profileImage'){
        // let options = {
        //     method: 'get',
        //     url: `${data.longUrl}`
        // }
        // let verifyUrl = await axios(options)
        //     .then(() => data.longUrl)
        //     .catch(() => null)

        // if (!verifyUrl) {
        //     return res.status(400).send({ status: false, msg: `This Link ${data.longUrl}, is not valid url.` })
        // }}
        //=============================================================

        if (err.length > 0) {
            return res.status(400).send({ status: false, msg: err.join(",") })
        }



        let createData = await userModel.create(data)
        return res.status(201).send({ status: true, data: createData })
    }
    catch (error) { return res.status(500).send({ status: false, msg: error.message }) }
}

module.exports.createUser = createUser;