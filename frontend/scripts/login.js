import { home } from "./urls.js";    // index.hml
import { setKey } from "./key.js";   // set user's key for auth


// Select the form and add event on submitting
const form = document.getElementById('form');
form.addEventListener('submit', async (event) => {
    
    // Prevent the form from sending to backend
    event.preventDefault();    

    // get the email and password field
    const email = document.getElementById('email');
    const password = document.getElementById('password');

    // store the email in a variable and empty the email field
    const user_email = email.value;
    email.value = '';

    // store the password in a variable and empty the password field
    const user_password = password.value;
    password.value = '';

    // select login message in case the wrong email or password entered
    const flashLogin = document.getElementById('flashLogin');
    flashLogin.style.display = 'none'

    // store email and password in Json opject
    const user = JSON.stringify({
        email: user_email,
        password: user_password,
    });

    // end the Json object to backend and check if user existed
    const request = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: user
    });

    // suscess {message, status, key, uerid}
    const response = await request.json();

    // login successful store key in localstorage for authentication
    // redirect user to home page "index.html"
    if (response.status == 201) {
        setKey(response.key);
        localStorage.setItem('current_user', response.id);
        location.replace(home)
    } else {
        // login unsuccessfull dispaly login wrong message
        flashLogin.style.display = 'block';
    }
})


document.addEventListener('DOMContentLoaded', () => {
    // if user registered and redicrected to login page 
    // show him a successful registeration message
    // by cheking if local storage has a login variable
    const flash = document.getElementById('flash');
    flash.style.display = 'none';
    if (localStorage.getItem('login')) {
        flash.style.display = 'block';
    } else {
        flash.style.display = 'none';
    }

    localStorage.removeItem('login');
})