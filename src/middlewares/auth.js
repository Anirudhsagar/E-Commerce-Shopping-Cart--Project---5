const jwt = require('jsonwebtoken');

const authentication = async function (req, res, next) {
    try {

        let token = req.headers["Authorization"] || req.headers["authorization"];

        if (!token) return res.status(401).send({ status: false, message: "Missing authentication token in request" });

        let Bearer = token.split(' ');

        let decodedToken = jwt.verify(Bearer[1], "Project5-group16")    
        req.decodedToken = decodedToken.userId;

        next();

    } catch (error) {
        if (error.message == 'invalid token') return res.status(401).send({ status: false, message: "invalid token" });

        if (error.message == "jwt expired") return res.status(401).send({ status: false, message: "please login one more time, token is expired" });

        if (error.message == "invalid signature") return res.status(401).send({ status: false, message: "invalid signature" });

        return res.status(500).send({ status: false, message: error.message });
    }
};



module.exports = { authentication };