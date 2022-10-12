
const jwt =require('jsonwebtoken')

const authentication = async function(req,res,next){
   try {
    let token = req.headers["authorization"]
    if(!token) {return res.status(401).send({msg:"required token "}) }
    let splitToken = token.split(' ') //converting into array
        // decoding token  
    jwt.verify(splitToken[1],"Project5-group4"
    ,(err,decoded)=>{
        if(err){
        return res
        .status(401)
        .send({ status: false, message:err.message });
    } else {
      req.decoded = decoded;
      next();
    }
    })
   } catch (error) {
    res.status(500).send({status:false,message:err.message})
   }
}

const authorization = async function(req,res,next){
    let userId = req.params.userId
    let decoded = req.decoded.userId
    if(userId !== decoded){return res.status(403).send({status:false,msg:"you are not authorized"})}
    next()
}

module.exports ={authentication,authorization}

