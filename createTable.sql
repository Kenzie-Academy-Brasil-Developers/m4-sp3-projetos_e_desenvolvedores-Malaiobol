CREATE DATABASE IF NOT EXISTS developers_data;

CREATE TYPE IF NOT EXISTS OS AS ENUM ('Windows', 'MacOS', 'Linux');

CREATE TABLE IF NOT EXISTS developers_infos(
    "id" BIGSERIAL PRIMARY KEY,
    "DevSince" DATE NOT NULL,
    "PreferredOS" OS NOT NULL
);

CREATE TABLE IF NOT EXISTS developers(
	"id" BIGSERIAL PRIMARY KEY,
	"name" VARCHAR(50) NOT NULL,
	"email" VARCHAR(50) NOT NULL,
	"developerInfoId" INTEGER UNIQUE,
    FOREIGN KEY("developerInfoId") REFERENCES developers_infos("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS projects(
    "id" BIGSERIAL PRIMARY KEY,
    "name" VARCHAR(50) NOT NULL,
    "description" VARCHAR NOT NULL,
    "estimatedTime" VARCHAR(20) NOT NULL,
    "repository" VARCHAR(120) NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE,
    "developerId" INTEGER NOT NULL,
    FOREIGN KEY("developerId") REFERENCES developers("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS technologies(
    "id" BIGSERIAL PRIMARY KEY,
    "name" VARCHAR(30) NOT NULL
);

INSERT INTO technologies("name")
    VALUES  
        ('JavaScript'), ('Python'), 
        ('React'), ('Express.js'), 
        ('HTML'), ('CSS'), ('Django'),
        ('PostgreSQL'), ('MongoDB')
;

CREATE TABLE IF NOT EXISTS technologies_projects(
	"id" BIGSERIAL PRIMARY KEY,
    "addedIn" DATE NOT NULL,
	"projectId" INTEGER NOT NULL,
	"technologyId" INTEGER NOT NULL,  
	FOREIGN KEY("projectId") REFERENCES projects("id") ON DELETE CASCADE,
	FOREIGN KEY("technologyId") REFERENCES technologies("id") ON DELETE SET NULL
);