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
                'key': key
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

@app.route('/current_user', methods=['POST'])
def current_user():
    if request.method == 'POST':
        data = request.get_json()
        email = session[data['key']]
        user = User.query.filter_by(email=email).first()
        response = {
            'message': 'Ok!',
            'status': 200,
            'username': user.username
        }
    else:
        response = {
            'message': 'Something wrong!',
            'status': 401
        }
    return jsonify(response)
    


# Endpoint: for returnning all posts
@app.route('/get_posts', methods=['GET'])
def get_posts():

    data = Post.query.all()
    posts = []
    for record in data:
        post = {
            'id': record.id,
            'content': record.content,
            'status': record.status,
            'post_date': record.post_date,
            'author': record.author.username,
        }
        print(post)
        posts.append(post)

        posts.sort(key=lambda post: post['post_date'], reverse=True)

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
                'content': post.content,
                'status': post.status,
                'post_date': post.post_date,
                'author': post.author.username,
            },
            'message': 'Post created successfully and added to database',
            'status' : 200
        })
    else:
        return jsonify({
            'message': 'Unautherized access',
            'statsu': 401
        })


# Endpoint: for commenting
@app.route('/comment')
def comment():
    pass

# Endpoint: for voting
@app.route('/vote')
def vote():
    pass

@app.route('/home')
def home():
    return "<h1> hello Mustafa</h1>"