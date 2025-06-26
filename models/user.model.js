import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User name is required'],
        trim: true,
        minLength: 2,
        maxLength: 50,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lawercase: true,
        match: [/\S+\.\S+/, 'please fill a valid email address']
    },

    password: {
        type: String,
        required: [true, 'User Password is required'],
        minLength: 6
    }
}, {timestamps: true});

const User = mongoose.model('User', userSchema)

export default User;