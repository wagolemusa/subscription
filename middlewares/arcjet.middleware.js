// import aj from '../config/arcjet.js';

// const arcjetMiddleware = async (req, res, next) => {
//   try {
//     const decision = await aj.protect(req, { requested: 1 });

//     if(decision.isDenied()) {
//       if(decision.reason.isRateLimit()) return res.status(429).json({ error: 'Rate limit exceeded' });
//       if(decision.reason.isBot()) return res.status(403).json({ error: 'Bot detected' });

//       return res.status(403).json({ error: 'Access denied' });
//     }

//     next();
//   } catch (error) {
//     console.log(`Arcjet Middleware Error: ${error}`);
//     next(error);
//   }
// }

// export default arcjetMiddleware;


import aj from '../config/arcjet.js';

const arcjetMiddleware = async (req, res, next) => {
  try {
    // Create a proper request object for Arcjet
    const request = {
      method: req.method,
      path: req.path,
      headers: req.headers,
      ip: req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    };

    // Debug logging (remove in production)
    console.log(`Processing request from IP: ${request.ip}`);

    const decision = await aj.protect(request, { requested: 1 });

    // Debug logging (remove in production)
    // console.log('Arcjet Decision:', JSON.stringify(decision, null, 2));

    if (decision?.denied) {
    //   console.warn(`Request denied: ${decision.reason}`);
      
      if (decision.reason === 'RATE_LIMIT') {
        return res.status(429).json({ 
          error: 'Rate limit exceeded',
          ...(decision.detail && { detail: decision.detail })
        });
      }
      
      if (decision.reason === 'BOT') {
        return res.status(403).json({ 
          error: 'Bot detected',
          ...(decision.detail && { detail: decision.detail })
        });
      }

      return res.status(403).json({ 
        error: 'Access denied',
        reason: decision.reason,
      });
    }

    next();
  } catch (error) {
    console.error('Arcjet Middleware Error:', error);
    // Fail open or closed based on your security requirements
    // For strict security, deny on error:
    res.status(500).json({ error: 'Security check failed' });
    // Or to allow during errors:
    // next();
  }
};

export default arcjetMiddleware;