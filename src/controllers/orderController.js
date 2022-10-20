
const validator = require("../validations/validator")
const cartModel = require("../models/cartModel")
const userModel = require("../models/userModel")
const orderModel = require("../models/orderModel")
const { isValidBody, isValidObjectId, isValid1 } = require("../validations/validator");

const createOrder = async function (req, res) {
    try {
        let userId = req.params.userId;
        let data = req.body;
        let { cartId, cancellable, status } = data;

        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "Invalid userId" })
        }
        let existUser = await userModel.findById(userId);
        if (!existUser) {
            return res.status(404).send({ status: false, message: "User is not exist or already deleted" })
        }
        if (!isValid1(data)) {
            return res.status(400).send({ status: false, message: "Please give some data to create an order" })
        }
        if (isValidBody(cartId)) {
            return res.status(400).send({ status: false, message: "Please provide cartId" })
        }
        if (!isValidObjectId(cartId)) {
            return res.status(400).send({ status: false, message: "Invalid cartId" })
        }
        let existCart = await cartModel.findOne({ _id: cartId, userId: userId })
        if (!existCart) {
            return res.status(404).send({ status: false, message: "given Cart is not exist for this particuler user" })
        }
        let itemArr = existCart.items
        if (itemArr.length == 0) {
            return res.status(400).send({ status: false, message: "Cart Is empty" })
        }
        let total = 0;
        for (let i of itemArr) {
            total = total + i.quantity
        }
        let orderDetails = {
            userId: userId,
            items: itemArr,
            totalPrice: existCart.totalPrice,
            totalItems: existCart.totalItems,
            totalQuantity: total,

        }
        if (cancellable) {
            if (isValidBody(cancellable)) {
                return res.status(400).send({ status: false, message: "please provide cancelation property " })
            }
            var cancel = cancellable.toString().trim().toLowerCase();
            if (!/^(true|false)$/.test(cancel)) {
                return res.status(400).send({ status: false, message: "cancellable should be a boolean value" })
            }
        }
        orderDetails.cancellable = cancel;
        if (status) {
            if (isValidBody(status)) {
                return res.status(400).send({ status: false, message: "please provide status property" })
            }
            var stat = status.trim().toLowerCase();
            if (!['pending', 'completed', 'cancelled'].includes(stat)) {
                return res.status(400).send({ status: false, message: "Status should be 'pending','completed','cancelled'" })
            }
        }
        orderDetails.status = stat

        let orderCreate = await orderModel.create(orderDetails)
        existCart.items = []
        existCart.totalItems = 0
        existCart.totalPrice = 0
        existCart.save()

        return res.status(201).send({ status: true, message: "Success", data: orderCreate })


    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}




// ================================= Update ===============================


const updateOrder = async function (req, res) {
    try {
        const userId = req.params.userId;
        const data = req.body;
        const { orderId, status } = data;

        
        if (validator.isValidBody(data))
            return res.status(400).send({ status: false, message: "Please provide data in the request body" })

        
        if (!validator.isValidObjectId(userId))
            return res.status(400).send({ status: false, message: `The given userId is not in proper format` });

        
        if (validator.isValidBody(orderId))
            return res.status(400).send({ status: false, message: "OrderId is Required" });
        if (!validator.isValidObjectId(orderId))
            return res.status(400).send({ status: false, message: "The given orderId is not in proper format" });

        

        const findUser = await userModel.findOne({ _id: userId });

        if (!findUser)
            return res.status(404).send({ status: false, message: "User details not found " });

        const findOrder = await orderModel.findOne({ _id: orderId, userId: userId })

        if (!findOrder)
            return res.status(404).send({ status: false, message: "Order details is not found"  })


        if (findOrder.cancellable == true) {
            if (isValidBody(status))
                return res.status(400).send({ status: false, message: "Status is required and the fields will be 'pending', 'completed', 'cancelled' only  " });

            
            let statusIndex = ["pending", "completed", "cancelled"];
            if (statusIndex.indexOf(status) == -1)
                return res.status(400).send({ status: false, message: "Please provide status from these options only ('pending', 'completed' or 'cancelled')" });


            if (status == 'completed') {
                if (findOrder.status == 'pending') {


                    const updateStatus = await orderModel.findOneAndUpdate({ _id: orderId }, { $set: { status: status, isDeleted: true, deletedAt: Date.now() } }, { new: true })

                    return res.status(200).send({ status: true, message: 'Success', data: updateStatus });
                }
                if (findOrder.status == 'completed') {
                    return res.status(400).send({ status: false, message: "Your order is already completed" });
                }
                if (findOrder.status == 'cancelled') {
                    return res.status(400).send({ status: false, message: "Your order is cancelled, so you cannot change the status " });
                }
            }

            if (status == 'cancelled') {
                if (findOrder.status == 'pending') {

                    const updateStatus = await orderModel.findOneAndUpdate({ _id: orderId }, { $set: { status: status, isDeleted: true, deletedAt: Date.now() } }, { new: true })

                    return res.status(200).send({ status: true, message: 'Success', data: updateStatus });
                }
                if (findOrder.status == 'completed') {
                    return res.status(400).send({ status: false, message: "Your order is already completed" });
                }
                if (findOrder.status == 'cancelled') {
                    return res.status(400).send({ status: false, message: "Your order is already cancelled, because it is already cancelled" });
                }
            }
        }

        if (findOrder.cancellable == false) {

            if (!isValid1(status))
                return res.status(400).send({ status: false, message: "Status is required and the fields will be 'pending', 'completed', 'cancelled' only" });

            if (status == 'completed') {
                if (findOrder.status == 'pending') {

                    const updateStatus = await orderModel.findOneAndUpdate({ _id: orderId }, { $set: { status: status, isDeleted: true, deletedAt: Date.now() } }, { new: true })

                    return res.status(200).send({ status: true, message: 'Success', data: updateStatus });
                }
                if (findOrder.status == 'completed') {
                    return res.status(400).send({ status: false, message: "The status is already completed" });
                }
                if (findOrder.status == 'cancelled') {
                    return res.status(400).send({ status: false, message: "The status is cancelled, you cannot change the status" });
                }
            }

            if (status == 'cancelled') {
                return res.status(400).send({ status: false, message: "Cannot be cancelled as it is not cancellable" })
            }
        }

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

}

module.exports.createOrder=createOrder;
module.exports.updateOrder=updateOrder;

