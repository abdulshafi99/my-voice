
const form = document.getElementById('form');
const firstName = document.getElementById('firstName');
const surname = document.getElementById('surname');
const email = document.getElementById('email');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const signUp = document.getElementById('signUp');

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

    const flashPassword = document.getElementById('flashPassword');
    const flashEmail = document.getElementById('flashEmail');

    const user = {
        username: user_name,
        email: user_email,
        password: user_password
    };

    if(!checkPassword(passowrd1, password2)) {
        flashPassword.style.display = 'block';
        return
    } else {
        flashPassword.style.display = 'none';
    }
    if(! (await checkEmail(email))) {
        flashEmail.style.display = 'block';
    } else {
        flashEmail.style.display = 'none'
    }
    
    const response = await sendData(user, 'register');
    
    if(response.status == 201) {
        location.replace('file:///C:/Users/User/Desktop/workspace/my-voice/frontend/login.html');
    }

})