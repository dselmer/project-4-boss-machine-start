const express = require("express");
const { ideas } = require("../message");
const router = express.Router();
const db = require("../db");
const message = require("../message");

router.get("/ideas", (req, res, next) => {
  const allIdeas = db.getAllFromDatabase(ideas);
  try {
    if (!allIdeas || allIdeas.length === 0) {
      return res.status(404).json({ error: "Not Found" });
    }
    res.json(allIdeas);
  } catch (err) {
    console.error("trouble retieving idea", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
