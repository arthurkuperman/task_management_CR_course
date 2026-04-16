# Project developed by: Arthur Kuperman and Yair Haendler

# AI-Powered Task Management System

Full-stack task management application with 3-tier architecture 
and AI-powered natural language task creation.

## Technologies
- **Frontend:** React, Tailwind CSS, Axios
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **AI:** AWS Bedrock (Claude)

## Architecture

This project follows a **3-tier architecture**:

| Layer | Technology | Role |
|---|---|---|
| Presentation | React + Tailwind CSS | User interface and interaction |
| Business Logic | Node.js + Express.js + AWS Bedrock SDK | API handling, validation, AI integration |
| Data Access | PostgreSQL | Data storage and retrieval |

### AI Integration
Users can create tasks using natural language. AWS Bedrock (Claude) 
parses the input and extracts structured task data including title, 
description, priority, due date, and status.

## Project Structure

```
backend/
├── server.js
├── config/
│   ├── database.js
│   └── bedrock.js
├── models/
│   └── Task.js
├── controllers/
│   └── taskController.js
├── services/
│   └── aiService.js
├── routes/
│   └── taskRoutes.js
├── middleware/
│   └── validation.js
└── package.json

frontend/
├── src/
│   ├── components/
│   │   ├── TaskList.jsx
│   │   ├── TaskItem.jsx
│   │   ├── TaskForm.jsx
│   │   └── AITaskCreator.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   └── index.js
└── package.json

results_output/
└── (screenshots proving functionality)
```


## Setup

### Database

```sql
CREATE DATABASE task_management;
```

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

### Frontend
```bash

cd frontend
npm install
npm start
```




## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/tasks | Get all tasks |
| POST | /api/tasks | Create a task manually |
| POST | /api/tasks/ai | Create a task with AI (natural language) |
| PUT | /api/tasks/:id | Update a task |
| DELETE | /api/tasks/:id | Delete a task |

### POST /api/tasks/ai — Example
**Request:**
{ "naturalLanguageInput": "Finish the report by Friday, it's urgent" }

**Response:**
{ "id": 1, "title": "Finish Report", "priority": "HIGH", "status": "TODO", ... }

## Environment Variables

Configuration is stored in `.env` (not published to Git for security).
See `.env.example` for required variables.

The AI connection to AWS Bedrock uses credentials not shared in the 
repository for security reasons. 

## Output

Successful results are demonstrated in the `results_output/` folder.

### Application Screenshot
- `screenshot_result.png` — Screenshot of the running application

### Postman API Validation Screenshots
| Endpoint | Method | Screenshot |
|---|---|---|
| /api/tasks | GET | `postman_GET_all_tasks.png` |
| /api/tasks | POST | `postman_POST_create_task.png` |
| /api/tasks/ai | POST | `postman_POST_ai_task.png` |
| /api/tasks/:id | PUT | `postman_PUT_update_task.png` |
| /api/tasks/:id | DELETE | `postman_DELETE_task.png` |



