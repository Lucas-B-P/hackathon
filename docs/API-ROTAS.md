# Petzio ERP — Especificação de Rotas (Backend)

Documento de referência para implementação do backend. Derivado das telas do front (`src/routes.ts`, `src/pages/**`) e do brief do protótipo.

**Base sugerida:** `https://api.{dominio}/v1`  
**Auth:** Bearer JWT (ou cookie httpOnly). Roles: `admin`, `gerente`, `atendente`, `caixa`, `tosador`, `veterinario`, `cliente`.  
**Formato:** JSON (`Content-Type: application/json`). Datas em ISO-8601 (`2026-08-15T14:30:00-03:00`). Valores monetários em decimal (`149.90`).

**Convenções de resposta:**

```json
{ "data": {}, "meta": { "page": 1, "perPage": 20, "total": 100 } }
```

Erros:

```json
{ "error": { "code": "VALIDATION_ERROR", "message": "...", "details": [] } }
```

**Escopos:**

| Prefixo | Quem usa | Origem no front |
|---------|----------|-----------------|
| `/auth` | Todos | Login |
| `/admin/*` | Funcionários do pet shop | `/admin/*` |
| `/portal/*` | Tutor autenticado | `/portal/*` |
| Recursos compartilhados | Admin (CRUD) / Portal (leitura filtrada) | — |

---

## 0. Rotas do Front (contexto)

### Público
| Método UI | Path |
|-----------|------|
| Login | `/` |

### Admin (`/admin`)
| Tela | Path |
|------|------|
| Dashboard | `/admin` |
| Agenda | `/admin/agenda` |
| Vendas / PDV | `/admin/vendas` |
| Pedidos | `/admin/pedidos` |
| Produtos | `/admin/produtos` |
| Estoque | `/admin/estoque` |
| Clientes | `/admin/clientes` |
| Pets | `/admin/pets` |
| Serviços | `/admin/servicos` |
| Banho e Tosa | `/admin/banho-tosa` |
| Veterinário | `/admin/veterinario` |
| Financeiro | `/admin/financeiro` |
| Funcionários | `/admin/funcionarios` |
| Relatórios | `/admin/relatorios` |
| Configurações | `/admin/configuracoes` |

### Portal do cliente (`/portal`)
| Tela | Path |
|------|------|
| Início | `/portal` |
| Meus Pets | `/portal/meus-pets` |
| Agendamento | `/portal/agendamento` |
| Loja | `/portal/loja` |
| Pedidos | `/portal/pedidos` |
| Perfil | `/portal/perfil` |

> O front ainda não tem login admin separado nem detalhe de cliente/pet como rota. O backend **deve** prever esses endpoints para o sistema funcionar de ponta a ponta.

---

## 1. Autenticação e sessão

| Método | Rota | Descrição | Body / Query | Resposta esperada |
|--------|------|-----------|--------------|-------------------|
| `POST` | `/auth/login` | Login (admin ou cliente) | `{ email, senha, lembrar?, contexto?: "admin" \| "portal" }` | `{ token, refreshToken?, user: { id, nome, email, role, petShopId? } }` |
| `POST` | `/auth/logout` | Encerra sessão | — | `204` |
| `POST` | `/auth/refresh` | Renova token | `{ refreshToken }` | `{ token }` |
| `POST` | `/auth/forgot-password` | Esqueci minha senha | `{ email }` | `204` |
| `POST` | `/auth/reset-password` | Redefine senha | `{ token, novaSenha }` | `204` |
| `GET` | `/auth/me` | Usuário autenticado | — | `{ id, nome, email, role, avatarUrl?, cargo? }` |
| `PATCH` | `/auth/me/password` | Alterar senha logado | `{ senhaAtual, novaSenha }` | `204` |

**Roles e destino pós-login:**
- `cliente` → portal
- demais → admin

---

## 2. Dashboard Admin

Usado por: `/admin` (`Dashboard.tsx`)

| Método | Rota | Descrição | Query |
|--------|------|-----------|-------|
| `GET` | `/admin/dashboard/kpis` | Cards do topo | `data?` (default: hoje) |
| `GET` | `/admin/dashboard/faturamento` | Série receita × despesas | `periodo=mes\|trimestre\|ano` |
| `GET` | `/admin/dashboard/vendas-por-categoria` | Pizza de categorias | `periodo?` |
| `GET` | `/admin/dashboard/servicos-mais-realizados` | Ranking de serviços | `periodo?, limite?` |
| `GET` | `/admin/dashboard/produtos-mais-vendidos` | Ranking de produtos | `periodo?, limite?` |
| `GET` | `/admin/dashboard/agenda-hoje` | Lista de agendamentos do dia | `data?` |
| `GET` | `/admin/dashboard/estoque-baixo` | Produtos ≤ estoque mínimo | — |

**Shape KPIs sugerido:**

```json
{
  "vendasHoje": { "valor": 1847.00, "variacaoPct": 12 },
  "faturamentoMes": { "valor": 22100.00, "meta": 28000.00 },
  "agendamentosHoje": { "total": 7, "emAtendimento": 2 },
  "clientesAtivos": { "total": 847, "novosMes": 14 },
  "estoqueBaixo": { "total": 4 },
  "contasReceber": { "valor": 539.00, "diasProximosVencimento": 5 }
}
```

---

## 3. Agenda (Admin)

Usado por: `/admin/agenda`

| Método | Rota | Descrição | Query / Body |
|--------|------|-----------|--------------|
| `GET` | `/admin/agendamentos` | Lista (dia/semana/mês) | `inicio`, `fim`, `status?`, `funcionarioId?`, `servicoId?` |
| `GET` | `/admin/agendamentos/:id` | Detalhe | — |
| `POST` | `/admin/agendamentos` | Novo agendamento | `{ clienteId, petId, servicoId, funcionarioId, dataHora, observacoes? }` |
| `PATCH` | `/admin/agendamentos/:id` | Editar | campos parciais |
| `PATCH` | `/admin/agendamentos/:id/status` | Mudar status | `{ status }` |
| `DELETE` | `/admin/agendamentos/:id` | Cancelar / remover | — |
| `GET` | `/admin/agendamentos/horarios-disponiveis` | Slots livres | `data`, `servicoId`, `funcionarioId?` |

**Status da agenda:** `Agendado` | `Confirmado` | `Em atendimento` | `Concluído` | `Cancelado`

---

## 4. Clientes (Admin)

Usado por: `/admin/clientes` (+ detalhe previsto no brief)

| Método | Rota | Descrição | Query / Body |
|--------|------|-----------|--------------|
| `GET` | `/admin/clientes` | Listagem | `q?` (nome/telefone), `status?`, `page?`, `perPage?` |
| `GET` | `/admin/clientes/:id` | Detalhe completo | — |
| `POST` | `/admin/clientes` | Novo cliente | `{ nome, telefone, email, cpf?, endereco?, observacoes? }` |
| `PATCH` | `/admin/clientes/:id` | Atualizar | campos parciais |
| `PATCH` | `/admin/clientes/:id/status` | Ativo / Inativo | `{ status }` |
| `GET` | `/admin/clientes/:id/pets` | Pets do tutor | — |
| `GET` | `/admin/clientes/:id/compras` | Histórico de compras | `page?` |
| `GET` | `/admin/clientes/:id/servicos` | Histórico de serviços | `page?` |
| `GET` | `/admin/clientes/:id/agendamentos` | Agendamentos | `page?` |
| `GET` | `/admin/clientes/:id/financeiro` | Lançamentos ligados ao cliente | — |

**Listagem (campos da tabela):** `id`, `nome`, `telefone`, `email`, `qtdPets`, `ultimaCompra`, `ultimoAtendimento`, `status`

---

## 5. Pets (Admin)

Usado por: `/admin/pets`

| Método | Rota | Descrição | Query / Body |
|--------|------|-----------|--------------|
| `GET` | `/admin/pets` | Listagem | `q?`, `especie?`, `tutorId?`, `page?` |
| `GET` | `/admin/pets/:id` | Perfil completo | — |
| `POST` | `/admin/pets` | Novo pet | `{ tutorId, nome, especie, raca, sexo, nascimento, peso?, observacoes?, fotoUrl? }` |
| `PATCH` | `/admin/pets/:id` | Atualizar | campos parciais |
| `DELETE` | `/admin/pets/:id` | Remover / arquivar | — |
| `GET` | `/admin/pets/:id/historico` | Histórico unificado | `tipo?` = `banho\|tosa\|consulta\|vacina\|produto\|agendamento` |
| `POST` | `/admin/pets/:id/observacoes` | Adicionar observação | `{ texto }` |

---

## 6. Produtos (Admin)

Usado por: `/admin/produtos`, PDV, Loja

| Método | Rota | Descrição | Query / Body |
|--------|------|-----------|--------------|
| `GET` | `/admin/produtos` | Listagem | `q?`, `categoria?`, `status?`, `page?` |
| `GET` | `/admin/produtos/:id` | Detalhe | — |
| `POST` | `/admin/produtos` | Novo produto | ver body abaixo |
| `PATCH` | `/admin/produtos/:id` | Atualizar | campos parciais |
| `PATCH` | `/admin/produtos/:id/status` | Ativo / Inativo | `{ status }` |
| `GET` | `/admin/produtos/categorias` | Lista de categorias | — |

**Body criar/editar:**

```json
{
  "nome": "Ração Premium Golden 15kg",
  "sku": "RAC-001",
  "codigoBarras": null,
  "categoria": "Alimentacao",
  "marca": "Golden",
  "custo": 89.90,
  "venda": 149.90,
  "estoque": 42,
  "estoqueMin": 10,
  "fornecedorId": null,
  "descricao": "",
  "fotoUrl": null,
  "status": "Ativo"
}
```

**Categorias usadas no front:** `Alimentação`, `Higiene`, `Saúde`, `Brinquedos`, `Acessórios`

---

## 7. Estoque (Admin)

Usado por: `/admin/estoque`

| Método | Rota | Descrição | Query / Body |
|--------|------|-----------|--------------|
| `GET` | `/admin/estoque/resumo` | Totais do painel | — |
| `GET` | `/admin/estoque/movimentacoes` | Histórico | `produtoId?`, `tipo?`, `de?`, `ate?`, `page?` |
| `POST` | `/admin/estoque/movimentacoes` | Nova movimentação | `{ produtoId, tipo, quantidade, motivo }` |

**Tipos:** `Entrada` | `Saída` | `Ajuste` | `Perda`

**Resumo:**

```json
{
  "estoqueTotalUnidades": 106,
  "produtosEstoqueBaixo": 4,
  "produtosSemEstoque": 1,
  "valorTotalEstoque": 8450.50
}
```

> Venda PDV e pedido da loja devem gerar `Saída` automaticamente.

---

## 8. Vendas / PDV (Admin)

Usado por: `/admin/vendas`

| Método | Rota | Descrição | Body |
|--------|------|-----------|------|
| `GET` | `/admin/vendas` | Histórico de vendas | query: `de?`, `ate?`, `page?` |
| `GET` | `/admin/vendas/:id` | Detalhe da venda | — |
| `POST` | `/admin/vendas` | Finalizar venda (PDV) | ver abaixo |
| `POST` | `/admin/vendas/:id/cancelar` | Cancelar venda | `{ motivo? }` |

**Body finalizar:**

```json
{
  "clienteId": null,
  "itens": [
    { "produtoId": 1, "quantidade": 2, "precoUnitario": 149.90, "desconto": 0 }
  ],
  "descontoTotal": 0,
  "pagamentos": [
    { "forma": "PIX", "valor": 299.80 }
  ],
  "observacoes": null
}
```

**Formas de pagamento:** `Dinheiro` | `PIX` | `Cartão Débito` | `Cartão Crédito` (múltiplas permitidas)

**Efeitos colaterais obrigatórios:** baixar estoque, criar conta a receber (se pendente), registrar venda nos relatórios.

---

## 9. Pedidos (Admin + Portal)

Pedidos da loja online / delivery. Telas: `/admin/pedidos`, `/portal/pedidos`, checkout em `/portal/loja`.

### Admin

| Método | Rota | Descrição | Query / Body |
|--------|------|-----------|--------------|
| `GET` | `/admin/pedidos` | Todos os pedidos | `status?`, `q?`, `de?`, `ate?`, `page?` |
| `GET` | `/admin/pedidos/:id` | Detalhe | — |
| `PATCH` | `/admin/pedidos/:id/status` | Avançar status | `{ status }` |
| `POST` | `/admin/pedidos/:id/cancelar` | Cancelar | `{ motivo? }` |

### Portal (cliente autenticado)

| Método | Rota | Descrição | Body |
|--------|------|-----------|------|
| `GET` | `/portal/pedidos` | Meus pedidos | `status?`, `page?` |
| `GET` | `/portal/pedidos/:id` | Detalhe / rastreio | — |
| `POST` | `/portal/pedidos` | Checkout da loja | ver abaixo |
| `POST` | `/portal/pedidos/:id/cancelar` | Cancelar (se permitido) | `{ motivo? }` |

**Status do pedido:** `Recebido` | `Em preparação` | `Pronto` | `Saiu para entrega` | `Entregue` | `Cancelado`

**Body checkout portal:**

```json
{
  "itens": [{ "produtoId": 1, "quantidade": 1 }],
  "enderecoId": 10,
  "formaPagamento": "PIX",
  "observacoes": null
}
```

---

## 10. Serviços (Admin)

Usado por: `/admin/servicos`, agendamento admin/portal

| Método | Rota | Descrição | Body |
|--------|------|-----------|------|
| `GET` | `/admin/servicos` | Listagem | `status?`, `q?` |
| `GET` | `/admin/servicos/:id` | Detalhe | — |
| `POST` | `/admin/servicos` | Novo serviço | `{ nome, descricao, duracaoMinutos, preco, funcionarioPadraoId?, status }` |
| `PATCH` | `/admin/servicos/:id` | Atualizar | campos parciais |
| `PATCH` | `/admin/servicos/:id/status` | Ativo / Inativo | `{ status }` |

**Catálogo de referência do protótipo:** Banho, Tosa, Banho + Tosa, Tosa Higiênica, Corte de Unhas, Consulta Veterinária, Vacinação, Higienização.

---

## 11. Banho e Tosa — fila operacional (Admin)

Usado por: `/admin/banho-tosa`

| Método | Rota | Descrição | Body |
|--------|------|-----------|------|
| `GET` | `/admin/banho-tosa/fila` | Pets do dia (fila) | `data?`, `funcionarioId?` |
| `GET` | `/admin/banho-tosa/:atendimentoId` | Detalhe do card | — |
| `PATCH` | `/admin/banho-tosa/:atendimentoId/status` | Avançar fluxo | `{ status }` |
| `PATCH` | `/admin/banho-tosa/:atendimentoId/observacoes` | Salvar obs. | `{ observacoes }` |

**Fluxo de status:** `Agendado` → `Recepcionado` → `Em atendimento` → `Finalizado` → `Entregue`

Cada item da fila deve trazer: pet, tutor, serviço, horário, funcionário, status, observações.

---

## 12. Veterinário (Admin)

Usado por: `/admin/veterinario`

| Método | Rota | Descrição | Body |
|--------|------|-----------|------|
| `GET` | `/admin/veterinario/consultas` | Agenda clínica do dia/período | `data?`, `veterinarioId?`, `status?` |
| `GET` | `/admin/veterinario/consultas/:id` | Detalhe | — |
| `POST` | `/admin/veterinario/consultas` | Nova consulta / vacina | `{ petId, clienteId, veterinarioId, dataHora, tipo, observacoes? }` |
| `PATCH` | `/admin/veterinario/consultas/:id` | Atualizar | campos parciais |
| `PATCH` | `/admin/veterinario/consultas/:id/status` | Status clínico | `{ status }` |
| `POST` | `/admin/veterinario/consultas/:id/prontuario` | Registrar atendimento | `{ anamnese?, diagnostico?, conduta?, vacinasAplicadas?[] }` |
| `GET` | `/admin/pets/:id/prontuario` | Histórico clínico do pet | — |

**Tipos:** `Consulta` | `Vacinação` | `Check-up` | `Retorno` | etc.  
**Status:** alinhados à agenda (`Agendado`, `Em atendimento`, `Concluído`, `Cancelado`).

---

## 13. Financeiro (Admin)

Usado por: `/admin/financeiro`

| Método | Rota | Descrição | Query / Body |
|--------|------|-----------|--------------|
| `GET` | `/admin/financeiro/resumo` | KPIs (receita, despesas, lucro, a receber, a pagar) | `mes?`, `ano?` |
| `GET` | `/admin/financeiro/fluxo` | Série mensal para gráfico | `ano?` |
| `GET` | `/admin/financeiro/contas-receber` | Lista CR | `status?`, `de?`, `ate?`, `page?` |
| `GET` | `/admin/financeiro/contas-pagar` | Lista CP | `status?`, `de?`, `ate?`, `page?` |
| `POST` | `/admin/financeiro/lancamentos` | Novo lançamento | `{ tipo: "receber"\|"pagar", descricao, categoria, valor, vencimento, formaPagamento, status? }` |
| `PATCH` | `/admin/financeiro/lancamentos/:id` | Editar | campos parciais |
| `PATCH` | `/admin/financeiro/lancamentos/:id/status` | Marcar pago/recebido | `{ status }` |
| `DELETE` | `/admin/financeiro/lancamentos/:id` | Excluir | — |

**Status CR:** `Pendente` | `Recebido`  
**Status CP:** `Pendente` | `Pago`

---

## 14. Funcionários e permissões (Admin)

Usado por: `/admin/funcionarios`

| Método | Rota | Descrição | Body |
|--------|------|-----------|------|
| `GET` | `/admin/funcionarios` | Equipe | `status?`, `cargo?` |
| `GET` | `/admin/funcionarios/:id` | Detalhe | — |
| `POST` | `/admin/funcionarios` | Novo funcionário | `{ nome, cargo, telefone, email, senhaInicial?, status }` |
| `PATCH` | `/admin/funcionarios/:id` | Atualizar | campos parciais |
| `PATCH` | `/admin/funcionarios/:id/status` | Ativo / Inativo | `{ status }` |
| `GET` | `/admin/permissoes` | Matriz cargo × módulo | — |
| `PUT` | `/admin/permissoes` | Atualizar matriz | `{ cargo, modulo, permitido }` ou matriz completa |

**Cargos:** `Administrador` | `Gerente` | `Atendente` | `Tosador` | `Veterinário` | `Caixa`

**Módulos da matriz (front):** Dashboard, Agenda, Vendas, Produtos, Estoque, Clientes, Pets, Serviços, Banho e Tosa, Veterinário, Financeiro, Relatórios, Configurações.

---

## 15. Relatórios (Admin)

Usado por: `/admin/relatorios`

| Método | Rota | Descrição | Query |
|--------|------|-----------|-------|
| `GET` | `/admin/relatorios/:categoria` | Dados do relatório | `periodo=semana\|mes\|trimestre\|ano`, `de?`, `ate?` |
| `GET` | `/admin/relatorios/:categoria/export` | Exportar | mesmos filtros + `formato=pdf\|xlsx\|csv` |

**Categorias (`:categoria`):** `vendas` | `financeiro` | `estoque` | `produtos` | `servicos` | `clientes` | `pets` | `funcionarios`

Cada resposta deve incluir séries/tabelas suficientes para gráficos (barras, pizza) e tabela resumida.

---

## 16. Configurações do pet shop (Admin)

Usado por: `/admin/configuracoes`

| Método | Rota | Descrição | Body |
|--------|------|-----------|------|
| `GET` | `/admin/configuracoes` | Dados do estabelecimento | — |
| `PATCH` | `/admin/configuracoes` | Salvar alterações | `{ nome, cnpj, telefone, email, endereco, responsavel, cargoResponsavel, ... }` |
| `GET` | `/admin/configuracoes/horarios` | Horário de funcionamento | — |
| `PUT` | `/admin/configuracoes/horarios` | Atualizar horários | `{ dias: [{ diaSemana, abre, fecha, fechado }] }` |
| `GET` | `/admin/configuracoes/notificacoes` | Preferências de alerta | — |
| `PATCH` | `/admin/configuracoes/notificacoes` | Atualizar | flags booleans |

---

## 17. Portal — Dashboard do tutor

Usado por: `/portal`

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/portal/dashboard` | Resumo: próximo agendamento, pets, último pedido, serviços recentes |

```json
{
  "saudacaoNome": "João",
  "proximoAgendamento": { "id": 1, "dataHora": "...", "pet": "Thor", "servico": "Banho + Tosa", "status": "Confirmado" },
  "petsCadastrados": 2,
  "ultimoPedido": { "id": "1042", "status": "Entregue", "valor": 189.80 },
  "servicosRecentes": []
}
```

---

## 18. Portal — Meus Pets

Usado por: `/portal/meus-pets`

| Método | Rota | Descrição | Body |
|--------|------|-----------|------|
| `GET` | `/portal/pets` | Pets do tutor logado | — |
| `GET` | `/portal/pets/:id` | Detalhe + histórico resumido | — |
| `POST` | `/portal/pets` | Adicionar pet | `{ nome, especie, raca, sexo, nascimento, peso?, observacoes? }` |
| `PATCH` | `/portal/pets/:id` | Atualizar (se permitido) | campos parciais |
| `GET` | `/portal/pets/:id/historico` | Histórico do pet | `tipo?` |
| `GET` | `/portal/pets/:id/agendamentos` | Agendamentos do pet | — |

---

## 19. Portal — Agendamento

Usado por: `/portal/agendamento` (fluxo em 5 passos)

| Método | Rota | Descrição | Body / Query |
|--------|------|-----------|--------------|
| `GET` | `/portal/pets` | Passo 1 — escolher pet | (reusa §18) |
| `GET` | `/portal/servicos` | Passo 2 — serviços ativos agendáveis | — |
| `GET` | `/portal/agendamentos/horarios-disponiveis` | Passos 3–4 | `data`, `servicoId`, `petId?` |
| `POST` | `/portal/agendamentos` | Confirmar | `{ petId, servicoId, dataHora, observacoes? }` |
| `GET` | `/portal/agendamentos` | Meus agendamentos | `status?` |
| `POST` | `/portal/agendamentos/:id/cancelar` | Cancelar | `{ motivo? }` |

**Body confirmação (espelha o resumo da UI):** pet, serviço, data, horário, valor.

---

## 20. Portal — Loja

Usado por: `/portal/loja`

| Método | Rota | Descrição | Query / Body |
|--------|------|-----------|--------------|
| `GET` | `/portal/loja/produtos` | Catálogo (apenas ativos com estoque) | `q?`, `categoria?` |
| `GET` | `/portal/loja/produtos/:id` | Detalhe do produto | — |
| `GET` | `/portal/loja/categorias` | Filtros | — |
| `POST` | `/portal/pedidos` | Checkout (endereço + pagamento) | ver §9 |

> Carrinho pode permanecer só no front; o backend recebe o pedido finalizado.

---

## 21. Portal — Perfil

Usado por: `/portal/perfil`

| Método | Rota | Descrição | Body |
|--------|------|-----------|------|
| `GET` | `/portal/perfil` | Dados pessoais | — |
| `PATCH` | `/portal/perfil` | Salvar dados | `{ nome, cpf, telefone, email, nascimento, fotoUrl? }` |
| `GET` | `/portal/perfil/enderecos` | Lista de endereços | — |
| `POST` | `/portal/perfil/enderecos` | Novo endereço | `{ rotulo?, logradouro, numero, complemento?, bairro, cidade, uf, cep, principal? }` |
| `PATCH` | `/portal/perfil/enderecos/:id` | Editar | campos parciais |
| `DELETE` | `/portal/perfil/enderecos/:id` | Remover | — |
| `PATCH` | `/portal/perfil/enderecos/:id/principal` | Definir principal | — |
| `GET` | `/portal/perfil/preferencias` | Preferências / notificações | — |
| `PATCH` | `/portal/perfil/preferencias` | Atualizar | flags |
| `PATCH` | `/portal/perfil/senha` | Alterar senha | `{ senhaAtual, novaSenha }` |

---

## 22. Uploads (compartilhado)

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/uploads` | Upload genérico (foto pet, avatar, produto) — `multipart/form-data` → `{ url }` |

---

## 23. Health e meta

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/health` | Healthcheck |
| `GET` | `/meta` | Versão da API |

---

## Matriz rápida: tela → endpoints principais

| Tela front | Endpoints críticos |
|------------|-------------------|
| `/` Login | `POST /auth/login`, `GET /auth/me` |
| `/admin` | `GET /admin/dashboard/*` |
| `/admin/agenda` | CRUD `/admin/agendamentos` |
| `/admin/vendas` | `GET /admin/produtos`, `POST /admin/vendas` |
| `/admin/pedidos` | `GET/PATCH /admin/pedidos` |
| `/admin/produtos` | CRUD `/admin/produtos` |
| `/admin/estoque` | `/admin/estoque/resumo`, `/admin/estoque/movimentacoes` |
| `/admin/clientes` | CRUD `/admin/clientes` + históricos |
| `/admin/pets` | CRUD `/admin/pets` + histórico |
| `/admin/servicos` | CRUD `/admin/servicos` |
| `/admin/banho-tosa` | `/admin/banho-tosa/fila` + status/obs |
| `/admin/veterinario` | `/admin/veterinario/consultas` + prontuário |
| `/admin/financeiro` | `/admin/financeiro/*` |
| `/admin/funcionarios` | CRUD funcionários + permissões |
| `/admin/relatorios` | `/admin/relatorios/:categoria` (+ export) |
| `/admin/configuracoes` | `/admin/configuracoes` |
| `/portal` | `GET /portal/dashboard` |
| `/portal/meus-pets` | `/portal/pets` |
| `/portal/agendamento` | pets + serviços + horários + `POST /portal/agendamentos` |
| `/portal/loja` | `/portal/loja/produtos` + `POST /portal/pedidos` |
| `/portal/pedidos` | `/portal/pedidos` |
| `/portal/perfil` | `/portal/perfil*` |

---

## Regras de negócio mínimas (para o backend)

1. **Estoque:** venda PDV e pedido portal decrementam estoque; estoque negativo não permitido.
2. **Agendamento:** validar conflito de horário do funcionário e duração do serviço.
3. **Portal:** todo recurso `/portal/*` filtra pelo `clienteId` do token (nunca expor dados de outro tutor).
4. **Pedidos:** só o admin altera status operacional; cliente só cria/cancela (quando status permitir).
5. **Financeiro:** venda/serviço concluído pode gerar conta a receber automaticamente.
6. **Permissões:** bloquear módulos conforme cargo (`403`).
7. **Banho e Tosa:** avanço de status é sequencial (não pular etapas, salvo override admin).
8. **Auth:** login admin e portal podem compartilhar endpoint com `contexto` ou roles distintas.

---

## Prioridade sugerida de implementação

1. Auth + usuários (funcionário / cliente)
2. Clientes, Pets, Produtos, Serviços
3. Agendamentos (admin + portal)
4. Vendas PDV + Estoque
5. Pedidos loja (portal + admin)
6. Banho e Tosa + Veterinário
7. Financeiro
8. Dashboard + Relatórios
9. Funcionários / permissões / Configurações

---

*Gerado a partir do protótipo React em `src/` e do brief `src/imports/pasted_text/petzio-erp-prototype.md`.*
