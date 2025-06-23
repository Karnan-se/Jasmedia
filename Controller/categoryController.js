import { categoryModel } from "../Model/categoryModel.js"
import { HttpStatus } from "../Enums/enum.js";
import AppError from "../utils/AppError.js";
import { Portfolio } from "../Model/PortFolio.js";
import { checkisRootAdmin } from "./adminController.js";



export const addCategory =async(req, res, next)=>{
    try {
        const requester = req.user
        if(requester.isBlocked) {
            return res.status(HttpStatus.FORBIDDEN).json({ err: "Your account is currently blocked!" });
        }
        
        const {name , createdBy } = req.body
        
        const saveCategory = await categoryModel.create({name , createdBy});
        res.status(HttpStatus.CREATED).json({message : "Category Created SuccessFully" , data : saveCategory})
        
    } catch (error) {
        console.log(error)
        
    }

}

export const getCategory = async(req, res, next)=>{
    try {
        const requester = req.user
        if(requester.isBlocked) {
            return res.status(HttpStatus.FORBIDDEN).json({ err: "Your account is currently blocked!" });
        }
       
        const category = await categoryModel.find().sort({ createdAt: -1 });
        const portfolio = await Portfolio.find();
        const formatedCategory = category.map((cat)=>{
            const matchingPort = portfolio.filter((port)=> port.category.toString() == cat._id.toString()).length
            return {...cat.toObject(), totolPortfolio : matchingPort}
           
        })

        res.status(HttpStatus.OK).json({category : formatedCategory})
        
    } catch (error) {
        console.log(error)
        throw error
        
    }

}

export const updateCategory = async (req, res, next) => {
    try {
        const requester = req.user
        const { name , categoryId} = req.body;

        if(requester.isBlocked) {
            return res.status(HttpStatus.FORBIDDEN).json({ err: "Your account is currently blocked!" });
        }
    
        const isExistingCategory = await categoryModel.findOne({ name, _categoryId: { $ne: categoryId } });
        if (isExistingCategory) {
            throw AppError.validation("Name already exists");
        }

        const updatedCategory = await categoryModel.findByIdAndUpdate(
            categoryId,
            { name },
            { new: true }
        );

        if (!updatedCategory) {
            throw AppError.conflict("Category not found");
        }

        res.status(HttpStatus.OK).json({ message: "Category updated successfully", data: updatedCategory });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const toggleStatus = async(req, res, next)=>{
    try {
        const requester = req.user
        const {categoryId} = req.body;
        
        if(requester.isBlocked) {
            return res.status(HttpStatus.FORBIDDEN).json({ err: "Your account is currently blocked!" });
        }
        if(!requester.role) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: "Oops! You're not allowed to toggle category!" });
        }
        
        const category = await categoryModel.findOne({_id:categoryId})
        category.status = !category.status;
        if(category.status == false){
            const portfolio = await Portfolio.updateMany({category:category._id}, {$set:{status:false}})
            console.log(portfolio, "portfolio blocked")

        }else{
            const portfolio = await Portfolio.updateMany({category:category._id}, {$set:{status:true}})
            console.log(portfolio, "portfolio unblocked")
        }
        
        
        await category.save()
        res.status(HttpStatus.OK).json({message:category.status == false ? "Category Blocked" : "Category Unblocked"})
    } catch (error) {
        throw error;
        
    }
}


