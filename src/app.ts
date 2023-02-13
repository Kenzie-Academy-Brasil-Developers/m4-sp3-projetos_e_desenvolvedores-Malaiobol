import express, { Application } from "express";
import { startDatabase } from "./database";
import { 
    projectFilter,
    ensureProjectDevExists,
    ensureProjectExists,

    validateDevReq,
    validateEmailReq,
    ensureDevExists,
    validateDevInfoDevReq,
    patchDevFilter,
    patchDevInfoFilter,

    assignTechFilter
} from "./middlewares";


const app: Application = express();
app.use(express.json());

app.post("/developers", validateDevReq, validateEmailReq, createDev);
app.post("/developers/:id/infos", ensureDevExists, validateDevInfoDevReq, createDevInfo);
app.get("/developers", getAllDevs);
app.get("/developers/:id", ensureDevExists, getSpecificDev);
app.patch("/developers/:id", ensureDevExists, patchDevFilter, updateDev);
app.patch("/developers/:id/infos", patchDevInfoFilter, updateDevInfo);
app.delete("/developers/:id", ensureDevExists, deleteDev);

app.post("/projects", ensureProjectDevExists, projectFilter, createProject);
app.get("/projects", getAllProjects); 
app.get("/projects/:id", ensureProjectExists, getSpecificProject);
app.patch("/projects/:id", ensureProjectExists, ensureProjectDevExists, projectFilter, updateProject);
app.delete("/projects/:id", ensureProjectExists, deleteProject);

app.post("/projects/:id/technologies",  assignTechFilter, assignTech);
app.delete("/projects/:id/technologies/:name", deleteTech);

const PORT: number = 3000;
const runningMsg: string = `Server is running on ${PORT}!`;
app.listen(PORT, async()=>{
    console.log(`${runningMsg}`);
    await startDatabase()
});