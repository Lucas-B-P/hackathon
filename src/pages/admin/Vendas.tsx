import { useEffect, useState } from "react";
import { Search, ShoppingCart, Plus, Minus, Trash2, X, Check } from "lucide-react";
import { createAdminSale, getAdminProducts, type AdminProduct } from "../../services/api";

type CartItem = { id: number; nome: string; preco: number; qty: number };
type PayModal = { open: boolean; metodo: string };

export default function Vendas() {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("Todos");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [payModal, setPayModal] = useState<PayModal>({ open: false, metodo: "PIX" });
  const [success, setSuccess] = useState(false);
  const [produtos, setProdutos] = useState<AdminProduct[]>([]);
  useEffect(() => { getAdminProducts().then((result) => setProdutos(result.data)).catch(() => setProdutos([])); }, []);

  const cats = ["Todos", ...Array.from(new Set(produtos.map(p => p.category)))];
  const filtered = produtos.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) &&
    (cat === "Todos" || p.category === cat) &&
    p.stock > 0
  );

  const addToCart = (p: AdminProduct) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === p.id);
      if (ex) return prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { id: p.id, nome: p.name, preco: Number(p.sale_price), qty: 1 }];
    });
  };

  const updateQty = (id: number, delta: number) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i).filter(i => i.qty > 0));
  };

  const removeItem = (id: number) => setCart(prev => prev.filter(i => i.id !== id));

  const total = cart.reduce((a, i) => a + i.preco * i.qty, 0);

  const finalizarVenda = async () => {
    await createAdminSale({ itens: cart.map((item) => ({ produtoId: item.id, quantidade: item.qty })), formaPagamento: payModal.metodo });
    setPayModal({ open: false, metodo: "PIX" });
    setSuccess(true);
    setCart([]);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="h-full flex">
      {/* Left: catalog */}
      <div className="flex-1 p-4 md:p-6 space-y-4 overflow-y-auto border-r border-[#e5e7eb]">
        <div>
          <h1 className="text-xl font-bold text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Vendas / PDV</h1>
          <p className="text-sm text-[#6b7280]">Ponto de venda</p>
        </div>

        <div className="relative">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map(p => (
            <button
              key={p.id}
              onClick={() => addToCart(p)}
              className="bg-white rounded-xl border border-[#e5e7eb] p-4 text-left hover:border-[#86efac] hover:shadow-sm transition-all group"
            >
              <p className="text-xs font-semibold text-[#111827] leading-tight group-hover:text-[#15803d] transition-colors">{p.name}</p>
              <p className="text-[11px] text-[#9ca3af] mt-1">{p.category}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-sm font-bold text-[#111827]">R$ {Number(p.sale_price).toFixed(2)}</span>
                <span className="text-[10px] text-[#9ca3af]">Est: {p.stock}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right: cart */}
      <div className="w-80 flex flex-col bg-white">
        <div className="px-5 py-4 border-b border-[#f3f4f6] flex items-center gap-2">
          <ShoppingCart size={18} className="text-[#16a34a]" />
          <span className="font-semibold text-[#111827] text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Carrinho</span>
          <span className="ml-auto text-xs bg-[#f3f4f6] text-[#374151] px-2 py-0.5 rounded-full font-medium">{cart.length} itens</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {cart.length === 0 ? (
            <div className="text-center py-12 text-[#d1d5db]">
              <ShoppingCart size={36} className="mx-auto mb-2" />
              <p className="text-sm">Nenhum item</p>
            </div>
          ) : cart.map(item => (
            <div key={item.id} className="flex items-center gap-2 p-3 bg-[#fafafa] rounded-xl">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-[#374151] leading-tight truncate">{item.nome}</p>
                <p className="text-xs text-[#6b7280]">R$ {item.preco.toFixed(2)} × {item.qty}</p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 flex items-center justify-center hover:bg-[#e5e7eb] rounded-md text-[#6b7280] transition-colors"><Minus size={12} /></button>
                <span className="w-6 text-center text-xs font-semibold text-[#111827]">{item.qty}</span>
                <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 flex items-center justify-center hover:bg-[#e5e7eb] rounded-md text-[#6b7280] transition-colors"><Plus size={12} /></button>
              </div>
              <button onClick={() => removeItem(item.id)} className="text-[#d1d5db] hover:text-red-400 transition-colors ml-1"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-[#f3f4f6] space-y-3">
          <div className="flex justify-between text-xs text-[#6b7280]">
            <span>Subtotal</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs text-[#6b7280]">
            <span>Desconto</span>
            <span>R$ 0,00</span>
          </div>
          <div className="flex justify-between font-bold text-[#111827]">
            <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Total</span>
            <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>R$ {total.toFixed(2)}</span>
          </div>
          <button
            disabled={cart.length === 0}
            onClick={() => setPayModal({ open: true, metodo: "PIX" })}
            className="w-full py-3 bg-[#16a34a] hover:bg-[#15803d] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl transition-colors"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Finalizar venda
          </button>
        </div>
      </div>

      {/* Payment modal */}
      {payModal.open && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Pagamento</h2>
              <button onClick={() => setPayModal(m => ({ ...m, open: false }))} className="p-1 hover:bg-[#f3f4f6] rounded-lg text-[#9ca3af]"><X size={18} /></button>
            </div>
            <p className="text-2xl font-bold text-[#111827] mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>R$ {total.toFixed(2)}</p>
            <div className="grid grid-cols-2 gap-2 mb-5">
              {["Dinheiro", "PIX", "Débito", "Crédito"].map(m => (
                <button
                  key={m}
                  onClick={() => setPayModal(p => ({ ...p, metodo: m }))}
                  className={`py-3 rounded-xl text-sm font-medium border transition-all ${payModal.metodo === m ? "bg-[#16a34a] text-white border-[#16a34a]" : "border-[#e5e7eb] text-[#374151] hover:border-[#d1d5db]"}`}
                >
                  {m}
                </button>
              ))}
            </div>
            <button
              onClick={finalizarVenda}
              className="w-full py-3 bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold rounded-xl transition-colors"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Confirmar pagamento
            </button>
          </div>
        </div>
      )}

      {/* Success toast */}
      {success && (
        <div className="fixed bottom-6 right-6 bg-[#16a34a] text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50 animate-bounce">
          <Check size={18} />
          <span className="text-sm font-semibold">Venda finalizada com sucesso!</span>
        </div>
      )}
    </div>
  );
}
