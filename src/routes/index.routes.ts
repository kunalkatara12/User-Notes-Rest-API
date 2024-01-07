// Here you will write routes for your app


// Import necessary modules
import express, { Request, Response } from "express";
import authRouter from "./auth.routes";
import notesRouter from "./notes.routes";
import searchRouter from "./search.routes";

// Create an instance of the Express router
const appRouter = express.Router();

// Define routes
appRouter.use("/auth", authRouter);
appRouter.use("/notes",notesRouter)
appRouter.use('/search',searchRouter)

// Export the router to be used in other files (e.g., your main app file)
export default appRouter;
