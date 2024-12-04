import React, { useState } from 'react';
import axios from 'axios';
import './FilmsByProducerList.css';

const FilmsByProducerList = () => {
    const [producerName, setProducerName] = useState('');
    const [films, setFilms] = useState([]);
    const [error, setError] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'film_name', direction: 'ascending' });

    const fetchFilmsByProducer = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/films/by_producer/${producerName}`);
            setFilms(response.data);
            setError('');
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setError('Фильмы не найдены для этого режиссера');
            } else {
                console.error('Ошибка при получении фильмов по режиссеру:', error);
                setError('Произошла ошибка при получении фильмов');
            }
            setFilms([]);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchFilmsByProducer();
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
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
            <h1>Документ №2: Фильм конкретного режиссера</h1>

            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Введите режиссера"
                    value={producerName}
                    onChange={(e) => setProducerName(e.target.value)}
                    required
                />
                <button type="submit">Поиск</button>
            </form>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <table border="1">
                <thead>
                    <tr>
                        <th>Режиссер</th>
                        <th onClick={() => requestSort('film_name')}>
                            Фильм {sortConfig.key === 'film_name' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : '↕'}
                        </th>
                        <th>Студия</th>
                        <th>Дата выхода</th>
                        <th>Цена</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedFilms.length > 0 ? (
                        sortedFilms.map((film, index) => (
                            <tr key={index}>
                                <td>{film.producer_name}</td>
                                <td>{film.film_name}</td>
                                <td>{film.studio_name}</td>
                                <td>{formatDate(film.film_date_release)}</td>
                                <td>{film.film_rental} р.</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">Фильмов нет или не введен запрос</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default FilmsByProducerList;
