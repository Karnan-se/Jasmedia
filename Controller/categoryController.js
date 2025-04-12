import { categoryModel } from "../Model/categoryModel.js"
import { HttpStatus } from "../Enums/enum.js";
import AppError from "../utils/AppError.js";


export const addCategory =async(req, res, next)=>{
    try {
        const {name } = req.body
        
        const saveCategory = await categoryModel.create({name});
        res.status(HttpStatus.CREATED).json({message : "Category Created SuccessFully" , data : saveCategory})
        
    } catch (error) {
        console.log(error)
        
    }

}

export const getCategory = async(req, res, next)=>{
    try {
        const category = await categoryModel.find().sort({ createdAt: -1 });
        res.status(HttpStatus.OK).json({category})
        
    } catch (error) {
        console.log(error)
        throw error
        
    }

}

export const updateCategory = async (req, res, next) => {
    try {
        const { name , categoryId} = req.body;
       

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


