import React, { useState, useEffect, useCallback, useMemo } from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import AITaskCreator from './components/AITaskCreator';
import * as api from './services/api';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');

  const fetchTasks = useCallback(async () => {
    try { setLoading(true); setError(null);
      const p = {}; if (filterStatus) p.status = filterStatus; if (filterPriority) p.priority = filterPriority;
      const r = await api.getAllTasks(p); setTasks(r.data);
    } catch (e) { setError(e.userMessage || 'Failed to load tasks'); }
    finally { setLoading(false); }
  }, [filterStatus, filterPriority]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const handleCreate = useCallback(async (d) => { await api.createTask(d); setShowForm(false); fetchTasks(); }, [fetchTasks]);
  const handleUpdate = useCallback(async (d) => { await api.updateTask(editingTask.id, d); setEditingTask(null); setShowForm(false); fetchTasks(); }, [editingTask, fetchTasks]);
  const handleDelete = useCallback(async (id) => { if (!window.confirm('Delete this task?')) return; try { await api.deleteTask(id); fetchTasks(); } catch(e) { setError(e.userMessage || 'Delete failed'); } }, [fetchTasks]);
  const handleStatus = useCallback(async (id, s) => { try { await api.updateTask(id, { status: s }); fetchTasks(); } catch(e) { setError('Status update failed'); } }, [fetchTasks]);
  const handleEdit = useCallback((t) => { setEditingTask(t); setShowForm(true); }, []);
  const onAI = useCallback(() => { fetchTasks(); }, [fetchTasks]);

  const stats = useMemo(() => ({ total: tasks.length, todo: tasks.filter(t=>t.status==='TODO').length, inProgress: tasks.filter(t=>t.status==='IN_PROGRESS').length, done: tasks.filter(t=>t.status==='DONE').length }), [tasks]);

  return (
    <div className='app'>
      <header className='app-header'><h1>AI Task Manager</h1><p>Manage tasks with AI-powered creation</p></header>
      <main>
        <div className='stats-bar'>
          <div className='stat-item'><span className='stat-number'>{stats.total}</span><span className='stat-label'>Total</span></div>
          <div className='stat-item todo'><span className='stat-number'>{stats.todo}</span><span className='stat-label'>To Do</span></div>
          <div className='stat-item progress'><span className='stat-number'>{stats.inProgress}</span><span className='stat-label'>In Progress</span></div>
          <div className='stat-item done'><span className='stat-number'>{stats.done}</span><span className='stat-label'>Done</span></div>
        </div>
        <AITaskCreator onTaskCreated={onAI} />
        <div className='controls-bar'>
          <div className='filters'>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}><option value=''>All Statuses</option><option value='TODO'>To Do</option><option value='IN_PROGRESS'>In Progress</option><option value='DONE'>Done</option></select>
            <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}><option value=''>All Priorities</option><option value='HIGH'>High</option><option value='MEDIUM'>Medium</option><option value='LOW'>Low</option></select>
          </div>
          <button className='btn btn-primary' onClick={() => { setEditingTask(null); setShowForm(true); }}>+ New Task</button>
        </div>
        {error && <div className='error-banner'>{error}<button onClick={() => setError(null)}>X</button></div>}
        {loading ? <div className='loading'>Loading...</div> : <TaskList tasks={tasks} onDelete={handleDelete} onEdit={handleEdit} onStatusChange={handleStatus} />}
        {showForm && <TaskForm task={editingTask} onSubmit={editingTask ? handleUpdate : handleCreate} onCancel={() => { setShowForm(false); setEditingTask(null); }} />}
      </main>
    </div>
  );
}

export default App;
