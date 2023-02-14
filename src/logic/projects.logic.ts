import format from "pg-format";
import { Request, Response } from "express";
import { client } from "../database";
import { QueryConfig } from "pg";
import {
    IprojectRequest,
    ProjectResult
} from "../interfaces";


const createProject = async (req: Request, resp: Response): Promise<Response> =>{
    const projectData: IprojectRequest = req.body;
    const queryString = format(
        `
            INSERT INTO
                projects(%I)
            VALUES (%L)
            RETURNING *;
        `,
        Object.keys(projectData),
        Object.values(projectData)
    );

    const QueryResult: ProjectResult = await client.query(queryString);
    return resp.status(201).json(QueryResult.rows[0]);
};

const viewProject = async (req: Request, resp: Response): Promise<Response> =>{
    const projectId: number = +req.params.id;
    const queryString = 
    `
        SELECT
            *
        FROM
            projects pr
        LEFT JOIN
            technologies_projects tp ON tp."projectId" = pr."id"
        WHERE
            pr."id" = $1
        ;
    `;
    const queryConfig: QueryConfig = {
        text: queryString,
        values: [projectId]
    };
    const queryResult = await client.query(queryConfig);
    return resp.status(200.).json(queryResult.rows[0]);
};

const viewAllProjects = async (req: Request, resp: Response): Promise<Response> =>{   
    const queryString = 
    `
        SELECT
            *
        FROM
            projects pr
        LEFT JOIN
            technologies_projects tp ON tp."projectId" = pr."id"
        ;
    `;
    const queryConfig: QueryConfig = {
        text: queryString
    };
    const queryResult = await client.query(queryConfig);
    return resp.status(200).json(queryResult.rows);
};

const updateProject = async (req: Request, resp: Response): Promise<Response> =>{
    const updateData = Object.values(req.body);
    const updateKeys = Object.keys(req.body);
    const projectId: number = +req.params.id;
    const formatString: string = format(`
        UPDATE
            projects
        SET(%I) = ROW(%L)
        WHERE
            "id" = $1
        RETURNING *;
    `,
        updateKeys,
        updateData
    );
    const queryConfig: QueryConfig ={
        text: formatString,
        values: [projectId]
    };
    const queryResult: ProjectResult = await client.query(queryConfig);
    return resp.status(200).json(queryResult.rows[0]);
};

const deleteProject = async (req: Request, resp: Response): Promise<Response> =>{
    const projectId: number = +req.params.id;
    const queryString: string = 
    `
        DELETE FROM
            projects
        WHERE
            "id" = $1
        ;
    `;   
    const queryConfig: QueryConfig = {
        text: queryString,
        values: [projectId]
    };
    const queryResult: ProjectResult = await client.query(queryConfig);
    return resp.status(204).json();
};

export {
    createProject,
    viewProject,
    viewAllProjects,
    updateProject,
    deleteProject
}