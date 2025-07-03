import express from 'express';
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

// Inisialisasi Aplikasi Express
const app = express();
const server = http.createServer(app);

// Inisialisasi Socket.IO untuk AWS
const io = new Server(server, {
  cors: {
    origin: "*", // Izinkan koneksi dari domain/IP manapun
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

// ======================================================
//                 MIDDLEWARE
// ======================================================
app.use(cors());
app.use(express.json());

// ======================================================
//                 KONEKSI DATABASE
// ======================================================
// Koneksi ini sudah benar untuk database yang di-host di server yang sama
const MONGO_URI = 'mongodb://localhost:27017/mern-stack-db';
mongoose.connect(MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB.'))
  .catch(err => console.error('Connection error', err));

// ======================================================
//             MONGOOSE SCHEMA & MODEL
// ======================================================
const todoSchema = new mongoose.Schema({
    task: { type: String, required: true },
    completed: { type: Boolean, default: false },
}, { timestamps: true });
const Todo = mongoose.model('Todo', todoSchema);

// ======================================================
//                 ROUTES (RUTE API)
// ======================================================
app.get('/todos', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.status(200).json(todos);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching todos', error });
    }
});
app.post('/todos', async (req, res) => {
    try {
        const newTodo = new Todo({ task: req.body.task });
        const savedTodo = await newTodo.save();
        res.status(201).json(savedTodo);
    } catch (error) {
        res.status(400).json({ message: 'Error creating todo', error });
    }
});
app.put('/todos/:id', async (req, res) => {
    try {
        const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedTodo);
    } catch (error) {
        res.status(400).json({ message: 'Error updating todo', error });
    }
});
app.delete('/todos/:id', async (req, res) => {
    try {
        await Todo.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Todo deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting todo', error });
    }
});

// ======================================================
//              LOGIKA SOCKET.IO
// ======================================================
let visitorCount = 0;
io.on('connection', (socket) => {
  visitorCount++;
  console.log('A user connected. Visitors:', visitorCount);
  io.emit('visitorCountUpdate', visitorCount);

  socket.on('disconnect', () => {
    visitorCount--;
    console.log('A user disconnected. Visitors:', visitorCount);
    io.emit('visitorCountUpdate', visitorCount);
  });
});

// ======================================================
//                 JALANKAN SERVER
// ======================================================
server.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
