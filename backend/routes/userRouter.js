import express from 'express';
import zod from 'zod';
import jwt from 'jsonwebtoken';
import User from '../model/userModel.js';

const JWT_SECRET = process.env.JWT_SECRET;

const router = express.Router();

const signupBody = zod.object({
     username: zod.string().email(),
     firstName: zod.string(),
     lastName: zod.string(),
     password: zod.string(),
})

router.post('/signup', async (req, res) => {
     const { success } = signupBody.safeParse(req.body);
     if (!success) res.status(411).json({ message: "Email already taken / Incorrect inputs" });
     
     const existUser = await User.findOne({
          username: req.body.username
     })
     if (existUser) return res.status(411).json({ message: "Email already taken / Incorrect inputs"});

     const user = await User.create({
          username: req.body.username,
          password: req.body.password,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
     })
     const userId = user._id;

     const token = jwt.sign({
          userId
     }, JWT_SECRET );

     res.json({
          message: "User created successfully",
          token: token
     })
});


const signinBody = zod.object({
     username: zod.string().email(),
     password: zod.string()
})
router.post('/signin', async (req, res) => {
     const { success } = signinBody.safeParse(req.body);
     if (!success) return res.status(411).json({ message: "Incorrect inputs" })
     
     const user = await User.findOne({ 
          username :req.body.username,
     })

     if (user) {
          const token = jwt.sign({
               userId: user._id
          }, JWT_SECRET);

          res.json({ token: token })
          return;
     }

     res.status(411).json({ 
          message: "Error while logginh in"
     })
});


export default router;