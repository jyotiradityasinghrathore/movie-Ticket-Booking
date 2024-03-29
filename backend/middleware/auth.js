import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

export function auth(req,res,next){
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if not token
    if(!token){
        return res.status(401).json({msg:'No token, authentation denied'});
    }

    // Verify token
    try{
        const decoded = jwt.verify(token,process.env.jwtSecret);

        req.user = decoded.user;
        next();

    }catch(err){
        res.status(401).json({msg: 'Token is not valid'});
    }
};


