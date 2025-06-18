import { categoryModel } from "../Model/categoryModel"
import { Feedback } from "../Model/FeedbackModel";
import { History } from "../Model/history";
import { Portfolio } from "../Model/PortFolio";

export const createHistory = async(collectionId,   collectionName ,updatedBy ,  action)=>{
    try {
        if(collectionName == "category" ){
            const category = await categoryModel.findById(collectionId);
            const createdBy = category.createdBy ?? null
            const history = await History.create({collectionId, createdBy , collectionName , updatedBy , action })

        }else if(collectionName == "Portfolio"){
            const portfolio = await Portfolio.findById(collectionId);
            const createdBY =  portfolio.createdBy ?? null
            const history = await History.create({collectionId, createdBY , collectionName , updatedBy , action })

        }else if(collectionName == "Feedback"){
            const feedback = await Feedback.findById(collectionId)
            const createdBy = feedback.createdBY ?? null;
            const history= await History.create({collectionId, createdBy , collectionName , updatedBy , action})

        }
        
        
    } catch (error) {
        console.log(error)
        next(error)
        
    }
}