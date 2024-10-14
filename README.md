# my-voice
Social media app for communicating internally between organizations

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Implementation Plan](#implementation-plan)

---

## Overview
This app is an internal social media platform for employees to share suggestions, feedback, and concerns. For example, employees can post about something, problem he faced or maybe just joking, and others can upvote or downvote the suggestion, leave comments, and mark the post as "done."

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

### Stage 3: Build the basic frontend & Create the basic structure for backend routes
1. **HTML Templates**: Create HTML templates for rendering the homepage, post creation page, etc.
2. **API Routes**: login, register, logout, posts, create_post, comment, vote 