import express, { Application } from "express";
import { startDatabase } from "./database";
import { 
    validateProjectReq,
    projectFilter,
    ensureProjectDevExists,
    ensureProjectExists,
    ensureDevInfoIdNotExists,

    validateDevReq,
    validateEmailReq,
    ensureDevExists,
    validateDevInfoDevReq,
    patchDevFilter,
    patchDevInfoFilter,

    assignTechFilter,
    ensureTechExists,
    validateProjectPatch
} from "./middlewares";

import{
    createDev,
    createDevInfo,
    viewAllDevs,
    viewDev,
    updateDev,
    updateDevInfo,
    deleteDev,

    createProject,
    viewProject,
    viewAllProjects,
    updateProject,
    deleteProject,
    assignTech,
    deleteTech
} from "./logic";

const app: Application = express();
app.use(express.json());

app.post("/developers", validateDevReq, validateEmailReq, createDev);
app.post("/developers/:id/infos", ensureDevExists, ensureDevInfoIdNotExists, validateDevInfoDevReq, createDevInfo);
app.get("/developers", viewAllDevs);
app.get("/developers/:id", ensureDevExists, viewDev);
app.patch("/developers/:id", ensureDevExists, patchDevFilter, validateEmailReq, updateDev);
app.patch("/developers/:id/infos", ensureDevExists, ensureDevInfoIdNotExists, patchDevInfoFilter,  updateDevInfo);
app.delete("/developers/:id", ensureDevExists, deleteDev);

app.post("/projects", ensureProjectDevExists, validateProjectReq, projectFilter, createProject);
app.get("/projects", viewAllProjects); 
app.get("/projects/:id", ensureProjectExists, viewProject);
app.patch("/projects/:id", ensureProjectExists, projectFilter, validateProjectPatch, updateProject);
app.delete("/projects/:id", ensureProjectExists, deleteProject);

app.post("/projects/:id/technologies",  ensureDevExists, assignTechFilter, assignTech);
app.delete("/projects/:id/technologies/:name", ensureProjectExists, ensureTechExists, deleteTech);

const PORT: number = 3000;
const runningMsg: string = `Server is running on ${PORT}!`;
app.listen(PORT, async()=>{
    console.log(`${runningMsg}`);
    await startDatabase()
});