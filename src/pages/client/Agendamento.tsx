import { useEffect, useState } from "react";
import { Check, ChevronRight, Dog, Scissors, Calendar, Clock } from "lucide-react";
import {
  createAppointment,
  getAvailableTimes,
  getPets,
  getServices,
  toNumber,
  type Pet,
  type Service,
} from "../../services/api";

const STEPS = ["Escolher pet", "Escolher serviço", "Escolher data", "Confirmar"];

function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours}h ${rest}min` : `${hours}h`;
}

export default function Agendamento() {
  const today = new Date().toISOString().slice(0, 10);
  const [step, setStep] = useState(0);
  const [pets, setPets] = useState<Pet[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [times, setTimes] = useState<string[]>([]);
  const [loadingTimes, setLoadingTimes] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [selectedPet, setSelectedPet] = useState<number | null>(null);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    Promise.all([
      getPets().then((result) => result.data).catch(() => []),
      getServices().then((result) => result.data).catch(() => []),
    ]).then(([loadedPets, loadedServices]) => {
      setPets(loadedPets);
      setServices(loadedServices);
    });
  }, []);

  useEffect(() => {
    if (step !== 2 || !selectedDate) return;
    setLoadingTimes(true);
    setSelectedTime(null);
    getAvailableTimes(selectedDate)
      .then((result) => setTimes(result.data))
      .catch(() => setTimes([]))
      .finally(() => setLoadingTimes(false));
  }, [step, selectedDate]);

  const pet = pets.find((item) => item.id === selectedPet);
  const chosenServices = services.filter((item) => selectedServices.includes(item.id));
  const total = chosenServices.reduce((acc, item) => acc + toNumber(item.price), 0);

  function toggleService(id: number) {
    setSelectedServices((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  }

  async function confirm() {
    if (!selectedPet || !selectedTime || chosenServices.length === 0) return;
    setSubmitting(true);
    setError("");
    const dataHora = `${selectedDate}T${selectedTime}:00`;
    try {
      for (const service of chosenServices) {
        await createAppointment({ petId: selectedPet, servicoId: service.id, dataHora });
      }
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível confirmar o agendamento.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <div className="w-20 h-20 rounded-full bg-[#dcfce7] flex items-center justify-center mx-auto mb-5">
          <Check size={36} className="text-[#16a34a]" />
        </div>
        <h2 className="text-2xl font-bold text-[#111827] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Agendamento confirmado!
        </h2>
        <p className="text-[#6b7280] mb-6">Seu agendamento foi registrado com sucesso. Até lá!</p>
        <div className="bg-[#f0fdf4] rounded-2xl p-5 border border-[#86efac] text-left space-y-2 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-[#9ca3af]">Pet</span>
            <span className="font-semibold text-[#374151]">{pet?.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#9ca3af]">Serviços</span>
            <span className="font-semibold text-[#374151] text-right max-w-[60%]">{chosenServices.map((item) => item.name).join(", ")}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#9ca3af]">Data</span>
            <span className="font-semibold text-[#374151]">{selectedDate.split("-").reverse().join("/")}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#9ca3af]">Horário</span>
            <span className="font-semibold text-[#374151]">{selectedTime}</span>
          </div>
          <div className="flex justify-between text-sm pt-1 border-t border-[#86efac]">
            <span className="text-[#9ca3af]">Total</span>
            <span className="font-bold text-[#16a34a]">R$ {total.toFixed(2)}</span>
          </div>
        </div>
        <button
          onClick={() => {
            setDone(false);
            setStep(0);
            setSelectedPet(null);
            setSelectedServices([]);
            setSelectedTime(null);
            setError("");
          }}
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
        <h1 className="text-2xl font-bold text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Agendar serviço
        </h1>
        <p className="text-sm text-[#6b7280]">Siga os passos abaixo para agendar</p>
      </div>

      <div className="flex items-center gap-1">
        {STEPS.map((label, index) => (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold flex-shrink-0 transition-all ${
                index < step ? "bg-[#16a34a] text-white" : index === step ? "bg-[#16a34a] text-white ring-4 ring-[#dcfce7]" : "bg-[#f3f4f6] text-[#9ca3af]"
              }`}
            >
              {index < step ? <Check size={14} /> : index + 1}
            </div>
            <span className={`text-xs ml-1.5 hidden sm:block ${index === step ? "font-semibold text-[#111827]" : "text-[#9ca3af]"}`}>{label}</span>
            {index < STEPS.length - 1 && <div className="flex-1 h-px bg-[#e5e7eb] mx-2" />}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-4 md:p-6">
        {step === 0 && (
          <div className="space-y-3">
            <h2 className="text-base font-semibold text-[#111827] mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Escolha o pet
            </h2>
            {pets.length === 0 ? (
              <p className="text-sm text-[#6b7280]">Cadastre um pet em Meus Pets antes de agendar.</p>
            ) : (
              pets.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedPet(item.id)}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    selectedPet === item.id ? "border-[#16a34a] bg-[#f0fdf4]" : "border-[#e5e7eb] hover:border-[#d1d5db]"
                  }`}
                >
                  <span className="text-2xl">{item.species === "Gato" ? "🐱" : "🐶"}</span>
                  <div className="text-left">
                    <p className="font-semibold text-[#111827]">{item.name}</p>
                    <p className="text-xs text-[#6b7280]">{item.breed || item.species}</p>
                  </div>
                  {selectedPet === item.id && <Check size={18} className="ml-auto text-[#16a34a]" />}
                </button>
              ))
            )}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Escolha os serviços
              </h2>
              <span className="text-xs text-[#6b7280]">Pode selecionar mais de um</span>
            </div>
            {services.map((item) => {
              const selected = selectedServices.includes(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => toggleService(item.id)}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    selected ? "border-[#16a34a] bg-[#f0fdf4]" : "border-[#e5e7eb] hover:border-[#d1d5db]"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${selected ? "bg-[#16a34a]" : "bg-[#f0fdf4]"}`}>
                    <Scissors size={16} className={selected ? "text-white" : "text-[#16a34a]"} />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-semibold text-[#111827]">{item.name}</p>
                    <p className="text-xs text-[#6b7280]">{formatDuration(item.duration_minutes)}</p>
                  </div>
                  <span className="font-bold text-[#16a34a]">R$ {toNumber(item.price).toFixed(2)}</span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${selected ? "border-[#16a34a] bg-[#16a34a]" : "border-[#d1d5db]"}`}>
                    {selected && <Check size={12} className="text-white" />}
                  </div>
                </button>
              );
            })}
            {selectedServices.length > 0 && (
              <div className="flex items-center justify-between px-1 pt-1">
                <span className="text-sm text-[#6b7280]">
                  {selectedServices.length} serviço{selectedServices.length > 1 ? "s" : ""} selecionado{selectedServices.length > 1 ? "s" : ""}
                </span>
                <span className="font-bold text-[#16a34a]">Total: R$ {total.toFixed(2)}</span>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-base font-semibold text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Escolha data e horário
            </h2>
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-2">Data</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
                min={today}
                className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-xl text-sm outline-none focus:border-[#16a34a]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-2">Horário disponível</label>
              {loadingTimes ? (
                <p className="text-sm text-[#9ca3af]">Carregando horários...</p>
              ) : times.length === 0 ? (
                <p className="text-sm text-[#9ca3af]">Nenhum horário disponível nesta data.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {times.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${
                        selectedTime === time ? "border-[#16a34a] bg-[#f0fdf4] text-[#16a34a]" : "border-[#e5e7eb] text-[#374151] hover:border-[#d1d5db]"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-[#111827] mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Confirmar agendamento
            </h2>
            <div className="bg-[#f9fafb] rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Dog size={14} className="text-[#9ca3af]" />
                <span className="text-sm text-[#6b7280]">Pet</span>
                <span className="ml-auto text-sm font-semibold text-[#374151]">{pet?.name}</span>
              </div>
              <div className="flex items-start gap-3">
                <Scissors size={14} className="text-[#9ca3af] mt-0.5" />
                <span className="text-sm text-[#6b7280]">Serviços</span>
                <div className="ml-auto text-right">
                  {chosenServices.map((item) => (
                    <p key={item.id} className="text-sm font-semibold text-[#374151]">
                      {item.name}
                    </p>
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
                <span className="font-bold text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Total
                </span>
                <span className="text-xl font-bold text-[#16a34a]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  R$ {total.toFixed(2)}
                </span>
              </div>
            </div>
            {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
          </div>
        )}
      </div>

      <div className="flex gap-3">
        {step > 0 && (
          <button onClick={() => setStep((current) => current - 1)} className="px-5 py-3 border border-[#e5e7eb] rounded-xl text-sm font-medium text-[#374151] hover:bg-[#f3f4f6] transition-colors">
            Voltar
          </button>
        )}
        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep((current) => current + 1)}
            disabled={(step === 0 && !selectedPet) || (step === 1 && selectedServices.length === 0) || (step === 2 && !selectedTime)}
            className="flex-1 py-3 bg-[#16a34a] hover:bg-[#15803d] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Continuar
            <ChevronRight size={16} />
          </button>
        ) : (
          <button
            onClick={confirm}
            disabled={submitting}
            className="flex-1 py-3 bg-[#16a34a] hover:bg-[#15803d] disabled:opacity-60 text-white font-semibold rounded-xl transition-colors"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {submitting ? "Confirmando..." : "Confirmar agendamento"}
          </button>
        )}
      </div>
    </div>
  );
}
