const { pool } = require('../config/database');

const Task = {
  async findAll(filters) {
    filters = filters || {};
    let query = 'SELECT * FROM tasks';
    const conds = [], vals = [];
    let idx = 1;
    if (filters.status) { conds.push('status = $' + idx++); vals.push(filters.status); }
    if (filters.priority) { conds.push('priority = $' + idx++); vals.push(filters.priority); }
    if (filters.search) {
      conds.push('(title ILIKE $' + idx + ' OR description ILIKE $' + idx + ')');
      vals.push('%' + filters.search + '%'); idx++;
    }
    if (conds.length > 0) query += ' WHERE ' + conds.join(' AND ');
    query += ' ORDER BY created_at DESC';
    const result = await pool.query(query, vals);
    return result.rows;
  },
  async findById(id) {
    const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    return result.rows[0] || null;
  },
  async create(data) {
    const result = await pool.query(
      'INSERT INTO tasks (title, description, status, priority, due_date) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [data.title, data.description || null, data.status || 'TODO', data.priority || 'MEDIUM', data.due_date || null]
    );
    return result.rows[0];
  },
  async update(id, data) {
    const result = await pool.query(
      'UPDATE tasks SET title=COALESCE($1,title), description=COALESCE($2,description), ' +
      'status=COALESCE($3,status), priority=COALESCE($4,priority), due_date=COALESCE($5,due_date) ' +
      'WHERE id=$6 RETURNING *',
      [data.title, data.description, data.status, data.priority, data.due_date, id]
    );
    return result.rows[0] || null;
  },
  async delete(id) {
    const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
    return result.rows[0] || null;
  },
  async getStats() {
    const result = await pool.query(
      "SELECT COUNT(*) as total, " +
      "COUNT(*) FILTER (WHERE status='TODO') as todo, " +
      "COUNT(*) FILTER (WHERE status='IN_PROGRESS') as in_progress, " +
      "COUNT(*) FILTER (WHERE status='DONE') as done, " +
      "COUNT(*) FILTER (WHERE priority='HIGH') as high_priority, " +
      "COUNT(*) FILTER (WHERE due_date < CURRENT_DATE AND status != 'DONE') as overdue " +
      "FROM tasks"
    );
    return result.rows[0];
  }
};

module.exports = Task;
