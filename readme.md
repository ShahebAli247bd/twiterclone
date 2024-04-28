# User Authentication API

This repository contains code for a user authentication API built with Node.js, Express.js, and MongoDB. It provides endpoints for user signup, login, and logout.

## Getting Started

To run this project locally, follow these steps:

1. Clone this repository to your local machine.
2. Install dependencies using `npm install`.
3. Set up environment variables by creating a `.env` file in the root directory of the project with the following details:
   - `PORT`: Port number on which the server will run.
   - `MONGO_URI`: URI for connecting to the MongoDB database.
   - `JWT_SECRET`: Secret key for JWT token generation.
   - `NODE_ENV`: Environment mode (e.g., development, production).
4. Run the server using `npm start`.

## Endpoints

### Signup

- **URL:** `/signup`
- **Method:** `POST`
- **Request Body:**
  - `username` (string, required): User's desired username.
  - `fullname` (string, required): User's full name.
  - `email` (string, required): User's email address.
  - `password` (string, required): User's password.
- **Response:**
  - `201 Created`: User signed up successfully. Response includes user object with `_id`, `username`, `fullname`, `email`, `followers`, `following`, `profileImg`, and `coverImg`.
  - `400 Bad Request`: Invalid email format or password length less than 6 characters.
  - `409 Conflict`: Username or email already exists.
  - `500 Internal Server Error`: Something went wrong during signup process.

### Login

- **URL:** `/login`
- **Method:** `POST`
- **Request Body:**
  - `username` (string, required): User's username.
  - `password` (string, required): User's password.
- **Response:**
  - `200 OK`: User logged in successfully. Response includes user object with `_id`, `username`, `fullname`, `email`, `followers`, `following`, `profileImg`, and `coverImg`.
  - `400 Bad Request`: Missing username or password.
  - `401 Unauthorized`: Invalid username or password.
  - `500 Internal Server Error`: Something went wrong during login process.

### Logout

- **URL:** `/logout`
- **Method:** `POST`
- **Response:**
  - `200 OK`: User logged out successfully.
  - `500 Internal Server Error`: Something went wrong during logout process.

## Dependencies

- `bcrypt`: For password hashing.
- `jsonwebtoken`: For generating JWT tokens.
- `express`: Web application framework for Node.js.
- `mongoose`: MongoDB object modeling tool.
- `cookie-parser`: For parsing cookies in the request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
