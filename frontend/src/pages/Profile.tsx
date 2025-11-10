import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Trash2, KeyRound, MailCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext"; // Hook del contexto simulado

export default function Profile() {
  const { user } = useAuth(); // Usuario autenticado (simulado)
  const navigate = useNavigate();

  // Datos simulados
  const [patient] = useState({
    nombre: "Ana María López",
    documento: "1023456789",
    correo: "ana.lopez@example.com",
    telefono: "3104567890",
    foto: "https://via.placeholder.com/120?text=Foto+Paciente",
  });

  const [caregiver] = useState({
    nombre: "Carlos Jiménez",
    documento: "1098765432",
    correo: "carlos.jimenez@example.com",
    telefono: "3112345678",
  });

  // Estado para restablecer contraseña
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" | "" }>({
    text: "",
    type: "",
  });

  const handlePasswordChange = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage({ text: "Por favor completa todos los campos.", type: "error" });
      return;
    }

    // Simulación de validación (contraseña actual simulada: 12345)
    if (currentPassword !== "12345") {
      setMessage({ text: "La contraseña actual no es correcta.", type: "error" });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ text: "Las contraseñas nuevas no coinciden.", type: "error" });
      return;
    }

    // Simulación de éxito
    setMessage({ text: "Contraseña actualizada correctamente.", type: "success" });

    // Simular envío de correo
    setTimeout(() => {
      alert("📧 Se ha enviado un correo de confirmación del cambio de contraseña.");
    }, 500);

    // Limpiar campos
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleDeleteAccount = () => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer."
    );
    if (confirmDelete) {
      alert("Función de eliminación de cuenta pendiente de integración backend.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col items-center py-10 px-4">
      {/* Tarjeta principal */}
      <div className="bg-white/90 backdrop-blur-xl shadow-[0_10px_40px_rgb(0,0,0,0.1)] rounded-3xl p-8 w-full max-w-lg text-gray-800">
        {/* Encabezado */}
        <div className="flex flex-col items-center mb-8">
          <img
            src={patient.foto}
            alt="Foto del paciente"
            className="w-32 h-32 rounded-full object-cover border-4 border-orange-400 shadow-lg mb-4"
          />
          <h1 className="text-2xl font-semibold text-gray-900">{patient.nombre}</h1>
          <p className="text-gray-500 text-sm mt-1">
            Paciente registrada por: {caregiver.nombre}
          </p>
        </div>

        {/* Información del paciente */}
        <div className="space-y-4 border-t border-gray-200 pt-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <User className="w-5 h-5 text-orange-500" /> Información del paciente
          </h2>
          <div className="text-sm space-y-1">
            <p><strong>Documento:</strong> {patient.documento}</p>
            <p><strong>Correo:</strong> {patient.correo}</p>
            <p><strong>Teléfono:</strong> {patient.telefono}</p>
          </div>
        </div>

        {/* Información del cuidador */}
        <div className="space-y-4 border-t border-gray-200 pt-4 mt-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <User className="w-5 h-5 text-pink-500" /> Información del cuidador
          </h2>
          <div className="text-sm space-y-1">
            <p><strong>Nombre:</strong> {caregiver.nombre}</p>
            <p><strong>Documento:</strong> {caregiver.documento}</p>
            <p><strong>Correo:</strong> {caregiver.correo}</p>
            <p><strong>Teléfono:</strong> {caregiver.telefono}</p>
          </div>
        </div>

        {/* Sección de cambio de contraseña */}
        <div className="border-t border-gray-200 pt-6 mt-8">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
            <KeyRound className="w-5 h-5 text-blue-500" /> Cambiar contraseña
          </h2>
          <div className="flex flex-col space-y-3">
            <input
              type="password"
              placeholder="Contraseña actual"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="password"
              placeholder="Nueva contraseña"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="password"
              placeholder="Confirmar nueva contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <button
              onClick={handlePasswordChange}
              className="flex items-center justify-center gap-2 py-3 text-white bg-blue-500 hover:bg-blue-600 rounded-2xl shadow-md transition-all duration-300"
            >
              <MailCheck className="w-5 h-5" />
              Actualizar contraseña
            </button>

            {message.text && (
              <p
                className={`text-sm mt-2 ${
                  message.type === "error" ? "text-red-500" : "text-green-600"
                }`}
              >
                {message.text}
              </p>
            )}
          </div>
        </div>

        {/* Eliminar cuenta */}
        <div className="mt-8 border-t border-gray-200 pt-6 space-y-3">
          <button
            onClick={handleDeleteAccount}
            className="flex items-center justify-center w-full gap-2 py-3 text-white bg-red-500 hover:bg-red-600 rounded-2xl shadow-md transition-all duration-300"
          >
            <Trash2 className="w-5 h-5" />
            Eliminar cuenta
          </button>
        </div>
      </div>

      {/* Botón de regreso */}
      <button
        onClick={() => navigate("/dashboard")}
        className="mt-6 text-sm text-blue-600 hover:underline"
      >
        ← Volver al Dashboard
      </button>
    </div>
  );
}
