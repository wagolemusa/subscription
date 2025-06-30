import { json } from 'express';
import User from '../models/user.model.js'


// Fetch data in the database.
export const getUsers = async(req, res, next) => {
    try{
        const users = await User.find();
        res.status(200).json({
            success: true,
            data: users
        })
    } catch(error){
        next(error);
    }
}


// Fetch a sigle user
export const getUser = async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id).select('-password');
  
      if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
      }
  
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }


