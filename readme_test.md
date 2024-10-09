# Internal Company Social Media App

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Implementation Plan](#implementation-plan)

---

## Overview
This app is an internal social media platform for employees to share suggestions, feedback, and concerns. For example, employees can post about office conditions (e.g., adjusting the air conditioning), and others can upvote or downvote the suggestion, leave comments, and mark the post as "done."

---

## Features
- **User Authentication**: Secure user login and profile management.
- **Post Creation**: Employees can create posts to suggest ideas or raise concerns.
- **Voting System**: Users can upvote or downvote posts.
- **Comments**: Employees can leave comments on posts.
- **Post Archival**: Posts can be marked as "done" once the issue is addressed.
- **Real-time Updates** (optional): Posts and comments update without page reloads (can be implemented later).

---

## Architecture

### 1. **Frontend (Client-side)**
   - **HTML/CSS/JavaScript** for structure, styling, and interactivity.
   - **AJAX/Fetch API** for making asynchronous requests to the backend.

### 2. **Backend (Server-side)**
   - **Flask (Python)** as the core web framework.
   - **SQLAlchemy** as the ORM (Object-Relational Mapping) for database management.
   - **Flask-Login** for user authentication.
   - **SQLite** as the database for storing users, posts, comments, and votes.

### 3. **Database Schema**
   - **Users** Table:
     - `id` (Primary Key)
     - `username`
     - `email`
     - `password_hash`
     - `role` (Regular User or Admin)
   - **Posts** Table:
     - `id` (Primary Key)
     - `user_id` (Foreign Key)
     - `content` (Text of the post)
     - `status` (Active or Archived)
     - `created_at` (Timestamp)
   - **Comments** Table:
     - `id` (Primary Key)
     - `post_id` (Foreign Key)
     - `user_id` (Foreign Key)
     - `comment_text`
     - `created_at` (Timestamp)
   - **Votes** Table:
     - `id` (Primary Key)
     - `post_id` (Foreign Key)
     - `user_id` (Foreign Key)
     - `vote_type` (Upvote or Downvote)

---

## Tech Stack

### **Frontend**:
- **HTML**: For structuring the content.
- **CSS**: For styling the application.
- **JavaScript**: For interactivity and making API calls to the backend.
- **AJAX/Fetch API**: For asynchronous operations without reloading the page.

### **Backend**:
- **Python**: Core programming language.
- **Flask**: Web framework to handle routes, requests, and responses.
- **SQLAlchemy**: ORM for managing the database.
- **Flask-Login**: For user authentication.
- **Flask-Migrate**: For database migrations and version control.

### **Database**:
- **SQLite** (for development) / **PostgreSQL** (for production): To store user data, posts, comments, and votes.

---

## Implementation Plan

### Stage 1: Setup the Project
1. Initialize a Flask project.
2. Set up virtual environments (e.g., `venv`).
3. Install necessary libraries (`Flask`, `SQLAlchemy`, `Flask-Login`, etc.).

### Stage 2: Design Database Schema
- Define models for Users, Posts, Comments, and Votes.
- Set up relationships between the models using SQLAlchemy.

### Stage 3: Create Backend Routes
- **Authentication Routes**:
  - `/register`: Handle user registration.
  - `/login`: Handle user login.
  - `/logout`: Handle user logout.
- **Post Routes**:
  - `/create_post`: To create a new post.
  - `/posts`: List all posts (active and archived).
  - `/archive_post/<post_id>`: Archive a post as done.
- **Comment Routes**:
  - `/comment/<post_id>`: Add a comment to a post.
- **Voting Routes**:
  - `/upvote/<post_id>`: Upvote a post.
  - `/downvote/<post_id>`: Downvote a post.

### Stage 4: Build the Frontend
1. **HTML Templates**: Create HTML templates for rendering the homepage, post creation page, etc.
2. **CSS/JS**: Add interactivity (e.g., voting, submitting comments) with JavaScript and style the app with CSS.
3. **AJAX**: Use JavaScript to send asynchronous requests for voting, commenting, and archiving posts without page reloads.

### Stage 5: Add User Authentication
- Use `Flask-Login` to manage user sessions, including registration, login, and logout.
- Protect certain routes (e.g., post creation, voting) so only authenticated users can access them.

### Stage 6: Implement Post Status and Archival
- Add functionality to mark posts as "done" by changing their status in the database.
- Display archived posts differently from active ones.

### Stage 7: Testing and Debugging
- Test the application thoroughly, ensuring the backend and frontend are correctly linked.
- Debug any issues with routes, database connections, or frontend features.

### Stage 8: Deployment (Optional)
- Set up deployment using **Docker**, **Heroku**, or your preferred hosting service.
- Use **PostgreSQL** for the production database.
- Ensure environment variables (like secret keys) are secured.

---

## Future Improvements
- Add **real-time updates** using WebSockets or Server-Sent Events.
- Implement **roles and permissions** for admins to manage posts and users.
- Add a **search feature** to find posts based on keywords or filters.

---

