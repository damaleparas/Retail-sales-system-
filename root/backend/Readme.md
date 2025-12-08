# TruEstate Backend API

This directory contains the FastAPI application that powers the Retail Sales Management System. It handles data processing, database interactions, and machine learning inference.

## Directory Structure
* `src/controllers/`: API route handlers.
* `src/services/`: Business logic, database queries, and ML model logic.
* `src/models/`: Pydantic schemas for request/response validation.
* `src/utils/`: Database connection and helper functions.

## Environment Variables
Create a `.env` file in this directory:

```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=truestate_db