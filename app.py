from flask import Flask, render_template, send_from_directory, jsonify
from agent import TradeVisionAgent
import pandas as pd

app = Flask(__name__)

# Load your trading data from the correct path
def load_your_trading_data():
    return pd.read_json('static/data/3_months_usd_jpy_data_with_volume.json')

# Initialize the TradeVisionAgent
data = load_your_trading_data()
agent = TradeVisionAgent(data)

@app.route('/')
def index():
    return render_template('index.html')

# Serve static data files from the 'static/data' directory
@app.route('/data/usd_jpy_5min_data.json')
def serve_data(filename):
    return send_from_directory('static/data', '3_months_usd_jpy_data_with_volume.json')

# New route to demonstrate the agent's functionality
@app.route('/api/signal')
def get_signal():
    signal = agent.generate_signal()
    return jsonify({'signal': signal})

if __name__ == '__main__':
    app.run(debug=True)
