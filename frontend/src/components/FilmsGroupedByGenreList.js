import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FilmsGroupedByGenreList.css'; // Импортируем CSS файл

const FilmsGroupedByGenreList = () => {
    const [films, setFilms] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: 'genre_name', direction: 'ascending' });

    useEffect(() => {
        fetchFilms();
    }, []);

    const fetchFilms = async () => {
        try {
            const response = await axios.get('http://localhost:8000/films/grouped_by_genre');
            setFilms(response.data);
        } catch (error) {
            console.error('Error fetching films grouped by genre:', error);
        }
    };

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('ru-RU', options);
    };

    const sortedFilms = [...films].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
    });

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    return (
        <div>
            <h1>Документ №1: Фильмы по жанрам</h1>

            <table border="1">
                <thead>
                    <tr>
                        <th onClick={() => requestSort('genre_name')}>Жанр {sortConfig.key === 'genre_name' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : '↕'}</th>
                        <th onClick={() => requestSort('film_name')}>Фильм {sortConfig.key === 'film_name' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : '↕'}</th>
                        <th>Режиссер</th>
                        <th>Студия</th>
                        <th>Дата выхода</th>
                        <th>Стоимость проката</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedFilms.length > 0 ? (
                        sortedFilms.map((film, index) => (
                            <tr key={index}>
                                <td>{film.genre_name}</td>
                                <td>{film.film_name}</td>
                                <td>{film.producer_name}</td>
                                <td>{film.studio_name}</td>
                                <td>{formatDate(film.film_date_release)}</td>
                                <td>{film.film_rental} р.</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">Нет доступных фильмов</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default FilmsGroupedByGenreList;
