import "dotenv/config";
import app from "./app";
import pool from "./config/db";

const PORT = Number(process.env.PORT ?? 5000);

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET belum diisi di file .env");
  process.exit(1);
}

async function start() {
  try {
    const connection = await pool.getConnection();
    connection.release();
    console.log(`Terhubung ke database ${process.env.DB_NAME}`);
  } catch (error) {
    console.error("Gagal terhubung ke database. Pastikan MySQL sudah berjalan dan .env benar.");
    console.error(error);
    process.exit(1);
  }

  app.listen(PORT, (error) => {
    if (error) {
      console.error(`Gagal menjalankan server di port ${PORT}:`, error.message);
      process.exit(1);
    }
    console.log(`Server berjalan di http://localhost:${PORT}`);
  });
}

start();
