import React from 'react';
import TaskItem from './TaskItem';

function TaskList({ tasks, onDelete, onEdit, onStatusChange }) {
  if (!tasks || tasks.length === 0) return <div className='task-list-empty'><h3>No tasks found</h3><p>Create a task or use AI creator!</p></div>;
  return <div className='task-list'>{tasks.map(t => <TaskItem key={t.id} task={t} onDelete={onDelete} onEdit={onEdit} onStatusChange={onStatusChange} />)}</div>;
}

export default TaskList;
