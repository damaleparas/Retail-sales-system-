import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// 1. Fetch Sales (Used for the Table)
export const fetchSales = async (params) => {
    try {
        const response = await axios.get(`${API_URL}/sales`, {
            params: {
                page: params.page,
                limit: 10,
                search: params.search,
                region: params.region,
                gender: params.gender,
                category: params.category,
                sort_by: params.sortBy,
                sort_order: params.sortOrder
            },
            paramsSerializer: { indexes: null } 
        });
        return response.data;
    } catch (error) {
        console.error("API Error", error);
        return { data: [], total: 0, pages: 0 };
    }
};

// 2. Get ML Prediction (Used for the Forecast Button)
export const getPrediction = async (qty) => {
    try {
        const res = await axios.get(`${API_URL}/sales/predict?quantity=${qty}`);
        return res.data;
    } catch (error) {
        console.error("ML Prediction Error", error);
        return { predicted_total_revenue: 0 };
    }
};

// 3. Add Sale (Used for the "Add Sale" Modal)
export const addSale = async (saleData) => {
    try {
        const response = await axios.post(`${API_URL}/sales`, saleData);
        return response.data;
    } catch (error) {
        console.error("Error adding sale", error);
        return null;
    }
};

// 4. Get Dashboard Stats
export const fetchStats = async () => {
    try {
        const response = await axios.get(`${API_URL}/sales/stats`);
        return response.data;
    } catch (error) {
        console.error("Stats Error", error);
        return { total_revenue: 0, total_orders: 0, avg_order_value: 0 };
    }
};