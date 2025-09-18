# **Wanderlust ✈️**

Wanderlust is a full-stack web application inspired by Airbnb, allowing users to discover, list, and review unique accommodations around the world. It's built with Node.js, Express, and MongoDB, following the MVC (Model-View-Controller) architectural pattern.

**Note:** This project was developed as a learning exercise to master the fundamentals of web development.

## **✨ Features**

* **User Authentication**: Secure user registration and login functionality using Passport.js.  
* **CRUD Operations**: Users can Create, Read, Update, and Delete their own property listings.  
* **Reviews & Ratings**: Authenticated users can post reviews and ratings for different properties.  
* **Authorization**: Middleware ensures that users can only edit or delete content they own.  
* **Responsive Design**: A clean and intuitive user interface built with Bootstrap, ensuring a seamless experience on both desktop and mobile devices.  
* **Flash Messages**: Provides users with contextual feedback (e.g., success messages or error alerts) after performing actions.

## **🛠️ Tech Stack**

* **Backend**: Node.js, Express.js  
* **Database**: MongoDB with Mongoose  
* **Frontend**: EJS (Embedded JavaScript), Bootstrap  
* **Authentication**: Passport.js, Express Session, Connect-Flash  
* **Data Validation**: Joi  
* **File Uploads**: Multer (or similar, assuming image uploads for listings)

## **🚀 Getting Started**

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### **Prerequisites**

* Node.js (v14 or newer)  
* MongoDB (Make sure you have a running instance, either locally or a cloud-based one like MongoDB Atlas)

### **Installation**

1. **Clone the repository:**  
   git clone (https://github.com/Meet-Singh26/Wanderlust.git)  
   cd wanderlust

2. **Install NPM packages:**  
   npm install

3. **Set up environment variables:**  
   Create a .env file in the root directory and add the following variables. Replace the placeholder values with your actual data.  
   MONGO\_URL=your\_mongodb\_connection\_string  
   SESSION\_SECRET=a\_strong\_secret\_for\_sessions

4. **Run the application:**  
   npm start

   The server should now be running on http://localhost:8080 (or the port specified in the app.js).

## **📂 Project Structure**

The project follows the MVC pattern to keep the code organized and scalable:

/  
├── controllers/      \# Handles the business logic for routes  
├── models/           \# Defines Mongoose schemas for the database  
├── public/           \# Static assets (CSS, client-side JS)  
├── routes/           \# Defines the application's routes  
├── utils/            \# Utility functions and error handlers  
├── views/            \# EJS templates for the UI  
├── middleware.js     \# Custom middleware functions  
└── app.js            \# The main entry point of the application  
