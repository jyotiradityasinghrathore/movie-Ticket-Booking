// users.js
import express from 'express'
import { check, validationResult } from 'express-validator';

const router = express.Router();
import gravatar from 'gravatar';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../models/User.js';




// @route   POST api/users
// @desc    Register user
// @access  Public
router.post('/',[
    check('name','Name is required').not().isEmpty(),
    check('email','Please include a valid email').isEmail(),
    check('password',
    'Please enter a password with 6 or more characters').isLength({min:6})
], 

async (req,res) => {
    const errors = validationResult(req);
    

    const {name, email, password } = req.body;

    try {
        let user = await User.findOne({email});
        console.log(user);

        if(user){
            return res.status(400).json({errors: [{msg: 'User already exists'}]});
        }

        const avatar = gravatar.url(email,{
            s:'200',
            r:'pg',
            d:'mm'
        })

        user = new User({
            name,
            email,
            avatar,
            password
        });
        console.log(user);

        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        await user.save();

        //Return jsonwebtoken
        const payload = {
            user:{
                id: user.id
            }
        }

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

// Premium Member - Buy Subscription
router.put("/get-premium/:id", async (req, res) => {
    const userId = req.params.id
    console.log(userId);

    // Calculate the expiration date, one year from now
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

    try {
        // Update the user's membership status and expiration date
        const updatedUser = await User.findByIdAndUpdate(userId, {
          membership: 'premium',
          membershipExpiryDate: oneYearFromNow
        }, { new: true });
    
        // Respond with success message
        res.status(200).json(updatedUser);
    } catch (error) {
        // Handle errors, such as if the user is not found
        res.status(500).json({ message: 'An error occurred while upgrading membership', error: error });
    }
})

export default router;