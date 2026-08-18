import { pedidosCliente } from "../../data/mockData";
import { Package, Truck, Check, Clock, X } from "lucide-react";

const STATUS_ICONS: Record<string, any> = {
  Recebido: Clock,
  "Em preparação": Package,
  Pronto: Check,
  "Saiu para entrega": Truck,
  Entregue: Check,
  Cancelado: X,
};

const STATUS_COLORS: Record<string, string> = {
  Recebido: "bg-blue-50 text-blue-600",
  "Em preparação": "bg-amber-50 text-amber-600",
  Pronto: "bg-violet-50 text-violet-600",
  "Saiu para entrega": "bg-sky-50 text-sky-600",
  Entregue: "bg-[#dcfce7] text-[#15803d]",
  Cancelado: "bg-red-50 text-red-600",
};

const ALL = [
  ...pedidosCliente,
  { id: "#1035", data: "28/07/2026", produtos: "Coleira Antipulgas Seresto", valor: 89.90, status: "Entregue" },
  { id: "#1028", data: "15/07/2026", produtos: "Ração Gatos Whiskas 3kg", valor: 49.90, status: "Entregue" },
];

export default function Pedidos() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Meus Pedidos</h1>
        <p className="text-sm text-[#6b7280]">{ALL.length} pedidos realizados</p>
      </div>

      <div className="space-y-3">
        {ALL.map(p => {
          const Icon = STATUS_ICONS[p.status] || Package;
          const color = STATUS_COLORS[p.status] || "bg-gray-100 text-gray-500";
          return (
            <div key={p.id} className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-5">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl flex-shrink-0 ${color}`}>
                  <Icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-[#111827] font-mono text-sm">{p.id}</span>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${color}`}>{p.status}</span>
                  </div>
                  <p className="text-sm text-[#374151] mt-1">{p.produtos}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-[#9ca3af]">{p.data}</span>
                    <span className="font-bold text-[#111827]">R$ {p.valor.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Status steps for in-progress orders */}
              {p.status !== "Entregue" && p.status !== "Cancelado" && (
                <div className="mt-4 pt-4 border-t border-[#f3f4f6]">
                  <div className="flex items-center gap-1">
                    {["Recebido", "Em preparação", "Pronto", "Saiu para entrega", "Entregue"].map((s, i) => {
                      const steps = ["Recebido", "Em preparação", "Pronto", "Saiu para entrega", "Entregue"];
                      const curIdx = steps.indexOf(p.status);
                      const isActive = i <= curIdx;
                      return (
                        <div key={s} className="flex items-center flex-1 last:flex-none">
                          <div className={`w-3 h-3 rounded-full flex-shrink-0 ${isActive ? "bg-[#16a34a]" : "bg-[#e5e7eb]"}`} />
                          {i < 4 && <div className={`flex-1 h-px ${isActive && i < curIdx ? "bg-[#16a34a]" : "bg-[#e5e7eb]"}`} />}
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-xs text-[#16a34a] font-medium mt-1.5">{p.status}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
