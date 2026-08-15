Crie um protótipo de um sistema ERP web completo para gestão de Pet Shop chamado **Petzio ERP**.

O sistema deve possuir **dois ambientes principais**:

1. **Painel Administrativo / ERP**, utilizado por proprietários, gerentes e funcionários.
2. **Portal do Cliente**, utilizado pelos tutores dos pets.

O objetivo é criar uma plataforma profissional para centralizar toda a operação de um Pet Shop: vendas, estoque, produtos, clientes, pets, serviços, banho e tosa, agenda, financeiro, funcionários e relatórios.

---

# 1. IDENTIDADE VISUAL

Criar uma interface moderna de SaaS/ERP.

Estilo:

* Profissional
* Clean
* Moderno
* Levemente premium
* Amigável
* Fácil de utilizar
* Não infantil

Utilizar uma paleta baseada em:

* Verde como cor principal
* Tons neutros claros
* Branco/off-white
* Verde escuro para textos importantes
* Laranja/amarelo apenas para pequenos destaques e alertas

Utilizar:

* Cards com bordas arredondadas
* Sombras extremamente suaves
* Ícones minimalistas
* Tabelas modernas
* Gráficos limpos
* Badges de status
* Modais bem estruturados
* Sistema de espaçamento consistente

A interface deve parecer um produto SaaS real e pronto para ser desenvolvido.

Criar layout responsivo, mas priorizar a experiência desktop para o ERP.

---

# 2. LOGIN

Criar uma tela de login moderna.

Elementos:

* Logo Petzio ERP
* E-mail
* Senha
* "Lembrar de mim"
* "Esqueci minha senha"
* Botão "Entrar"
* Link para suporte

Criar também uma variação para login do cliente.

---

# 3. PAINEL ADMINISTRATIVO

Criar um dashboard administrativo com:

## Sidebar

Menu:

* Dashboard
* Agenda
* Vendas
* Pedidos
* Produtos
* Estoque
* Clientes
* Pets
* Serviços
* Banho e Tosa
* Veterinário
* Financeiro
* Funcionários
* Relatórios
* Configurações

No rodapé da sidebar:

* Usuário logado
* Cargo
* Configurações
* Sair

---

# 4. DASHBOARD

Criar uma dashboard com visão geral da operação.

No topo:

"Bom dia, Lucas 👋"

Mostrar cards de indicadores:

* Vendas hoje
* Faturamento do mês
* Agendamentos hoje
* Clientes ativos
* Produtos com estoque baixo
* Contas a receber

Adicionar gráficos:

* Faturamento por período
* Vendas por categoria
* Serviços mais realizados
* Produtos mais vendidos

Adicionar seção:

"Agenda de hoje"

Mostrar:

* Horário
* Pet
* Tutor
* Serviço
* Funcionário
* Status

Adicionar seção:

"Estoque baixo"

Mostrar produtos próximos de acabar.

---

# 5. AGENDA

Criar uma agenda profissional semelhante a sistemas de clínicas e salões.

Permitir visualizar:

* Dia
* Semana
* Mês

Mostrar horários e serviços.

Cada agendamento deve apresentar:

* Horário
* Pet
* Tutor
* Serviço
* Funcionário
* Status

Status:

* Agendado
* Confirmado
* Em atendimento
* Concluído
* Cancelado

Criar botão:

"+ Novo agendamento"

---

# 6. CLIENTES

Criar página de gerenciamento de clientes.

Tabela contendo:

* Nome
* Telefone
* E-mail
* Quantidade de pets
* Última compra
* Último atendimento
* Status

Filtros:

* Nome
* Telefone
* Status

Botão:

"+ Novo cliente"

Criar página de detalhes do cliente contendo:

* Informações pessoais
* Endereço
* Pets
* Histórico de compras
* Histórico de serviços
* Agendamentos
* Financeiro
* Observações

---

# 7. PETS

Criar módulo específico para os animais.

Tabela/listagem contendo:

* Foto
* Nome
* Espécie
* Raça
* Tutor
* Idade
* Último atendimento

Ao abrir um pet:

Mostrar perfil completo:

* Foto
* Nome
* Espécie
* Raça
* Sexo
* Data de nascimento
* Peso
* Tutor
* Observações

Adicionar:

"Histórico do Pet"

Com:

* Banhos
* Tosas
* Consultas
* Vacinas
* Produtos comprados
* Agendamentos

---

# 8. PRODUTOS

Criar gerenciamento de produtos.

Tabela:

* Produto
* SKU
* Categoria
* Estoque
* Estoque mínimo
* Preço de custo
* Preço de venda
* Status

Criar filtros e busca.

Botão:

"+ Novo produto"

Página de produto contendo:

* Foto
* Nome
* SKU
* Código de barras
* Categoria
* Marca
* Preço de custo
* Preço de venda
* Estoque
* Estoque mínimo
* Fornecedor
* Descrição

---

# 9. ESTOQUE

Criar painel de estoque.

Mostrar:

* Estoque total
* Produtos com estoque baixo
* Produtos sem estoque
* Valor total em estoque

Criar tabela de movimentações:

* Produto
* Tipo
* Quantidade
* Motivo
* Usuário
* Data

Tipos:

* Entrada
* Saída
* Ajuste
* Perda

---

# 10. VENDAS / PDV

Criar uma tela de PDV moderna.

Layout dividido em:

## Esquerda

Catálogo de produtos.

* Busca
* Categorias
* Produtos
* Quantidade

## Direita

Carrinho.

Mostrar:

* Produtos
* Quantidade
* Desconto
* Subtotal
* Total

Botão:

"Finalizar venda"

Criar modal de pagamento com:

* Dinheiro
* PIX
* Cartão de débito
* Cartão de crédito
* Múltiplas formas de pagamento

---

# 11. SERVIÇOS

Criar gerenciamento de serviços.

Exemplos:

* Banho
* Tosa
* Banho + Tosa
* Tosa higiênica
* Corte de unhas
* Consulta veterinária
* Vacinação
* Higienização

Cada serviço deve possuir:

* Nome
* Descrição
* Duração
* Preço
* Funcionário responsável
* Status

---

# 12. BANHO E TOSA

Criar uma tela específica para operação de banho e tosa.

Mostrar uma fila de atendimento:

"Pets de hoje"

Cada card deve mostrar:

* Foto do pet
* Nome
* Tutor
* Serviço
* Horário
* Funcionário
* Status

Fluxo:

Agendado → Recepcionado → Em atendimento → Finalizado → Entregue

Permitir adicionar observações sobre o atendimento.

---

# 13. FINANCEIRO

Criar módulo financeiro.

Dashboard com:

* Receita
* Despesas
* Lucro
* Contas a receber
* Contas a pagar

Gráfico financeiro mensal.

Criar tabelas:

"Contas a receber"

"Contas a pagar"

Cada lançamento deve possuir:

* Descrição
* Categoria
* Valor
* Vencimento
* Status
* Forma de pagamento

---

# 14. FUNCIONÁRIOS

Criar gerenciamento de funcionários.

Mostrar:

* Nome
* Cargo
* Telefone
* E-mail
* Status

Cargos:

* Administrador
* Gerente
* Atendente
* Tosador
* Veterinário
* Caixa

Criar controle de permissões por função.

---

# 15. RELATÓRIOS

Criar central de relatórios.

Categorias:

* Vendas
* Financeiro
* Estoque
* Produtos
* Serviços
* Clientes
* Pets
* Funcionários

Permitir selecionar período e gerar gráficos/tabelas.

Adicionar botão:

"Exportar relatório"

---

# 16. PORTAL DO CLIENTE

Criar um segundo ambiente visualmente diferente do ERP, mas mantendo a mesma identidade.

O cliente deve acessar um portal onde poderá:

* Ver seus pets
* Agendar serviços
* Acompanhar pedidos
* Ver histórico
* Comprar produtos
* Consultar serviços
* Atualizar seus dados

Dashboard do cliente:

"Olá, Lucas! 🐾"

Mostrar:

* Próximo agendamento
* Pets cadastrados
* Último pedido
* Serviços recentes

---

# 17. MEUS PETS

Criar cards para cada pet.

Exemplo:

🐶 Thor
Golden Retriever
3 anos

Ao abrir:

* Informações
* Histórico
* Agendamentos
* Serviços realizados
* Observações

Botão:

"+ Adicionar pet"

---

# 18. AGENDAMENTO DO CLIENTE

Criar fluxo simples:

1. Escolher pet
2. Escolher serviço
3. Escolher data
4. Escolher horário
5. Confirmar

Mostrar resumo:

Pet:
Thor

Serviço:
Banho + Tosa

Data:
15/08/2026

Horário:
14:30

Valor:
R$ 85,00

Botão:

"Confirmar agendamento"

---

# 19. PEDIDOS DO CLIENTE

Criar página "Meus pedidos".

Mostrar:

* Número do pedido
* Data
* Produtos
* Valor
* Status

Status:

* Recebido
* Em preparação
* Pronto
* Saiu para entrega
* Entregue
* Cancelado

---

# 20. PERFIL DO CLIENTE

Criar página de configurações:

* Dados pessoais
* Telefone
* E-mail
* Endereços
* Preferências
* Segurança
* Alterar senha

---

# 21. COMPONENTES E ESTADOS

Criar componentes reutilizáveis:

* Buttons
* Inputs
* Selects
* Tables
* Cards
* Modals
* Dropdowns
* Toast notifications
* Badges
* Tabs
* Date picker
* Calendar
* Charts
* Empty states
* Loading states
* Error states

Criar exemplos de:

* Sucesso
* Erro
* Confirmação
* Loading
* Nenhum resultado
* Estoque baixo
* Agendamento cancelado

---

# 22. EXPERIÊNCIA GERAL

O ERP deve transmitir a sensação de um sistema profissional de gestão, semelhante a plataformas SaaS modernas.

Evitar excesso de elementos decorativos.

Priorizar:

* Informação bem organizada
* Hierarquia visual
* Navegação rápida
* Poucos cliques
* Boa utilização de tabelas
* Dashboards informativos
* Ações claras
* Responsividade

Criar inicialmente todas essas telas como um **esboço visual navegável**, utilizando dados fictícios realistas.

Não implementar backend ou funcionalidades reais. O objetivo deste projeto no Figma Make é criar a arquitetura visual, UX/UI e fluxo completo do sistema para posteriormente transformá-lo em uma aplicação web.
