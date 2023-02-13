import { QueryResult } from "pg";

interface IprojectRequest {
    projectName: string,
    projectDescription: string,
    projectEstimatedTime: string,
    projectRepository: string,
    projectStartDate: Date,
    projectEndDate: Date,
    projectDevId: number | null
};

interface Iproject extends IprojectRequest{
    projectId: number,
};

type ProjectResult = QueryResult<Iproject>;

export { 
    IprojectRequest,
    ProjectResult 
}