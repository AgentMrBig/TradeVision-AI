import pandas as pd

class TradeVisionAgent:
    def __init__(self, data):
        self.data = data
        self.moving_averages = {
            '10': self.calculate_moving_average(10),
            '100': self.calculate_moving_average(100),
            '200': self.calculate_moving_average(200)
        }

    def calculate_moving_average(self, period):
        return self.data['Close'].rolling(window=period).mean()

    def identify_trend(self):
        if self.data['Close'].iloc[-1] < self.moving_averages['200'].iloc[-1]:
            return "Downtrend"
        elif self.data['Close'].iloc[-1] > self.moving_averages['200'].iloc[-1]:
            return "Uptrend"
        else:
            return "Sideways"

    def check_volume_spike(self):
        recent_volume = self.data['Volume'].iloc[-1]
        avg_volume = self.data['Volume'].rolling(window=20).mean().iloc[-1]
        if recent_volume > avg_volume * 1.5:  # Example threshold for a volume spike
            return True
        return False

    def generate_signal(self):
        trend = self.identify_trend()
        volume_spike = self.check_volume_spike()

        if trend == "Downtrend" and volume_spike:
            return "Strong Downtrend Signal"
        elif trend == "Uptrend" and volume_spike:
            return "Strong Uptrend Signal"
        return "No Clear Signal"

    def respond_to_query(self, query):
        if "trend" in query.lower():
            return self.identify_trend()
        elif "volume" in query.lower():
            return self.check_volume_spike()
        return "Query not understood"

