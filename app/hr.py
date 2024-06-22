from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from passlib.hash import bcrypt
import os
import random
import string
import traceback
from . import db

hr_bp = Blueprint("hr", __name__)
collection = db["hr"]


def generate_custom_hr_id(full_name):
    first_two_letters = "HR"
    third_letter = full_name[0].upper()
    random_numbers = "".join(random.choices(string.digits, k=5))
    custom_hr_id = f"{first_two_letters}{third_letter}{random_numbers}"
    return custom_hr_id


@hr_bp.route("/register_hr", methods=["POST"])
def register_hr():
    try:
        data = request.form
        file = request.files["image"]

        full_name = data.get("fullName")
        email = data.get("email")
        phone_number = data.get("phoneNumber")
        department = data.get("department")
        gender = data.get("gender")
        if not (full_name and email and phone_number and department and file):
            return (
                jsonify(
                    {"error": "Incomplete data. Please provide all required fields."}
                ),
                400,
            )

        existing_hr = collection.find_one({"email": email})
        if existing_hr:
            return (
                jsonify(
                    {
                        "error": "This email is already registered. Please use a different email."
                    }
                ),
                400,
            )

        filename = secure_filename(file.filename)
        file.save(os.path.join(hr_bp.root_path, "static", "uploads", filename))

        custom_hr_id = generate_custom_hr_id(full_name)
        hashed_password = bcrypt.hash("11111")

        hr_data = {
            "customId": custom_hr_id,
            "fullName": full_name,
            "email": email,
            "phoneNumber": phone_number,
            "department": department,
            "gender": gender,
            "password": hashed_password,
            "image": filename,
        }

        result = collection.insert_one(hr_data)
        if result.inserted_id:
            return (
                jsonify({"message": "HR registered successfully!", "id": custom_hr_id}),
                201,
            )
        else:
            return jsonify({"error": "Failed to register HR."}), 500

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "Failed to register HR. Please try again."}), 500


@hr_bp.route("/profile/<custom_id>", methods=["GET"])
def hr_profile(custom_id):
    try:
        hr = collection.find_one({"customId": custom_id})
        if not hr:
            return jsonify({"error": "HR not found."}), 404

        full_name = hr.get("fullName")
        email = hr.get("email")
        phone_number = hr.get("phoneNumber")
        department = hr.get("department")
        gender = hr.get("gender")
        image = hr.get("image")

        return (
            jsonify(
                {
                    "message": "HR profile retrieved successfully!",
                    "fullName": full_name,
                    "customId": custom_id,
                    "email": email,
                    "phoneNumber": phone_number,
                    "department": department,
                    "gender": gender,
                    "image": image,
                }
            ),
            200,
        )

    except Exception as e:
        return (
            jsonify({"error": f"Failed to retrieve HR profile. Error: {str(e)}"}),
            500,
        )


@hr_bp.route("/api/hr/change-password/<custom_id>", methods=["POST"])
def change_hr_password(custom_id):
    try:
        data = request.get_json()
        current_password = data.get("currentPassword")
        new_password = data.get("newPassword")

        if not current_password or not new_password:
            return (
                jsonify({"error": "Current password and new password are required."}),
                400,
            )

        hr = collection.find_one({"customId": custom_id})
        if not hr:
            return jsonify({"error": "HR not found."}), 404

        stored_password = hr.get("password", "")

        if not bcrypt.verify(current_password, stored_password):
            return jsonify({"error": "Incorrect current password."}), 401

        new_password_hash = bcrypt.hash(new_password)
        collection.update_one(
            {"customId": custom_id}, {"$set": {"password": new_password_hash}}
        )

        return jsonify({"message": "Password updated successfully."}), 200

    except Exception as e:
        return jsonify({"error": f"Failed to update password. Error: {str(e)}"}), 500

    @hr_bp.route("/profile/<custom_id>", methods=["GET"])
    def get_profile(custom_id):
        profile = hr_collection.find_one({"customId": custom_id})

    if profile:
        return jsonify(
            {
                "fullName": profile.get("fullName"),
                "email": profile.get("email"),
                "phoneNumber": profile.get("phoneNumber"),
                "department": profile.get("department"),
                "gender": profile.get("gender"),
                "image": profile.get("image"),
            }
        )
    else:
        return jsonify({"error": "Profile not found"}), 404


# @hr_bp.route("/api/hr/update", methods=["POST"])
# def update_hr_profile():
#     data = request.json
#     custom_id = data.get("customId")
#     full_name = data.get("fullName")
#     email = data.get("email")
#     phone_number = data.get("phoneNumber")
#     department = data.get("department")
#     gender = data.get("gender")

#     if not custom_id:
#         return jsonify({"error": "Custom ID is required"}), 400

#     result = collection.update_one(
#         {"customId": custom_id},
#         {
#             "$set": {
#                 "fullName": full_name,
#                 "email": email,
#                 "phoneNumber": phone_number,
#                 "department": department,
#                 "gender": gender,
#             }
#         },
#     )

#     if result.matched_count:
#         return jsonify({"message": "Profile updated successfully"})
#     else:
#         return jsonify({"error": "Failed to update HR profile"}), 500


@hr_bp.route("/api/hr/update/<custom_id>", methods=["POST"])
def update_hr_profile(custom_id):
    data = request.json
    full_name = data.get("fullName")
    email = data.get("email")
    phone_number = data.get("phoneNumber")
    department = data.get("department")
    gender = data.get("gender")

    if not custom_id:
        return jsonify({"error": "Custom ID is required"}), 400

    result = collection.update_one(
        {"customId": custom_id},
        {
            "$set": {
                "fullName": full_name,
                "email": email,
                "phoneNumber": phone_number,
                "department": department,
                "gender": gender,
            }
        },
    )

    if result.matched_count:
        return jsonify({"message": "Profile updated successfully"})
    else:
        return jsonify({"error": "Failed to update HR profile"}), 500
