import { Router } from "express";
import db from "../config/db.js";

const router = new Router();

router.get("/", async (req, res) => {
  try {
    const quizData = await db.query("SELECT * FROM questions;");
    console.log(req.query);
    res.render("quiz.ejs", {
      questions: quizData.rows,
      userid: req.query.userid,
    });
  } catch (err) {
    console.error("Error fetching quiz questions:", err);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/", async (req, res) => {
  try {
    console.log(req.body);
    const userid = req.body.userid;
    const userData = req.body;
    delete userData.userid;

    for (const [key, value] of Object.entries(userData)) {
      const query =
        "INSERT INTO user_answers (userid, question, selected_option) VALUES ($1,$2,$3) ON CONFLICT (userid, question) DO UPDATE SET selected_option = $3;";
      const values = [userid, key, value];
      await db.query(query, values);
    }

    const answerData = await db.query(
      `SELECT q.correct_answer, ua.selected_option 
       FROM questions q 
       JOIN user_answers ua ON q.question = ua.question 
       WHERE ua.userid = $1;`,
      [userid]
    );

    const answers = answerData.rows;
    let score = 0;

    // Loop through each answer and check if the selected option matches the correct answer
    answers.forEach((answer) => {
      if (answer.selected_option === answer.correct_answer) {
        score++;
      }
    });

    await db.query("UPDATE users SET score=$1 WHERE user_id=$2;", [
      score,
      userid,
    ]);

    res.redirect(
      `/user_panel?userid=${userid}&alert=Quiz is completed. Thank you for taking the Quiz!!!`
    );
  } catch (err) {
    console.error("Error processing quiz submission:", err);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
