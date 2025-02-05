School Management System API
============================

This project is a School Management System API built with **Express.js**, **JWT Authentication**, **Mongoose** (for MongoDB integration), and includes role-based access control (RBAC). It provides functionality to manage users, schools, classrooms, and students.

Table of Contents
-----------------

*   [Prerequisities](#prerequisites)
*   [Steps to Setup Server](#steps-to-set-up)
*   [Run the Application](#run-the-application)
*   [Test Collection](#test-collection)

* * *

Installation
------------

### Prerequisites

1.  **Node.js** (v14 or higher)
2.  **MongoDB**

### Steps to Set Up

1.  **Clone the repository:**
    
        git clone https://github.com/yourusername/school-management-system-api.git
        cd school-management-system-api
        npm install
        
    
2.  **Create Environment Variables:**
    
       ```bash
       PORT=5000 # Port for the server
       MONGODB_URI=mongodb://localhost:27017/school_management_system # MongoDB URI
       JWT_SECRET=your_jwt_secret # Secret key for JWT
    

### Run the Application:

**After setting up the environment variables, you can run the application:**

      npm run dev

### Test Collection: 

1. *Import the [Postman collection](https://github.com/Gayatri95/school-management-system-api/tree/main/tests) JSON file into your Postman and verify test cases and results.*
2. *The collection will also have API documentation for the request/response payloads.*
