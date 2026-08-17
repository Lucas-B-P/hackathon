import { useEffect, useState } from "react";
import { Bell, Lock, MapPin, User } from "lucide-react";
import {
  changePassword,
  createAddress,
  deleteAddress,
  getAddresses,
  getInitials,
  getPreferences,
  getProfile,
  updateAddress,
  updatePreferences,
  updateProfile,
  type Address,
  type Preferences,
  type Profile,
} from "../../services/api";

const tabs = [{ id: "dados", label: "Dados pessoais", icon: User }, { id: "enderecos", label: "Endereços", icon: MapPin }, { id: "preferencias", label: "Preferências", icon: Bell }, { id: "seguranca", label: "Segurança", icon: Lock }];
const emptyAddress = { rotulo: "Casa", logradouro: "", numero: "", complemento: "", bairro: "", cidade: "", uf: "", cep: "", principal: false };

export default function Perfil() {
  const [tab, setTab] = useState("dados");
  const [user, setUser] = useState<Profile | null>(null);
  const [personal, setPersonal] = useState({ nome: "", cpf: "", telefone: "", nascimento: "" });
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [form, setForm] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);
  const [address, setAddress] = useState(emptyAddress);
  const [passwords, setPasswords] = useState({ atual: "", nova: "", confirmacao: "" });
  const [passwordMessage, setPasswordMessage] = useState("");
  const [preferences, setPreferences] = useState<Preferences | null>(null);
  const [prefsMessage, setPrefsMessage] = useState("");

  useEffect(() => {
    getProfile()
      .then((profile) => {
        setUser(profile);
        setPersonal({ nome: profile.name ?? "", cpf: profile.cpf ?? "", telefone: profile.phone ?? "", nascimento: profile.birth_date ?? "" });
      })
      .catch(() => undefined);
  }, []);
  useEffect(() => {
    if (tab === "enderecos") getAddresses().then((result) => setAddresses(result.data)).catch(() => setAddresses([]));
    if (tab === "preferencias") getPreferences().then(setPreferences).catch(() => undefined);
  }, [tab]);

  function editAddress(item?: Address) {
    setEditing(item ?? null);
    setAddress(item ? { rotulo: item.label ?? "Casa", logradouro: item.street, numero: item.number, complemento: item.complement ?? "", bairro: item.neighborhood, cidade: item.city, uf: item.state, cep: item.zip_code, principal: item.is_primary } : { ...emptyAddress });
    setForm(true);
  }

  async function saveAddress(event: React.FormEvent) {
    event.preventDefault();
    const saved = editing ? await updateAddress(editing.id, address) : await createAddress(address);
    setAddresses((current) => editing ? current.map((item) => item.id === saved.id ? saved : item) : [...current, saved]);
    setForm(false);
  }

  async function savePersonal(event: React.FormEvent) {
    event.preventDefault();
    const profile = await updateProfile(personal);
    setUser(profile);
  }

  async function savePassword(event: React.FormEvent) {
    event.preventDefault();
    setPasswordMessage("");
    if (passwords.nova.length < 6) return setPasswordMessage("A nova senha precisa ter pelo menos 6 caracteres.");
    if (passwords.nova !== passwords.confirmacao) return setPasswordMessage("A confirmação não confere com a nova senha.");
    try { await changePassword(passwords.atual, passwords.nova); setPasswords({ atual: "", nova: "", confirmacao: "" }); setPasswordMessage("Senha alterada com sucesso."); } catch (error) { setPasswordMessage(error instanceof Error ? error.message : "Não foi possível alterar a senha."); }
  }

  async function savePreferences(event: React.FormEvent) {
    event.preventDefault();
    if (!preferences) return;
    setPrefsMessage("");
    try {
      const saved = await updatePreferences({
        emailNotifications: preferences.email_notifications,
        smsNotifications: preferences.sms_notifications,
        appointmentReminders: preferences.appointment_reminders,
        marketingNotifications: preferences.marketing_notifications,
      });
      setPreferences(saved);
      setPrefsMessage("Preferências salvas com sucesso.");
    } catch (error) {
      setPrefsMessage(error instanceof Error ? error.message : "Não foi possível salvar as preferências.");
    }
  }

  const initials = getInitials(user?.name ?? "Seu nome");
  return <div className="max-w-2xl space-y-6">
    <div><h1 className="text-2xl font-bold text-[#111827]">Meu Perfil</h1><p className="text-sm text-[#6b7280]">Gerencie suas informações e preferências</p></div>
    <div className="flex gap-1 bg-[#f3f4f6] rounded-xl p-1">{tabs.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => setTab(id)} className={`flex items-center gap-2 flex-1 py-2 px-3 text-xs font-medium rounded-lg ${tab === id ? "bg-white text-[#111827] shadow-sm" : "text-[#6b7280]"}`}><Icon size={14} /><span className="hidden sm:block">{label}</span></button>)}</div>
    <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-4 md:p-6">
      {tab === "dados" && <form onSubmit={savePersonal} className="space-y-5"><div className="flex items-center gap-4 pb-5 border-b border-[#f3f4f6]"><div className="w-16 h-16 rounded-full bg-[#16a34a] flex items-center justify-center text-white text-xl font-bold">{initials}</div><div><p className="font-bold text-[#111827] text-lg">{user?.name ?? "Carregando..."}</p><p className="text-sm text-[#6b7280]">{user?.email ?? ""}</p></div></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><label className="block"><span className="block text-xs font-semibold mb-1.5">Nome completo</span><input value={personal.nome} onChange={(e) => setPersonal({ ...personal, nome: e.target.value })} className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-xl text-sm" /></label><label className="block"><span className="block text-xs font-semibold mb-1.5">CPF</span><input value={personal.cpf} onChange={(e) => setPersonal({ ...personal, cpf: e.target.value })} className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-xl text-sm" /></label><label className="block"><span className="block text-xs font-semibold mb-1.5">Telefone</span><input value={personal.telefone} onChange={(e) => setPersonal({ ...personal, telefone: e.target.value })} className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-xl text-sm" /></label><label className="block"><span className="block text-xs font-semibold mb-1.5">E-mail</span><input value={user?.email ?? ""} readOnly className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-xl text-sm bg-[#f9fafb]" /></label><label className="block sm:col-span-2"><span className="block text-xs font-semibold mb-1.5">Data de nascimento</span><input type="date" value={personal.nascimento} onChange={(e) => setPersonal({ ...personal, nascimento: e.target.value })} className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-xl text-sm" /></label></div><button className="px-5 py-2.5 bg-[#16a34a] text-white font-semibold text-sm rounded-xl">Salvar alterações</button></form>}
      {tab === "enderecos" && <div className="space-y-4">{addresses.map((item) => <div key={item.id} className="p-4 border border-[#e5e7eb] rounded-xl"><div className="flex justify-between"><span className="text-xs font-semibold">{item.label || "Endereço"}</span>{item.is_primary && <span className="text-[10px] bg-[#dcfce7] text-[#15803d] px-2 py-0.5 rounded-full">Principal</span>}</div><p className="text-sm mt-2">{item.street}, {item.number}{item.complement ? ` — ${item.complement}` : ""}</p><p className="text-xs text-[#9ca3af]">{item.neighborhood}, {item.city} - {item.state} · CEP {item.zip_code}</p><div className="flex gap-4 mt-3"><button onClick={() => editAddress(item)} className="text-xs text-[#16a34a] font-semibold">Editar</button><button onClick={async () => { await deleteAddress(item.id); setAddresses((current) => current.filter((addressItem) => addressItem.id !== item.id)); }} className="text-xs text-red-500 font-semibold">Remover</button></div></div>)}{form ? <form onSubmit={saveAddress} className="grid grid-cols-2 gap-3 p-4 bg-[#f9fafb] rounded-xl"><input required placeholder="Rua" value={address.logradouro} onChange={(e) => setAddress({ ...address, logradouro: e.target.value })} className="col-span-2 px-3 py-2 border rounded-lg text-sm" /><input required placeholder="Número" value={address.numero} onChange={(e) => setAddress({ ...address, numero: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" /><input placeholder="Complemento" value={address.complemento} onChange={(e) => setAddress({ ...address, complemento: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" /><input required placeholder="Bairro" value={address.bairro} onChange={(e) => setAddress({ ...address, bairro: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" /><input required placeholder="Cidade" value={address.cidade} onChange={(e) => setAddress({ ...address, cidade: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" /><input required placeholder="UF" maxLength={2} value={address.uf} onChange={(e) => setAddress({ ...address, uf: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" /><input required placeholder="CEP" value={address.cep} onChange={(e) => setAddress({ ...address, cep: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" /><div className="col-span-2 flex justify-end gap-3"><button type="button" onClick={() => setForm(false)} className="text-sm">Cancelar</button><button className="px-4 py-2 bg-[#16a34a] text-white rounded-lg text-sm font-semibold">Salvar endereço</button></div></form> : <button onClick={() => editAddress()} className="w-full py-3 border-2 border-dashed rounded-xl text-sm text-[#6b7280] hover:border-[#16a34a]">+ Adicionar endereço</button>}</div>}
      {tab === "preferencias" && (
        <form onSubmit={savePreferences} className="space-y-4 max-w-md">
          <div>
            <h3 className="text-base font-bold text-[#111827]">Preferências de comunicação</h3>
            <p className="text-sm text-[#6b7280] mt-1">Escolha como deseja receber avisos e novidades.</p>
          </div>
          {preferences ? (
            [
              ["email_notifications", "E-mail", "Receber confirmações e atualizações por e-mail"],
              ["sms_notifications", "SMS", "Receber lembretes por mensagem de texto"],
              ["appointment_reminders", "Lembretes de agendamento", "Avisos antes dos seus serviços agendados"],
              ["marketing_notifications", "Promoções", "Ofertas e novidades da loja"],
            ].map(([key, label, description]) => (
              <label key={key} className="flex items-start gap-3 p-3 border border-[#e5e7eb] rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences[key as keyof Preferences] as boolean}
                  onChange={(event) => setPreferences({ ...preferences, [key]: event.target.checked })}
                  className="mt-1 accent-[#16a34a]"
                />
                <span>
                  <span className="block text-sm font-semibold text-[#111827]">{label}</span>
                  <span className="block text-xs text-[#6b7280] mt-0.5">{description}</span>
                </span>
              </label>
            ))
          ) : (
            <p className="text-sm text-[#9ca3af]">Carregando preferências...</p>
          )}
          {prefsMessage && <p className="text-sm text-[#15803d] bg-[#f0fdf4] rounded-lg px-3 py-2">{prefsMessage}</p>}
          <button className="px-5 py-2.5 bg-[#16a34a] text-white font-semibold text-sm rounded-xl">Salvar preferências</button>
        </form>
      )}
      {tab === "seguranca" && <form onSubmit={savePassword} className="space-y-4 max-w-md"><div><h3 className="text-base font-bold text-[#111827]">Alterar senha</h3><p className="text-sm text-[#6b7280] mt-1">Use uma senha forte para manter sua conta protegida.</p></div><label className="block"><span className="block text-xs font-semibold mb-1.5">Senha atual</span><input required type="password" value={passwords.atual} onChange={(e) => setPasswords({ ...passwords, atual: e.target.value })} className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-xl text-sm" /></label><label className="block"><span className="block text-xs font-semibold mb-1.5">Nova senha</span><input required minLength={6} type="password" placeholder="Mínimo de 6 caracteres" value={passwords.nova} onChange={(e) => setPasswords({ ...passwords, nova: e.target.value })} className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-xl text-sm" /></label><label className="block"><span className="block text-xs font-semibold mb-1.5">Confirmar nova senha</span><input required minLength={6} type="password" value={passwords.confirmacao} onChange={(e) => setPasswords({ ...passwords, confirmacao: e.target.value })} className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-xl text-sm" /></label>{passwordMessage && <p className="text-sm text-[#15803d] bg-[#f0fdf4] rounded-lg px-3 py-2">{passwordMessage}</p>}<button className="px-5 py-2.5 bg-[#16a34a] text-white font-semibold text-sm rounded-xl">Alterar senha</button></form>}
    </div>
  </div>;
}
