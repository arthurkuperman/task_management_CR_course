import React, { useState } from 'react';

function TaskForm({ task, onSubmit, onCancel }) {
  const [fd, setFd] = useState({ title: task?task.title:'', description: task?(task.description||''):'', status: task?task.status:'TODO', priority: task?task.priority:'MEDIUM', due_date: task&&task.due_date?task.due_date.split('T')[0]:'' });
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const chg = (e) => setFd(p => ({...p, [e.target.name]: e.target.value}));
  const sub = async (e) => {
    e.preventDefault();
    if (!fd.title.trim()) { setError('Title required'); return; }
    try { setBusy(true); setError(null); await onSubmit({...fd, due_date: fd.due_date||null}); }
    catch (err) { setError(err.userMessage||'Save failed'); } finally { setBusy(false); }
  };
  return (
    <div className='modal-overlay' onClick={onCancel}>
      <div className='modal-content' onClick={e=>e.stopPropagation()}>
        <h2>{task?'Edit Task':'Create New Task'}</h2>
        {error && <div className='error-banner'>{error}</div>}
        <form onSubmit={sub}>
          <div className='form-group'><label>Title *</label><input type='text' name='title' value={fd.title} onChange={chg} maxLength={255} required /></div>
          <div className='form-group'><label>Description</label><textarea name='description' value={fd.description} onChange={chg} /></div>
          <div className='form-group'><label>Status</label><select name='status' value={fd.status} onChange={chg}><option value='TODO'>To Do</option><option value='IN_PROGRESS'>In Progress</option><option value='DONE'>Done</option></select></div>
          <div className='form-group'><label>Priority</label><select name='priority' value={fd.priority} onChange={chg}><option value='LOW'>Low</option><option value='MEDIUM'>Medium</option><option value='HIGH'>High</option></select></div>
          <div className='form-group'><label>Due Date</label><input type='date' name='due_date' value={fd.due_date} onChange={chg} /></div>
          <div className='form-actions'><button type='button' className='btn btn-secondary' onClick={onCancel}>Cancel</button><button type='submit' className='btn btn-primary' disabled={busy}>{busy?'Saving...':(task?'Update':'Create')}</button></div>
        </form>
      </div>
    </div>
  );
}

export default TaskForm;
