const axios = require("axios");

module.exports = async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ success: false, message: "Missing url" });
    }

    const payload = new URLSearchParams();
    payload.append("url", url);

    const response = await axios.post(
      "https://snaptik.life/api/convert",
      payload.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "Accept": "application/json, text/plain, */*",
          "Origin": "https://snaptik.life",
          "Referer": "https://snaptik.life/",
          "User-Agent":
            "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137 Mobile Safari/537.36"
        }
      }
    );

    return res.json({
      author: "ItachiXD",
      success: true,
      data: response.data
    });

  } catch (err) {
    return res.status(500).json({
      author: "ItachiXD",
      success: false,
      error: err.message
    });
  }
};
