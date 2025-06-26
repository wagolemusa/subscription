const errorMiddleware = (err, req, res, next) =>{
    try{
        let error = { ...err };
        error.massage = err.message;

        console.error(err);

        //Mongoose bad ObjectID
        if(err.name === CastError){
            const message = 'Resource not found';
            error = new Error(message);
            error.statusCode = 404
        }

        // Mongoose validation error
        if(err.name === 'ValidationError'){
            const message = Object.values(err.errors).map(val => val.message);
            error = new Error(message.join(', '));
            error.statusCode = 400
        }

        res.status(error.statusCode || 500).join({ success: false, error: error.message || 'Server Error'})

    }catch(error){
        next(error);
    }
}

export default errorMiddleware;