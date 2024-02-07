const { where } = require('sequelize');
const user = require('../models/user')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function isStringInvalid(string){
    if(string ==undefined || string.length===0){
        return true
    }else{
        return false
    }
}


function generateAccessToken (id,username){
    return jwt.sign({userId:id, username:username},process.env.TOKEN_SECRET)
}


exports.addUser= async (req,res,next)=>{
    try{   
    //console.log(req.body)

    if(isStringInvalid(req.body.username) || isStringInvalid(req.body.email)||isStringInvalid(req.body.phonenumber)||isStringInvalid(req.body.password)){
        return res.status(400).json({message:"Bad Parameters, Missing fields"});
    }
    const saltrounds=10;
    bcrypt.hash(req.body.password,saltrounds,async (err,hash)=>{
        try{
        console.log(err);
        await user.create({
            username:req.body.username,
            email:req.body.email,
            phonenumber:req.body.phonenumber,
            password:hash
        })

        res.status(201).json({message:'successfully created new user'});

        }catch(err){
        console.log(err.name)
        if(err.name=='SequelizeUniqueConstraintError')
        res.status(500).json({message:'User already exists'});
        }
        

    })
        
    }
    catch(err){
        console.log(err)
        res.status(500).json(err);
    }


}

exports.login = async (req,res,next)=>{
    try{
        //console.log(req.body)
        if(isStringInvalid(req.body.email)||isStringInvalid(req.body.password)){
            return res.status(400).json({message:"Bad Parameters, Missing Fields"});
        }

        var result = await user.findAll({where:{email:req.body.email}})
        if( result.length>0){
            bcrypt.compare(req.body.password,result[0].dataValues.password,(err,resultPass)=>{
                if(err){
                    throw new Error("Something Went Wrong");
                }
                if(resultPass===true){
                    res.status(201).json({message:"Successfully logged in", token:generateAccessToken(result[0].dataValues.id,result[0].dataValues.username)})
                } else{
                    return res.status(400).json({message: "Incorrect Password"})
                }
            })
        }else{
            return res.status(404).json({message:"User doesnt exist"})
        }
            
        //console.log(result[0].dataValues)
    }catch (err){
        res.status(500).send(err);
    }
}




