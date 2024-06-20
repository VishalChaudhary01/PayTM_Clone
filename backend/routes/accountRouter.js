import express from 'express';
import mongoose from 'mongoose';
import isAuth from '../middlewares/isAuth.js';
import Account from '../model/accountModel.js';

const router = express.Router();

router.get('/balance', isAuth, async (req, res) => {
     const account = await Account.findOne({
          userId: req.userId
     })
     res.json({
          balance: account.balance
     })
})

router.post('/transfer',isAuth, async (req, res) => {
     const session = await mongoose.startSession();
     session.startTransaction();
     const { amount, to } = req.body;

     const account = await Account.findOne({ userId: req.userId }).session(session);

     if (!account || account.balance < amount) {
          await session.abortTransaction();
          session.endSession();
          console.log("Insufficient balance")
          return res.status(400).json({ message: "Insufficient balance" });
     }

     const toAccount = await Account.findOne({ userId: to }).session(session);

     if (!toAccount) {
          await session.abortTransaction();
          session.endSession();
          console.log("Invalid account");
          return res.status(400).json({ message: "Invalid account"})
     }

     await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
     await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);
          
     await session.commitTransaction();
     session.endSession();
     return res.status(200).json({ message: "Transfer successful" });
})

export default router;