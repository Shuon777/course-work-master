import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GenreList.css'; // Импортируем CSS файл

const GenreList = () => {
    const [genres, setGenres] = useState([]);
    const [genreName, setGenreName] = useState('');
    const [editId, setEditId] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchGenres();
    }, []);

    // Функция для получения списка жанров
    const fetchGenres = async () => {
        try {
            const response = await axios.get('http://localhost:8000/genres/');
            setGenres(response.data);
        } catch (error) {
            console.error('Ошибка при получении жанров:', error);
        }
    };

    // Функция для добавления нового жанра
    const handleAddGenre = async (e) => {
        e.preventDefault(); // Предотвращаем перезагрузку страницы

        if (genreName.length <= 1) {
            setErrorMessage('Название жанра должно содержать более 1 символа.');
            return;
        }

        if (genres.some(genre => genre.genre_name === genreName)) {
            setErrorMessage('Жанр с таким названием уже существует.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/genres/', {
                genre_name: genreName,
            });
            setGenres([...genres, response.data]);
            clearForm();
        } catch (error) {
            console.error('Ошибка при добавлении жанра:', error);
        }
    };

    // Функция для обновления существующего жанра
    const handleEditGenre = async (e) => {
        e.preventDefault(); // Предотвращаем перезагрузку страницы

        if (genreName.length <= 1) {
            setErrorMessage('Название жанра должно содержать более 1 символа.');
            return;
        }

        try {
            const response = await axios.put(`http://localhost:8000/genres/${editId}`, {
                genre_name: genreName,
            });
            setGenres(genres.map(genre =>
                genre.genre_id === editId
                    ? { ...genre, genre_name: genreName }
                    : genre
            ));
            clearForm();
        } catch (error) {
            console.error('Ошибка при обновлении жанра:', error);
        }
    };

    // Функция для удаления жанра
    const handleDeleteGenre = async (id) => {
        const confirmDelete = window.confirm('Вы уверены, что хотите удалить этот жанр? Все связанные записи в других таблицах могут быть удалены.');
        
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:8000/genres/${id}`);
                setGenres(genres.filter(genre => genre.genre_id !== id));
            } catch (error) {
                if (error.response && error.response.data) {
                    setErrorMessage(error.response.data.detail); // Отображаем сообщение об ошибке
                } else {
                    console.error('Ошибка при удалении жанра:', error);
                }
            }
        }
    };

    // Функция для заполнения формы редактирования
    const handleEditClick = (genre) => {
        setGenreName(genre.genre_name);
        setEditId(genre.genre_id); // Устанавливаем ID для редактирования
        setErrorMessage(''); // Очищаем сообщение об ошибке при редактировании
    };

    // Функция для очистки формы
    const clearForm = () => {
        setGenreName('');
        setEditId(null);
        setErrorMessage(''); // Очищаем сообщение об ошибке при очистке формы
    };

    return (
        <div className="genre-container">
            <h1>Жанры</h1>

            {errorMessage && <div className="error-message">{errorMessage}</div>}

            <form onSubmit={editId ? handleEditGenre : handleAddGenre}>
                <input
                    type="text"
                    placeholder="Название жанра"
                    value={genreName}
                    onChange={(e) => setGenreName(e.target.value)}
                    required
                />
                <button type="submit">
                    {editId ? 'Обновить жанр' : 'Добавить жанр'}
                </button>
                {editId && <button type="button" onClick={clearForm}>Отмена</button>}
            </form>

            <table border="1">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Название жанра</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {genres.length > 0 ? (
                        genres.map((genre) => (
                            <tr key={genre.genre_id}>
                                <td>{genre.genre_id}</td>
                                <td>{genre.genre_name}</td>
                                <td>
                                    <div className="actions">
                                        <button onClick={() => handleEditClick(genre)}>Редактировать</button>
                                        <button onClick={() => handleDeleteGenre(genre.genre_id)}>Удалить</button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">Жанры отсутствуют</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default GenreList;
