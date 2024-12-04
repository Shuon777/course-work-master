// src/components/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Импортируем useNavigate
import './Register.css'; // Импортируем CSS файл

const Register = ({ onRegister }) => {
    const [moderator_email, set_moderator_email] = useState('');
    const [moderator_name, set_moderator_name] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Инициализируем useNavigate

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:8000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ moderator_name, moderator_email, password }),
        });

        if (response.ok) {
            const data = await response.json();
            onRegister(data);
            navigate('/'); // Переадресация на главную страницу
        } else {
            alert('Неверные учетные данные');
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Регистрация</h2>
                <div>
                    <label htmlFor="moderator_name">Имя:</label>
                    <input
                        type="moderator_name"
                        id="moderator_name"
                        value={moderator_name}
                        onChange={(e) => set_moderator_name(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="moderator_email">Почта:</label>
                    <input
                        type="moderator_email"
                        id="moderator_email"
                        value={moderator_email}
                        onChange={(e) => set_moderator_email(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Пароль:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Зарегистрироваться</button>
            </form>
        </div>
    );
};

export default Register;
