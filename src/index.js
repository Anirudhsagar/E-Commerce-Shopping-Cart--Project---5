const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes/route.js');
const mongoose = require('mongoose');
const multer= require('multer')
const app = express();
app.use( multer().any())

app.use(bodyParser.json());


 mongoose.connect("mongodb+srv://upendra:wvUNUF1FjJ02PCPH@cluster0.b8yrh4n.mongodb.net/group-04",
 {useNewUrlParser: true})

 .then(()=>console.log('Connected to Mongoose'))
 .catch(err => console.log(err));

 app.use("/",router)

 app.listen(process.env.PORT || 3000,function(){
    console.log('Connected to port: '+ (3000 || process.env.PORT));
 })
 