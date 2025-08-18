import { HttpStatus } from "../Enums/enum.js"
import { history } from "../Model/history.js"

export const createHistory = async (collectionName, collectionId, updatedBy, action) => {
    try {
        const result = await history.create({collectionName, collectionId, updatedBy, action})
    } catch (error) {
        next(error)
    }
}


export const getHistory = async (req, res, next) => {
    try {
        const {collectionId, collectionName} = req.query
        console.log('collectionId:', collectionId, 'collectionName:', collectionName )

        if(!collectionId || !collectionName) {
            return res.status(HttpStatus.BAD_REQUEST).json({'message': 'Unable to process history. Collection details are missing!'})
        }

        const collectionHistory = await history.find({
            collectionId: collectionId,
            collectionName: collectionName
        }).populate('updatedBy', 'name emailAddress').sort({createdAt: -1})

        if(collectionHistory.length == 0) {
            return res.status(HttpStatus.BAD_REQUEST).json({'message': "No history found!"})
        }
        res.status(HttpStatus.OK).json(collectionHistory)
    } catch (error) {
        next(error)
    }

}