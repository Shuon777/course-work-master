import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProducerList.css'; // Создайте стили по аналогии с GenreList.css

const ProducerList = () => {
    const [producers, setProducers] = useState([]);
    const [producerName, setProducerName] = useState('');
    const [editId, setEditId] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchProducers();
    }, []);

    const fetchProducers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/producers/');
            setProducers(response.data);
        } catch (error) {
            console.error('Ошибка при получении режиссеров:', error);
        }
    };

    const handleAddProducer = async (e) => {
        e.preventDefault();

        // Проверка на длину имени режиссера (строго больше 1 символа)
        if (producerName.length <= 1) {
            setErrorMessage('Имя режиссера должно содержать более 1 символа.');
            return;
        }

        // Проверка на существование режиссера с таким именем
        if (producers.some(producer => producer.producer_name === producerName)) {
            setErrorMessage('Режиссер с таким именем уже существует.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/producers/', {
                producer_name: producerName,
            });
            setProducers([...producers, response.data]);
            clearForm();
        } catch (error) {
            console.error('Ошибка при добавлении режиссера:', error);
        }
    };

    const handleEditProducer = async (e) => {
        e.preventDefault();

        // Проверка на длину имени режиссера (строго больше 1 символа)
        if (producerName.length <= 1) {
            setErrorMessage('Имя режиссера должно содержать более 1 символа.');
            return;
        }

        try {
            const response = await axios.put(`http://localhost:8000/producers/${editId}`, {
                producer_name: producerName,
            });
            setProducers(producers.map(producer =>
                producer.producer_id === editId
                    ? { ...producer, producer_name: producerName }
                    : producer
            ));
            clearForm();
        } catch (error) {
            console.error('Ошибка при обновлении режиссера:', error);
        }
    };

    const handleDeleteProducer = async (id) => {
        const confirmDelete = window.confirm('Вы уверены, что хотите удалить этого режиссера? Все связанные записи в других таблицах могут быть удалены.');
    
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:8000/producers/${id}`);
                setProducers(producers.filter(producer => producer.producer_id !== id));
            } catch (error) {
                if (error.response && error.response.data) {
                    setErrorMessage(error.response.data.detail); // Отображаем сообщение об ошибке
                } else {
                    console.error('Ошибка при удалении режиссера:', error);
                }
            }
        }
    };

    const handleEditClick = (producer) => {
        setProducerName(producer.producer_name);
        setEditId(producer.producer_id);
        setErrorMessage(''); // Очищаем сообщение об ошибке при редактировании
    };

    const clearForm = () => {
        setProducerName('');
        setEditId(null);
        setErrorMessage(''); // Очищаем сообщение об ошибке при очистке формы
    };

    return (
        <div className="producer-container">
            <h1>Режиссеры</h1>

            {errorMessage && <div className="error-message">{errorMessage}</div>}

            <form onSubmit={editId ? handleEditProducer : handleAddProducer}>
                <input
                    type="text"
                    placeholder="Имя режиссера"
                    value={producerName}
                    onChange={(e) => setProducerName(e.target.value)}
                    required
                />
                <button type="submit">
                    {editId ? 'Обновить режиссера' : 'Добавить режиссера'}
                </button>
                {editId && <button type="button" onClick={clearForm}>Отмена</button>}
            </form>

            <table border="1">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Имя режиссера</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {producers.length > 0 ? (
                        producers.map((producer) => (
                            <tr key={producer.producer_id}>
                                <td>{producer.producer_id}</td>
                                <td>{producer.producer_name}</td>
                                <td>
                                    <div className="actions">
                                        <button onClick={() => handleEditClick(producer)}>Редактировать</button>
                                        <button onClick={() => handleDeleteProducer(producer.producer_id)}>Удалить</button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">Режиссеры отсутствуют</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ProducerList;
