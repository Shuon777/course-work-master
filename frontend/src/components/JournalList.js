import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './JournalList.css';

const JournalList = () => {
    const [journals, setJournals] = useState([]);
    const [films, setFilms] = useState([]);
    const [clients, setClients] = useState([]);
    const [journal, setJournal] = useState({
        film_id: '',
        client_id: '',
        journal_date_issue: '',
        journal_date_return: '',
        journal_refund: false
    });
    const [editId, setEditId] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchJournals();
        fetchFilms();
        fetchClients();
    }, []);

    // Функция для получения списка журналов
    const fetchJournals = async () => {
        try {
            const response = await axios.get('http://localhost:8000/journals_detailed/');
            setJournals(response.data);
        } catch (error) {
            console.error('Ошибка при получении журналов:', error);
        }
    };

    // Функция для получения списка фильмов
    const fetchFilms = async () => {
        try {
            const response = await axios.get('http://localhost:8000/films/');
            setFilms(response.data);
        } catch (error) {
            console.error('Ошибка при получении фильмов:', error);
        }
    };

    // Функция для получения списка клиентов
    const fetchClients = async () => {
        try {
            const response = await axios.get('http://localhost:8000/clients/');
            setClients(response.data);
        } catch (error) {
            console.error('Ошибка при получении клиентов:', error);
        }
    };

    const handleAddJournal = async (e) => {
        e.preventDefault();
        if (journal.journal_date_return < journal.journal_date_issue) {
            setErrorMessage('Дата возврата не может быть раньше даты выдачи.');
            return;
        }
        setErrorMessage(''); // Сброс сообщения об ошибке
        try {
            const response = await axios.post('http://localhost:8000/journals/', journal);
            const newJournal = response.data;

            // Найдите название фильма по film_id
            const selectedFilm = films.find(film => film.film_id === parseInt(newJournal.film_id));
            const filmName = selectedFilm ? selectedFilm.film_name : '';

            // Найдите полное имя клиента по client_id
            const selectedClient = clients.find(client => client.client_id === parseInt(newJournal.client_id));
            const clientFullName = selectedClient ? `${selectedClient.client_first_name} ${selectedClient.client_last_name}` : '';

            // Добавьте новые поля к объекту журнала
            const detailedJournal = {
                ...newJournal,
                film_name: filmName,
                client_full_name: clientFullName
            };

            setJournals([...journals, detailedJournal]);
            clearForm();
        } catch (error) {
            console.error('Ошибка при добавлении журнала:', error);
            if (error.response && error.response.data.detail) {
                alert(error.response.data.detail);
            } else {
                alert('Произошла ошибка при добавлении журнала.');
            }
        }
    };

    // Функция для обновления существующего журнала
    const handleEditJournal = async (e) => {
        e.preventDefault();
        if (journal.journal_date_return < journal.journal_date_issue) {
            setErrorMessage('Дата возврата не может быть раньше даты выдачи.');
            return;
        }
        setErrorMessage(''); // Сброс сообщения об ошибке
        try {
            const response = await axios.put(`http://localhost:8000/journals/${editId}`, journal);
            setJournals(journals.map(item =>
                item.journal_id === editId
                    ? { ...item, ...response.data }
                    : item
            ));
            clearForm();
        } catch (error) {
            console.error('Ошибка при обновлении журнала:', error);
            if (error.response && error.response.data.detail) {
                alert(error.response.data.detail);
            } else {
                alert('Произошла ошибка при обновлении журнала.');
            }
        }
    };

    // Функция для удаления журнала
    const handleDeleteJournal = async (id) => {
        if (!window.confirm('Вы уверены, что хотите удалить этот журнал?')) {
            return;
        }
        try {
            await axios.delete(`http://localhost:8000/journals/${id}`);
            setJournals(journals.filter(item => item.journal_id !== id));
        } catch (error) {
            console.error('Ошибка при удалении журнала:', error);
            alert('Произошла ошибка при удалении журнала.');
        }
    };

    // Функция для заполнения формы редактирования
    const handleEditClick = (journal) => {
        setJournal({
            film_id: journal.film_id,
            client_id: journal.client_id,
            journal_date_issue: journal.journal_date_issue,
            journal_date_return: journal.journal_date_return,
            journal_refund: journal.journal_refund
        });
        setEditId(journal.journal_id);
        setErrorMessage(''); // Очищаем сообщение об ошибке при редактировании
    };

    // Функция для очистки формы
    const clearForm = () => {
        setJournal({
            film_id: '',
            client_id: '',
            journal_date_issue: '',
            journal_date_return: '',
            journal_refund: false
        });
        setEditId(null);
        setErrorMessage(''); // Очищаем сообщение об ошибке при очистке формы
    };

    return (
        <div className="journal-container">
            <h1>Журналы</h1>

            {errorMessage && <div className="error-message">{errorMessage}</div>}

            <form onSubmit={editId ? handleEditJournal : handleAddJournal}>
                {/* Выпадающий список для фильмов */}
                <select
                    value={journal.film_id}
                    onChange={(e) => setJournal({ ...journal, film_id: e.target.value })}
                    required
                >
                    <option value="">Выберите фильм</option>
                    {films.map((film) => (
                        <option key={film.film_id} value={film.film_id}>
                            {film.film_name}
                        </option>
                    ))}
                </select>

                {/* Выпадающий список для клиентов */}
                <select
                    value={journal.client_id}
                    onChange={(e) => setJournal({ ...journal, client_id: e.target.value })}
                    required
                >
                    <option value="">Выберите клиента</option>
                    {clients.map((client) => (
                        <option key={client.client_id} value={client.client_id}>
                            {client.client_first_name} {client.client_last_name}
                        </option>
                    ))}
                </select>

                {/* Остальные поля формы */}
                <input
                    type="date"
                    placeholder="Дата выдачи"
                    value={journal.journal_date_issue}
                    onChange={(e) => setJournal({ ...journal, journal_date_issue: e.target.value })}
                    required
                />
                <input
                    type="date"
                    placeholder="Дата возврата"
                    value={journal.journal_date_return}
                    onChange={(e) => {
                        const returnDate = e.target.value;
                        if (returnDate < journal.journal_date_issue) {
                            setErrorMessage('Дата возврата не может быть раньше даты выдачи.');
                        } else {
                            setErrorMessage(''); // Сброс сообщения об ошибке
                            setJournal({ ...journal, journal_date_return: returnDate });
                        }
                    }}
                    required
                />
                <label>
                    Возврат:
                    <input
                        type="checkbox"
                        checked={journal.journal_refund}
                        onChange={(e) => setJournal({ ...journal, journal_refund: e.target.checked })}
                    />
                </label>
                <button type="submit">
                    {editId ? 'Обновить журнал' : 'Добавить журнал'}
                </button>
                {editId && <button type="button" onClick={clearForm}>Отмена</button>}
            </form>

            <table border="1">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Фильм</th>
                        <th>Клиент</th>
                        <th>Дата выдачи</th>
                        <th>Дата возврата</th>
                        <th>Возврат</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {journals.length > 0 ? (
                        journals.map((journal) => (
                            <tr key={journal.journal_id}>
                                <td>{journal.journal_id}</td>
                                <td>{journal.film_name}</td>
                                <td>{journal.client_full_name}</td>
                                <td>{journal.journal_date_issue}</td>
                                <td>{journal.journal_date_return}</td>
                                <td>{journal.journal_refund ? 'Да' : 'Нет'}</td>
                                <td>
                                    <div className="actions">
                                        <button onClick={() => handleEditClick(journal)}>Редактировать</button>
                                        <button onClick={() => handleDeleteJournal(journal.journal_id)}>Удалить</button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7">Журналы отсутствуют</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default JournalList;
