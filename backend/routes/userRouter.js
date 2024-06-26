import express from 'express';
import zod from 'zod';
import jwt from 'jsonwebtoken';
import User from '../model/userModel.js';
import Account from '../model/accountModel.js'
import isAuth from '../middlewares/isAuth.js';

const router = express.Router();

const signupBody = zod.object({
     username: zod.string().email(),
     firstName: zod.string(),
     lastName: zod.string(),
     password: zod.string(),
})

router.post('/signup', async (req, res) => {
     const { success } = signupBody.safeParse(req.body);
     if (!success) res.status(411).json({ message: "Invalid credentials" });
     
     const existUser = await User.findOne({
          username: req.body.username
     })
     if (existUser) return res.status(411).json({ message: "Email already taken"});

     const user = await User.create({
          username: req.body.username,
          password: req.body.password,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
     })
     const userId = user._id;

     await Account.create({
          userId,
          balance: 1 + Math.random() * 10000
     })

     const token = jwt.sign({
          userId
     }, process.env.JWT_SECRET );

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
     if (!success) return res.status(411).json({ message: "Invalid credentials" })
     
     const user = await User.findOne({ 
          username: req.body.username,
     })
     if (!user) return res.status(404).json({ message: "Invalid credentials"})

     const isMatch = await user.matchPassword(req.body.password);
     if(!isMatch) return res.status(400).json({ message: "Invalid credentials"})

     const token = jwt.sign({
          userId: user._id
     }, process.env.JWT_SECRET);

     res.json({message: "Sign in successfully", token: token })
});


const updateBody = zod.object({
     password: zod.string().optional(),
     firstName: zod.string().optional(),
     lastName: zod.string().optional(),
})

router.put('/', isAuth, async (req, res) => {
     const { firstName, lastName, password } = req.body;
     const { success } = updateBody.safeParse(req.body)
     if (!success) return res.status(411).json({ message: "Error while updating information"})
     
     await User.updateOne({ _id: req.userId }, { firstName, lastName, password });
     res.json({ message: "Updated successfully"})
})


router.get('/bulk', async (req, res) => {
     const filter = req.query.filter || "";
     const users = await User.find({
          $or: [{
               firstName: {
                    "$regex": filter,
                    "$options": "i"
               }
          }, {
               lastName: {
                    "$regex": filter,
                    "$options": "i"
               }
          }]
     })

     res.json({
          users: users.map(user => ({
               username: user.username,
               firstName: user.firstName,
               lastName: user.lastName,
               _id: user._id
          }))
     })
})


export default router;