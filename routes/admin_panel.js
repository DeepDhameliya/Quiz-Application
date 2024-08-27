import { Router } from "express";
import db from "../config/db.js";

const router = new Router();

router.get("/", async (req, res) => {
  const alertMessage = req.query.alert;
  res.render("admin_panel.ejs", { alertMessage });
});

router.post("/", async (req, res) => {
  try {
    const { question, options, correct_answer } = req.body;

    // Split the options into an array and trim whitespace
    const optionsArray = options.split(',').map(option => option.trim());

    // Split the correct answers into an array and trim whitespace
    const correctAnswersArray = correct_answer.split(',').map(answer => answer.trim());

    // Validate that each correct answer is one of the provided options
    const invalidAnswers = correctAnswersArray.filter(answer => !optionsArray.includes(answer));

    if (invalidAnswers.length > 0) {
      // If any correct answer is not in the options, redirect with an error message
      return res.redirect(`/admin_panel?alert=Question adding unsuccessful, all correct answers must be among the provided options.`);
    }

    // Join the correct answers back into a comma-separated string for storage
    const correctAnswersString = correctAnswersArray.join(',');

    // Proceed with inserting the question if the validation passes
    await db.query(
      "INSERT INTO questions (question, options, correct_answer) VALUES ($1, $2, $3);",
      [question, options, correctAnswersString]
    );

    res.redirect(`/admin_panel?alert=Question added successfully!`);
  } catch (err) {
    console.error("Error adding question:", err);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
