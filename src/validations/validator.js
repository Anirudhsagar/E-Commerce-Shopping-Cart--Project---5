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
  
module.exports = {isValid,isValidBody,isValidPassword,isValidObjectId,isValidPincode,isValidPhone,isValidEmail,isvalidCity,isValidString,objectid}



