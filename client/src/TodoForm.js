import React, { useState } from 'react';
import axios from 'axios';

const TodoForm = ({ onAdd }) => {
  const [task, setTask] = useState('');

  const addTodo = async () => {
    try {
      // Gunakan path relatif. Nginx akan meneruskan request ini ke backend.
      const response = await axios.post('/todos', { task });
      onAdd(response.data);
      setTask('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  return (
    <div>
      <input 
        type="text" 
        value={task} 
        onChange={(e) => setTask(e.target.value)} 
        placeholder="Add a new task"
      />
      <button onClick={addTodo}>Add Todo</button>
    </div>
  );
};

export default TodoForm;
