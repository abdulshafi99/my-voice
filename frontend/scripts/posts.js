
import { getKey } from "./key.js";
import { get_comments, createComment } from './comments.js';
import { profile } from "./urls.js";
import { current_user } from "./user.js";
import { sendVote, addVotes } from "./votes.js";

// format the date to hours and minutes
function setDate(date) {
    date = date.replace(' GMT', '');

    const sec = (new Date() - new Date(date)) / 1000;

    if (Math.floor(sec/60) < 60) {
        return `${Math.floor(sec/60)} minutes`
    } else {
        return `${Math.floor((sec/60) / 60)} hours`
    }

}

// add post to frontend
// { id, userid, content, status, post_date, author name, comments, votes, key }
function addPost(post) {
    // select feed  posts container
    const feed = document.getElementById('feed');

    // create a post wraper and a signed post id 
    const mainPost = document.createElement('div');
    mainPost.setAttribute('class', 'post');
    mainPost.setAttribute('postid', `${post.id}`);

    // create a post header [auther name, auther image, post date]
    const postHeader = document.createElement('div');
    postHeader.setAttribute('class', 'post-header');

    // create a post author and a signed user id
    const postAuthor = document.createElement('div');
    postAuthor.setAttribute('class', 'author');
    postAuthor.setAttribute('userid', `${post.userid}`);
    // incase user clicked post author 
    // redirect him to author profile
    postAuthor.addEventListener('click', async(e) => {
        
        // get id of post author a sign it to localstorage
        // redirect user to post author profile
        const id = e.target.parentElement.getAttribute('userid');
        localStorage.setItem('id', id);
        location.replace(profile)
        
    });
    // create author image
    const authorImg = document.createElement('img');
    authorImg.setAttribute('src', 'assets/default-user.png');
    
    // create the author name of post
    const authorName = document.createElement('h3');
    authorName.setAttribute('class', 'author-name');
    authorName.innerText = post.author;

    // create the post date
    const date = document.createElement('span');
    date.innerText = setDate(post.post_date) + ' ago';

    // create the post content
    const postContent = document.createElement('div');
    postContent.setAttribute('class', 'post-content');
    const content = document.createElement('p');
    content.innerText = post.content;

    // create the post footer [votes - add comment - archive - delete]
    const postFooter = document.createElement('div');
    postFooter.setAttribute('class', 'post-footer');
    postFooter.setAttribute('postid', String(post.id));

    // create vote up button
    const upVote = document.createElement('button');
    upVote.setAttribute('class', 'vote');
    upVote.setAttribute('type', 'upvote');
    upVote.innerHTML = `Upvote <span class="votes">${post.votes.upvote}</span>`;
    
    // create vote down button 
    const downVote = document.createElement('button');
    downVote.setAttribute('class', 'vote');
    downVote.setAttribute('type', 'downvote');
    downVote.innerHTML = `Downvote <span class="votes">${post.votes.downvote}</span>`;
   
    // if post not archived
    if (post.status == false) {
        // get user key, post id    
        const key = getKey();
        const postid = `${post.id}`;

        // user voted down
        downVote.addEventListener('click', async () => {
            const vote = downVote.getAttribute('type');

            // { message, status, votes: {upvotes, downvotes}}
            const response = await sendVote({
                postid: postid,
                vote: vote,
                key: key
            });
            
            if (response.status == 200) {
                // update post votes
                // {postid, {voteup num, votedown num}}
                addVotes(postid, response.votes);
            } else {
                console.log(response);
            }
        })

        // user voted down
        upVote.addEventListener('click', async () => {
            const vote = upVote.getAttribute('type');
            // { message, status, votes: {upvotes, downvotes}}
            const response = await sendVote({
                postid: postid,
                vote: vote,
                key: key
            });

            if (response.status == 200) {
                // update post votes
                // {postid, {voteup num, votedown num}}
                addVotes(postid, response.votes);
            } else {
                console.log(response);
            }
        })

        // create comment section [comment input, button]
        // comment input
        const commentInpt = document.createElement('input');
        commentInpt.setAttribute('type', 'text');
        commentInpt.setAttribute('id', 'comment-inpt');
        commentInpt.setAttribute('class', 'comment-inpt');
        commentInpt.setAttribute('placeholder', 'Write a comment...');
        commentInpt.setAttribute('postID', String(post.id));

        // comment button
        const commentBtn = document.createElement('button');
        commentBtn.setAttribute('id', 'commentBtn');
        commentBtn.setAttribute('class', 'commentBtn');
        commentBtn.setAttribute('postID', String(post.id));
        commentBtn.innerText = 'Comment';
        // if user added comment
        commentBtn.addEventListener('click', async () => {
            const postid = commentBtn.getAttribute('postid');
            const commentText = document.querySelector(`input[postid="${postid}"]`);    
            // check if user entered emty comment
            const comment = commentText.value;
            if (comment.trim() == '') {
                return; 
            }
            commentText.value = '';
            // send the new comment to database
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
            // {message, status, comment{content, username, userid, postid, commentDate}}
            const response = await request.json();
            
            if (response.status == 200) {
                // update comments
                createComment(response.comment);
            } else {
                console.log(response);
            }
        });

        // create add comment wrapper
        const addComment = document.createElement('div');
        addComment.setAttribute('class', 'add-comment');
        // add comment input, comment button to comment wrapper
        addComment.appendChild(commentInpt);
        addComment.appendChild(commentBtn);
        // add comment wrapper to post footer
        postFooter.appendChild(addComment);
    }

    // create a votes container <- [vote up, vote down]
    const voteContainer = document.createElement('div');
    voteContainer.setAttribute('class', 'vote-container');    
    // add post author and post date to post header
    postHeader.appendChild(postAuthor);
    postHeader.appendChild(date);

    postAuthor.appendChild(authorImg);
    postAuthor.appendChild(authorName);

    // adding post content to  post
    postContent.appendChild(content);
    // adding votes to votes container
    voteContainer.appendChild(upVote);
    voteContainer.appendChild(downVote);
    //  adding votes container to postfooter
    postFooter.prepend(voteContainer);
    // check if post published by current user
    if (current_user() == post.userid) {
        
        // create archive button and a signed postid
        const archiveBtn = document.createElement('button');
        archiveBtn.setAttribute('class', 'archiveBtn');
        archiveBtn.setAttribute('postid', String(post.id));
        archiveBtn.innerHTML = `<i class="fa-solid fa-box-archive"></i>`

        // if current user click archive post button
        archiveBtn.addEventListener('click', async (e) => {
            const postid = archiveBtn.getAttribute('postid');
            // update post status on backend
            const request = await fetch('http://127.0.0.1:5000/archive_post', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    post_id: postid,
                })
            });
            // {message, status, postid}
            const response = await request.json();
            if (response.status == 200) {
                // remove post from homepage and active posts
                archivePost(response.postid);
            }
        });
        // create delete button and a signed post id
        const deleteBtn = document.createElement('button');
        deleteBtn.setAttribute('class', 'deleteBtn');
        deleteBtn.setAttribute('postid', String(post.id));
        deleteBtn.innerHTML = `<i class="fa-solid fa-trash"></i>`;

        // if current user clicked delete button
        deleteBtn.addEventListener('click', async (e) => {
            const postid = deleteBtn.getAttribute('postid');
            
            // delete post from backend
            const request = await fetch('http://127.0.0.1:5000/delete_post', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    post_id: postid,
                })
            })
            // {message, status, isdeleted}
            const response = await request.json();
            if (response.status == 200) {
                // remove post from html
                deletePost(postid);
            }
        });

        // create container for archive and delete button
        const archiveContainer = document.createElement('div');
        archiveContainer.setAttribute('class', 'archive-container');

        // add archive and delete buttons to container
        archiveContainer.appendChild(archiveBtn);
        archiveContainer.appendChild(deleteBtn);

        // add archive and delete buttons container to postfooter
        postFooter.appendChild(archiveContainer);
    }

    // create post comments
    const comments = get_comments(post.comments);

    comments.classList.add('comments');
    comments.setAttribute('id', 'comments');

    if (post.comments.length  == 0) {
        comments.classList.add('hide');
    }

    // add postheader, postcontent post comment to post wrapper
    mainPost.appendChild(postHeader);
    mainPost.appendChild(postContent);
    mainPost.appendChild(postFooter);
    mainPost.appendChild(comments);

    // add post wrapper to feed "posts container"
    feed.prepend(mainPost);
    
}

// remove archived post from posts
function archivePost(postid) {
    const post = document.querySelector(`.post[postid="${postid}"]`);
    post.remove();
}

// remove deleted post form posts
function deletePost(postid) {
    console.log(postid);
    const post = document.querySelector(`.post[postid="${postid}"]`);
    post.remove();
}


export { addPost }