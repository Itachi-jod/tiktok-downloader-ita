const https = require("https");

module.exports = async (req, res) => {
  // ✅ GET method
  if (req.method !== "GET") {
    res.statusCode = 405;
    return res.end(
      JSON.stringify({ success: false, message: "Only GET allowed" }, null, 2)
    );
  }

  const videoUrl = req.query.url;
  if (!videoUrl) {
    res.statusCode = 400;
    return res.end(
      JSON.stringify({ success: false, message: "Missing ?url parameter" }, null, 2)
    );
  }

  const body = JSON.stringify({ url: videoUrl });

  const options = {
    hostname: "api.taletok.io",
    path: "/tools/download",
    method: "POST", // browser also uses POST internally
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(body),
      "Origin": "https://taletok.io",
      "Referer": "https://taletok.io/",
      "User-Agent":
        "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36",
      "Accept": "application/json"
    }
  };

  const request = https.request(options, response => {
    let raw = "";

    response.on("data", chunk => (raw += chunk));
    response.on("end", () => {
      try {
        const json = JSON.parse(raw);

        if (!json.success || !json.download_url) {
          res.statusCode = 500;
          return res.end(
            JSON.stringify(
              { success: false, message: "Download link not found" },
              null,
              2
            )
          );
        }

        // ✅ FINAL RESPONSE FORMAT
        const output = {
          success: true,
          author: "ItachiXD",
          platform: "TikTok",
          download_url: `https://api.taletok.io${json.download_url}`
        };

        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(output, null, 2)); // ✅ pretty print
      } catch (err) {
        res.statusCode = 500;
        res.end(
          JSON.stringify(
            { success: false, message: "Invalid upstream response" },
            null,
            2
          )
        );
      }
    });
  });

  request.on("error", err => {
    res.statusCode = 500;
    res.end(
      JSON.stringify({ success: false, message: err.message }, null, 2)
    );
  });

  request.write(body);
  request.end();
};
