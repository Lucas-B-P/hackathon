import {
  decryptProfilePayload,
  encryptProfilePayload,
  encryptRegisterPayload,
} from "../utils/sensitiveCrypto";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
const TOKEN_KEY = "patinhas_access_token";

function parseError(body: unknown): string {
  if (!body || typeof body !== "object") return "Não foi possível concluir a solicitação";
  const record = body as Record<string, unknown>;
  if (record.error && typeof record.error === "object" && record.error !== null && "message" in record.error) {
    return String((record.error as { message?: string }).message);
  }
  if (typeof record.message === "string") return record.message;
  return "Não foi possível concluir a solicitação";
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(parseError(body));
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export function displayOrderStatus(status: string) {
  if (status === "Em preparacao") return "Em preparação";
  return status;
}

export function displayCategory(category: string) {
  const map: Record<string, string> = {
    Alimentacao: "Alimentação",
    Saude: "Saúde",
    Acessorios: "Acessórios",
  };
  return map[category] ?? category;
}

export function productEmoji(category: string) {
  const label = displayCategory(category);
  if (label === "Alimentação") return "🥩";
  if (label === "Higiene") return "🧴";
  if (label === "Saúde") return "💊";
  if (label === "Brinquedos") return "🎾";
  return "🛍️";
}

export function formatDatePt(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("pt-BR");
}

export function formatTimeFromIso(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

export function formatRelativeTime(value: string) {
  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Agora";
  if (minutes < 60) return `Há ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Há ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Ontem";
  return `Há ${days} dias`;
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function toNumber(value: string | number) {
  return typeof value === "number" ? value : Number(value);
}

export type AuthUser = { id: number; nome: string; email: string; role: string };
export type LoginResponse = { token: string; user: AuthUser };
export type Profile = {
  id: number;
  name: string;
  email: string;
  cpf?: string;
  phone?: string;
  birth_date?: string;
  avatar_url?: string;
  role?: string;
};
export type Address = {
  id: number;
  label?: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  is_primary: boolean;
};
export type AddressInput = {
  rotulo?: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
  principal?: boolean;
};
export type Pet = {
  id: number;
  name: string;
  species: string;
  breed?: string;
  sex?: string;
  birth_date?: string;
  weight?: number;
  notes?: string;
};
export type PetHistory = {
  id: number;
  type: string;
  description: string;
  occurred_at: string;
  metadata?: unknown;
};
export type Service = {
  id: number;
  name: string;
  description?: string;
  duration_minutes: number;
  price: string | number;
};
export type Appointment = {
  id: number;
  starts_at: string;
  status: string;
  notes?: string;
  pet_name: string;
  service_name: string;
  price: string | number;
};
export type StoreProduct = {
  id: number;
  name: string;
  sku: string;
  category: string;
  stock: number;
  sale_price: string | number;
  icon?: string;
  image_url?: string;
};
export type Order = {
  id: number;
  status: string;
  total: string | number;
  created_at: string;
  products: string;
};
export type OrderItemInput = { produtoId: number; quantidade: number };
export type Notification = {
  id: number;
  type: string;
  title: string;
  description: string;
  read_at: string | null;
  created_at: string;
};
export type Preferences = {
  email_notifications: boolean;
  sms_notifications: boolean;
  appointment_reminders: boolean;
  marketing_notifications: boolean;
};

export async function login(email: string, senha: string) {
  const result = await request<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, senha, contexto: "portal" }),
  });
  localStorage.setItem(TOKEN_KEY, result.token);
  return result;
}

export async function register(data: {
  nome: string;
  email: string;
  senha: string;
  cpf: string;
  telefone: string;
  nascimento: string;
}) {
  const payload = await encryptRegisterPayload(data);
  const result = await request<LoginResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  localStorage.setItem(TOKEN_KEY, result.token);
  return result;
}

export function getMe() {
  return request<AuthUser>("/auth/me");
}

export async function getProfile() {
  const profile = await request<Profile>("/portal/perfil");
  return decryptProfilePayload(profile);
}

export async function updateProfile(data: { nome?: string; cpf?: string; telefone?: string; nascimento?: string }) {
  const payload = await encryptProfilePayload(data);
  const profile = await request<Profile>("/portal/perfil", { method: "PATCH", body: JSON.stringify(payload) });
  return decryptProfilePayload(profile);
}

export function getAddresses() {
  return request<{ data: Address[] }>("/portal/perfil/enderecos");
}

export function createAddress(data: AddressInput) {
  return request<Address>("/portal/perfil/enderecos", { method: "POST", body: JSON.stringify(data) });
}

export function updateAddress(id: number, data: AddressInput) {
  return request<Address>(`/portal/perfil/enderecos/${id}`, { method: "PATCH", body: JSON.stringify(data) });
}

export function deleteAddress(id: number) {
  return request<void>(`/portal/perfil/enderecos/${id}`, { method: "DELETE" });
}

export function getPreferences() {
  return request<Preferences>("/portal/perfil/preferencias");
}

export function updatePreferences(data: Partial<Record<"emailNotifications" | "smsNotifications" | "appointmentReminders" | "marketingNotifications", boolean>>) {
  return request<Preferences>("/portal/perfil/preferencias", { method: "PATCH", body: JSON.stringify(data) });
}

export function changePassword(senhaAtual: string, novaSenha: string) {
  return request<void>("/portal/perfil/senha", { method: "PATCH", body: JSON.stringify({ senhaAtual, novaSenha }) });
}

export function getPets() {
  return request<{ data: Pet[] }>("/portal/pets");
}

export function createPet(data: Record<string, string>) {
  return request<Pet>("/portal/pets", { method: "POST", body: JSON.stringify(data) });
}

export function getPetHistory(petId: number) {
  return request<{ data: PetHistory[] }>(`/portal/pets/${petId}/historico`);
}

export function getServices() {
  return request<{ data: Service[] }>("/portal/servicos");
}

export function getAvailableTimes(data: string) {
  return request<{ data: string[] }>(`/portal/agendamentos/horarios-disponiveis?data=${encodeURIComponent(data)}`);
}

export function getAppointments() {
  return request<{ data: Appointment[] }>("/portal/agendamentos");
}

export function createAppointment(data: { petId: number; servicoId: number; dataHora: string; observacoes?: string }) {
  return request<Appointment>("/portal/agendamentos", { method: "POST", body: JSON.stringify(data) });
}

export function cancelAppointment(id: number) {
  return request<void>(`/portal/agendamentos/${id}/cancelar`, { method: "POST" });
}

export function getStoreProducts(params?: { q?: string; categoria?: string }) {
  const search = new URLSearchParams();
  if (params?.q) search.set("q", params.q);
  if (params?.categoria && params.categoria !== "Todos") search.set("categoria", params.categoria);
  const query = search.toString();
  return request<{ data: StoreProduct[] }>(`/portal/loja/produtos${query ? `?${query}` : ""}`);
}

export function getStoreCategories() {
  return request<{ data: string[] }>("/portal/loja/categorias");
}

export function getOrders() {
  return request<{ data: Order[] }>("/portal/pedidos");
}

export function createOrder(data: {
  itens: OrderItemInput[];
  enderecoId: number;
  formaPagamento?: string;
  observacoes?: string;
}) {
  return request<{ id: number; status: string; total: string | number }>("/portal/pedidos", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getNotifications() {
  return request<{ data: Notification[]; unreadCount: number }>("/portal/notificacoes");
}

export function markNotificationRead(id: number) {
  return request<void>(`/portal/notificacoes/${id}/lida`, { method: "PATCH" });
}

export function markAllNotificationsRead() {
  return request<void>("/portal/notificacoes/ler-todas", { method: "PATCH" });
}

export function getClients() {
  return request("/admin/clientes");
}

export function getProducts() {
  return request("/admin/produtos");
}
