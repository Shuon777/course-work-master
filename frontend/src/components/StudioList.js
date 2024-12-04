import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StudioList.css'; // Импортируем CSS файл

const StudioList = () => {
    const [studios, setStudios] = useState([]);
    const [studioName, setStudioName] = useState('');
    const [studioCountry, setStudioCountry] = useState('');
    const [editId, setEditId] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchStudios();
    }, []);

    const fetchStudios = async () => {
        try {
            const response = await axios.get('http://localhost:8000/studios/');
            setStudios(response.data);
        } catch (error) {
            console.error('Error fetching studios:', error);
        }
    };

    const handleAddStudio = async () => {
        if (studioName.length <= 1 || studioCountry.length <= 1) {
            setErrorMessage('Не заполнены поля');
            return;
        }

        if (studios.some(studio => studio.studio_name === studioName)) {
            setErrorMessage('Студия с таким названием уже существует.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/studios/', {
                studio_name: studioName,
                studio_country: studioCountry,
            });
            setStudios([...studios, response.data]);
            clearForm();
        } catch (error) {
            console.error('Error adding studio:', error);
        }
    };

    const handleEditStudio = async () => {
        if (studioName.length <= 1 || studioCountry.length <= 1) {
            setErrorMessage('Не заполнены поля');
            return;
        }

        try {
            await axios.put(`http://localhost:8000/studios/${editId}`, {
                studio_name: studioName,
                studio_country: studioCountry,
            });
            setStudios(studios.map(studio =>
                studio.studio_id === editId
                    ? { ...studio, studio_name: studioName, studio_country: studioCountry }
                    : studio
            ));
            clearForm();
        } catch (error) {
            console.error('Error updating studio:', error);
        }
    };

    const handleDeleteStudio = async (id) => {
        const confirmDelete = window.confirm('Вы уверены, что хотите удалить эту студию? Все связанные записи в других таблицах могут быть удалены.');
        
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:8000/studios/${id}`);
                setStudios(studios.filter(studio => studio.studio_id !== id));
            } catch (error) {
                if (error.response && error.response.data) {
                    setErrorMessage(error.response.data.detail); // Отображаем сообщение об ошибке
                } else {
                    console.error('Error deleting studio:', error);
                }
            }
        }
    };
    

    const handleEditClick = (studio) => {
        setStudioName(studio.studio_name);
        setStudioCountry(studio.studio_country);
        setEditId(studio.studio_id); // Set ID for editing
        setErrorMessage(''); // Clear error message on edit
    };

    const clearForm = () => {
        setStudioName('');
        setStudioCountry('');
        setEditId(null);
        setErrorMessage(''); // Clear error message on form clear
    };

    return (
        <div>
            <h1>Студии</h1>

            {errorMessage && <div className="error-message">{errorMessage}</div>}

            <form onSubmit={(e) => { e.preventDefault(); editId ? handleEditStudio() : handleAddStudio(); }}>
                <input
                    type="text"
                    placeholder="Название студии"
                    value={studioName}
                    onChange={(e) => setStudioName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Страна"
                    value={studioCountry}
                    onChange={(e) => setStudioCountry(e.target.value)}
                />
                {editId ? (
                    <button type="submit">Обновить студию</button>
                ) : (
                    <button type="submit">Добавить студию</button>
                )}
                {editId && <button type="button" onClick={clearForm}>Отмена</button>}
            </form>

            <table border="1">
                <thead>
                    <tr>
                        <th>Название</th>
                        <th>Страна</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {studios.length > 0 ? (
                        studios.map((studio, index) => (
                            <tr key={index}>
                                <td>{studio.studio_name}</td>
                                <td>{studio.studio_country}</td>
                                <td>
                                    <div className="actions">
                                        <button onClick={() => handleEditClick(studio)}>Редактировать</button>
                                        <button onClick={() => handleDeleteStudio(studio.studio_id)}>Удалить</button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">No studios available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default StudioList;