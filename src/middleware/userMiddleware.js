const jwt = require('jsonwebtoken')
const {secreatkey} = require('../config')
const userMiddleWare = async(req,res,next)=>{
    const authHeader = req.headers['authorization'];
    if (! authHeader){
        return res.sendStatus(400).json({
            "error":"token not availables"
        })
    }
    const token = authHeader && authHeader.split(' ')[1];
    const bearerPrefix = authHeader.split(' ')[0];

    if (bearerPrefix !== 'Bearer' || !token) return res.sendStatus(401); // Not a Bearer token
    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403).json({"unauthrorized":"user is not authenticated"});
        req.user = user;
        next();
    });
}

module.exports= {
    userMiddleWare
}