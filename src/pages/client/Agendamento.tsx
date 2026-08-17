import { useState } from "react";
import { Check, ChevronRight, Dog, Scissors, Calendar, Clock } from "lucide-react";
import { pets, servicos } from "../../data/mockData";

const myPets = pets.filter(p => p.tutorId === 1);
const STEPS = ["Escolher pet", "Escolher serviço", "Escolher data", "Confirmar"];
const TIMES = ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"];
const availableServicos = servicos.filter(s => !s.nome.includes("Consulta") && !s.nome.includes("Vacin"));

export default function Agendamento() {
  const [step, setStep] = useState(0);
  const [selectedPet, setSelectedPet] = useState<number | null>(null);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [selectedDate, setSelectedDate] = useState("2026-08-15");
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const pet = myPets.find(p => p.id === selectedPet);
  const chosenServices = availableServicos.filter(s => selectedServices.includes(s.id));
  const total = chosenServices.reduce((acc, s) => acc + s.preco, 0);

  function toggleService(id: number) {
    setSelectedServices(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  }

  if (done) {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <div className="w-20 h-20 rounded-full bg-[#dcfce7] flex items-center justify-center mx-auto mb-5">
          <Check size={36} className="text-[#16a34a]" />
        </div>
        <h2 className="text-2xl font-bold text-[#111827] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Agendamento confirmado!</h2>
        <p className="text-[#6b7280] mb-6">Seu agendamento foi registrado com sucesso. Até lá!</p>
        <div className="bg-[#f0fdf4] rounded-2xl p-5 border border-[#86efac] text-left space-y-2 mb-6">
          <div className="flex justify-between text-sm"><span className="text-[#9ca3af]">Pet</span><span className="font-semibold text-[#374151]">{pet?.nome}</span></div>
          <div className="flex justify-between text-sm">
            <span className="text-[#9ca3af]">Serviços</span>
            <span className="font-semibold text-[#374151] text-right max-w-[60%]">{chosenServices.map(s => s.nome).join(", ")}</span>
          </div>
          <div className="flex justify-between text-sm"><span className="text-[#9ca3af]">Data</span><span className="font-semibold text-[#374151]">{selectedDate.split("-").reverse().join("/")}</span></div>
          <div className="flex justify-between text-sm"><span className="text-[#9ca3af]">Horário</span><span className="font-semibold text-[#374151]">{selectedTime}</span></div>
          <div className="flex justify-between text-sm pt-1 border-t border-[#86efac]"><span className="text-[#9ca3af]">Total</span><span className="font-bold text-[#16a34a]">R$ {total.toFixed(2)}</span></div>
        </div>
        <button
          onClick={() => { setDone(false); setStep(0); setSelectedPet(null); setSelectedServices([]); setSelectedTime(null); }}
          className="px-6 py-3 bg-[#16a34a] text-white font-semibold rounded-xl hover:bg-[#15803d] transition-colors"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Novo agendamento
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Agendar serviço</h1>
        <p className="text-sm text-[#6b7280]">Siga os passos abaixo para agendar</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-1">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold flex-shrink-0 transition-all ${i < step ? "bg-[#16a34a] text-white" : i === step ? "bg-[#16a34a] text-white ring-4 ring-[#dcfce7]" : "bg-[#f3f4f6] text-[#9ca3af]"}`}>
              {i < step ? <Check size={14} /> : i + 1}
            </div>
            <span className={`text-xs ml-1.5 hidden sm:block ${i === step ? "font-semibold text-[#111827]" : "text-[#9ca3af]"}`}>{s}</span>
            {i < STEPS.length - 1 && <div className="flex-1 h-px bg-[#e5e7eb] mx-2" />}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-4 md:p-6">
        {/* Step 0 — choose pet */}
        {step === 0 && (
          <div className="space-y-3">
            <h2 className="text-base font-semibold text-[#111827] mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Escolha o pet</h2>
            {myPets.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedPet(p.id)}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${selectedPet === p.id ? "border-[#16a34a] bg-[#f0fdf4]" : "border-[#e5e7eb] hover:border-[#d1d5db]"}`}
              >
                <span className="text-2xl">{p.foto}</span>
                <div className="text-left">
                  <p className="font-semibold text-[#111827]">{p.nome}</p>
                  <p className="text-xs text-[#6b7280]">{p.raca} · {p.idade}</p>
                </div>
                {selectedPet === p.id && <Check size={18} className="ml-auto text-[#16a34a]" />}
              </button>
            ))}
          </div>
        )}

        {/* Step 1 — choose services (multi-select) */}
        {step === 1 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Escolha os serviços</h2>
              <span className="text-xs text-[#6b7280]">Pode selecionar mais de um</span>
            </div>
            {availableServicos.map(s => {
              const selected = selectedServices.includes(s.id);
              return (
                <button
                  key={s.id}
                  onClick={() => toggleService(s.id)}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${selected ? "border-[#16a34a] bg-[#f0fdf4]" : "border-[#e5e7eb] hover:border-[#d1d5db]"}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${selected ? "bg-[#16a34a]" : "bg-[#f0fdf4]"}`}>
                    <Scissors size={16} className={selected ? "text-white" : "text-[#16a34a]"} />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-semibold text-[#111827]">{s.nome}</p>
                    <p className="text-xs text-[#6b7280]">{s.duracao}</p>
                  </div>
                  <span className="font-bold text-[#16a34a]">R$ {s.preco.toFixed(2)}</span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${selected ? "border-[#16a34a] bg-[#16a34a]" : "border-[#d1d5db]"}`}>
                    {selected && <Check size={12} className="text-white" />}
                  </div>
                </button>
              );
            })}
            {selectedServices.length > 0 && (
              <div className="flex items-center justify-between px-1 pt-1">
                <span className="text-sm text-[#6b7280]">{selectedServices.length} serviço{selectedServices.length > 1 ? "s" : ""} selecionado{selectedServices.length > 1 ? "s" : ""}</span>
                <span className="font-bold text-[#16a34a]">Total: R$ {total.toFixed(2)}</span>
              </div>
            )}
          </div>
        )}

        {/* Step 2 — date and time */}
        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-base font-semibold text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Escolha data e horário</h2>
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-2">Data</label>
              <input
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                min="2026-08-14"
                className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-xl text-sm outline-none focus:border-[#16a34a]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-2">Horário disponível</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {TIMES.map(t => (
                  <button
                    key={t}
                    onClick={() => setSelectedTime(t)}
                    className={`py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${selectedTime === t ? "border-[#16a34a] bg-[#f0fdf4] text-[#16a34a]" : "border-[#e5e7eb] text-[#374151] hover:border-[#d1d5db]"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3 — confirm */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-[#111827] mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Confirmar agendamento</h2>
            <div className="bg-[#f9fafb] rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Dog size={14} className="text-[#9ca3af]" />
                <span className="text-sm text-[#6b7280]">Pet</span>
                <span className="ml-auto text-sm font-semibold text-[#374151]">{pet?.nome}</span>
              </div>
              <div className="flex items-start gap-3">
                <Scissors size={14} className="text-[#9ca3af] mt-0.5" />
                <span className="text-sm text-[#6b7280]">Serviços</span>
                <div className="ml-auto text-right">
                  {chosenServices.map(s => (
                    <p key={s.id} className="text-sm font-semibold text-[#374151]">{s.nome}</p>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={14} className="text-[#9ca3af]" />
                <span className="text-sm text-[#6b7280]">Data</span>
                <span className="ml-auto text-sm font-semibold text-[#374151]">{selectedDate.split("-").reverse().join("/")}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={14} className="text-[#9ca3af]" />
                <span className="text-sm text-[#6b7280]">Horário</span>
                <span className="ml-auto text-sm font-semibold text-[#374151]">{selectedTime}</span>
              </div>
              <div className="pt-2 border-t border-[#e5e7eb] flex items-center justify-between">
                <span className="font-bold text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Total</span>
                <span className="text-xl font-bold text-[#16a34a]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>R$ {total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        {step > 0 && (
          <button onClick={() => setStep(s => s - 1)} className="px-5 py-3 border border-[#e5e7eb] rounded-xl text-sm font-medium text-[#374151] hover:bg-[#f3f4f6] transition-colors">
            Voltar
          </button>
        )}
        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep(s => s + 1)}
            disabled={(step === 0 && !selectedPet) || (step === 1 && selectedServices.length === 0) || (step === 2 && !selectedTime)}
            className="flex-1 py-3 bg-[#16a34a] hover:bg-[#15803d] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Continuar
            <ChevronRight size={16} />
          </button>
        ) : (
          <button
            onClick={() => setDone(true)}
            className="flex-1 py-3 bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold rounded-xl transition-colors"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Confirmar agendamento
          </button>
        )}
      </div>
    </div>
  );
}
