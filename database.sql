create TABLE administrator (
    id SERIAL PRIMARY KEY,
    login VARCHAR(255),
    password VARCHAR(255)
);

create TABLE moderator (
    id SERIAL PRIMARY KEY,
    surname VARCHAR(255),
    name VARCHAR(255),
    secondname VARCHAR(255)
    login VARCHAR(255),
    password VARCHAR(255)
);