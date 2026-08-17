import { useState } from "react"
import { useNavigate } from "react-router"
import { Eye, EyeOff, Lock, Mail, PawPrint } from "lucide-react"
import dogHero from "../img/dog-hero.jpg"

export default function Login() {
  const navigate = useNavigate()
  const [showPass, setShowPass] = useState(false)
  const [email, setEmail] = useState("joao@email.com")
  const [senha, setSenha] = useState("••••••••")
  const [lembrar, setLembrar] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    navigate("/portal")
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left panel — hidden on mobile, shown on lg+ */}
      <div
        className="hidden lg:flex flex-col justify-between lg:w-[440px] xl:w-[480px] bg-[#15803d] flex-shrink-0 relative overflow-hidden"
        style={{ padding: "48px", margin: "-2px -1px -2px -1px" }}
      >
        <div>
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <PawPrint size={22} className="text-white" />
            </div>
            <div>
              <span className="text-white font-bold text-xl" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Patinhas
              </span>
              <span className="text-green-300 font-medium ml-1.5">Pet Shop</span>
            </div>
          </div>

          <div className="pt-10">
            <h2 className="text-white text-3xl font-bold leading-tight mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Bem-vindo ao portal exclusivo para tutores
            </h2>
            <p className="text-green-200 text-base leading-relaxed mb-10">
              Acompanhe seus pets, agende serviços, acompanhe pedidos e muito mais, tudo em um só lugar.
            </p>

            <div className="space-y-3">
            <p className="text-green-300 text-xs font-semibold uppercase tracking-wider">
              O que você pode fazer aqui
            </p>
            <div className="space-y-2">
              {[
                "Agendar banho, tosa e consultas",
                "Acompanhar o histórico dos seus pets",
                "Visualizar e rastrear seus pedidos",
                "Gerenciar dados e preferências",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5 text-green-100 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
            </div>
          </div>
        </div>

        <div className="mt-auto -mx-14 -mb-12 overflow-hidden rounded-t-[65px]">
          <img
            src={dogHero}
            alt="Golden Retriever — tudo para o amor do seu pet"
            className="w-full h-[350px] object-cover object-top scale-105"
          />
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 bg-[#f9fafb] min-h-screen lg:min-h-0">
        <div className="w-full max-w-[380px]">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-[#16a34a] flex items-center justify-center">
              <PawPrint size={18} className="text-white" />
            </div>
            <span className="font-bold text-lg text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Patinhas Pet Shop
            </span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#111827] mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Olá, tutor! 🐾
            </h1>
            <p className="text-[#6b7280] text-sm">
              Entre com suas credenciais para acessar o portal.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1.5">E-mail</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#e5e7eb] rounded-xl text-sm text-[#111827] outline-none focus:border-[#16a34a] focus:ring-2 focus:ring-[#dcfce7] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1.5">Senha</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
                <input
                  type={showPass ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 bg-white border border-[#e5e7eb] rounded-xl text-sm text-[#111827] outline-none focus:border-[#16a34a] focus:ring-2 focus:ring-[#dcfce7] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#6b7280]"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={lembrar}
                  onChange={(e) => setLembrar(e.target.checked)}
                  className="w-4 h-4 accent-[#16a34a]"
                />
                <span className="text-sm text-[#374151]">Lembrar de mim</span>
              </label>
              <button type="button" className="text-sm text-[#16a34a] hover:text-[#15803d] font-medium">
                Esqueci minha senha
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold text-sm rounded-xl transition-colors shadow-sm mt-2"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Entrar no Portal
            </button>
          </form>

          <p className="text-center text-xs text-[#9ca3af] mt-6">
            Problemas para acessar?{" "}
            <button className="text-[#16a34a] hover:underline font-medium">Fale conosco</button>
          </p>
        </div>
      </div>
    </div>
  )
}
