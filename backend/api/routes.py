from flask import jsonify, request, session, redirect, url_for, render_template
from api import app, db
import secrets
from datetime import datetime
from api.models import User, Post, Comment, Vote

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
            new_session = secrets.token_hex(16)
            session[data['email']] = new_session
            response = {
                'message': 'User Loged in successfuly',
                'status': 201,
                'token': user.email
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
        session.pop(data['token'], None)
    return jsonify({
        'message': 'Token removed from backend',
        'status': 200
    })

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


    return jsonify(posts)



# Endpoint: for creating new post
@app.route('/create_post')
def create_post():
    pass


# Endpoint: for commenting
@app.route('/comment')
def comment():
    pass

# Endpoint: for voting
@app.route('/vote')
def vote():
    pass
