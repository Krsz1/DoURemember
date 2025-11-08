import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Trash2 } from "lucide-react";
import { useAuth } from "../context/AuthContext"; // Solo hook del contexto

export default function Profile() {
  const { user } = useAuth(); // Simula el usuario autenticado
  const navigate = useNavigate();

  // Estados temporales (simulados) para datos del paciente y cuidador
  const [patient, setPatient] = useState({
    nombre: "Ana María López",
    documento: "1023456789",
    correo: "ana.lopez@example.com",
    telefono: "3104567890",
    foto: "https://via.placeholder.com/120?text=Foto+Paciente",
  });

  const [caregiver, setCaregiver] = useState({
    nombre: "Carlos Jiménez",
    documento: "1098765432",
    correo: "carlos.jimenez@example.com",
    telefono: "3112345678",
  });

  const handleDeleteAccount = () => {
    // 🚧 Aquí tus compañeros conectarán la función real
    // (eliminar usuario de Firebase y Firestore)
    alert("Función de eliminar cuenta pendiente de integración backend");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col items-center py-10 px-4">
      {/* Contenedor principal */}
      <div className="bg-white/90 backdrop-blur-xl shadow-[0_10px_40px_rgb(0,0,0,0.1)] rounded-3xl p-8 w-full max-w-lg text-gray-800">
        {/* Encabezado */}
        <div className="flex flex-col items-center mb-8">
          <img
            src={patient.foto}
            alt="Foto del paciente"
            className="w-32 h-32 rounded-full object-cover border-4 border-orange-400 shadow-lg mb-4"
          />
          <h1 className="text-2xl font-semibold text-gray-900">
            {patient.nombre}
          </h1>
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

        {/* Botón de eliminar cuenta */}
        <div className="mt-8 border-t border-gray-200 pt-6">
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
