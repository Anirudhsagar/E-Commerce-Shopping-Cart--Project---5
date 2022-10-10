const express = require('express');
const bodyParser = require('body-parser');
const router = require('../routes/route.js');
const mongoose = require('mongoose');
const app = express();
app.use(bodyParser.json());
 mongoose.connect("",
 {useNewUrlParser: true})
 .then(()=>console.log('Connected to Mongoose'))
 .catch(err => console.log(err));

 app.use("/",router)
 app.listen(process.env.PORT || 3000,function(){
    console.log('Connected to port: '+process.env.PORT || 3000);
 })
 