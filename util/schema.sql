CREATE USER username WITH password 'password';
CREATE DATABASE spacebars;
\c spacebars

CREATE TABLE users (
       id SERIAL PRIMARY KEY,
       username TEXT UNIQUE NOT NULL,
       email TEXT UNIQUE NOT NULL,
       password TEXT NOT NULL
);

CREATE TABLE spacebars (
       id BIGSERIAL PRIMARY KEY,
       owner_id SERIAL REFERENCES users(id),
       created TIMESTAMPTZ NOT NULL,
       spacebar BIGINT NOT NULL,
       name TEXT NOT NULL,
       description TEXT,
       url TEXT
);
