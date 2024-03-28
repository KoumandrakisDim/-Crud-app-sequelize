# Express CRUD Application

This is a basic Express CRUD application for managing a list of persons.

## Prerequisites

- Node.js and npm installed on your machine
- SQLite database

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/crud-app-sequelize.git

2. Navigate to the project directory:

   ```bash
cd <your-project-name>

3. Install dependencies:

   ```bash
npm install

4. Run database migrations to create the necessary tables:

   ```bash
npx sequelize-cli db:migrate

5. Start the application:

   ```bash
node index.js

6. Open your web browser and navigate to http://localhost:3000 to view the application.

Perform CRUD operations:
  Add a new person to the list.
  View the list of persons.
  View details of a single person by ID.
  Edit an existing person on the list.
  Remove an existing person from the list.
  
Technologies Used:
  Express.js
  Sequelize ORM
  SQLite database
  Bootstrap
  jQuery
