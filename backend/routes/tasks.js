const express = require('express');
const Task = require('../models/Task');

const router = express.Router();

// Crear tarea
router.post('/', async (req, res) => {
    const { title, description, dueDate, priority } = req.body;
    try {
        const task = new Task({ title, description, dueDate, priority, user: req.user.id });
        await task.save();
        res.status(201).json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Listar tareas
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id });
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Actualizar tarea
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedTask);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Eliminar tarea
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Task.findByIdAndDelete(id);
        res.status(200).json({ message: 'Tarea eliminada con éxito' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
