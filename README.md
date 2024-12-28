# Gym Registration Application

## Overview
The Gym Registration Application allows students to register for gym batches, make monthly fee payments, and securely store their personal information using encryption.

---

## Features
1. **Student Registration**: Students can register for gym batches by paying a fixed monthly fee.
2. **Encryption**: Personal information like name and address is securely encrypted before storing in the database.
3. **Batch Management**: Students can enroll in specific gym batches.
4. **Payment Tracking**: Identify unpaid fees and calculate outstanding dues.

---

## Prerequisites
- **Node.js** (v14 or above)
- **MySQL Server**
- **Postman** or similar tool for API testing (optional).

---

## Setup Instructions

### Clone the Repository
```bash
git clone <repository_url>
cd gym-registration
```

### Backend Setup
1. **Navigate to Backend Directory**:
   ```bash
   cd gym-backend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the `gym-backend` folder with the following variables:
   ```plaintext
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=<your_password>
   DB_NAME=gym_db
   KEY=your32characterlongsecretkey!
   ```

4. **Set Up the Database**:
   Use the following SQL script to create and configure the database:
   ```sql
   CREATE DATABASE gym_db;

   USE gym_db;

   CREATE TABLE Students (
       student_id INT AUTO_INCREMENT PRIMARY KEY,
       personal_info TEXT NOT NULL,
       iv VARCHAR(32) NOT NULL
   );

   CREATE TABLE Batches (
       batch_id INT AUTO_INCREMENT PRIMARY KEY,
       batch_name VARCHAR(100) NOT NULL,
       fees INT NOT NULL
   );

   CREATE TABLE Payments (
       payment_id INT AUTO_INCREMENT PRIMARY KEY,
       student_id INT,
       batch_id INT,
       amount INT NOT NULL,
       month_year DATE NOT NULL,
       payment_date DATE NOT NULL,
       FOREIGN KEY (student_id) REFERENCES Students(student_id),
       FOREIGN KEY (batch_id) REFERENCES Batches(batch_id)
   );
   ```

5. **Run the Backend**:
   ```bash
   npm start
   ```
   The backend server will run at `http://localhost:3001`.

### Frontend Setup
1. **Navigate to Frontend Directory**:
   ```bash
   cd ../gym-frontend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run the Frontend**:
   ```bash
   npm start
   ```
   The frontend will be available at `http://localhost:3000`.

---

## Testing Instructions

### API Testing with Postman
1. **Register a Student**:
   - **Method**: `POST`
   - **URL**: `http://localhost:3001/students/register`
   - **Body (JSON)**:
     ```json
     {
         "name": "John Doe",
         "address": "123 Main Street",
         "batch_id": 1,
         "amount": 500,
         "month_year": "2024-12"
     }
     ```

2. **Fetch Unpaid Fees**:
   - **Method**: `GET`
   - **URL**: `http://localhost:3001/payments/unpaidfees`

3. **Fetch Outstanding Dues**:
   - **Method**: `GET`
   - **URL**: `http://localhost:3001/payments/outstandingdues`

### Frontend Testing
1. Open `http://localhost:3000` in your browser.
2. Fill out the registration form and submit.
3. Verify the database records for the new student registration and payment.

---

