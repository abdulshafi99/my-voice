import { dropDown, meun, logout } from './logout.js';
import { getKey, isAuthenticated } from "./key.js";
import { addPost } from './posts.js'
import { current_user, getUser, getUserId } from "./user.js";
import { login } from "./urls.js";


// format date in hours and mintues
function setDate(date) {
    date = date.replace(' GMT', '');

    const sec = (new Date() - new Date(date)) / 1000;

    if (Math.floor(sec/60) < 60) {
        return `${Math.floor(sec/60)} minutes`
    } else {
        return `${Math.floor((sec/60) / 60)} hours`
    }

}

// clear feed "posts container"
function clearFeed() {
    const feed = document.getElementById('feed');
    feed.innerHTML = "";
}

// get user posts  
const getUserPosts = async (id) => {

    const request = await fetch(`http://127.0.0.1:5000/get_user_posts/${id}`);

    const response = await request.json();

    // [{id, userid, content, status, post_date, username, comments, votes, key}, ....]
    return response;
};

// when page start
document.addEventListener('DOMContentLoaded', async (e) => {
    // check if user authentuicated
    // if not authenticated clear localstorage
    // redirect user to login page
    const auth = await isAuthenticated();
    if (auth == false) {
        localStorage.clear();
        location.replace(login);
    } else {
        // if uset authenticated
        // getuser key, id, 
        const key = getKey();
        const userid = getUserId()
        const user = await getUser(userid);
        
        // set navbar data "current user" "logined user"
        document.querySelector('#current_user').innerHTML = localStorage.getItem('username');
        // incase user clicked on his profile change userid to current user id
        document.querySelector('#profile-owner').addEventListener('click', () => {
            const id = current_user();
            localStorage.setItem('id', id);
        })

        // set the profile card data [name, role, email, joined date]
        document.querySelector('#userName').innerHTML = user.username;
        document.querySelector('#role').innerHTML = user.role;
        document.querySelector('#email').innerHTML = user.email;
        document.querySelector('#joinDate').innerHTML = `joined ${setDate(user.join_date)} ago`;

        // get user posts
        const posts = await getUserPosts(userid);
        // clear the feed "posts container"
        clearFeed();
        // loop over the posts and add each post to feed
        for (const post of posts) {
            if (post.status == false) {
                addPost(post);
            }
        }
    }

});

// get archived posts and show them on profile archived tab
document.querySelector('.archived').addEventListener('click', async(e) => {
    
    const id = getUserId();
    const request = await fetch(`http://127.0.0.1:5000/get_archived_posts/${id}`);

    const posts = await request.json()

    clearFeed();
    for (const post of posts) {
        addPost(post);
    }
})

// get active posts and show them on profile active tab
document.querySelector('.active').addEventListener('click', async(e) => {
    const id = getUserId();
    const request = await fetch(`http://127.0.0.1:5000/get_user_posts/${id}`);
    
    const posts = await request.json()
    
    clearFeed();
    for (const post of posts) {
        addPost(post);
    }
})