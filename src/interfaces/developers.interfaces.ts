import { QueryResult } from "pg";

interface IdeveloperRequest{
    devName: string,
    devEmail: string,
    devInfoId: number | null,
};

interface Ideveloper extends IdeveloperRequest{
    devId: number
};

type DeveloperResult = QueryResult<Ideveloper>;

export { 
    DeveloperResult, 
}