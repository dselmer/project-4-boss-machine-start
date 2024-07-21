const express = require("express");
const app = express();
const minionApiRouter = require("./Routes/minions");
const ideasApiRouter = require("./Routes/ideas");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");

app.use(bodyParser.json());
app.use(cors());
app.use(morgan("dev"));
app.use("/api", minionApiRouter);
app.use("/api", ideasApiRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = minionApiRouter;
