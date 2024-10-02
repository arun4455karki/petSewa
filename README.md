# Pet Ecommerce Website

Welcome to the PetSewa  Ecommerce Website repository! This project is a full-stack web application developed using the MERN (MongoDB, Express.js, React, Node.js) stack. It allows users to browse and purchase pet food products online.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Folder Structure](#folder-structure)
- [Technologies Used](#technologies-used)

## Features

- User authentication (signup, login, logout) with JWT
- Product browsing and searching
- Shopping cart and wishlist functionality
- Order placement with stripe payment gateway
- Admin panel for product and user management
- Responsive design for various devices
- Functionality to book an appointment for pet services
- Functionality to filter the products on pet type
- Live chat feature for customer service inquiries
- Subscription-based purchases for recurring orders (e.g., pet food). 

## Getting Started

To run this project locally, follow the steps below.

## Prerequisites

Make sure you have the following installed on your machine:

- Node.js and npm
- MongoDB

## Installation

Clone the repository:

```bash
  git clone https://github.com/arun4455karki/petSewa.git
```

Install server dependencies:

```bash
  cd petSewa/server
  npm install
```

Install client dependencies:

```bash
  cd ../Client
  npm install
```

Configure environment variables:
Create a .env file in the server directory and add the following:

```bash
	REACT_APP_BACKEND_BASE_URL = http://localhost:5000 or any desired PORT number
```
Create a .env file in the server directory and add the following:

```bash
  MONGODB_URI = your_mongodb_uri
  USER_ACCESS_TOKEN_SECRET= your_token_secret_key
  USER_REFRESH_TOKEN_SECRET= your_token_secret_key
  STRIPE_SECRET_KEY = your_stripe_secret_key
```

Run the server:

```bash
 cd ../Server
 npm run dev
```

Run the client:

```bash
 cd ../Server
 npm start
```

The client will be running at http://localhost:3000.

## Folder Structure
- `/Client`: React client application
- `/Server`: Node.js and Express.js server application

## Technologies Used
- Frontend:
  - React.js
  - Context API for state management
  - Axios for HTTP requests
  - React Router for navigation
  - MD Bootstrap for styling and icons
- Backend:
  - Node.js & Express.js
  - MongoDB for database
  - JWT for authentication
  - Stripe for payment gateway
  - Bcrypt for password hashing
  - Multer & Cloudinary for image upload
  - Joi for validatio

