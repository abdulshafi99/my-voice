from flask import jsonify, request, redirect, url_for, render_template
from api import app, db
import secrets
from datetime import datetime
from api.models import User, Post, Comment, Vote

session = {

}

# Endpoint: to create new users
@app.route('/register', methods=['POST'])
def register():
    if request.method == 'POST':
        data = request.get_json()
        user = User.query.filter_by(email=data['email']).first()
        if not user:
            user = User(
                username = data['username'],
                email = data['email'],
                role = data['role'],
                password = data['password']
            )
            print(user)
            db.session.add(user)
            db.session.commit()
            response = {
            'message': 'Data received successfuly, and user registered',
            'status': 201,
        }
        else:
            response = {
                'message': 'email already registered!',
                'satsus': 409
            }
        
        return jsonify(response)

# Endpoint: to login users
@app.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        data = request.get_json()
        
        user = User.query.filter_by(email=data['email']).first()

        if user and user.password == data['password']:
            key = secrets.token_hex(16)
            session[key] = data['email']
            response = {
                'message': 'User Loged in successfuly',
                'status': 201,
                'key': key,
                'id': user.id
            }
            return jsonify(response)
        else:
            response = {
                'message': 'User not Found',
                'status': 401
            }
            return jsonify(response)

# Endpoint: to lougout users
@app.route('/logout', methods=['POST'])
def logout():
    if request.method == 'POST':
        data = request.get_json()
        print(data)
        del session[data['key']]
    return jsonify({
        'message': 'key removed from backend',
        'status': 200
    })

@app.route('/check_email', methods=['POST'])
def check_email():
    if request.method == 'POST':
        data = request.get_json()
        user = User.query.filter_by(email=data['email'])
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


@app.route('/current_user', methods=['POST'])
def current_user():
    if request.method == 'POST':
        data = request.get_json()
        email = session[data['key']]
        user = User.query.filter_by(email=email).first()
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

# @app.route('/is_current_user', methods=['POST'])
# def is_current_user():
#     data = request.get_json()
#     id = data['id']
#     user = User.query.filter_by(id=id).first()
#     if 

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

    data = Post.query.filter_by(status=False)
    key = request.get_json()['key']
    posts = []
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

        posts.sort(key=lambda post: post['post_date'], reverse=False)
        
    return jsonify(posts)

@app.route('/get_comments', methods=['POST'])
def get_comments():
    pass


# Endpoint: for creating new post
@app.route('/create_post', methods=['POST'])
def create_post():
    if request.method == 'POST':
        data = request.get_json()
        user = User.query.filter_by(email=session[data['key']]).first()
        post = Post(
            content = data['content'],
            user_id = user.id
        )
        db.session.add(post)
        db.session.commit()
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
    print(post_id)
    post = Post.query.filter_by(id=post_id).first()
    if post:
        for comment in post.comments:
            db.session.delete(comment)
        for vote in post.votes:
            db.session.delete(vote)
        db.session.delete(post)
        db.session.commit()
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


@app.route('/archive_post', methods=['POST'])
def archive_post():
    if request.method == 'POST':
        data = request.get_json()
        post = Post.query.filter_by(id=data['post_id']).first()
        if post:
            post.status = True
            db.session.commit()
            return jsonify({
                'message': 'Post archived successfully',
                'status': 200,
                'postid': post.id
            })
    else:
        return jsonify({
            'message': 'Post: Something wrong',
            'status': 401
        })

def get_key(email):
    for key, val in session.items():
        if val == session[key]:
            return key
    return ''

@app.route('/get_user_posts/<id>')
def get_user_posts(id):

    user = User.query.filter_by(id=id).first()
    posts = []
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

        posts.sort(key=lambda post: post['post_date'], reverse=False)
        
    return jsonify(posts)

@app.route('/get_archived_posts/<id>')
def get_archived_posts(id):
    
    user = User.query.filter_by(id=id).first()
    posts = []
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

    posts.sort(key=lambda post: post['post_date'], reverse=False)
        
    return jsonify(posts)

# Endpoint: for commenting
@app.route('/add_comment', methods=['POST'])
def add_comment():
    data = request.get_json()
    print(data)
    user = User.query.filter_by(email=session[data['key']]).first()
    print(user)
    if user:
        comment = Comment(
            content= data['content'],
            user_id = user.id,
            post_id = data['post_id']
        )
        print(comment)
        db.session.add(comment)
        db.session.commit()
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
            db.session.add(vote)
            db.session.commit()
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
        

