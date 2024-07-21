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

router.post("/ideas", (req, res, next) => {
  const createdNewIdea = {
    id: null,
    name: req.body.name,
    description: req.body.description,
    weeklyRevenue: Number(req.body.weeklyRevenue),
    numWeeks: Number(req.body.numWeeks),
  };
  const isValidIdea = Object.values(createdNewIdea).every((idea) => {
    const newIdea = new Boolean(idea);
    return newIdea;
  });

  try {
    if (!isValidIdea) {
      return res
        .status(400)
        .json({ error: "new idea cant be created, missing key value pairs" });
    }
    db.addToDatabase(ideas, createdNewIdea);
    res.status(201).json(createdNewIdea);
  } catch (err) {
    console.error("trouble creating new Idea");
    res.status(500).json({ error: "internal server error" });
  }
});

module.exports = router;
