from datetime import datetime, timedelta
from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import func, select, text
from sqlalchemy.orm import Session
from typing import List
from fastapi.middleware.cors import CORSMiddleware

from database import SessionLocal, engine
from models.models import Base, Moderator, Studio, Genre, Producer, Actor, Client, Film, Filmography, Journal
from schemas import (
    FilmGenreResponse,
    FilmResponse,
    FilmographyDetailed,
    ModeratorCreate,
    ModeratorRead,
    RentalDebt,
    RentalInfo,
    StudioRead as StudioSchema,
    StudioCreate as StudioCreateSchema,
    GenreRead as GenreSchema,
    GenreCreate as GenreCreateSchema,
    ProducerRead as ProducerSchema,
    ProducerCreate as ProducerCreateSchema,
    ActorRead as ActorSchema,
    ActorCreate as ActorCreateSchema,
    ClientRead as ClientSchema,
    ClientCreate as ClientCreateSchema,
    FilmBasicRead as FilmBasicSchema,
    FilmDetailedRead as FilmDetailedSchema,
    FilmCreate as FilmCreateSchema,
    FilmographyRead as FilmographySchema,
    FilmographyCreate as FilmographyCreateSchema,
    JournalRead as JournalSchema,
    JournalCreate as JournalCreateSchema,
)
from schemas import JournalDetailed

# Create the tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # список разрешенных источников
    allow_credentials=True,
    allow_methods=["*"],  # разрешает все методы (GET, POST, PUT, DELETE и т.д.)
    allow_headers=["*"],  # разрешает все заголовки
)

# Dependency to get the DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Studio CRUD operations
@app.post("/studios/", response_model=StudioSchema)
def create_studio(studio: StudioCreateSchema, db: Session = Depends(get_db)):
    db_studio = Studio(**studio.dict())
    db.add(db_studio)
    db.commit()
    db.refresh(db_studio)
    return db_studio

@app.get("/studios/", response_model=List[StudioSchema])
def read_studios(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return db.query(Studio).offset(skip).limit(limit).all()

@app.put("/studios/{studio_id}", response_model=StudioSchema)
def update_studio(studio_id: int, studio: StudioCreateSchema, db: Session = Depends(get_db)):
    db_studio = db.query(Studio).filter(Studio.studio_id == studio_id).first()
    if db_studio is None:
        raise HTTPException(status_code=404, detail="Studio not found")
    
    for key, value in studio.dict().items():
        setattr(db_studio, key, value)

    db.commit()
    db.refresh(db_studio)
    return db_studio

@app.delete("/studios/{studio_id}")
def delete_studio(studio_id: int, db: Session = Depends(get_db)):
    db_studio = db.query(Studio).filter(Studio.studio_id == studio_id).first()
    if db_studio is None:
        raise HTTPException(status_code=404, detail="Studio not found")
    
    related_films = db.query(Film).filter(Film.studio_id == studio_id).first()
    if related_films:
        raise HTTPException(status_code=400, detail="Невозможно удалить строку, пока есть зависимые данные в других таблицах")

    db.delete(db_studio)
    db.commit()
    return {"detail": "Studio deleted successfully"}

# Genre CRUD operations
@app.post("/genres/", response_model=GenreSchema)
def create_genre(genre: GenreCreateSchema, db: Session = Depends(get_db)):
    db_genre = Genre(**genre.dict())
    db.add(db_genre)
    db.commit()
    db.refresh(db_genre)
    return db_genre

@app.get("/genres/", response_model=List[GenreSchema])
def read_genres(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return db.query(Genre).offset(skip).limit(limit).all()

@app.put("/genres/{genre_id}", response_model=GenreSchema)
def update_genre(genre_id: int, genre: GenreCreateSchema, db: Session = Depends(get_db)):
    db_genre = db.query(Genre).filter(Genre.genre_id == genre_id).first()
    if db_genre is None:
        raise HTTPException(status_code=404, detail="Genre not found")
    
    for key, value in genre.dict().items():
        setattr(db_genre, key, value)

    db.commit()
    db.refresh(db_genre)
    return db_genre

@app.delete("/genres/{genre_id}")
def delete_genre(genre_id: int, db: Session = Depends(get_db)):
    db_genre = db.query(Genre).filter(Genre.genre_id == genre_id).first()
    if db_genre is None:
        raise HTTPException(status_code=404, detail="Genre not found")
    
    related_films = db.query(Film).filter(Film.genre_id == genre_id).first()
    if related_films:
        raise HTTPException(status_code=400, detail="Невозможно удалить жанр, пока есть зависимые данные в других таблицах")

    db.delete(db_genre)
    db.commit()
    return {"detail": "Genre deleted successfully"}

# Producer CRUD operations
@app.post("/producers/", response_model=ProducerSchema)
def create_producer(producer: ProducerCreateSchema, db: Session = Depends(get_db)):
    db_producer = Producer(**producer.dict())
    db.add(db_producer)
    db.commit()
    db.refresh(db_producer)
    return db_producer

@app.get("/producers/", response_model=List[ProducerSchema])
def read_producers(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return db.query(Producer).offset(skip).limit(limit).all()

@app.put("/producers/{producer_id}", response_model=ProducerSchema)
def update_producer(producer_id: int, producer: ProducerCreateSchema, db: Session = Depends(get_db)):
    db_producer = db.query(Producer).filter(Producer.producer_id == producer_id).first()
    if db_producer is None:
        raise HTTPException(status_code=404, detail="Producer not found")
    
    for key, value in producer.dict().items():
        setattr(db_producer, key, value)

    db.commit()
    db.refresh(db_producer)
    return db_producer

@app.delete("/producers/{producer_id}")
def delete_producer(producer_id: int, db: Session = Depends(get_db)):
    db_producer = db.query(Producer).filter(Producer.producer_id == producer_id).first()
    if db_producer is None:
        raise HTTPException(status_code=404, detail="Producer not found")
    
    related_films = db.query(Film).filter(Film.producer_id == producer_id).first()
    if related_films:
        raise HTTPException(status_code=400, detail="Невозможно удалить режиссера, пока есть зависимые данные в других таблицах")

    db.delete(db_producer)
    db.commit()
    return {"detail": "Producer deleted successfully"}


# Actor CRUD operations
@app.post("/actors/", response_model=ActorSchema)
def create_actor(actor: ActorCreateSchema, db: Session = Depends(get_db)):
    db_actor = Actor(**actor.dict())
    db.add(db_actor)
    db.commit()
    db.refresh(db_actor)
    return db_actor

@app.get("/actors/", response_model=List[ActorSchema])
def read_actors(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return db.query(Actor).offset(skip).limit(limit).all()

@app.put("/actors/{actor_id}", response_model=ActorSchema)
def update_actor(actor_id: int, actor: ActorCreateSchema, db: Session = Depends(get_db)):
    db_actor = db.query(Actor).filter(Actor.actor_id == actor_id).first()
    if db_actor is None:
        raise HTTPException(status_code=404, detail="Actor not found")
    
    for key, value in actor.dict().items():
        setattr(db_actor, key, value)

    db.commit()
    db.refresh(db_actor)
    return db_actor

@app.delete("/actors/{actor_id}")
def delete_actor(actor_id: int, db: Session = Depends(get_db)):
    db_actor = db.query(Actor).filter(Actor.actor_id == actor_id).first()
    if db_actor is None:
        raise HTTPException(status_code=404, detail="Actor not found")
    
    related_films = db.query(Film).join(Filmography).filter(Filmography.actor_id == actor_id).first()
    if related_films:
        raise HTTPException(status_code=400, detail="Невозможно удалить актёра, пока есть зависимые данные в других таблицах")

    db.delete(db_actor)
    db.commit()
    return {"detail": "Actor deleted successfully"}

# Client CRUD operations
@app.post("/clients/", response_model=ClientSchema)
def create_client(client: ClientCreateSchema, db: Session = Depends(get_db)):
    db_client = Client(**client.dict())
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client

@app.get("/clients/", response_model=List[ClientSchema])
def read_clients(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return db.query(Client).offset(skip).limit(limit).all()


@app.put("/clients/{client_id}", response_model=ClientSchema)
def update_client(client_id: int, client: ClientCreateSchema, db: Session = Depends(get_db)):
    db_client = db.query(Client).filter(Client.client_id == client_id).first()
    if db_client is None:
        raise HTTPException(status_code=404, detail="Client not found")
    
    for key, value in client.dict().items():
        setattr(db_client, key, value)

    db.commit()
    db.refresh(db_client)
    return db_client

@app.delete("/clients/{client_id}")
def delete_client(client_id: int, db: Session = Depends(get_db)):
    db_client = db.query(Client).filter(Client.client_id == client_id).first()
    if db_client is None:
        raise HTTPException(status_code=404, detail="Client not found")
    
    related_orders = db.query(Journal).filter(Journal.client_id == client_id).first()
    if related_orders:
        raise HTTPException(status_code=400, detail="Невозможно удалить клиента, пока есть зависимые данные в других таблицах")

    db.delete(db_client)
    db.commit()
    return {"detail": "Client deleted successfully"}


# Film CRUD operations
@app.post("/films/", response_model=FilmBasicSchema)
def create_film(film: FilmCreateSchema, db: Session = Depends(get_db)):
    db_film = Film(**film.dict())
    db.add(db_film)
    db.commit()
    db.refresh(db_film)
    return db_film

@app.get("/films/", response_model=List[FilmBasicSchema])
def read_films(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return db.query(Film).offset(skip).limit(limit).all()


@app.put("/films/{film_id}", response_model=FilmBasicSchema)
def update_film(film_id: int, film: FilmCreateSchema, db: Session = Depends(get_db)):
    db_film = db.query(Film).filter(Film.film_id == film_id).first()
    if db_film is None:
        raise HTTPException(status_code=404, detail="Film not found")
    
    for key, value in film.dict().items():
        setattr(db_film, key, value)

    db.commit()
    db.refresh(db_film)
    return db_film

@app.delete("/films/{film_id}")
def delete_film(film_id: int, db: Session = Depends(get_db)):
    db_film = db.query(Film).filter(Film.film_id == film_id).first()
    if db_film is None:
        raise HTTPException(status_code=404, detail="Film not found")
    
    related_rentals = db.query(Journal).filter(Journal.film_id == film_id).first()
    if related_rentals:
        raise HTTPException(status_code=400, detail="Невозможно удалить фильм, пока есть зависимые данные")

    db.delete(db_film)
    db.commit()
    return {"detail": "Film deleted successfully"}

# Journal CRUD operations
@app.post("/journals/", response_model=JournalSchema)
def create_journal(journal: JournalCreateSchema, db: Session = Depends(get_db)):
    db_journal = Journal(**journal.dict())
    db.add(db_journal)
    db.commit()
    db.refresh(db_journal)
    return db_journal

@app.get("/journals/", response_model=List[JournalSchema])
def read_journals(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return db.query(Journal).offset(skip).limit(limit).all()

@app.put("/journals/{journal_id}", response_model=JournalSchema)
def update_journal(journal_id: int, journal: JournalCreateSchema, db: Session = Depends(get_db)):
    db_journal = db.query(Journal).filter(Journal.journal_id == journal_id).first()
    if db_journal is None:
        raise HTTPException(status_code=404, detail="Journal not found")
    
    for key, value in journal.dict().items():
        setattr(db_journal, key, value)

    db.commit()
    db.refresh(db_journal)
    return db_journal

@app.delete("/journals/{journal_id}")
def delete_journal(journal_id: int, db: Session = Depends(get_db)):
    db_journal = db.query(Journal).filter(Journal.journal_id == journal_id).first()
    if db_journal is None:
        raise HTTPException(status_code=404, detail="Journal not found")
    
    db.delete(db_journal)
    db.commit()
    return {"detail": "Journal deleted successfully"}


@app.get("/journals_detailed/", response_model=List[JournalDetailed])
def read_journals_detailed(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    journals = (
        db.query(
            Journal.journal_id,
            Film.film_name,
            func.concat(Client.client_first_name, ' ', Client.client_last_name).label('client_full_name'),
            Journal.journal_date_issue,
            Journal.journal_date_return,
            Journal.journal_refund
        )
        .join(Film, Journal.film_id == Film.film_id)
        .join(Client, Journal.client_id == Client.client_id)
        .order_by(Journal.journal_id)
        .offset(skip)
        .limit(limit)
        .all()
    )
    return journals

@app.get("/films_detailed/", response_model=List[FilmDetailedSchema])
def read_films_detailed(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    films = (
        db.query(
            Film.film_id,
            Studio.studio_name,
            Genre.genre_name,
            Producer.producer_name,
            Film.film_name,
            Film.film_date_release,
            Film.film_rental,
            Film.film_annotation
        )
        .join(Studio, Film.studio_id == Studio.studio_id)
        .join(Genre, Film.genre_id == Genre.genre_id)
        .join(Producer, Film.producer_id == Producer.producer_id)
        .order_by(Film.film_id)
        .offset(skip)
        .limit(limit)
        .all()
    )
    return films

@app.post("/filmographies/", response_model=FilmographySchema)
def create_filmography(filmography: FilmographyCreateSchema, db: Session = Depends(get_db)):
    db_filmography = Filmography(**filmography.dict())
    db.add(db_filmography)
    db.commit()
    db.refresh(db_filmography)
    return db_filmography

@app.get("/filmographies/", response_model=List[FilmographySchema])
def read_filmographies(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return db.query(Filmography).offset(skip).limit(limit).all()


@app.put("/filmographies/{filmography_id}", response_model=FilmographySchema)
def update_filmography(filmography_id: int, filmography: FilmographyCreateSchema, db: Session = Depends(get_db)):
    db_filmography = db.query(Filmography).filter(Filmography.filmography_id == filmography_id).first()
    if db_filmography is None:
        raise HTTPException(status_code=404, detail="Filmography not found")

    for key, value in filmography.dict().items():
        setattr(db_filmography, key, value)

    db.commit()
    db.refresh(db_filmography)
    return db_filmography

@app.delete("/filmographies/{filmography_id}")
def delete_filmography(filmography_id: int, db: Session = Depends(get_db)):
    db_filmography = db.query(Filmography).filter(Filmography.filmography_id == filmography_id).first()
    if db_filmography is None:
        raise HTTPException(status_code=404, detail="Filmography not found")

    db.delete(db_filmography)
    db.commit()
    return {"detail": "Filmography deleted successfully"}

@app.get("/filmography_detailed/", response_model=List[FilmographyDetailed])
def read_filmography_detailed(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    filmographies = (
        db.query(
            Filmography.filmography_id,
            Film.film_name,
            Actor.actor_name
        )
        .join(Film, Filmography.film_id == Film.film_id)
        .join(Actor, Filmography.actor_id == Actor.actor_id)
        .order_by(Filmography.filmography_id)
        .offset(skip)
        .limit(limit)
        .all()
    )
    return filmographies


@app.get("/rentals", response_model=List[RentalInfo])
def get_rentals(db: Session = Depends(get_db)):
    query = (
        select(
            func.concat(Client.client_last_name, ' ', Client.client_first_name).label("full_name"),
            Client.client_phone_number,
            Film.film_name,
            Journal.journal_date_issue,
            Journal.journal_date_return,
            (Journal.journal_date_return - Journal.journal_date_issue).label("rental_duration")
        )
        .join(Client, Journal.client_id == Client.client_id)
        .join(Film, Journal.film_id == Film.film_id)
        .where(Journal.journal_refund.is_(False))
    )
    
    results = db.execute(query).fetchall()
    return [RentalInfo(**row._mapping) for row in results]


@app.get("/rental_debtors", response_model=List[RentalDebt])
def get_rentals(db: Session = Depends(get_db)):
    query = (
        select(
            func.concat(Client.client_last_name, ' ', Client.client_first_name).label("full_name"),
            Client.client_phone_number,
            Film.film_name,
            Journal.journal_date_issue,
            Journal.journal_date_return,
            (Journal.journal_date_return - Journal.journal_date_issue).label("rental_debt")
        )
        .join(Client, Journal.client_id == Client.client_id)
        .join(Film, Journal.film_id == Film.film_id)
        .where(
            Journal.journal_refund.is_(False),
            (Journal.journal_date_return - Journal.journal_date_issue) > 10 
        )
    )
    
    results = db.execute(query).fetchall()
    return [RentalDebt(**row._mapping) for row in results]

@app.get("/films/by_producer/{producer_name}", response_model=List[FilmResponse])
def get_films_by_producer(producer_name: str, db: Session = Depends(get_db)):
    films = db.query(Film).join(Producer).join(Studio).filter(Producer.producer_name == producer_name).all()
    
    if not films:
        raise HTTPException(status_code=404, detail="Films not found for this producer")

    return [
    FilmResponse(
        producer_name=film.producer.producer_name,
        film_name=film.film_name,
        studio_name=film.studio.studio_name,
        film_date_release=film.film_date_release,  # Передаём объект date напрямую
        film_rental=film.film_rental
    )
    for film in films
]

@app.get("/films/grouped_by_genre", response_model=List[FilmGenreResponse])
def get_films_grouped_by_genre(db: Session = Depends(get_db)):
    query = (
        select(
            Genre.genre_name,
            Film.film_name,
            Producer.producer_name,
            Studio.studio_name,
            Film.film_date_release,
            Film.film_rental
        )
        .join(Film.genre)
        .join(Film.producer)
        .join(Film.studio)
        .order_by(Genre.genre_name)  # Сортировка по названию жанра
    )
    
    results = db.execute(query).all()
    
    # Преобразуем результаты в список словарей
    films_grouped_by_genre = [
        FilmGenreResponse(
            genre_name=result[0],
            film_name=result[1],
            producer_name=result[2],
            studio_name=result[3],
            film_date_release=result[4],
            film_rental=result[5]
        )
        for result in results
    ]
    
    return films_grouped_by_genre

from passlib.context import CryptContext
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class Login(BaseModel):
    email: str
    password: str



@app.post("/login")
def login(login: Login):
    db: Session = SessionLocal()
    moderator = db.query(Moderator).filter(Moderator.moderator_email == login.email).first()
    
    if not moderator or not pwd_context.verify(login.password, moderator.hashed_password):
        raise HTTPException(status_code=400, detail="Неверные учетные данные")

    return {
        "moderator_id": moderator.moderator_id,
        "moderator_name": moderator.moderator_name,
        "moderator_email": moderator.moderator_email,
        "is_cashier": moderator.is_cashier,
        "is_admin": moderator.is_admin,
    }

# Настройки для хэширования паролей
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Секретный ключ для JWT (должен быть защищен)
SECRET_KEY = "your_secret_key_here" 
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

@app.post("/register", response_model=ModeratorRead)
def register_moderator(moderator: ModeratorCreate, db: Session = Depends(get_db)):
    hashed_password = get_password_hash(moderator.password)
    db_moderator = Moderator(
        moderator_name=moderator.moderator_name,
        moderator_email=moderator.moderator_email,
        hashed_password=hashed_password,
        is_user=moderator.is_user,
        is_cashier=moderator.is_cashier,
        is_admin=moderator.is_admin
    )
    db.add(db_moderator)
    db.commit()
    db.refresh(db_moderator)
    return db_moderator