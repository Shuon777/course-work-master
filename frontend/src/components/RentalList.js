import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RentalList.css'; // Импортируем CSS файл

const RentalList = () => {
    const [rentals, setRentals] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: 'full_name', direction: 'ascending' });

    useEffect(() => {
        fetchRentals();
    }, []);

    const fetchRentals = async () => {
        try {
            const response = await axios.get('http://localhost:8000/rentals');
            setRentals(response.data);
        } catch (error) {
            console.error('Error fetching rentals:', error);
        }
    };

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('ru-RU', options);
    };

    const sortedRentals = [...rentals].sort((a, b) => {
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
            <h1>Документ №3: Арендованные фильмы</h1>

            <table border="1">
                <thead>
                    <tr>
                        <th onClick={() => requestSort('full_name')}>Имя {sortConfig.key === 'full_name' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : '↕'}</th>
                        <th>Номер телефона</th>
                        <th>Фильм</th>
                        <th>Дата выдачи</th>
                        <th>Дата возврата</th>
                        <th onClick={() => requestSort('rental_duration')}>Длительность аренды {sortConfig.key === 'rental_duration' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : '↕'}</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedRentals.length > 0 ? (
                        sortedRentals.map((rental, index) => (
                            <tr key={index}>
                                <td>{rental.full_name}</td>
                                <td>{rental.client_phone_number}</td>
                                <td>{rental.film_name}</td>
                                <td>{formatDate(rental.journal_date_issue)}</td>
                                <td>{formatDate(rental.journal_date_return)}</td>
                                <td>{rental.rental_duration} д.</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">Нет доступных аренда</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default RentalList;
