
const setToken = (token) => localStorage.setItem('token', token);

const email = document.getElementById('email');
const password = document.getElementById('password');
const logIn = document.getElementById('logIn');
const form = document.getElementById('form');


form.addEventListener('submit', async (event) => {
    event.preventDefault();    // Prevent the form from sending to backend

    // const xhr = new XMLHttpRequest();

    const user_email = email.value;
    email.value = '';

    user_password = password.value;
    password.value = '';

    const user = JSON.stringify({
        email: user_email,
        password: user_password,
    });

    
    // xhr.open('POST', 'http://127.0.0.1:5000/login');
    // xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    // xhr.send(user);

    // response = xhr.response;
    // console.log(response);

    const request = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: user
    });

    const response = await request.json();

    if (response.status == 201) {
        setToken(response.token);
        location.replace('file:///C:/Users/User/Desktop/workspace/my-voice/frontend/index.html')
    } else {
        console.log(response.status)
    }
    // if (response.token) {
    //     // location.replace('index.html');
    //     console.log('correct login')
    //     console.log(response.token)
    // } else {
    //     console.log('Email or password are wrong');
    // }
})
