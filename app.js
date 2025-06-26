import express from 'express'
import { PORT } from './config/env.js'

import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';
import connectToDatabase from './database/mongodb.js';

const app = express();

app.use('/api/v1/auth', userRouter)
app.use('/api/v1/users', authRouter)
app.use('/api/v1/subscriptions', subscriptionRouter)

app.get("/", (req, res) => {
    res.send("Welcome to Subscription tracker API")
})

 
app.listen(PORT, async() => {
    console.log(`subscription tracker api is running on http://localhost:${PORT}`)
    
    await connectToDatabase()
})

export default app;

// mongodb+srv://refuge:<db_password>@cluster0.weqlan1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0