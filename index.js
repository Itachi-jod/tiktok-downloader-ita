const express = require("express");
const axios = require("axios");
const qs = require("querystring");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Pretty JSON
const pretty = (obj) => JSON.stringify(obj, null, 2);

// Root
app.get("/", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(
    pretty({
      author: "ItachiXD",
      status: "SnapTik Downloader API Running",
      endpoint: "/api/download?url=VIDEO_URL"
    })
  );
});

// Downloader
app.get("/api/download", async (req, res) => {
  const videoUrl = req.query.url;

  if (!videoUrl) {
    return res.status(400).send(
      pretty({
        author: "ItachiXD",
        success: false,
        error: "Missing ?url parameter"
      })
    );
  }

  try {
    const postData = qs.stringify({
      url: videoUrl
    });

    const headers = {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      "Accept": "application/json, text/plain, */*",
      "User-Agent":
        "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36",
      "Origin": "https://snaptik.life",
      "Referer": "https://snaptik.life/",
      "X-Requested-With": "XMLHttpRequest",
      "Cookie":
        "ga=GA1.1.1048259948.1766754162; uid=48691b6bc3a2b568; clickAds=60; ga_HHYEBDOGED=GS2.1.1766754161.1.1.1766754183.0.0.0"
    };

    const apiRes = await axios.post(
      "https://snaptik.life/api/convert",
      postData,
      { headers }
    );

    res.setHeader("Content-Type", "application/json");
    return res.send(
      pretty({
        author: "ItachiXD",
        success: true,
        data: apiRes.data
      })
    );
  } catch (err) {
    console.error("SnapTik Error:", err.response?.data || err.message);

    return res.status(500).send(
      pretty({
        author: "ItachiXD",
        success: false,
        error: "Failed to fetch video",
        details: err.response?.data || err.message
      })
    );
  }
});

module.exports = app;
