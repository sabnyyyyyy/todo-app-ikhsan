// Menambahkan properti tambahan pada objek Request Express
declare global {
  namespace Express {
    interface Request {
      // Diisi oleh verifyToken setelah token JWT valid
      user?: { id: number };
      // Diisi oleh middleware request id di app.ts
      requestId?: string;
    }
  }
}

export {};
