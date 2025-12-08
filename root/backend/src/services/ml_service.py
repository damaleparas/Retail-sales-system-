import pandas as pd
from sklearn.linear_model import LinearRegression
import numpy as np

class SalesPredictor:
    def __init__(self):
        self.model = LinearRegression()
        self.is_trained = False

    def train(self, data: list):
        if not data:
            return
        
        df = pd.DataFrame(data)
        if 'quantity' in df.columns and 'total_amount' in df.columns:
            X = df[['quantity']]
            y = df['total_amount']
            self.model.fit(X, y)
            self.is_trained = True

    def predict_revenue(self, quantity: int):
        if not self.is_trained:
            return quantity * 100 
        
        prediction = self.model.predict(np.array([[quantity]]))
        return round(float(prediction[0]), 2)

predictor = SalesPredictor()