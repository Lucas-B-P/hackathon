import { useEffect, useState } from "react"
import { Bell, Palette, Shield, Store } from "lucide-react"
import { getAdminSettings, updateAdminShopSettings } from "../../services/api"

const fields = [
  ["name", "Nome do estabelecimento"],
  ["document", "CNPJ"],
  ["phone", "Telefone"],
  ["email", "E-mail"],
] as const

export default function Configuracoes() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [message, setMessage] = useState("")
  useEffect(() => {
    getAdminSettings()
      .then(({ data }) => {
        if (data.shop)
          setValues(
            Object.fromEntries(
              Object.entries(data.shop).map(([key, value]) => [
                key,
                value ?? "",
              ]),
            ),
          )
      })
      .catch(() => setMessage("Não foi possível carregar as configurações."))
  }, [])
  const save = async () => {
    setMessage("")
    try {
      await updateAdminShopSettings(values)
      setMessage("Configurações salvas.")
    } catch {
      setMessage("Não foi possível salvar as configurações.")
    }
  }
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-[#111827]">Configurações</h1>
        <p className="text-sm text-[#6b7280]">
          Preferências e personalização do sistema
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[
          [
            Store,
            "Dados do Pet Shop",
            "Nome, logo, endereço e contato",
            "bg-[#dcfce7] text-[#16a34a]",
          ],
          [
            Bell,
            "Notificações",
            "Alertas, e-mail e SMS",
            "bg-blue-50 text-blue-600",
          ],
          [
            Shield,
            "Segurança",
            "Senha, 2FA e acessos",
            "bg-violet-50 text-violet-600",
          ],
          [
            Palette,
            "Aparência",
            "Tema e personalização",
            "bg-amber-50 text-amber-600",
          ],
        ].map(([Icon, label, desc, color]) => (
          <button
            key={label as string}
            className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-5 text-left hover:border-[#86efac] hover:shadow-md transition-all"
          >
            <div className={`inline-flex p-2.5 rounded-xl mb-3 ${color}`}>
              <Icon size={20} />
            </div>
            <p className="font-semibold text-[#111827] text-sm">{label}</p>
            <p className="text-xs text-[#9ca3af] mt-0.5">{desc}</p>
          </button>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-6 space-y-4">
        <h2 className="text-sm font-semibold text-[#111827]">
          Dados do Pet Shop
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {fields.map(([key, label]) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                {label}
              </label>
              <input
                value={values[key] ?? ""}
                onChange={(event) =>
                  setValues({ ...values, [key]: event.target.value })
                }
                className="w-full px-3 py-2 border border-[#e5e7eb] rounded-xl text-sm outline-none focus:border-[#16a34a] transition-colors"
              />
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={save}
            className="px-4 py-2 bg-[#16a34a] hover:bg-[#15803d] text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Salvar alterações
          </button>
          {message && <span className="text-sm text-[#6b7280]">{message}</span>}
        </div>
      </div>
    </div>
  )
}
