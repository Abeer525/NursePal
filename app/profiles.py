from flask import Blueprint, jsonify

profile_bp = Blueprint("profile", __name__)

# Assuming the same MongoDB connections and collections as before...


@profile_bp.route("/hr/profile/<custom_id>")
def hr_profile(custom_id):
    # Fetch HR profile data from MongoDB based on custom_id
    hr_profile_data = hr_collection.find_one({"customId": custom_id})
    return jsonify(hr_profile_data)


@profile_bp.route("/nurse/profile/<custom_id>")
def nurse_profile(custom_id):
    # Fetch nurse profile data from MongoDB based on custom_id
    nurse_profile_data = nurse_collection.find_one({"customId": custom_id})
    return jsonify(nurse_profile_data)


@profile_bp.route("/patient/profile/<custom_id>")
def patient_profile(custom_id):
    # Fetch patient profile data from MongoDB based on custom_id
    patient_profile_data = patient_collection.find_one({"customId": custom_id})
    return jsonify(patient_profile_data)
