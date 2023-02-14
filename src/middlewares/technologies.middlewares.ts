import { NextFunction, Request, Response } from "express";

const assignTechFilter = async (req: Request, resp: Response, next:NextFunction): Promise<Response | void> =>{
    const validatedKeys =  ["name"];
    const actualReq: any = req.body;
    Object.keys(actualReq).forEach(key => {
        if(!validatedKeys.includes(key)) {
            delete actualReq[key]
        }
    });
    return next();
};

export { 
    assignTechFilter 
}