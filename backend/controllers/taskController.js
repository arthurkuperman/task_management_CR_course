const Task = require('../models/Task');
const { parseNaturalLanguageTask } = require('../services/aiService');

exports.getAllTasks = async (req, res) => {
  try {
    const filters = {};
    if (req.query.status) filters.status = req.query.status;
    if (req.query.priority) filters.priority = req.query.priority;
    if (req.query.search) filters.search = req.query.search;
    const tasks = await Task.findAll(filters);
    res.json(tasks);
  } catch (err) { res.status(500).json({ error: 'Failed to fetch tasks' }); }
};

exports.getTaskStats = async (req, res) => {
  try { res.json(await Task.getStats()); }
  catch (err) { res.status(500).json({ error: 'Failed to fetch stats' }); }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) { res.status(500).json({ error: 'Failed to fetch task' }); }
};

exports.createTask = async (req, res) => {
  try {
    const { title, description, status, priority, due_date } = req.body;
    if (!title || !title.trim()) return res.status(400).json({ error: 'Title is required' });
    const task = await Task.create({ title: title.trim(), description: description ? description.trim() : null, status: status || 'TODO', priority: priority || 'MEDIUM', due_date: due_date || null });
    res.status(201).json(task);
  } catch (err) { res.status(500).json({ error: 'Failed to create task' }); }
};

exports.createTaskWithAI = async (req, res) => {
  try {
    const { naturalLanguageInput } = req.body;
    if (!naturalLanguageInput || !naturalLanguageInput.trim()) return res.status(400).json({ error: 'Input required' });
    const taskData = await parseNaturalLanguageTask(naturalLanguageInput.trim());
    if (!taskData || !taskData.title) return res.status(400).json({ error: 'AI could not parse input' });
    const task = await Task.create({ title: taskData.title, description: taskData.description || null, status: taskData.status || 'TODO', priority: taskData.priority || 'MEDIUM', due_date: taskData.dueDate || taskData.due_date || null });
    res.status(201).json({ task: task, aiParsed: taskData });
  } catch (err) { res.status(500).json({ error: 'AI task failed: ' + err.message }); }
};

exports.updateTask = async (req, res) => {
  try {
    const { title, description, status, priority, due_date } = req.body;
    const task = await Task.update(req.params.id, { title, description, status, priority, due_date });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) { res.status(500).json({ error: 'Failed to update' }); }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.delete(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Deleted', task: task });
  } catch (err) { res.status(500).json({ error: 'Failed to delete' }); }
};
