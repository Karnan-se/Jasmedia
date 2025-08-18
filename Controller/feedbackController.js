import { actions, collection, HttpStatus } from "../Enums/enum.js";
import { Feedback } from "../Model/FeedbackModel.js";
import AppError from "../utils/AppError.js";
import { createHistory } from "./historycontroller.js";


export const addFeedback = async (req, res, next) => {
  try {
    const requester = req.user
    const { feedback } = req.body;

    if(requester.isBlocked) {
      return res.status(HttpStatus.FORBIDDEN).json({ message: "Your account is currently blocked!" });
    }
    
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
    const requester = req.user
    const { feedback } = req.body;

    if(requester.isBlocked) {
      return res.status(HttpStatus.FORBIDDEN).json({ message: "Your account is currently blocked!" });
    }

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

    await createHistory(collection.FEEDBACK, updatedFeedback._id, requester.id, actions.UPDATE)
    res.status(HttpStatus.OK).json({ message: "Feedback updated", data: updatedFeedback });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const deleteFeedback = async (req, res, next) => {
  try {
    const requester = req.user
    const { feedbackId } = req.body;

    if(requester.isBlocked) {
      return res.status(HttpStatus.FORBIDDEN).json({ message: "Your account is currently blocked!" });
    }
    if(!requester.role) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: "Oops! You're not allowed to delete feedback!" });
    }

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
      const requester = req.user
      if(requester.isBlocked) {
        return res.status(HttpStatus.FORBIDDEN).json({ message: "Your account is currently blocked!" });
      }
              
      const feedbacks = await Feedback.find().sort({ createdAt: -1 }); 
      return res.status(HttpStatus.OK).json({ message: "All feedback fetched", data: feedbacks });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  export const feedbackToggle = async(req, res, next)=>{
    try {
      const requester = req.user
      const {feedbackId} = req.body;
      
      if(requester.isBlocked) {
        return res.status(HttpStatus.FORBIDDEN).json({ message: "Your account is currently blocked!" });
      }
      if(!requester.role) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: "Oops! You're not allowed to toggle Feedback!" });
      }
          
      if(!feedbackId){
        throw AppError.conflict("feedback Id is required")
      }

      const feedback = await Feedback.findOne({_id:feedbackId})
      if (!feedback) {
          return res.status(HttpStatus.NOT_FOUND).json({ message: "Feedback not found" });
      }
      feedback.status = !feedback.status;
      await feedback.save();

      const actionType = feedback.status ? actions.UNBLOCK : actions.BLOCK;
      await createHistory(collection.FEEDBACK, feedback._id, requester.id, actionType)
      res.status(HttpStatus.OK).json({message : feedback.status == true ? "feedbackunblocked" : "feedbackBlocked"})
    } catch (error) {
      next(error)
    }
  }