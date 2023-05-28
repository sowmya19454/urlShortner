const shortid = require("shortid");
const URL = require("../models/Schema");

async function handleGenerateNewShortURL(req, res) {
  const body = req.body;
  if (!body.url) return res.status(400).json({ error: "url is required" });
  const shortID = shortid();
 
  await URL.create({
    alias: shortID,
    url: body.url,
    visitHistory: [],
  });

  return res.json({ id: shortID });
}

async function handleGetAnalytics(req, res) {
  const alias = req.params.alias;
  const result = await URL.findOne({ alias });
  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
}

module.exports = {
    handleGenerateNewShortURL,
    handleGetAnalytics,
  };