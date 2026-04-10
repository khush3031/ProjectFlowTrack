import mongoose from 'mongoose'

const otpSchema = new mongoose.Schema({
  email: {
    type:     String,
    required: true,
    lowercase: true,
    trim:     true,
    index:    true,
  },
  otpHash: {
    type:     String,
    required: true,
  },
  expiresAt: {
    type:     Date,
    required: true,
    index:    { expires: 0 }, // TTL — mongo auto-removes after expiresAt
  },
  attempts: {
    type:    Number,
    default: 0,
  },
  used: {
    type:    Boolean,
    default: false,
  },
}, { timestamps: true })

export default mongoose.model('OTP', otpSchema)
