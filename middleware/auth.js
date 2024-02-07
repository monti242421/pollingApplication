
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { use } = require('../routes/user');

exports.authenticate = async (req,res,next)=>{
    try{
        const token = req.header('Authorization')
        //console.log(token);
        const user = jwt.verify(token,process.env.TOKEN_SECRET);
        result = await User.findByPk(user.userId)
        req.user = result;
        next();
    }catch(err){
        console.log(err);
        return res.status(401).json({success:false,"from middle ware":"sd" });
    }
}
