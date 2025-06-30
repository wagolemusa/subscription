import { Router } from  'express'
import authorize from '../middlewares/auth.middleware.js';
import { signIn, signOut, signup } from '../controllers/auth.controller.js';

const authRouter  = Router();

authRouter.post('/sign-up', signup);
authRouter.post('/sign-in', signIn);
authRouter.post('/sign-out', signOut)


export default authRouter;