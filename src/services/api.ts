const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
const TOKEN_KEY = "patinhas_access_token";

type ApiError = { error?: { message?: string } };

export function getToken() { return localStorage.getItem(TOKEN_KEY); }
export function clearToken() { localStorage.removeItem(TOKEN_KEY); }

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
    const body = (await response.json().catch(() => ({}))) as ApiError;
    throw new Error(body.error?.message ?? "Não foi possível concluir a solicitação");
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export type AuthUser = { id: number; nome: string; email: string; role: string };
export type LoginResponse = { token: string; user: AuthUser };

export async function login(email: string, senha: string) {
  const result = await request<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, senha, contexto: "portal" }),
  });
  localStorage.setItem(TOKEN_KEY, result.token);
  return result;
}

export function getMe() {
  return request<AuthUser>("/auth/me");
}
export type Profile = AuthUser & { cpf?: string; phone?: string; birth_date?: string; avatar_url?: string };
export function getProfile() { return request<Profile>("/portal/perfil"); }
export function updateProfile(data: { nome?: string; cpf?: string; telefone?: string; nascimento?: string }) { return request<Profile>("/portal/perfil", { method: "PATCH", body: JSON.stringify(data) }); }

export function getClients() { return request("/admin/clientes"); }
export function getProducts() { return request("/admin/produtos"); }
export type Address = { id: number; label?: string; street: string; number: string; complement?: string; neighborhood: string; city: string; state: string; zip_code: string; is_primary: boolean };
export type AddressInput = { rotulo?: string; logradouro: string; numero: string; complemento?: string; bairro: string; cidade: string; uf: string; cep: string; principal?: boolean };
export function getAddresses() { return request<{ data: Address[] }>("/portal/perfil/enderecos"); }
export function createAddress(data: AddressInput) { return request<Address>("/portal/perfil/enderecos", { method: "POST", body: JSON.stringify(data) }); }
export function updateAddress(id: number, data: AddressInput) { return request<Address>(`/portal/perfil/enderecos/${id}`, { method: "PATCH", body: JSON.stringify(data) }); }
export function deleteAddress(id: number) { return request<void>(`/portal/perfil/enderecos/${id}`, { method: "DELETE" }); }
export type Pet = { id: number; name: string; species: string; breed?: string; sex?: string; birth_date?: string; weight?: number; notes?: string };
export function getPets() { return request<{ data: Pet[] }>("/portal/pets"); }
export function createPet(data: Record<string, string>) { return request<Pet>("/portal/pets", { method: "POST", body: JSON.stringify(data) }); }
export function changePassword(senhaAtual: string, novaSenha: string) { return request<void>("/portal/perfil/senha", { method: "PATCH", body: JSON.stringify({ senhaAtual, novaSenha }) }); }
