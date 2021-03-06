var moment = require('moment');
var jwt = require('jwt-simple');

function CreateToken(id) {
    var playload = {
        sub: id,
        iat: moment().unix(),
        exp: moment().add(2, "hours").unix(),
    }
    
    return jwt.encode(playload, process.env.SECRET_KEY);
}

 
function ValidateToken(req, res, next) {
    
    if(!req.headers.authorization){
        res.status(403).send({
            message: "Missing Authorization Header"
        })
    }

    var code = req.headers.authorization.split(" ")[0]
    var token = req.headers.authorization.split(" ")[1]

    var playload = jwt.decode(token, process.env.SECRET_KEY);

    if(code != "Bearer"){
        res.status(401).send({
            message: "Invalid request, Missing Bearer"
        })
    }

    if(playload.exp <= moment().unix()){
        res.status(401).send({
            message: "Token expired"
        })
    }

    next();
}

module.exports.CreateToken = CreateToken;
module.exports.ValidateToken = ValidateToken;