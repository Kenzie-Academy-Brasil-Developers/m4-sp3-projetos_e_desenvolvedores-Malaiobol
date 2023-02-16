import { QueryConfig } from "pg";
import { DeveloperResult } from "../interfaces";
import { client } from "../database";
import { 
    Request, 
    Response, 
    NextFunction 
} from "express";

const validateDevReq = async (req: Request, resp: Response, next: NextFunction): Promise<Response | void> =>{
    const requiredKeys = ["name", "email"];
    const actualReq: any = req.body;
    Object.keys(actualReq).forEach(key => {
        if(!requiredKeys.includes(key)) {
            delete actualReq[key]
        }
    });
    if(!req.body.email){
        return resp.status(400).json({
            message: "Missing required keys: email",
        })
    }; 
    if(!req.body.name){
        return resp.status(400).json({
            message: "Missing required keys: name",
        })
    }; 
    return next();
};

const validateEmailReq = async (req: Request, resp: Response, next: NextFunction): Promise<Response | void> =>{
    const queryString: string = 
    `
        SELECT
            "email"
        FROM
            developers
        WHERE
            "email" = $1
        ;
    `;
    const queryConfig: QueryConfig = {
        text: queryString,
        values: [req.body.email]
    };
    const queryResult: DeveloperResult = await client.query(queryConfig);
    if(queryResult.rowCount !== 0){
        return resp.status(409).json({
            message: "This email already exists!"
        });
    };
    return next();
};

const ensureDevExists = async (req: Request, resp: Response, next: NextFunction): Promise<Response | void> =>{
    const devId: number = +req.params.id;
    const queryString = 
    `
        SELECT
            *
        FROM
            developers
        WHERE
            "id" = $1
        ;
    `;
    const queryConfig: QueryConfig = {
        text: queryString,
        values: [devId]
    };
    const queryResult: DeveloperResult = await client.query(queryConfig);
    if(!queryResult.rowCount){
        return resp.status(404).json({
            message: "Dev not Found"
        })
    };
    return next();
};

const validateDevInfoDevReq = async (req: Request, resp: Response, next: NextFunction): Promise<Response | void> =>{
    const requiredKeys = [ "devSince", "preferredOS" ];
    const actualReq: any = req.body;
    Object.keys(actualReq).forEach(key => {
        if(!requiredKeys.includes(key)) {
            delete actualReq[key]
        }
    });
    const actualEnumValue: string = req.body.preferredOS;
    if(!actualReq.devSince || !actualReq.preferredOS){
        return resp.status(400).json({
            message: "Verify your request, required keys are:",
            keys: ["devSince", "preferredOS"]
        })
    };
    if(actualEnumValue !== "Windows" && actualEnumValue !== "Linux" && actualEnumValue !== "MacOS"){
        return resp.status(400).json({
            message: "Please verify your OS request, accepted sistems are:",
            systems: "Windows, Linux, MacOS"
        })
    };
    return next();
};

const patchDevFilter =  async (req: Request, resp: Response, next: NextFunction): Promise<Response | void> =>{
    const validatedKeys = [ "name", "email" ];
    const actualReq: any = req.body;
    Object.keys(actualReq).forEach(key => {
        if(!validatedKeys.includes(key)) {
            delete actualReq[key]
        }
    });
    let validate = Object.keys(actualReq).some(key => validatedKeys.includes(key));
    if(!validate){
        return resp.status(400).json({
            message: "At least one of those keys must be send:",
            keys: [ "name", "email" ]
        })
    };
    next();
};

const patchDevInfoFilter =  async (req: Request, resp: Response, next: NextFunction): Promise<Response | void> =>{
    const validatedKeys = [ "devSince", "preferredOS" ];
    const actualReq: any = req.body;
    Object.keys(actualReq).forEach(key => {
        if(!validatedKeys.includes(key)) {
            delete actualReq[key]
        }
    });
    const actualEnumValue: string = req.body.preferredOS;
    if(actualEnumValue !== "Windows" && actualEnumValue !== "Linux" && actualEnumValue !== "MacOS"){
        return resp.status(400).json({
            message: "Please verify your OS request, accepted sistems are:",
            systems: "Windows, Linux, MacOS"
        })
    };
    let validate = Object.keys(actualReq).some(key => validatedKeys.includes(key));
    if(!validate){
        return resp.status(400).json({
            message: "At least one of those keys must be send.",
            keys: [ "devSince", "", "preferredOS" ]
        })
    };
    next();
};

export{
    validateDevReq,
    validateEmailReq,
    ensureDevExists,
    validateDevInfoDevReq,
    patchDevFilter,
    patchDevInfoFilter
}   