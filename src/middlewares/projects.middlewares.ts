import { QueryConfig } from "pg";
import { client } from "../database";
import { 
    Request, 
    Response, 
    NextFunction 
} from "express";
import { ProjectResult } from "../interfaces";

const projectFilter = async (req: Request, resp: Response, next: NextFunction): Promise<Response | void> =>{
    const validatedKeys =  [ 
        "projectName", 
        "projectDescription", 
        "projectEstimatedTime", 
        "projectRepository",
        "projectStartDate", 
        "projectDevId"            
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
                "projectName", 
                "projectDescription", 
                "projectEstimatedTime", 
                "projectRepository",
                "projectStartDate", 
                "projectDevId"  
            ]
        })
    };
    return next();
};

const ensureProjectDevExists = async (req: Request, resp: Response, next: NextFunction): Promise<Response | void> =>{
    const projectDevId: number = req.body.projectDevId;
    const queryString: string = 
    `
        SELECT
            "devId"
        FROM
            developers
        WHERE
            "devId" = $1
        ;
    `;
    const queryConfig: QueryConfig = {
        text: queryString,
        values: [projectDevId]
    };
    const queryResult: ProjectResult = await client.query(queryConfig);
    if(queryResult.rowCount !== 1){
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
            "projectId"
        FROM
            projects
        WHERE
            "projectId" = $1
        ;
    `;
    const queryConfig: QueryConfig = {
        text: queryString,
        values: [projectId]
    };
    const queryResult: ProjectResult = await client.query(queryConfig);
    if(queryResult.rowCount !== 1){
        return resp.status(404).json({
            message: "Project not found"
        })
    };
    return next();
};

export {
    projectFilter,
    ensureProjectDevExists,
    ensureProjectExists
}