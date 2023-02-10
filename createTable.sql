CREATE DATABASE IF NOT EXISTS developers_data;

CREATE TYPE IF NOT EXISTS OS AS ENUM ('Windows', 'MacOS', 'Linux');

CREATE TABLE IF NOT EXISTS developer_infos(
    "devInfoId" BIGSERIAL PRIMARY KEY,
    "devInfoDeveloperSince" DATE NOT NULL,
    "devInfoPreferredOS" ENUM OS NOT NULL
);

CREATE TABLE IF NOT EXISTS developers(
    "devId" BIGSERIAL PRIMARY KEY,
    "devName" VARCHAR(50) NOT NULL,
    "devEmail" VARCHAR(50) NOT NULL
    "devInfoId" INTEGER UNIQUE
    FOREIGN KEY 
);
