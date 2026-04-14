const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'task_management',
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  max: 20, idleTimeoutMillis: 30000, connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => console.error('Pool error:', err.message));

async function initializeDatabase() {
  let retries = 0;
  while (retries < 5) {
    try {
      const client = await pool.connect();
      await client.query(
        "CREATE TABLE IF NOT EXISTS tasks (" +
        "id SERIAL PRIMARY KEY," +
        "title VARCHAR(255) NOT NULL," +
        "description TEXT," +
        "status VARCHAR(20) DEFAULT 'TODO' CHECK (status IN ('TODO','IN_PROGRESS','DONE'))," +
        "priority VARCHAR(10) DEFAULT 'MEDIUM' CHECK (priority IN ('LOW','MEDIUM','HIGH'))," +
        "due_date DATE," +
        "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP," +
        "updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);"
      );
      await client.query(
        "CREATE OR REPLACE FUNCTION update_modified_column() " +
        "RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = CURRENT_TIMESTAMP; RETURN NEW; END; $$ language 'plpgsql';"
      );
      await client.query(
        "DO $$ BEGIN " +
        "IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_tasks_modtime') THEN " +
        "CREATE TRIGGER update_tasks_modtime BEFORE UPDATE ON tasks " +
        "FOR EACH ROW EXECUTE FUNCTION update_modified_column(); END IF; END $$;"
      );
      client.release();
      console.log('Database initialized');
      return;
    } catch (error) {
      retries++;
      console.error('DB attempt ' + retries + ' failed:', error.message);
      if (retries >= 5) throw new Error('Max retries reached');
      await new Promise(r => setTimeout(r, Math.pow(2, retries) * 1000));
    }
  }
}

module.exports = { pool, initializeDatabase };
