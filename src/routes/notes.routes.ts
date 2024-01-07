import { Router } from "express";
import { getAllNotes } from "../controllers/notes.controllers";

const notesRouter = Router();
notesRouter.get("/", getAllNotes);

export default notesRouter;
