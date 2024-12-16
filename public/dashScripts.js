const createAccountButton = document.querySelector("#create-account-button");
const loginAccountButton = document.querySelector("#login-account-button");
const loginCreateDiv = document.querySelector("#login-create-div");

const registerUsernameInput = document.querySelector("#register-username-input");
const registerPasswordInput = document.querySelector("#register-password-input");

const loginUsernameInput = document.querySelector("#login-username-input");
const loginPasswordInput = document.querySelector("#login-password-input");

let registerButton;
let loginButton;



function clearInnerHTML(element){
    element.innerHTML = "";
}

function hasForbiddenChars(string) {
    const forbiddenPattern = /[\s!@#$%^&*()\-=+|\\[\]{}:;'"/?><.,]/;
    return forbiddenPattern.test(string);
}

createAccountButton.addEventListener("click", (e) => {
    console.log("create");
    clearInnerHTML(loginCreateDiv);
    loginCreateDiv.innerHTML = 
    `   
        <h3 id="warning"></h3>
        <h2>Username</h2>
        <input type="text" id="register-username-input" placeholder="Create a username">
        <h2>Password</h2>
        <input type="password" id="register-password-input" placeholder="Create a password">
        </br><button id="register-button">Register</button>
    `;
    registerButton = document.querySelector("#register-button");
    loginButton = document.querySelector("#login-button");

    registerButton.addEventListener("click", async (e) =>{
        let usernameText = document.querySelector("#register-username-input").value;
        let passwordText = document.querySelector("#register-password-input").value;
        document.querySelector("#warning").innerText = "";

        if(hasForbiddenChars(usernameText)){
            document.querySelector("#warning").innerText += "\nUsername contains forbidden chars!";
            return;
        }
        if(passwordText.length < 5){
            document.querySelector("#warning").innerText += "\nPassword is too short!";
            return;
        }
        const userData = {
            username: usernameText,
            password: passwordText
        };
        try{
            const response = await fetch("/users/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData)
            });
            if(response.ok){
                const result = await response.json();
                document.querySelector("#warning").innerText = "User Created Successfully.";
                console.log(result);
                document.location.href="/";
            }
            else{
                const errorTxt = await response.text();
                document.querySelector("#warning").innerText = "Error: " + errorTxt;
            }
        }
        catch(error){
            document.querySelector("#warning").innerText = "Error: " + error.message;
        }
    });
});
//#register-username-input and #register-password-input

loginAccountButton.addEventListener("click", (e) => {
    console.log("login");
    clearInnerHTML(loginCreateDiv);
    loginCreateDiv.innerHTML = 
    `
        <h3 id="warning"></h3>
        <h2>Username</h2>
        <input type="text" id="login-username-input" placeholder="Enter your username">
        <h2>Password</h2>
        <input type="text" id="login-password-input" placeholder="Enter your pasword">
        </br><button id="login-dash-button">Login</button>
    `;
    document.querySelector("#warning").innerText = "";
    document.querySelector("#login-dash-button").addEventListener("click", async (e) =>{
        const username = document.querySelector("#login-username-input").value;
        const password = document.querySelector("#login-password-input").value;
        
        const response = await fetch("/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        if(response.ok){
            document.querySelector("#warning").innerText = "Login successful";
            const data = await response.json();
            console.log(data);
            document.location.href="/";
        }
        else{
            document.querySelector("#warning").innerText = "Failed to login.";
            console.log("Login failed");
        }
    });
});
//#login-username-input and #login-password-input

document.querySelector("#home-button").addEventListener("click", (e) =>{
    document.location.href="/";
});

//If authenticated, show the user dashboard
window.addEventListener('load', (e)=>{
    console.log(document.cookie);
    fetch('/users/check-auth')
        .then(response => response.json())
        .then(data => {
            if(data.authenticated){
                loginCreateDiv.innerHTML = 
                `
                <h2>My Account</h2>
                <h3>Username: ${data.username}</h3>
                <button id="logout-button">Logout</button>
                `;
                document.querySelector("#logout-button").addEventListener("click", (e)=>{
                    fetch('users/logout', { method: 'POST' })
                        .then(response => response.json())
                        .then(data => {
                            if(!data.authenticated){
                                location.reload();
                            }
                        })
                });
            }
        });
});