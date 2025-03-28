﻿# fullstack_assingment
# OTP-Based User Registration & Profile Management

## Objective
This project is a full-stack web application that allows users to register with OTP authentication, log in, and manage their profiles, including file uploads for profile pictures.

## Features
### 1. User Registration with OTP Verification
- Users register using their email and password.
- OTP is sent to their email via Nodemailer.
- Users enter OTP to complete registration.
- Express Session is used for OTP verification.

### 2. User Login
- Users log in using their email and password.
- Session-based authentication is maintained.

### 3. User Dashboard (CRUD with MySQL & File Uploading)
- Users can update their profile details (name, phone, profile.).
- Users can upload and update their profile pictures using Multer.
- User details are stored in a MySQL database.

### 4. Profile Page
- Displays user details along with their uploaded profile picture.

### 5. Logout
- Allows users to log out and destroys the session.

## Tech Stack
- **Backend:** Node.js, Express, MySQL
- **Frontend:** HTML, CSS, JavaScript, Bootstrap (optional)
- **Libraries Used:**
  - Nodemailer (for OTP email sending)
  - Express Session (for session management)
  - MySQL (for database management)

## Installation & Setup

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/anilpadghane/otp_based_user_registration_profile_management.git
   cd otp_based_user_registration_profile_management
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Database:**
   - Create a MySQL database.
   - Import the provided `database.sql` file.


   
4. **Run the Server:**
   ```bash
   nodemon
   ```

5. **Access the App:**
   - Open [http://localhost:3001](http://localhost:3001) in your browser.

## Usage
- **Register:** Sign up with email and password.
- **Verify OTP:** Enter OTP sent to your email.
- **Login:** Use email and password to log in.
- **Update Profile:** Modify user details and upload a profile picture.
- **Delete:** Delete User Account Permantly.
- **Logout:** End the session.

## Author
**Anil Pralhad Padghane**

