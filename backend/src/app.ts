import cors from "cors";
import { randomUUID } from "node:crypto";
import express, { type NextFunction, type Request, type Response } from "express";
import apiRouter from "./routes/index";
import { sendError, sendSuccess } from "./utils/response";

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN ?? "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

// 1. Beri setiap request id unik dan kirim lewat header X-Request-Id
app.use((req: Request, res: Response, next: NextFunction) => {
  const requestId = randomUUID();
  req.requestId = requestId;
  res.setHeader("X-Request-Id", requestId);
  next();
});

// 2. Tampilkan log setiap request di console beserta id uniknya
app.use((req: Request, res: Response, next: NextFunction) => {
  const startedAt = performance.now();
  res.on("finish", () => {
    const duration = (performance.now() - startedAt).toFixed(1);
    console.log(
      `[${new Date().toISOString()}] [${req.requestId}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration} ms)`,
    );
  });
  next();
});

// CORS global agar frontend lokal (Next.js) bisa mengakses API ini.
// exposedHeaders agar JavaScript di browser bisa membaca X-Request-Id.
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["X-Request-Id"],
  }),
);
app.use(express.json({ limit: "10kb" }));

app.get("/", (_req, res) => {
  sendSuccess(res, null, "Todo App API berjalan");
});

app.use("/api", apiRouter);

// 404 untuk rute yang tidak terdaftar
app.use((req: Request, res: Response) => {
  sendError(res, `Rute ${req.method} ${req.path} tidak ditemukan`, 404);
});

// Error handler global
app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
  // Body JSON yang rusak dari express.json()
  if (typeof err === "object" && err !== null && "type" in err && err.type === "entity.parse.failed") {
    sendError(res, "Body request harus berupa JSON yang valid", 400);
    return;
  }

  console.error(`[${req.requestId}]`, err);
  sendError(res, "Terjadi kesalahan pada server", 500);
});

export default app;
