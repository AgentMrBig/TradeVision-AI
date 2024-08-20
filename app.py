from flask import Flask, render_template, send_from_directory

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

# Serve static data files from the 'data' directory
@app.route('/data/usd_jpy_5min_data.json')
def serve_data(filename):
    return send_from_directory('data', 'usd_jpy_5min_data.json')

if __name__ == '__main__':
    app.run(debug=True)
