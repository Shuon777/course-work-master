import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FilmographyList.css'; // Create this CSS file for styling

const FilmographyList = () => {
    const [filmographies, setFilmographies] = useState([]);
    const [films, setFilms] = useState([]);
    const [actors, setActors] = useState([]);
    const [filmography, setFilmography] = useState({
        film_id: '',
        actor_id: ''
    });
    const [editId, setEditId] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchFilmographies();
        fetchFilms();
        fetchActors();
    }, []);

    const fetchFilmographies = async () => {
        try {
            const response = await axios.get('http://localhost:8000/filmography_detailed/');
            setFilmographies(response.data);
        } catch (error) {
            console.error('Error fetching filmographies:', error);
        }
    };

    const fetchFilms = async () => {
        try {
            const response = await axios.get('http://localhost:8000/films/');
            setFilms(response.data);
        } catch (error) {
            console.error('Error fetching films:', error);
        }
    };

    const fetchActors = async () => {
        try {
            const response = await axios.get('http://localhost:8000/actors/');
            setActors(response.data);
        } catch (error) {
            console.error('Error fetching actors:', error);
        }
    };

    const handleAddFilmography = async (e) => {
        e.preventDefault();
        if (!filmography.film_id || !filmography.actor_id) {
            setErrorMessage('Пожалуйста, выберите фильм и актера.');
            return;
        }
        setErrorMessage(''); // Clear error message if both fields are filled

        try {
            const response = await axios.post('http://localhost:8000/filmographies/', filmography);
            const newFilmography = response.data;

            const selectedFilm = films.find(film => film.film_id === parseInt(newFilmography.film_id));
            const filmName = selectedFilm ? selectedFilm.film_name : '';

            const selectedActor = actors.find(actor => actor.actor_id === parseInt(newFilmography.actor_id));
            const actorName = selectedActor ? selectedActor.actor_name : '';

            const detailedFilmography = {
                ...newFilmography,
                film_name: filmName,
                actor_name: actorName
            };

            setFilmographies([...filmographies, detailedFilmography]);
            clearForm();
        } catch (error) {
            console.error('Error adding filmography:', error);
            if (error.response && error.response.data.detail) {
                alert(error.response.data.detail);
            } else {
                alert('An error occurred while adding the filmography.');
            }
        }
    };

    const handleEditFilmography = async (e) => {
        e.preventDefault();
        if (!filmography.film_id || !filmography.actor_id) {
            setErrorMessage('Пожалуйста, выберите фильм и актера.');
            return;
        }
        setErrorMessage(''); // Clear error message if both fields are filled

        try {
            const response = await axios.put(`http://localhost:8000/filmographies/${editId}`, filmography);
            const updatedFilmography = response.data;

            const selectedFilm = films.find(film => film.film_id === parseInt(updatedFilmography.film_id));
            const filmName = selectedFilm ? selectedFilm.film_name : '';

            const selectedActor = actors.find(actor => actor.actor_id === parseInt(updatedFilmography.actor_id));
            const actorName = selectedActor ? selectedActor.actor_name : '';

            const detailedUpdatedFilmography = {
                ...updatedFilmography,
                film_name: filmName,
                actor_name: actorName
            };

            setFilmographies(filmographies.map(item =>
                item.filmography_id === editId
                    ? detailedUpdatedFilmography
                    : item
            ));
            clearForm();
        } catch (error) {
            console.error('Error updating filmography:', error);
            if (error.response && error.response.data.detail) {
                alert(error.response.data.detail);
            } else {
                alert('An error occurred while updating the filmography.');
            }
        }
    };

    const handleDeleteFilmography = async (id) => {
        if (!window.confirm('Are you sure you want to delete this filmography?')) {
            return;
        }
        try {
            await axios.delete(`http://localhost:8000/filmographies/${id}`);
            setFilmographies(filmographies.filter(item => item.filmography_id !== id));
        } catch (error) {
            console.error('Error deleting filmography:', error);
            alert('An error occurred while deleting the filmography.');
        }
    };

    const handleEditClick = (filmography) => {
        setFilmography({
            film_id: filmography.film_id,
            actor_id: filmography.actor_id
        });
        setEditId(filmography.filmography_id);
    };

    const clearForm = () => {
        setFilmography({
            film_id: '',
            actor_id: ''
        });
        setEditId(null);
        setErrorMessage(''); // Clear error message on form clear
    };

    return (
        <div className="filmography-container">
            <h1>Фильмографии</h1>

            {errorMessage && <div className="error-message">{errorMessage}</div>}

            <form onSubmit={editId ? handleEditFilmography : handleAddFilmography}>
                <select
                    value={filmography.film_id}
                    onChange={(e) => setFilmography({ ...filmography, film_id: e.target.value })}
                    required
                >
                    <option value="">Выберите фильм</option>
                    {films.map((film) => (
                        <option key={film.film_id} value={film.film_id}>
                            {film.film_name}
                        </option>
                    ))}
                </select>

                <select
                    value={filmography.actor_id}
                    onChange={(e) => setFilmography({ ...filmography, actor_id: e.target.value })}
                    required
                >
                    <option value="">Выберите актера</option>
                    {actors.map((actor) => (
                        <option key={actor.actor_id} value={actor.actor_id}>
                            {actor.actor_name}
                        </option>
                    ))}
                </select>

                <button type="submit">
                    {editId ? 'Обновить' : 'Добавить'}
                </button>
                {editId && <button type="button" onClick={clearForm}>Отмена</button>}
            </form>

            <table border="1">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Фильм</th>
                        <th>Актер</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {filmographies.length > 0 ? (
                        filmographies.map((filmography) => (
                            <tr key={filmography.filmography_id}>
                                <td>{filmography.filmography_id}</td>
                                <td>{filmography.film_name}</td>
                                <td>{filmography.actor_name}</td>
                                <td>
                                    <div className="actions">
                                        <button onClick={() => handleEditClick(filmography)}>Редактировать</button>
                                        <button onClick={() => handleDeleteFilmography(filmography.filmography_id)}>Удалить</button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No filmographies available.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default FilmographyList;
