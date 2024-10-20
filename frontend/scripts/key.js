import { checkAuth } from "./urls.js";

const isAuthenticated = async () => {
    const key = localStorage.getItem('key');
    const request = await fetch(`${checkAuth}/${key}`);
    const response = await request.json()
    return response.is_authenticated;
}
const setKey = (key) => localStorage.setItem('key', key);
const getKey = () => localStorage.getItem('key');
const removeKey = () => localStorage.clear();

export {
    isAuthenticated,
    setKey,
    getKey,
    removeKey
}