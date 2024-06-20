import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';


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

// creating our own mongoose function to check the password
userSchema.methods.matchPassword = async function(enterdPassword) {
     return await bcrypt.compare(enterdPassword, this.password)
}

userSchema.pre('save', async function(next)  {
     if (!this.isModified('password')) {
          next()
     }
     const salt = await bcrypt.genSalt(10);
     this.password = await bcrypt.hash(this.password, salt);
})

const User = mongoose.model('User', userSchema);

export default User;