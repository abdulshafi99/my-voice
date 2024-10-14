
const form = document.getElementById('form');
const firstName = document.getElementById('firstName');
const surname = document.getElementById('surname');
const email = document.getElementById('email');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const signUp = document.getElementById('signUp');
const flashPassword = document.getElementById('flashPassword');
const flashEmail = document.getElementById('flashEmail');

function checkPassword(pass1, pass2) {
    if (pass1 === pass2) {
        return true
    } else {
        return false;
    }
}

const sendData = async (data, route) => {
    request = await fetch(`http://127.0.0.1:5000/${route}`, {
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

    const user_name = `${firstName.value} ${surname.value}`;
    firstName.value = '';
    surname.value = '';

    const user_email = email.value;
    email.value = '';

    const passowrd1 = password.value;
    const password2 = confirmPassword.value;

    user_password = password.value;
    password.value = '';

    confirmPassword.value = '';

    if(!checkPassword(passowrd1, password2)) {
        flashPassword.style.display = 'block';
        return;
    }

    const user = {
        username: user_name,
        email: user_email,
        password: user_password
    };

    const response = await sendData(user, 'register');

    if(response.status == 201) {
        location.replace('file:///C:/Users/User/Desktop/workspace/my-voice/frontend/login.html');
    } else {
        flashEmail.style.display = 'block';
        return;
    }

})