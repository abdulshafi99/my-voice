
const isAuthenticated = () => Boolean(localStorage.getItem('key'))
const setKey = (key) => localStorage.setItem('key', key);
const getKey = () => localStorage.getItem('key');
const removeKey = () => localStorage.removeItem();


// document.addEventListener('load', (event) => {

//     let page = ''
//     if (isAuthenticated()) {
//         page = get_html('index.html');
//     } else {
//         page = 'login.html'
//     }
// })