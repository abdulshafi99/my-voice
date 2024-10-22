


// add comments to post
function get_comments(comments) {
    // the comments wrapper
    const commentsContainer = document.createElement('div');

    // loop over very comment on comments
    // create the comment and append it on comments wrapper
    for (const comment of comments) {

        // create a comment container
        const commentContainer = document.createElement('div');
        commentContainer.setAttribute('class', 'comment');
        commentContainer.setAttribute('id', 'comment');

        // add comment owner image
        const img = document.createElement('img');
        img.setAttribute('src', 'assets/default-user.png');

        // create comment body [comment content - comment owner]
        const commentCard = document.createElement('div');
        commentCard.setAttribute('class', 'comment-card');
        commentCard.setAttribute('id', 'commentCard');

        // comment owner
        const h3 = document.createElement('h3');
        h3.setAttribute('id', 'comment-author');
        h3.innerText = comment.username

        // comment content
        const content = document.createElement('p');
        content.setAttribute|('class', 'comment-content');
        content.innerText = comment.content;

        // add comment owner and content to body
        commentCard.appendChild(h3);
        commentCard.appendChild(content);

        // add owner image and comment body to comment container  
        commentContainer.appendChild(img);
        commentContainer.appendChild(commentCard);

        // add comment container to comments warper
        commentsContainer.appendChild(commentContainer);
    }
    // return all wrapped comments
    return commentsContainer;
}

// create new comment and add it to post's comments
function createComment(comment) {   // comment {postid, userid, content, comment_date}
    
    // get post's comments wrapper section  by post id
    const comments = document.querySelector(`.post[postid="${comment.postid}"] > .comments`);

    // remove hide class to show the comments section
    comments.classList.remove('hide');
    
    // create a comment container
    const commentContainer = document.createElement('div');
    commentContainer.setAttribute('class', 'comment');
    commentContainer.setAttribute('id', 'comment');

    // add comment owner image
    const img = document.createElement('img');
    img.setAttribute('src', 'assets/default-user.png');

    // create comment body [comment content - comment owner] 
    const commentCard = document.createElement('div');
    commentCard.setAttribute('class', 'comment-card');
    commentCard.setAttribute('id', 'commentCard');

    // comment owner
    const h3 = document.createElement('h3');
    h3.setAttribute('id', 'comment-author');
    h3.innerText = comment.username

    // comment content
    const content = document.createElement('p');
    content.setAttribute|('class', 'comment-content');
    content.innerText = comment.content;
    
    // add comment owner and content to body
    commentCard.appendChild(h3);
    commentCard.appendChild(content);
    
    // add owner image and comment body to comment container
    commentContainer.appendChild(img);
    commentContainer.appendChild(commentCard);

    // add comment container to comments warper
    comments.append(commentContainer);
    
}

export {
    get_comments,
    createComment
}