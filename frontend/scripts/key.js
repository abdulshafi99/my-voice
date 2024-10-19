
const isAuthenticated = () => Boolean(localStorage.getItem('key'))
const setKey = (key) => localStorage.setItem('key', key);
const getKey = () => localStorage.getItem('key');
const removeKey = () => localStorage.clear();

export {
    isAuthenticated,
    setKey,
    getKey,
    removeKey
}