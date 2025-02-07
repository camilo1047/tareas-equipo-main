import { Link, useNavigate } from "react-router-dom";
import { Container, Form, Button } from 'react-bootstrap';
import { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Hook para redireccionar

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      setMessage(response.data.message);
      localStorage.setItem('token', response.data.token); // Guardar el token en el almacenamiento local
      console.log('Token almacenado:', response.data.token); // Verificar que el token se almacene correctamente
      navigate('/dashboard'); // Redirigir a la página de perfil
    } catch (error) {
      setMessage(error.response.data.error);
    }
  };

  return (
    <Container className="login-container mt-4">
      <h1 className="text-center">Bienvenido</h1>
      <p className="text-center">Inicia sesión para continuar</p>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Correo electrónico</Form.Label>
          <Form.Control type="email" placeholder="Ingresa tu correo" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control type="password" placeholder="Ingresa tu contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-3">
          Iniciar Sesión
        </Button>
      </Form>
      {message && <p className="text-center">{message}</p>}
      <p className="text-center">
        ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
      </p>
    </Container>
  );
};

export default Login;
