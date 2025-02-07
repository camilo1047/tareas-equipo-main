import React, { useState } from "react";
import axios from "axios";
import { jwtDecode } from 'jwt-decode'; // Importación corregida

const Dashboard = () => {
    const [task, setTask] = useState({
        title: "",
        description: "",
        dueDate: "",
        priority: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTask({
            ...task,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                console.error("No se encontró un token. El usuario no está autenticado.");
                return;
            }

            const decodedToken = jwtDecode(token);
            if (!decodedToken.id) {
                console.error("El token no contiene un ID de usuario válido.");
                return;
            }

            const taskWithUser = { ...task, user: decodedToken.id };

            console.log("Enviando tarea:", JSON.stringify(taskWithUser, null, 2));

            const response = await axios.post(
                "http://localhost:5000/api/tasks",
                taskWithUser,
                {
                    headers: {
                        Authorization: `${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("Tarea guardada con éxito:", response.data);

            // Limpiar el formulario
            setTask({
                title: "",
                description: "",
                dueDate: "",
                priority: "",
            });
        } catch (error) {
            console.error(
                "Error al guardar la tarea:",
                error.response ? error.response.data : error.message
            );

            if (error.response) {
                console.error("Detalles del error:", error.response.data);
            }
        }
    };

    return (
        <div>
            <h1>Dashboard</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Título:</label>
                    <input
                        type="text"
                        name="title"
                        value={task.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Descripción:</label>
                    <textarea
                        name="description"
                        value={task.description}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Fecha de vencimiento:</label>
                    <input
                        type="date"
                        name="dueDate"
                        value={task.dueDate}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Prioridad:</label>
                    <select
                        name="priority"
                        value={task.priority}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecciona una prioridad</option>
                        <option value="baja">Baja</option>
                        <option value="media">Media</option>
                        <option value="alta">Alta</option>
                    </select>
                </div>
                <button type="submit">Guardar Tarea</button>
            </form>
        </div>
    );
};

export default Dashboard;
