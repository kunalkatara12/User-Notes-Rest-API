import { Request, Response, NextFunction } from "express";
import User from "../models/User.models";
import Note from "../models/Note.models";
import mongoose, { isValidObjectId } from "mongoose";
import { userSchema } from "../models/User.models";
export const createNote = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // getting  data from req.body
    const { userId, title, content } = req.body;
    // getting user from jwt payload
    // const user = await User.findById(res.locals.jwtPayload.id);
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found in notes.controllers.ts",
      });
    }
    // checking if note already exists
    if (user.notes.find((note) => note.title === title)) {
      return res.status(409).json({
        message: "Note already exists",
      });
    }
    // creating note
    const note = await new Note({
      title,
      content,
      user: userId,
    }).save();
    // adding note to user
    user.notes.push(note);
    await user.save();

    return res.status(200).json({
      message: "Note created successfully",
      note,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error in notes.controllers.ts",
      cause: error.message,
    });
  }
};
export const getAllNotes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const allNotes = await Note.find();

    return res.status(200).json({
      message: "These are the notes",
      allNotes,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error in notes.controllers.ts",
      cause: error.message,
    });
  }
};

export const getAllNotesofUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.body;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        message: "User not found in notes.controllers.ts",
      });
    }

    return res.status(200).json({
      message: "These are the notes",
      note: user.notes,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error in notes.controllers.ts",
      cause: error.message,
    });
  }
};

export const deleteNote = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.body;
    const noteId = req.params.noteId;
    // Validate userId and noteId format before querying the database
    if (!isValidObjectId(userId) || !isValidObjectId(noteId)) {
      return res.status(400).json({
        message: "Invalid userId or noteId format",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User not found",
      });
    }
    // Remove the note from the user's notes array based on the noteId
    user.notes = user.notes.filter((userNote) => userNote.id !== noteId);

    // Save the updated user object after filtering out the note
    await user.save();
    const note = await Note.deleteOne({
      _id: noteId,
    });
    if (note.deletedCount === 0) {
      return res.status(404).json({
        error: true,
        message: "Note not found",
      });
    }

    return res.status(200).json({
      message: "Note deleted successfully",
    });
  } catch (error: any) {
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({
        error: true,
        message: "Invalid userId or noteId",
      });
    }
    console.error("Error occurred:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
      cause: error.message,
    });
  }
};
export const deleteAllNotesofUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.body;
    // Validate userId and noteId format before querying the database
    if (!isValidObjectId(userId)) {
      return res.status(400).json({
        message: "Invalid userId format",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User not found",
      });
    }
    if (user.notes.length === 0) {
      return res.status(404).json({
        error: true,
        message: "User has no notes",
      });
    }
    // Remove the note from the user's notes
    user.notes = [];

    // Save the updated user object after filtering out the note
    await user.save();
    const note = await Note.deleteMany({
      user: userId,
    });
    if (note.deletedCount === 0) {
      return res.status(404).json({
        error: true,
        message: "Note not found",
      });
    }

    return res.status(200).json({
      message: "All Notes deleted successfully",
    });
  } catch (error: any) {
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({
        error: true,
        message: "Invalid userId or noteId",
      });
    }
    console.error("Error occurred:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
      cause: error.message,
    });
  }
};

export const updateNote = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, title, content } = req.body;
    const noteId = req.params.noteId;
    // Validate userId and noteId format before querying the database
    if (!isValidObjectId(userId) || !isValidObjectId(noteId)) {
      return res.status(400).json({
        message: "Invalid userId or noteId format",
      });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    if (!title && !content) {
      return res.status(400).json({
        message: "Please provide title and content to update",
      });
    }
    const userNote = user.notes.find((userNote) => userNote.id === noteId);

    // Find the specific note
    const note = await Note.findById({ _id: noteId, user: userId });
    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    } else if (note.user && note.user.toString() != userId) {
      return res.status(404).json({
        message: "Note not found for the user",
      });
    }

    // Update the note
    note.title = title;
    note.content = content;

    if (userNote) {
      userNote.title = title;
      userNote.content = content;
    }
    // Save the user to persist the changes
    await user.save();
    await note.save();

    return res.status(200).json({
      message: "Note updated successfully",
      note,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error in notes.controllers.ts",
      cause: error.message,
    });
  }
};
