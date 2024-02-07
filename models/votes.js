const Sequelize = require('sequelize');
const sequelize = require("../util/database");

const Votes = sequelize.define('votes',{
    id:{
        type : Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    topic:{
        type: Sequelize.STRING,
        unique:true
    },
    votecount:{
        type : Sequelize.INTEGER,
        allowNull:false
    }

})

module.exports=Votes;