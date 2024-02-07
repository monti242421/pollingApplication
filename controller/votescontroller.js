const { where } = require('sequelize');
const votes = require('../models/votes');
const Sequelize = require('sequelize');


exports.getVotes= async (req,res,next)=>{

    try{
        var result = await votes.findAll({
            
                attributes:['topic','votecount']
        
        });
        res.json({
            result
        })
    }catch(err){
        console.log(err);
    }
            
}