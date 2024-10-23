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
This app is an internal social media platform for employees to share suggestions, feedback, and concerns. For example, employees can post about something, problem he faced or maybe just joking, and others can upvote or downvote the suggestion, leave comments, and mark the post as archived"done."

---

## Features
- **Post Creation**: Employees can create posts to suggest ideas or raise concerns.
- **Voting System**: Users can upvote or downvote posts.
- **Comments**: Employees can leave comments on posts.
- **Post Archival**: Posts can be marked as "done" once the issue is addressed.

---

## Architecture & Tech Stack

### 1. **Frontend (Client-side)**
   - **HTML/CSS/JavaScript** for structure, styling, and interactivity.
   - **Fetch API** for making asynchronous requests to the backend.

### 2. **Backend (Server-side)**
   - **Flask (Python)** as the core web framework.
   - **SQLAlchemy** as the ORM (Object-Relational Mapping) for database management.
   - **SQLite** as the database for storing users, posts, comments, and votes.
---
### 3. **Installation & Usage**
#### a. Server side
```
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python run.py
```
#### b. client side
```
cd frontend
```
#### c. open the index.html with live server

