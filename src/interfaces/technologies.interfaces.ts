import { QueryResult } from "pg";

interface ItechReq{
    name: string
};

interface Itech extends ItechReq{
    id: number
};

type TechResult = QueryResult<Itech>;

interface ItechProjectReq{
    addedIn: Date,
    projectId: number,
    technologyId: number,
    technologyName: string | void
};

interface ItechProject extends ItechProjectReq{
    id: number
};

type TechProjectResult = QueryResult<ItechProject>;

export {
    TechResult,
    ItechProjectReq,
    TechProjectResult,
    ItechReq
}