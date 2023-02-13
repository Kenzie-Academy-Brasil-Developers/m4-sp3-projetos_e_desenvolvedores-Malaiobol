import express, { Application } from "express";
import { startDatabase } from "./database";

const app: Application = express();
app.use(express.json());

const PORT: number = 3000;
const runningMsg: string = `Server is running on ${PORT}!`;
app.listen(PORT, async()=>{
    console.log(`${runningMsg}`);
    await startDatabase()
});