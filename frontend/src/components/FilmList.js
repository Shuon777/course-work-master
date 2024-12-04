import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FilmList.css';

const FilmList = () => {
    const [films, setFilms] = useState([]);
    const [studios, setStudios] = useState([]);
    const [genres, setGenres] = useState([]);
    const [producers, setProducers] = useState([]);
    const [film, setFilm] = useState({
        studio_id: '',
        genre_id: '',
        producer_id: '',
        film_name: '',
        film_date_release: '',
        film_rental: '',
        film_annotation: ''
    });
    const [editId, setEditId] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: 'film_id', direction: 'ascending' });
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchFilms();
        fetchStudios();
        fetchGenres();
        fetchProducers();
    }, []);

    const fetchFilms = async () => {
        try {
            const response = await axios.get('http://localhost:8000/films_detailed/');
            setFilms(response.data);
        } catch (error) {
            console.error('Ошибка при получении фильмов:', error);
        }
    };

    const fetchStudios = async () => {
        try {
            const response = await axios.get('http://localhost:8000/studios/');
            setStudios(response.data);
        } catch (error) {
            console.error('Ошибка при получении студий:', error);
        }
    };

    const fetchGenres = async () => {
        try {
            const response = await axios.get('http://localhost:8000/genres/');
            setGenres(response.data);
        } catch (error) {
            console.error('Ошибка при получении жанров:', error);
        }
    };

    const fetchProducers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/producers/');
            setProducers(response.data);
        } catch (error) {
            console.error('Ошибка при получении режиссеров:', error);
        }
    };

    const handleAddFilm = async (e) => {
        e.preventDefault();
        if (parseFloat(film.film_rental) <= 0) {
            setErrorMessage('Стоимость проката не может быть ниже или равна 0.');
            return;
        }
        setErrorMessage(''); // Сброс сообщения об ошибке
        try {
            await axios.post('http://localhost:8000/films/', film);
            fetchFilms();
            clearForm();
        } catch (error) {
            console.error('Ошибка при добавлении фильма:', error);
            if (error.response && error.response.data.detail) {
                alert(error.response.data.detail);
            } else {
                alert('Произошла ошибка при добавлении фильма.');
            }
        }
    };

    const handleEditFilm = async (e) => {
        e.preventDefault();
        if (parseFloat(film.film_rental) <= 0) {
            setErrorMessage('Стоимость проката не может быть ниже или равна 0.');
            return;
        }
        setErrorMessage(''); // Сброс сообщения об ошибке
        try {
            const response = await axios.put(`http://localhost:8000/films/${editId}`, film);
            setFilms(films.map(item =>
                item.film_id === editId ? { ...item, ...response.data } : item
            ));
            clearForm();
        } catch (error) {
            console.error('Ошибка при обновлении фильма:', error);
            if (error.response && error.response.data.detail) {
                alert(error.response.data.detail);
            } else {
                alert('Произошла ошибка при обновлении фильма.');
            }
        }
    };

    const handleDeleteFilm = async (id) => {
        const confirmDelete = window.confirm('Вы уверены, что хотите удалить этот фильм? Связанные данные могут быть затронуты.');
    
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:8000/films/${id}`);
                setFilms(films.filter(item => item.film_id !== id));
            } catch (error) {
                if (error.response && error.response.data) {
                    setErrorMessage(error.response.data.detail); // Отображаем сообщение об ошибке
                } else {
                    console.error('Ошибка при удалении фильма:', error);
                    setErrorMessage('Произошла ошибка при удалении фильма.');
                }
            }
        }
    };
    

    const handleEditClick = (film) => {
        setFilm({
            studio_id: film.studio_id,
            genre_id: film.genre_id,
            producer_id: film.producer_id,
            film_name: film.film_name,
            film_date_release: film.film_date_release ? film.film_date_release.split('T')[0] : '',
            film_rental: film.film_rental,
            film_annotation: film.film_annotation
        });
        setEditId(film.film_id);
        setErrorMessage(''); // Очищаем сообщение об ошибке при редактировании
    };

    const clearForm = () => {
        setFilm({
            studio_id: '',
            genre_id: '',
            producer_id: '',
            film_name: '',
            film_date_release: '',
            film_rental: '',
            film_annotation: ''
        });
        setEditId(null);
        setErrorMessage(''); // Очищаем сообщение об ошибке при очистке формы
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
        <div className="film-container">
            <h1>Фильмы</h1>

            {errorMessage && <div className="error-message">{errorMessage}</div>}

            <form onSubmit={editId ? handleEditFilm : handleAddFilm}>
                <select
                    value={film.studio_id}
                    onChange={(e) => setFilm({ ...film, studio_id: e.target.value })}
                    required
                >
                    <option value="">Выберите студию</option>
                    {studios.map((studio) => (
                        <option key={studio.studio_id} value={studio.studio_id}>
                            {studio.studio_name}
                        </option>
                    ))}
                </select>

                <select
                    value={film.genre_id}
                    onChange={(e) => setFilm({ ...film, genre_id: e.target.value })}
                    required
                >
                    <option value="">Выберите жанр</option>
                    {genres.map((genre) => (
                        <option key={genre.genre_id} value={genre.genre_id}>
                            {genre.genre_name}
                        </option>
                    ))}
                </select>

                <select
                    value={film.producer_id}
                    onChange={(e) => setFilm({ ...film, producer_id: e.target.value })}
                    required
                >
                    <option value="">Выберите режиссера</option>
                    {producers.map((producer) => (
                        <option key={producer.producer_id} value={producer.producer_id}>
                            {producer.producer_name}
                        </option>
                    ))}
                </select>

                <input
                    type="text"
                    placeholder="Название фильма"
                    value={film.film_name}
                    onChange={(e) => setFilm({ ...film, film_name: e.target.value })}
                    required
                />

                <input
                    type="date"
                    placeholder="Дата выпуска"
                    value={film.film_date_release}
                    onChange={(e) => setFilm({ ...film, film_date_release: e.target.value })}
                />

                <input
                    type="number"
                    step="0.01"
                    placeholder="Стоимость проката"
                    value={film.film_rental}
                    onChange={(e) => setFilm({ ...film, film_rental: e.target.value })}
                    required
                />

                <textarea
                    placeholder="Аннотация"
                    value={film.film_annotation}
                    onChange={(e) => setFilm({ ...film, film_annotation: e.target.value })}
                    required
                />

                <button type="submit">
                    {editId ? 'Обновить фильм' : 'Добавить фильм'}
                </button>
                {editId && <button type="button" onClick={clearForm}>Отмена</button>}
            </form>

            <table border="1">
                <thead>
                    <tr>
                        <th onClick={() => requestSort('film_id')}>ID {sortConfig.key === 'film_id' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : '↕'}</th>
                        <th onClick={() => requestSort('film_name')}>Название {sortConfig.key === 'film_name' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : '↕'}</th>
                        <th>Студия</th>
                        <th>Жанр</th>
                        <th>Режиссер</th>
                        <th>Дата выпуска</th>
                        <th onClick={() => requestSort('film_rental')}>Стоимость проката {sortConfig.key === 'film_rental' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : '↕'}</th>
                        <th>Аннотация</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedFilms.length > 0 ? (
                        sortedFilms.map((film) => (
                            <tr key={film.film_id}>
                                <td>{film.film_id}</td>
                                <td>{film.film_name}</td>
                                <td>{film.studio_name}</td>
                                <td>{film.genre_name}</td>
                                <td>{film.producer_name}</td>
                                <td>{film.film_date_release}</td>
                                <td>{film.film_rental}</td>
                                <td>{film.film_annotation}</td>
                                <td>
                                    <button onClick={() => handleEditClick(film)}>Редактировать</button>
                                    <button onClick={() => handleDeleteFilm(film.film_id)}>Удалить</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="9">Фильмы отсутствуют</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default FilmList;
