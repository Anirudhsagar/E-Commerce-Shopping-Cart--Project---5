const getCart =async function (req,res){
    try{
        let Id =req.params.userId
        if (!Id) return res.status(400).send({ status: false, message: "id must be present in params" })
        if (!mongoose.isValidObjectId(Id)) return res.status(400).send({ status: false, message: "invalid Id" })
         
       
        let checkUserId = await UserModel.findOne({ _id: userId })
        if (!checkUserId) {
            return res.status(404).send({ status: false, message: `User details are not found with this userId ${userId}` })
        }

        if (req.decodedToken != userId)
        return res.status(403).send({ status: false, message: "Error, authorization failed" });

        let getData = await CartModel.findOne({ userId });
        if (getData.items.length == 0)
            return res.status(400).send({ status: false, message: "No items present" });

        if (!getData) {
            return res.status(404).send({ status: false, message: `Cart does not Exist with this userId :${userId}` })
        }

        res.status(200).send({ status: true, message: 'Success', data: getData })


    }catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

const deleteCart =async function (req,res){
    try{
        let  Id =req.params.userId

        if (!Id) return res.status(400).send({ status: false, message: "id must be present in params" })
        if (!mongoose.isValidObjectId(Id)) return res.status(400).send({ status: false, message: "invalid Id" })


        const userSearch = await UserModel.findById({ _id: userId })
        if (!userSearch) {
            return res.status(404).send({ status: false, message: `User details are not found with this userId ${userId}` })
        }

        // AUTHORISATION
        if (req.decodedToken != userId)
            return res.status(403).send({ status: false, message: "Error, authorization failed" })

        // To check cart is present or not
        const cartSearch = await CartModel.findOne({ userId })
        if (!cartSearch) {
            return res.status(404).send({ status: false, message: "Cart details are not found " })
        }

        const cartDelete = await CartModel.findOneAndUpdate({ userId }, { $set: { items: [], totalItems: 0, totalPrice: 0 } }, { new: true })
        return res.status(204).send({ status: true, message: 'Success', data: "Cart is deleted successfully" })

    }catch(err){
        return res.status(500).send({status:false,message:err.message})
    }
}

module.exports ={deleteCart,getCart}