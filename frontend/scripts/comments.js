
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

function createComment(comment) {
    const comments = document.querySelector(`.post[postid="${comment.postid}"] > .comments`);
    comments.classList.remove('hide');
    

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

export {
    get_comments,
    createComment
}