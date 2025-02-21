from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})   # Allows frontend to communicate with Flask API

# Load the trained model and dataset
pipe = pickle.load(open('pipe.pkl', 'rb'))
df = pickle.load(open('df.pkl', 'rb'))  # Load dataset to get dropdown options


@app.route('/')
def home():
    return "Laptop Price Prediction API is running!"


# ✅ **New API to Fetch Dropdown List Options**
@app.route('/dropdown-options', methods=['GET'])
def dropdown_options():
    options = {
        "company": list(df['Company'].unique()),
        "type": list(df['TypeName'].unique()),
        "cpu": list(df['Cpu brand'].unique()),
        "gpu": list(df['Gpu brand'].unique()),
        "os": list(df['os'].unique())
    }
    return jsonify(options)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json  # Receive input as JSON
    print("Received Data:", data)  # ✅ Debugging line

    required_fields = ["company", "laptop_type", "ram", "weight", "touchscreen", "ips", 
                       "screen_size", "resolution", "cpu", "hdd", "ssd", "gpu", "os"]

    # Check if any field is missing
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        return jsonify({'error': f'Missing fields: {", ".join(missing_fields)}'}), 400

    # Extract values
    try:
        company = data['company']
        laptop_type = data['laptop_type']  # ✅ Changed from data['type']
        ram = int(data['ram'])
        weight = float(data['weight'])
        touchscreen = int(data['touchscreen'])
        ips = int(data['ips'])
        screen_size = float(data['screen_size'])
        resolution = data['resolution']
        cpu = data['cpu']
        hdd = int(data['hdd'])
        ssd = int(data['ssd'])
        gpu = data['gpu']
        os = data['os']

        # Calculate PPI
        X_res, Y_res = map(int, resolution.split('x'))
        ppi = ((X_res**2) + (Y_res**2))**0.5 / screen_size

        # Convert input into numpy array
        query = np.array([company,laptop_type,ram,weight,touchscreen, ips, ppi, cpu, hdd, ssd, gpu, os], dtype=object)
        query = query.reshape(1, -1)

        # Predict
        price = np.exp(pipe.predict(query)[0])

        return jsonify({'predicted_price': round(price, 2)})

    except Exception as e:
        return jsonify({'error': str(e)}), 500



if __name__ == '__main__':
    app.run(debug=True)
