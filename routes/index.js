const express = require("express");
const fetch = require("node-fetch");
const darkSkyKey = process.env.darkSkyKey;

const router = express.Router();

// route for Home-Page
router.get("/", (req, res) => {
  res.render("weather");
});

router.post("/weather", async (req, res) => {
  const url = `https://api.darksky.net/forecast/${darkSkyKey}/${
    req.body.latitude
  },${req.body.longitude}?units=auto`;
  const response = await fetch(url);
  const data = await response.json();
  res.json(data.currently);
});


module.exports = router;
