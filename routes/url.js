const express = require("express");
const {
  handleGenerateNewShortURL,handleGetAnalytics,
} = require("../controllers/url");

const router = express.Router();

router.post("/shorten", handleGenerateNewShortURL);

//router.get("/analytics/:shortId", handleGetAnalytics);

module.exports = router;