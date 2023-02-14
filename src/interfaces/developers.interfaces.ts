import { QueryResult } from "pg";

interface IdeveloperRequest{
    name: string,
    email: string,
    developerInfoId: number | null,
};

interface Ideveloper extends IdeveloperRequest{
    devId: number
};

type DeveloperResult = QueryResult<Ideveloper>;

interface IdevInfoRequest{
    devSince: Date,
    preferredOS: string
};

interface IdevInfo extends IdevInfoRequest{
    id: number
};

type DeveloperInfoResult = QueryResult<IdevInfo>;

export { 
    DeveloperResult, 
    IdeveloperRequest,
    IdevInfoRequest,
    DeveloperInfoResult
}