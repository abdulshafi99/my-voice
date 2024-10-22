import { login } from "./urls.js";

// check if two passwords are identical
function checkPassword(pass1, pass2) {
    if (pass1 === pass2) {
        return true
    } else {
        return false;
    }
}

// check if email already registered in database
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


const form = document.getElementById('form');
form.addEventListener('submit', async (event) => {
    // Prevent the form from sending to backend
    event.preventDefault();    

    // get username, email, role , password, confirmed password
    const firstName = document.getElementById('firstName');
    const surname = document.getElementById('surname');
    const email = document.getElementById('email');
    const role = document.getElementById('role');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');

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

    // create a p showing error message incase you entered wrong password or email
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

    // if user entered wrong email or password show them error message and reload the image
    let status = false;
    if(!checkPassword(passowrd1, password2)) {
        const flash = document.querySelector('#flashPassword');
        if (flash) {
            flash.remove()
        }
        form.appendChild(flashPassword);
        status = true;
    } else {
        const flash = document.querySelector('#flashPassword');
        if (flash) {
            flash.remove()
        }
    }
    if(!(await checkEmail(user_email))) {
        const flash = document.querySelector('#flashEmail');
        if (flash) {
            flash.remove();
        }
        form.appendChild(flashEmail);
        status = true;
    } else {
            const flash = document.querySelector('#flashEmail');
            if (flash) {
                flash.remove();
            }
    }

    if (status == true) {
        return;
    }
    
    // store new user in database
    const request = await fetch(`http://127.0.0.1:5000/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    });
    // {message, status}
    const response = await request.json()
    // if registeration successful store a login variable in local storage and show a message on login page
    if(response.status == 201) {
        localStorage.setItem('login', 'successful');
        location.replace(login);
    }

})