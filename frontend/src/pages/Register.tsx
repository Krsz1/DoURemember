// src/pages/Register.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, User, Phone, IdCard } from "lucide-react";
import {registerUser} from "../api/authservice";

const Register = () => {
  const [formData, setFormData] = useState({
    rol: "",
    // datos cuando el usuario es MEDICO
    nombre: "",
    documento: "",
    // datos cuando el usuario es CUIDADOR (o paciente asociado)
    nombrePaciente: "",
    documentoPaciente: "",
    // cuidador propios
    nombreCuidador: "",
    documentoCuidador: "",
    // opcional
    medicoTratante: "",
    // contacto / auth
    correo: "",
    telefono: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones básicas
    if (!formData.rol) {
      alert("Selecciona un rol.");
      return;
    }

    if (!formData.correo) {
      alert("Ingrese un correo electrónico.");
      return;
    }

    if (!formData.password || !formData.confirmPassword) {
      alert("Ingrese y confirme la contraseña.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    // Validaciones por rol
    if (formData.rol === "medico") {
      if (!formData.nombre || !formData.documento) {
        alert("Completa nombre y documento para el médico.");
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

    // Preparar payload consistente
    const base = {
      rol: formData.rol,
      correo: formData.correo,
      telefono: formData.telefono || null,
    };

    let dataToSend: any = { ...base };

    if (formData.rol === "medico") {
      dataToSend = {
        ...dataToSend,
        tipo: "medico",
        nombre: formData.nombre,
        documento: formData.documento,
        medicoTratante: null,
        nombreCuidador: null,
        documentoCuidador: null,
      };
    } else if (formData.rol === "cuidador") {
      dataToSend = {
        ...dataToSend,
        tipo: "cuidador",
        nombrePaciente: formData.nombrePaciente,
        documentoPaciente: formData.documentoPaciente,
        nombreCuidador: formData.nombreCuidador || null,
        documentoCuidador: formData.documentoCuidador || null,
        medicoTratante: formData.medicoTratante || null,
      };
    } else {
      // por si hay más roles en el futuro
      dataToSend = {
        ...dataToSend,
        tipo: formData.rol,
        medicoTratante: formData.medicoTratante || null,
        nombreCuidador: formData.nombreCuidador || null,
        documentoCuidador: formData.documentoCuidador || null,
      };
    }

  try {
    const result = await registerUser(dataToSend);
    console.log("Usuario registrado:", result);
    alert("Usuario registrado con éxito. Ya puedes iniciar sesión.");

  } catch (error: any) {
    console.error("Error registrando usuario:", error.response?.data || error.message);
    alert("Error al registrar usuario: " + (error.response?.data?.message || error.message));
  }
};

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

        {/* Formulario */}
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

          {/* Campos dinámicos para MEDICO */}
          {formData.rol === "medico" && (
            <>
              {/* Nombre */}
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

              {/* Documento */}
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

          {/* Campos dinámicos para CUIDADOR */}
          {formData.rol === "cuidador" && (
            <>
              {/* Nombre del paciente */}
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

              {/* Documento del paciente */}
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

              {/* Médico tratante (opcional) */}
              <div className="relative">
                <User className="absolute left-4 top-3.5 text-gray-400" size={18} />
                <input
                  type="text"
                  name="medicoTratante"
                  placeholder="Nombre del médico tratante (opcional)"
                  value={formData.medicoTratante}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none text-gray-700 transition-all duration-300"
                />
              </div>

              {/* Nombre del cuidador */}
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

              {/* Documento del cuidador */}
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

          {/* Correo */}
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 text-gray-400" size={18} />
            <input
              type="email"
              name="correo"
              placeholder="Correo electrónico"
              value={formData.correo}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none text-gray-700 transition-all duration-300"
            />
          </div>

          {/* Teléfono */}
          <div className="relative">
            <Phone className="absolute left-4 top-3.5 text-gray-400" size={18} />
            <input
              type="tel"
              name="telefono"
              placeholder="Teléfono"
              value={formData.telefono}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none text-gray-700 transition-all duration-300"
            />
          </div>

          {/* Contraseña */}
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 text-gray-400" size={18} />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none text-gray-700 transition-all duration-300"
            />
          </div>

          {/* Confirmar contraseña */}
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 text-gray-400" size={18} />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirmar contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none text-gray-700 transition-all duration-300"
            />
          </div>

          {/* Botón */}
          <button
            type="submit"
            className="w-full py-3 mt-2 rounded-xl font-semibold text-white text-lg bg-gradient-to-r from-orange-400 via-pink-500 to-red-400 hover:shadow-[0_6px_20px_rgb(251,146,60,0.5)] transform hover:-translate-y-0.5 transition-all duration-300"
          >
            Crear cuenta
          </button>
        </form>

        {/* Enlace de login */}
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
