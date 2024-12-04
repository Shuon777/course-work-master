INSERT INTO studio (studio_name, studio_country) VALUES
('Warner Bros.', 'США'),
('Universal Pictures', 'США'),
('20th Century Fox', 'США'),
('Columbia Pictures', 'США');

INSERT INTO genre (genre_name) VALUES
('Драма'),
('Комедия'),
('Ужасы'),
('Фантастика'),
('Приключения');

INSERT INTO producer (producer_name) VALUES
('Стивен Спилберг'),
('Кристофер Нолан'),
('Джеймс Кэмерон'),
('Квентин Тарантино'),
('Джордж Лукас');

INSERT INTO actor (actor_name) VALUES
('Леонардо ДиКаприо'),
('Мерил Стрип'),
('Джонни Депп'),
('Скарлетт Йоханссон'),
('Том Хэнкс');

INSERT INTO client (client_first_name, client_last_name, client_address, client_passport, client_phone_number) VALUES
('Александр', 'Сидоров', 'Иркутск, ул. Ленина, д. 1', '1234567890', '+7 900 123-45-67'),
('Ольга', 'Иванова', 'Иркутск, ул. Пушкина, д. 2', '0987654321', '+7 900 234-56-78'),
('Николай', 'Петров', 'Иркутск, ул. Чехова, д. 3', '1122334455', '+7 900 345-67-89');

INSERT INTO film (studio_id, genre_id, producer_id, film_name, film_date_release, film_rental, film_annotation) VALUES
(1, 1, 1, 'Поймай меня, если сможешь', '2002-12-25', 150.00, 'Драма о мошеннике и агенте ФБР.'),
(2, 2, 2, 'Великолепная семерка', '2016-09-23', 100.00, 'Приключенческий фильм о семи героях.'),
(3, 3, 3, 'Титаник', '1997-12-19', 200.00, 'Романтическая драма о любви на фоне катастрофы.'),
(4, 4, 4, 'Убить Билла', '2003-10-10', 250.00, 'Комедия-экшн о мести.'),
(1, 5, 5, 'Звёздные войны: Эпизод V - Новая надежда', '1977-05-25', 120.00, 'Фантастика о борьбе между Империей и Повстанцами.');

INSERT INTO filmography (film_id, actor_id) VALUES
(1, 1),
(1, 2),
(2, 3),
(2, 4),
(3, 1),
(3, 5),
(4, 2),
(5, 3);

INSERT INTO journal (film_id, client_id, journal_date_issue, journal_date_return, journal_refund) VALUES
(1, 1, '2002-12-26', '2003-01-02', FALSE),
(2, 2, '2016-09-24', '2016-09-30', TRUE),
(3, 3, '1997-12-20', '1997-12-27', FALSE),
(4, 1, '2003-10-11', '2003-10-15', FALSE),
(5, 2, '1977-06-01', '1977-06-05', TRUE);