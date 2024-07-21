const express = require("express");
const { minions } = require("../message");
const app = express();
const router = express.Router();
const db = require("../db");
const message = require("../message");

//**************** minion api routes ********************************

router.param("id", (req, res, next, id) => {
  req.id = id;
  const foundMinion = db.getFromDatabaseById(message.minions, id);
  if (!foundMinion) {
    return res.status(404).send(message.noMinionsFoundError);
  } else {
    req.minion = foundMinion;
    next();
  }
});

router.get("/minions", (req, res, next) => {
  try {
    const minionsFound = db.getAllFromDatabase(message.minions, req.id);
    if (!minionsFound) {
      res.status(404).json(message.noMinionsFoundError);
    } else {
      res.status(200).send(minionsFound);
    }
  } catch (error) {
    console.error("Error retrieving minions:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/minions", (req, res, next) => {
  const newMinion = db.createMinion();
  db.addToDatabase(message.minions, newMinion);
  res.json(newMinion);
});

router.get("/minions/:id", (req, res, next) => {
  res.json(req.minion);
});

router.put("/minions/:id", (req, res, next) => {
  const minionToUpdate = req.minion;
  try {
    const updatedMinion = {
      id: req.id,
      name: req.body.name || minionToUpdate.name,
      title: req.body.title || minionToUpdate.title,
      weaknesses: req.body.weaknesses || minionToUpdate.weaknesses,
      salary: Number(req.body.salary) || minionToUpdate.salary,
    };
    db.updateInstanceInDatabase(message.minions, updatedMinion);
    res.json(updatedMinion);
  } catch (error) {
    console.error("There was a problem updating the minion", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/minions/:id", (req, res, next) => {
  const deleted = db.deleteFromDatabasebyId(message.minions, req.id);
  if (deleted) {
    res.sendStatus(204); // No Content
  } else {
    res.status(404).json({ error: message.noMinionsFoundError });
  }
});

module.exports = router;
//**************** minion api routes ********************************
