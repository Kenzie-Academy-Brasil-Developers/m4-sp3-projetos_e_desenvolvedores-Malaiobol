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

const ensureTechExists = async (req: Request, resp: Response, next:NextFunction): Promise<Response | void> =>{
    if(req.params.name !== "JavaScript"
    && req.params.name !== "Python"
    && req.params.name !== "React"
    && req.params.name !== "Express.js"
    && req.params.name !== "HTML"
    && req.params.name !== "CSS"
    && req.params.name !== "Django"
    && req.params.name !== "PostgreSQL"
    && req.params.name !== "MongoDB"){
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
    return next();
}
export { 
    assignTechFilter,
    ensureTechExists
}