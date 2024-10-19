import { getKey, removeKey } from "./key.js";
import { login } from "./urls.js";

const dropDown = document.getElementById('dropDown');
const meun = document.getElementById('menu');
dropDown.addEventListener('click', () => {
    const dropDownClass = dropDown.classList.value.split(' ');

    if (dropDownClass.includes('drop-down-click')) {
        dropDown.classList.remove('drop-down-click');
        meun.classList.remove('menu-click')
    } else {
        dropDown.classList.add('drop-down-click');
        meun.classList.add('menu-click')
    }
})

const logout = document.getElementById('logout');
logout.addEventListener('click', async (event) => {
    
    const key = getKey();
    removeKey();

    const request = await fetch('http://127.0.0.1:5000/logout', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            key: key,
        })
    });

    const response = await request.json();

    console.log(response);

    location.replace(login)
});

export {dropDown, meun, logout }