const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    currencyId: {
        type: String,
        required: true,
        default:"INR"
    },
    currencyFormat: {
        type: String,
        default: '₹',
        required: true
    },
    isFreeShipping: {
        type: Boolean,
        default: false,
    },
    productImage: {
        type: String,
        required: true
    },
    style: {
        type: String,
        trim:true
    },
    availableSizes: {
        type: [String],
        required:true,
        enum: ["S", "XS", "M", "X", "L", "XXL", "XL"],
        trim:true
        
    },
    installments: {
        type: Number
    },
    deletedAt: {
        type: Date
        
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});

module.exports = mongoose.model('Product', productSchema)