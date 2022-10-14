const mongoose = require('mongoose');

const isValid = (value) => {
  if (typeof value === "undefined" || typeof value === "null") return true;
  if (typeof value === "string" && value.trim().length === 0) return true;
  if (typeof value === "object" && Object.keys(value).length === 0) return true;
  return false;
}

const isValidBody = (reqBody) => {
  return Object.keys(reqBody).length === 0;
}
const isValid1 = (value) => {
  if (typeof value === "undefined" || typeof value === "null") return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
 return true
}

const isValidName = function (name) {
  const nameRegex = /^[a-zA-Z ]{2,30}$/
  return nameRegex.test(name)
}



const isValidNumber = function (number) {
  var re = /^\d{0,8}[.]?\d{1,4}$/;
  return re.test(number);
}


const isValidPassword = (password) => {
    if (password.length > 7 && password.length < 16) return true
}

const isValidPhone = (Mobile) => {
    return /^[6-9]\d{9}$/.test(Mobile)
  };
  
  const isValidEmail = (Email) => {
    return  /^([A-Za-z0-9._]{3,}@[A-Za-z]{3,}[.]{1}[A-Za-z.]{2,6})+$/.test(Email)
  };
  
const isValidPincode = (num) => {
    return  /^[0-9]{6}$/.test(num);
   }
 
const isValidObjectId = (objectId) => {
    return mongoose.isValidObjectId(objectId)
    
}

const objectid = /^[0-9a-fA-F]{24}$/


const isValidString = (String) => {
    return /\d/.test(String)
  }
const isvalidCity = function (city){
    return /^[a-zA-z',.\s-]{1,25}$/.test(city)
  }
  const isValidFiles= (reqBody) =>{
    if(files && files.length>0){
      return true
    }
  }

  const isValidProfile = function (profile) {
    const profileRegex = /[^\\s]+(.*?)\\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/
    return profileRegex.test(profile)
}

  const isValidPrice = (price) => {
    return /^[1-9]\d{0,7}(?:\.\d{1,2})?$/.test(price);
  }
  const isValidSize = (sizes) => {
    return ['S', 'XS', 'M', 'X', 'L', 'XXL', 'XL'].includes(sizes);
  }
  
module.exports = {isValid,isValidBody,isValidPassword,isValidObjectId,isValidPincode, isValidName ,  isValidProfile  , isValidNumber   ,   isValidFiles  ,isValidPhone,     isValidEmail,   isvalidCity   ,isValidString,objectid,isValid1 ,isValidPrice,isValidSize}



