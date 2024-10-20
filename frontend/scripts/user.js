

const getUserId = () => localStorage.getItem('id');

const getUser = async (id) => {
    const request = await fetch(`http://127.0.0.1:5000/get_user/${id}`)

    const response = await request.json();

    if (response.status == 200) {
        return response.user;
    }
    else {
        return response;
    }
}
const current_user = () => localStorage.getItem('current_user');


export {
    getUser,
    getUserId,
    current_user
}