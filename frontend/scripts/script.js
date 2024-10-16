
const isAuthenticated = () => Boolean(localStorage.getItem('key'))
const getKey = () => localStorage.getItem('key');
const removeKey = () => localStorage.clear();

const listenToComments = [];
const listenToVoteDown = [];
const listenToVoteUp = [];

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

function get_comments(comments) {
    const commentsContainer = document.createElement('div');

    for (const comment of comments) {
        const commentContainer = document.createElement('div');
        commentContainer.setAttribute('class', 'comment');
        commentContainer.setAttribute('id', 'comment');

        const img = document.createElement('img');
        img.setAttribute('src', 'assets/default-user.png');

        const commentCard = document.createElement('div');
        commentCard.setAttribute('class', 'comment-card');
        commentCard.setAttribute('id', 'commentCard');

        const h3 = document.createElement('h3');
        h3.setAttribute('id', 'comment-author');
        h3.innerText = comment.username

        const content = document.createElement('p');
        content.setAttribute|('class', 'comment-content');
        content.innerText = comment.content;

        commentCard.appendChild(h3);
        commentCard.appendChild(content);

        commentContainer.appendChild(img);
        commentContainer.appendChild(commentCard);

        commentsContainer.appendChild(commentContainer);

    }

    return commentsContainer;
}
function createPost(post) {

    const feed = document.getElementById('feed');

    const mainPost = document.createElement('div');
    mainPost.setAttribute('class', 'post');
    mainPost.setAttribute('postid', `${post.id}`);

    // const postId = document.createElement('span');
    // postId.setAttribute('id', 'postId');
    // postId.setAttribute('class', 'hide');
    // postId.innerText = post.id;
    

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
    postFooter.setAttribute('postID', String(post.id));

    const upVote = document.createElement('button');
    upVote.setAttribute('class', 'vote');
    upVote.setAttribute('type', 'upvote');
    upVote.innerHTML = `Upvote <span class="votes">${post.votes.upvote}</span>`;
    
    const downVote = document.createElement('button');
    downVote.setAttribute('class', 'vote');
    downVote.setAttribute('type', 'downvote');
    downVote.innerHTML = `Downvote <span class="votes">${post.votes.downvote}</span>`;
   
    
    const addComment = document.createElement('div');
    addComment.setAttribute('class', 'add-comment');

    const commentInpt = document.createElement('input');
    commentInpt.setAttribute('type', 'text');
    commentInpt.setAttribute('id', 'comment-inpt');
    commentInpt.setAttribute('class', 'comment-inpt');
    commentInpt.setAttribute('placeholder', 'Write a comment...');
    commentInpt.setAttribute('postID', String(post.id));
    // comment.innerText = 'Comment';
    const commentBtn = document.createElement('button');
    commentBtn.setAttribute('id', 'commentBtn');
    commentBtn.setAttribute('class', 'commentBtn');
    commentBtn.setAttribute('postID', String(post.id));
    commentBtn.innerText = 'Comment';

    addComment.appendChild(commentInpt);
    addComment.appendChild(commentBtn);
    

    postHeader.appendChild(postAuthor);
    postHeader.appendChild(date);

    postAuthor.appendChild(authorImg);
    postAuthor.appendChild(authorName);

    postContent.appendChild(p);

    postFooter.appendChild(upVote);
    postFooter.appendChild(downVote);
    postFooter.appendChild(addComment);

    const comments = get_comments(post.comments);

    comments.setAttribute('class', 'comments');
    comments.setAttribute('id', 'comments');

    if (post.comments.length  == 0) {
        comments.setAttribute('class', 'hide');
    }

    mainPost.appendChild(postHeader);
    mainPost.appendChild(postContent);
    mainPost.appendChild(postFooter);
    mainPost.appendChild(comments)

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
        createPost(post);
    }  
}



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

const logout = document.getElementById('logout');
logout.addEventListener('click', async (event) => {
    
    key = getKey();
    removeKey();

    const request = await fetch('http://127.0.0.1:5000/logout', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            key: key,
        })
    });

    const response = await request.json();

    console.log(response);

    location.replace('file:///C:/Users/User/Desktop/workspace/my-voice/frontend/login.html')


});

function addPost(post) {
    const feed = document.getElementById('feed');

    const mainPost = document.createElement('div');
    mainPost.setAttribute('class', 'post');
    mainPost.setAttribute('postid', `${post.id}`);

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
    postFooter.setAttribute('postID', String(post.id));

    const upVote = document.createElement('button');
    upVote.setAttribute('class', 'vote');
    upVote.setAttribute('type', 'upvote');
    upVote.innerHTML = `Upvote <span class="votes">${post.votes.upvote}</span>`;
    
    const downVote = document.createElement('button');
    downVote.setAttribute('class', 'vote');
    downVote.setAttribute('type', 'downvote');
    downVote.innerHTML = `Downvote <span class="votes">${post.votes.downvote}</span>`;
    
    const addComment = document.createElement('div');
    addComment.setAttribute('class', 'add-comment');

    const commentInpt = document.createElement('input');
    commentInpt.setAttribute('type', 'text');
    commentInpt.setAttribute('id', 'comment-inpt');
    commentInpt.setAttribute('class', 'comment-inpt');
    commentInpt.setAttribute('placeholder', 'Write a comment...');
    commentInpt.setAttribute('postID', String(post.id));
    // comment.innerText = 'Comment';
    const commentBtn = document.createElement('button');
    commentBtn.setAttribute('id', 'commentBtn');
    commentBtn.setAttribute('class', 'commentBtn');
    commentBtn.setAttribute('postID', String(post.id));
    commentBtn.innerText = 'Comment';

    addComment.appendChild(commentInpt);
    addComment.appendChild(commentBtn);
    

    postHeader.appendChild(postAuthor);
    postHeader.appendChild(date);

    postAuthor.appendChild(authorImg);
    postAuthor.appendChild(authorName);

    postContent.appendChild(p);

    postFooter.appendChild(upVote);
    postFooter.appendChild(downVote);
    postFooter.appendChild(addComment);

    const comments = get_comments(post.comments);

    comments.setAttribute('class', 'comments');
    comments.setAttribute('id', 'comments');

    if (post.comments.length  == 0) {
        comments.setAttribute('class', 'hide');
    }

    mainPost.appendChild(postHeader);
    mainPost.appendChild(postContent);
    mainPost.appendChild(postFooter);
    mainPost.appendChild(comments);

    feed.prepend(mainPost);
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

        if (response.status == 200) {
            addPost(response.post);
        } else {
            console.log(response);
        }
    } 
})

async function setUsername() {
    const key = getKey();
    response = await fetch('http://127.0.0.1:5000/current_user', {
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
        document.getElementById('userName').innerText =  data.username;
    } else {
        document.getElementById('userName').innerText = "Unkonw user";
    }
}


// document.addEventListener("DOMContentLoaded", 
    
    
// });


// async fucntion home() {
    
//     if (isAuthenticated()) {
//         await setUsername()
//         await get_posts();
        
//         const commentBtns = document.querySelectorAll('.commentBtn');
//         for (const btn of commentBtns) {
//             btn.addEventListener('click', async (event) => {
//                 const postid = btn.getAttribute('postid');
//                 const commentInpt = document.querySelector(`.add-comment > input[postid='${postid}']`);
            
//                 const comment = commentInpt.value;
//                 commentInpt.value = '';
                
//                 const request = await fetch('http://127.0.0.1:5000/add_comment', {
//                     method: 'POST',
//                     headers: {
//                         "Content-Type": "application/json"
//                     },
//                     body: JSON.stringify({
//                         post_id: postid,
//                         content: comment,
//                         key: getKey()
//                     })
//                 })
            
//                 response = await request.json();
            
//                 if (response.status == 200) {
//                     window.location.relaod();
//                 } else {
//                     console.log(response);
//                 }
//             }
//             );
//         }
//     }
//     else {
//         location.replace('file:///C:/Users/User/Desktop/workspace/my-voice/frontend/login.html')
//     }
// }


function addVotes(postid, votes) {
    console.log(postid)
    console.log(votes)
    
    const upvotes = document.querySelector(`.post-footer[postid="${postid}"] > button[type="upvote"]`)
    const downvotes = document.querySelector(`.post-footer[postid="${postid}"] > button[type="downvote"]`)

    upvotes.innerHTML = `Upvote  <span class='votes'>${votes.upvote}</span>`
    downvotes.innerHTML = `Downvote  <span class='votes'>${votes.downvote}</span>`
}

function addComment(comment) {
    const comments = document.querySelector(`.post[postid="${comment.postid}"] > .comments`);
    console.log(comments);

    const commentContainer = document.createElement('div');
    commentContainer.setAttribute('class', 'comment');
    commentContainer.setAttribute('id', 'comment');

    const img = document.createElement('img');
    img.setAttribute('src', 'assets/default-user.png');

    const commentCard = document.createElement('div');
    commentCard.setAttribute('class', 'comment-card');
    commentCard.setAttribute('id', 'commentCard');

    const h3 = document.createElement('h3');
    h3.setAttribute('id', 'comment-author');
    h3.innerText = comment.username

    const content = document.createElement('p');
    content.setAttribute|('class', 'comment-content');
    content.innerText = comment.content;

    commentCard.appendChild(h3);
    commentCard.appendChild(content);

    commentContainer.appendChild(img);
    commentContainer.appendChild(commentCard);

    comments.append(commentContainer);
    
}

document. addEventListener("DOMContentLoaded", async () => {
    if (isAuthenticated()) {
        await setUsername();
        await get_posts();


        const commentBtns = document.querySelectorAll('.commentBtn');
        for (const btn of commentBtns) {
            btn.addEventListener('click', async (event) => {
                const postid = btn.getAttribute('postid');
                console.log(postid);
                const commentInpt = document.querySelector(`input[postid="${postid}"]`);    
            
                const comment = commentInpt.value;
                commentInpt.value = '';
                
                const request = await fetch('http://127.0.0.1:5000/add_comment', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        post_id: postid,
                        content: comment,
                        key: getKey()
                    })
                })
            
                response = await request.json();
            
                if (response.status == 200) {
                    addComment(response.comment);
                } else {
                    console.log(response);
                }
            }
            );   
        }

        const voteBtns = document.querySelectorAll('.vote');
        // console.log(voteBtns);
        for (const btn of voteBtns) {
            btn.addEventListener('click', async () => {
                key = getKey();
                postid = btn.parentElement.getAttribute('postid');
                vote = btn.getAttribute('type');

                const request = await fetch('http://127.0.0.1:5000/add_vote', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        postid: postid,
                        vote: vote,
                        key: key
                    })
                });

                const response = await request.json();

                if (response.status == 200) {
                    console.log(response);
                    addVotes(postid, response.votes);
                } else {
                    console.log(response);
                }
            })
        }
        
    } else {
        location.replace('file:///C:/Users/User/Desktop/workspace/my-voice/frontend/login.html')
    }


});

// async function home() {
//         if (isAuthenticated()) {
//         await setUsername()
//         await get_posts();
        
//         // const commentBtns = document.querySelectorAll('.commentBtn');
//         // for (const btn of commentBtns) {
//         //     btn.addEventListener('click', async (event) => {
//         //         const postid = btn.getAttribute('postid');
//         //         console.log(postid);
//         //         const commentInpt = document.querySelector(`.add-comment > input[postid=${postid}]`);
            
//         //         const comment = commentInpt.value;
//         //         commentInpt.value = '';
                
//         //         const request = await fetch('http://127.0.0.1:5000/add_comment', {
//         //             method: 'POST',
//         //             headers: {
//         //                 "Content-Type": "application/json"
//         //             },
//         //             body: JSON.stringify({
//         //                 post_id: postid,
//         //                 content: comment,
//         //                 key: getKey()
//         //             })
//         //         })
            
//         //         response = await request.json();
            
//         //         if (response.status == 200) {
//         //             addComment(postid, comment);
//         //         } else {
//         //             console.log(response);
//         //         }
//         //     }
//         //     );
//         // }
//     }
//     else {
//         location.replace('file:///C:/Users/User/Desktop/workspace/my-voice/frontend/login.html')
//     }
// }

