import { QueryConfig } from "pg";
import { client } from "../database";
import { 
    Request, 
    Response, 
    NextFunction 
} from "express";
import { ProjectResult } from "../interfaces";

const validateProjectPatch = async (req: Request, resp: Response, next: NextFunction): Promise<Response | void> =>{
    const validatedKeys = [
        "name",
        "description",
        "estimatedTime",
        "repository",
        "startDate",
    ];
    const actualReq = req.body;
    let validate = Object.keys(actualReq).some(key => validatedKeys.includes(key));
    if(!validate){
        return resp.status(400).json({
            message: "Ate least one key must be send.",
            keys: [
                "name",
                "description",
                "estimatedTime",
                "repository",
                "startDate"
            ]
        })
    }
    return next();
}

const validateProjectReq = async (req: Request, resp: Response, next: NextFunction): Promise<Response | void> =>{
    if  ( 
            !req.body.name 
            && !req.body.description 
            && !req.body.estimatedTime 
            && !req.body.repository 
            && !req.body.startDate 
            && !req.body.developerInfoId
        ){ 
        return resp.status(400).json({
            message: "Missing required keys: description,estimatedTime,repository,startDate."
        })
    };
    return next();
}

const projectFilter = async (req: Request, resp: Response, next: NextFunction): Promise<Response | void> =>{
    const validatedKeys =  [ 
        "name", 
        "description", 
        "estimatedTime", 
        "repository",
        "startDate", 
        "developerId"            
    ];
    const actualReq: any = req.body;
    Object.keys(actualReq).forEach(key => {
        if(!validatedKeys.includes(key)) {
            delete actualReq[key]
        }
    });
    let validate = Object.keys(actualReq).every(key => validatedKeys.includes(key));
    if(!validate){
        return resp.status(400).json({
            message: "Please verify your keys",
            keys: [
                "name", 
                "description", 
                "estimatedTime", 
                "repository",
                "startDate", 
                "developerId"   
            ]
        })
    };
    return next();
};

const ensureProjectDevExists = async (req: Request, resp: Response, next: NextFunction): Promise<Response | void> =>{
    const projectDevId: number = req.body.developerId;
    const queryString: string = 
    `
        SELECT
            id
        FROM
            developers
        WHERE
            id = $1
        ;
    `;
    const queryConfig: QueryConfig = {
        text: queryString,
        values: [projectDevId]
    };
    const queryResult: ProjectResult = await client.query(queryConfig);
    if(!queryResult.rowCount){
        return resp.status(404).json({
            message: "Dev not found"
        })
    };
    return next();
};

const ensureProjectExists = async (req: Request, resp: Response, next: NextFunction): Promise<Response | void> =>{
    const projectId: number = +req.params.id;
    const queryString: string = 
    `
        SELECT
            "id"
        FROM
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
    if(!queryResult.rowCount){
        return resp.status(404).json({
            message: "Project not found"
        })
    };
    return next();
};

export {
    projectFilter,
    ensureProjectDevExists,
    ensureProjectExists,
    validateProjectReq,
    validateProjectPatch
}