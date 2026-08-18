import { useState } from "react"

import { Link, useNavigate } from "react-router"

import { Calendar, CreditCard, Lock, Mail, Phone, User } from "lucide-react"

import AuthSidebar from "../components/AuthSidebar"

import AuthMobileLogo from "../components/AuthMobileLogo"

import { register } from "../services/api"

type PasswordStrength = {
  score: 0 | 1 | 2 | 3 | 4

  label: string

  color: string
}

function getPasswordStrength(password: string): PasswordStrength {
  if (!password) return { score: 0, label: "", color: "#e5e7eb" }

  let points = 0

  if (password.length >= 6) points++

  if (password.length >= 8) points++

  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) points++

  if (/\d/.test(password)) points++

  if (/[^a-zA-Z0-9]/.test(password)) points++

  if (points <= 1) return { score: 1, label: "Fraca", color: "#ef4444" }

  if (points <= 2) return { score: 2, label: "Razoável", color: "#f97316" }

  if (points <= 3) return { score: 3, label: "Boa", color: "#eab308" }

  return { score: 4, label: "Forte", color: "#16a34a" }
}

export default function Register() {
  const navigate = useNavigate()

  const [nome, setNome] = useState("")

  const [cpf, setCpf] = useState("")

  const [telefone, setTelefone] = useState("")

  const [nascimento, setNascimento] = useState("")

  const [email, setEmail] = useState("")

  const [senha, setSenha] = useState("")

  const [confirmacao, setConfirmacao] = useState("")

  const [error, setError] = useState("")

  const [loading, setLoading] = useState(false)

  const passwordStrength = getPasswordStrength(senha)

  const maxBirthDate = new Date().toISOString().slice(0, 10)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    setError("")

    if (senha !== confirmacao) {
      setError("As senhas não conferem")

      return
    }

    setLoading(true)

    try {
      await register({ nome, email, senha, cpf, telefone, nascimento })

      navigate("/portal")
    } catch (registerError) {
      setError(
        registerError instanceof Error
          ? registerError.message
          : "Falha ao criar conta",
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page-enter min-h-screen flex flex-col lg:flex-row">
      <AuthSidebar
        title="Uma conta para cuidar melhor do seu pet"
        description="Cadastre-se gratuitamente e tenha tudo o que precisa para acompanhar a saúde e o bem-estar do seu companheiro."
        features={[
          "Agende serviços com facilidade",

          "Acompanhe o histórico do seu pet",

          "Receba novidades e benefícios",
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
              Crie sua conta 🐾
            </h1>
            <p className="text-[#6b7280] text-sm">
              Cadastre-se e acompanhe seus pets em um só lugar.
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                Nome completo
              </label>
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]"
                />
                <input
                  required
                  placeholder="Ex.: João Silva"
                  value={nome}
                  onChange={(event) => setNome(event.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#e5e7eb] rounded-xl text-sm text-[#111827] outline-none focus:border-[#16a34a] focus:ring-2 focus:ring-[#dcfce7] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                CPF
              </label>
              <div className="relative">
                <CreditCard
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]"
                />
                <input
                  required
                  inputMode="numeric"
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={(event) => setCpf(event.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#e5e7eb] rounded-xl text-sm text-[#111827] outline-none focus:border-[#16a34a] focus:ring-2 focus:ring-[#dcfce7] transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                  Telefone
                </label>
                <div className="relative">
                  <Phone
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]"
                  />
                  <input
                    required
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={telefone}
                    onChange={(event) => setTelefone(event.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#e5e7eb] rounded-xl text-sm text-[#111827] outline-none focus:border-[#16a34a] focus:ring-2 focus:ring-[#dcfce7] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                  Data de nascimento
                </label>
                <div className="relative">
                  <Calendar
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]"
                  />
                  <input
                    required
                    type="date"
                    max={maxBirthDate}
                    value={nascimento}
                    onChange={(event) => setNascimento(event.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#e5e7eb] rounded-xl text-sm text-[#111827] outline-none focus:border-[#16a34a] focus:ring-2 focus:ring-[#dcfce7] transition-all"
                  />
                </div>
              </div>
            </div>

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
                  required
                  type="email"
                  placeholder="voce@email.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
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
                  required
                  minLength={6}
                  type="password"
                  placeholder="Mínimo de 6 caracteres"
                  value={senha}
                  onChange={(event) => setSenha(event.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#e5e7eb] rounded-xl text-sm text-[#111827] outline-none focus:border-[#16a34a] focus:ring-2 focus:ring-[#dcfce7] transition-all"
                />
              </div>
              {senha.length > 0 && (
                <div className="mt-2.5">
                  <div className="flex gap-1.5 h-1.5">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className="flex-1 rounded-full transition-colors duration-300"
                        style={{
                          backgroundColor:
                            level <= passwordStrength.score
                              ? passwordStrength.color
                              : "#e5e7eb",
                        }}
                      />
                    ))}
                  </div>
                  <p
                    className="text-xs mt-1.5 font-medium"
                    style={{ color: passwordStrength.color }}
                  >
                    Senha {passwordStrength.label.toLowerCase()}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                Confirme a senha
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]"
                />
                <input
                  required
                  minLength={6}
                  type="password"
                  placeholder="Repita sua senha"
                  value={confirmacao}
                  onChange={(event) => setConfirmacao(event.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#e5e7eb] rounded-xl text-sm text-[#111827] outline-none focus:border-[#16a34a] focus:ring-2 focus:ring-[#dcfce7] transition-all"
                />
              </div>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full py-3 bg-[#16a34a] hover:bg-[#15803d] disabled:opacity-60 text-white font-semibold text-sm rounded-xl transition-colors shadow-sm mt-2"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {loading ? "Criando conta..." : "Criar conta"}
            </button>
          </form>

          <p className="text-center text-sm text-[#6b7280] mt-5">
            Já possui uma conta?{" "}
            <Link
              to="/"
              className="text-[#16a34a] font-semibold hover:underline"
            >
              Entrar
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
