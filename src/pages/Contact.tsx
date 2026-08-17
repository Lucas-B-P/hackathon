import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Clock3, Mail, MapPin, PawPrint, Phone, Send } from "lucide-react";

export default function Contact() {
  const [sent, setSent] = useState(false);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <div className="min-h-screen bg-[#f6f8f6] text-[#111827]">
      <header className="max-w-6xl mx-auto px-5 md:px-8 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-xl bg-[#16a34a] flex items-center justify-center">
            <PawPrint size={18} className="text-white" />
          </span>
          <span className="font-bold tracking-tight">Patinhas Pet Shop</span>
        </Link>
        <Link to="/" className="text-sm text-[#6b7280] hover:text-[#15803d] flex items-center gap-1.5 transition-colors">
          <ArrowLeft size={15} /> Voltar ao login
        </Link>
      </header>

      <main className="max-w-6xl mx-auto px-5 md:px-8 py-8 md:py-14">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-14 items-start">
          <section className="pt-2">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#16a34a] mb-4">Estamos por aqui</p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.08] max-w-lg">
              Vamos conversar sobre o seu pet?
            </h1>
            <p className="mt-5 text-[#6b7280] leading-relaxed max-w-md">
              Tem alguma dúvida sobre um serviço, pedido ou atendimento? Mande uma mensagem. Nossa equipe responde de segunda a sábado.
            </p>

            <div className="mt-9 space-y-5">
              <a href="tel:+551133428800" className="flex gap-4 items-start group">
                <span className="w-10 h-10 rounded-xl bg-white border border-[#e4ebe5] flex items-center justify-center text-[#16a34a] group-hover:bg-[#dcfce7] transition-colors"><Phone size={17} /></span>
                <span><span className="block text-sm font-semibold">Telefone</span><span className="block text-sm text-[#6b7280] mt-0.5">(11) 3342-8800</span></span>
              </a>
              <a href="mailto:contato@patinhaspetshop.com.br" className="flex gap-4 items-start group">
                <span className="w-10 h-10 rounded-xl bg-white border border-[#e4ebe5] flex items-center justify-center text-[#16a34a] group-hover:bg-[#dcfce7] transition-colors"><Mail size={17} /></span>
                <span><span className="block text-sm font-semibold">E-mail</span><span className="block text-sm text-[#6b7280] mt-0.5">contato@patinhaspetshop.com.br</span></span>
              </a>
              <div className="flex gap-4 items-start">
                <span className="w-10 h-10 rounded-xl bg-white border border-[#e4ebe5] flex items-center justify-center text-[#16a34a]"><MapPin size={17} /></span>
                <span><span className="block text-sm font-semibold">Visite a loja</span><span className="block text-sm text-[#6b7280] mt-0.5">Rua das Magnólias, 412 — Vila Madalena, São Paulo</span></span>
              </div>
              <div className="flex gap-4 items-start">
                <span className="w-10 h-10 rounded-xl bg-white border border-[#e4ebe5] flex items-center justify-center text-[#16a34a]"><Clock3 size={17} /></span>
                <span><span className="block text-sm font-semibold">Horário de atendimento</span><span className="block text-sm text-[#6b7280] mt-0.5">Seg a sex, 8h às 19h · Sáb, 9h às 16h</span></span>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-[#e4ebe5] shadow-[0_12px_40px_rgba(28,68,37,0.07)] p-6 md:p-9">
            {sent ? (
              <div className="min-h-[390px] flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 rounded-full bg-[#dcfce7] text-[#16a34a] flex items-center justify-center mb-5"><Send size={23} /></div>
                <h2 className="text-2xl font-bold">Mensagem enviada</h2>
                <p className="text-[#6b7280] text-sm leading-relaxed max-w-xs mt-2">Recebemos seu contato. Em breve alguém da nossa equipe fala com você.</p>
                <button onClick={() => setSent(false)} className="mt-7 text-sm font-semibold text-[#16a34a] hover:underline">Enviar outra mensagem</button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold">Fale conosco</h2>
                <p className="text-sm text-[#6b7280] mt-1 mb-7">Preencha os campos e conte como podemos ajudar.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <label className="block"><span className="block text-xs font-semibold text-[#374151] mb-1.5">Seu nome</span><input required className="w-full px-3.5 py-3 rounded-xl border border-[#e5e7eb] text-sm outline-none focus:border-[#16a34a] focus:ring-2 focus:ring-[#dcfce7]" /></label>
                    <label className="block"><span className="block text-xs font-semibold text-[#374151] mb-1.5">E-mail</span><input required type="email" className="w-full px-3.5 py-3 rounded-xl border border-[#e5e7eb] text-sm outline-none focus:border-[#16a34a] focus:ring-2 focus:ring-[#dcfce7]" /></label>
                  </div>
                  <label className="block"><span className="block text-xs font-semibold text-[#374151] mb-1.5">Assunto</span><select className="w-full px-3.5 py-3 rounded-xl border border-[#e5e7eb] text-sm bg-white outline-none focus:border-[#16a34a]"><option>Dúvida sobre atendimento</option><option>Agendamento</option><option>Pedido ou compra</option><option>Outro assunto</option></select></label>
                  <label className="block"><span className="block text-xs font-semibold text-[#374151] mb-1.5">Mensagem</span><textarea required rows={5} placeholder="Escreva sua mensagem..." className="w-full px-3.5 py-3 rounded-xl border border-[#e5e7eb] text-sm resize-none outline-none focus:border-[#16a34a] focus:ring-2 focus:ring-[#dcfce7]" /></label>
                  <button type="submit" className="w-full py-3 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors"><Send size={16} /> Enviar mensagem</button>
                </form>
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
