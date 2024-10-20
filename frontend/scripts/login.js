import { home } from "./urls.js";
import { setKey } from "./key.js";

const email = document.getElementById('email');
const password = document.getElementById('password');
const logIn = document.getElementById('logIn');
const form = document.getElementById('form');


form.addEventListener('submit', async (event) => {
    event.preventDefault();    // Prevent the form from sending to backend

    const user_email = email.value;
    email.value = '';

    const user_password = password.value;
    password.value = '';

    const flashLogin = document.getElementById('flashLogin');
    flashLogin.style.display = 'none'

    const user = JSON.stringify({
        email: user_email,
        password: user_password,
    });

    
    const request = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: user
    });

    const response = await request.json();

    if (response.status == 201) {
        setKey(response.key);
        localStorage.setItem('current_user', response.id);
        location.replace(home)
    } else {
        flashLogin.style.display = 'block';
    }
})


document.addEventListener('DOMContentLoaded', () => {
    const flash = document.getElementById('flash');
    if (localStorage.getItem('login')) {
        flash.style.display = 'block';
    } else {
        flash.style.display = 'none';
    }
    localStorage.removeItem('login');
})