# Dish Diary - Server Side

This is the backend server for the **Dish Diary** project, a full-stack recipe management web application. The server is built with **Node.js**, **Express**, and **MongoDB**, providing a RESTful API for managing recipes, user data, and other application features.

## Features

- RESTful API built with Express
- MongoDB for database management
- Environment variable configuration using dotenv
- Cross-Origin Resource Sharing enabled (CORS)
- Basic structure for scalability and future expansion

## Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB**
- **dotenv**
- **cors**

## Getting Started

### Prerequisites

Make sure you have the following installed on your system:

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository:

git clone https://github.com/your-username/recipe-book-server.git
cd b11a10-recipes-serverside

## API Endpoints

| Method | Endpoint                | Description                    |
| ------ | ---------------------- | ------------------------------ |
| POST   | `/recipes`             | Create a new recipe            |
| GET    | `/recipes`             | Get all recipes                |
| GET    | `/recipes/:id`         | Get recipe by ID               |
| GET    | `/top-recipes`         | Get top 6 recipes by likes     |
| GET    | `/recipes-email/:email`| Get recipes by user email      |
| DELETE | `/recipes/:id`         | Delete a recipe by ID          |
