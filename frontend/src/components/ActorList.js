import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ActorList.css'; // Импортируем CSS файл

const ActorList = () => {
    const [actors, setActors] = useState([]);
    const [actorName, setActorName] = useState('');
    const [editId, setEditId] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchActors();
    }, []);

    // Функция для получения списка актёров
    const fetchActors = async () => {
        try {
            const response = await axios.get('http://localhost:8000/actors/');
            setActors(response.data);
        } catch (error) {
            console.error('Ошибка при получении актёров:', error);
        }
    };

    // Функция для добавления нового актёра
    const handleAddActor = async (e) => {
        e.preventDefault(); // Предотвращаем перезагрузку страницы

        if (actorName.length <= 1) {
            setErrorMessage('Имя актёра должно содержать более 1 символа.');
            return;
        }

        if (actors.some(actor => actor.actor_name === actorName)) {
            setErrorMessage('Актёр с таким именем уже существует.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/actors/', {
                actor_name: actorName,
            });
            setActors([...actors, response.data]);
            clearForm();
        } catch (error) {
            console.error('Ошибка при добавлении актёра:', error);
        }
    };

    // Функция для обновления существующего актёра
    const handleEditActor = async (e) => {
        e.preventDefault(); // Предотвращаем перезагрузку страницы

        if (actorName.length <= 1) {
            setErrorMessage('Имя актёра должно содержать более 1 символа.');
            return;
        }

        try {
            const response = await axios.put(`http://localhost:8000/actors/${editId}`, {
                actor_name: actorName,
            });
            setActors(actors.map(actor =>
                actor.actor_id === editId
                    ? { ...actor, actor_name: actorName }
                    : actor
            ));
            clearForm();
        } catch (error) {
            console.error('Ошибка при обновлении актёра:', error);
        }
    };

    const handleDeleteActor = async (id) => {
        const confirmDelete = window.confirm('Вы уверены, что хотите удалить этого актёра? Связанные данные могут быть затронуты.');
        
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:8000/actors/${id}`);
                setActors(actors.filter(actor => actor.actor_id !== id));
            } catch (error) {
                if (error.response && error.response.data) {
                    setErrorMessage(error.response.data.detail); // Отображаем сообщение об ошибке
                } else {
                    console.error('Ошибка при удалении актёра:', error);
                }
            }
        }
    };

    // Функция для заполнения формы редактирования
    const handleEditClick = (actor) => {
        setActorName(actor.actor_name);
        setEditId(actor.actor_id); // Устанавливаем ID для редактирования
        setErrorMessage(''); // Очищаем сообщение об ошибке при редактировании
    };

    // Функция для очистки формы
    const clearForm = () => {
        setActorName('');
        setEditId(null);
        setErrorMessage(''); // Очищаем сообщение об ошибке при очистке формы
    };

    return (
        <div className="actor-container">
            <h1>Актёры</h1>

            {errorMessage && <div className="error-message">{errorMessage}</div>}

            <form onSubmit={editId ? handleEditActor : handleAddActor}>
                <input
                    type="text"
                    placeholder="Имя актёра"
                    value={actorName}
                    onChange={(e) => setActorName(e.target.value)}
                    required
                />
                <button type="submit">
                    {editId ? 'Обновить актёра' : 'Добавить актёра'}
                </button>
                {editId && <button type="button" onClick={clearForm}>Отмена</button>}
            </form>

            <table border="1">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Имя актёра</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {actors.length > 0 ? (
                        actors.map((actor) => (
                            <tr key={actor.actor_id}>
                                <td>{actor.actor_id}</td>
                                <td>{actor.actor_name}</td>
                                <td>
                                    <div className="actions">
                                        <button onClick={() => handleEditClick(actor)}>Редактировать</button>
                                        <button onClick={() => handleDeleteActor(actor.actor_id)}>Удалить</button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">Актёры отсутствуют</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ActorList;
