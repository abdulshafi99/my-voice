
const setKey = (key) => localStorage.setItem('key', key);

const email = document.getElementById('email');
const password = document.getElementById('password');
const logIn = document.getElementById('logIn');
const form = document.getElementById('form');


form.addEventListener('submit', async (event) => {
    event.preventDefault();    // Prevent the form from sending to backend

    const user_email = email.value;
    email.value = '';

    user_password = password.value;
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
        console.log(response);
        location.replace('file:///C:/Users/User/Desktop/workspace/my-voice/frontend/index.html')
    } else {
        flashLogin.style.display = 'block';
    }
    // if (response.token) {
    //     // location.replace('index.html');
    //     console.log('correct login')
    //     console.log(response.token)
    // } else {
    //     console.log('Email or password are wrong');
    // }
})
