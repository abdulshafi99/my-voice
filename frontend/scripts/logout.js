import { getKey, removeKey } from "./key.js";
import { login } from "./urls.js";

// Handle user logout logic

// select dropdown menu for loggin out
const dropDown = document.getElementById('dropDown');
// select logout menu
const meun = document.getElementById('menu');
// add effects for showing dropdown menu and hide it for user interaction
dropDown.addEventListener('click', () => {

    // list of dropdown calsses
    const dropDownClass = dropDown.classList.value.split(' ');

    // incase user unclicked dropdown
    if (dropDownClass.includes('drop-down-click')) {
        dropDown.classList.remove('drop-down-click');
        meun.classList.remove('menu-click')
    } else {
        // incase user ckicked dropdown
        dropDown.classList.add('drop-down-click');
        meun.classList.add('menu-click')
    }
})

// select logout button and addevent on click
const logout = document.getElementById('logout');
logout.addEventListener('click', async (event) => {
    
    // remove key from localstorage and store it in variable
    const key = getKey();
    removeKey();

    // remove user authentication from backend
    const request = await fetch('http://127.0.0.1:5000/logout', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            key: key,
        })
    });

    // {message, status}
    const response = await request.json();

    location.replace(login)
});

export {dropDown, meun, logout }