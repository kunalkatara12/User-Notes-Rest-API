import { Router } from "express";
import {
  authLogin,
  authSignup,
  getAllUsers,
} from "../controllers/auth.controllers";
import {
  loginValidator,
  noteValidator,
  signupValidator,
  validate,
} from "../utils/validators.utils";
import {
  createNote,
  deleteAllNotesofUser,
  deleteNote,
  getAllNotesofUser,
  updateNote,
} from "../controllers/notes.controllers";
import { verifyToken } from "../utils/token_manager.utils";
const authRouter = Router();

// get routes
authRouter.get("/all-users", getAllUsers);
authRouter.get("/all-notes", getAllNotesofUser);

// post routes
authRouter.post("/signup", validate(signupValidator), authSignup);
authRouter.post("/login", validate(loginValidator), authLogin);
authRouter.post(
  "/create-note",
  validate(noteValidator),
  verifyToken,
  createNote
);

//put routes
authRouter.put("/update-note/:noteId", verifyToken, updateNote);
// delete routes
authRouter.delete("/delete-note/:noteId", verifyToken, deleteNote);
authRouter.delete("/delete-all-notes", verifyToken, deleteAllNotesofUser);
export default authRouter;
