import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import TodoForm from './TodoForm';

// Ganti dengan alamat IP publik server AWS Anda
const SERVER_URL = 'http://52.65.159.30'; 
const socket = io(SERVER_URL);

const App = () => {
  const [todos, setTodos] = useState([]);
  const [visitorCount, setVisitorCount] = useState(0);

  useEffect(() => {
    // Gunakan path relatif untuk request API. Nginx akan meneruskannya.
    axios.get('/todos')
      .then(response => setTodos(response.data))
      .catch(error => console.error('Error fetching todos:', error));

    // Dengarkan event 'visitorCountUpdate' dari server
    socket.on('visitorCountUpdate', (count) => {
      setVisitorCount(count);
    });

    // Cleanup function untuk disconnect
    return () => {
      socket.disconnect();
    };
  }, []);

  const addTodo = (newTodo) => {
    setTodos([...todos, newTodo]);
  };

  return (
    <div className="container">
      <div className="visitor-counter">
        <p>👥 Pengunjung Saat Ini: {visitorCount}</p>
      </div>
      <h1>MERN Stack Todo App</h1>
      <TodoForm onAdd={addTodo} />
      <ul>
        {todos.map((todo) => (
          <li key={todo._id}>{todo.task}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
