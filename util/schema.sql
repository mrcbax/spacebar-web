CREATE USER spacebars WITH password 'testpassword';
CREATE DATABASE spacebars;
\c spacebars

CREATE TABLE users (
       id SERIAL PRIMARY KEY,
       username TEXT UNIQUE NOT NULL,
       email TEXT UNIQUE NOT NULL,
       password TEXT NOT NULL,
       api_salt TEXT NOT NULL,
       api_public TEXT NOT NULL,
       api_secret TEXT NOT NULL,
       is_admin BOOLEAN NOT NULL
);
GRANT ALL PRIVILEGES ON TABLE users TO spacebars;

CREATE TABLE spacebars (
       id BIGSERIAL PRIMARY KEY,
       owner_id SERIAL REFERENCES users(id),
       created TIMESTAMPTZ NOT NULL,
       spacebar BIGINT NOT NULL,
       name TEXT NOT NULL,
       description TEXT,
       url TEXT
);
GRANT ALL PRIVILEGES ON TABLE spacebars TO spacebars;
