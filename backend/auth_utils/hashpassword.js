import pool from "../models/database.js";
import bcrypt from "bcryptjs";

//run this once for localdatabase to hash passwords when in backend folder by running "node database/hashpassword.js"

const hashPasswords = async () => {
  try {
    // Fetch all users and their plain-text passwords
    const [users] = await pool.query(
      "SELECT id, username, password FROM user_credentials"
    );

    for (const user of users) {
      // Hash the plain-text password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(user.password, saltRounds);

      // Update the password in the database with the hashed version
      await pool.query(
        "UPDATE user_credentials SET password = ? WHERE id = ?",
        [hashedPassword, user.id]
      );

      console.log(`Updated password for user: ${user.username}`);
    }

    console.log("All passwords have been hashed successfully.");
  } catch (err) {
    console.error("Error hashing passwords:", err);
  } finally {
    pool.end(); // Close the database connection
  }
};

hashPasswords();
