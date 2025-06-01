export default function handler(req, res) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "APIキーが設定されていません。" });
  }

  res.setHeader("Cache-Control", "public, max-age=3600");
  return res.status(200).json({ key: apiKey });
}
