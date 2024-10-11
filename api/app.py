from flask import Flask
from flask_sqlalchemy import SQLAlchemy


# Create The app
app = Flask(__name__)
# Configure SQLite database
app.config['SQLALCHEMY_DATABASE_UR'] = 'sqlite:///database.db'
db = SQLAlchemy(app)

@app.route('/')
@app.route('/home')
@app.route('/index')
def home():
    return '<h1>Home Page</h1>'

if __name__ == '__main__':
    app.run()