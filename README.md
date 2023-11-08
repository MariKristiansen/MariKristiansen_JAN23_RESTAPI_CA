[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/PDAJtvbl)
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-718a45dd9cf7e7f842a935f5ebbe5719a5e09af4491e668f4dbf3b35d5cca122.svg)](https://classroom.github.com/online_ide?assignment_repo_id=12396473&assignment_repo_type=AssignmentRepo)

![](http://143.42.108.232/pvt/Noroff-64.png)
# Noroff
## Back-end Development Year 1
### REST API - Course Assignment 1 <sup>V2</sup>

Startup code for Noroff back-end development 1 - REST API course.

Instruction for the course assignment is in the LMS (Moodle) system of Noroff.
[https://lms.noroff.no](https://lms.noroff.no)

![](http://143.42.108.232/pvt/important.png)

You will not be able to make any submission after the deadline of the course assignment. Make sure to make all your commit **BEFORE** the deadline

![](http://143.42.108.232/pvt/help_small.png)

If you are unsure of any instructions for the course assignment, contact out to your teacher on **Microsoft Teams**.

**REMEMBER** Your Moodle LMS submission must have your repository link **AND** your Github username in the text file.

---

# Application Installation and Usage Instructions
- Clone repository to your local machine.
- To install dependencies - run the command:
  ```
    npm install
  ```
- Create a .env file with your Environmental Variables, use the env_example file for guidance.
- Make sure to create the database and grant access.
- To start the server, run the command:
  ```
    npm start
  ```
- To run the test, open a new terminal and run the command:
  ```
    npm test
  ```

# Environment Variables
- HOST = ""
- ADMIN_USERNAME = ""
- ADMIN_PASSWORD = ""
- DATABASE_NAME = ""
- DIALECT = ""
- PORT = ""
- TOKEN_SECRET =

# Additional Libraries/Packages
Dependencies:
  - "cookie-parser": "~1.4.4",
  - "debug": "~2.6.9",
  - "dotenv": "^16.0.3",
  - "ejs": "^3.1.8",
  - "express": "^4.18.2",
  - "http-errors": "~1.6.3",
  - "jest": "^29.7.0",
  - "jsend": "^1.1.0",
  - "jsonwebtoken": "^9.0.2",
  - "morgan": "~1.9.1",
  - "mysql": "^2.18.1",
  - "mysql2": "^3.1.2",
  - "sequelize": "^6.29.0",
  - "supertest": "^6.3.3",
  - "swagger-autogen": "^2.23.6",
  - "swagger-ui-express": "^5.0.0"

# NodeJS Version Used
Node.js v18.16.0.

# POSTMAN Documentation link
https://documenter.getpostman.com/view/27769559/2s9YR9YCog