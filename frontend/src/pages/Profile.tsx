import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { User, Trash2, KeyRound } from "lucide-react";
import { deleteUser, changePassword, loginUser } from "../api/authservice";

// Tipos de usuario
interface UserProfile {
  uid: string;
  nombre: string;
  documento: string;
  correo: string;
  telefono: string;
  rol: string;
  foto?: string; // opcional
}

export default function Profile() {
  const navigate = useNavigate();
  const { uid: paramUid } = useParams<{ uid: string }>(); // uid recibido por la URL

  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Función para cargar datos de un usuario específico desde backend
  const handleProfile = async (uid: string) => {
    try {
      // Llamamos al backend con el uid (puedes ajustar según tu endpoint)
      // Aquí usamos loginUser como ejemplo si el backend devuelve datos del usuario
      // En producción deberías crear un endpoint GET /users/:uid
      const storedUser = localStorage.getItem("user");
      if (!storedUser) throw new Error("No hay usuario autenticado");

      const currentUser = JSON.parse(storedUser);
      const userResponse = await loginUser({ correo: currentUser.user.email, password: "" });
      
      // Para este ejemplo, asumimos que userResponse.user contiene los datos del usuario
      setUserData({
        uid: userResponse.user.uid,
        nombre: userResponse.user.displayName,
        correo: userResponse.user.email,
        documento: userResponse.user.documento || "",
        telefono: userResponse.user.telefono || "",
        rol: userResponse.user.rol,
        foto: userResponse.user.foto || "https://via.placeholder.com/120?text=Foto+Usuario",
      });

    } catch (error: any) {
      console.error("Error al cargar perfil:", error.response?.data || error.message);
      alert("Error al cargar perfil: " + (error.response?.data?.message || error.message));
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (paramUid) {
      handleProfile(paramUid);
    } else {
      navigate("/dashboard");
    }
  }, [paramUid]);

  const handleDeleteAccount = async () => {
    try {
      if (!userData) return;

      await deleteUser({ correo: userData.correo });
      alert("Cuenta eliminada correctamente.");
      localStorage.removeItem("user");
      navigate("/login");
    } catch (error: any) {
      console.error("Error al eliminar cuenta:", error.response?.data || error.message);
      alert("Error al eliminar cuenta: " + (error.response?.data?.message || error.message));
    }
  };

  const handleResetPassword = async () => {
    try {
      if (!userData) return;

      await changePassword({ correo: userData.correo, oldPassword: "", newPassword: "reset" });
      alert("Se ha enviado un enlace de restablecimiento al correo del usuario.");
    } catch (error: any) {
      console.error("Error al restablecer contraseña:", error.response?.data || error.message);
      alert("Error al restablecer contraseña: " + (error.response?.data?.message || error.message));
    }
  };

  if (loading) return <p>Cargando perfil...</p>;
  if (!userData) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col items-center py-10 px-4">
      <div className="bg-white/90 backdrop-blur-xl shadow-[0_10px_40px_rgb(0,0,0,0.1)] rounded-3xl p-8 w-full max-w-lg text-gray-800">
        {/* Encabezado */}
        <div className="flex flex-col items-center mb-8">
          <img
            src={userData.foto}
            alt="Foto del usuario"
            className="w-32 h-32 rounded-full object-cover border-4 border-orange-400 shadow-lg mb-4"
          />
          <h1 className="text-2xl font-semibold text-gray-900">{userData.nombre}</h1>
          <p className="text-gray-500 text-sm mt-1">Rol: {userData.rol}</p>
        </div>

        {/* Información del usuario */}
        <div className="space-y-4 border-t border-gray-200 pt-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <User className="w-5 h-5 text-orange-500" /> Información del usuario
          </h2>
          <div className="text-sm space-y-1">
            <p><strong>Documento:</strong> {userData.documento}</p>
            <p><strong>Correo:</strong> {userData.correo}</p>
            <p><strong>Teléfono:</strong> {userData.telefono}</p>
          </div>
        </div>

        {/* Botones de acciones */}
        <div className="mt-8 border-t border-gray-200 pt-6 space-y-3">
          <button
            onClick={handleResetPassword}
            className="flex items-center justify-center w-full gap-2 py-3 text-white bg-blue-500 hover:bg-blue-600 rounded-2xl shadow-md transition-all duration-300"
          >
            <KeyRound className="w-5 h-5" />
            Restablecer contraseña
          </button>

          <button
            onClick={handleDeleteAccount}
            className="flex items-center justify-center w-full gap-2 py-3 text-white bg-red-500 hover:bg-red-600 rounded-2xl shadow-md transition-all duration-300"
          >
            <Trash2 className="w-5 h-5" />
            Eliminar cuenta
          </button>
        </div>
      </div>

      <button
        onClick={() => navigate("/dashboard")}
        className="mt-6 text-sm text-blue-600 hover:underline"
      >
        ← Volver al Dashboard
      </button>
    </div>
  );
}
