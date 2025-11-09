// src/pages/DoctorDashboard.tsx
import React, { useState } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Users,
  FileText,
  Stethoscope,
  Clock,
  ChevronRight,
  Bell,
  Plus,
  Mail,
  CheckCircle,
  XCircle,
} from "lucide-react";

type Appointment = {
  id: string;
  time: string;
  patient: string;
  reason: string;
  room?: string;
};

type Patient = {
  id: string;
  name: string;
  age?: number;
  lastVisit: string;
  status: "Estable" | "Seguimiento" | "Crítico";
  avatar?: string;
};

type LabResult = {
  id: string;
  title: string;
  patient: string;
  date: string;
  status: "Nuevo" | "Revisado" | "Urgente";
};

export default function DoctorDashboard() {
  const navigate = useNavigate();

  // Datos simulados
  const [appointments] = useState<Appointment[]>([
    { id: "a1", time: "09:00", patient: "María López", reason: "Control hipertensión", room: "A-12" },
    { id: "a2", time: "10:30", patient: "Carlos Ramírez", reason: "Revisión laboratorios", room: "A-08" },
    { id: "a3", time: "11:15", patient: "Ana Gómez", reason: "Consulta memoria", room: "V-02" },
  ]);

  const [patients] = useState<Patient[]>([
    { id: "p1", name: "María López", age: 72, lastVisit: "2025-11-02", status: "Seguimiento", avatar: "" },
    { id: "p2", name: "Carlos Ramírez", age: 66, lastVisit: "2025-11-05", status: "Estable", avatar: "" },
    { id: "p3", name: "Ana Gómez", age: 80, lastVisit: "2025-10-28", status: "Estable", avatar: "" },
  ]);

  const [labResults] = useState<LabResult[]>([
    { id: "l1", title: "Hemograma completo", patient: "Carlos Ramírez", date: "2025-11-07", status: "Nuevo" },
    { id: "l2", title: "Perfil hepático", patient: "María López", date: "2025-11-06", status: "Revisado" },
    { id: "l3", title: "PCR", patient: "Ana Gómez", date: "2025-11-07", status: "Urgente" },
  ]);

  // acciones (placeholders)
  const handleViewAppointment = (id: string) => {
    // placeholder: tus compañeros reemplazarán con navigation real
    alert(`Abrir cita ${id} — implementación backend pendiente`);
  };

  const handleViewPatient = (id: string) => {
    navigate(`/patient/${id}`); // ruta preparada para integración
  };

  const handleQuickAction = (action: string) => {
    alert(`Acción rápida: ${action} (pendiente de integrar)`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-20">
        <Header />
      </div>

      <main className="flex-1 max-w-6xl mx-auto px-6 py-10 space-y-12">
        {/* Bienvenida — mantiene estética */}
        <section className="bg-gradient-to-r from-blue-500 to-green-400 text-white rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold">Hola 👋 — Bienvenido a DoURemember</h1>
              <p className="text-blue-50 mt-2 text-sm sm:text-base">
                Resumen del día: administra citas, revisa exámenes y gestiona pacientes de forma rápida.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleQuickAction("Nueva cita")}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                aria-label="Crear nueva cita"
              >
                <Plus className="w-4 h-4" /> Nueva cita
              </button>

              <button
                onClick={() => handleQuickAction("Enviar recordatorio")}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                aria-label="Enviar recordatorio"
              >
                <Bell className="w-4 h-4" /> Recordatorio
              </button>
            </div>
          </div>
        </section>

        {/* Resumen del día — cards anchas y con más detalle */}
        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-6">Resumen del día</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-6 flex flex-col justify-between">
              <div className="flex items-center gap-4">
                <Calendar className="text-blue-600 w-9 h-9" />
                <div>
                  <p className="text-sm text-gray-500">Citas de hoy</p>
                  <p className="text-2xl font-semibold text-gray-800"> {appointments.length} </p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4">Próxima: {appointments[0]?.time} • {appointments[0]?.patient}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-6 flex flex-col justify-between">
              <div className="flex items-center gap-4">
                <Users className="text-green-600 w-9 h-9" />
                <div>
                  <p className="text-sm text-gray-500">Pacientes activos</p>
                  <p className="text-2xl font-semibold text-gray-800">{patients.length}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4">Última visita: {patients[0]?.lastVisit}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-6 flex flex-col justify-between">
              <div className="flex items-center gap-4">
                <FileText className="text-yellow-500 w-9 h-9" />
                <div>
                  <p className="text-sm text-gray-500">Historias pendientes</p>
                  <p className="text-2xl font-semibold text-gray-800">4</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4">Pendientes para completar hoy</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-6 flex flex-col justify-between">
              <div className="flex items-center gap-4">
                <Stethoscope className="text-red-500 w-9 h-9" />
                <div>
                  <p className="text-sm text-gray-500">Exámenes por revisar</p>
                  <p className="text-2xl font-semibold text-gray-800">{labResults.filter(r => r.status !== "Revisado").length}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4">Último resultado: {labResults[0]?.title}</p>
            </div>
          </div>
        </section>

        {/* Layout de dos columnas: izquierda (citas + pacientes), derecha (resultados + acciones rápidas) */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna izquierda: Próximas citas */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-slate-500" /> Próximas citas
                </h3>
                <button
                  onClick={() => handleQuickAction("Ver agenda completa")}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Ver agenda
                </button>
              </div>

              <ul className="space-y-3">
                {appointments.map((a) => (
                  <li
                    key={a.id}
                    className="flex items-center justify-between rounded-lg p-3 hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 text-sm text-slate-700 font-semibold">{a.time}</div>
                      <div>
                        <div className="font-medium text-slate-800">{a.patient}</div>
                        <div className="text-xs text-slate-500">{a.reason}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-xs text-slate-500 hidden sm:block">{a.room}</div>
                      <button
                        onClick={() => handleViewAppointment(a.id)}
                        className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                        aria-label={`Ver cita ${a.id}`}
                      >
                        Ver <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pacientes activos — tarjetas horizontales compactas */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Users className="w-5 h-5 text-slate-500" /> Pacientes activos
                </h3>
                <button
                  onClick={() => handleQuickAction("Ver lista completa")}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Ver todos
                </button>
              </div>

              <div className="space-y-3">
                {patients.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between gap-4 p-3 rounded-lg hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-medium">
                        {p.name.split(" ").map(n => n[0]).slice(0,2).join("")}
                      </div>
                      <div>
                        <div className="font-medium text-slate-800">{p.name}</div>
                        <div className="text-xs text-slate-500">Última visita: {p.lastVisit}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          p.status === "Crítico"
                            ? "bg-red-50 text-red-600"
                            : p.status === "Seguimiento"
                            ? "bg-yellow-50 text-yellow-600"
                            : "bg-green-50 text-green-600"
                        }`}
                      >
                        {p.status}
                      </span>
                      <button
                        onClick={() => handleViewPatient(p.id)}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Abrir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Columna derecha: Resultados recientes + acciones rápidas */}
          <aside className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                Resultados recientes
              </h3>

              <ul className="mt-4 space-y-3">
                {labResults.map((r) => (
                  <li key={r.id} className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-medium text-slate-800">{r.title}</div>
                      <div className="text-xs text-slate-500">{r.patient} • {r.date}</div>
                    </div>

                    <div className="flex items-center gap-3">
                      {r.status === "Nuevo" && <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">Nuevo</span>}
                      {r.status === "Revisado" && <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full">Revisado</span>}
                      {r.status === "Urgente" && <span className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-full">Urgente</span>}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                Acciones rápidas
              </h3>

              <div className="mt-4 grid grid-cols-1 gap-3">
                <button
                  onClick={() => handleQuickAction("Crear nota")}
                  className="w-full text-left bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-3 rounded-lg flex items-center gap-3"
                >
                  <FileText className="w-5 h-5" /> Nueva nota médica
                </button>

                <button
                  onClick={() => handleQuickAction("Enviar mensaje")}
                  className="w-full text-left bg-green-50 hover:bg-green-100 text-green-600 px-4 py-3 rounded-lg flex items-center gap-3"
                >
                  <Mail className="w-5 h-5" /> Enviar mensaje a paciente
                </button>

                <button
                  onClick={() => handleQuickAction("Marcar revisado")}
                  className="w-full text-left bg-slate-50 hover:bg-slate-100 text-slate-700 px-4 py-3 rounded-lg flex items-center gap-3"
                >
                  <CheckCircle className="w-5 h-5" /> Marcar resultado como revisado
                </button>
              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
