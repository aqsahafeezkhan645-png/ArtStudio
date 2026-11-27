
import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import readline from "readline";
import { createInterface } from "readline/promises";
import User from "../models/User.js";

// Read a password without displaying its characters.
function readHidden(prompt) {
  return new Promise((resolve, reject) => {
    if (!process.stdin.isTTY) {
      reject(new Error("Please run this script in a terminal."));
      return;
    }

    process.stdout.write(prompt);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding("utf8");

    let password = "";

    const cleanup = () => {
      process.stdin.removeListener("data", onData);
      process.stdin.setRawMode(false);
      process.stdin.pause();
    };

    const onData = (key) => {
      if (key === "\u0003") {
        cleanup();
        process.stdout.write("\nCancelled.\n");
        process.exit(1);
      }

      if (key === "\r" || key === "\n") {
        cleanup();
        process.stdout.write("\n");
        resolve(password);
        return;
      }

      if (key === "\u007f" || key === "\b") {
        password = password.slice(0, -1);
        process.stdout.write("\b \b");
        return;
      }

      if (key >= " " && key !== "\u007f") {
        password += key;
        process.stdout.write("*");
      }
    };

    process.stdin.on("data", onData);
  });
}

async function createAdmin() {
  let rl;

  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from backend/.env");
    }

    if (
      typeof process.env.JWT_SECRET !== "string" ||
      !process.env.JWT_SECRET.trim()
    ) {
      throw new Error("JWT_SECRET is missing from backend/.env");
    }

    rl = createInterface({
      input: process.stdin,
      output: process.stdout
    });

    console.log("\n================================");
    console.log("      ARTSTUDIO ADMIN SETUP");
    console.log("================================\n");

    const name = (await rl.question("Admin full name: ")).trim();
    const email = (await rl.question("Admin email: "))
      .trim()
      .toLowerCase();

    rl.close();
    rl = null;

    if (!name || name.length > 100) {
      throw new Error("Please enter a name between 1 and 100 characters.");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Please enter a valid email address.");
    }

    const password = await readHidden("Create admin password: ");
    const confirmPassword = await readHidden("Confirm admin password: ");

    if (password.length < 8 || password.length > 72) {
      throw new Error("Password must contain 8 to 72 characters.");
    }

    if (password !== confirmPassword) {
      throw new Error("Passwords do not match.");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("\nMongoDB connected successfully!");

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new Error(
        "An account with this email already exists. No account was changed."
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
      isActive: true
    });

    console.log("\n================================");
    console.log("ADMIN ACCOUNT CREATED!");
    console.log("================================");
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Role: admin");
    console.log("\nYou can now use Admin Login.");
    console.log("================================\n");

  } catch (error) {
    console.error("\nAdmin setup failed:", error.message);
    process.exitCode = 1;

  } finally {
    if (rl) rl.close();

    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  }
}

createAdmin();
