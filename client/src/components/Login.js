//client/src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [nombre_usuario, setNombreUsuario] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/auth/signin', { nombre_usuario, password });
            localStorage.setItem('token', response.data.token);
            navigate('/users');
        } catch (error) {
            console.error(error);
            alert('Login failed');
        }
    };

    const handleRegister = async () => {
        try {
            const response = await axios.post('http://localhost:3000/auth/signup', { nombre_usuario, password });
            console.log('Usuario registrado:', response.data);
            // Redirige o muestra un mensaje de éxito aquí
        } catch (error) {
            console.error(error);
            alert('Error al registrar usuario');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={nombre_usuario}
                        onChange={(e) => setNombreUsuario(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Iniciar Sesión</button>
            </form>
            <div className="button-container">
                <button type="button" onClick={handleRegister}>Registro de Usuarios</button>
            </div>
        </div>
    );
};

export default Login;
