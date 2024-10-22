
// add vote to database
// {postid, key, vote[voteup, votedown]}
async function sendVote(vote) {
    // send vote to backend and store it
    const request = await fetch('http://127.0.0.1:5000/add_vote', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(vote)
    });
    // { message, status, votes: {upvotes, downvotes}}
    const response = await request.json();

    return response;

}

// add votes on the frontend
// postid, {voteup, votedown}
function addVotes(postid, votes) {
    // select vote up, vote down buttons by post id 
    const upvotes = document.querySelector(`.post-footer[postid="${postid}"] > .vote-container > button[type="upvote"]`)
    const downvotes = document.querySelector(`.post-footer[postid="${postid}"] > .vote-container > button[type="downvote"]`)

    // add vote up, vote down number to buttons
    upvotes.innerHTML = `Upvote  <span class='votes'>${votes.upvote}</span>`
    downvotes.innerHTML = `Downvote  <span class='votes'>${votes.downvote}</span>`
}


export {
    sendVote,
    addVotes
}