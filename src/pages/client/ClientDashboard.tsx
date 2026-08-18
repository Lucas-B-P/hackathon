import { Calendar, ShoppingBag, Dog, Scissors } from "lucide-react";
import { pets, pedidosCliente, agendamentos } from "../../data/mockData";

const myPets = pets.filter(p => p.tutorId === 1);
const nextAg = agendamentos[0];
const TUTOR = "João Carlos";

export default function ClientDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="bg-gradient-to-br from-[#16a34a] to-[#15803d] rounded-2xl text-white px-5 pt-6 pb-8 md:px-8 md:pt-8 md:pb-10">
        <p className="text-green-200 text-sm font-medium mb-1">Portal do Cliente</p>
        <h1 className="text-2xl md:text-3xl font-bold leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Olá, {TUTOR}! 🐾
        </h1>
        <p className="text-green-100 mt-2 text-sm md:text-base leading-relaxed">
          Gerencie seus pets, agende serviços e faça compras — tudo em um só lugar.
        </p>
      </div>

      {/* "O que você pode fazer aqui" */}
      <div>
        <h2 className="text-base font-bold text-[#111827] mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          O que você pode fazer aqui
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Próximo agendamento", value: nextAg.horario, sub: `${nextAg.servico} · ${nextAg.pet}`, icon: Calendar, color: "bg-[#dcfce7] text-[#16a34a]" },
            { label: "Pets cadastrados", value: String(myPets.length), sub: "Thor e Mel", icon: Dog, color: "bg-amber-50 text-amber-600" },
            { label: "Último pedido", value: pedidosCliente[0].id, sub: pedidosCliente[0].status, icon: ShoppingBag, color: "bg-blue-50 text-blue-600" },
            { label: "Serviços recentes", value: "3", sub: "Último: 08/08/2026", icon: Scissors, color: "bg-violet-50 text-violet-600" },
          ].map(({ label, value, sub, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-3 md:p-5">
              <div className={`inline-flex p-2 rounded-xl mb-2 ${color}`}><Icon size={16} /></div>
              <p className="text-[10px] md:text-xs text-[#9ca3af] mb-0.5 leading-tight">{label}</p>
              <p className="text-lg md:text-xl font-bold text-[#111827] truncate" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{value}</p>
              <p className="text-[10px] md:text-xs text-[#9ca3af] mt-0.5 leading-tight truncate">{sub}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* My pets preview */}
        <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-5">
          <h2 className="text-sm font-semibold text-[#111827] mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Meus Pets</h2>
          <div className="space-y-3">
            {myPets.map(pet => (
              <div key={pet.id} className="flex items-center gap-3 p-3 bg-[#f9fafb] rounded-xl">
                <div className="w-10 h-10 rounded-xl bg-[#f0fdf4] flex items-center justify-center text-xl flex-shrink-0">{pet.foto}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#111827] truncate">{pet.nome}</p>
                  <p className="text-xs text-[#9ca3af] truncate">{pet.raca} · {pet.idade}</p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="text-[11px] text-[#9ca3af]">Último atend.</p>
                  <p className="text-xs font-medium text-[#374151]">{pet.ultimoAtendimento}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent appointments */}
        <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-5">
          <h2 className="text-sm font-semibold text-[#111827] mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Agendamentos recentes</h2>
          <div className="space-y-3">
            {agendamentos.filter(a => a.tutor === "João Carlos Ferreira").map(ag => (
              <div key={ag.id} className="flex items-center gap-3 p-3 bg-[#f9fafb] rounded-xl">
                <div className="w-10 h-10 rounded-xl bg-[#dcfce7] flex items-center justify-center flex-shrink-0">
                  <Calendar size={16} className="text-[#16a34a]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#111827] truncate">{ag.servico}</p>
                  <p className="text-xs text-[#9ca3af]">{ag.pet} · {ag.horario}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${ag.status === "Concluído" ? "bg-gray-100 text-gray-500" : "bg-[#dcfce7] text-[#15803d]"}`}>
                  {ag.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
