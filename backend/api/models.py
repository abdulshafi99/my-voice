from datetime import datetime
from api import db


# user Table in database
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(60), nullable=False, unique=True)
    email = db.Column(db.String(50), nullable=False, unique=True)
    password = db.Column(db.String(16), nullable=False, unique=False)
    role = db.Column(db.String(30), nullable=False, unique=False, default='Trainee')
    image_file = db.Column(db.String(20), nullable=False, default='default.jpg')
    # session = db.Column(db.String(16), nullable=False, default='')

    # Build relationship between User and Posts  one:many
    posts = db.relationship('Post', backref='author', lazy=True)

    # Build relationship between User and Comments  one:many
    comments = db.relationship('Comment', backref='author', lazy=True)

    # Build relationship between User and votes  one:many
    votes = db.relationship('Vote', backref='author', lazy=True)

    # how user object will be printed
    def __repr__(self):
        return f"User(username='{self.username}', email={self.email}', role={self.role})"

# post table in database
class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    status = db.Column(db.Boolean, nullable=False, default=False)
    post_date = db.Column(db.DateTime, default= datetime.now)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    # Build relationship between Post and Comments  one:many
    comments = db.relationship('Comment', backref='post', lazy=True)

    # Build relationship between Post and Votes  one:many
    votes = db.relationship('Vote', backref='post', lazy=True)


    def __repr__(self):
        return f"Post(content='{self.content}', date={self.post_date}', status={self.status}, author={self.user_id})"

# comment table in database
class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'), nullable=False)
    comment_date = db.Column(db.DateTime, default=datetime.now)

    # how comment object will be printed
    def __repr__(self):
        return f"Comment(content='{self.content}', username={self.user_id}', post={self.post_id}, date={self.comment_date})"

# vote table in database
class Vote(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    vote_type = db.Column(db.Boolean, nullable=False)

    # how vote object will be printed
    def __repr__(self):
        return f"Vote(post='{self.post_id}', username={self.user_id}', vote={'Vote Up' if self.vote_type == True else 'Vote Down'})"
