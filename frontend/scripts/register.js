import { login } from "./urls.js";

function checkPassword(pass1, pass2) {
    if (pass1 === pass2) {
        return true
    } else {
        return false;
    }
}

async function checkEmail(email) {
    const response = await fetch('http://127.0.0.1:5000/check_email', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email })
    })

    const data = await response.json();

    if (data.status == 200) {
        return false;
    }
    else {
        return true;
    }
}

const sendData = async (data, route) => {
    const request = await fetch(`http://127.0.0.1:5000/${route}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    const response = await request.json();

    return response;
    
}


form.addEventListener('submit', async (event) => {
    event.preventDefault();    // Prevent the form from sending to backend

    const form = document.getElementById('form');
    const firstName = document.getElementById('firstName');
    const surname = document.getElementById('surname');
    const email = document.getElementById('email');
    const role = document.getElementById('role');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const signUp = document.getElementById('signUp');

    const user_name = `${firstName.value} ${surname.value}`;
    firstName.value = '';
    surname.value = '';

    const user_email = email.value;
    email.value = '';

    const user_role = role.value;
    role.value = '';

    const passowrd1 = password.value;
    const password2 = confirmPassword.value;

    const user_password = password.value;
    password.value = '';

    confirmPassword.value = '';


    const flashPassword = document.createElement('p');
    flashPassword.setAttribute('id', 'flashPassword');
    flashPassword.setAttribute('class', 'flash danger');
    flashPassword.innerHTML = "Passwords don't match!"

    const flashEmail = document.createElement('p');
    flashEmail.setAttribute('id','flashEmail' );
    flashEmail.setAttribute('class', 'flash danger');
    flashEmail.innerHTML = "This Email Already registered! please try another email"

    const user = {
        username: user_name,
        email: user_email,
        role: user_role,
        password: user_password
    };

    let status = false;
    if(!checkPassword(passowrd1, password2)) {
        const flash = document.querySelector('#flashPassword');
        if (flash) {
            flash.remove()
        }
        form.appendChild(flashPassword);
        status = true;
        // flashPassword.style.display = 'block';
    } else {
        const flash = document.querySelector('#flashPassword');
        if (flash) {
            flash.remove()
        }
        // flashPassword.style.display = 'none';
    }
    if(!(await checkEmail(user_email))) {
        const flash = document.querySelector('#flashEmail');
        if (flash) {
            flash.remove();
        }
        form.appendChild(flashEmail);
        status = true;
        // flashEmail.style.display = 'block';
    } else {
            const flash = document.querySelector('#flashEmail');
            if (flash) {
                flash.remove();
            }
        // flashEmail.style.display = 'none'
    }

    if (status == true) {
        return;
    }
    
    const response = await sendData(user, 'register');
    
    if(response.status == 201) {
        localStorage.setItem('login', 'successful');
        location.replace(login);
    }

})