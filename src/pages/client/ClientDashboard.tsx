import { useEffect, useMemo, useState } from "react";
import { Calendar, ShoppingBag, Dog, Scissors } from "lucide-react";
import {
  displayOrderStatus,
  formatDatePt,
  formatTimeFromIso,
  getAppointments,
  getOrders,
  getPets,
  getProfile,
  toNumber,
  type Appointment,
  type Order,
  type Pet,
  type Profile,
} from "../../services/api";

export default function ClientDashboard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    Promise.all([
      getProfile().catch(() => null),
      getPets().then((result) => result.data).catch(() => []),
      getAppointments().then((result) => result.data).catch(() => []),
      getOrders().then((result) => result.data).catch(() => []),
    ]).then(([loadedProfile, loadedPets, loadedAppointments, loadedOrders]) => {
      setProfile(loadedProfile);
      setPets(loadedPets);
      setAppointments(loadedAppointments);
      setOrders(loadedOrders);
    });
  }, []);

  const upcoming = useMemo(() => {
    const now = Date.now();
    return appointments
      .filter((item) => item.status !== "Cancelado" && new Date(item.starts_at).getTime() >= now)
      .sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime())[0];
  }, [appointments]);

  const recentAppointments = appointments.slice(0, 4);
  const lastOrder = orders[0];
  const firstName = profile?.name?.split(" ")[0] ?? "Cliente";
  const petNames = pets.map((pet) => pet.name).slice(0, 2).join(" e ") || "Nenhum pet";

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-[#16a34a] to-[#15803d] rounded-2xl text-white px-5 pt-6 pb-8 md:px-8 md:pt-8 md:pb-10">
        <p className="text-green-200 text-sm font-medium mb-1">Portal do Cliente</p>
        <h1 className="text-2xl md:text-3xl font-bold leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Olá, {firstName}! 🐾
        </h1>
        <p className="text-green-100 mt-2 text-sm md:text-base leading-relaxed">
          Gerencie seus pets, agende serviços e faça compras — tudo em um só lugar.
        </p>
      </div>

      <div>
        <h2 className="text-base font-bold text-[#111827] mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          O que você pode fazer aqui
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {
              label: "Próximo agendamento",
              value: upcoming ? formatTimeFromIso(upcoming.starts_at) : "—",
              sub: upcoming ? `${upcoming.service_name} · ${upcoming.pet_name}` : "Nenhum agendamento",
              icon: Calendar,
              color: "bg-[#dcfce7] text-[#16a34a]",
            },
            {
              label: "Pets cadastrados",
              value: String(pets.length),
              sub: petNames,
              icon: Dog,
              color: "bg-amber-50 text-amber-600",
            },
            {
              label: "Último pedido",
              value: lastOrder ? `#${lastOrder.id}` : "—",
              sub: lastOrder ? displayOrderStatus(lastOrder.status) : "Nenhum pedido",
              icon: ShoppingBag,
              color: "bg-blue-50 text-blue-600",
            },
            {
              label: "Serviços recentes",
              value: String(appointments.length),
              sub: appointments[0] ? `Último: ${formatDatePt(appointments[0].starts_at)}` : "Sem histórico",
              icon: Scissors,
              color: "bg-violet-50 text-violet-600",
            },
          ].map(({ label, value, sub, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-3 md:p-5">
              <div className={`inline-flex p-2 rounded-xl mb-2 ${color}`}>
                <Icon size={16} />
              </div>
              <p className="text-[10px] md:text-xs text-[#9ca3af] mb-0.5 leading-tight">{label}</p>
              <p className="text-lg md:text-xl font-bold text-[#111827] truncate" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {value}
              </p>
              <p className="text-[10px] md:text-xs text-[#9ca3af] mt-0.5 leading-tight truncate">{sub}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-5">
          <h2 className="text-sm font-semibold text-[#111827] mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Meus Pets
          </h2>
          <div className="space-y-3">
            {pets.length === 0 ? (
              <p className="text-sm text-[#9ca3af]">Cadastre seu primeiro pet em Meus Pets.</p>
            ) : (
              pets.map((pet) => (
                <div key={pet.id} className="flex items-center gap-3 p-3 bg-[#f9fafb] rounded-xl">
                  <div className="w-10 h-10 rounded-xl bg-[#f0fdf4] flex items-center justify-center text-xl flex-shrink-0">
                    {pet.species === "Gato" ? "🐱" : "🐶"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#111827] truncate">{pet.name}</p>
                    <p className="text-xs text-[#9ca3af] truncate">{pet.breed || pet.species}</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-[11px] text-[#9ca3af]">Nascimento</p>
                    <p className="text-xs font-medium text-[#374151]">{formatDatePt(pet.birth_date)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-5">
          <h2 className="text-sm font-semibold text-[#111827] mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Agendamentos recentes
          </h2>
          <div className="space-y-3">
            {recentAppointments.length === 0 ? (
              <p className="text-sm text-[#9ca3af]">Nenhum agendamento ainda.</p>
            ) : (
              recentAppointments.map((ag) => (
                <div key={ag.id} className="flex items-center gap-3 p-3 bg-[#f9fafb] rounded-xl">
                  <div className="w-10 h-10 rounded-xl bg-[#dcfce7] flex items-center justify-center flex-shrink-0">
                    <Calendar size={16} className="text-[#16a34a]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#111827] truncate">{ag.service_name}</p>
                    <p className="text-xs text-[#9ca3af]">
                      {ag.pet_name} · {formatDatePt(ag.starts_at)} {formatTimeFromIso(ag.starts_at)}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                      ag.status === "Concluído" ? "bg-gray-100 text-gray-500" : "bg-[#dcfce7] text-[#15803d]"
                    }`}
                  >
                    {ag.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {lastOrder && (
        <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-[#9ca3af]">Último pedido</p>
            <p className="text-sm font-semibold text-[#111827]">#{lastOrder.id} · {displayOrderStatus(lastOrder.status)}</p>
            <p className="text-xs text-[#6b7280] mt-0.5 truncate">{lastOrder.products}</p>
          </div>
          <p className="text-lg font-bold text-[#111827]">R$ {toNumber(lastOrder.total).toFixed(2)}</p>
        </div>
      )}
    </div>
  );
}
