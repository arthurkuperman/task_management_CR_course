function validateTaskInput(req, res, next) {
  var title = req.body.title, status = req.body.status, priority = req.body.priority, due_date = req.body.due_date;
  if (req.method === 'POST' && (!title || !title.trim())) return res.status(400).json({ error: 'Title required' });
  if (title && title.length > 255) return res.status(400).json({ error: 'Title too long' });
  if (status && !['TODO','IN_PROGRESS','DONE'].includes(status)) return res.status(400).json({ error: 'Invalid status' });
  if (priority && !['LOW','MEDIUM','HIGH'].includes(priority)) return res.status(400).json({ error: 'Invalid priority' });
  if (due_date) {
    if (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(due_date)) return res.status(400).json({ error: 'Invalid date format' });
    if (isNaN(new Date(due_date).getTime())) return res.status(400).json({ error: 'Invalid date' });
  }
  next();
}

function validateAIInput(req, res, next) {
  var input = req.body.naturalLanguageInput;
  if (!input || !input.trim()) return res.status(400).json({ error: 'Input required' });
  if (input.length > 1000) return res.status(400).json({ error: 'Input too long' });
  next();
}

module.exports = { validateTaskInput: validateTaskInput, validateAIInput: validateAIInput };
