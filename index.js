const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Always pretty-print JSON (2 spaces)
app.set("json spaces", 2);

// NEW UPSTREAM from DevTools
const UPSTREAM = "https://tools.xrespond.com/api/social/all/downloader";

// ROOT ENDPOINT
app.get("/", (req, res) => {
  res.json({
    message: "TikTok Downloader API is running!",
    author: "ItachiXD",
    endpoints: ["/api/download?url="]
  });
});

// MAIN API
app.get("/api/download", async (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) {
    return res.status(400).json({
      success: false,
      message: "Missing ?url parameter",
    });
  }

  try {
    const formData = new URLSearchParams();
    formData.append("url", videoUrl);

    const headers = {
      "Accept": "*/*",
      "Origin": "https://downsocial.io",
      "Referer": "https://downsocial.io/",
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
      "Content-Type": "application/x-www-form-urlencoded",
    };

    const response = await axios.post(UPSTREAM, formData, { headers });

    // Fix escaping
    let data = response.data;
    let fixed = JSON.stringify(data).replace(/\\\//g, "/");
    fixed = JSON.parse(fixed);

    res.json({
      success: true,
      source: "Itachi Sensei",
      data: fixed.data || fixed,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Upstream error",
      error: err.response?.data || err.message,
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🔥 TikTok API running on http://localhost:${PORT}`)
);

module.exports = app;
