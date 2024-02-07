
const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app); //all http request will be handled by express
const {Server}= require('socket.io');
const io = new Server(server); // all sockets request will be handled by this



const bodyParser = require('body-parser');
var cors = require('cors');

const jwt = require('jsonwebtoken');
const path = require("path");
const dotenv = require('dotenv')
dotenv.config();

const sequelize = require('./util/database')

app.use(cors());

const userRoute = require('./routes/user');
const chatsRoute = require('./routes/chats');
const votesRoute = require('./routes/votes');

const user = require('./models/user');
const chats = require('./models/chats');
const votes= require('./models/votes');

app.use(bodyParser.json({extended:false}));

user.hasMany(chats);
chats.belongsTo(user);

app.use(userRoute);
app.use(chatsRoute);
app.use(votesRoute);
app.use((req,res)=>{
    console.log(req.url);
    res.sendFile(path.join(__dirname,`public/${req.url}`))
})
sequelize.sync();
//sequelize.sync({force:true});
//app.listen(4000);

io.on('connection',  (socket) => {
    console.log('a user connected',socket.id);
    const token = socket.handshake.auth.token;
    const user = jwt.verify(token,process.env.TOKEN_SECRET);
    //console.log(user);
    socket.on('user-message', async (message)=>{
        try{
            console.log(message +" "+ socket.id);
      
            const chat = await chats.create({
                text:message.chatmessage,
                userId:user.userId,
               
            })
            io.emit('message',chat);
            }
            catch(err)
            {
                console.log(err)
            }
       
    })

    socket.on('user-vote', async(message)=>{
        try{
            console.log(message);
            const uservote = await votes.findOne({where:{topic:message}})
            const updatedvote = await uservote.update({votecount:uservote.votecount+1});
            var myobj = {
                topic: message,   
                vote:updatedvote.votecount
            };
            io.emit('votecount',myobj);

            // this system will work for simpler cases but when the users count increases,
            // data revieve/frame will also increase, to deal with large tons of data, we can make a datastructure
            // to save every vote for that topic and create log also. And then we can request database server every 
            // 2-5 minutes to update the values according to that, it will reduce load on database.  

        }catch(err)
        {
            console.log(err);
        }
    })

    socket.on('delete-message',async(message)=>{
        try{
            console.log(message);
            await chats.destroy({where:{id:message}});
            io.emit('successfullydeleted',message);
        }catch(err){
            console.log(err);
        }
    })
  });


server.listen(4000);