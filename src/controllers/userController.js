
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt');
const aws = require('../AWS/aws')
const validator = require("../validations/validator")
let objectid = validator.objectid
// ====================================================
const createUser = async (req, res) => {
    try {
        let data = req.body;
        let files = req.files;

        let { fname, lname, email, password, phone, address } = data;

        if (validator.isValidBody(data)) return res.status(400).send({ status: false, message: "Enter details to create your account" });

        //validating firstName
        if (!fname) return res.status(400).send({ status: false, message: "First name is required" });

        //checking for firstName
        if (validator.isValid(fname)) return res.status(400).send({ status: false, message: "First name should not be an empty string" });

        //validating firstName
        if (validator.isValidString(fname)) return res.status(400).send({ status: false, message: "Enter a valid First name and should not contains numbers" });

        //validating lastName
        if (!lname) return res.status(400).send({ status: false, message: "Last name is required" })

        //checking for lastName
        if (validator.isValid(lname)) return res.status(400).send({ status: false, message: "Last name should not be an empty string" });

        //validating lastName
        if (validator.isValidString(lname)) return res.status(400).send({ status: false, message: "Enter a valid Last name and should not contains numbers" });


        //checking for email-id
        if (!email) return res.status(400).send({ status: false, message: "User Email-id is required" });

        //validating user email-id
        if (!validator.isValidEmail(email.trim())) return res.status(400).send({ status: false, message: "Please Enter a valid Email-id" });


        //checking if email already exist or not
        let duplicateEmail = await userModel.findOne({ email: email })
        if (duplicateEmail) return res.status(400).send({ status: false, message: "Email already exist" })


        //checking for phone number
        if (!phone) return res.status(400).send({ status: false, message: "User Phone number is required" });

        //validating user phone
        if (!validator.isValidPhone(phone.trim())) return res.status(400).send({ status: false, message: "Please Enter a valid Phone number" });

        //checking if phone already exist or not
        let duplicatePhone = await userModel.findOne({ phone: phone })
        if (duplicatePhone) return res.status(400).send({ status: false, message: "Phone already exist" })


        //checking for password
        if (!password) return res.status(400).send({ status: false, message: "Password is required" });

        //validating user password
        if (!validator.isValidPassword(password)) return res.status(400).send({ status: false, message: "Password should be between 8 and 15 character and it should be alpha numeric" });

        //checking for address
        if (!address || validator.isValid(data.address))
            return res.status(400).send({ status: false, message: "Address is required" });

        data.address = JSON.parse(data.address);


        let { shipping, billing } = data.address;
        //validating the address 
        if (data.address && typeof data.address != "object") {
            return res.status(400).send({ status: false, message: "Address is in wrong format" })
        };


        if (shipping) {
            //validation for shipping address
            if (typeof shipping != "object") {
                return res.status(400).send({ status: false, message: "Shipping Address is in wrong format" })
            };
            if (!shipping.street || validator.isValid(shipping.street)) {
                return res.status(400).send({ status: false, message: "Street is required" })
            }
            if (shipping.street && typeof shipping.street !== 'string') {
                return res.status(400).send({ status: false, message: "Street is in wrong format" })
            };
            if (!shipping.city || validator.isValid(shipping.city)) {
                return res.status(400).send({ status: false, message: "City is required" })
            }
            if (shipping.city && typeof shipping.city !== 'string') {
                return res.status(400).send({ status: false, message: "City is in wrong format" })
            };
            if (!validator.isvalidCity(shipping.city)) {
                return res.status(400).send({ status: false, message: "City name should only contain alphabets." });
            }
            if (!shipping.pincode) {
                return res.status(400).send({ status: false, message: "Pincode is required" })
            }
            if (validator.isValid(shipping.pincode)) {
                return res.status(400).send({ status: false, message: "Pincode is in wrong format" })
            };
            if (!validator.isValidPincode(shipping.pincode)) {
                return res.status(400).send({ status: false, message: "Please Provide valid Pincode " })
            };
        } else {
            return res.status(400).send({ status: false, message: "Shipping address is required" })
        }

        //validation for billing address
        if (billing) {
            if (typeof billing !== "object") {
                return res.status(400).send({ status: false, message: "billing Address is in wrong format" })
            };
            if (!billing.street || validator.isValid(billing.street)) {
                return res.status(400).send({ status: false, message: "Street is required" })
            }
            if (billing.street && typeof billing.street != 'string') {
                return res.status(400).send({ status: false, message: "Street is in wrong format" })
            };
            if (!billing.city || validator.isValid(billing.city)) {
                return res.status(400).send({ status: false, message: "City is required" })
            }
            if (billing.city && typeof billing.city != 'string') {
                return res.status(400).send({ status: false, message: "City is in wrong format" })
            };
            if (!validator.isvalidCity(billing.city)) {
                return res.status(400).send({ status: false, message: "City name should only contain alphabets." });
            }
            if (!billing.pincode) {
                return res.status(400).send({ status: false, message: "Pincode is required" })
            }
            if (validator.isValid(billing.pincode)) {
                return res.status(400).send({ status: false, message: "Pincode is in wrong format" })
            };
            if (!validator.isValidPincode(billing.pincode)) {
                return res.status(400).send({ status: false, message: "Please Provide valid Pincode " })
            };
        } else {
            return res.status(400).send({ status: false, message: "billing address is required" })
        }
        // let checkEmail = await userModel.findOne({ email: data.email })
        // if (checkEmail) {
        //     err.push("email is already register")
        // }

        // let checkPhone = await userModel.findOne({ phone: data.phone })
        // if (checkPhone) {
        //     err.push("phone  is already register")
        // }

        

        // if (err.length > 0) {
        //     return res.status(400).send({ status: false, msg: err.join(",") })
        // }

        const hashPassword = await bcrypt.hash(password, 10);   
        req.body.password = hashPassword

    //  ===  ==================AWS==========================

    if (files.length==0) {
        return res.status(400).send({ status: false, msg: "productImage is mandatory" })
    }
if(files.length>0){
    let profileImgUrl = await aws.uploadFile(files[0])
    data.profileImage = profileImgUrl
}

      //=====================================

        let createData = await userModel.create(data)
        return res.status(201).send({ status: true, data: createData })
    }
    catch (error) { return res.status(500).send({ status: false, msg: error.message})}
}
//==========================================================================

const login = async function (req, res) {
    try {
        const data = req.body
        const { email, password } = data
        //console.log(data)
        if (!email || !password)
            res.status(400).send({ status: false, message: "Credential must be present" })

        console.log(password)




        let user = await userModel.findOne({ email: email })


        if (!user) {
            return res.status(400).send({ status: false, message: "email is not correct" })
        }




        const matchPass = await bcrypt.compare(password, user.password);
        console.log(matchPass)


        if (!matchPass) {
            return res.status(400).send({ status: false, message: "You Entered Wrong password" })
        }







        let token = jwt.sign(
            {
                userId: user._id.toString(),
                batch: "plutonium",
                organization: "FunctionUp",
            },
            "Project5-group4",
            {
                expiresIn: '72h'
            }
        );
        const finalData = {};
        finalData.userId = user._id;
        finalData.token = token
        res.status(201).send({ status: true, message: "User login successfully", data:finalData });


    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}



//===========================================================================
const getUser = async function (req, res) {
    try {
        let id = req.params.userId
        if (!id) return res.status(400).send({ status: false, message: "id must be present in params" })
        if (!id.match(objectid)) return res.status(400).send({ status: false, message: "invalid userId" })

        const foundUser = await userModel.findOne({ _id: id })
        if (!foundUser) return res.status(404).send({ status: false, message: "user not found" })

        return res.status(200).send({ status: true, message: "User details", data: foundUser })
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}
//=========================================================================

let updateUser = async function (req, res) {
    try {
        let userId = req.params.userId
        let data = req.body
        let files = req.files;

        let { fname, lname, email, password, phone } = data;
        //validating the request body
        if (validator.isValidBody(data)) return res.status(400).send({ status: false, message: "Enter details to update your account data" });

        if (typeof fname == 'string') {
            //checking for firstName
            if (validator.isValid(fname)) return res.status(400).send({ status: false, message: "First name should not be an empty string" });

            //validating firstName
            if (validator.isValidString(fname)) return res.status(400).send({ status: false, message: "Enter a valid First name and should not contains numbers" });
        }
        if (typeof lname == 'string') {
            //checking for firstName
            if (validator.isValid(lname)) return res.status(400).send({ status: false, message: "Last name should not be an empty string" });

            //validating firstName
            if (validator.isValidString(lname)) return res.status(400).send({ status: false, message: "Enter a valid Last name and should not contains numbers" });
        }
        //validating user email-id
        if (data.email && (!validator.isValidEmail(email))) return res.status(400).send({ status: false, message: "Please Enter a valid Email-id" });

        //checking if email already exist or not
        let duplicateEmail = await userModel.findOne({ email: email })
        if (duplicateEmail) return res.status(400).send({ status: false, message: "Email already exist" }); 

        //validating user phone number


        if (data.phone && (!validator.isValidPhone(phone))) return res.status(400).send({ status: false, message: "Please Enter a valid Phone number" });

        //checking if email already exist or not
        let duplicatePhone = await userModel.findOne({ phone: phone })
        if (duplicatePhone) return res.status(400).send({ status: false, message: "Phone already exist" })

        if (data.password || typeof password == 'string') {
            //validating user password
            if (!validator.isValidPassword(password)) return res.status(400).send({ status: false, message: "Password should be between 8 and 15 character" });

            //hashing password with bcrypt
        const hashPassword = await bcrypt.hash("password", 10);
        req.body.password = hashPassword

        }
        //aws
        if(files.length>0){
            let profileImgUrl = await aws.uploadFile(files[0])
            data.profileImage = profileImgUrl
        }
        if (data.address === "") {
            return res.status(400).send({ status: false, message: "Please enter a valid address" })
        } else if (data.address) {

            if (validator.isValid(data.address)) {
                return res.status(400).send({ status: false, message: "Please provide address field" });
            }
            data.address = JSON.parse(data.address);

            if (typeof data.address !== "object") {
                return res.status(400).send({ status: false, message: "address should be an object" });
            }
            let { shipping, billing } = data.address

            if (shipping) {
                if (typeof shipping != "object") {
                    return res.status(400).send({ status: false, message: "shipping should be an object" });
                }

                if (validator.isValid(shipping.street)) {
                    return res.status(400).send({ status: false, message: "shipping street is required" });
                }

                if (validator.isValid(shipping.city)) {
                    return res.status(400).send({ status: false, message: "shipping city is required" });
                }

                if (!validator.isvalidCity(shipping.city)) {
                    return res.status(400).send({ status: false, message: "city field have to fill by alpha characters" });
                }

                if (validator.isValid(shipping.pincode)) {
                    return res.status(400).send({ status: false, message: "shipping pincode is required" });
                }

                if (!validator.isValidPincode(shipping.pincode)) {
                    return res.status(400).send({ status: false, message: "please enter valid pincode" });
                }

            } else {
                return res.status(400).send({ status: false, message: "Shipping address is required" })
            }
            if (billing) {
                if (typeof billing != "object") {
                    return res.status(400).send({ status: false, message: "billing should be an object" });
                }

                if (validator.isValid(billing.street)) {
                    return res.status(400).send({ status: false, message: "billing street is required" });
                }

                if (validator.isValid(billing.city)) {
                    return res.status(400).send({ status: false, message: "billing city is required" });
                }
                if (!validator.isvalidCity(billing.city)) {
                    return res.status(400).send({ status: false, message: "city field have to fill by alpha characters" });
                }

                if (validator.isValid(billing.pincode)) {
                    return res.status(400).send({ status: false, message: "billing pincode is required" });
                }

                if (!validator.isValidPincode(billing.pincode)) {
                    return res.status(400).send({ status: false, message: "please enter valid billing pincode" });
                }
            } else {
                return res.status(400).send({ status: false, message: "Billing address is required" })
            }
        }
        let userData = await userModel.findOneAndUpdate({ _id: userId }, data, { new: true })
        if (!userData) { return res.status(404).send({ status: false, message: "no user found to update" }) }
        return res.status(200).send({ Status: true, message: "Update user profile is successful", data: userData })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}




//======================================================================

module.exports.createUser = createUser;
module.exports.login = login;
module.exports.getUser = getUser;
module.exports.updateUser=updateUser;

