from flask import Flask
from .nurse import nurse_bp
from .add_patient import add_patient_bp
from .patient import patient_blueprint  # Corrected import name
from .monitor import monitor_blueprint


def create_app():
    app = Flask(__name__)

    app.register_blueprint(nurse_bp)
    app.register_blueprint(patient_blueprint)  # Corrected blueprint name
    app.register_blueprint(add_patient_bp)
    app.register_blueprint(monitor_blueprint)
    return app
