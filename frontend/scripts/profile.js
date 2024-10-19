import { getKey } from "./key.js";
import { addArchivedPost, addPost } from './posts.js'
import { getUser, getUserId } from "./user.js";


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

    const key = getKey();
    const userid = getUserId()
    const user = await getUser(userid);

    document.querySelector('#current_user').innerHTML = localStorage.getItem('username');
    document.querySelector('#userName').innerHTML = user.username;

    document.querySelector('#role').innerHTML = user.role;
    document.querySelector('#email').innerHTML = user.email;
    document.querySelector('#joinDate').innerHTML = `joined ${setDate(user.join_date)} ago`;



    const posts = await getUserPosts(userid);
    clearFeed();
    for (const post of posts) {
        if (post.status == false) {
            addPost(post);
        }
    }

});

document.querySelector('.archived').addEventListener('click', async(e) => {
    
    const id = getUserId();
    const request = await fetch(`http://127.0.0.1:5000/get_archived_posts/${id}`);

    const posts = await request.json()

    clearFeed();
    for (const post of posts) {
        addArchivedPost(post);
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