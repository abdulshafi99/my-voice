
import { dropDown, meun, logout } from './logout.js';
import { login } from './urls.js';
import { isAuthenticated, getKey, removeKey } from './key.js';
import { addPost } from './posts.js';

function clearFeed() {
    const feed = document.getElementById('feed');
    feed.innerHTML = "";
}

// get posts and show them in feed container
async function get_posts() {

    const key = getKey();
    const response = await fetch('http://127.0.0.1:5000/get_posts', {
        method: "POST", 
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            key: key,
        })
    });
    
    // { id, userid, content, status, post_date, author name, comments, votes, key }
    const posts = await response.json();

    clearFeed();

    for (const post of posts) {
        addPost(post);
    }  
}

// Select create post form
const newSubmitPost = document.getElementById('newSubmitPost');
newSubmitPost.addEventListener('click', async(event) => {
    // Select text box of create a post
    const newPostText = document.getElementById('newPostText');
    // store post content
    const content = newPostText.value;
    newPostText.value = '';
    
    // if there is a post content
    if (content.length > 0) {
        const key = getKey();
        // store post on backend
        const request = await fetch('http://127.0.0.1:5000/create_post', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                key: key,
                content: content
            })
        });
        // {message, status, post{id, userid, key, content, post_date, status, username, votes, comments}}
        const response = await request.json();

        // update posts in frontend
        console.log(response.post);
        if (response.status == 200) {
            addPost(response.post);
        } else {
            removeKey();
            location.replace(login);
        }
    } 
})

// sotre current your data in local sotrage, add current user name to profile navbar
async function setUser() {

    const key = getKey();
    
    // get current user data from backend
    const response = await fetch('http://127.0.0.1:5000/current_user', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            key: key
        })
    });
    // {message, status, user{username, id}}
    const data = await response.json();

    if (data.status == 200) {
        document.querySelector('nav > .profile').setAttribute('userid', data.user.id)
        document.getElementById('userName').innerText =  data.user.username;

        localStorage.setItem('username', data.user.username);
        localStorage.setItem('id', data.user.id);
        localStorage.setItem('current_user', data.user.id)
    } else {
        document.getElementById('userName').innerText = "Unkonw user";
    }
}

// when document load check your status [authenticated or not]
document. addEventListener("DOMContentLoaded", async () => {
    // check if user authenticated
    // if authenticated load posts and set username in navbar, user id, current user id
    const auth = await isAuthenticated();
    if (auth == true) {
        await setUser();
        await get_posts();

    } else {
        // not authenticated clear localstorage, redirect user to login page
        localStorage.clear();
        location.replace(login);
    }


});



