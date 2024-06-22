from flask import Blueprint, request, jsonify
from . import db
from bson import ObjectId  # Import ObjectId from bson module

search_bp = Blueprint("search", __name__)
hr_collection = db["hr"]
nurses_collection = db["nurses"]
patients_collection = db["patients"]


@search_bp.route("/search", methods=["GET"])
def search():
    query = request.args.get("q", "")
    if not query:
        return jsonify({"error": "No search query provided."}), 400

    search_regex = {"$regex": query, "$options": "i"}

    hr_results = list(
        hr_collection.find(
            {"$or": [{"fullName": search_regex}, {"customId": search_regex}]}
        )
    )
    nurses_results = list(
        nurses_collection.find(
            {"$or": [{"fullName": search_regex}, {"customId": search_regex}]}
        )
    )
    patients_results = list(
        patients_collection.find(
            {"$or": [{"name": search_regex}, {"customId": search_regex}]}
        )
    )

    # Convert ObjectId to string for JSON serialization
    for result in hr_results:
        result["_id"] = str(result["_id"])
    for result in nurses_results:
        result["_id"] = str(result["_id"])
    for result in patients_results:
        result["_id"] = str(result["_id"])

    results = {"hr": hr_results, "nurses": nurses_results, "patients": patients_results}

    return jsonify(results), 200
