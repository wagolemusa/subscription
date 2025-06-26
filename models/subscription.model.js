import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Subscription name is required'],
        trim: true,
        minLength: 2,
        maxLength: 100,
    },

    price: {
        type: Number,
        required: [true, "Subsciption price is requitred"],
        min: [0, "Please must be greater than 0"]
    },
    currency: {
        type: String,
    },
    frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly']
    },
    category: {
        type: String,
        enum: ['sports', 'news', 'entertaiment', 'lifestyle', 'technology', 'finance', 'politics', 'others'],
    },
    paymentMethod:{
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['active', 'cancelled', 'expired'],
        default: 'active'
    },
    startDate: {
        type: Date,
        required: true,
        validate: {
            validator: (value) => value <= new Date(),
            massage: 'Start Date must be in past'
        }
    },
    renewalDate: { 
        type: Date,
        validate: {
            validator: function(value){
                return value > this.startDate;
            },
            massage: 'Renewal data must be after the start date'
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,

    }

}, { timestamps: true})

    // Auto-calculate renewal date if missing
    subscriptionSchema.pre('save', function (next){
        if(!this.renewalDate){
            const renewalPeriods = {
                daily: 1,
                weekly: 7,
                monthly: 30,
                yearly: 365,
            };
            this.renewalDate = new Date(this.startDate);
            this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
        }

        // Auto-update the status if renewal date has passed
        if(this.renewalDate < new Date()){
            this.status = 'expired';
        }
        next();
    })
const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;






