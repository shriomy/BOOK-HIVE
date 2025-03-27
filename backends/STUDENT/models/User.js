const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    idnumber: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    faculty: {
      type: String,
      required: true,
      enum: [
        "Faculty of Computing",
        "Engineering Faculty",
        "Faculty of Humanities and Sciences",
        "Business Faculty",
        "Law Faculty",
        "School of Architecture",
      ],
    },
    idcard: {
      data: { type: Buffer, required: true },
      contentType: { type: String, required: true },
    },
    profilePicture: {
      data: { type: Buffer },
      contentType: { type: String },
    },
    otp: { type: String },
    otpExpiration: { type: Date },
    isVerified: { type: Boolean, default: false },
    role: {
      type: String,
      default: "user",
      enum: [
        "user",
        "teacher",
        "it-student",
        "engineering-student",
        "architecture-student",
        "law-student",
        "business-student",
        "humanities-student",
      ],
    },
  },
  {
    timestamps: true,
  }
);

// Create a TTL index on otpExpiration field
UserSchema.index({ otpExpiration: 1 }, { expireAfterSeconds: 0 });

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;
