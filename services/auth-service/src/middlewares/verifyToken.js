const { admin } = require("../utils/firebaseAdmin");

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No se proporcionó token válido" });
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = await admin.auth().verifyIdToken(token);

    req.user = decodedToken; // Guarda los datos del usuario autenticado
    next();
  } catch (error) {
    console.error("Error verificando token:", error);
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
};

module.exports = verifyToken;
