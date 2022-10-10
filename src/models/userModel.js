const mongoose= require("mongoose")

const userSchema= new mongoose.Schema({
    fname:{
        type: String,
        required:true,
        trim: true
    },
    lname:{
        type: String,
        required:true,
        trim: true
    },
    profileImage:{
        type:String,
        required:true,
        trim: true
        
    },
    email:{
        type:String,
        required:true,
        trim: true,
        unique:true

    },
    phone:{
        type:String,
        required:true,
        trim: true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        trim: true
    },
    address: {
        shipping: {
          street: {type:String,required:true},
          city: {type:String,required:true},
          pincode: {type:Number,required:true}
        },
        billing: {
          street: {type:String,required:true},
          city: {type:String,required:true},
          pincode: {type:Number,required:true}
        }
      }
     
},{ timestamps:true})

module.exports= mongoose.model("user04" ,userSchema)