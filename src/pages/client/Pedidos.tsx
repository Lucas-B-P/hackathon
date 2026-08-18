import { useEffect, useState } from "react"

import { Package, Truck, Check, Clock, X } from "lucide-react"

import {
  displayOrderStatus,
  formatDatePt,
  getOrders,
  toNumber,
  type Order,
} from "../../services/api"

const STATUS_ICONS: Record<string, typeof Package> = {
  Recebido: Clock,

  "Em preparação": Package,

  "Em preparacao": Package,

  Pronto: Check,

  "Saiu para entrega": Truck,

  Entregue: Check,

  Cancelado: X,
}

const STATUS_COLORS: Record<string, string> = {
  Recebido: "bg-blue-50 text-blue-600",

  "Em preparação": "bg-amber-50 text-amber-600",

  "Em preparacao": "bg-amber-50 text-amber-600",

  Pronto: "bg-violet-50 text-violet-600",

  "Saiu para entrega": "bg-sky-50 text-sky-600",

  Entregue: "bg-[#dcfce7] text-[#15803d]",

  Cancelado: "bg-red-50 text-red-600",
}

const STEPS = [
  "Recebido",
  "Em preparação",
  "Pronto",
  "Saiu para entrega",
  "Entregue",
]

export default function Pedidos() {
  const [orders, setOrders] = useState<Order[]>([])

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getOrders()

      .then((result) => setOrders(result.data))

      .catch(() => setOrders([]))

      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1
          className="text-2xl font-bold text-[#111827]"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Meus Pedidos
        </h1>
        <p className="text-sm text-[#6b7280]">
          {loading ? "Carregando..." : `${orders.length} pedidos realizados`}
        </p>
      </div>

      {!loading && orders.length === 0 ? (
        <div className="text-center py-20 text-[#9ca3af]">
          <Package size={40} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">Você ainda não fez nenhum pedido.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const status = displayOrderStatus(order.status)

            const Icon =
              STATUS_ICONS[order.status] || STATUS_ICONS[status] || Package

            const color =
              STATUS_COLORS[order.status] ||
              STATUS_COLORS[status] ||
              "bg-gray-100 text-gray-500"

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-5"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl flex-shrink-0 ${color}`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-[#111827] font-mono text-sm">
                        #{order.id}
                      </span>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${color}`}
                      >
                        {status}
                      </span>
                    </div>
                    <p className="text-sm text-[#374151] mt-1">
                      {order.products || "Pedido sem itens"}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-[#9ca3af]">
                        {formatDatePt(order.created_at)}
                      </span>
                      <span className="font-bold text-[#111827]">
                        R$ {toNumber(order.total).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {status !== "Entregue" && status !== "Cancelado" && (
                  <div className="mt-4 pt-4 border-t border-[#f3f4f6]">
                    <div className="flex items-center gap-1">
                      {STEPS.map((step, index) => {
                        const curIdx = STEPS.indexOf(status)

                        const isActive = index <= curIdx

                        return (
                          <div
                            key={step}
                            className="flex items-center flex-1 last:flex-none"
                          >
                            <div
                              className={`w-3 h-3 rounded-full flex-shrink-0 ${
                                isActive ? "bg-[#16a34a]" : "bg-[#e5e7eb]"
                              }`}
                            />
                            {index < 4 && (
                              <div
                                className={`flex-1 h-px ${
                                  isActive && index < curIdx
                                    ? "bg-[#16a34a]"
                                    : "bg-[#e5e7eb]"
                                }`}
                              />
                            )}
                          </div>
                        )
                      })}
                    </div>
                    <p className="text-xs text-[#16a34a] font-medium mt-1.5">
                      {status}
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
