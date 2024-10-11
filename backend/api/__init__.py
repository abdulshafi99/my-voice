from flask import Flask
from flask_sqlalchemy import SQLAlchemy


# Create The app
app = Flask(__name__)
# Configure SQLite database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
db = SQLAlchemy(app)

if __name__ == '__main__':
    app.run()