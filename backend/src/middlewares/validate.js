export default function validate(schema) {
    return (req, res, next) => {
      try {
        schema.parse({
          body: req.body,
          params: req.params,
          query: req.query,
        });
        next(); // ✅ validation passed
      } catch (err) {
        if (err.errors) {
          // Zod validation error
          return res.status(400).json({
            success: false,
            error: err.errors.map(e => e.message),
          });
        }
        // Other unexpected error
        return res.status(500).json({
          success: false,
          error: err.message || "Validation failed",
        });
      }
    };
  }