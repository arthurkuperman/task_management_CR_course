const express = require('express');
const handler = express.Router();
const ctrl = require('../controllers/taskController');
const { validateTaskInput, validateAIInput } = require('../middleware/validation');

handler.get('/stats/summary', ctrl.getTaskStats);
handler.get('/', ctrl.getAllTasks);
handler.get('/:id', ctrl.getTaskById);
handler.post('/', validateTaskInput, ctrl.createTask);
handler.post('/ai', validateAIInput, ctrl.createTaskWithAI);
handler.put('/:id', validateTaskInput, ctrl.updateTask);
handler.delete('/:id', ctrl.deleteTask);

module.exports = handler;
