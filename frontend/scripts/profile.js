import { dropDown, meun, logout } from './logout.js';
import { getKey, isAuthenticated } from "./key.js";
import { addPost } from './posts.js'
import { current_user, getUser, getUserId } from "./user.js";
import { login } from "./urls.js";

async function setUser() {
    const key = getKey();
    const response = await fetch('http://127.0.0.1:5000/current_user', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            key: key
        })
    });

    const data = await response.json();

    if (data.status == 200) {
        document.querySelector('nav > .profile').setAttribute('userid', data.user.id)
        localStorage.setItem('username', data.user.username);
        document.getElementById('userName').innerText =  data.user.username;
        localStorage.setItem('id', data.user.id);
    } else {
        document.getElementById('userName').innerText = "Unkonw user";
    }
}


function setDate(date) {
    date = date.replace(' GMT', '');

    const sec = (new Date() - new Date(date)) / 1000;

    if (Math.floor(sec/60) < 60) {
        return `${Math.floor(sec/60)} minutes`
    } else {
        return `${Math.floor((sec/60) / 60)} hours`
    }

}

function clearFeed() {
    const feed = document.getElementById('feed');
    feed.innerHTML = "";
}

const getUserPosts = async (id) => {

    const request = await fetch(`http://127.0.0.1:5000/get_user_posts/${id}`);

    const response = await request.json();

    return response;
};

document.addEventListener('DOMContentLoaded', async (e) => {
    const auth = await isAuthenticated();
    if (auth == false) {
        localStorage.clear();
        location.replace(login);
    } else {
        
        const key = getKey();
        const userid = getUserId()
        const user = await getUser(userid);

        document.querySelector('#current_user').innerHTML = localStorage.getItem('username');
        document.querySelector('#userName').innerHTML = user.username;
        document.querySelector('#profile-owner').addEventListener('click', () => {
            const id = current_user();
            localStorage.setItem('id', id);
        })
        document.querySelector('#role').innerHTML = user.role;
        document.querySelector('#email').innerHTML = user.email;
        document.querySelector('#joinDate').innerHTML = `joined ${setDate(user.join_date)} ago`;



        const posts = await getUserPosts(userid);
        clearFeed();
        for (const post of posts) {
            if (post.status == false) {
                console.log(post);
                addPost(post);
            }
        }
    }

});

document.querySelector('.archived').addEventListener('click', async(e) => {
    
    const id = getUserId();
    const request = await fetch(`http://127.0.0.1:5000/get_archived_posts/${id}`);

    const posts = await request.json()

    clearFeed();
    for (const post of posts) {
        addPost(post);
    }
})

document.querySelector('.active').addEventListener('click', async(e) => {
    const id = getUserId();
    const request = await fetch(`http://127.0.0.1:5000/get_user_posts/${id}`);
    
    const posts = await request.json()
    
    clearFeed();
    for (const post of posts) {
        addPost(post);
    }
})