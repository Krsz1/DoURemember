import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login con:", email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-300 via-pink-200 to-yellow-100 px-4">
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_10px_40px_rgb(0,0,0,0.1)] w-full max-w-md p-8 sm:p-10 border border-white/50">
        {/* Logo y encabezado */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800">
            Do<span className="text-orange-500">URemember</span>
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Bienvenido de nuevo — tus recuerdos te esperan 🕊️
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 text-gray-400" size={18} />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none text-gray-700 transition-all duration-300"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-3.5 text-gray-400" size={18} />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none text-gray-700 transition-all duration-300"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-2 rounded-xl font-semibold text-white text-lg bg-gradient-to-r from-orange-400 via-pink-500 to-red-400 hover:shadow-[0_6px_20px_rgb(251,146,60,0.5)] transform hover:-translate-y-0.5 transition-all duration-300"
          >
            Iniciar sesión
          </button>
        </form>

        {/* Enlace de registro */}
        <p className="text-center text-gray-600 mt-8 text-sm">
          ¿No tienes cuenta?{" "}
          <Link
            to="/register"
            className="text-orange-500 font-medium hover:underline hover:text-orange-600 transition"
          >
            Regístrate
          </Link>
        </p>

        {/* Enlace de recuperar clave */}
        <p className="text-center text-gray-600 mt-8 text-sm">
          ¿No recuerdas tu clave?{" "}
          <Link
            to="/"
            className="text-orange-500 font-medium hover:underline hover:text-orange-600 transition"
          >
            Recupera tu clave
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
