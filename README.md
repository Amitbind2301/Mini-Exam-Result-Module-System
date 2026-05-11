📘 Mini Exam Result Module System
A MERN Stack (MongoDB, Express.js, React.js, Node.js) based web application that allows an admin to manage students, subjects, marks entry, and generate exam results with proper authentication and validation.

Backend Setup:


Navigate to the backend directory
cd backend


Install all required dependencies
npm install


Create a .env file in the root of the backend folder and add the required environment variables (see below).
Make sure MongoDB is properly configured and running.


Start the backend development server
npm run dev


The backend will run on the port specified in the .env file.

Frontend Setup:


Navigate to the frontend directory
cd frontend


Install all required dependencies
npm install


Start the frontend development server
npm start


The frontend application will run on http://localhost:3000 by default and will communicate with the backend APIs.

Environment Variables:
Create a .env file inside the backend directory and configure the following variables:
MONGO_URI=your_mongodb_connection_stringJWT_SECRET=your_secure_jwt_secretPORT=5000
Description:


MONGO_URI: MongoDB connection string (local or Atlas)


JWT_SECRET: Secret key used for authentication (JWT)


PORT: Port on which backend server will run
