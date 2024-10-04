# Training Management Web App

[![Video Demo](https://github.com/user-attachments/assets/c3d8bc4c-f6b5-4d84-b164-fce54fec9694)](https://youtu.be/4RTHZGaZaH8)
[Video Demo](https://youtu.be/4RTHZGaZaH8)

This project consists of a frontend and backend service for a training management web application, along with a MySQL database. It is designed to reduce the workload of HR by automating tasks and providing visualization and efficient platform. The services are containerized using Docker and managed with Docker Compose.

The application is developed using:
- MySQL for the database
- Express and Node.js for the backend
- React with TypeScript and TailwindCSS for the frontend

## Features

- **Login (IAM) using Tokens JWT Authentication:** Secure login system using JSON Web Tokens (JWT) for authentication.
- **Automation of Emailing Employees:** Automated email scheduling using `node-schedule` and email functionality with `nodemailer`.
- **PDF Report Generation:** Employee Trainings report using `jdpsf`.

## Testing

- **Unit Testing using Jest:** Comprehensive unit tests to ensure reliability and correctness of the application's functionality.

## Setup

1. **Clone the repository:**
   ```
   git clone <repository_url>
   cd TrainingMgmtWebApp
   ```
2. **Create a .env file in the root/backend directory with the following content:**
   ```
   MYSQL_HOST=localhost
   MYSQL_USER=<your_mysql_username>
   MYSQL_PASSWORD=<your_mysql_password>
   MYSQL_DATABASE=training_app
   JWT_SECRET=52978356f7b8e636082d3820422ba2c96ee4748c686d4c227c198c02349a8e6e
   ```
3. **Setup initial MySQL Database with preset data**
   ```
   mysql -u <your_mysql_username> -p
   <your_mysql_password>
   USE training_app;
   source <path to repo file>\TrainingMgmtWebApp\sql\schema.sql
   ```
4. **Run backend and frontend on separate terminals**
   ```
   npm i
   npm run dev
   ```
5. **Login using "admin" as username and password**

## Accessing the Application

- Backend: The backend service runs on http://localhost:3000
  - The following api access are available: '/employees'
- Frontend: Open your browser and navigate to http://localhost:5001 (home page)
  - To access employee page, navigate to http://localhost:5001/employees

## Running SQL Queries

To run SQL queries directly on the MySQL database:
   ```
   mysql -u root -p
   <your_mysql_password>
   USE training_app;
   SHOW TABLES;
   ```
   _Enter the root password (as specified in .env):_

## Contributing

1. **Clone the repository:**

   ```
   git clone <repository_url>
   cd TrainingMgmtWebApp
   ```

2. **Create a new branch for you to work on. The main branch is protected, so you cannot push directly to it:**
   ```
   git checkout -b <your_branch_name>
   ```
3. **Commit your changes with a clear and descriptive commit message:**

   ```
   git add .
   git commit -m "Describe your changes"
   ```

4. **Push your changes to the remote repository:**
   ```
   git push origin <your_branch_name>
   ```
5. **Before creating Pull Request, merge and sync up with main branch**
   ```
   git checkout auto-email <your_branch_name>

   # Fetch the latest changes from the remote repository
   git fetch origin

   # Merge the latest changes from the main branch into your feature branch
   git merge origin/main

   # Resolve any conflicts that may arise during the merge process
   # Manually resolve conflicts and then commit the changes
   git commit -m "Resolve merge conflicts with main branch"

   # Push the merged branch to the remote repository
   git push origin auto-email
   ```
7. **Create a Pull Request:**

   Go to the repository on GitHub and click on the "New Pull Request" button. Select your branch and compare it to the base branch (main). Create the pull request and provide a description of your changes.

8. **Review and Merge:**

   Once your pull request is reviewed and approved, it will be merged into the main branch.

Note: Since the main branch is protected, all changes must go through a pull request and be reviewed before they are merged.
