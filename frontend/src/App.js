import React, { Suspense, lazy, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import './App.css';

const StudioList = lazy(() => import('./components/StudioList'));
const GenreList = lazy(() => import('./components/GenreList'));
const ActorList = lazy(() => import('./components/ActorList'));
const ClientList = lazy(() => import('./components/ClientList'));
const ProducerList = lazy(() => import('./components/ProducerList'));
const JournalList = lazy(() => import('./components/JournalList'));
const FilmList = lazy(() => import('./components/FilmList'));
const FilmographyList = lazy(() => import('./components/FilmographyList'));
const RentalList = lazy(() => import('./components/RentalList'));
const RentalDebtorsList = lazy(() => import('./components/RentalDebtorsList'));
const FilmsGroupedByGenreList = lazy(() => import('./components/FilmsGroupedByGenreList'));
const FilmsByProducerList = lazy(() => import('./components/FilmsByProducerList'));

const NotFound = () => (
    <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>404 - Страница не найдена</h2>
        <p>Извините, страница, которую вы ищете, не существует.</p>
    </div>
);

function App() {
    const [user, setUser] = useState(null);

    const handleLogin = (userData) => {
        setUser(userData);
    };

    const handleLogout = () => {
        setUser(null);
    };

    return (
        <Router>
            <div className="App">
                <Navbar user={user} onLogout={handleLogout} />
                <div className="content">
                    <Suspense fallback={<div>Загрузка...</div>}>
                        <Routes>
                            <Route exact path="/" element={<StudioList />} />
                            <Route path="/genres" element={<GenreList />} />
                            <Route path="/actors" element={<ActorList />} />
                            <Route path="/clients" element={<ClientList />} />
                            <Route path="/producers" element={<ProducerList />} />
                            <Route path="/journals" element={<JournalList />} />
                            <Route path="/films" element={<FilmList />} />
                            <Route path="/filmographies" element={<FilmographyList />} />
                            <Route path="/document1" element={<FilmsGroupedByGenreList />} />
                            <Route path="/document2" element={<FilmsByProducerList />} />
                            <Route path="/document3" element={<RentalList />} />
                            <Route path="/document4" element={<RentalDebtorsList />} />
                            <Route path="/login" element={<Login onLogin={handleLogin} />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </Suspense>
                </div>
            </div>
        </Router>
    );
}

export default App;
