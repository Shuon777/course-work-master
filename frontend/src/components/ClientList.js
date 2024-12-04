import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ClientList.css'; // Импортируем CSS файл

const ClientList = () => {
    const [clients, setClients] = useState([]);
    const [clientFirstName, setClientFirstName] = useState('');
    const [clientLastName, setClientLastName] = useState('');
    const [clientAddress, setClientAddress] = useState('');
    const [clientPassport, setClientPassport] = useState('');
    const [clientPhoneNumber, setClientPhoneNumber] = useState('');
    const [editId, setEditId] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchClients();
    }, []);

    // Функция для получения списка клиентов
    const fetchClients = async () => {
        try {
            const response = await axios.get('http://localhost:8000/clients/');
            setClients(response.data);
        } catch (error) {
            console.error('Ошибка при получении клиентов:', error);
        }
    };

    // Функция для добавления нового клиента
    const handleAddClient = async (e) => {
        e.preventDefault(); // Предотвращаем перезагрузку страницы

        if (clientFirstName.length <= 1 || clientLastName.length <= 1) {
            setErrorMessage('Имя и фамилия клиента должны содержать более 1 символа.');
            return;
        }

        if (clients.some(client => client.client_passport === clientPassport)) {
            setErrorMessage('Клиент с таким паспортом уже существует.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/clients/', {
                client_first_name: clientFirstName,
                client_last_name: clientLastName,
                client_address: clientAddress,
                client_passport: clientPassport,
                client_phone_number: clientPhoneNumber,
            });
            setClients([...clients, response.data]);
            clearForm();
        } catch (error) {
            console.error('Ошибка при добавлении клиента:', error);
        }
    };

    // Функция для обновления существующего клиента
    const handleEditClient = async (e) => {
        e.preventDefault(); // Предотвращаем перезагрузку страницы

        if (clientFirstName.length <= 1 || clientLastName.length <= 1) {
            setErrorMessage('Имя и фамилия клиента должны содержать более 1 символа.');
            return;
        }

        try {
            const response = await axios.put(`http://localhost:8000/clients/${editId}`, {
                client_first_name: clientFirstName,
                client_last_name: clientLastName,
                client_address: clientAddress,
                client_passport: clientPassport,
                client_phone_number: clientPhoneNumber,
            });
            setClients(clients.map(client =>
                client.client_id === editId
                    ? { ...client, ...response.data }
                    : client
            ));
            clearForm();
        } catch (error) {
            console.error('Ошибка при обновлении клиента:', error);
        }
    };

    const handleDeleteClient = async (id) => {
        const confirmDelete = window.confirm('Вы уверены, что хотите удалить этого клиента? Связанные данные могут быть затронуты.');
        
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:8000/clients/${id}`);
                setClients(clients.filter(client => client.client_id !== id));
            } catch (error) {
                if (error.response && error.response.data) {
                    setErrorMessage(error.response.data.detail); 
                } else {
                    console.error('Ошибка при удалении клиента:', error);
                }
            }
        }
    };
    

    // Функция для заполнения формы редактирования
    const handleEditClick = (client) => {
        setClientFirstName(client.client_first_name);
        setClientLastName(client.client_last_name);
        setClientAddress(client.client_address);
        setClientPassport(client.client_passport);
        setClientPhoneNumber(client.client_phone_number);
        setEditId(client.client_id); // Устанавливаем ID для редактирования
        setErrorMessage(''); // Очищаем сообщение об ошибке при редактировании
    };

    // Функция для очистки формы
    const clearForm = () => {
        setClientFirstName('');
        setClientLastName('');
        setClientAddress('');
        setClientPassport('');
        setClientPhoneNumber('');
        setEditId(null);
        setErrorMessage(''); // Очищаем сообщение об ошибке при очистке формы
    };

    return (
        <div className="client-container">
            <h1>Клиенты</h1>

            {errorMessage && <div className="error-message">{errorMessage}</div>}

            <form onSubmit={editId ? handleEditClient : handleAddClient}>
                <input
                    type="text"
                    placeholder="Имя клиента"
                    value={clientFirstName}
                    onChange={(e) => setClientFirstName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Фамилия клиента"
                    value={clientLastName}
                    onChange={(e) => setClientLastName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Адрес клиента"
                    value={clientAddress}
                    onChange={(e) => setClientAddress(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Паспортные данные"
                    value={clientPassport}
                    onChange={(e) => setClientPassport(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Номер телефона"
                    value={clientPhoneNumber}
                    onChange={(e) => setClientPhoneNumber(e.target.value)}
                    required
                />
                <button type="submit">
                    {editId ? 'Обновить клиента' : 'Добавить клиента'}
                </button>
                {editId && <button type="button" onClick={clearForm}>Отмена</button>}
            </form>

            <table border="1">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Имя</th>
                        <th>Фамилия</th>
                        <th>Адрес</th>
                        <th>Паспорт</th>
                        <th>Телефон</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {clients.length > 0 ? (
                        clients.map((client) => (
                            <tr key={client.client_id}>
                                <td>{client.client_id}</td>
                                <td>{client.client_first_name}</td>
                                <td>{client.client_last_name}</td>
                                <td>{client.client_address}</td>
                                <td>{client.client_passport}</td>
                                <td>{client.client_phone_number}</td>
                                <td>
                                    <div className="actions">
                                        <button onClick={() => handleEditClick(client)}>Редактировать</button>
                                        <button onClick={() => handleDeleteClient(client.client_id)}>Удалить</button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7">Клиенты отсутствуют</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ClientList;
