
const isAuthenticated = () => Boolean(localStorage.getItem('token'))
const getToken = () => localStorage.getItem('token');
const getTokenKey = () => localStorage.getItem('tokenKey');
const removeToken = () => localStorage.clear();

function setDate(date) {
    date = date.replace(' GMT', '');

    const sec = (new Date() - new Date(date)) / 1000;

    if (Math.floor(sec/60) < 60) {
        return `${Math.floor(sec/60)} minutes`
    } else {
        return `${Math.floor((sec/60) / 60)} hours`
    }

}
function createPost(post) {

    const feed = document.getElementById('feed');

    const mainPost = document.createElement('div');
    mainPost.setAttribute('class', 'post');

    const postId = document.createElement('span');
    postId.setAttribute('id', 'postId');
    postId.setAttribute('class', 'hide');
    postId.value = post.id;
    

    const postHeader = document.createElement('div');
    postHeader.setAttribute('class', 'post-header');

    const postAuthor = document.createElement('div');
    postAuthor.setAttribute('class', 'author');
    
    const authorImg = document.createElement('img');
    authorImg.setAttribute('src', 'assets/default-user.png');
    
    const authorName = document.createElement('h3');
    authorName.setAttribute('class', 'author-name');
    authorName.innerText = post.author;

    const date = document.createElement('span');
    date.innerText = setDate(post.post_date) + ' ago';

    const postContent = document.createElement('div');
    postContent.setAttribute('class', 'post-content');
    const p = document.createElement('p');
    p.innerText = post.content;

    const postFooter = document.createElement('div');
    postFooter.setAttribute('class', 'post-footer');

    const upVote = document.createElement('button');
    upVote.innerText = 'Upvote';

    const downVote = document.createElement('button');
    downVote.innerText = 'Downvote';

    const comment = document.createElement('button');
    comment.innerText = 'Comment';

    postHeader.appendChild(postAuthor);
    postHeader.appendChild(date);

    postAuthor.appendChild(authorImg);
    postAuthor.appendChild(authorName);

    postContent.appendChild(p);

    postFooter.appendChild(upVote);
    postFooter.appendChild(downVote);
    postFooter.appendChild(comment);

    mainPost.appendChild(postId);
    mainPost.appendChild(postHeader);
    mainPost.appendChild(postContent);
    mainPost.appendChild(postFooter);

    feed.appendChild(mainPost);
} 

async function get_posts() {
    const response = await fetch('http://127.0.0.1:5000/get_posts', {
        method: "GET", 
        headers: {
            Accept: "application/json",
        }
    });
    const posts = await response.json();

    posts.sort((post1, post2) => {
        if (post1.post_date < post2.post_date) {
            return 1;
        } else if (post1.post_date > post2.post_date) {
            return -1;
        } else {
            return 0;
        }
    });

    for (const post of posts) {
        createPost(post);
    }
       
}

addEventListener("load", () => {

    if (isAuthenticated()) {
        get_posts();
    }
    else {
        location.replace('file:///C:/Users/User/Desktop/workspace/my-voice/frontend/login.html')
    }
});

const dropDown = document.getElementById('dropDown');
const meun = document.getElementById('menu');
dropDown.addEventListener('click', () => {
    dropDownClass = dropDown.classList.value.split(' ');

    if (dropDownClass.includes('drop-down-click')) {
        dropDown.classList.remove('drop-down-click');
        meun.classList.remove('menu-click')
    } else {
        dropDown.classList.add('drop-down-click');
        meun.classList.add('menu-click')
    }
})

const btnMenu = document.getElementById('btnMenu');
btnMenu.addEventListener('click', async (event) => {
    
    token = getToken();
    removeToken();

    const request = await fetch('http://127.0.0.1:5000/logout', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            token: token,
        })
    });

    const response = await request.json();

    console.log(response);

    location.replace('file:///C:/Users/User/Desktop/workspace/my-voice/frontend/login.html')


});

const newPostText = document.getElementById('newPostText');
const newSubmitPost = document.getElementById('newSubmitPost');
newSubmitPost.addEventListener('click', async(event) => {
    const content = newPostText.value;
    newPostText.value = '';

    if (content.length > 0) {
        const token = getToken();
        const request = await fetch('http://127.0.0.1:5000/create_post', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                token: token,
                content: content
            })
        });

        const response = await request.json();

        if (response.status == 200) {
            createPost(response.post);
        } else {
            return
        }
    } 
})