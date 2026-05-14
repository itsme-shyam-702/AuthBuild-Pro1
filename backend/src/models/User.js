const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type:      String,
      required:  [true, "Email is required"],
      unique:    true,
      lowercase: true,
      trim:      true,
    },

    passwordHash: {
      type:   String,
      select: false,  // never returned unless .select("+passwordHash")
    },

    googleId: {
      type:   String,
      sparse: true,   // unique index that allows multiple nulls
    },

    role: {
      type:    String,
      enum:    ["user", "admin", "moderator"],
      default: "user",
    },

    refreshTokens: {
      type:    [String],
      default: [],
      select:  false,  // never returned unless .select("+refreshTokens")
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ refreshTokens: 1 });

module.exports = mongoose.model("User", userSchema);
