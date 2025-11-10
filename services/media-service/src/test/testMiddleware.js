const testAuthMiddleware = (req, res, next) => {
  try {
    const uid = req.headers["x-test-uid"];

    // Validación: si no se envía el UID, bloquea la petición
    if (!uid) {
      console.warn("⚠️ Middleware de prueba: UID no proporcionado");
      return res.status(401).json({
        error: "UID de prueba no proporcionado en el header 'x-test-uid'",
      });
    }

    // Log opcional para depuración
    console.log(`🔑 Middleware de prueba: usuario simulado '${uid}'`);

    // Simular usuario autenticado
    req.user = { uid };

    next();
  } catch (error) {
    console.error("❌ Error en testAuthMiddleware:", error);
    res.status(500).json({ error: "Error interno en middleware de prueba" });
  }
};

module.exports = testAuthMiddleware;
