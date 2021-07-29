DROP DATABASE IF EXISTS tarotclubdb;
CREATE DATABASE tarotclubdb;

\c tarotclubdb;

CREATE TABLE IF NOT EXISTS users (
    id bigserial PRIMARY KEY NOT NULL,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    email TEXT NOT NULL,
    attr JSON, -- autres paramètres en vrac (nom complet, avatar, twitter, fb, ...)
    created timestamp, -- when the account was created
    reset_password_datetime timestamp,
    login_attempts INTEGER,
    reset_token TEXT, -- reset password token,
    status INTEGER -- -1 = deleted account, 0 = email not validated, 1 = normal user
);


CREATE TABLE IF NOT EXISTS infos
(
    version TEXT
);

CREATE TABLE IF NOT EXISTS servers
(
    id bigserial PRIMARY KEY NOT NULL,
    user_id bigserial NOT NULL, -- compte associé à ce serveur
    token TEXT NOT NULL
);
