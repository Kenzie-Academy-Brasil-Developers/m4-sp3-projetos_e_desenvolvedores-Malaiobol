import { QueryResult } from "pg";

interface ItechReq{
    techName: string
};

interface Itech extends ItechReq{
    techId: number
};

type TechResult = QueryResult<Itech>;

interface ItechProjectReq{
    projectTechName: string,
    addedIn: Date,
    projectID: number,
    techID: number
};

interface ItechProject extends ItechProjectReq{
    projectTechId: number
};

type TechProjectResult = QueryResult<ItechProject>;

export {
    TechResult,
    ItechProjectReq,
    TechProjectResult,
    ItechReq
}