import { useState } from "react"

import { Link, useNavigate } from "react-router"

import { Eye, EyeOff, Lock, Mail } from "lucide-react"

import AuthSidebar from "../components/AuthSidebar"

import AuthMobileLogo from "../components/AuthMobileLogo"

import { login } from "../services/api"

export default function Login() {
  const navigate = useNavigate()

  const [showPass, setShowPass] = useState(false)

  const [email, setEmail] = useState("joao@email.com")

  const [senha, setSenha] = useState("")

  const [lembrar, setLembrar] = useState(false)

  const [error, setError] = useState("")

  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    setError("")

    setLoading(true)

    try {
      const result = await login(email, senha)

      navigate(result.user.role === "cliente" ? "/portal" : "/admin")
    } catch (loginError) {
      setError(
        loginError instanceof Error ? loginError.message : "Falha ao entrar",
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page-enter min-h-screen flex flex-col lg:flex-row">
      <AuthSidebar
        title="Bem-vindo ao portal exclusivo para tutores"
        description="Acompanhe seus pets, agende serviços, acompanhe pedidos e muito mais, tudo em um só lugar."
        featuresLabel="O que você pode fazer aqui"
        features={[
          "Agendar banho, tosa e consultas",

          "Acompanhar o histórico dos seus pets",

          "Visualizar e rastrear seus pedidos",

          "Gerenciar dados e preferências",
        ]}
      />

      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 bg-[#f9fafb] min-h-screen lg:min-h-0">
        <div className="w-full max-w-[380px]">
          <AuthMobileLogo />

          <div className="mb-8">
            <h1
              className="text-2xl font-bold text-[#111827] mb-1"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Olá, tutor! 🐾
            </h1>
            <p className="text-[#6b7280] text-sm">
              Entre com suas credenciais para acessar o portal.
            </p>
          </div>

          {error && (
            <p
              role="alert"
              className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2 mb-4"
            >
              {error}
            </p>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                E-mail
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#e5e7eb] rounded-xl text-sm text-[#111827] outline-none focus:border-[#16a34a] focus:ring-2 focus:ring-[#dcfce7] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                Senha
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]"
                />
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
              <Link
                to="/esqueci-senha"
                className="text-sm text-[#16a34a] hover:text-[#15803d] font-medium"
              >
                Esqueci minha senha
              </Link>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold text-sm rounded-xl transition-colors shadow-sm mt-2"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {loading ? "Entrando..." : "Entrar no Portal"}
            </button>
          </form>

          <p className="text-center text-sm text-[#6b7280] mt-5">
            Ainda não possui uma conta?{" "}
            <Link
              to="/cadastro"
              className="text-[#16a34a] font-semibold hover:underline"
            >
              Criar conta
            </Link>
          </p>

          <p className="text-center text-xs text-[#9ca3af] mt-6">
            Problemas para acessar?{" "}
            <Link
              to="/contato"
              className="text-[#16a34a] hover:underline font-medium"
            >
              Fale conosco
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
