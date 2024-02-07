var signinform = document.getElementById("signin");
var email="";
var password="";

signinform.addEventListener('submit',signin);


async function signin(e){
    e.preventDefault();
    email = document.getElementById("email").value;
    password = document.getElementById("password").value;

    var myobj = {
        email: email,
        password: password
    };
    try{

    var res = await axios.post("http://localhost:4000/user/login",myobj)
    
        
        if(res.status == 201){
            alert("Successfully Logged in");
            localStorage.setItem('token',res.data.token);
            const url ='../index/index.html';
            window.location= url;
        }
        //signinform.appendChild(document.createTextNode(JSON.stringify(res)))
        
    }         
    catch(err){
          console.log(err)
          document.getElementById("error").textContent=err.response.data.message;
          //signinform.appendChild(document.createTextNode(err))         
    };
}

document.getElementById("signup").onclick = function(e){
    window.location= '../signup/signup.html';
}


document.getElementById('forgetpassword').onclick = function(e){
    e.preventDefault();
    forgetpasswordform.removeAttribute("hidden"); 
}

var forgetpasswordform=document.getElementById('forgetpasswordform');
forgetpasswordform.addEventListener('submit',sendmail);

async function sendmail(e){
        e.preventDefault();
        var email = document.getElementById("forgetpasswordemail").value;
        var myobj = {
            email: email,
        };
        try{
    
        var res = await axios.post("http://localhost:4000/password/forgotpassword",myobj)
            console.log(res);  
        }         
        catch(err){
              console.log(err)        
        };
 }









