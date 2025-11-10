import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile"; 
import PrivateRoute from "./components/PrivateRoute";
import DoctorDashboard from "./pages/DoctorDashboard";
import JuegoMemoria from "./pages/JuegoMemoria";
import JuegoPalabras from "./pages/JuegoPalabras";
import JuegoDesafioLogica from "./pages/JuegoDesafioLogica";
import Recuerdos from "./pages/Recuerdos"; 
import Recordatorios from "./pages/Recordatorios";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas protegidas */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile /> {/* ✅ Nueva ruta de perfil */}
            </PrivateRoute>
          }
        />
      <Route
          path="/doctor"
          element={
            <PrivateRoute>
              <DoctorDashboard /> {/* ✅ Nueva ruta de perfil */}
            </PrivateRoute>
          }
        />
      <Route
          path="/juegos/memoria"
          element={
            <PrivateRoute>
             <JuegoMemoria />
            </PrivateRoute>
          }
        />
      <Route
          path="/JuegoPalabras"
          element={
            <PrivateRoute>
              <JuegoPalabras /> {/* ✅ Nueva ruta de perfil */}
            </PrivateRoute>
          }
        />
      <Route
          path="/juegos/logica"
          element={
            <PrivateRoute>
              <JuegoDesafioLogica /> {/* ✅ Nueva ruta de perfil */}
            </PrivateRoute>
          }
        />
      <Route
          path="/recuerdos"
          element={
            <PrivateRoute>
              <Recuerdos /> {/* ✅ Nueva ruta de perfil */}
            </PrivateRoute>
          }
        />
      <Route
          path="/recordatorios"
          element={
            <PrivateRoute>
              <Recordatorios /> {/* ✅ Nueva ruta de perfil */}
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

