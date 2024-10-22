import { checkAuth } from "./urls.js";

// Check if the current user authenticated
const isAuthenticated = async () => {

    // get user key
    const key = localStorage.getItem('key');

    // check if you key stored on the session dict on backend
    const request = await fetch(`${checkAuth}/${key}`);

    // response {message, status, , is_authenticated}
    const response = await request.json();   

    // true if user has key on the backend
    // false if user don't have key on the backend
    return response.is_authenticated;
}

// store key in localStorage
const setKey = (key) => localStorage.setItem('key', key);

// get user key from localStorage
const getKey = () => localStorage.getItem('key');

// Remove the key from localStorage
const removeKey = () => localStorage.clear();

export {
    isAuthenticated,
    setKey,
    getKey,
    removeKey
}