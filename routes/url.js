const express = require("express");
const {
  handleGenerateNewShortURL,handleGetAnalytics,
} = require("../controllers/url");

const router = express.Router();

router.post("/shorturl", handleGenerateNewShortURL);


module.exports = router;