import { useState } from "react"
import { Link } from "react-router"
import { ArrowLeft, Mail, Send } from "lucide-react"
import AuthSidebar from "../components/AuthSidebar"
import AuthMobileLogo from "../components/AuthMobileLogo"

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError("")
    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      if (!response.ok) throw new Error("Não foi possível solicitar a recuperação agora")
      setSent(true)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Tente novamente mais tarde")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page-enter min-h-screen flex flex-col lg:flex-row">
      <AuthSidebar
        title="Acesso seguro para você e seu pet"
        description="Informe seu e-mail e enviaremos um link para você voltar a acessar sua conta."
      />

      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 bg-[#f9fafb] min-h-screen lg:min-h-0">
        <div className="w-full max-w-[380px]">
          <AuthMobileLogo />

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-[#6b7280] hover:text-[#15803d] mb-8"
          >
            <ArrowLeft size={15} />
            Voltar ao login
          </Link>

          {sent ? (
            <div className="text-center py-4">
              <div className="mx-auto w-14 h-14 rounded-full bg-[#dcfce7] text-[#16a34a] flex items-center justify-center mb-5">
                <Send size={23} />
              </div>
              <h1 className="text-2xl font-bold text-[#111827] mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Confira seu e-mail
              </h1>
              <p className="text-sm text-[#6b7280] leading-relaxed mt-2">
                Se existir uma conta com esse endereço, enviaremos um link para redefinir sua senha.
              </p>
              <Link to="/" className="inline-block mt-7 text-sm font-semibold text-[#16a34a] hover:underline">
                Voltar ao login
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-[#111827] mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Esqueceu sua senha?
                </h1>
                <p className="text-[#6b7280] text-sm">
                  Sem problema. Digite seu e-mail e nós cuidamos do resto.
                </p>
              </div>

              {error && (
                <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2 mb-4">
                  {error}
                </p>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1.5">E-mail</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
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
                  {loading ? "Enviando..." : "Enviar link de recuperação"}
                </button>
              </form>
            </>
          )}

          {!sent && (
            <p className="text-center text-xs text-[#9ca3af] mt-6">
              Problemas para acessar?{" "}
              <Link to="/contato" className="text-[#16a34a] hover:underline font-medium">
                Fale conosco
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
