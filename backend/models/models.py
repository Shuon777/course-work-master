from typing import Optional
from sqlalchemy import Column, Integer, MetaData, String, Date, Boolean, ForeignKey, Text, DECIMAL, TIMESTAMP, UniqueConstraint
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime

metadata = MetaData()
Base = declarative_base(metadata=metadata)

class Moderator(Base):
    __tablename__ = 'moderator'

    moderator_id = Column(Integer, primary_key=True, autoincrement=True)
    moderator_name = Column(String(25), nullable=False)
    moderator_email = Column(String(50), nullable=False, unique=True)
    hashed_password = Column(String(255))
    created_at = Column(TIMESTAMP, default=datetime.utcnow)
    is_user = Column(Boolean, default=False)
    is_cashier = Column(Boolean, default=False)
    is_admin = Column(Boolean, default=False)

class Studio(Base):
    __tablename__ = 'studio'

    studio_id = Column(Integer, primary_key=True, autoincrement=True)
    studio_name = Column(String(50), nullable=False)
    studio_country = Column(String(50), nullable=False)

    films = relationship("Film", back_populates="studio")

class Genre(Base):
    __tablename__ = 'genre'

    genre_id = Column(Integer, primary_key=True, autoincrement=True)
    genre_name = Column(String(30), nullable=False)

    films = relationship("Film", back_populates="genre")

class Producer(Base):
    __tablename__ = 'producer'

    producer_id = Column(Integer, primary_key=True, autoincrement=True)
    producer_name = Column(String(50), nullable=False)

    films = relationship("Film", back_populates="producer")

class Actor(Base):
    __tablename__ = 'actor'

    actor_id = Column(Integer, primary_key=True, autoincrement=True)
    actor_name = Column(String(50), nullable=False)

    filmographies = relationship("Filmography", back_populates="actor")

class Client(Base):
    __tablename__ = 'client'

    client_id = Column(Integer, primary_key=True, autoincrement=True)
    client_first_name = Column(String(25), nullable=False)
    client_last_name = Column(String(25), nullable=False)
    client_address = Column(String(60), nullable=False)
    client_passport = Column(String(30), nullable=False, unique=True)
    client_phone_number = Column(String(20), nullable=False)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)

    journals = relationship("Journal", back_populates="client")

class Film(Base):
    __tablename__ = 'film'

    film_id = Column(Integer, primary_key=True, autoincrement=True)
    studio_id = Column(Integer, ForeignKey('studio.studio_id', ondelete="CASCADE", onupdate="CASCADE"), nullable=False)
    genre_id = Column(Integer, ForeignKey('genre.genre_id', ondelete="CASCADE", onupdate="CASCADE"), nullable=False)
    producer_id = Column(Integer, ForeignKey('producer.producer_id', ondelete="CASCADE", onupdate="CASCADE"), nullable=False)
    film_name = Column(String(255))
    film_date_release = Column(Date)
    film_rental = Column(DECIMAL(10, 2), nullable=False)
    film_annotation = Column(Text, nullable=False)

    studio = relationship("Studio", back_populates="films")
    genre = relationship("Genre", back_populates="films")
    producer = relationship("Producer", back_populates="films")
    filmographies = relationship("Filmography", back_populates="film")
    journals = relationship("Journal", back_populates="film")

class Filmography(Base):
    __tablename__ = 'filmography'

    filmography_id = Column(Integer, primary_key=True, autoincrement=True)
    film_id = Column(Integer, ForeignKey('film.film_id', ondelete="CASCADE", onupdate="CASCADE"), nullable=False)
    actor_id = Column(Integer, ForeignKey('actor.actor_id', ondelete="CASCADE", onupdate="CASCADE"), nullable=False)

    film = relationship("Film", back_populates="filmographies")
    actor = relationship("Actor", back_populates="filmographies")

class Journal(Base):
    __tablename__ = 'journal'

    journal_id = Column(Integer, primary_key=True, autoincrement=True)
    film_id = Column(Integer, ForeignKey('film.film_id', ondelete="CASCADE", onupdate="CASCADE"), nullable=False)
    client_id = Column(Integer, ForeignKey('client.client_id', ondelete="CASCADE", onupdate="CASCADE"), nullable=False)
    journal_date_issue = Column(Date, nullable=False)
    journal_date_return = Column(Date, nullable=False)
    journal_refund = Column(Boolean)

    film = relationship("Film", back_populates="journals")
    client = relationship("Client", back_populates="journals")

    __table_args__ = (
        UniqueConstraint('film_id', 'client_id', name='uq_journal_film_client'),
    )
