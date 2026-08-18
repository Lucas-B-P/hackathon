import { useState } from "react";
import { Search, Check } from "lucide-react";
import { produtos } from "../../data/mockData";

export default function Vendas() {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("Todos");
  const [success, setSuccess] = useState(false);

  const cats = ["Todos", ...Array.from(new Set(produtos.map(p => p.categoria)))];
  const filtered = produtos.filter(p =>
    p.nome.toLowerCase().includes(search.toLowerCase()) &&
    (cat === "Todos" || p.categoria === cat) &&
    p.estoque > 0
  );

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div>
        <h1 className="text-xl font-bold text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Vendas / PDV</h1>
        <p className="text-sm text-[#6b7280]">Ponto de venda</p>
      </div>

      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar produto ou código..."
          className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-[#e5e7eb] rounded-xl outline-none focus:border-[#16a34a]"
        />
      </div>

      <div className="flex gap-1.5 flex-wrap">
        {cats.map(c => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${cat === c ? "bg-[#16a34a] text-white border-[#16a34a]" : "bg-white text-[#6b7280] border-[#e5e7eb] hover:border-[#d1d5db]"}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
        {filtered.map(p => (
          <div
            key={p.id}
            className="bg-white rounded-xl border border-[#e5e7eb] p-4 hover:border-[#86efac] hover:shadow-sm transition-all"
          >
            <p className="text-xs font-semibold text-[#111827] leading-tight">{p.nome}</p>
            <p className="text-[11px] text-[#9ca3af] mt-1">{p.categoria}</p>
            <div className="flex items-center justify-between mt-3">
              <span className="text-sm font-bold text-[#111827]">R$ {p.venda.toFixed(2)}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${p.estoque <= p.estoqueMin ? "bg-red-50 text-red-600" : "bg-[#dcfce7] text-[#15803d]"}`}>
                Est: {p.estoque}
              </span>
            </div>
          </div>
        ))}
      </div>

      {success && (
        <div className="fixed bottom-6 right-6 bg-[#16a34a] text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50">
          <Check size={18} />
          <span className="text-sm font-semibold">Venda finalizada com sucesso!</span>
        </div>
      )}
    </div>
  );
}
