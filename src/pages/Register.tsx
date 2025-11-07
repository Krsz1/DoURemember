import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, User, Phone, IdCard } from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({
    rol: "",
    nombre: "",
    documento: "",
    correo: "",
    telefono: "",
    password: "",
    confirmPassword: "",
    medicoTratante: "",
    nombreCuidador: "",
    documentoCuidador: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    const dataToSend = {
      ...formData,
      medicoTratante: formData.rol === "medico" ? null : formData.medicoTratante || null,
      nombreCuidador: formData.rol === "cuidador" ? formData.nombreCuidador : null,
      documentoCuidador: formData.rol === "cuidador" ? formData.documentoCuidador : null,
    };

    console.log("Datos de registro:", dataToSend);
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
              <option value="medico">Médico tratante</option>
              <option value="cuidador">Cuidador</option>
            </select>
          </div>

          {/* Campos dinámicos */}
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

          {formData.rol === "cuidador" && (
            <>
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
            to="/login"
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
