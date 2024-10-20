from api import app, db
from api import database
from sqlalchemy_utils import database_exists

if not database_exists(f'sqlite:///instance/database'):
    database.create_database()

if __name__ == '__main__':
    app.run()
