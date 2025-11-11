const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const UPSTREAM = "https://comp1640.pythonanywhere.com/api/tiktok";

app.get("/", (req, res) => {
  res.send("TikTok API Proxy is running!");
});

app.get("/download", async (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) {
    return res.status(400).json({ status: "error", message: "Missing ?url= parameter" });
  }

  try {
    const payload = { video_url: videoUrl, video_id: videoUrl };
    const headers = {
      "Accept": "*/*",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "en-US,en;q=0.9",
      "Connection": "keep-alive",
      "Content-Type": "application/json",
      "Origin": "https://tiktokdown.online",
      "Referer": "https://tiktokdown.online/",
      "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36"
    };

    const response = await axios.post(UPSTREAM, payload, { headers });

    // Return full raw Axios response (not just response.data)
    res.json(response);
  } catch (error) {
    console.error("❌ Error fetching TikTok data:", error.message);
    res.status(error.response?.status || 500).json({
      status: "error",
      message: "Upstream API error",
      upstream: error.response?.data || error.message,
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`TikTok API running on port ${PORT}`));
