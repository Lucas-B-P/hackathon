import { useEffect, useState } from "react";
import { Calendar, ShoppingBag, Dog, Scissors } from "lucide-react";
import { getAppointments, getOrders, getPets, getProfile, type Appointment, type Order, type Pet, type Profile } from "../../services/api";

function formatDate(value?: string) { return value ? new Date(value).toLocaleDateString("pt-BR") : "—"; }
function formatAppointment(value?: string) { return value ? new Date(value).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }) : "Nenhum agendamento"; }
function formatTime(value?: string) { return value ? new Date(value).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : "Nenhum"; }

export default function ClientDashboard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    Promise.all([getProfile(), getPets(), getAppointments(), getOrders()]).then(([profileResult, petsResult, appointmentsResult, ordersResult]) => {
      setProfile(profileResult); setPets(petsResult.data); setAppointments(appointmentsResult.data); setOrders(ordersResult.data);
    }).catch(() => undefined);
  }, []);

  const nextAppointment = appointments.find((item) => new Date(item.starts_at) >= new Date()) ?? appointments[0];
  const recentAppointments = appointments.slice(0, 3);
  const lastOrder = orders[0];
  const displayName = profile?.name ?? profile?.nome ?? "";

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#16a34a] to-[#15803d] rounded-2xl p-4 md:p-8 text-white">
        <p className="text-green-200 text-sm font-medium mb-1">Portal do Cliente</p>
        <h1 className="text-3xl font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Olá, {displayName} 🐾</h1>
        <p className="text-green-100 mt-2">Gerencie seus pets, agende serviços e faça compras — tudo em um só lugar.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Próximo agendamento", value: nextAppointment ? formatTime(nextAppointment.starts_at) : "Nenhum", sub: nextAppointment ? `${nextAppointment.service_name} · ${nextAppointment.pet_name}` : "Agende um serviço", icon: Calendar, color: "bg-[#dcfce7] text-[#16a34a]" },
          { label: "Pets cadastrados", value: String(pets.length), sub: pets.map((pet) => pet.name).join(" e ") || "Nenhum pet", icon: Dog, color: "bg-amber-50 text-amber-600" },
          { label: "Último pedido", value: lastOrder ? `#${lastOrder.id}` : "—", sub: lastOrder?.status === "Em preparacao" ? "Em preparação" : lastOrder?.status || "Nenhum pedido", icon: ShoppingBag, color: "bg-blue-50 text-blue-600" },
          { label: "Serviços recentes", value: String(appointments.length), sub: recentAppointments[0] ? `Último: ${formatDate(recentAppointments[0].starts_at)}` : "Nenhum serviço", icon: Scissors, color: "bg-violet-50 text-violet-600" },
        ].map(({ label, value, sub, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-3 md:p-5"><div className={`inline-flex p-2 rounded-xl mb-2 ${color}`}><Icon size={16} /></div><p className="text-[10px] md:text-xs text-[#9ca3af] mb-0.5 leading-tight">{label}</p><p className="text-lg md:text-xl font-bold text-[#111827] truncate" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{value}</p><p className="text-[10px] md:text-xs text-[#9ca3af] mt-0.5 leading-tight truncate">{sub}</p></div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-5"><h2 className="text-sm font-semibold text-[#111827] mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Meus Pets</h2><div className="space-y-3">{pets.map((pet) => <div key={pet.id} className="flex items-center gap-3 p-3 bg-[#f9fafb] rounded-xl"><div className="w-10 h-10 rounded-xl bg-[#f0fdf4] flex items-center justify-center text-xl flex-shrink-0"><Dog size={20} className="text-[#16a34a]" /></div><div className="flex-1 min-w-0"><p className="text-sm font-semibold text-[#111827] truncate">{pet.name}</p><p className="text-xs text-[#9ca3af] truncate">{pet.breed || pet.species}</p></div><div className="flex-shrink-0 text-right"><p className="text-[11px] text-[#9ca3af]">Último atend.</p><p className="text-xs font-medium text-[#374151]">Sem registro</p></div></div>)}</div></div>
        <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-5"><h2 className="text-sm font-semibold text-[#111827] mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Agendamentos recentes</h2><div className="space-y-3">{recentAppointments.map((appointment) => <div key={appointment.id} className="flex items-center gap-3 p-3 bg-[#f9fafb] rounded-xl"><div className="w-10 h-10 rounded-xl bg-[#dcfce7] flex items-center justify-center flex-shrink-0"><Calendar size={16} className="text-[#16a34a]" /></div><div className="flex-1 min-w-0"><p className="text-sm font-semibold text-[#111827] truncate">{appointment.service_name}</p><p className="text-xs text-[#9ca3af]">{appointment.pet_name} · {formatAppointment(appointment.starts_at)}</p></div><span className="text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 bg-[#dcfce7] text-[#15803d]">{appointment.status}</span></div>)}</div></div>
      </div>
    </div>
  );
}
