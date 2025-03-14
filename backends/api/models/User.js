const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    idnumber: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    idcard: {
      data: { type: Buffer, required: true },
      contentType: { type: String, required: true },
    },
    otp: { type: String },
    otpExpiration: { type: Date },
    isVerified: { type: Boolean, default: false },
    role: { type: String, default: "user", enum: ["user"] }, // Ensures role is always "user"
  },
  {
    timestamps: true,
  }
);

// Create a TTL index on otpExpiration field
UserSchema.index({ otpExpiration: 1 }, { expireAfterSeconds: 0 });

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
