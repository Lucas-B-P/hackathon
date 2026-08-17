import { useEffect, useState } from "react";
import { Plus, Clock, DollarSign, X } from "lucide-react";
import { getAdminServices, type AdminService } from "../../services/api";

export default function Servicos() {
  const [modalOpen, setModalOpen] = useState(false);
  const [servicos, setServicos] = useState<AdminService[]>([]);
  useEffect(() => { getAdminServices().then((result) => setServicos(result.data)).catch(() => setServicos([])); }, []);

  return (
    <div className="p-4 md:p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Serviços</h1>
          <p className="text-sm text-[#6b7280]">{servicos.length} serviços cadastrados</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          <Plus size={16} />
          Novo serviço
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {servicos.map(s => (
          <div key={s.id} className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-5 hover:border-[#86efac] hover:shadow-md transition-all cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-[#111827] text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.name}</h3>
                <p className="text-xs text-[#6b7280] mt-0.5">{s.description}</p>
              </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 ml-2 ${s.active ? "bg-[#dcfce7] text-[#15803d]" : "bg-gray-100 text-gray-500"}`}>
                  {s.active ? "Ativo" : "Inativo"}
              </span>
            </div>
            <div className="flex items-center gap-4 mt-4 pt-3 border-t border-[#f3f4f6]">
              <div className="flex items-center gap-1.5 text-xs text-[#6b7280]">
                <Clock size={13} />
                <span>{s.duration_minutes} min</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm font-bold text-[#111827]">
                <DollarSign size={13} className="text-[#16a34a]" />
                <span>R$ {Number(s.price).toFixed(2)}</span>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-[11px] text-[#9ca3af]">Responsável: <span className="text-[#374151]">{s.funcionario}</span></p>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Novo Serviço</h2>
              <button onClick={() => setModalOpen(false)} className="p-1 hover:bg-[#f3f4f6] rounded-lg text-[#9ca3af]"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              {[["Nome do serviço", "text"], ["Descrição", "text"], ["Duração (ex: 1h30)", "text"]].map(([label, type]) => (
                <div key={label}>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">{label}</label>
                  <input type={type} className="w-full px-3 py-2 border border-[#e5e7eb] rounded-xl text-sm outline-none focus:border-[#16a34a]" />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">Preço (R$)</label>
                  <input type="number" className="w-full px-3 py-2 border border-[#e5e7eb] rounded-xl text-sm outline-none focus:border-[#16a34a]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">Funcionário</label>
                  <select className="w-full px-3 py-2 border border-[#e5e7eb] rounded-xl text-sm outline-none focus:border-[#16a34a] text-[#6b7280]">
                    <option>Selecionar</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setModalOpen(false)} className="flex-1 py-2.5 border border-[#e5e7eb] rounded-xl text-sm text-[#374151] hover:bg-[#f3f4f6] transition-colors">Cancelar</button>
              <button onClick={() => setModalOpen(false)} className="flex-1 py-2.5 bg-[#16a34a] text-white rounded-xl text-sm font-semibold hover:bg-[#15803d] transition-colors" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
