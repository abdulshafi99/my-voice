
import { getKey } from "./key.js";
import { get_comments, createComment } from './comments.js';
import { profile } from "./urls.js";
import { current_user } from "./user.js";

function setDate(date) {
    date = date.replace(' GMT', '');

    const sec = (new Date() - new Date(date)) / 1000;

    if (Math.floor(sec/60) < 60) {
        return `${Math.floor(sec/60)} minutes`
    } else {
        return `${Math.floor((sec/60) / 60)} hours`
    }

}

async function sendVote(vote) {
    const request = await fetch('http://127.0.0.1:5000/add_vote', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(vote)
            });

            const response = await request.json();

            return response;

}

function addVotes(postid, votes) {
    console.log(postid)
    console.log(votes)
    
    const upvotes = document.querySelector(`.post-footer[postid="${postid}"] > .vote-container > button[type="upvote"]`)
    const downvotes = document.querySelector(`.post-footer[postid="${postid}"] > .vote-container > button[type="downvote"]`)

    upvotes.innerHTML = `Upvote  <span class='votes'>${votes.upvote}</span>`
    downvotes.innerHTML = `Downvote  <span class='votes'>${votes.downvote}</span>`
}

function addPost(post) {
    const feed = document.getElementById('feed');

    const mainPost = document.createElement('div');
    mainPost.setAttribute('class', 'post');
    mainPost.setAttribute('postid', `${post.id}`);

    const postHeader = document.createElement('div');
    postHeader.setAttribute('class', 'post-header');

    const postAuthor = document.createElement('div');
    postAuthor.setAttribute('class', 'author');
    postAuthor.setAttribute('userid', `${post.userid}`);
    postAuthor.addEventListener('click', async(e) => {
        
        const id = e.target.parentElement.getAttribute('userid');
        // console.log(id);
        localStorage.setItem('id', id);
        location.replace(profile)
        
    });
    
    const authorImg = document.createElement('img');
    authorImg.setAttribute('src', 'assets/default-user.png');
    
    const authorName = document.createElement('h3');
    authorName.setAttribute('class', 'author-name');
    authorName.innerText = post.author;

    const date = document.createElement('span');
    date.innerText = setDate(post.post_date) + ' ago';

    const postContent = document.createElement('div');
    postContent.setAttribute('class', 'post-content');
    const content = document.createElement('p');
    content.innerText = post.content;

    const postFooter = document.createElement('div');
    postFooter.setAttribute('class', 'post-footer');
    postFooter.setAttribute('postid', String(post.id));

    const upVote = document.createElement('button');
    upVote.setAttribute('class', 'vote');
    upVote.setAttribute('type', 'upvote');
    upVote.innerHTML = `Upvote <span class="votes">${post.votes.upvote}</span>`;
    
    const downVote = document.createElement('button');
    downVote.setAttribute('class', 'vote');
    downVote.setAttribute('type', 'downvote');
    downVote.innerHTML = `Downvote <span class="votes">${post.votes.downvote}</span>`;
   
    if (post.status == false) {
            const key = getKey();
            const postid = `${post.id}`;
        downVote.addEventListener('click', async () => {
            const vote = downVote.getAttribute('type');
            
            const response = await sendVote({
                postid: postid,
                vote: vote,
                key: key
            });
            
            if (response.status == 200) {
                addVotes(postid, response.votes);
            } else {
                console.log(response);
            }
        })

        upVote.addEventListener('click', async () => {
            const vote = upVote.getAttribute('type');

            const response = await sendVote({
                postid: postid,
                vote: vote,
                key: key
            });

            if (response.status == 200) {
                addVotes(postid, response.votes);
            } else {
                console.log(response);
            }
        })

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

        commentBtn.addEventListener('click', async () => {
            const postid = commentBtn.getAttribute('postid');
            const commentText = document.querySelector(`input[postid="${postid}"]`);    
        
            const comment = commentText.value;
            if (comment.trim() == '') {
                return; 
            }
            commentText.value = '';
            
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
        
            const response = await request.json();
        
            if (response.status == 200) {
                createComment(response.comment);
            } else {
                console.log(response);
            }
        });

        const addComment = document.createElement('div');
        addComment.setAttribute('class', 'add-comment');
        
        addComment.appendChild(commentInpt);
        addComment.appendChild(commentBtn);

        postFooter.appendChild(addComment);
    }


    const voteContainer = document.createElement('div');
    voteContainer.setAttribute('class', 'vote-container');    

    postHeader.appendChild(postAuthor);
    postHeader.appendChild(date);

    postAuthor.appendChild(authorImg);
    postAuthor.appendChild(authorName);

    postContent.appendChild(content);

    voteContainer.appendChild(upVote);
    voteContainer.appendChild(downVote);

    postFooter.prepend(voteContainer);
    if (current_user() == post.userid) {
        const archiveBtn = document.createElement('button');
        archiveBtn.setAttribute('class', 'archiveBtn');
        archiveBtn.setAttribute('postid', String(post.id));
        archiveBtn.innerHTML = `<i class="fa-solid fa-box-archive"></i>`

        archiveBtn.addEventListener('click', async (e) => {
            const postid = archiveBtn.getAttribute('postid');
        
            const request = await fetch('http://127.0.0.1:5000/archive_post', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    post_id: postid,
                })
            })
            const response = await request.json();
            if (response.status == 200) {
                archivePost(response.postid);
            }
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.setAttribute('class', 'deleteBtn');
        deleteBtn.setAttribute('postid', String(post.id));
        deleteBtn.innerHTML = `<i class="fa-solid fa-trash"></i>`;
        deleteBtn.addEventListener('click', async (e) => {
            const postid = deleteBtn.getAttribute('postid');
    
            const request = await fetch('http://127.0.0.1:5000/delete_post', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    post_id: postid,
                })
            })
            const response = await request.json();
            if (response.status == 200) {
                deletePost(postid);
            }
        });

        const archiveContainer = document.createElement('div');
        archiveContainer.setAttribute('class', 'archive-container');

        archiveContainer.appendChild(archiveBtn);
        archiveContainer.appendChild(deleteBtn);

        postFooter.appendChild(archiveContainer);
    }

    const comments = get_comments(post.comments);

    comments.classList.add('comments');
    comments.setAttribute('id', 'comments');

    if (post.comments.length  == 0) {
        comments.classList.add('hide');
    }


    mainPost.appendChild(postHeader);
    mainPost.appendChild(postContent);
    mainPost.appendChild(postFooter);
    mainPost.appendChild(comments);

    feed.prepend(mainPost);
    
}

function archivePost(postid) {
    const post = document.querySelector(`.post[postid="${postid}"]`);
    post.remove();
}

function deletePost(postid) {
    console.log(postid);
    const post = document.querySelector(`.post[postid="${postid}"]`);
    post.remove();
}


export { addPost }