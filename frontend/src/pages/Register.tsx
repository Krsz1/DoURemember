// src/pages/Register.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Phone, IdCard } from "lucide-react";

// Simulación de una base de datos temporal para validación
const fakeDB = [
  { correo: "doctor@example.com", documento: "123456789" },
  { correo: "cuidador@example.com", documento: "987654321" },
];

// Simulación de envío de correo (mock)
const sendVerificationEmail = async (correo: string): Promise<boolean> => {
  return new Promise((resolve) => {
    console.log(`📧 Enviando correo de verificación a ${correo}...`);
    setTimeout(() => {
      console.log("✅ Correo enviado correctamente (simulado)");
      resolve(true);
    }, 3000); // Simula envío en menos de 5 minutos
  });
};

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    rol: "",
    nombre: "",
    documento: "",
    nombrePaciente: "",
    documentoPaciente: "",
    nombreCuidador: "",
    documentoCuidador: "",
    medicoTratante: "",
    correo: "",
    telefono: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [correoVerificado, setCorreoVerificado] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Función para validar seguridad de contraseña
  const validatePassword = (password: string): boolean => {
    const regex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    return regex.test(password);
  };

  // Validar si el correo o documento ya existen
  const isAlreadyRegistered = (correo: string, documento: string): boolean => {
    return fakeDB.some(
      (user) => user.correo === correo || user.documento === documento
    );
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones principales
    if (!formData.rol) {
      alert("Selecciona un rol.");
      return;
    }

    if (!formData.correo) {
      alert("Ingrese un correo electrónico.");
      return;
    }

    if (isAlreadyRegistered(formData.correo, formData.documento)) {
      alert("El correo o documento ya están registrados.");
      return;
    }

    if (!validatePassword(formData.password)) {
      alert(
        "La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un símbolo."
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    // Validaciones según el rol
    if (formData.rol === "medico") {
      if (!formData.nombre || !formData.documento) {
        alert("Completa nombre y documento del médico.");
        return;
      }
    }

    if (formData.rol === "cuidador") {
      if (!formData.nombrePaciente || !formData.documentoPaciente) {
        alert("Completa nombre y documento del paciente asociado.");
        return;
      }
      if (!formData.nombreCuidador || !formData.documentoCuidador) {
        alert("Completa nombre y documento del cuidador.");
        return;
      }
    }

    // Envío del correo de verificación
    setLoading(true);
    const enviado = await sendVerificationEmail(formData.correo);
    setLoading(false);

    if (enviado) {
      alert("Correo de verificación enviado. Por favor, revisa tu bandeja.");
      setCorreoVerificado(true);

      // Simula que el usuario confirmó el correo
      setTimeout(() => {
        alert("Correo verificado con éxito 🎉");
        // Registro exitoso
        console.log("Usuario registrado:", formData);
        navigate("/dashboard"); // o a la pantalla principal
      }, 4000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-300 via-pink-200 to-yellow-100 px-4">
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_10px_40px_rgb(0,0,0,0.1)] w-full max-w-md p-8 sm:p-10 border border-white/50">
        {/* Encabezado */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800">
            Do<span className="text-orange-500">URemember</span>
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Crea una cuenta y comienza a guardar tus recuerdos ✨
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          {/* Rol */}
          <div className="relative">
            <select
              name="rol"
              value={formData.rol}
              onChange={handleChange}
              required
              className="w-full pl-4 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition-all duration-300"
            >
              <option value="">Selecciona tu rol</option>
              <option value="medico">Médico</option>
              <option value="cuidador">Paciente/Cuidador</option>
            </select>
          </div>

          {/* Campos dinámicos */}
          {formData.rol === "medico" && (
            <>
              <div className="relative">
                <User className="absolute left-4 top-3.5 text-gray-400" size={18} />
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre completo"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none text-gray-700 transition-all duration-300"
                />
              </div>
              <div className="relative">
                <IdCard className="absolute left-4 top-3.5 text-gray-400" size={18} />
                <input
                  type="text"
                  name="documento"
                  placeholder="Documento de identidad"
                  value={formData.documento}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none text-gray-700 transition-all duration-300"
                />
              </div>
            </>
          )}

          {formData.rol === "cuidador" && (
            <>
              <div className="relative">
                <User className="absolute left-4 top-3.5 text-gray-400" size={18} />
                <input
                  type="text"
                  name="nombrePaciente"
                  placeholder="Nombre del paciente"
                  value={formData.nombrePaciente}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none text-gray-700 transition-all duration-300"
                />
              </div>
              <div className="relative">
                <IdCard className="absolute left-4 top-3.5 text-gray-400" size={18} />
                <input
                  type="text"
                  name="documentoPaciente"
                  placeholder="Documento del paciente"
                  value={formData.documentoPaciente}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none text-gray-700 transition-all duration-300"
                />
              </div>
              <div className="relative">
                <User className="absolute left-4 top-3.5 text-gray-400" size={18} />
                <input
                  type="text"
                  name="nombreCuidador"
                  placeholder="Nombre del cuidador"
                  value={formData.nombreCuidador}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none text-gray-700 transition-all duration-300"
                />
              </div>
              <div className="relative">
                <IdCard className="absolute left-4 top-3.5 text-gray-400" size={18} />
                <input
                  type="text"
                  name="documentoCuidador"
                  placeholder="Documento del cuidador"
                  value={formData.documentoCuidador}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none text-gray-700 transition-all duration-300"
                />
              </div>
            </>
          )}

          {/* Correo, Teléfono y Contraseña */}
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 text-gray-400" size={18} />
            <input
              type="email"
              name="correo"
              placeholder="Correo electrónico"
              value={formData.correo}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200"
            />
          </div>

          <div className="relative">
            <Phone className="absolute left-4 top-3.5 text-gray-400" size={18} />
            <input
              type="tel"
              name="telefono"
              placeholder="Teléfono"
              value={formData.telefono}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-3.5 text-gray-400" size={18} />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-3.5 text-gray-400" size={18} />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirmar contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 mt-2 rounded-xl font-semibold text-white text-lg ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-orange-400 via-pink-500 to-red-400 hover:shadow-lg"
            } transition-all duration-300`}
          >
            {loading ? "Enviando correo..." : "Crear cuenta"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-8 text-sm">
          ¿Ya tienes cuenta?{" "}
          <Link
            to="/"
            className="text-orange-500 font-medium hover:underline hover:text-orange-600 transition"
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
