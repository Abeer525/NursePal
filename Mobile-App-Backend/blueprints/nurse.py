from flask import Blueprint, request, jsonify, send_from_directory
from pymongo import MongoClient
from passlib.hash import bcrypt
from werkzeug.utils import secure_filename
import os
import base64

import io
import logging

import traceback

nurse_bp = Blueprint("nurse", __name__)

# MongoDB connection setup
client = MongoClient("mongodb://localhost:27017/")
db = client["medical_database"]
collection = db["nurses"]


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@nurse_bp.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        customId = data.get("customId")
        password = data.get("password")

        if not (customId and password):
            return jsonify({"error": "Custom ID and password are required."}), 400

        nurse = collection.find_one({"customId": customId})
        if not nurse:
            return jsonify({"error": "Invalid custom ID or password."}), 401

        hashed_password = nurse["password"]

        if bcrypt.verify(password, hashed_password):
            full_name = nurse["fullName"]
            nurse_id = nurse["customId"]
            return (
                jsonify(
                    {
                        "message": "Login successful!",
                        "fullName": full_name,
                        "nurseId": nurse_id,
                    }
                ),
                200,
            )
        else:
            return jsonify({"error": "Invalid custom ID or password."}), 401

    except Exception as e:
        return jsonify({"error": f"Failed to login. Error: {str(e)}"}), 500


@nurse_bp.route("/api/nurse/email/<custom_id>", methods=["GET"])
def get_nurse_email(custom_id):
    try:
        nurse = collection.find_one({"customId": custom_id})
        if not nurse:
            return jsonify({"error": "Nurse not found."}), 404

        nurse_email = nurse["email"]
        return jsonify({"email": nurse_email}), 200

    except Exception as e:
        return (
            jsonify({"error": f"Failed to retrieve nurse email. Error: {str(e)}"}),
            500,
        )


@nurse_bp.route("/api/nurse/fullname/<custom_id>", methods=["GET"])
def get_nurse_fullname(custom_id):
    try:
        nurse = collection.find_one({"customId": custom_id})
        if not nurse:
            return jsonify({"error": "Nurse not found."}), 404

        nurse_fullname = nurse["fullName"]
        return jsonify({"fullName": nurse_fullname}), 200

    except Exception as e:
        return (
            jsonify({"error": f"Failed to retrieve nurse full name. Error: {str(e)}"}),
            500,
        )


@nurse_bp.route("/api/nurse/phonenumber/<custom_id>", methods=["GET"])
def get_nurse_phonenumber(custom_id):
    try:
        nurse = collection.find_one({"customId": custom_id})
        if not nurse:
            return jsonify({"error": "Nurse not found."}), 404

        nurse_phonenumber = nurse["phoneNumber"]
        return jsonify({"phoneNumber": nurse_phonenumber}), 200

    except Exception as e:
        return (
            jsonify(
                {"error": f"Failed to retrieve nurse phone number. Error: {str(e)}"}
            ),
            500,
        )


@nurse_bp.route("/api/nurse/dateofbirth/<custom_id>", methods=["GET"])
def get_nurse_dateofbirth(custom_id):
    try:
        nurse = collection.find_one({"customId": custom_id})
        if not nurse:
            return jsonify({"error": "Nurse not found."}), 404

        nurse_dateofbirth = nurse["dateOfBirth"]
        return jsonify({"dateOfBirth": nurse_dateofbirth}), 200

    except Exception as e:
        return (
            jsonify(
                {"error": f"Failed to retrieve nurse date of birth. Error: {str(e)}"}
            ),
            500,
        )


@nurse_bp.route("/api/nurse/change-password", methods=["POST"])
def change_password():
    try:
        data = request.get_json()
        custom_id = data.get("customId")
        current_password = data.get("password")
        new_password = data.get("newPassword")

        if not custom_id or not current_password or not new_password:
            return jsonify({"error": "Invalid request parameters"}), 400

        nurse = collection.find_one({"customId": custom_id})
        if not nurse:
            return jsonify({"error": "Nurse not found"}), 404

        stored_password = nurse.get("password", "")
        if not bcrypt.verify(current_password, stored_password):
            return jsonify({"error": "Incorrect current password"}), 401

        new_password_hash = bcrypt.hash(new_password)
        collection.update_one(
            {"customId": custom_id}, {"$set": {"password": new_password_hash}}
        )

        return jsonify({"message": "Password updated successfully"}), 200

    except Exception as e:
        return jsonify({"error": f"Failed to update password. Error: {str(e)}"}), 500


@nurse_bp.route("/api/nurse/shift/<custom_id>", methods=["GET"])
def get_nurse_shift(custom_id):
    try:
        nurse = collection.find_one({"customId": custom_id})
        if not nurse:
            return jsonify({"error": "Nurse not found."}), 404

        nurse_shift = nurse["shift"]
        return jsonify({"shift": nurse_shift}), 200

    except Exception as e:
        return (
            jsonify({"error": f"Failed to retrieve nurse shift. Error: {str(e)}"}),
            500,
        )


@nurse_bp.route("/api/nurse/gender/<custom_id>", methods=["GET"])
def get_nurse_gender(custom_id):
    try:
        nurse = collection.find_one({"customId": custom_id})
        if not nurse:
            return jsonify({"error": "Nurse not found."}), 404

        nurse_gender = nurse["gender"]
        return jsonify({"gender": nurse_gender}), 200

    except Exception as e:
        return (
            jsonify({"error": f"Failed to retrieve nurse gender. Error: {str(e)}"}),
            500,
        )


@nurse_bp.route("/api/nurse/update/<custom_id>", methods=["PUT"])
def update_nurse_profile(custom_id):
    try:
        data = request.json
        print(f"Received data: {data}")

        full_name = data.get("fullName")
        email = data.get("email")
        phone_number = data.get("phoneNumber")
        nursing_type = data.get("nursingType")
        shift = data.get("shift")
        gender = data.get("gender")
        date_of_birth = data.get("dateOfBirth")

        if not custom_id:
            return jsonify({"error": "Custom ID is required"}), 400

        print(f"Updating nurse with ID: {custom_id}")

        result = collection.update_one(
            {"customId": custom_id},
            {
                "$set": {
                    "fullName": full_name,
                    "email": email,
                    "phoneNumber": phone_number,
                    "nursingType": nursing_type,
                    "shift": shift,
                    "gender": gender,
                    "dateOfBirth": date_of_birth,
                }
            },
        )

        print(f"Update result: {result.raw_result}")

        if result.matched_count:
            return jsonify({"message": "Profile updated successfully"}), 200
        else:
            return jsonify({"error": "Failed to update nurse profile"}), 500

    except Exception as e:
        print(f"Error updating nurse profile: {traceback.format_exc()}")
        return jsonify({"error": "An error occurred while updating the profile"}), 500
