# blueprints/patient.py

from flask import Blueprint, request, jsonify
from pymongo import MongoClient

patient_blueprint = Blueprint("patient_bp", __name__)

# MongoDB connection setup
client = MongoClient("mongodb://localhost:27017/")
db = client["medical_database"]
collection = db["patients"]


@patient_blueprint.route("/api/patients", methods=["GET"])
def get_patients():
    try:
        patients = list(collection.find())
        patients_list = [
            {
                "customId": patient["customId"],
                "name": patient["name"],
                "fatherName": patient.get("fatherName", ""),
                "motherName": patient.get("motherName", ""),
                "dob": patient.get("dob", ""),
                "gender": patient["gender"],
                "maritalStatus": patient.get("maritalStatus", ""),
                "childrenStatus": patient.get("childrenStatus", ""),
                "phone": patient.get("phone", ""),
                "emergencyPhone": patient.get("emergencyPhone", ""),
                "email": patient.get("email", ""),
                "roomNumber": patient.get("roomNumber", ""),
                "bedType": patient.get("bedType", ""),
                "medicalHistory": patient.get("medicalHistory", ""),
                "reasonForVisit": patient.get("reasonForVisit", ""),
                "symptoms": patient.get("symptoms", ""),
                "vitalSigns": patient.get("vitalSigns", ""),
                "diagnosticTests": patient.get("diagnosticTests", ""),
                "treatmentPlan": patient.get("treatmentPlan", ""),
                "insuranceStatus": patient.get("insuranceStatus", ""),
                "insurancePolicy": patient.get("insurancePolicy", ""),
                "insurerName": patient.get("insurerName", ""),
                "doctorName": patient.get("doctorName", ""),
                "pills": patient.get("pills", ""),
                "admissionDate": patient.get("admissionDate", ""),
                "dischargeDate": patient.get("dischargeDate", ""),
                "lifestyleChoices": patient.get("lifestyleChoices", ""),
                "additionalComments": patient.get("additionalComments", ""),
            }
            for patient in patients
        ]

        return jsonify(patients_list), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@patient_blueprint.route("/api/patient/update", methods=["POST"])
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
