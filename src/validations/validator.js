const isValid = function (value) {
//if(typeof value ==="undefined"|| value===null) return false;
    if (typeof value === "object" && Object.keys(value).length === 0) return false;
    if (typeof value !== "string" || value.trim().length === 0) {
      return false;
    } else {
      return true;
    }
  };
  
  const phoneNumber = function (data) {
    const mobileRegex = /^([9876]{1})([0-9]{9})$/;
    return mobileRegex.test(data);
  };
  
  const isValidEmail = function (data) {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(data);
  };
  
  const isValidPincode = function (data) {
    const pincodeRegex = /^[0-9]{6}$/;
    return pincodeRegex.test(data);
  };
  
  function checkPassword(str) {
    var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,15}$/;
    return re.test(str);
  }
  
  function checkname(str) {
    var nameRegex = /^[A-Z a-z]+$/;
    return nameRegex.test(str);
  }


  const isValidString = (String) => {
    return /\d/.test(String)
  }


  const objectid = /^[0-9a-fA-F]{24}$/
  module.exports = {
    isValid,
    phoneNumber,
    isValidEmail,
    isValidPincode,
    checkPassword,
    checkname,
    isValidString
   
  };