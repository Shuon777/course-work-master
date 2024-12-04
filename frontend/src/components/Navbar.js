import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom'; // Импортируем useNavigate
import './Navbar.css';

const Navbar = ({ user, onLogout }) => {
    const navigate = useNavigate(); // Используем useNavigate здесь

    const handleLogout = () => {
        onLogout();
        navigate("/login"); // Перенаправляем после выхода
    };

    return (
        <nav className="navbar">
            <ul className="navbar-links">
                {user ? (
                    <>
                        {user.is_cashier && (
                            <>
                                <li>
                                    <NavLink exact to="/films" className="nav-link">Фильмы</NavLink>
                                </li>
                                <li>
                                    <NavLink to="/journals" className="nav-link">Журналы</NavLink>
                                </li>
                                <li>
                                    <NavLink to="/document3" className="nav-link">Документ 3</NavLink>
                                </li>
                                <li>
                                    <NavLink to="/document4" className="nav-link">Документ 4</NavLink>
                                </li>
                            </>
                        )}
                        {user.is_admin && (
                            <>
                                <li>
                                    <NavLink exact to="/studios" className="nav-link">
                                        Студии
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/genres" className="nav-link">
                                        Жанры
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/actors" className="nav-link">
                                        Актёры
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/clients" className="nav-link">
                                        Клиенты
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/producers" className="nav-link">
                                        Режиссеры
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/journals" className="nav-link">
                                        Журналы
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/films" className="nav-link">
                                        Фильмы
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/filmographies" className="nav-link">
                                        Фильмографии
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/document1" className="nav-link">
                                        Документ 1
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/document2" className="nav-link">
                                        Документ 2
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/document3" className="nav-link">
                                        Документ 3
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/document4" className="nav-link">
                                        Документ 4
                                    </NavLink>
                                </li>
                            </>
                        )}
                    </>
                ) : (
                    <>
                        <li>
                            <NavLink to="/document1" className="nav-link">Документ 1</NavLink>
                        </li>
                        <li>
                            <NavLink to="/document2" className="nav-link">Документ 2</NavLink>
                        </li>
                    </>
                )}
            </ul>
            <div className="auth-buttons">
                {user ? (
                    <button onClick={handleLogout} className="nav-link auth-button">Выйти</button>
                ) : (
                <>
                    <li>
                        <NavLink to="/login" className="nav-link auth-button">Войти</NavLink>
                    </li>
                    <li>
                        <NavLink to="/register" className="nav-link auth-button">Зарегистрироваться</NavLink>
                    </li>
                   </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
