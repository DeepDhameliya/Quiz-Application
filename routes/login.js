import { Router } from "express";
import bcrypt from "bcrypt";
import db from "../config/db.js";

const router = new Router();

router.get("/", async (req, res) => {
  const alertMessage = req.query.alert;
  res.render("login.ejs", { alertMessage });
});

router.post("/", async (req, res) => {
  try {
    if (
      req.body.password == process.env.ADMIN_PASS &&
      req.body.email == process.env.ADMIN_EMAIL
    ) {
      res.redirect(`/admin_panel?alert=Welcome ADMIN`);
    } else {
      // Retrieve the user information, including the hashed password
      const userResult = await db.query("SELECT user_id, password FROM users WHERE email=$1", [
        req.body.email,
      ]);

      if (userResult.rows.length > 0) {
        const user = userResult.rows[0];

        // Compare the provided password with the stored hashed password
        const passwordMatch = await bcrypt.compare(req.body.password, user.password);

        if (passwordMatch) {
          // Password is correct
          res.redirect(`/user_panel?userid=${user.user_id}`);
        } else {
          // Password is incorrect
          res.redirect(`/?alert=Incorrect password, please try again`);
        }
      } else {
        // User not found
        res.redirect(`/?alert=User not found, please register`);
      }
    }
  } catch (err) {
    console.error("Error processing login request:", err);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
