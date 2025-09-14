// src/middleware/errorHandler.js
export default function errorHandler(err, req, res, next) {
    console.error("🔥 Error:", err.message);
  
    const status = err.status || 500; // <-- default to 500 if not set
  
    res.status(status).json({
      success: false,
      error: {
        message: err.message || "Server error",
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
      },
    });
  }