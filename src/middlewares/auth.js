if (data.address.hasOwnProperty("billing")) {
    if(typeof data.address.billing!=="object"){
        err.push(`is billing is must be object`)

    }
    let requirebilling= ["street", "city", "pincode"]
    for (billfield of requirebilling) {
        if (!data.address.billing.hasOwnProperty(billfield)) {
            err.push(` shipping ${shippfield} is reuire`)
            continue;
        }
        if(isValid(data.address.billing[billfield])){
            err.push(`${shippfield} is impty`)
            continue
        }
        if(billfield==="pincode"){
            if(!isValidPincode(data.address.billing.pincode)){
                err.push("pincode is invalid")
                continue
            }
        }
}
}