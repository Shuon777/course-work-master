CREATE TABLE moderator(
	moderator_id SERIAL PRIMARY KEY,
	moderator_name VARCHAR(25) NOT NULL,
	moderator_email VARCHAR(50) NOT NULL UNIQUE,
	hashed_password VARCHAR(255),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE studio(
	studio_id SERIAL PRIMARY KEY,
	studio_name VARCHAR(50) NOT NULL,
	studio_country VARCHAR(50) NOT NULL
);
CREATE TABLE genre(
	genre_id SERIAL PRIMARY KEY,
	genre_name VARCHAR(30) NOT NULL
);
CREATE TABLE producer(
	producer_id SERIAL PRIMARY KEY,
	producer_name VARCHAR(50) NOT NULL
);
CREATE TABLE actor(
	actor_id SERIAL PRIMARY KEY,
	actor_name VARCHAR(50) NOT NULL
);
CREATE TABLE client(
	client_id SERIAL PRIMARY KEY,
	client_first_name VARCHAR(25) NOT NULL,
	client_last_name VARCHAR(25) NOT NULL,
	client_address VARCHAR(60) NOT NULL,
	client_passport VARCHAR(30) NOT NULL UNIQUE,
	client_phone_number VARCHAR(20) NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE film(
	film_id SERIAL PRIMARY KEY,
	studio_id INT NOT NULL,
	genre_id INT NOT NULL,
	producer_id INT NOT NULL,
	film_name VARCHAR(40),
	film_date_release DATE,
	film_rental DECIMAL(10, 2) NOT NULL CHECK (film_rental > 0),
	film_annotation TEXT NOT NULL,
	FOREIGN KEY (studio_id) REFERENCES studio (studio_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES genre (genre_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (producer_id) REFERENCES producer (producer_id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE filmography(
	filmography_id SERIAL PRIMARY KEY,
	film_id INT NOT NULL,
	actor_id INT NOT NULL,
	FOREIGN KEY (film_id) REFERENCES film (film_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (actor_id) REFERENCES actor (actor_id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE journal(
	journal_id SERIAL PRIMARY KEY,
	film_id INT NOT NULL,
	client_id INT NOT NULL,
	journal_date_issue DATE NOT NULL,
	journal_date_return DATE NOT NULL,
	journal_refund BOOL,
	FOREIGN KEY (film_id) REFERENCES film (film_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (client_id) REFERENCES client (client_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CHECK (journal_date_return >= journal_date_issue)
);