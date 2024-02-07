const token = localStorage.getItem("token")
const socket = io({auth: {
    token: token
}});

// setting the profile username to the logged in user name
const decodedtoken = parseJwt(token);
document.getElementById("username01").innerHTML = "Profile:  "+ decodedtoken.username ;


// below code works with the live chat functionality
document.getElementById('sendmessage').onclick = async function addmessage(e){
        e.preventDefault();
        const token = localStorage.getItem("token")
        const chatmessage = document.getElementById("chatmessage").value
        const decodedtoken = parseJwt(token);
        var myobj = {
            chatmessage : decodedtoken.username+'- '+chatmessage,
        };
        try {
           
            socket.emit('user-message',myobj,{headers:{"Authorization":token}});
                   
            }         
        catch(err)
            {
                  console.log(err)
            };

            
}

document.getElementById('submitvote').onclick =async function addvote(e){
    e.preventDefault();
    const uservote = document.querySelector("input[type='radio'][name=politicalParty]:checked").value;
    socket.emit('user-vote',uservote,{headers:{"Authorization":token}});
    //alert("Your vote has been successfully submitted");
    //console.log(uservote);
}



function showDataToScreen(data){
   
    var chat = data.text;
    var div =document.createElement("div");
     
    div.className="messages"
    div.id=data.id;
    div.innerHTML=chat;
    if(chat.split('-')[0] == decodedtoken.username){
    var del = document.createElement("button");
    del.className="delete";
    del.appendChild(document.createTextNode("Del"));
    div.appendChild(del);
    }   
    document.getElementById('chatbox').appendChild(div);
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

async function getchats(){
    try{
        const token = localStorage.getItem("token")
        var recentchats = await axios.get("http://localhost:4000/chats/getchat/",{headers:{"Authorization":token}})
        localStorage.setItem("recentchats",JSON.stringify(recentchats.data.result))
        displaychats();
    }catch(err){
        console.log(err);
    }

}


async function displaychats(){
        const recentchats = JSON.parse(localStorage.getItem('recentchats'));
        document.getElementById('chatbox').innerHTML='';
        for( var i=0;i<recentchats.length;i++){
            showDataToScreen(recentchats[recentchats.length-1-i]);
        }
}


async function getvotes(){

    try{

    
        const token = localStorage.getItem("token")
        var votes = await axios.get("http://localhost:4000/votes/getvotes/",{headers:{"Authorization":token}})

        //Displaying votes to user on onloading the page initially

        for(let i=0;i<votes.data.result.length;i++){
            const id="live"+votes.data.result[i].topic;
            document.getElementById(id).innerText = votes.data.result[i].votecount;
        }
        }catch(err){
            console.log(err);
        }

}
window.addEventListener("DOMContentLoaded", getchats,getvotes());


socket.on('message',(message)=>{
                if(mute){

                
                var chat = message.text;
                var div =document.createElement("div");
                div.className="messages"
                div.id=message.id;
                div.innerHTML=chat;
                if(chat.split('-')[0] == decodedtoken.username){
                    var del = document.createElement("button");
                    del.className="delete";
                    del.appendChild(document.createTextNode("Del"));
                    div.appendChild(del);
                } 
                document.getElementById('chatbox').appendChild(div);
                document.getElementById("chatmessage").value='';
                
                const recentchats = JSON.parse(localStorage.getItem('recentchats'));              
                recentchats.unshift(message)
                if(recentchats.length>10){
                    recentchats.pop();
                }
                localStorage.setItem('recentchats',JSON.stringify(recentchats));
            }
})

socket.on('votecount',(message)=>{
    const id="live"+message.topic;
    document.getElementById(id).innerText = message.vote;
    alert(" Your vote has been successfully submitted");
})


function showError(err){
    document.body.innerHTML += `<div style="color:red;"> ${err}</div>`
}

const chatbox = document.getElementById('chatbox');

chatbox.addEventListener('click',deleteMessage);

async function deleteMessage(e){
    if(e.target.classList.contains("delete")){
        try{
        var item = e.target.parentElement;    
        socket.emit('delete-message',item.id,{headers:{"Authorization":token}}); 

        }catch(err){
            console.log(err);
        }
        

    }
}

socket.on('successfullydeleted',(message)=>{
    const item = document.getElementById(message);
    chatbox.removeChild(item);
    
})


const muteButton = document.getElementById('mute');
muteButton.addEventListener('click', muteUnmute);
let mute=true;
async function muteUnmute(){
    if(mute){
        muteButton.innerHTML='Unmute live chat ';
       document.getElementById('sendmessage').setAttribute("disabled", "");
       document.getElementById('livechathead').innerHTML="(muted)"
        mute=false;
    }else{
        muteButton.innerHTML='Mute live chat';
        document.getElementById('sendmessage').removeAttribute("disabled");
        document.getElementById('livechathead').innerHTML=""
        mute=true;
    }
    

}



document.getElementById('showmyhistory').onclick = async function showmyhistory(e){
    e.preventDefault();
    try{
        const token = localStorage.getItem("token")
        const allchats = await axios.get("http://localhost:4000/chats/getmychat/",{headers:{"Authorization":token}})
        document.getElementById('allhistory').innerHTML='';
        for(let i=0;i<allchats.data.result.length;i++){
            displaymychats(allchats.data.result[i]);
        }
    }catch(err){
        console.log(err);
    }
}

function displaymychats(data){
    var chat = data.text;
    var div =document.createElement("div"); 
    div.innerHTML=chat;  
    document.getElementById('allhistory').appendChild(div);
}



