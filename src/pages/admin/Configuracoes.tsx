import { Settings, Bell, Shield, Palette, Store } from "lucide-react";

export default function Configuracoes() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Configurações</h1>
        <p className="text-sm text-[#6b7280]">Preferências e personalização do sistema</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { icon: Store, label: "Dados do Pet Shop", desc: "Nome, logo, endereço e contato", color: "bg-[#dcfce7] text-[#16a34a]" },
          { icon: Bell, label: "Notificações", desc: "Alertas, e-mail e SMS", color: "bg-blue-50 text-blue-600" },
          { icon: Shield, label: "Segurança", desc: "Senha, 2FA e acessos", color: "bg-violet-50 text-violet-600" },
          { icon: Palette, label: "Aparência", desc: "Tema e personalização", color: "bg-amber-50 text-amber-600" },
        ].map(({ icon: Icon, label, desc, color }) => (
          <button key={label} className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-5 text-left hover:border-[#86efac] hover:shadow-md transition-all">
            <div className={`inline-flex p-2.5 rounded-xl mb-3 ${color}`}><Icon size={20} /></div>
            <p className="font-semibold text-[#111827] text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{label}</p>
            <p className="text-xs text-[#9ca3af] mt-0.5">{desc}</p>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-6 space-y-4">
        <h2 className="text-sm font-semibold text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Dados do Pet Shop</h2>
        <div className="grid grid-cols-2 gap-4">
          {[["Nome do estabelecimento", "Patinhas Pet Shop"], ["CNPJ", "34.871.209/0001-55"], ["Telefone", "(11) 3342-8800"], ["E-mail", "contato@patinhaspetshop.com.br"]].map(([l, v]) => (
            <div key={l}>
              <label className="block text-xs font-semibold text-[#374151] mb-1">{l}</label>
              <input defaultValue={v} className="w-full px-3 py-2 border border-[#e5e7eb] rounded-xl text-sm outline-none focus:border-[#16a34a] transition-colors" />
            </div>
          ))}
        </div>
        <button className="px-4 py-2 bg-[#16a34a] hover:bg-[#15803d] text-white text-sm font-semibold rounded-xl transition-colors" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Salvar alterações</button>
      </div>
    </div>
  );
}
