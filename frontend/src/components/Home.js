import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';
import './Home.css'; // Импортируем CSS файл

const Home = ({ user }) => {
    const navigate = useNavigate();

    return (
    <div>
        <h1>Добро Пожаловать!</h1>
        <h1> Пожалуйста, зарегистрируйтесь или войдите, чтобы получить доступ к полному функционалу сайта!</h1>
    </div>
    )
};

export default Home;