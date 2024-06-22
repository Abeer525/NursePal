from flask import (
    Blueprint,
    request,
    jsonify,
    redirect,
    url_for,
    session,
    render_template,
)
from passlib.hash import bcrypt
from . import db

login_bp = Blueprint("login", __name__)

# Access the collections
hr_collection = db["hr"]
nurses_collection = db["nurses"]
patients_collection = db["patients"]


@login_bp.route("/login", methods=["POST"])
def hr_login():
    try:
        data = request.get_json()
        custom_id = data.get("customId")
        password = data.get("password")

        if not (custom_id and password):
            return jsonify({"error": "Custom ID and password are required."}), 400

        hr = hr_collection.find_one({"customId": custom_id})
        if not hr:
            return jsonify({"error": "Invalid custom ID or password."}), 401

        hashed_password = hr["password"]

        if bcrypt.verify(password, hashed_password):
            session["custom_id"] = custom_id
            return jsonify({"message": "Login successful!", "hrId": custom_id}), 200
        else:
            return jsonify({"error": "Invalid custom ID or password."}), 401

    except Exception as e:
        return jsonify({"error": f"Failed to login. Error: {str(e)}"}), 500


@login_bp.route("/login")
def login():
    return render_template("login.html")


@login_bp.route("/logout", methods=["GET"])
def logout():
    session.clear()
    return redirect(url_for("login.login"))


@login_bp.route("/counts", methods=["GET"])
def get_collection_counts():
    try:
        # Calculate counts for each collection
        hr_count = hr_collection.count_documents({})
        nurses_count = nurses_collection.count_documents({})
        patients_count = patients_collection.count_documents({})

        # Return counts as JSON response
        return (
            jsonify(
                {
                    "hr_count": hr_count,
                    "nurses_count": nurses_count,
                    "patients_count": patients_count,
                }
            ),
            200,
        )
    except Exception as e:
        return jsonify({"error": f"Failed to retrieve counts. Error: {str(e)}"}), 500
