# System Architecture

## 1. Overview
The TruEstate Retail Sales Management System is designed as a modular, 3-tier web application. It adheres to the **Separation of Concerns (SoC)** principle, ensuring the frontend (UI) is decoupled from the backend (Business Logic & Data).

## 2. Tech Stack
* **Frontend:** React (Vite), Tailwind CSS, Axios
* **Backend:** FastAPI (Python), Motor (Async MongoDB), Pydantic
* **Database:** MongoDB (NoSQL)
* **Machine Learning:** Scikit-Learn (Linear Regression)

## 3. Backend Architecture
The backend follows the **Controller-Service-Repository** pattern to ensure maintainability and scalability.

* **Controllers (`src/controllers`):** * Handle incoming HTTP requests and define API endpoints.
    * Validate request data using Pydantic models.
    * Delegate business logic to the Service layer.
* **Services (`src/services`):**
    * Contain the core business logic (e.g., filtering logic, sorting rules).
    * Handle interactions with the database and the ML model.
    * Ensure data consistency before sending it back to the controller.
* **Models (`src/models`):**
    * Define the data structure and validation rules using Pydantic.
    * Ensure type safety for requests and responses.
* **Utils (`src/utils`):**
    * Manage database connections and configuration.

### Machine Learning Module
The system includes a lightweight ML service (`ml_service.py`) that:
1.  **Trains:** Automatically fits a Linear Regression model on startup using available sales data.
2.  **Predicts:** Exposes a function to forecast revenue based on input quantity.

## 4. Frontend Architecture
The frontend is built using a **Component-Based Architecture**.

* **Components (`src/components`):** * Reusable UI elements (though for this specific scale, logic resides primarily in `App.jsx` for simplicity and cohesion).
* **Services (`src/services`):** * Centralized API handling using Axios. 
    * Decouples UI components from specific API endpoints.
* **State Management:** * Uses React Hooks (`useState`, `useEffect`) to manage local state for filters, pagination, and data.
    * Implements **Debouncing** for search inputs to minimize network traffic.

## 5. Data Flow Diagram
The typical data flow for a "Search" or "Filter" operation:

1.  **User Action:** User types in the Search Bar.
2.  **Frontend State:** React state updates; a debounced effect triggers the API call.
3.  **API Request:** Axios sends `GET /sales?search=...` to FastAPI.
4.  **Routing:** FastAPI routes the request to `sales_controller.py`.
5.  **Service Layer:** `sales_service.py` constructs a MongoDB aggregation pipeline using `$regex` or `$in`.
6.  **Database:** MongoDB executes the query and returns specific documents.
7.  **Response:** Backend serializes data to JSON and returns it to the Frontend.
8.  **UI Update:** React updates the DOM to display the filtered table.

## 6. Folder Structure & Responsibilities

```text
root/
├── backend/
│   ├── src/
│   │   ├── controllers/   # Route definitions (Entry point for API)
│   │   ├── services/      # Business logic & Database queries
│   │   ├── models/        # Data validation schemas
│   │   ├── utils/         # DB connection helpers
│   │   └── main.py        # App initialization
│   └── requirements.txt   # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── services/      # API communication layer
│   │   ├── App.jsx        # Main UI logic & Layout
│   │   └── main.jsx       # React entry point
│   └── package.json       # Node dependencies
└── docs/
    └── architecture.md    # System design documentation