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

interface IdevInfoRequest{
    devInfoDevSince: Date,
    devInfoPreferredOS: string
};

interface IdevInfo extends IdevInfoRequest{
    devInfoId: number
};

type DeveloperInfoResult = QueryResult<IdevInfo>;

export { 
    DeveloperResult, 
    IdeveloperRequest,
    IdevInfoRequest,
    DeveloperInfoResult
}