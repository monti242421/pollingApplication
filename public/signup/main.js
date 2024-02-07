var signupForm = document.getElementById("signup");
var username="";
var email="";
var phonenumber="";
var password="";

signupForm.addEventListener('submit',signUp)

async function  signUp(e){
    e.preventDefault();
    username = document.getElementById("username").value;
    email = document.getElementById("email").value;
    phonenumber=document.getElementById("phonenumber").value;
    password = document.getElementById("password").value;

    var myobj = {
        username : username,
        email: email,
        phonenumber:phonenumber,
        password: password
    };
    try{

    var res = await axios.post("http://localhost:4000/user/adduser",myobj)
        alert("SignUpcompleted");
        window.location= '../signin/signin.html';
    }         
    catch(err){
          console.log(err)
          document.getElementById("error").textContent=err.response.data.message;
          //signupForm.appendChild(document.createTextNode(err.response.data.errors[0].message))         
    };
    
}