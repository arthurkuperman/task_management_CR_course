import React, { useState } from 'react';
import { createTaskWithAI } from '../services/api';

function AITaskCreator({ onTaskCreated }) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const submit = async (e) => {
    e.preventDefault(); if (!input.trim()) return;
    setLoading(true); setFeedback(null);
    try {
      const r = await createTaskWithAI(input.trim());
      const name = (r.data&&r.data.task&&r.data.task.title)||'New task';
      setFeedback({type:'success', message:'Created: '+name});
      setInput(''); onTaskCreated();
    } catch (err) {
      setFeedback({type:'error', message: err.userMessage||'AI creation failed'});
    }
    setLoading(false);
  };

  return (
    <div className='ai-creator'>
      <h3>Create Task with AI</h3>
      <form className='ai-form' onSubmit={submit}>
        <textarea placeholder='Describe your task in natural language...' value={input} onChange={e=>setInput(e.target.value)} disabled={loading} />
        <button type='submit' disabled={loading||!input.trim()}>{loading?'Creating...':'Create with AI'}</button>
      </form>
      {feedback && <div className={'ai-feedback '+feedback.type}>{feedback.message}</div>}
    </div>
  );
}

export default AITaskCreator;
