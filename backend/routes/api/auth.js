import express from 'express'
const router = express.Router();
import { check, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { auth } from '../../middleware/auth.js';
import User from '../../models/User.js';

router.get('/', auth, async (req,res)=> {
    try{
        const user = await User.findById(req.user.id).select('-password').populate('bookings')
        const pathsToPopulate = [];
        for (let index = 0; index < user.bookings.length; index++) {
            const moviePath = `bookings.${index}.movie`;
            const theatrePath = `bookings.${index}.theatre`;
            const timingPath = `bookings.${index}.timing`;
            pathsToPopulate.push(moviePath);
            pathsToPopulate.push(theatrePath);
            pathsToPopulate.push(timingPath);
        }
        console.log(pathsToPopulate);
        await user.populate(pathsToPopulate);
          

        console.log("This is user", user);
        res.json(user);
    } catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/',[
    
    check('email','Please include a valid email').isEmail(),
    check('password','Password is required').exists()
], 
async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const { email, password } = req.body;
    try {
        let user = await User.findOne({email});

        if(!user){
            return res.status(400).json({errors: [{msg: 'Invalid Crendentials'}]});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log(user);
        if(!isMatch){
            return res
            .status(400)
            .json({errors: [{msg: 'Invalid Crendentials'}]}); 
        }


        console.log(user);
        //Return jsonwebtoken
        const payload = {
            user:{
                id: user.id,
            }
        }
        console.log(payload);
        jwt.sign(
            payload,
            process.env.jwtSecret,
            { expiresIn:360000},
            (err,token) => {
                if(err)throw err;
                res.json({
                    token,
                    user: {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        avatar: user.avatar,
                        role: user.role,
                        membership: user.membership,
                        membershipExpiryDate: user.membershipExpiryDate,
                        rewardsPoints: user.rewardsPoints,
                        pastMovies: user.pastMovies,
                        bookings: user.bookings,
                        date: user.date
                    },
                });
            }
            );

    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error... ');
    }
})

export default router;
