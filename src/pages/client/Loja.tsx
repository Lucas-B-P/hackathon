import { useEffect, useMemo, useState } from "react"

import { Link } from "react-router"

import {
  ShoppingCart,
  Search,
  Plus,
  Minus,
  Trash2,
  X,
  Check,
  ChevronRight,
} from "lucide-react"

import {
  createOrder,
  displayCategory,
  getAddresses,
  getStoreCategories,
  getStoreProducts,
  productEmoji,
  toNumber,
  type Address,
  type StoreProduct,
} from "../../services/api"

type CartItem = { id: number nome: string preco: number qty: number }

const PAYMENT = ["PIX", "Cartão de crédito", "Cartão de débito", "Boleto"]

export default function Loja() {
  const [search, setSearch] = useState("")

  const [cat, setCat] = useState("Todos")

  const [products, setProducts] = useState<StoreProduct[]>([])

  const [categories, setCategories] = useState<string[]>([])

  const [addresses, setAddresses] = useState<Address[]>([])

  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null,
  )

  const [cart, setCart] = useState<CartItem[]>([])

  const [cartOpen, setCartOpen] = useState(false)

  const [step, setStep] =
    useState<"cart" | "endereco" | "pagamento" | "confirmado">("cart")

  const [pagamento, setPagamento] = useState("PIX")

  const [loading, setLoading] = useState(true)

  const [submitting, setSubmitting] = useState(false)

  const [error, setError] = useState("")

  const [orderId, setOrderId] = useState<number | null>(null)

  const [complemento, setComplemento] = useState("")

  useEffect(() => {
    Promise.all([
      getStoreCategories()
        .then((result) => result.data)
        .catch(() => []),

      getStoreProducts()
        .then((result) => result.data)
        .catch(() => []),
    ])
      .then(([loadedCategories, loadedProducts]) => {
        setCategories(loadedCategories)

        setProducts(loadedProducts)
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      getStoreProducts({ q: search || undefined, categoria: cat })

        .then((result) => setProducts(result.data))

        .catch(() => undefined)
    }, 300)

    return () => clearTimeout(timer)
  }, [search, cat])

  const cats = useMemo(() => ["Todos", ...categories], [categories])

  const addToCart = (product: StoreProduct) => {
    const price = toNumber(product.sale_price)

    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id)

      if (existing)
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
        )

      return [
        ...prev,
        { id: product.id, nome: product.name, preco: price, qty: 1 },
      ]
    })
  }

  const updateQty = (id: number, delta: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item,
      ),
    )
  }

  const removeItem = (id: number) =>
    setCart((prev) => prev.filter((item) => item.id !== id))

  const total = cart.reduce((acc, item) => acc + item.preco * item.qty, 0)

  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0)

  const inCart = (id: number) => cart.find((item) => item.id === id)

  const selectedAddress =
    addresses.find((item) => item.id === selectedAddressId) ??
    addresses.find((item) => item.is_primary) ??
    addresses[0]

  async function openCheckout() {
    setStep("cart")

    setCartOpen(true)

    setError("")

    try {
      const result = await getAddresses()

      setAddresses(result.data)

      const primary =
        result.data.find((item) => item.is_primary) ?? result.data[0]

      setSelectedAddressId(primary?.id ?? null)
    } catch {
      setAddresses([])
    }
  }

  async function confirmar() {
    if (!selectedAddress) {
      setError("Cadastre um endereço de entrega no seu perfil.")

      return
    }

    setSubmitting(true)

    setError("")

    try {
      const result = await createOrder({
        itens: cart.map((item) => ({
          produtoId: item.id,
          quantidade: item.qty,
        })),

        enderecoId: selectedAddress.id,

        formaPagamento: pagamento,

        observacoes: complemento || undefined,
      })

      setOrderId(result.id)

      setStep("confirmado")

      setTimeout(() => {
        setCart([])

        setCartOpen(false)

        setStep("cart")

        setOrderId(null)

        setComplemento("")
      }, 3500)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível finalizar o pedido.",
      )
    } finally {
      setSubmitting(false)
    }
  }

  const displayTotal = pagamento === "PIX" ? total * 0.95 : total

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div>
          <h1
            className="text-2xl font-bold text-[#111827]"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Loja
          </h1>
          <p className="text-sm text-[#6b7280]">
            Peça produtos e receba em casa
          </p>
        </div>
        <button
          onClick={openCheckout}
          className="relative flex items-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          <ShoppingCart size={17} />
          Carrinho
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#f97316] rounded-full text-[11px] font-bold flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>
      </div>

      <div className="flex gap-3 flex-wrap items-center">
        <div className="relative flex-1 max-w-sm">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]"
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar produto..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-[#e5e7eb] rounded-xl outline-none focus:border-[#16a34a] transition-colors"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {cats.map((category) => (
            <button
              key={category}
              onClick={() => setCat(category)}
              className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition-all ${
                cat === category
                  ? "bg-[#16a34a] text-white border-[#16a34a]"
                  : "bg-white text-[#6b7280] border-[#e5e7eb] hover:border-[#d1d5db]"
              }`}
            >
              {category === "Todos" ? category : displayCategory(category)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-[#9ca3af] text-center py-20">
          Carregando produtos...
        </p>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-[#9ca3af]">
          <ShoppingCart size={40} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">Nenhum produto encontrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product) => {
            const item = inCart(product.id)

            const price = toNumber(product.sale_price)

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm overflow-hidden hover:shadow-md hover:border-[#86efac] transition-all group"
              >
                <div className="h-32 bg-[#f0fdf4] flex items-center justify-center text-5xl relative">
                  {productEmoji(product.category)}
                  <span className="absolute top-2 right-2 text-[10px] bg-white/90 text-[#6b7280] px-2 py-0.5 rounded-full font-medium border border-[#e5e7eb]">
                    {displayCategory(product.category)}
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-sm font-semibold text-[#111827] leading-tight mb-0.5 group-hover:text-[#15803d] transition-colors">
                    {product.name}
                  </p>
                  <p className="text-xs text-[#9ca3af] mb-3">
                    SKU: {product.sku}
                  </p>
                  <div className="flex flex-col gap-2">
                    <span
                      className="text-xl font-bold text-[#111827]"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      R$ {price.toFixed(2)}
                    </span>
                    {item ? (
                      <div className="flex items-center justify-between bg-[#f0fdf4] border border-[#86efac] rounded-xl px-3 py-2">
                        <button
                          onClick={() => updateQty(product.id, -1)}
                          className="text-[#16a34a] hover:text-[#15803d] transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="text-base font-bold text-[#16a34a]">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQty(product.id, 1)}
                          className="text-[#16a34a] hover:text-[#15803d] transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    ) : product.stock <= 0 ? (
                      <button
                        disabled
                        className="w-full bg-[#f3f4f6] text-[#9ca3af] text-sm font-semibold py-2.5 rounded-xl cursor-not-allowed"
                        title="Este produto está sem estoque"
                      >
                        Produto sem estoque
                      </button>
                    ) : (
                      <button
                        onClick={() => addToCart(product)}
                        className="w-full flex items-center justify-center gap-1.5 bg-[#16a34a] hover:bg-[#15803d] text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
                        style={{
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                        }}
                      >
                        <Plus size={15} />
                        Adicionar ao carrinho
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {cartOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="flex-1 bg-black/40"
            onClick={() => step !== "confirmado" && setCartOpen(false)}
          />
          <div className="w-full max-w-md bg-white flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#f3f4f6]">
              {step === "cart" && (
                <>
                  <div className="flex items-center gap-2">
                    <ShoppingCart size={18} className="text-[#16a34a]" />
                    <span
                      className="font-semibold text-[#111827]"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      Carrinho
                    </span>
                    <span className="text-xs bg-[#f3f4f6] text-[#374151] px-2 py-0.5 rounded-full font-medium">
                      {totalItems} itens
                    </span>
                  </div>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="p-1.5 hover:bg-[#f3f4f6] rounded-lg text-[#9ca3af]"
                  >
                    <X size={18} />
                  </button>
                </>
              )}
              {step === "endereco" && (
                <>
                  <button
                    onClick={() => setStep("cart")}
                    className="text-xs text-[#6b7280] hover:text-[#374151] flex items-center gap-1"
                  >
                    ← Voltar
                  </button>
                  <span
                    className="font-semibold text-[#111827] text-sm"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    Entrega
                  </span>
                  <div className="w-14" />
                </>
              )}
              {step === "pagamento" && (
                <>
                  <button
                    onClick={() => setStep("endereco")}
                    className="text-xs text-[#6b7280] hover:text-[#374151] flex items-center gap-1"
                  >
                    ← Voltar
                  </button>
                  <span
                    className="font-semibold text-[#111827] text-sm"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    Pagamento
                  </span>
                  <div className="w-14" />
                </>
              )}
              {step === "confirmado" && <div className="w-full" />}
            </div>

            {step !== "confirmado" && (
              <div className="flex items-center px-5 py-2 border-b border-[#f3f4f6] gap-1">
                {[
                  ["cart", "Carrinho"],
                  ["endereco", "Entrega"],
                  ["pagamento", "Pagamento"],
                ].map(([value, label], index) => {
                  const steps = ["cart", "endereco", "pagamento"]

                  const current = steps.indexOf(step)

                  const mine = steps.indexOf(value)

                  return (
                    <div
                      key={value}
                      className="flex items-center flex-1 last:flex-none"
                    >
                      <span
                        className={`text-[11px] font-medium ${
                          mine <= current ? "text-[#16a34a]" : "text-[#d1d5db]"
                        }`}
                      >
                        {label}
                      </span>
                      {index < 2 && (
                        <ChevronRight
                          size={12}
                          className="mx-1 text-[#d1d5db] flex-shrink-0"
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            <div className="flex-1 overflow-y-auto">
              {step === "cart" && (
                <div className="p-4 space-y-2">
                  {cart.length === 0 ? (
                    <div className="text-center py-16 text-[#d1d5db]">
                      <ShoppingCart size={40} className="mx-auto mb-3" />
                      <p className="text-sm">Seu carrinho está vazio.</p>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-3 bg-[#fafafa] rounded-xl"
                      >
                        <div className="w-10 h-10 bg-[#f0fdf4] rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                          🛍️
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-[#374151] leading-tight truncate">
                            {item.nome}
                          </p>
                          <p className="text-xs text-[#9ca3af]">
                            R$ {item.preco.toFixed(2)} × {item.qty}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={() => updateQty(item.id, -1)}
                            className="w-6 h-6 flex items-center justify-center hover:bg-[#e5e7eb] rounded-md text-[#6b7280] transition-colors"
                          >
                            <Minus size={11} />
                          </button>
                          <span className="w-5 text-center text-xs font-bold text-[#111827]">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => updateQty(item.id, 1)}
                            className="w-6 h-6 flex items-center justify-center hover:bg-[#e5e7eb] rounded-md text-[#6b7280] transition-colors"
                          >
                            <Plus size={11} />
                          </button>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="w-6 h-6 flex items-center justify-center text-[#d1d5db] hover:text-red-400 transition-colors ml-1"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {step === "endereco" && (
                <div className="p-5 space-y-4">
                  {addresses.length === 0 ? (
                    <div className="p-4 border border-amber-200 bg-amber-50 rounded-xl text-sm text-amber-800">
                      Você precisa cadastrar um endereço antes de finalizar o
                      pedido.{" "}
                      <Link
                        to="/portal/perfil"
                        className="font-semibold underline"
                      >
                        Ir para o perfil
                      </Link>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        {addresses.map((address) => (
                          <button
                            key={address.id}
                            type="button"
                            onClick={() => setSelectedAddressId(address.id)}
                            className={`w-full p-4 border-2 rounded-xl text-left transition-all ${
                              (selectedAddressId ?? selectedAddress?.id) ===
                              address.id
                                ? "border-[#16a34a] bg-[#f0fdf4]"
                                : "border-[#e5e7eb]"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-semibold text-[#374151]">
                                {address.label || "Endereço"}
                              </span>
                              {(selectedAddressId ?? selectedAddress?.id) ===
                                address.id && (
                                <Check size={14} className="text-[#16a34a]" />
                              )}
                            </div>
                            <p className="text-sm text-[#374151] font-medium">
                              {address.street}, {address.number}
                              {address.complement
                                ? ` — ${address.complement}`
                                : ""}
                            </p>
                            <p className="text-xs text-[#9ca3af]">
                              {address.neighborhood}, {address.city} –{" "}
                              {address.state} · CEP {address.zip_code}
                            </p>
                          </button>
                        ))}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                          Observações de entrega
                        </label>
                        <input
                          type="text"
                          value={complemento}
                          onChange={(event) =>
                            setComplemento(event.target.value)
                          }
                          placeholder="Referência, portaria, bloco..."
                          className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-xl text-sm outline-none focus:border-[#16a34a] transition-colors"
                        />
                      </div>
                    </>
                  )}
                  <div className="bg-[#fafafa] rounded-xl p-3 border border-[#f3f4f6]">
                    <p className="text-xs font-semibold text-[#374151] mb-1">
                      Prazo estimado
                    </p>
                    <p className="text-sm text-[#111827]">2 a 4 dias úteis</p>
                    <p className="text-xs text-[#9ca3af] mt-0.5">
                      Frete grátis para pedidos acima de R$ 150,00
                    </p>
                  </div>
                </div>
              )}

              {step === "pagamento" && (
                <div className="p-5 space-y-4">
                  <div className="space-y-2">
                    {PAYMENT.map((method) => (
                      <button
                        key={method}
                        onClick={() => setPagamento(method)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${
                          pagamento === method
                            ? "border-[#16a34a] bg-[#f0fdf4]"
                            : "border-[#e5e7eb] hover:border-[#d1d5db]"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                            pagamento === method
                              ? "border-[#16a34a] bg-[#16a34a]"
                              : "border-[#d1d5db]"
                          }`}
                        >
                          {pagamento === method && (
                            <div className="w-full h-full rounded-full scale-50 bg-white" />
                          )}
                        </div>
                        <span className="text-sm font-medium text-[#374151]">
                          {method}
                        </span>
                        {method === "PIX" && (
                          <span className="ml-auto text-[10px] bg-[#dcfce7] text-[#15803d] px-2 py-0.5 rounded-full font-medium">
                            5% off
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="bg-[#f9fafb] rounded-xl p-4 space-y-2 border border-[#f3f4f6]">
                    <p className="text-xs font-semibold text-[#374151] mb-2">
                      Resumo do pedido
                    </p>
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-xs text-[#6b7280]"
                      >
                        <span className="truncate mr-2">
                          {item.nome} × {item.qty}
                        </span>
                        <span className="flex-shrink-0">
                          R$ {(item.preco * item.qty).toFixed(2)}
                        </span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-[#e5e7eb] flex justify-between font-bold text-[#111827]">
                      <span
                        style={{
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                        }}
                      >
                        Total
                      </span>
                      <span
                        style={{
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                        }}
                      >
                        R$ {displayTotal.toFixed(2)}
                      </span>
                    </div>
                    {pagamento === "PIX" && (
                      <p className="text-[11px] text-[#16a34a] font-medium">
                        Desconto de 5% aplicado no PIX 🎉
                      </p>
                    )}
                  </div>
                  {error && (
                    <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                      {error}
                    </p>
                  )}
                </div>
              )}

              {step === "confirmado" && (
                <div className="flex flex-col items-center justify-center h-full py-20 px-6 text-center">
                  <div className="w-20 h-20 rounded-full bg-[#dcfce7] flex items-center justify-center mb-5">
                    <Check size={36} className="text-[#16a34a]" />
                  </div>
                  <h2
                    className="text-xl font-bold text-[#111827] mb-2"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    Pedido realizado!
                  </h2>
                  <p className="text-sm text-[#6b7280] mb-4">
                    Recebemos sua solicitação. Você receberá uma confirmação por
                    e-mail em breve.
                  </p>
                  <div className="bg-[#f9fafb] rounded-xl p-4 w-full border border-[#f3f4f6] text-left space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#9ca3af]">Número do pedido</span>
                      <span className="font-semibold text-[#374151]">
                        #{orderId}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-[#9ca3af]">Pagamento</span>
                      <span className="font-semibold text-[#374151]">
                        {pagamento}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-[#9ca3af]">Prazo</span>
                      <span className="font-semibold text-[#374151]">
                        2 a 4 dias úteis
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-[#9ca3af] mt-5">
                    Esta janela fechará automaticamente...
                  </p>
                </div>
              )}
            </div>

            {step !== "confirmado" && (
              <div className="p-4 border-t border-[#f3f4f6]">
                {step === "cart" && cart.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-bold text-[#111827]">
                      <span>Total</span>
                      <span>R$ {total.toFixed(2)}</span>
                    </div>
                    <button
                      onClick={() => setStep("endereco")}
                      className="w-full py-3 bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold rounded-xl transition-colors"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      Continuar para entrega →
                    </button>
                  </div>
                )}
                {step === "endereco" && addresses.length > 0 && (
                  <button
                    onClick={() => setStep("pagamento")}
                    className="w-full py-3 bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold rounded-xl transition-colors"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    Continuar para pagamento →
                  </button>
                )}
                {step === "pagamento" && (
                  <button
                    onClick={confirmar}
                    disabled={submitting}
                    className="w-full py-3 bg-[#16a34a] hover:bg-[#15803d] disabled:opacity-60 text-white font-semibold rounded-xl transition-colors"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    {submitting ? "Processando..." : "Confirmar pedido"}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
