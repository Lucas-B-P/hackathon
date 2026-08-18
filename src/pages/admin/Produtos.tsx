import { useEffect, useState } from "react";
import { Search, Plus, AlertTriangle, X } from "lucide-react";
import { createAdminProduct, getAdminProducts, type AdminProduct } from "../../services/api";

export default function Produtos() {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("Todos");
  const [produtos, setProdutos] = useState<AdminProduct[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", sku: "", category: "", cost: "", salePrice: "", stock: "", minimumStock: "", icon: "" });
  const [error, setError] = useState("");
  useEffect(() => { getAdminProducts().then((result) => setProdutos(result.data)).catch(() => setProdutos([])); }, []);

  const cats = ["Todos", ...Array.from(new Set(produtos.map(p => p.category)))];
  const filtered = produtos.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) &&
    (catFilter === "Todos" || p.category === catFilter)
  );

  return (
    <div className="p-4 md:p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Produtos</h1>
          <p className="text-sm text-[#6b7280]">{produtos.length} produtos cadastrados</p>
        </div>
        <button onClick={() => { setError(""); setOpen(true); }} className="flex items-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          <Plus size={16} />
          Novo produto
        </button>
      </div>

      {open && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"><form onSubmit={async (e) => { e.preventDefault(); try { await createAdminProduct({ ...form, cost: Number(form.cost), salePrice: Number(form.salePrice), stock: Number(form.stock || 0), minimumStock: Number(form.minimumStock || 0) }); setProdutos((await getAdminProducts()).data); setOpen(false); } catch (err) { setError(err instanceof Error ? err.message : "Não foi possível cadastrar"); } }} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4"><div className="flex items-center justify-between"><h2 className="text-lg font-bold">Novo produto</h2><button type="button" onClick={() => setOpen(false)}><X size={18} className="text-[#9ca3af]" /></button></div><div className="grid grid-cols-2 gap-3">{[["name","Nome"],["sku","SKU"],["category","Categoria"],["icon","Ícone (emoji)"],["cost","Custo"],["salePrice","Preço de venda"],["stock","Estoque"],["minimumStock","Estoque mínimo"]].map(([key,label]) => <label key={key} className="text-xs font-medium text-[#374151]">{label}<input required={!["icon","stock","minimumStock","cost"].includes(key)} type={["cost","salePrice","stock","minimumStock"].includes(key) ? "number" : "text"} step="0.01" value={form[key as keyof typeof form]} onChange={e => setForm({ ...form, [key]: e.target.value })} className="mt-1 w-full rounded-xl border border-[#e5e7eb] px-3 py-2 text-sm outline-none focus:border-[#16a34a]" /></label>)}</div>{error && <p className="text-sm text-red-600">{error}</p>}<button className="w-full rounded-xl bg-[#16a34a] py-3 font-semibold text-white">Salvar produto</button></form></div>}

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar produto..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-[#e5e7eb] rounded-xl outline-none focus:border-[#16a34a]"
          />
        </div>
        <div className="flex bg-[#f3f4f6] rounded-xl p-1 gap-1 flex-wrap">
          {cats.map(c => (
            <button
              key={c}
              onClick={() => setCatFilter(c)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${catFilter === c ? "bg-white text-[#111827] shadow-sm" : "text-[#6b7280]"}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#f3f4f6]">
              {["Produto", "SKU", "Categoria", "Estoque", "Estoque mín.", "Custo", "Venda", "Status"].map((h, idx) => (
                <th key={h} className={`text-left px-4 py-3 text-xs font-semibold text-[#9ca3af]${idx === 1 || idx === 4 || idx === 5 ? " hidden md:table-cell" : ""}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f3f4f6]">
            {filtered.map(p => {
              const low = p.stock <= p.minimum_stock;
              const zero = p.stock === 0;
              return (
                <tr key={p.id} className="hover:bg-[#fafafa] transition-colors cursor-pointer">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {low && <AlertTriangle size={13} className={zero ? "text-red-500" : "text-orange-400"} />}
                      <span className="font-medium text-[#111827]">{p.name}</span>
                    </div>
                  </td>
                  <td className="hidden md:table-cell px-4 py-3 font-mono text-xs text-[#6b7280]">{p.sku}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-[#f3f4f6] text-[#374151] px-2 py-0.5 rounded-full">{p.category}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-bold ${zero ? "text-red-500" : low ? "text-orange-500" : "text-[#111827]"}`}>{p.stock}</span>
                  </td>
                  <td className="hidden md:table-cell px-4 py-3 text-xs text-[#9ca3af]">{p.minimum_stock}</td>
                  <td className="hidden md:table-cell px-4 py-3 text-xs text-[#6b7280]">R$ {Number(p.cost).toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-[#111827]">R$ {Number(p.sale_price).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${zero ? "bg-red-100 text-red-600" : low ? "bg-orange-50 text-orange-500" : "bg-[#dcfce7] text-[#15803d]"}`}>
                      {zero ? "Esgotado" : low ? "Baixo" : "Normal"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
