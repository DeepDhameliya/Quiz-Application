# Quiz Application

This is a Quiz application built using HTML, CSS, and JavaScript for the frontend, Node.js for the backend, and PostgreSQL as the database. The application allows users to register, log in, and participate in surveys created by an admin.

## Features


### Admin
- **Quiz Management**: Add questions with options and specify correct answers.
- **View Submissions**: View all quiz submissions by users.
- **Result Analysis**: Analyze quiz results with visualizations like doughnut and pie charts.
- **Email Results**: Send quiz results to users via email.

### User
- **Authentication**: Register, log in, and reset password.
- **Participation**: Take quizzes, with automatic submission if time expires.
- **Score Tracking**: View final quiz scores and past scores in profile.
- **Timed Quizzes**: Complete quizzes with a default of 30 seconds per question.

## Installation

### Prerequisites
- Node.js
- PostgreSQL
- XAMPP Server

### Setup

1. **Clone the repository:**

    ```bash
    https://github.com/DeepDhameliya/Quiz-Application.git
    cd Quiz-Application
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Install nodemon (if not already installed globally):**

    ```bash
    npm install -g nodemon
    ```

4. **Set up the environment variables:**

    Create a `.env` file in the root directory with the following content (replace the placeholder values with your actual values):

    ```env
    GOOGLE_CLIENT_ID=""         # Your Google Client ID
    GOOGLE_CLIENT_SECRET=""     # Your Google Client Secret
    SESSION_SECRET=""           # A secret key for session management
    PG_USER=""                  # PostgreSQL username
    PG_HOST="localhost"         # PostgreSQL host (default: localhost)
    PG_DATABASE="your_database_name"  # Replace with your PostgreSQL database name
    PG_PASSWORD=""              # PostgreSQL password
    PG_PORT="5432"              # PostgreSQL port (default: 5432)
    ADMIN_EMAIL=""              # Admin email address
    ADMIN_PASS=""               # Admin password
    ADMIN_NAME="Admin User"     # Admin username (default: Admin User)
    ADMIN_TOKEN=""              # Admin token for specific functionalities
    EMAIL_PASSWORD=""           # Email password for sending emails (e.g., SMTP service)
    ```

5. **Set up the PostgreSQL database:**

    - Log in to your PostgreSQL server:

      ```bash
      psql -U postgres
      ```

    - Create the required tables:

      ```sql
      -- Users Table
      CREATE TABLE users (
          userid SERIAL PRIMARY KEY,
          first_name VARCHAR(50) NOT NULL,
          last_name VARCHAR(50) NOT NULL,
          mobile_number VARCHAR(15) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          score INTEGER DEFAULT 0,
          token_no VARCHAR(255),
          token_timestamp TIMESTAMP
      );

      -- Survey Questions Table
      CREATE TABLE questions (
          question_id SERIAL PRIMARY KEY,
          question TEXT NOT NULL,
          options TEXT NOT NULL, -- Comma-separated options
          correct_answer VARCHAR(255) NOT NULL
      );

      

      -- Survey Responses Table
      CREATE TABLE survey_responses (
          response_id SERIAL PRIMARY KEY,
          user_id INT NOT NULL,
          question_id INT NOT NULL,
          response TEXT NOT NULL,
          UNIQUE (user_id, question_id),  -- Ensure that each user can only respond to each question once
          FOREIGN KEY (user_id) REFERENCES users(userid) ON DELETE CASCADE,
          FOREIGN KEY (question_id) REFERENCES survey_questions(id) ON DELETE CASCADE
      );

      ```
6. **Start the application:**

    ```bash
    nodemon main.js
    ```

7. **Access the application:**

    - Visit `http://localhost:3000` in your browser to use the application.
