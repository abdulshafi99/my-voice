
import { dropDown, meun, logout } from './logout.js';
import { login } from './urls.js';
import { isAuthenticated, getKey, removeKey } from './key.js';
import { addPost } from './posts.js';

function clearFeed() {
    const feed = document.getElementById('feed');
    feed.innerHTML = "";
}


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
    const posts = await response.json();

    // posts.sort((post1, post2) => {
    //     if (post1.post_date < post2.post_date) {
    //         return 1;
    //     } else if (post1.post_date > post2.post_date) {
    //         return -1;
    //     } else {
    //         return 0;
    //     }
    // });

    clearFeed();
    for (const post of posts) {
        addPost(post);
    }  
}

const newPostText = document.getElementById('newPostText');
const newSubmitPost = document.getElementById('newSubmitPost');
newSubmitPost.addEventListener('click', async(event) => {
    const content = newPostText.value;
    newPostText.value = '';

    if (content.length > 0) {
        const key = getKey();
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

        const response = await request.json();

        console.log(response.post);
        if (response.status == 200) {
            addPost(response.post);
        } else {
            removeKey();
            location.replace(login);
        }
    } 
})

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
        localStorage.setItem('current_user', data.user.id)
    } else {
        document.getElementById('userName').innerText = "Unkonw user";
    }
}

    
document. addEventListener("DOMContentLoaded", async () => {
    const auth = await isAuthenticated();
    if (auth == true) {
        await setUser();
        await get_posts();

    } else {
        localStorage.clear();
        location.replace(login);
    }


});



