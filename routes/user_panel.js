import { Router } from "express";
import db from "../config/db.js";

const router = new Router();

router.get("/", async (req, res) => {
  try {
    const alertMessage = req.query.alert; // Capture the alert message from the query string
    console.log(req.query.userid);
    const userdata = await db.query(
      "SELECT * FROM users WHERE user_id=$1",
      [req.query.userid]
    );
    console.log(userdata.rows);
    res.render("user_panel.ejs", { user: userdata.rows[0], alertMessage }); // Pass the alert message to the EJS template
  } catch (err) {
    console.error("Error fetching user data:", err);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
