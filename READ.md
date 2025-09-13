# Lab 3

This project is a simple authentication system using **Node.js, Express, MySQL, JWT, and bcrypt**.  
It covers signup, login, profile access, and logout with token revocation for secure authentication.

 Project Setup

1. Clone this repository or download the files.
2. Create a MySQL database named `lab_auth`.
3. Run the following SQL to create tables:

sql:

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE revoked_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  jti VARCHAR(255) NOT NULL,
  expiresAt DATETIME NOT NULL
);

Install dependencies:

Endpoint List
POST	/api/auth/signup - Register a new user (username+pwd)	
POST	/api/auth/login	- Login, get JWT token	
GET	/api/auth/profile	- Get user profile (requires token)	
POST	/api/auth/logout - Logout, revoke token	
GET	/api/health	- Health check	

TECH STACK:
Node.js + Express
MySQL (via XAMPP or CLI)
bcrypt (password hashing)
JWT (authentication)
Postman (testing)
