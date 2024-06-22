import os
import logging
from flask import Flask
from flask_cors import CORS
from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["medical_database"]


def create_app():
    app = Flask(__name__)
    app.secret_key = "your_secret_key"
    CORS(app)

    UPLOAD_FOLDER = os.path.join(app.root_path, "static", "uploads")
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
    app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

    # Set the logging level to INFO
    app.logger.setLevel(logging.INFO)

    # Configure the logger to print to the terminal
    stream_handler = logging.StreamHandler()
    app.logger.addHandler(stream_handler)

    from .login import login_bp
    from .hr import hr_bp
    from .nurse import nurse_bp
    from .patients import patients_bp
    from .search import search_bp
    from .profiles import profile_bp

    app.register_blueprint(login_bp)
    app.register_blueprint(hr_bp)
    app.register_blueprint(nurse_bp)
    app.register_blueprint(patients_bp)
    app.register_blueprint(search_bp)
    app.register_blueprint(profile_bp)

    return app
