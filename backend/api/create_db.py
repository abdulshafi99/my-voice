from api import app, db
from api.models import User, Post, Comment, Vote

# Initalize the database and create the tables
app.app_context().push()


class Database:
    def __init__(self, database):
        self.database = database
    
    def create_database(self):
        self.database.create_all()

    def drop_database(self):
        self.database.drop_all()

    def add_user(self, user):
        self.database.session.add(user)
        self.database.session.commit()
    
    def add_post(self, post):
        self.database.session.add(post)
        self.database.session.commit()
    
    def add_comment(self, comment):
        self.database.session.add(comment)
        self.database.session.commit()

    def add_vote(self, vote):
        self.database.session.add(vote)
        self.database.session.commit()
    
    def delete(self, obj):
        self.database.session.delete(obj)
        self.database.session.commit()
    

