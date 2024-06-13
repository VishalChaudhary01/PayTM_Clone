import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
     {
          firstName: {
               type: String, 
               required: true,
          },
          lastName: {
               type: String, 
               required: true,
          },
          username: {
               type: String,
               unique: true,
               trim: true,
               lowercase: true,
               minLength: 3,
               maxLength: 30,
               required: true,
          },
          password: {
               type: String, 
               required: true,
               minLength: 4,
          }
     }
)

const User = mongoose.model('User', userSchema);

export default User;