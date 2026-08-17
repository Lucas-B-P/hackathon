import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Lock, Mail, PawPrint, User } from "lucide-react";
import { login } from "../services/api";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export default function Register() {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (senha !== confirmacao) {
      setError("As senhas não conferem");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error?.message ?? "Não foi possível criar a conta");
      await login(email, senha);
      navigate("/portal");
    } catch (registerError) {
      setError(registerError instanceof Error ? registerError.message : "Falha ao criar conta");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page-enter min-h-screen flex">
      <div className="hidden lg:flex flex-col justify-between w-[480px] bg-[#15803d] p-12 flex-shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <PawPrint size={22} className="text-white" />
            </div>
            <div>
              <span className="text-white font-bold text-xl" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Patinhas</span>
              <span className="text-green-300 font-medium ml-1.5">Pet Shop</span>
            </div>
          </div>
          <h2 className="text-white text-3xl font-bold leading-tight mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Uma conta para cuidar melhor do seu pet
          </h2>
          <p className="text-green-200 text-base leading-relaxed">
            Cadastre-se gratuitamente e tenha tudo o que precisa para acompanhar a saúde e o bem-estar do seu companheiro.
          </p>
        </div>
        <div className="space-y-2">
          {["Agende serviços com facilidade", "Acompanhe o histórico do seu pet", "Receba novidades e benefícios"].map((item) => (
            <div key={item} className="flex items-center gap-2.5 text-green-100 text-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
              {item}
            </div>
          ))}
          <p className="text-green-400 text-xs mt-4 pt-4 border-t border-white/10">Powered by <span className="font-semibold text-white">Petzio ERP</span></p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-[#f9fafb] px-4 py-8">
      <div className="w-full max-w-[420px] bg-white border border-[#e5e7eb] rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="flex justify-center mb-5">
          <div className="w-11 h-11 rounded-xl bg-[#16a34a] flex items-center justify-center">
            <PawPrint size={22} className="text-white" />
          </div>
        </div>
        <div className="text-center mb-7">
          <h1 className="text-2xl font-bold text-[#111827]">Crie sua conta</h1>
          <p className="text-sm text-[#6b7280] mt-1">Acompanhe seus pets em um só lugar.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1.5">Nome completo</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
              <input required placeholder="Ex.: João Silva" value={nome} onChange={(e) => setNome(e.target.value)} className="w-full pl-9 pr-4 py-2.5 border border-[#e5e7eb] rounded-xl text-sm outline-none focus:border-[#16a34a]" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1.5">E-mail</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
              <input required type="email" placeholder="voce@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-9 pr-4 py-2.5 border border-[#e5e7eb] rounded-xl text-sm outline-none focus:border-[#16a34a]" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1.5">Senha</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
              <input required minLength={6} type="password" placeholder="Mínimo de 6 caracteres" value={senha} onChange={(e) => setSenha(e.target.value)} className="w-full pl-9 pr-4 py-2.5 border border-[#e5e7eb] rounded-xl text-sm outline-none focus:border-[#16a34a]" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1.5">Confirme a senha</label>
            <input required minLength={6} type="password" placeholder="Repita sua senha" value={confirmacao} onChange={(e) => setConfirmacao(e.target.value)} className="w-full px-4 py-2.5 border border-[#e5e7eb] rounded-xl text-sm outline-none focus:border-[#16a34a]" />
          </div>
          {error && <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">{error}</p>}
          <button disabled={loading} type="submit" className="w-full py-3 bg-[#16a34a] hover:bg-[#15803d] disabled:opacity-60 text-white font-semibold text-sm rounded-xl transition-colors">
            {loading ? "Criando conta..." : "Criar conta"}
          </button>
        </form>

        <p className="text-center text-sm text-[#6b7280] mt-6">
          Já possui uma conta? <Link to="/" className="text-[#16a34a] font-semibold hover:underline">Entrar</Link>
        </p>
      </div>
      </div>
    </div>
  );
}
