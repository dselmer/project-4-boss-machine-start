const express = require("express");
const app = express();
const apiRouter = express.Router();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const jsonParser = bodyParser.json();
const db = require("./db");
const message = require("./message");

app.use(bodyParser.json());
app.use(cors());
app.use(morgan("dev"));
app.use("/api", apiRouter);

// /api/minions

apiRouter.get("/minions", (req, res, next) => {
  try {
    const minionsFound = db.getAllFromDatabase(message.minions);
    if (!minionsFound) {
      res.status(404).json(message.noMinionsFoundError);
    } else {
      res.status(200).json(minionsFound);
    }
  } catch (error) {
    console.error("Error retrieving minions:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

apiRouter.post("/minions", (req, res, next) => {
  const newMinion = db.createMinion();
  db.addToDatabase(message.minions, newMinion);
  res.json(newMinion);
});

apiRouter.get("/minions/:id", (req, res, next) => {
  let minionId = req.params.id;
  const foundMinion = db.getFromDatabaseById(message.minions, minionId);
  if (foundMinion) {
    res.json(foundMinion);
  } else {
    res.status(404).json(message.noMinionsFoundError);
  }
});

apiRouter.put("/minions/:id", (req, res, next) => {
  let minionId = req.params.id;
  const minionToUpdate = db.getFromDatabaseById(message.minions, minionId);
  try {
    if (minionId && minionToUpdate) {
      const updatedMinion = {
        id: minionId,
        name: req.body.name || minionToUpdate.name,
        title: req.body.title || minionToUpdate.title,
        weaknesses: req.body.weaknesses || minionToUpdate.weaknesses,
        salary: Number(req.body.salary) || minionToUpdate.salary,
      };
      db.updateInstanceInDatabase(message.minions, updatedMinion);
      res.json(updatedMinion);
    } else {
      res.status(404).json(message.noMinionsFoundError);
    }
  } catch (error) {
    console.error("There was a problem updating the minion", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = apiRouter;
