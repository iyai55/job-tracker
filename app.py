from flask import Flask, request, jsonify
import sqlite3
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


def create_database():
    connection = sqlite3.connect("jobs.db")

    cursor = connection.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS jobs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            company_name TEXT NOT NULL,
            job_title TEXT NOT NULL,
            applied_date TEXT NOT NULL,
            status TEXT NOT NULL
        )
    """)

    connection.commit()
    connection.close()


@app.route("/jobs", methods=["POST"])
def add_job():
    data = request.get_json()

    company_name = data["company_name"]
    job_title = data["job_title"]
    applied_date = data["applied_date"]
    status = data["status"]

    connection = sqlite3.connect("jobs.db")
    cursor = connection.cursor()

    cursor.execute("""
        INSERT INTO jobs (company_name, job_title, applied_date, status)
        VALUES (?, ?, ?, ?)
    """, (company_name, job_title, applied_date, status))

    connection.commit()
    connection.close()

    return jsonify({"message": "Job added successfully"})


@app.route("/jobs", methods=["GET"])

def get_job():
    connection = sqlite3.connect("jobs.db")
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM jobs")
    rows = cursor.fetchall()
    jobs = []
    # get array row[1] data to object/dictonary and sent to front end row.company_name
    for row in rows:
        jobs.append({
            "id": row[0],
            "company_name": row[1],
            "job_title": row[2],
            "applied_date": row[3],
            "status": row[4]       
        })

    connection.close()

    return jsonify(jobs)


@app.route("/jobs/<int:id>", methods=["DELETE"])
def delete_job(id):
    connection = sqlite3.connect("jobs.db")
    cursor = connection.cursor()
    cursor.execute("DELETE FROM jobs WHERE id = ?", (id,))

    connection.commit()
    connection.close()
    return jsonify({"message": f"Job with ID {id} has been deleted"}), 200


@app.route("/jobs/<int:id>", methods=["PUT"])
def edit_job(id):

    data = request.get_json()
    company_name = data.get("company_name")
    job_title = data.get("job_title")
    applied_date = data.get("applied_date")
    status = data.get("status")

    if not company_name or not job_title or not applied_date or not status:
        return jsonify({"error": "All fields are required"}), 400

    connection = sqlite3.connect("jobs.db")
    cursor = connection.cursor()
    cursor.execute(
        "UPDATE jobs SET company_name = ?, job_title = ?, applied_date = ?, status = ? WHERE id = ?",
        (company_name, job_title, applied_date, status, id)
    )
    connection.commit()
    connection.close()

    return jsonify({"message": f"Job with ID {id} has been updated"}), 200




if __name__ == "__main__":
    create_database()
    app.run(debug=True)
