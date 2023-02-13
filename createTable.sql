CREATE DATABASE IF NOT EXISTS developers_data;

CREATE TYPE IF NOT EXISTS OS AS ENUM ('Windows', 'MacOS', 'Linux');

CREATE TABLE IF NOT EXISTS developers_infos(
    "devInfoId" BIGSERIAL PRIMARY KEY,
    "devInfoDevSince" DATE NOT NULL,
    "devInfoPreferredOS" OS NOT NULL
);

CREATE TABLE IF NOT EXISTS developers(
	"devId" BIGSERIAL PRIMARY KEY,
	"devName" VARCHAR(50) NOT NULL,
	"devEmail" VARCHAR(50) NOT NULL,
	"devInfoId" INTEGER UNIQUE,
    FOREIGN KEY("devInfoId") REFERENCES developers_infos("devInfoId") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS projects(
    "projectId" BIGSERIAL PRIMARY KEY,
    "projectName" VARCHAR(50) NOT NULL,
    "projectDescription" VARCHAR NOT NULL,
    "projectEstimatedTime" VARCHAR(20) NOT NULL,
    "projectRepository" VARCHAR(120) NOT NULL,
    "projectStartDate" DATE NOT NULL,
    "projectEndDate" DATE,
    "projectDevId" INTEGER NOT NULL,
    FOREIGN KEY("projectDevId") REFERENCES developers("devId") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS technologies(
    "techId" BIGSERIAL PRIMARY KEY,
    "techName" VARCHAR(30) NOT NULL
);

INSERT INTO technologies("techName")
    VALUES  
        ('JavaScript'), ('Python'), 
        ('React'), ('Express.js'), 
        ('HTML'), ('CSS'), ('Django'),
        ('PostgreSQL'), ('MongoDB')
;

CREATE TABLE IF NOT EXISTS technologies_projects(
	"projectTechId" BIGSERIAL PRIMARY KEY,
    "projectTechName" VARCHAR(30) NOT NULL,
    "addedIn" DATE NOT NULL,
	"projectID" INTEGER NOT NULL,
	"techID" INTEGER NOT NULL,  
	FOREIGN KEY("projectID") REFERENCES projects("projectId") ON DELETE CASCADE,
	FOREIGN KEY("techID") REFERENCES technologies("techId") ON DELETE SET NULL
);