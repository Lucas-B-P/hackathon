import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Mail, PawPrint, Send } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      if (!response.ok) throw new Error("Não foi possível solicitar a recuperação agora");
      setSent(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Tente novamente mais tarde");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page-enter min-h-screen flex">
      <div className="hidden lg:flex flex-col justify-between w-[480px] bg-[#15803d] p-12 flex-shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-16"><div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center"><PawPrint size={22} className="text-white" /></div><span className="text-white font-bold text-xl">Patinhas <span className="text-green-300 font-medium">Pet Shop</span></span></div>
          <h1 className="text-white text-3xl font-bold leading-tight mb-4">Acesso seguro para você e seu pet</h1>
          <p className="text-green-200 leading-relaxed">Informe seu e-mail e enviaremos um link para você voltar a acessar sua conta.</p>
        </div>
        <p className="text-green-400 text-xs">Powered by <span className="font-semibold text-white">Petzio ERP</span></p>
      </div>
      <div className="flex-1 flex items-center justify-center bg-[#f9fafb] px-5 py-8">
        <div className="w-full max-w-[400px] bg-white border border-[#e5e7eb] rounded-2xl p-6 md:p-8 shadow-sm">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-[#6b7280] hover:text-[#15803d] mb-8"><ArrowLeft size={15} /> Voltar ao login</Link>
          {sent ? (
            <div className="text-center py-8"><div className="mx-auto w-14 h-14 rounded-full bg-[#dcfce7] text-[#16a34a] flex items-center justify-center mb-5"><Send size={23} /></div><h2 className="text-2xl font-bold">Confira seu e-mail</h2><p className="text-sm text-[#6b7280] leading-relaxed mt-2">Se existir uma conta com esse endereço, enviaremos um link para redefinir sua senha.</p><Link to="/" className="inline-block mt-7 text-sm font-semibold text-[#16a34a] hover:underline">Voltar ao login</Link></div>
          ) : (<><h2 className="text-2xl font-bold text-[#111827]">Esqueceu sua senha?</h2><p className="text-sm text-[#6b7280] mt-1 mb-7">Sem problema. Digite seu e-mail e nós cuidamos do resto.</p><form onSubmit={handleSubmit} className="space-y-4"><label className="block"><span className="block text-xs font-semibold text-[#374151] mb-1.5">E-mail</span><div className="relative"><Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" /><input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full pl-9 pr-4 py-3 border border-[#e5e7eb] rounded-xl text-sm outline-none focus:border-[#16a34a] focus:ring-2 focus:ring-[#dcfce7]" /></div></label>{error && <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">{error}</p>}<button disabled={loading} className="w-full py-3 rounded-xl bg-[#16a34a] hover:bg-[#15803d] disabled:opacity-60 text-white text-sm font-semibold transition-colors">{loading ? "Enviando..." : "Enviar link de recuperação"}</button></form></>)}
        </div>
      </div>
    </div>
  );
}
