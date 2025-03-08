from flask import Flask, request, Response, redirect, render_template, send_from_directory, jsonify, url_for
import secrets
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token
from flask_cors import CORS
import pymongo
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
import os

load_dotenv()
secret_key = secrets.token_hex(16)

app = Flask(__name__)
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SECRET_KEY'] = secret_key
SECRET_KEY = "jkajoisjosk"

CORS(app, supports_credentials=True)
bcrypt = Bcrypt(app)

URI = os.getenv("MONGO_URL")


client = pymongo.MongoClient(URI, server_api=ServerApi('1'))

doctor = client.get_database("Medlink").doctors
patients = client.get_database("Medlink").patients



@app.before_request
def before_request():
    if request.method == 'OPTIONS':
        return Response()



@app.route('/register', methods=['POST'])
def register():
    if request.is_json:
        data = request.get_json()
        if data['registerer'] == 'patient':
            if doctor.find_one({'email': data['email']}):
                return jsonify({'message': 'User already exists'}), 400
            user = patients.find_one({'email': data['email']})
            if user:
                return jsonify({'message': 'User already exists'}), 400
            else:
                hashed_password = bcrypt.generate_password_hash(data['passwd']).decode('utf-8')
                data['passwd'] = hashed_password
               
                del data['specialization']
                patients.insert_one(data)

                return jsonify({'message': 'User created successfully'}), 200
        elif data['registerer'] == 'doctor':
            if patients.find_one({'email': data['email']}):
                return jsonify({'message': 'User already exists'}), 400
            user = doctor.find_one({'email': data['email']})
            if user:
                return jsonify({'message': 'User already exists'}), 400
            else:
                hashed_password = bcrypt.generate_password_hash(data['passwd']).decode('utf-8')
                data['passwd'] = hashed_password
                data['meet'] = False
                data['stars'] = 0
                data["status"] = "offline"
                data["verified"] = "true"
                del data["age"]
                doctor.insert_one(data)
                return jsonify({'message': 'User created successfully'}), 200
        else:
            return jsonify({'message': 'Invalid registerAs'}), 400
    else:
        return jsonify({'message': 'Invalid request'}), 400

@app.route('/login', methods=['POST'])
def login():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400
    data = request.get_json()
    var = patients.find_one({'email': data['email']})
    if var:
        if bcrypt.check_password_hash(var['passwd'], data['passwd']):
          
            # token = access_token.decode('utf-8')
            return jsonify({'message': 'User logged in successfully',"username": var["username"], "usertype": "patient", "gender": var["gender"], "phone": var["phone"], "age": var["age"]}), 200
        else:
            return jsonify({'message': 'Invalid password'}), 400
    else:
        doctor.update_one({'email': data['email']}, {'$set': {'status': 'online'}})
        var = doctor.find_one({'email': data['email']})
        if var:
            if bcrypt.check_password_hash(var['passwd'], data['passwd']):
               
                # token = access_token.decode('utf-8')
                return jsonify({'message': 'User logged in successfully', "username": var["username"], "usertype": "doctor", "gender": var["gender"], "phone": var["phone"], "specialization": var["specialization"], "meet": var["meet"], "verified": var.get("verified", False)}), 200
            else:
                return jsonify({'message': 'Invalid password'}), 400
        else:
            return jsonify({'message': 'Invalid username or password'}), 401
        
@app.route('/verify', methods=['POST'])
def verify():
    data = request.get_json()
    email = data['email']
    var = doctor.find_one({'email': email})
    print(var.get("verified", False))
    return jsonify({'message': 'verification details', "verified": var.get("verified", False)}), 200

        
@app.route('/doc_status', methods=['PUT'])
def doc_status():
    data = request.get_json()
    user = data['email']
    doctor.update_one({'email': user}, {'$set': {'status': 'offline'}})
    return jsonify({'message': 'Doctor status updated successfully'}), 200

@app.route('/meet_status', methods=['POST'])
def meet_status():
    data = request.get_json()
    user = data['email']
    details = doctor.find_one({'email': user})
    if details['meet'] == True:
        return jsonify({'message': 'Doctor is already in a meet', 'link': details.get('link', '')}), 208
    else:
        if data.get('link', '') == '':
            doctor.update_one({'email': user}, {'$set': {'meet': True}})
        else:
            doctor.update_one({'email': user}, {'$set': {'meet': True, 'link': data['link']}})
        return jsonify({'message': 'Doctor status updated successfully'}), 200


@app.route('/get_status', methods=['GET'])
def get_status():
    details = []
    count = 0
    for i in doctor.find():
        if i.get('verified', False):
            count += 1
            i["appointments"]=0
            details.append({"email": i["email"], "status": i.get("status", "offline"), "username": i["username"], "specialization": i["specialization"], "gender": i["gender"], "phone": i["phone"], "isInMeet": i["meet"], "noOfAppointments": i["appointments"], "noOfStars": i["stars"], "id": count, 'fee': i.get('fee', 199)})
    # print(details)
    return jsonify({"details": details}), 200

    
@app.route('/make_meet', methods=['POST', 'PUT'])
def make_meet():
    data = request.get_json()
    email = data['email']
    if request.method == 'PUT':
        print(data['link'])
        doctor.update_one({'email': email}, {'$set': {'link': {'link': data['link'], "name": data['patient']}}})
        return jsonify({'message': 'Meet link created successfully'}), 200
    else:
        doc = doctor.find_one({'email': email})
        return jsonify({'message': 'Meet link', 'link': doc.get('link', None)}), 200
    
@app.route('/delete_meet', methods=['PUT'])
def delete_meet():
    data = request.get_json()
    email = data['email']
    doctor.update_one({'email': email}, {'$unset': {'link': None, 'currentlyInMeet': None}})
    doctor.update_one({'email': email}, {'$set': {'meet': False}})

    return jsonify({'message': 'Meet link deleted successfully'}), 200

@app.route('/currently_in_meet', methods=['POST', 'PUT'])
def currently_in_meet():
    data = request.get_json()
    email = data['email']
    if request.method == 'PUT':
        doctor.update_one({'email': email}, {'$set': {'currentlyInMeet': True}})
        return jsonify({'message': 'Currently in meet'}), 200
    else:
        doc = doctor.find_one({'email': email})
        return jsonify({'message': 'Currently in meet', 'curmeet': doc.get('currentlyInMeet', False)}), 200
    

    
@app.route("/doctor_avilability", methods=['PUT'])
def doctor_avilability():
    data = request.get_json()
    user = data['email']
    doctor.update_one({'email': user}, {'$set': {'status': 'online'}})
    return jsonify({'message': 'Doctor status updated successfully'}), 200

@app.route('/update_details', methods=['PUT'])
def update_details():
    data = request.get_json()
    usertype = data['usertype']
    email = data['email']
    if usertype == 'doctor':
        if data['passwd'] == '':
            doctor.update_one({'email': email}, {'$set': {'username': data['username'], 'phone': data['phone'], 'specialization': data['specialization'], 'gender': data['gender'], 'fee': data['fee']}})
        else:
            hashed_password = bcrypt.generate_password_hash(data['passwd']).decode('utf-8')
            data['passwd'] = hashed_password
            doctor.update_one({'email': email}, {'$set': {'username': data['username'], 'phone': data['phone'], 'specialization': data['specialization'], 'passwd': data['passwd'], 'gender': data['gender'], 'fee': data['fee']}})
        return jsonify({'message': 'Doctor details updated successfully'}), 200
    else:
        if data['passwd'] == '':
            patients.update_one({'email': email}, {'$set': {'username': data['username'], 'phone': data['phone'], 'age': data['age'], 'gender': data['gender']}})
        else:
            hashed_password = bcrypt.generate_password_hash(data['passwd']).decode('utf-8')
            data['passwd'] = hashed_password
            patients.update_one({'email': email}, {'$set': {'username': data['username'], 'phone': data['phone'],  'passwd': data['passwd'], 'age': data['age'], 'gender': data['gender']}})
        return jsonify({'message': 'Patient details updated successfully'}), 200
 

if __name__ == "__main__":
    app.run(debug=True)
