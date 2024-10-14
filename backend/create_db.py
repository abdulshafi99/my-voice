from api import app, db
from api.models import User, Post, Comment, Vote

# Initalize the database and create the tables
app.app_context().push()
db.create_all()

