import { QueryResult } from "pg";

interface IprojectRequest {
    name: string,
    description: string,
    estimatedTime: string,
    repository: string,
    startDate: Date,
    endDate: Date,
    developerId: number | null
};

interface Iproject extends IprojectRequest{
    id: number,
};

type ProjectResult = QueryResult<Iproject>;

export { 
    IprojectRequest,
    ProjectResult 
}