const { where } = require('sequelize');
const chats = require('../models/chats')
const Sequelize = require('sequelize');


    exports.getChat= async (req,res,next)=>{

        try{
            var result = await chats.findAll(
                { 
                    limit: 10 ,
                    order: [[Sequelize.col('id'),'DESC']]
                }
            );
            res.json({
                result
            })
        }catch(err){
            console.log(err);
        }
                
    }