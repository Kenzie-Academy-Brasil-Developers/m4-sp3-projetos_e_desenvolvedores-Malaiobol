import { Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import format from "pg-format";
import { client } from "../database";
import { 
    ItechReq,
    TechProjectResult,
    TechResult
}   from "../interfaces";

const assignTech = async (req: Request, resp: Response): Promise<Response> => {
    const projectId: number = +req.params.id;
    const techName: ItechReq = req.body.name;
    const actualDate = new Date(Date.now() + 86400 * 1000);
    let queryString = 
    `
        SELECT
            *
        FROM
            technologies
        WHERE
            name = $1
    `;
    let queryConfig: QueryConfig ={
        text: queryString,
        values: [techName]
    };
    const techResult: TechResult = await client.query(queryConfig);
    if(!techResult.rowCount){
        return resp.status(400).json({
            message: "Technology not supported.",
            keys: [
                "JavaScript",
                "Python",
                "React",
                "Express.js",
                "HTML",
                "CSS",
                "Django",
                "PostgreSQL",
                "MongoDB"
            ]
        })
    };

    queryString =
    `
        INSERT INTO
            technologies_projects ("addedIn", "projectId", "technologyId")
        VALUES ($1, $2, $3)
        RETURNING *;
    `;  

    queryConfig = {
        text: queryString,
        values: [actualDate, projectId, techResult.rows[0].id]
    };

    queryString = 
    `
        SELECT
            pr."id" AS "projectId",
            pr."name" AS "projectName",
            pr."description" AS "projectDescription",
            pr."estimatedTime" AS "projectEstimatedTime",
            pr."repository" AS "projectRepository",
            pr."startDate" AS "projectStartDate",
            pr."endDate" AS "projectEndDate",
            te."id" AS "technologyId",
            te."name" AS "technologyName"
        FROM
            projects pr
        LEFT JOIN
            technologies_projects tp ON tp."projectId" = pr."id"
        LEFT JOIN
            technologies te ON tp."technologyId" = te."id"
        WHERE
            pr."id" = $1;
    `

    queryConfig = {
        text: queryString,
        values: [projectId]
    };

    const techProjectResult: TechProjectResult = await client.query(queryConfig);
    return resp.status(201).json(techProjectResult.rows[0]);        
};

const deleteTech = async (req: Request, resp: Response): Promise<Response> =>{
    const projectId: number = +req.params.id;
    const techName: string = req.params.name;

    let queryString = 
    `
        SELECT 
            *
        FROM
            technologies te
        WHERE
            te.name = $1;
    `
    let queryConfig: QueryConfig = {
        text: queryString,
        values: [techName]
    };

    const searchResult: QueryResult = await client.query(queryConfig);

    queryString = 
    `
        DELETE FROM
            technologies_projects tp
        WHERE
            tp."projectId" = $1
        AND
            tp."technologyId" = $2;
    `

    queryConfig = {
        text: queryString,
        values: [projectId, searchResult.rows[0].id]
    };

    const queryResult: QueryResult = await client.query(queryConfig)
    return resp.status(204).json({});
};

export {
    assignTech,
    deleteTech
}