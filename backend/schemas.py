from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import date, datetime

class ModeratorRead(BaseModel):
    moderator_id: int
    moderator_name: str = Field(..., min_length=1, max_length=25)
    moderator_email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True

class ModeratorCreate(BaseModel):
    moderator_name: str = Field(..., min_length=1, max_length=25)
    moderator_email: EmailStr
    hashed_password: str = Field(..., min_length=8, max_length=255)

    class Config:
        from_attributes = True

class StudioRead(BaseModel):
    studio_id: int
    studio_name: str = Field(..., min_length=1, max_length=50)
    studio_country: str = Field(..., min_length=1, max_length=50)

    class Config:
        from_attributes = True

class StudioCreate(BaseModel):
    studio_name: str = Field(..., min_length=1, max_length=50)
    studio_country: str = Field(..., min_length=1, max_length=50)

    class Config:
        from_attributes = True

class GenreRead(BaseModel):
    genre_id: int
    genre_name: str = Field(..., min_length=1, max_length=30)

    class Config:
        from_attributes = True

class GenreCreate(BaseModel):
    genre_name: str = Field(..., min_length=1, max_length=30)

    class Config:
        from_attributes = True

class ProducerRead(BaseModel):
    producer_id: int
    producer_name: str = Field(..., min_length=1, max_length=50)

    class Config:
        from_attributes = True

class ProducerCreate(BaseModel):
    producer_name: str = Field(..., min_length=1, max_length=50)

    class Config:
        from_attributes = True

class ActorRead(BaseModel):
    actor_id: int
    actor_name: str = Field(..., min_length=1, max_length=50)

    class Config:
        from_attributes = True

class ActorCreate(BaseModel):
    actor_name: str = Field(..., min_length=1, max_length=50)

    class Config:
        from_attributes = True

class ClientRead(BaseModel):
    client_id: int
    client_first_name: str = Field(..., min_length=1, max_length=25)
    client_last_name: str = Field(..., min_length=1, max_length=25)
    client_address: str = Field(..., min_length=1, max_length=60)
    client_passport: str = Field(..., min_length=1, max_length=30)
    client_phone_number: str = Field(..., min_length=1, max_length=20)
    created_at: datetime

    class Config:
        from_attributes = True

class ClientCreate(BaseModel):
    client_first_name: str = Field(..., min_length=1, max_length=25)
    client_last_name: str = Field(..., min_length=1, max_length=25)
    client_address: str = Field(..., min_length=1, max_length=60)
    client_passport: str = Field(..., min_length=1, max_length=30)
    client_phone_number: str = Field(..., min_length=1, max_length=20)

    class Config:
        from_attributes = True

class FilmBasicRead(BaseModel):
    film_id: int
    studio_id: int
    genre_id: int
    producer_id: int
    film_name: str = Field(..., min_length=1, max_length=255)
    film_date_release: date
    film_rental: float = Field(..., gt=0)
    film_annotation: str

    class Config:
        from_attributes = True

class FilmCreate(BaseModel):
    studio_id: int
    genre_id: int
    producer_id: int
    film_name: str = Field(..., min_length=1, max_length=255)
    film_date_release: date
    film_rental: float = Field(..., gt=0)  
    film_annotation: str

    class Config:
        from_attributes = True

class FilmographyRead(BaseModel):
    filmography_id: int
    film_id: int
    actor_id: int

    class Config:
        from_attributes = True

class FilmographyCreate(BaseModel):
    film_id: int
    actor_id: int

    class Config:
        from_attributes = True

class JournalRead(BaseModel):
    journal_id: int
    film_id: int
    client_id: int
    journal_date_issue: date
    journal_date_return: date
    journal_refund: Optional[bool]

    class Config:
        from_attributes = True
        json_encoders = {
            date: lambda v: v.strftime('%d-%m-%Y')  # Форматирование даты
        }

class JournalCreate(BaseModel):
    film_id: int
    client_id: int
    journal_date_issue: datetime
    journal_date_return: datetime
    journal_refund: Optional[bool]

    class Config:
        from_attributes = True
        json_encoders = {
            date: lambda v: v.strftime('%d-%m-%Y')  # Форматирование даты
        }

class JournalDetailed(BaseModel):
    journal_id: int
    film_name: str
    client_full_name: str
    journal_date_issue: date
    journal_date_return: date
    journal_refund: Optional[bool]

    class Config:
        from_attributes = True
        json_encoders = {
            date: lambda v: v.strftime('%d-%m-%Y')  # Форматирование даты
        }


class FilmDetailedRead(BaseModel):
    film_id: int
    film_name: str
    film_date_release: date
    film_rental: float
    film_annotation: str
    studio_name: str
    genre_name: str
    producer_name: str

    class Config:
        from_attributes = True
        json_encoders = {
            date: lambda v: v.strftime('%d-%m-%Y')  # Форматирование даты
        }


class FilmographyDetailed(BaseModel):
    filmography_id: int
    film_name: str
    actor_name: str

    class Config:
        from_attributes = True


class RentalInfo(BaseModel):
    full_name: str
    client_phone_number: str
    film_name: str
    journal_date_issue: date
    journal_date_return: date
    rental_duration: int  # В днях

    class Config:
        from_attributes = True

class RentalDebt(BaseModel):
    full_name: str
    client_phone_number: str
    film_name: str
    journal_date_issue: date
    journal_date_return: date
    rental_debt: int  # В днях

    class Config:
        from_attributes = True

class FilmResponse(BaseModel):
    producer_name: str
    film_name: str
    studio_name: str
    film_date_release: date
    film_rental: float

    class Config:
        from_attributes = True

class FilmGenreResponse(BaseModel):
    genre_name: str
    film_name: str
    producer_name: str
    studio_name: str
    film_date_release: date
    film_rental: float




class ModeratorRead(BaseModel): 
    moderator_id: int 
    moderator_name: str = Field(..., min_length=1, max_length=25) 
    moderator_email: EmailStr 
    created_at: datetime 
    is_user: bool
    is_cashier: bool
    is_admin: bool

    class Config: 
        from_attributes = True 

class ModeratorCreate(BaseModel): 
    moderator_name: str = Field(..., min_length=1, max_length=25) 
    moderator_email: EmailStr 
    password: str = Field(..., min_length=6, max_length=255)
    is_user: bool = True
    is_cashier: bool = False
    is_admin: bool = False

    class Config: 
        from_attributes = True 

