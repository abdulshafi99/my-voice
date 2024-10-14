from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

# Create The app
app = Flask(__name__)
app.config['SECRET_KEY'] = '5791628bb0b13ce0c676dfde280ba245'
# Configure SQLite database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_ECHO'] = True
db = SQLAlchemy(app)
CORS(app)

from api import routes 