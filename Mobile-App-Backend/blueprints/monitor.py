from flask import Flask, jsonify  # create flask app & conv py > json
import mysql.connector  # to communicate w sql
from flask_cors import CORS  # for cross origin to allow req\
from flask import Blueprint

monitor_blueprint = Blueprint("monitor_bp", __name__)
db_config = {
    "host": "localhost",
    "user": "root",
    "password": "",
    "database": "arduino_system",
}


def get_sensor_data():
    try:
        # connect sql db
        connection = mysql.connector.connect(**db_config)

        # execute sql query fetch recent sensor data
        # cursor: obj to interact with db in mysql & allows python to execute & return res
        cursor = connection.cursor()
        cursor.execute(
            "SELECT heart_rate, oxygen_rate FROM sensor_data ORDER BY timestamp DESC LIMIT 1"
        )
        data = cursor.fetchone()

        # close cursor & connection
        cursor.close()
        connection.close()

        if data:
            # conv fetched data to dictionary
            sensor_data = {"heart_rate": data[0], "oxygen_rate": data[1]}
            return sensor_data
        else:
            return None
    except Exception as e:
        print(f"Error fetching sensor data: {e}")
        return None


def get_iv_status():
    try:
        # connect to sql db
        connection = mysql.connector.connect(**db_config)

        # execute sql query to fetch the IV status
        cursor = connection.cursor()
        cursor.execute(
            "SELECT iv_status FROM iv_system ORDER BY timestamp DESC LIMIT 1"
        )
        data = cursor.fetchone()

        # close cursor and connection
        cursor.close()
        connection.close()

        if data:
            # check if IV is done
            return data[0]
        else:
            return None
    except Exception as e:
        print(f"Error fetching IV status: {e}")
        return None


@monitor_blueprint.route("/api/sensor-data", methods=["GET"])
def get_sensor_data_route():
    try:
        # fetch sensor data from db
        sensor_data = get_sensor_data()

        if sensor_data is not None:
            return jsonify(sensor_data), 200
        else:
            return jsonify({"error": "Sensor data not available"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@monitor_blueprint.route("/api/iv-status", methods=["GET"])
def get_iv_status_route():
    try:
        # fetch IV status from db
        iv_status = get_iv_status()

        if iv_status is not None:
            return jsonify({"status": iv_status}), 200
        else:
            return jsonify({"error": "IV status not available"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
