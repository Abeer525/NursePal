from flask import Blueprint, request, jsonify
from pymongo import MongoClient
import random
import string

add_patient_bp = Blueprint("add_patient", __name__)

# MongoDB connection setup
client = MongoClient("mongodb://localhost:27017/")
db = client["medical_database"]
collection = db["patients"]


def generate_custom_id(name):
    first_letter = name[0].upper()
    random_numbers = "".join(random.choices(string.digits, k=6))
    custom_id = f"P{first_letter}{random_numbers}"
    while collection.find_one({"customId": custom_id}):
        random_numbers = "".join(random.choices(string.digits, k=6))
        custom_id = f"P{first_letter}{random_numbers}"
    return custom_id


@add_patient_bp.route("/api/patients", methods=["POST"])
def add_patient():
    try:
        data = request.get_json()
        name = data.get("name")
        custom_id = generate_custom_id(name)

        inserted_patient = collection.insert_one(
            {
                "customId": custom_id,
                "name": name,
                "fatherName": data.get("fatherName"),
                "motherName": data.get("motherName"),
                "dob": data.get("dob"),
                "gender": data.get("gender"),
                "maritalStatus": data.get("maritalStatus"),
                "childrenStatus": data.get("childrenStatus"),
                "phone": data.get("phone"),
                "emergencyPhone": data.get("emergencyPhone"),
                "email": data.get("email"),
                "roomNumber": data.get("roomNumber"),
                "bedType": data.get("bedType"),
                "medicalHistory": data.get("medicalHistory"),
                "reasonForVisit": data.get("reasonForVisit"),
                "symptoms": data.get("symptoms"),
                "vitalSigns": data.get("vitalSigns"),
                "diagnosticTests": data.get("diagnosticTests"),
                "treatmentPlan": data.get("treatmentPlan"),
                "insuranceStatus": data.get("insuranceStatus"),
                "insurancePolicy": data.get("insurancePolicy"),
                "insurerName": data.get("insurerName"),
                "doctorName": data.get("doctorName"),
                "pills": data.get("pills"),
                "admissionDate": data.get("admissionDate"),
                "dischargeDate": data.get("dischargeDate"),
                "lifestyleChoices": data.get("lifestyleChoices"),
                "additionalComments": data.get("additionalComments"),
            }
        )

        if inserted_patient.inserted_id:
            return (
                jsonify(
                    {
                        "message": "Patient data added successfully!",
                        "customId": custom_id,
                    }
                ),
                201,
            )
        else:
            return jsonify({"message": "Failed to add patient data."}), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500
