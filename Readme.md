# Retail Sales Management System

## 1. Live Deployment
* **Live Application (Frontend):** [https://retail-sales-system-sable.vercel.app/](https://retail-sales-system-sable.vercel.app/)
* **Backend API Docs (Swagger):** [https://truestate-backend-qhfb.onrender.com/docs](https://truestate-backend-qhfb.onrender.com/docs)
* **Database:** MongoDB Atlas (Cloud)

## 2. Overview
This project is a full-stack Retail Sales Management System designed to handle large datasets of transaction records. It features a high-performance backend using FastAPI and MongoDB for efficient data retrieval and a responsive React frontend. Key capabilities include complex multi-criteria filtering, full-text search, and server-side pagination, along with a basic ML module for revenue forecasting.

## 3. Tech Stack
* **Frontend:** React (Vite), Tailwind CSS, Axios, Lucide React
* **Backend:** FastAPI (Python), Motor (Async MongoDB Driver), Pydantic
* **Database:** MongoDB Atlas (Cloud)
* **Machine Learning:** Scikit-Learn (Linear Regression for sales forecasting)
* **Environment:** Python 3.9+, Node.js 18+

## 4. Search Implementation Summary
Search is implemented using MongoDB's regex capabilities via the `$or` operator.
* **Backend:** The `get_filtered_sales` service accepts a `search` query parameter. It constructs a MongoDB query that checks both `customer_name` and `phone_number` fields using case-insensitive regular expressions (`$options: "i"`).
* **Frontend:** A debounced input field updates the search state, triggering a re-fetch of data while resetting pagination to the first page.

## 5. Filter Implementation Summary
Multi-select filtering is handled dynamically to support combinations of criteria.
* **Backend:** The API accepts lists for `region`, `gender`, and `category`. The query builder checks if these lists are populated and adds `$in` clauses to the MongoDB aggregation pipeline (e.g., `{"region": {"$in": [...]}}`).
* **Frontend:** The UI maintains a filter state object. Toggling checkboxes updates these state arrays, automatically refreshing the data grid. Filters operate independently and can be combined with search and sorting.

## 6. Sorting Implementation Summary
Sorting is performed server-side to ensure accuracy across paginated datasets.
* **Backend:** The API accepts `sort_by` (field name) and `sort_order` (asc/desc). These are converted to MongoDB sort tuples (e.g., `[("total_amount", -1)]`) and applied to the cursor before pagination.
* **Frontend:** Users can toggle sort order via the UI. The state tracks the active sort field and direction, passing them as parameters to the API.

## 7. Pagination Implementation Summary
Pagination is efficient and server-side (offset-based).
* **Backend:** Uses `skip` and `limit` on the MongoDB cursor. `skip` is calculated as `(page - 1) * limit`. The response includes total document count and total pages to enable frontend navigation controls.
* **Frontend:** Manages `page` state. "Next" and "Previous" buttons increment/decrement this state, triggering a data fetch for the specific slice of records.

## 8. Setup Instructions (Local Development)

### Prerequisites
* Node.js installed.
* Python installed.
* *Note: The local frontend is configured to connect to the live Render backend by default.*

### Backend Setup (Optional)
*Since the frontend connects to the live backend, running this locally is only necessary for backend development.*
1.  Navigate to the backend folder:
    ```bash
    cd backend
    ```
2.  Create a virtual environment and activate it:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Configure environment:
    * Create a `.env` file.
    * Set `MONGO_URL` to your MongoDB Atlas connection string.
5.  Run the server:
    ```bash
    uvicorn src.main:app --reload
    ```

### Frontend Setup
1.  Navigate to the frontend folder:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```
    *Application will open at http://localhost:5173*
