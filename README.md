# ZyNote – Smart Notes Management Application

## Overview

ZyNote is a full-stack notes management application that allows users to create, edit, organize, pin, and manage notes efficiently. The application includes secure authentication, file uploads, reminders, category-based organization, and a responsive user interface.

## Features

* User Registration and Login
* JWT Authentication
* Password Encryption using bcrypt
* Create, Read, Update, and Delete Notes (CRUD)
* Markdown Support
* File Upload Attachments
* Note Categories
* Search Functionality
* Pin / Unpin Notes
* Reminder Notifications
* Dark Mode
* User Profile Management
* Responsive Design

## Tech Stack

### Frontend

* React.js
* Axios
* React Router
* Framer Motion
* React Markdown
* React Toastify

### Backend

* Node.js
* Express.js
* JWT Authentication
* bcryptjs
* Multer

### Database

* MySQL

## Installation

### Frontend

```bash
cd frontend
npm install
npm start
```

### Backend

```bash
cd backend
npm install
node server.js
```

## Environment Variables

Create a `.env` file inside the backend folder:

```env
JWT_SECRET=your_secret_key
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=notes_db
```

## Author

Abirami P
CSE
