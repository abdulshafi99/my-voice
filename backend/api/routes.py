from flask import jsonify, request, redirect, url_for, render_template
from api import app, db, database
import secrets
from datetime import datetime
from api.models import User, Post, Comment, Vote

session = {

}

# Endpoint: to create new users
@app.route('/register', methods=['POST'])
def register():
    # {username, email, role, password}
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if not user:
        user = User(
            username = data['username'],
            email = data['email'],
            role = data['role'],
            password = data['password']
        )
        database.add_user(user)
        # success
        response = {
        'message': 'Data received successfuly, and user registered',
        'status': 201,
    }
    else:
        # failed
        response = {
            'message': 'email already registered!',
            'satsus': 409
        }
    
    return jsonify(response)

# Endpoint: to login users
@app.route('/login', methods=['POST'])
def login():
    # {email, password}
    data = request.get_json()
    
    user = User.query.filter_by(email=data['email']).first()
    # user in exist in database
    if user and user.password == data['password']:
        # create a key for authentication and store it in session dict
        key = secrets.token_hex(16)
        session[key] = data['email']
        
        response = {
            'message': 'User Loged in successfuly',
            'status': 201,
            'key': key,
            'id': user.id
        }
    else:
        response = {
            'message': 'User not Found',
            'status': 401
        }
    return jsonify(response)

# Endpoint: to lougout users
@app.route('/logout', methods=['POST'])
def logout():
    data = request.get_json()
    # {key}
    del session[data['key']]

    return jsonify({
        'message': 'key removed from backend',
        'status': 200
    })

# Endpoint: to check if email stored in database
@app.route('/check_email', methods=['POST'])
def check_email():
    data = request.get_json()
    # { email }
    user = User.query.filter_by(email=data['email']).first()
    # check if user in database
    if user:
        respose = {
            'message': 'Email registered',
            'status': 200
        }
    else:
        respose = {
            'message': 'Email not Registered',
            'status': 409
        }
    return respose

# Endpoint: to check if user authenticated or not
@app.route('/check_auth/<key>', methods=['GET'])
def check_auth(key):
    email = session.get(key)
    user = User.query.filter_by(email=email).first()
    if user:
        return jsonify({
            'message': 'user authenticated',
            'status': 200,
            'is_authenticated': True,
        })
    else:
        return jsonify({
            'message': 'user not authenticated',
            'status': 401,
            'is_authenticated': False,
        })


# Endpoint: to get current user "autheraized user"
@app.route('/current_user', methods=['POST'])
def current_user():
    data = request.get_json()
    email = session[data['key']]
    user = User.query.filter_by(email=email).first()
    if user:
        response = {
            'message': 'Ok!',
            'status': 200,
            'user': {
                'username': user.username,
                'id': user.id
            }
        }
    else:
        response = {
            'message': 'Something wrong!',
            'status': 401
        }
    return jsonify(response)

# Endpoint: to show user data
@app.route('/get_user/<id>')
def get_user(id):
    user = User.query.filter_by(id=id).first()

    if user:
        response = {
            'message': 'user exist',
            'status': 200,
            'user': {
                'username': user.username,
                'email': user.email,
                'role': user.role,
                'join_date': user.join_date
            }
        }
    else:
        response = {
            'message': 'user does not exist',
            'status': 401
        }
    return response


# Endpoint: for returnning all posts
@app.route('/get_posts', methods=['POST'])
def get_posts():
    # {key,}
    data = Post.query.filter_by(status=False)
    key = request.get_json()['key']
    posts = []
    # loop over list of posts
    for record in data:
        post = {
            'id': record.id,
            'userid': record.user_id,
            'content': record.content,
            'status': record.status,
            'post_date': record.post_date,
            'author': record.author.username,
            'comments': record.get_comments(),
            'votes': record.get_votes(),
            'key': key if record.author.email == session[key] else ''
        }
        posts.append(post)
        # sort posts by date
        posts.sort(key=lambda post: post['post_date'], reverse=False)
        
    return jsonify(posts)


# Endpoint: for creating new post
@app.route('/create_post', methods=['POST'])
def create_post():
    if request.method == 'POST':
        data = request.get_json()
        # { key, content }
        # get user
        user = User.query.filter_by(email=session[data['key']]).first()
        # create a post
        post = Post(
            content = data['content'],
            user_id = user.id
        )
        # add post to database
        database.add_post(post)
        return jsonify({
            'post': {
                'id': post.id,
                'userid': post.user_id,
                'key': data['key'],
                'content': post.content,
                'status': post.status,
                'post_date': post.post_date,
                'author': post.author.username,
                'votes': post.get_votes(),
                'comments': post.get_comments()
            },
            'message': 'Post created successfully and added to database',
            'status' : 200
        })
    else:
        return jsonify({
            'message': 'Unautherized access',
            'statsu': 401
        })

@app.route('/delete_post', methods=['POST'])
def delete_post():
    data = request.get_json()

    post_id = data['post_id']
    post = Post.query.filter_by(id=post_id).first()
    
    if post:
        # delete post's comments
        for comment in post.comments:
            database.delete(comment)
        # delete post's votes
        for vote in post.votes:
            database.delete(vote)
        # delete post
        database.delete(post)
        
        return jsonify({
            'message': 'post deleted successfully',
            'status': 200,
            'isdeleted': True
        })
    else:
        return jsonify({
            'message': 'post not found',
            'status': 401,
            'isdeleted': False
        })

# Endpoint: to archive post
@app.route('/archive_post', methods=['POST'])
def archive_post():
    data = request.get_json()
    # { postid }
    post = Post.query.filter_by(id=data['post_id']).first()
    if post:
        post.status = True
        db.session.commit()
        return jsonify({
            'message': 'Post archived successfully',
            'status': 200,
            'postid': post.id
        })
    return jsonify({
        'message': 'Post: Something wrong',
        'status': 401
    })

# get user key
def get_key(email):
    for key, val in session.items():
        if val == session[key]:
            return key
    return ''

# Endpoint: to get user active posts
@app.route('/get_user_posts/<id>')
def get_user_posts(id):
    # get user
    user = User.query.filter_by(id=id).first()
    posts = []
    # add active post to posts
    for record in user.posts:
        if record.status == False:
            post = {
                'id': record.id,
                'userid': record.user_id,
                'content': record.content,
                'status': record.status,
                'post_date': record.post_date,
                'author': record.author.username,
                'comments': record.get_comments(),
                'votes': record.get_votes(),
                'key': get_key(record.author.email)
            }
            posts.append(post)
        # sort posts by create_date
        posts.sort(key=lambda post: post['post_date'], reverse=False)
        
    return jsonify(posts)

# Endpoint: to get archived posts
@app.route('/get_archived_posts/<id>')
def get_archived_posts(id):
    # get user
    user = User.query.filter_by(id=id).first()
    posts = []
    # add archived post to posts
    for record in user.posts:
        if record.status == True:
            post = {
                'id': record.id,
                'userid': record.user_id,
                'content': record.content,
                'status': record.status,
                'post_date': record.post_date,
                'author': record.author.username,
                'comments': record.get_comments(),
                'votes': record.get_votes()
            }
            posts.append(post)
    # sort posts by create_date
    posts.sort(key=lambda post: post['post_date'], reverse=False)
        
    return jsonify(posts)

# Endpoint: for commenting
@app.route('/add_comment', methods=['POST'])
def add_comment():
    data = request.get_json()
    user = User.query.filter_by(email=session[data['key']]).first()
    # user exists
    if user:
        # create a comment
        comment = Comment(
            content= data['content'],
            user_id = user.id,
            post_id = data['post_id']
        )
        # add comment to database
        database.add_comment(comment)
        response = {
            'message': 'comment added successfuly',
            'status': 200,
            'comment': comment.get_comment()
        }
    else:
        response = {
            'message': "something wrong can't add the comment",
            'status': 401
        }
    return jsonify(response)

# Endpoint: for voting
@app.route('/add_vote', methods=['POST'])
def add_vote():
    data = request.get_json()
    # {key, postid, vote }
    user_id = User.query.filter_by(email= session[data['key']]).first().id
    post_id = data['postid']

    if user_id and post_id:
        vote = Vote.query.filter_by(user_id=user_id, post_id=post_id).first()
        post = Post.query.filter_by(id=post_id).first()
        if vote:
            vote.vote_type = data['vote']
            db.session.commit()
        else:
            vote = Vote(
                post_id = post_id,
                user_id = user_id,
                vote_type = data['vote']
            )
            database.add_vote(vote)
        response = {
            'message': 'vote submitted successfully',
            'status': 200,
            'votes': post.get_votes()
        }
    else:
        response = {
            'message': 'something wrong with votes',
            'status': 401,
        }
    return response
        

