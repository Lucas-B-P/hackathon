const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000"

const TOKEN_KEY = "patinhas_access_token"

type ApiError = { error?: { message?: string } }

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()

  const response = await fetch(`${API_URL}${path}`, {
    ...options,

    headers: {
      "Content-Type": "application/json",

      ...(token ? { Authorization: `Bearer ${token}` } : {}),

      ...options.headers,
    },
  })

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as ApiError

    throw new Error(
      body.error?.message ?? "Não foi possível concluir a solicitação",
    )
  }

  if (response.status === 204) return undefined as T

  return response.json() as Promise<T>
}

export type AuthUser = { id: number nome: string email: string role: string }

export type LoginResponse = { token: string user: AuthUser }

export async function login(email: string, senha: string) {
  const result = await request<LoginResponse>("/auth/login", {
    method: "POST",

    body: JSON.stringify({ email, senha, contexto: "portal" }),
  })

  localStorage.setItem(TOKEN_KEY, result.token)

  return result
}

export function getMe() {
  return request<AuthUser>("/auth/me")
}

export type Profile = AuthUser & {
  name?: string
  cpf?: string
  phone?: string
  birth_date?: string
  avatar_url?: string
}

export function getProfile() {
  return request<Profile>("/portal/perfil")
}

export function updateProfile(data: {
  nome?: string
  cpf?: string
  telefone?: string
  nascimento?: string
}) {
  return request<Profile>("/portal/perfil", {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export type Preferences = {
  email_notifications: boolean
  sms_notifications: boolean
  appointment_reminders: boolean
  marketing_notifications: boolean
}

export function getPreferences() {
  return request<Preferences>("/portal/perfil/preferencias")
}

export function updatePreferences(data: Record<string, boolean>) {
  return request<Preferences>("/portal/perfil/preferencias", {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export function getClients() {
  return request("/admin/clientes")
}

export type AdminClient = {
  id: number
  nome: string
  email: string
  telefone: string
  status: string
  pets: number
  ultimaCompra: string
  ultimoAtendimento: string
}

export function getAdminClients() {
  return request<{ data: AdminClient[] }>("/admin/clientes")
}

export type AdminPet = {
  id: number
  name: string
  species: string
  breed?: string
  sex?: string
  birth_date?: string
  weight?: number
  photo_url?: string
  tutor: string
}

export function getAdminPets() {
  return request<{ data: AdminPet[] }>("/admin/pets")
}

export type AdminService = {
  id: number
  name: string
  description?: string
  duration_minutes: number
  price: number | string
  active: boolean
}

export function getAdminServices() {
  return request<{ data: AdminService[] }>("/admin/servicos")
}

export type GroomingAppointment = {
  id: number
  status: string
  starts_at: string
  notes?: string
  pet: string
  tutor: string
  service: string
  employee: string
}

export function getGroomingQueue() {
  return request<{ data: GroomingAppointment[] }>("/admin/banho-tosa")
}

export function updateGroomingStatus(id: number, status: string) {
  return request<GroomingAppointment>(`/admin/banho-tosa/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  })
}

export function updateGroomingNotes(id: number, notes: string) {
  return request<GroomingAppointment>(`/admin/banho-tosa/${id}/observacoes`, {
    method: "PATCH",
    body: JSON.stringify({ notes }),
  })
}

export type VeterinaryAppointment = {
  id: number
  status: string
  starts_at: string
  notes?: string
  pet: string
  tutor: string
  type: string
  veterinarian: string
}

export function getVeterinaryAppointments() {
  return request<{ data: VeterinaryAppointment[] }>("/admin/veterinario")
}

export type AdminFinance = {
  entries: Array<{
    id: number
    type: string
    description: string
    category: string
    amount: number | string
    due_date: string
    status: string
    payment_method?: string
  }>
  revenue: Array<{ month: string revenue: number | string }>
  summary: {
    revenue: number
    expenses: number
    profit: number
    receivable: number
    payable: number
  }
}

export function getAdminFinance() {
  return request<{ data: AdminFinance }>("/admin/financeiro")
}

export type AdminEmployee = {
  id: number
  name: string
  email: string
  phone?: string
  role: string
  status: string
}

export function getAdminEmployees() {
  return request<{ data: AdminEmployee[] }>("/admin/funcionarios")
}

export type AdminReports = {
  revenue: Array<{ mes: string receita: number despesas: number }>
  services: Array<{ name: string value: number }>
}

export function getAdminReports() {
  return request<{ data: AdminReports }>("/admin/relatorios")
}

export type AdminSettings = {
  shop: Record<string, string | null> | null
  notifications: Record<string, boolean> | null
  appearance: { theme: string primary_color?: string | null } | null
}

export function getAdminSettings() {
  return request<{ data: AdminSettings }>("/admin/configuracoes")
}

export function updateAdminShopSettings(data: Record<string, string>) {
  return request<{ data: AdminSettings["shop"] }>("/admin/configuracoes/shop", {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export function createVeterinaryAppointment(data: {
  ownerId: number
  petId: number
  serviceId: number
  startsAt: string
  notes?: string
}) {
  return request<VeterinaryAppointment>("/admin/veterinario", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export function getProducts() {
  return request("/admin/produtos")
}

export type AdminProduct = {
  id: number
  name: string
  sku: string
  category: string
  stock: number
  minimum_stock: number
  cost: number | string
  sale_price: number | string
  active: boolean
}

export function getAdminProducts() {
  return request<{ data: AdminProduct[] }>("/admin/produtos")
}

export type AdminStock = {
  products: Array<{
    id: number
    name: string
    sku: string
    stock: number
    minimum_stock: number
    cost: number | string
  }>
  movements: Array<{
    id: number
    product: string
    type: string
    quantity: number
    reason?: string
    created_at: string
  }>
  summary: { total: number low: number zero: number value: number }
}

export function getAdminStock() {
  return request<{ data: AdminStock }>("/admin/estoque")
}

export type AdminDashboard = {
  kpis: {
    salesToday: number
    monthlyRevenue: number
    appointmentsToday: number
    appointmentsActive: number
    activeClients: number
    newClientsThisMonth: number
    lowStock: number
  }
  revenue: Array<{ month: string revenue: number | string }>
  categories: Array<{ name: string total: number | string }>
  agenda: Array<{
    id: number
    time: string
    status: string
    pet: string
    service: string
  }>
  lowStock: Array<{
    id: number
    name: string
    category: string
    sku: string
    stock: number
    minimum_stock: number
  }>
}

export function getAdminDashboard() {
  return request<{ data: AdminDashboard }>("/admin/dashboard")
}

export type AdminAppointment = {
  id: number
  horario: string
  status: string
  pet: string
  servico: string
  tutor: string
  funcionario: string
}

export function getAdminAppointments(
  date = new Date().toISOString().slice(0, 10),
) {
  return request<{ data: AdminAppointment[] }>(
    `/admin/agendamentos?data=${date}`,
  )
}

export function createAdminSale(data: {
  itens: Array<{ produtoId: number quantidade: number }>
  formaPagamento: string
}) {
  return request("/admin/vendas", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export type AdminOrder = {
  id: number
  status: string
  total: number | string
  payment_method?: string
  created_at: string
  customer: string
  products: string
}

export function getAdminOrders() {
  return request<{ data: AdminOrder[] }>("/admin/pedidos")
}

export function updateAdminOrderStatus(id: number, status: string) {
  return request<AdminOrder>(`/admin/pedidos/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  })
}

export type Address = {
  id: number
  label?: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zip_code: string
  is_primary: boolean
}

export type AddressInput = {
  rotulo?: string
  logradouro: string
  numero: string
  complemento?: string
  bairro: string
  cidade: string
  uf: string
  cep: string
  principal?: boolean
}

export function getAddresses() {
  return request<{ data: Address[] }>("/portal/perfil/enderecos")
}

export function createAddress(data: AddressInput) {
  return request<Address>("/portal/perfil/enderecos", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export function updateAddress(id: number, data: AddressInput) {
  return request<Address>(`/portal/perfil/enderecos/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export function deleteAddress(id: number) {
  return request<void>(`/portal/perfil/enderecos/${id}`, { method: "DELETE" })
}

export type Pet = {
  id: number
  name: string
  species: string
  breed?: string
  sex?: string
  birth_date?: string
  weight?: number
  notes?: string
}

export function getPets() {
  return request<{ data: Pet[] }>("/portal/pets")
}

export function createPet(data: Record<string, string>) {
  return request<Pet>("/portal/pets", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export type PetHistoryItem = {
  id: number
  type: string
  description: string
  occurred_at: string
}

export function getPetHistory(id: number) {
  return request<{ data: PetHistoryItem[] }>(`/portal/pets/${id}/historico`)
}

export type Service = {
  id: number
  name: string
  description?: string
  duration_minutes: number
  price: number
}

export type Appointment = {
  id: number
  starts_at: string
  status: string
  pet_name: string
  service_name: string
  price: number
}

export function getServices() {
  return request<{ data: Service[] }>("/portal/servicos")
}

export function getAvailableTimes(data: string) {
  return request<{ data: string[] }>(
    `/portal/agendamentos/horarios-disponiveis?data=${data}`,
  )
}

export function createAppointment(data: {
  petId: number
  servicoId: number
  dataHora: string
  observacoes?: string
}) {
  return request<Appointment>("/portal/agendamentos", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export function getAppointments() {
  return request<{ data: Appointment[] }>("/portal/agendamentos")
}

export function cancelAppointment(id: number) {
  return request<void>(`/portal/agendamentos/${id}/cancelar`, {
    method: "POST",
  })
}

export type Order = {
  id: number
  status: string
  total: number | string
  created_at: string
  products: string
}

export function getOrders() {
  return request<{ data: Order[] }>("/portal/pedidos")
}

export function getOrder(id: number) {
  return request<Order & { items: unknown[] }>(`/portal/pedidos/${id}`)
}

export function cancelOrder(id: number) {
  return request<void>(`/portal/pedidos/${id}/cancelar`, { method: "POST" })
}

export type Notification = {
  id: number
  type: string
  title: string
  description: string
  read_at?: string | null
  created_at: string
}

export function getNotifications() {
  return request<{ data: Notification[] unreadCount: number }>(
    "/portal/notificacoes",
  )
}

export function markNotificationRead(id: number) {
  return request<void>(`/portal/notificacoes/${id}/lida`, { method: "PATCH" })
}

export function markAllNotificationsRead() {
  return request<void>("/portal/notificacoes/ler-todas", { method: "PATCH" })
}

export function createOrder(data: {
  itens: Array<{ produtoId: number quantidade: number }>
  enderecoId: number
  formaPagamento: string
  observacoes?: string
}) {
  return request<Order & { items: unknown[] }>("/portal/pedidos", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export type StoreProduct = {
  id: number
  name: string
  sku: string
  category: string
  stock: number
  sale_price: number
  icon?: string
  image_url?: string
}
export async function getStoreProducts(
  params: string | { q?: string categoria?: string } = "",
) {
  const search = new URLSearchParams()
  if (typeof params === "string" && params) search.set("q", params)
  if (typeof params !== "string") {
    if (params.q) search.set("q", params.q)
    if (params.categoria && params.categoria !== "Todos")
      search.set("categoria", params.categoria)
  }
  const query = search.toString()
  return request<{ data: StoreProduct[] }>(
    `/portal/loja/produtos${query ? `?${query}` : ""}`,
  )
}
export function changePassword(senhaAtual: string, novaSenha: string) {
  return request<void>("/portal/perfil/senha", {
    method: "PATCH",
    body: JSON.stringify({ senhaAtual, novaSenha }),
  })
}

export function register(data: {
  nome: string
  email: string
  senha: string
  cpf?: string
  telefone?: string
  nascimento?: string
}) {
  return request<LoginResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  })
}
export function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}
export function toNumber(value: number | string | null | undefined) {
  return Number(value ?? 0)
}
export function formatDatePt(value?: string | null) {
  return value ? new Date(value).toLocaleDateString("pt-BR") : "-"
}
export function formatTimeFromIso(value?: string | null) {
  return value
    ? new Date(value).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-"
}
export function formatRelativeTime(value: string) {
  return formatDatePt(value)
}
export function displayOrderStatus(status: string) {
  return status
}
export function displayCategory(category: string) {
  return category
}
export function productEmoji(category: string) {
  return category === "Brinquedos"
    ? "🎾"
    : category === "Saúde"
      ? "💊"
      : category === "Higiene"
        ? "🧴"
        : "🛍️"
}
export function getStoreCategories() {
  return request<{ data: string[] }>("/portal/loja/categorias")
}
