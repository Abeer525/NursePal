from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from passlib.hash import bcrypt
import os
import random
import string
import traceback
from . import db

nurse_bp = Blueprint("nurse", __name__)
nurses_collection = db["nurses"]

UPLOAD_FOLDER = os.path.join(nurse_bp.root_path, "static", "uploads")
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def generate_custom_nurse_id(full_name):
    first_letter = full_name[0].upper()
    random_numbers = "".join(random.choices(string.digits, k=6))
    custom_nurse_id = f"N{first_letter}{random_numbers}"
    return custom_nurse_id


@nurse_bp.route("/register_nurse", methods=["POST"])
def register_nurse():
    try:
        data = request.form
        file = request.files.get("image")

        full_name = data.get("fullName")
        email = data.get("email")
        phone_number = data.get("phoneNumber")
        nursing_type = data.get("nursingType")
        shift = data.get("shift")
        gender = data.get("gender")
        date_of_birth = data.get("dateOfBirth")

        if not (
            full_name
            and email
            and phone_number
            and nursing_type
            and shift
            and gender
            and date_of_birth
        ):
            return (
                jsonify(
                    {"error": "Incomplete data. Please provide all required fields."}
                ),
                400,
            )

        if not file or not allowed_file(file.filename):
            return jsonify({"error": "File type not allowed or no file uploaded."}), 400

        existing_nurse = nurses_collection.find_one({"email": email})
        if existing_nurse:
            return (
                jsonify(
                    {
                        "error": "This email is already registered. Please use a different email."
                    }
                ),
                400,
            )

        filename = secure_filename(file.filename)
        file.save(os.path.join(UPLOAD_FOLDER, filename))

        custom_nurse_id = generate_custom_nurse_id(full_name)
        hashed_password = bcrypt.hash("11111")

        nurse_data = {
            "customId": custom_nurse_id,
            "fullName": full_name,
            "email": email,
            "phoneNumber": phone_number,
            "nursingType": nursing_type,
            "shift": shift,
            "gender": gender,
            "dateOfBirth": date_of_birth,
            "password": hashed_password,
            "image": filename,
        }

        result = nurses_collection.insert_one(nurse_data)
        if result.inserted_id:
            return (
                jsonify(
                    {"message": "Nurse registered successfully!", "id": custom_nurse_id}
                ),
                201,
            )
        else:
            return jsonify({"error": "Failed to register nurse."}), 500

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "Failed to register nurse. Please try again."}), 500


@nurse_bp.route("/api/nurse/update", methods=["POST"])
def update_nurse():
    try:
        data = request.get_json()
        custom_id = data.get("customId")

        if not custom_id:
            return jsonify({"error": "Nurse ID is required."}), 400

        update_fields = {k: v for k, v in data.items() if k != "customId"}
        if not update_fields:
            return jsonify({"error": "No fields to update."}), 400

        result = nurses_collection.update_one(
            {"customId": custom_id}, {"$set": update_fields}
        )
        if result.modified_count > 0:
            return jsonify({"message": "Nurse updated successfully!"}), 200
        else:
            return jsonify({"error": "Nurse not found or no changes made."}), 404

    except Exception as e:
        return jsonify({"error": f"Failed to update nurse. Error: {str(e)}"}), 500


@nurse_bp.route("/api/nurses/details", methods=["GET"])
def get_nurses_details():
    try:
        nurses = list(
            nurses_collection.find(
                {}, {"_id": 0, "fullName": 1, "nursingType": 1, "shift": 1, "image": 1}
            )
        )
        return jsonify(nurses), 200
    except Exception as e:
        return jsonify({"error": f"Failed to fetch nurses. Error: {str(e)}"}), 500


@nurse_bp.route("/api/nurses", methods=["GET"])
def get_all_nurses():
    try:
        nurses = list(nurses_collection.find({}, {"_id": 0}))
        return jsonify(nurses), 200
    except Exception as e:
        return jsonify({"error": f"Failed to fetch all nurses. Error: {str(e)}"}), 500
