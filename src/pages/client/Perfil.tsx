import { useState } from "react";
import { User, MapPin, Bell, Lock } from "lucide-react";

const TABS = [
  { id: "dados", label: "Dados pessoais", icon: User },
  { id: "enderecos", label: "Endereços", icon: MapPin },
  { id: "preferencias", label: "Preferências", icon: Bell },
  { id: "seguranca", label: "Segurança", icon: Lock },
];

export default function Perfil() {
  const [tab, setTab] = useState("dados");

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Meu Perfil</h1>
        <p className="text-sm text-[#6b7280]">Gerencie suas informações e preferências</p>
      </div>

      <div className="flex gap-1 bg-[#f3f4f6] rounded-xl p-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 flex-1 py-2 px-3 text-xs font-medium rounded-lg transition-all ${tab === id ? "bg-white text-[#111827] shadow-sm" : "text-[#6b7280]"}`}
          >
            <Icon size={14} />
            <span className="hidden sm:block">{label}</span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-4 md:p-6">
        {tab === "dados" && (
          <div className="space-y-5">
            <div className="flex items-center gap-4 pb-5 border-b border-[#f3f4f6]">
              <div className="w-16 h-16 rounded-full bg-[#16a34a] flex items-center justify-center text-white text-xl font-bold">JC</div>
              <div>
                <p className="font-bold text-[#111827] text-lg" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>João Carlos Ferreira</p>
                <p className="text-sm text-[#6b7280]">Tutor desde jan/2024</p>
              </div>
              <button className="ml-auto text-sm text-[#16a34a] hover:underline font-medium">Alterar foto</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                ["Nome completo", "João Carlos Ferreira"],
                ["CPF", "123.456.789-00"],
                ["Telefone", "(11) 99234-5678"],
                ["E-mail", "joao@email.com"],
                ["Data de nascimento", "15/03/1990"],
              ].map(([l, v]) => (
                <div key={l} className={l === "E-mail" ? "col-span-2" : ""}>
                  <label className="block text-xs font-semibold text-[#374151] mb-1.5">{l}</label>
                  <input defaultValue={v} className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-xl text-sm outline-none focus:border-[#16a34a] transition-colors" />
                </div>
              ))}
            </div>
            <button className="px-5 py-2.5 bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold text-sm rounded-xl transition-colors" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Salvar alterações</button>
          </div>
        )}

        {tab === "enderecos" && (
          <div className="space-y-4">
            <div className="p-4 border border-[#e5e7eb] rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#374151]">Endereço principal</span>
                <span className="text-[10px] bg-[#dcfce7] text-[#15803d] px-2 py-0.5 rounded-full font-medium">Principal</span>
              </div>
              <p className="text-sm text-[#374151]">Rua das Flores, 123 — Apto 42</p>
              <p className="text-xs text-[#9ca3af]">Jardim Paulistano, São Paulo – SP · CEP 01452-000</p>
            </div>
            <button className="w-full py-3 border-2 border-dashed border-[#d1d5db] rounded-xl text-sm text-[#9ca3af] hover:border-[#16a34a] hover:text-[#16a34a] transition-colors">
              + Adicionar endereço
            </button>
          </div>
        )}

        {tab === "preferencias" && (
          <div className="space-y-4">
            {[
              ["Notificações por e-mail", "Agendamentos, promoções e novidades"],
              ["Notificações por SMS", "Confirmações e lembretes"],
              ["Lembretes de agendamento", "24h antes do horário marcado"],
              ["Promoções e ofertas", "Receber ofertas exclusivas"],
            ].map(([label, desc]) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-[#f3f4f6] last:border-0">
                <div>
                  <p className="text-sm font-medium text-[#374151]">{label}</p>
                  <p className="text-xs text-[#9ca3af]">{desc}</p>
                </div>
                <div className="w-10 h-6 bg-[#16a34a] rounded-full relative cursor-pointer flex-shrink-0">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "seguranca" && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Alterar senha</h3>
            {[["Senha atual", "password"], ["Nova senha", "password"], ["Confirmar nova senha", "password"]].map(([l, t]) => (
              <div key={l}>
                <label className="block text-xs font-semibold text-[#374151] mb-1.5">{l}</label>
                <input type={t} placeholder="••••••••" className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-xl text-sm outline-none focus:border-[#16a34a]" />
              </div>
            ))}
            <button className="px-5 py-2.5 bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold text-sm rounded-xl transition-colors" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Alterar senha</button>
          </div>
        )}
      </div>
    </div>
  );
}
