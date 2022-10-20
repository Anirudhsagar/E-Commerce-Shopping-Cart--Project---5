
const OrderModel = require('../models/orderModel.js');
const UserModel = require('../models/userModel.js');
const CartModel = require('../models/cartModel.js')

const { isValidObjectId } = require('mongoose');
const validator = require("../validations/validator")


const updateOrder = async function (req, res) {
    try {
        const userId = req.params.userId;
        const data = req.body;
        const { orderId, status } = data;

        
        if (!validator.isValidBody(data))
            return res.status(400).send({ status: false, message: "Please provide data in the request body" })

        
        if (!validator.isValidObjectId(userId))
            return res.status(400).send({ status: false, message: `The given userId is not in proper format` });

        
        if (!validator.isValidBody(orderId))
            return res.status(400).send({ status: false, message: "OrderId is Required" });
        if (!validator.isValidObjectId(orderId))
            return res.status(400).send({ status: false, message: "The given orderId is not in proper format" });

        
        const findUser = await UserModel.findOne({ _id: userId });
        if (!findUser)
            return res.status(404).send({ status: false, message: "User details not found " });


        
        const findOrder = await OrderModel.findOne({ _id: orderId, userId: userId })
        if (!findOrder)
            return res.status(404).send({ status: false, message: "Order details is not found"  })


        if (findOrder.cancellable == true) {
            if (!isValidBody(status))
                return res.status(400).send({ status: false, message: "Status is required and the fields will be 'pending', 'completed', 'cancelled' only  " });

            
            let statusIndex = ["pending", "completed", "cancelled"];
            if (statusIndex.indexOf(status) == -1)
                return res.status(400).send({ status: false, message: "Please provide status from these options only ('pending', 'completed' or 'cancelled')" });


            if (status == 'completed') {
                if (findOrder.status == 'pending') {
                    const updateStatus = await OrderModel.findOneAndUpdate({ _id: orderId }, { $set: { status: status, isDeleted: true, deletedAt: Date.now() } }, { new: true })
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
                    const updateStatus = await OrderModel.findOneAndUpdate({ _id: orderId }, { $set: { status: status, isDeleted: true, deletedAt: Date.now() } }, { new: true })
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

            if (!isValid(status))
                return res.status(400).send({ status: false, message: "Status is required and the fields will be 'pending', 'completed', 'cancelled' only" });

            if (status == 'completed') {
                if (findOrder.status == 'pending') {
                    const updateStatus = await OrderModel.findOneAndUpdate({ _id: orderId }, { $set: { status: status, isDeleted: true, deletedAt: Date.now() } }, { new: true })
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