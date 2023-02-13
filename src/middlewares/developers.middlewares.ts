import { QueryConfig } from "pg";
import { DeveloperResult } from "../interfaces";
import { client } from "../database";
import { 
    Request, 
    Response, 
    NextFunction 
} from "express";

const validateDevReq = async (req: Request, resp: Response, next: NextFunction): Promise<Response | void> =>{
    const requiredKeys = [ "devName", "devEmail"];
    const actualKeys = Object.keys(req.body);
    let validate = actualKeys.every(key => requiredKeys.includes(key));
    if(!validate){
        return resp.status(400).json({
            message: "Verify your request."
        })
    };
    return next();
};

const validateEmailReq = async (req: Request, resp: Response, next: NextFunction): Promise<Response | void> =>{
    const queryString: string = 
    `
        SELECT
            "devEmail"
        FROM
            developers
        WHERE
            "devEmail" = $1
        ;
    `;
    const queryConfig: QueryConfig = {
        text: queryString,
        values: [req.body.devEmail]
    };
    const queryResult: DeveloperResult = await client.query(queryConfig);
    if(queryResult.rowCount !== 0){
        return resp.status(409).json({
            message: "This email already exists!"
        });
    };
    return next();
};

export{
    validateDevReq,
    validateEmailReq,
    
}