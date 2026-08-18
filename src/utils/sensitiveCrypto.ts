const ENCRYPTED_PREFIX = "enc:v1:"

function resolveKeyMaterial() {
  const configured = import.meta.env.VITE_SENSITIVE_DATA_KEY

  if (configured) {
    const raw = Uint8Array.from(atob(configured), (char) => char.charCodeAt(0))

    if (raw.length !== 32) {
      throw new Error(
        "VITE_SENSITIVE_DATA_KEY deve ser uma string base64 de 32 bytes",
      )
    }

    return raw
  }

  throw new Error("VITE_SENSITIVE_DATA_KEY não configurada")
}

function toBase64Url(bytes: Uint8Array) {
  let binary = ""

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function fromBase64Url(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/")

  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4)

  const binary = atob(padded)

  return Uint8Array.from(binary, (char) => char.charCodeAt(0))
}

async function importKey() {
  return crypto.subtle.importKey(
    "raw",
    resolveKeyMaterial(),
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"],
  )
}

export function isEncryptedValue(value: unknown) {
  return typeof value === "string" && value.startsWith(ENCRYPTED_PREFIX)
}

export async function encryptSensitive(value: string) {
  if (!value || isEncryptedValue(value)) return value

  const key = await importKey()

  const iv = crypto.getRandomValues(new Uint8Array(12))

  const encoded = new TextEncoder().encode(value)

  const cipher = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoded,
  )

  const payload = new Uint8Array(iv.length + cipher.byteLength)

  payload.set(iv, 0)

  payload.set(new Uint8Array(cipher), iv.length)

  return `${ENCRYPTED_PREFIX}${toBase64Url(payload)}`
}

export async function decryptSensitive(value: string) {
  if (!value || !isEncryptedValue(value)) return value

  const key = await importKey()

  const payload = fromBase64Url(value.slice(ENCRYPTED_PREFIX.length))

  const iv = payload.slice(0, 12)

  const cipherWithTag = payload.slice(12)

  const plain = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    cipherWithTag,
  )

  return new TextDecoder().decode(plain)
}

export async function encryptRegisterPayload(data: {
  nome: string

  email: string

  senha: string

  cpf: string

  telefone: string

  nascimento: string
}) {
  return {
    ...data,

    cpf: await encryptSensitive(data.cpf),

    telefone: await encryptSensitive(data.telefone),

    nascimento: await encryptSensitive(data.nascimento),
  }
}

export async function encryptProfilePayload(data: {
  nome?: string

  cpf?: string

  telefone?: string

  nascimento?: string
}) {
  const next = { ...data }

  if (next.cpf) next.cpf = await encryptSensitive(next.cpf)

  if (next.telefone) next.telefone = await encryptSensitive(next.telefone)

  if (next.nascimento) next.nascimento = await encryptSensitive(next.nascimento)

  return next
}

export async function decryptProfilePayload<T extends {
  cpf?: string
  phone?: string
  birth_date?: string
},>(profile: T) {
  return {
    ...profile,

    cpf: profile.cpf ? await decryptSensitive(profile.cpf) : profile.cpf,

    phone: profile.phone
      ? await decryptSensitive(profile.phone)
      : profile.phone,

    birth_date: profile.birth_date
      ? await decryptSensitive(profile.birth_date)
      : profile.birth_date,
  }
}
