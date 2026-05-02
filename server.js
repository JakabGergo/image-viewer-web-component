import express from "express";
import multer from "multer";
import * as Minio from "minio";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

const minio = new Minio.Client({
  endPoint: "localhost",
  port: 9123,
  useSSL: false,
  accessKey: process.env.VITE_MINIO_ACCESS_KEY,
  secretKey: process.env.VITE_MINIO_SECRET_KEY,
});

const BUCKET = process.env.VITE_MINIO_BUCKET;

// CORS for localhost:5173
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

// GET — list all images
app.get("/api/images", async (req, res) => {
  const objects = [];
  const stream = minio.listObjects(BUCKET, "", true);
  stream.on("data", (obj) => objects.push(obj));
  stream.on("end", async () => {
    const images = await Promise.all(
      objects.map(async (obj) => {
        const url = await minio.presignedGetObject(
          BUCKET,
          obj.name,
          24 * 60 * 60,
        );
        return { url, name: obj.name };
      }),
    );
    res.json(images);
  });
  stream.on("error", (err) => res.status(500).json({ error: err.message }));
});

// POST — upload image
app.post("/api/images", upload.single("file"), async (req, res) => {
  const key = `${Date.now()}-${req.file.originalname}`;
  await minio.putObject(BUCKET, key, req.file.buffer, req.file.size, {
    "Content-Type": req.file.mimetype,
  });
  const url = await minio.presignedGetObject(BUCKET, key, 24 * 60 * 60);
  res.json({ url, name: key });
});

// DELETE — delete image
app.delete("/api/images/:key", async (req, res) => {
  await minio.removeObject(BUCKET, req.params.key);
  res.json({ success: true });
});

app.listen(3001, () => console.log("API running on http://localhost:3001"));
