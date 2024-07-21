const express = require("express");
const { minions, noMinionsFoundError } = require("../message");
const router = express.Router();
const db = require("../db");
const message = require("../message");

module.exports = router;
