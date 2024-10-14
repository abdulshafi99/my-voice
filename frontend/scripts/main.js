
const isAuthenticated = () => Boolean(localStorage.getItem('token'))
const setToken = (token) => localStorage.setItem('token', token);
const getToken = () => localStorage.getItem('token');
const removeToken = () => localStorage.clear();

document.addEventListener('load', (event) => {

    let page = ''
    if (isAuthenticated()) {
        page = get_html('index.html');
    } else {
        page = 'login.html'
    }
})