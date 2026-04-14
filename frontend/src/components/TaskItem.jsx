import React from 'react';

function TaskItem({ task, onDelete, onEdit, onStatusChange }) {
  const overdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'DONE';
  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' }) : null;
  return (
    <div className={'task-card priority-' + task.priority}>
      <div className='task-card-header'><span className={'task-title' + (task.status==='DONE'?' done':'')}>{task.title}</span></div>
      <div className='task-badges'>
        <span className={'badge badge-' + task.status}>{task.status==='IN_PROGRESS'?'In Progress':task.status}</span>
        <span className={'badge badge-' + task.priority}>{task.priority}</span>
        {overdue && <span className='badge badge-overdue'>Overdue</span>}
      </div>
      {task.description && <p className='task-description'>{task.description}</p>}
      <div className='task-meta'>
        <div>{task.due_date ? <span>Due: {fmt(task.due_date)}</span> : <span>No due date</span>}</div>
        <div className='task-actions'>
          <select value={task.status} onChange={e => onStatusChange(task.id, e.target.value)}>
            <option value='TODO'>To Do</option><option value='IN_PROGRESS'>In Progress</option><option value='DONE'>Done</option>
          </select>
          <button className='btn-edit' onClick={() => onEdit(task)}>Edit</button>
          <button className='btn-delete' onClick={() => onDelete(task.id)}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default TaskItem;
