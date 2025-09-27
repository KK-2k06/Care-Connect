import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
  },
  { timestamps: true }
)

userSchema.methods.verifyPassword = function(plainPassword){
  return bcrypt.compare(plainPassword, this.passwordHash)
}

userSchema.statics.hashPassword = async function(plainPassword){
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(plainPassword, salt)
}

const User = mongoose.model('User', userSchema)
export default User


