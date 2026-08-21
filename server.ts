import express from "express";
import path from "path";

const app = express();
const PORT = 3000;

// API health endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Serve static files from root directory
const rootDir = process.cwd();
app.use(express.static(rootDir));

// SPA fallback
app.get("*", (req, res) => {
  if (req.path.startsWith("/studio")) {
    res.sendFile(path.join(rootDir, "studio.html"));
  } else if (req.path.startsWith("/chat")) {
    res.sendFile(path.join(rootDir, "chat.html"));
  } else {
    res.sendFile(path.join(rootDir, "index.html"));
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Notal AI server running on http://0.0.0.0:${PORT}`);
});
