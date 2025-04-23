import { HttpStatus } from "../Enums/enum.js";
import { Feedback } from "../Model/FeedbackModel.js";
import AppError from "../utils/AppError.js";


export const addFeedback = async (req, res, next) => {
  try {
    const { feedback } = req.body;
    if (!feedback) throw AppError.conflict("Error creating the feedback");

    const savedFeedback = await Feedback.create({...feedback});
    return res
      .status(HttpStatus.OK)
      .json({ message: "Feedback created", data: savedFeedback });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const editFeedback = async (req, res, next) => {
  try {
    const { feedback } = req.body;
    if (!feedback || !feedback._id) {
      throw AppError.conflict("No feedback or feedbackId provided");
    }

    const updatedFeedback = await Feedback.findByIdAndUpdate(
      feedback._id,
      { $set: { ...feedback } },
      { new: true }
    );

    if (!updatedFeedback) {
      throw AppError.conflict("Feedback not found");
    }

    res
      .status(HttpStatus.OK)
      .json({ message: "Feedback updated", data: updatedFeedback });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const deleteFeedback = async (req, res, next) => {
  try {
    const { feedbackId } = req.body;

    if (!feedbackId) {
      throw AppError.conflict("Feedback ID is required");
    }

    const result = await Feedback.deleteOne({ _id: feedbackId });

    if (result.deletedCount === 0) {
      throw AppError.conflict("Feedback not found or already deleted");
    }

    return res
      .status(HttpStatus.OK)
      .json({ message: "Feedback deleted", data: result });
  } catch (error) {
    next(error);
  }
};

export const getAllFeedback = async (req, res, next) => {
    try {
      const feedbacks = await Feedback.find().sort({ createdAt: -1 }); 
      return res.status(HttpStatus.OK).json({ message: "All feedback fetched", data: feedbacks });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
