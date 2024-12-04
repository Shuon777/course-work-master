import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RentalDebtorsList.css'; // Импортируем CSS файл

const RentalDebtorsList = () => {
    const [debtors, setDebtors] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: 'full_name', direction: 'ascending' });

    useEffect(() => {
        fetchDebtors();
    }, []);

    const fetchDebtors = async () => {
        try {
            const response = await axios.get('http://localhost:8000/rental_debtors');
            setDebtors(response.data);
        } catch (error) {
            console.error('Error fetching rental debtors:', error);
        }
    };

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('ru-RU', options);
    };

    const sortedDebtors = [...debtors].sort((a, b) => {
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
            <h1>Документ №4: Должники 10+ дней</h1>

            <table border="1">
                <thead>
                    <tr>
                        <th onClick={() => requestSort('full_name')}>Имя {sortConfig.key === 'full_name' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}</th>
                        <th>Номер телефона</th>
                        <th>Фильм</th>
                        <th>Дата выдачи </th>
                        <th>Дата возврата</th>
                        <th>Долг по аренде</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedDebtors.length > 0 ? (
                        sortedDebtors.map((debtor, index) => (
                            <tr key={index}>
                                <td>{debtor.full_name}</td>
                                <td>{debtor.client_phone_number}</td>
                                <td>{debtor.film_name}</td>
                                <td>{formatDate(debtor.journal_date_issue)}</td>
                                <td>{formatDate(debtor.journal_date_return)}</td>
                                <td>{debtor.rental_debt} д.</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">Нет доступных должников</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default RentalDebtorsList;
