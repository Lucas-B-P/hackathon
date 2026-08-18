import { useState, useRef } from "react";
import { User, MapPin, Bell, Lock, Plus, X, Check, Camera, Upload, Trash2 } from "lucide-react";

const TABS = [
  { id: "dados", label: "Dados pessoais", icon: User },
  { id: "enderecos", label: "Endereços", icon: MapPin },
  { id: "preferencias", label: "Preferências", icon: Bell },
  { id: "seguranca", label: "Segurança", icon: Lock },
];

interface Endereco {
  id: number;
  label: string;
  rua: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  principal: boolean;
}

const initialEnderecos: Endereco[] = [
  {
    id: 1,
    label: "Casa",
    rua: "Rua das Flores, 123 — Apto 42",
    bairro: "Jardim Paulistano",
    cidade: "São Paulo",
    estado: "SP",
    cep: "01452-000",
    principal: true,
  },
];

const emptyEndereco = { label: "", rua: "", bairro: "", cidade: "", estado: "", cep: "" };

export default function Perfil() {
  const [tab, setTab] = useState("dados");
  const [enderecos, setEnderecos] = useState<Endereco[]>(initialEnderecos);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(emptyEndereco);
  const [saved, setSaved] = useState(false);
  const [photoMenu, setPhotoMenu] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      setPhotoPreview(ev.target?.result as string);
      setPhotoMenu(false);
    };
    reader.readAsDataURL(file);
  }

  function handleRemovePhoto() {
    setPhotoPreview(null);
    setPhotoMenu(false);
  }

  function handleAddEndereco() {
    setSaved(true);
    setTimeout(() => {
      const novo: Endereco = {
        id: Date.now(),
        label: form.label || "Endereço",
        rua: form.rua,
        bairro: form.bairro,
        cidade: form.cidade,
        estado: form.estado,
        cep: form.cep,
        principal: false,
      };
      setEnderecos(e => [...e, novo]);
      setSaved(false);
      setAddOpen(false);
      setForm(emptyEndereco);
    }, 1200);
  }

  function setPrincipal(id: number) {
    setEnderecos(e => e.map(en => ({ ...en, principal: en.id === id })));
  }

  function removeEndereco(id: number) {
    setEnderecos(e => e.filter(en => en.id !== id));
  }

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
              {/* Avatar with change photo menu */}
              <div className="relative flex-shrink-0">
                {photoPreview ? (
                  <img src={photoPreview} alt="Foto de perfil" className="w-16 h-16 rounded-full object-cover border-2 border-[#86efac]" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-[#16a34a] flex items-center justify-center text-white text-xl font-bold">JC</div>
                )}
                <button
                  onClick={() => setPhotoMenu(o => !o)}
                  className="absolute -bottom-1 -right-1 w-6 h-6 bg-white border border-[#e5e7eb] rounded-full flex items-center justify-center shadow-sm hover:bg-[#f3f4f6] transition-colors"
                >
                  <Camera size={12} className="text-[#374151]" />
                </button>

                {photoMenu && (
                  <div className="absolute top-full left-0 mt-2 bg-white rounded-xl border border-[#e5e7eb] shadow-xl z-20 w-48 overflow-hidden">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-[#374151] hover:bg-[#f9fafb] transition-colors"
                    >
                      <Upload size={15} className="text-[#6b7280]" />
                      Enviar foto
                    </button>
                    {photoPreview && (
                      <button
                        onClick={handleRemovePhoto}
                        className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-[#ef4444] hover:bg-red-50 transition-colors border-t border-[#f3f4f6]"
                      >
                        <Trash2 size={15} />
                        Remover foto
                      </button>
                    )}
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              <div>
                <p className="font-bold text-[#111827] text-lg" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>João Carlos Ferreira</p>
                <p className="text-sm text-[#6b7280]">Tutor desde jan/2024</p>
              </div>
              <button
                onClick={() => setPhotoMenu(o => !o)}
                className="ml-auto text-sm text-[#16a34a] hover:underline font-medium"
              >
                Alterar foto
              </button>
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
            {enderecos.map(en => (
              <div key={en.id} className="p-4 border border-[#e5e7eb] rounded-xl">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#374151]">{en.label}</span>
                    {en.principal && (
                      <span className="text-[10px] bg-[#dcfce7] text-[#15803d] px-2 py-0.5 rounded-full font-medium">Principal</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {!en.principal && (
                      <button onClick={() => setPrincipal(en.id)} className="text-xs text-[#16a34a] hover:underline font-medium">
                        Definir principal
                      </button>
                    )}
                    {enderecos.length > 1 && (
                      <button onClick={() => removeEndereco(en.id)} className="p-1 hover:bg-[#f3f4f6] rounded-lg text-[#9ca3af] hover:text-[#ef4444] transition-colors">
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-sm text-[#374151]">{en.rua}</p>
                <p className="text-xs text-[#9ca3af]">{en.bairro}, {en.cidade} – {en.estado} · CEP {en.cep}</p>
              </div>
            ))}
            <button
              onClick={() => setAddOpen(true)}
              className="w-full py-3 border-2 border-dashed border-[#d1d5db] rounded-xl text-sm text-[#9ca3af] hover:border-[#16a34a] hover:text-[#16a34a] transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={15} />
              Adicionar endereço
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

      {/* Add address modal */}
      {addOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-[#f3f4f6]">
              <h2 className="text-lg font-bold text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Novo endereço</h2>
              <button onClick={() => { setAddOpen(false); setForm(emptyEndereco); }} className="p-2 hover:bg-[#f3f4f6] rounded-xl text-[#9ca3af]"><X size={20} /></button>
            </div>

            {saved ? (
              <div className="p-10 flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-[#dcfce7] flex items-center justify-center">
                  <Check size={28} className="text-[#16a34a]" />
                </div>
                <p className="font-semibold text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Endereço salvo!</p>
              </div>
            ) : (
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1.5">Nome / rótulo</label>
                  <input
                    value={form.label}
                    onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
                    placeholder="Ex: Casa, Trabalho..."
                    className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-xl text-sm outline-none focus:border-[#16a34a] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1.5">Rua, número e complemento *</label>
                  <input
                    value={form.rua}
                    onChange={e => setForm(f => ({ ...f, rua: e.target.value }))}
                    placeholder="Ex: Av. Paulista, 1000 — Sala 203"
                    className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-xl text-sm outline-none focus:border-[#16a34a] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1.5">Bairro</label>
                  <input
                    value={form.bairro}
                    onChange={e => setForm(f => ({ ...f, bairro: e.target.value }))}
                    placeholder="Ex: Bela Vista"
                    className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-xl text-sm outline-none focus:border-[#16a34a] transition-colors"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#374151] mb-1.5">Cidade *</label>
                    <input
                      value={form.cidade}
                      onChange={e => setForm(f => ({ ...f, cidade: e.target.value }))}
                      placeholder="São Paulo"
                      className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-xl text-sm outline-none focus:border-[#16a34a] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#374151] mb-1.5">Estado</label>
                    <input
                      value={form.estado}
                      onChange={e => setForm(f => ({ ...f, estado: e.target.value }))}
                      placeholder="SP"
                      maxLength={2}
                      className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-xl text-sm outline-none focus:border-[#16a34a] transition-colors uppercase"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1.5">CEP</label>
                  <input
                    value={form.cep}
                    onChange={e => setForm(f => ({ ...f, cep: e.target.value }))}
                    placeholder="00000-000"
                    className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-xl text-sm outline-none focus:border-[#16a34a] transition-colors"
                  />
                </div>
                <div className="flex gap-3 pt-1">
                  <button
                    onClick={() => { setAddOpen(false); setForm(emptyEndereco); }}
                    className="flex-1 py-2.5 border border-[#e5e7eb] rounded-xl text-sm font-medium text-[#374151] hover:bg-[#f3f4f6] transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleAddEndereco}
                    disabled={!form.rua.trim() || !form.cidade.trim()}
                    className="flex-1 py-2.5 bg-[#16a34a] hover:bg-[#15803d] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    Salvar endereço
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
