
KryptoniteApp
=============

Learnable 23: Backend Standardisation Test Exercise
---------------------------------------------------

### Project Overview

KryptoniteApp is designed to handle user authentication, including Two-Factor Authentication (2FA) using One-Time Passwords (OTP), and secure file uploads. This application adheres to modern RESTful API design principles and leverages a variety of technologies to ensure security and efficiency.

### Features Implemented

1.  **Kryptonian Registration and Authentication**:

    -   User Registration: Allows new users to register with an email and password.
        -   Sends a confirmation email with a link to verify the user's email address.
    -   Email Confirmation: Confirms user email addresses via a link sent in the registration email.
    -   User Login: Authenticates users with email and password.
        -   Checks if the user's email is confirmed before allowing login.
        -   Generates an OTP and sends it to the user's email for successful login, also generates a temporary token to carry userId in payload for login during OTP validation.
    -   OTP Generation and Validation: Ensures secure login by generating and validating OTPs.
        -   Checks if an existing OTP is still valid before generating a new one.
        -   Deletes OTP from the database after successful verification.
    -   JWT Token Handling: Issues JWT tokens for authenticated sessions.
        -   Temporary JWT token issued for OTP validation.
        -   Full session JWT token issued after successful OTP verification.
        -   Tokens are stored in secure, HTTP-only cookies.
    -   User Management:
        -   Fetches all registered users.
        -   Deletes a specified user by ID.
2.  **API Key Management**:

    -   Users can generate API keys to upload files.
    -   API keys are used for authenticating file uploads without requiring an auth token.
    -   Users can invalidate API keys to make them unusable.
3.  **File Upload Service**:

    -   Users can upload image files using their API key.
    -   Uploaded files are stored as Base64 strings in the database.
    -   Uploaded files are deleted from the system after being stored.
    -   Only image files are allowed.
    -   **Note**: Files should not be greater than 16MB in size. This limitation is due to the constraints of storing large files in MongoDB using Multer, which can lead to performance issues and inefficient storage. For larger files, a dedicated file storage service like AWS S3 or Google Cloud Storage is recommended.
4.  **Image Access**:

    -   Images can be accessed without authentication, as required by Supergirl (Kara Zor-El).


### API Endpoints

#### Base URL: `https://2faauthentication-fileuploadservice.onrender.com`

#### User Authentication

-   **Register**: 
    - Registers a new user and sends a confirmation email.

    -   `POST /api/v1/users/register`
    -   Request:
        ```
        json

        {
          "email": "user@example.com",
          "password": "yourpassword"
        }
        ```

    -   Response:
        ```
        json

        {
          "success": true,
          "message": "Registration successful! Please check your email to confirm."
        }
        ```

-   **Confirm Email**
    -   Confirms a user's email address.
    -   `GET /api/v1/users/confirm/:id`
    -   Response:

        ```
        json

        {
          "success": true,
          "message": "Congratulations! Your email has been confirmed, you may proceed to login."
        }
        ```

-   **Login**
    -   Logs in a user and sends an OTP to their email.
    -   `POST /api/v1/users/login`
    -   Request:

        ```
        json

        {
          "email": "user@example.com",
          "password": "yourpassword"
        }
        ```

    -   Response:

        ```
        json

        {
          "success": true,
          "message": "OTP sent to your email",
          "token": "temporary_jwt_token"
        }
        ```

-   **Verify OTP**
    -   Verifies the OTP and logs in the user.
    -   `POST /api/v1/users/verify-otp`
    -   Headers:
    
        ```
        json

        {
          "Authorization": "Bearer temporary_jwt_token"
        }
        ```

    -   Request:

        ```
        json

        {
          "otp": "123456"
        }
        ```
    -   Response:

        ```
        json

        {
          "success": true,
          "message": "OTP verified, login successful",
          "token": "auth_jwt_token"
        }
        ```

#### File Upload

-   **Upload File**
    -   Uploads an image file and associates it with the user.
    -   `POST /api/v1/files/upload`
    -   Headers:
        ```
        json

        {
          "x-api-key": "your_api_key"
        }
        ```

    -   Request: (using Form-data)

        vbnet

        `Key: file
        Value: (Select an image file from your system)`

    -   Response:

        ```
        json

        {
          "success": true,
          "message": "File successfully uploaded and stored"
        }

-   **Access Images**

    -   **Get All Images**
        - Retrieves all images.
        -   `GET /api/v1/files/`
        -   Response:
        
            ```
            json

            {
              "success": true,
              "data": [
                {
                  "_id": "image_id_1",
                  "filename": "image1.jpg",
                  "base64": "base64_string_of_image1"
                },
                {
                  "_id": "image_id_2",
                  "filename": "image2.jpg",
                  "base64": "base64_string_of_image2"
                }
              ]
            }
            ```

    -   **Get Single Image**
        -   Retrieves single image.
        -   `GET /api/v1/files/:id`
        -   Response:

            ```
            json

            {
              "success": true,
              "data": {
                "_id": "image_id",
                "filename": "image.jpg",
                "base64": "base64_string_of_the_image"
              }
            }
            ```

#### API Key Management

-   **Generate API Key**
    -   Generates a new API key for the user.
    -   `POST /api/v1/users/generate-api-key`
    -   Headers:

        ```
        json

        {
          "Authorization": "Bearer auth_jwt_token"
        }
        ```
    -   Request:

        ```
        json

        {
          "email": "example@gmail.com"
        }
        ```
    -   Response:

        ```
        json

        {
          "sucess": true,
          "message": "Apikey generated successfully, remember to copy and paste it somewhere, you will not see this again",
          "apiKey": "your_generated_api_key"
        }
        ```

-   **Invalidate API Key**
    -   `POST /api/v1/users/invalidate-api-key`
    -   Headers:
        ```
        json

        {
          "Authorization": "Bearer auth_jwt_token"
        }
        ```

    -   Request:

        ```
        json

        {
          "apiKey": "your_api_key"
        }
        ```

    -   Response:

        ```
        json

        {
          "success": true,
          "message": "API key invalidated successfully"
        }
        ```

### Technologies Used

-   **Node.js**: JavaScript runtime.
-   **Express.js**: Web framework for Node.js.
-   **MongoDB**: NoSQL database.
-   **Mongoose**: ODM for MongoDB.
-   **Nodemailer**: Node.js module for sending emails.
-   **bcrypt.js**: Library for hashing passwords.
-   **jsonwebtoken**: Library for creating and verifying JWTs.
-   **multer**: Middleware for handling multipart/form-data.
-   **uuid**: Library for generating unique IDs (apikeys).

### Setup Instructions

1.  **Clone the Repository**:

    `git clone https://github.com/PrevailUzodinma/2FAauthentication-fileuploadservice
    cd 2FAauthentication-fileuploadservice`

2.  **Install Dependencies**:

    `npm install`

3.  **Environment Variables**:

    -   Create a `.env` file in the root directory.
    -   Add the following environment variables:
    
        `PORT=3000
        MONGO_URI=your_mongodb_connection_string
        JWT_SECRET=your_jwt_secret
        EMAIL_SERVICE=your_email_service
        EMAIL_USER=your_email_user
        EMAIL_PASS=your_email_pass`

4.  **Run the Application**:

    `npm start`

### Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature-branch`).
3.  Commit your changes (`git commit -m 'Add new feature'`).
4.  Push to the branch (`git push origin feature-branch`).
5.  Open a Pull Request.
