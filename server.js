import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// Inisialisasi Aplikasi Express
const app = express();
const PORT = process.env.PORT || 5000;

// ======================================================
//                 MIDDLEWARE
// ======================================================
// Mengizinkan permintaan dari origin lain (penting untuk MERN stack)
app.use(cors());
// Mem-parsing body request yang masuk sebagai JSON
app.use(express.json());

// ======================================================
//                 KONEKSI DATABASE
// ======================================================
// Ganti 'mern-stack-db' dengan nama database yang kamu inginkan
const MONGO_URI = 'mongodb://localhost:27017/mern-stack-db';

mongoose.connect(MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB.'))
  .catch(err => console.error('Connection error', err));

// ======================================================
//             MONGOOSE SCHEMA & MODEL
// ======================================================
// 1. Definisikan Schema (struktur data untuk collection 'todos')
const todoSchema = new mongoose.Schema({
    task: {
        type: String,
        required: true, // Sebaiknya tambahkan validasi dasar
    },
    completed: {
        type: Boolean,
        default: false, // Beri nilai default
    },
}, { timestamps: true }); // timestamps akan otomatis menambahkan createdAt dan updatedAt

// 2. Buat Model dari Schema. 'Todo' akan menjadi collection 'todos' di MongoDB.
const Todo = mongoose.model('Todo', todoSchema);

// ======================================================
//                     ROUTES (RUTE API)
// ======================================================

// GET: Mendapatkan semua todos
app.get('/todos', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.status(200).json(todos);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching todos', error });
    }
});

// POST: Membuat todo baru
app.post('/todos', async (req, res) => {
    try {
        const newTodo = new Todo({
            task: req.body.task,
            completed: req.body.completed
        });
        const savedTodo = await newTodo.save();
        res.status(201).json(savedTodo);
    } catch (error) {
        res.status(400).json({ message: 'Error creating todo', error });
    }
});

// PUT: Memperbarui todo berdasarkan ID
app.put('/todos/:id', async (req, res) => {
    try {
        const updatedTodo = await Todo.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } // Opsi ini mengembalikan dokumen yang sudah diperbarui
        );
        res.status(200).json(updatedTodo);
    } catch (error) {
        res.status(400).json({ message: 'Error updating todo', error });
    }
});

// DELETE: Menghapus todo berdasarkan ID
app.delete('/todos/:id', async (req, res) => {
    try {
        await Todo.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Todo deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting todo', error });
    }
});

// ======================================================
//                 JALANKAN SERVER
// ======================================================
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
