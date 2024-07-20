const express = require("express");
const app = express();
const apiRouter = express.Router();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const jsonParser = bodyParser.json();
const db = require("./db");

app.use(bodyParser.json());
app.use(cors());
app.use(morgan("dev"));
app.use("/api", apiRouter);

// /api/minions

apiRouter.get("/minions", (req, res, next) => {
  try {
    const minionsFound = db.getAllFromDatabase();
    if (!minionsFound) {
      res.status(404).json({ message: "no minons found." });
    } else {
      res.status(200).json(minionsFound);
    }
  } catch (error) {
    console.error("Error retrieving minions:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

apiRouter.post("/minions", (req, res, next) => {
  res.send(db.getAllFromDatabase());
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = apiRouter;
