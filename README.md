# Project developed by: Arthur Kuperman and Yair Haendler

# AI-Powered Task Management System

Full-stack task management with 3-tier architecture and AI-powered creation.

## Setup

### Database
sql
CREATE DATABASE task_management;


### Backend
bash
cd backend
npm install
mv env-template.txt .env
# Edit .env with your credentials
npm run dev


### Frontend
bash
cd frontend
npm install
npm start


## API
- GET /api/health - Health check
- GET /api/tasks - List tasks (filter: status, priority, search)
- GET /api/tasks/:id - Get task
- GET /api/tasks/stats/summary - Statistics
- POST /api/tasks - Create task
- POST /api/tasks/ai - AI create task
- PUT /api/tasks/:id - Update task
- DELETE /api/tasks/:id - Delete task


## Env

Configuration of .env not published on git due to security of AI settings (listed in .gitignore)
