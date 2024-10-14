
const isAuthenticated = () => Boolean(localStorage.getItem('token'))
const getToken = () => localStorage.getItem('token');
const getTokenKey = () => localStorage.getItem('tokenKey');
const removeToken = () => localStorage.clear();

async function get_posts() {
    const response = await fetch('http://127.0.0.1:5000/get_posts', {
        method: "GET", 
        headers: {
            Accept: "application/json",
        }
    });
    const posts = await response.json();

    const feed = document.getElementById('feed');
    for (const post of posts) {
        
        const mainPost = document.createElement('div');
        mainPost.setAttribute('class', 'post');

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
        date.innerText = post.post_date + ' ago';

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

        mainPost.appendChild(postHeader);
        mainPost.appendChild(postContent);
        mainPost.appendChild(postFooter);

        feed.appendChild(mainPost);
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


})