from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from passlib.hash import bcrypt
import os
import random
import string
import traceback
from . import db
from datetime import datetime, timedelta
import matplotlib.pyplot as plt

patients_bp = Blueprint("patients", __name__)
patients_collection = db["patients"]

UPLOAD_FOLDER = os.path.join(patients_bp.root_path, "static", "uploads")
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def generate_custom_patient_id(full_name):
    first_letter = full_name[0].upper()
    random_numbers = "".join(random.choices(string.digits, k=6))
    custom_patient_id = f"P{first_letter}{random_numbers}"
    return custom_patient_id


@patients_bp.route("/register_patient", methods=["POST"])
def register_patient():
    try:
        data = request.form
        file = request.files.get("image")

        full_name = data.get("name")
        email = data.get("email")
        phone_number = data.get("phoneNumber")
        address = data.get("address")
        medical_history = data.get("medicalHistory")

        if not (full_name and email and phone_number and address and medical_history):
            return (
                jsonify(
                    {"error": "Incomplete data. Please provide all required fields."}
                ),
                400,
            )

        if not file or not allowed_file(file.filename):
            return jsonify({"error": "File type not allowed or no file uploaded."}), 400

        existing_patient = patients_collection.find_one({"email": email})
        if existing_patient:
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

        custom_patient_id = generate_custom_patient_id(full_name)
        hashed_password = bcrypt.hash("11111")

        patient_data = {
            "customId": custom_patient_id,
            "name": full_name,
            "email": email,
            "phoneNumber": phone_number,
            "address": address,
            "medicalHistory": medical_history,
            "password": hashed_password,
            "image": filename,
            "created_at": datetime.utcnow() - timedelta(days=random.randint(0, 29)),
        }

        result = patients_collection.insert_one(patient_data)
        if result.inserted_id:
            return (
                jsonify(
                    {
                        "message": "Patient registered successfully!",
                        "id": custom_patient_id,
                    }
                ),
                201,
            )
        else:
            return jsonify({"error": "Failed to register patient."}), 500

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "Failed to register patient. Please try again."}), 500


@patients_bp.route("/api/patients", methods=["GET"])
def get_patients():
    try:
        patients = list(patients_collection.find({}, {"_id": 0, "password": 0}))
        return jsonify(patients), 200
    except Exception as e:
        return jsonify({"error": f"Failed to fetch patients. Error: {str(e)}"}), 500


@patients_bp.route("/api/patient/update", methods=["POST"])
def update_patient():
    try:
        data = request.get_json()
        custom_id = data.get("customId")

        if not custom_id:
            return jsonify({"error": "Patient ID is required."}), 400

        update_fields = {k: v for k, v in data.items() if k != "customId"}
        if not update_fields:
            return jsonify({"error": "No fields to update."}), 400

        result = patients_collection.update_one(
            {"customId": custom_id}, {"$set": update_fields}
        )
        if result.modified_count > 0:
            return jsonify({"message": "Patient updated successfully!"}), 200
        else:
            return jsonify({"error": "Patient not found or no changes made."}), 404

    except Exception as e:
        return jsonify({"error": f"Failed to update patient. Error: {str(e)}"}), 500


@patients_bp.route("/api/patient_details", methods=["GET"])
def get_patient_details():
    try:
        patients = list(
            patients_collection.find(
                {},
                {
                    "_id": 0,
                    "name": 1,
                    "roomNumber": 1,
                    "reasonForVisit": 1,
                    "gender": 1,
                },
            )
        )

        # Convert cursor to a list of dictionaries
        patient_list = []
        for patient in patients:
            patient_list.append(
                {
                    "name": patient.get("name", ""),
                    "room_number": patient.get("roomNumber", ""),
                    "reason_for_visit": patient.get("reasonForVisit", ""),
                    "gender": patient.get("gender", ""),
                }
            )

        return jsonify(patient_list), 200
    except Exception as e:
        return (
            jsonify({"error": f"Failed to fetch patient details. Error: {str(e)}"}),
            500,
        )
