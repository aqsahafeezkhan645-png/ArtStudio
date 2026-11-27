
import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

async function checkAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const email = "aqsa2514@gmail.com";

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      console.log("ADMIN NOT FOUND in this database.");
      return;
    }

    console.log("Admin found!");
    console.log("Name:", user.name);
    console.log("Email:", user.email);
    console.log("Role:", user.role);
    console.log("Active:", user.isActive);
    console.log("Password hash exists:", Boolean(user.password));
    console.log("Hash format:", user.password?.slice(0, 7));

    // This checks the password hash without displaying your password.
    const password = await import("readline/promises");
    const rl = password.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const enteredPassword = await rl.question(
      "Enter the admin password to verify: "
    );
    rl.close();

    const matches = await bcrypt.compare(
      enteredPassword,
      user.password
    );

    console.log(
      "Password verification:",
      matches ? "SUCCESS" : "FAILED"
    );

  } catch (error) {
    console.error("Check failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

checkAdmin();
