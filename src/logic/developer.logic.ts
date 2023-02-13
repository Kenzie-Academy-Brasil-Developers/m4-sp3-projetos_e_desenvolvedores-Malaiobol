import format from "pg-format";
import { Request, Response } from "express";
import { client } from "../database";
import { DeveloperInfoResult, IdevInfoRequest } from "../interfaces/developers.interfaces";
import { QueryConfig } from "pg";
import { 
    DeveloperResult, 
    IdeveloperRequest, 
} from "../interfaces";

const createDev = async (req: Request, resp: Response): Promise<Response> =>{
    const devData: IdeveloperRequest = req.body;
    const queryString = format(
       `
            INSERT INTO
                developers(%I)
            VALUES(%L)
            RETURNING *;  
       `,
       Object.keys(devData),
       Object.values(devData)
    );

    const queryResult: DeveloperResult = await client.query(queryString);
    return resp.status(201).json(queryResult.rows[0]); 
};

const createDevInfo = async (req: Request, resp: Response): Promise<Response> =>{
    const devId: number = +req.params.id;
    const devInfo: IdevInfoRequest = req.body;

    let queryString:string = format(
        `
            INSERT INTO
                developers_infos (%I)
            VALUES (%L)
            RETURNING *;
        `,
        Object.keys(devInfo),
        Object.values(devInfo)
    );    
    let queryResult: DeveloperInfoResult = await client.query(queryString);   
    queryString = 
    `
        UPDATE
            developers
        SET
            "devInfoId" = $1
        WHERE
            "devId" = $2
        RETURNING 
            *
        ;
    `;

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [queryResult.rows[0].devInfoId, devId]
    };
    await client.query(queryConfig);
    return resp.status(201).json(queryResult.rows[0]);
};

const viewAllDevs = async (req: Request, resp: Response): Promise<Response> => {
    const queryString: string =
    `
        SELECT
            *
        FROM
            developers
        LEFT JOIN
            developers_infos ON developers_infos."devInfoId" = developers."devId"
        ;
    `;
    const queryConfig: QueryConfig = {
        text: queryString
    };
    const queryResult: DeveloperResult = await client.query(queryConfig);
    return resp.status(200).json(queryResult.rows);
};

const viewDev = async (req: Request, resp: Response): Promise<Response> =>{
    const devId: number = +req.params.id;
    const queryString = 
    `
        SELECT
            *
        FROM
            developers
        LEFT JOIN
            developers_infos ON developers_infos."devInfoId" = developers."devId"
        WHERE
            developers."devId" = $1
        ;
    `

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [devId]
    };
    const queryResult = await client.query(queryConfig);
    return resp.status(200.).json(queryResult.rows[0])
};

const updateDev = async (req: Request, resp: Response): Promise<Response> =>{
    const updateData = Object.values(req.body);
    const updateKeys = Object.keys(req.body);
    const devId: number = +req.params.id;

    const formatString: string = format(`
        UPDATE
            developers
        SET(%I) = ROW(%L)
        WHERE
            "devId" = $1
        RETURNING *;
    `,
        updateKeys,
        updateData
    );

    const queryConfig: QueryConfig ={
        text: formatString,
        values: [devId]
    };

    const queryResult: DeveloperResult = await client.query(queryConfig);
    return resp.status(200).json(queryResult.rows[0]);
};

const updateDevInfo = async (req: Request, resp: Response): Promise <Response> =>{
    const updateData = Object.values(req.body);
    const updateKeys = Object.keys(req.body);
    const devId: number = +req.params.id;

    const formatString: string = format(
        `
            UPDATE
                developers_infos
            SET
                (%I) = ROW(%L)
            WHERE
                "devId" = $1
            RETURNING 
                *
            ;
        `,
        updateKeys,
        updateData
    );

    const queryConfig: QueryConfig ={
        text: formatString,
        values: [devId]
    };

    const queryResult: DeveloperResult = await client.query(queryConfig);
    return resp.status(200).json(queryResult.rows[0]);
};

const deleteDev = async (req: Request, resp: Response): Promise<Response> =>{
    const devID: number = +req.params.id;
    const queryString: string = 
    `
        DELETE FROM
            developers_infos
        WHERE
            "devInfoId" = $1
        ;
    `;   
    const queryConfig: QueryConfig = {
        text: queryString,
        values: [devID]
    };
    const queryResult: DeveloperResult = await client.query(queryConfig);
    return resp.status(204).json();
};


export {
    createDev,
    createDevInfo,
    viewAllDevs,
    viewDev,
    updateDev,
    updateDevInfo,
    deleteDev
}