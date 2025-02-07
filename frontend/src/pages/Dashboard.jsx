import React, { useState } from 'react';
import axios from 'axios';
import * as jwt_decode from 'jwt-decode'; // Importar jwt-decode correctamente

const Dashboard = () => {
    const [task, setTask] = useState({
        title: '',
        description: '',
        dueDate: '',
        priority: '',
        user: '' // Agregar el campo user
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTask({
            ...task,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token'); // Assuming the JWT is stored in localStorage
            if (!token) {
                throw new Error('No token found');
            }
            const decodedToken = jwt_decode(token); // Usar jwt_decode.default para decodificar el token
            const userId = decodedToken.id; // Obtener el ID del usuario del token decodificado
            const taskWithUser = { ...task, user: userId }; // Agregar el campo user al objeto task
            console.log('Submitting task:', taskWithUser); // Imprimir el objeto task antes de enviarlo
            const response = await axios.post('http://localhost:5000/api/tasks', taskWithUser, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Task saved:', response.data);
            // Clear the form
            setTask({
                title: '',
                description: '',
                dueDate: '',
                priority: '',
                user: '' // Limpiar el campo user
            });
        } catch (error) {
            console.error('Error saving task:', error.response ? error.response.data : error.message);
            if (error.response && error.response.status === 401) {
                console.error('Unauthorized: Invalid or expired token');
            }
        }
    };

    return (
        <div>
            <h1>Dashboard</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        name="title"
                        value={task.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        name="description"
                        value={task.description}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Due Date:</label>
                    <input
                        type="date"
                        name="dueDate"
                        value={task.dueDate}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Priority:</label>
                    <select
                        name="priority"
                        value={task.priority}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Priority</option>
                        <option value="baja">Baja</option>
                        <option value="media">Media</option>
                        <option value="alta">Alta</option>
                    </select>
                </div>
                <button type="submit">Save Task</button>
            </form>
        </div>
    );
};

export default Dashboard;