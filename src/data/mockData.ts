export const petShop = {
  nome: "Patinhas Pet Shop",
  cnpj: "34.871.209/0001-55",
  telefone: "(11) 3342-8800",
  email: "contato@patinhaspetshop.com.br",
  endereco: "Rua das Magnólias, 412 — Vila Madalena, São Paulo – SP",
  responsavel: "João Carlos Ferreira",
  cargo: "Proprietário",
};

export const clientes = [
  { id: 1, nome: "João Carlos Ferreira", telefone: "(11) 99234-5678", email: "joao@email.com", pets: 2, ultimaCompra: "10/08/2026", ultimoAtendimento: "08/08/2026", status: "Ativo" },
  { id: 2, nome: "Mariana Costa", telefone: "(11) 98765-4321", email: "mariana@email.com", pets: 1, ultimaCompra: "05/08/2026", ultimoAtendimento: "05/08/2026", status: "Ativo" },
  { id: 3, nome: "Rafael Souza", telefone: "(11) 97654-3210", email: "rafael@email.com", pets: 3, ultimaCompra: "01/08/2026", ultimoAtendimento: "02/08/2026", status: "Ativo" },
  { id: 4, nome: "Juliana Lima", telefone: "(11) 96543-2109", email: "juliana@email.com", pets: 1, ultimaCompra: "25/07/2026", ultimoAtendimento: "25/07/2026", status: "Inativo" },
  { id: 5, nome: "Fernando Alves", telefone: "(11) 95432-1098", email: "fernando@email.com", pets: 2, ultimaCompra: "12/08/2026", ultimoAtendimento: "12/08/2026", status: "Ativo" },
  { id: 6, nome: "Camila Rodrigues", telefone: "(11) 94321-0987", email: "camila@email.com", pets: 1, ultimaCompra: "09/08/2026", ultimoAtendimento: "09/08/2026", status: "Ativo" },
  { id: 7, nome: "Bruno Martins", telefone: "(11) 93210-9876", email: "bruno@email.com", pets: 4, ultimaCompra: "03/08/2026", ultimoAtendimento: "04/08/2026", status: "Ativo" },
];

export const pets = [
  { id: 1, foto: "🐶", nome: "Thor", especie: "Cão", raca: "Golden Retriever", tutor: "João Carlos Ferreira", tutorId: 1, idade: "3 anos", sexo: "Macho", nascimento: "10/05/2023", peso: "28 kg", ultimoAtendimento: "08/08/2026" },
  { id: 2, foto: "🐱", nome: "Luna", especie: "Gato", raca: "Persa", tutor: "Mariana Costa", tutorId: 2, idade: "2 anos", sexo: "Fêmea", nascimento: "15/03/2024", peso: "4 kg", ultimoAtendimento: "05/08/2026" },
  { id: 3, foto: "🐶", nome: "Rex", especie: "Cão", raca: "Pastor Alemão", tutor: "Rafael Souza", tutorId: 3, idade: "5 anos", sexo: "Macho", nascimento: "20/01/2021", peso: "35 kg", ultimoAtendimento: "02/08/2026" },
  { id: 4, foto: "🐶", nome: "Mel", especie: "Cão", raca: "Shih Tzu", tutor: "João Carlos Ferreira", tutorId: 1, idade: "1 ano", sexo: "Fêmea", nascimento: "12/06/2025", peso: "5 kg", ultimoAtendimento: "08/08/2026" },
  { id: 5, foto: "🐱", nome: "Simba", especie: "Gato", raca: "Maine Coon", tutor: "Fernando Alves", tutorId: 5, idade: "4 anos", sexo: "Macho", nascimento: "03/02/2022", peso: "8 kg", ultimoAtendimento: "12/08/2026" },
  { id: 6, foto: "🐶", nome: "Bolt", especie: "Cão", raca: "Labrador", tutor: "Camila Rodrigues", tutorId: 6, idade: "2 anos", sexo: "Macho", nascimento: "19/09/2023", peso: "30 kg", ultimoAtendimento: "09/08/2026" },
  { id: 7, foto: "🐶", nome: "Max", especie: "Cão", raca: "Bulldog Francês", tutor: "Bruno Martins", tutorId: 7, idade: "3 anos", sexo: "Macho", nascimento: "05/04/2023", peso: "12 kg", ultimoAtendimento: "04/08/2026" },
];

export const produtos = [
  { id: 1, nome: "Ração Premium Golden 15kg", sku: "RAC-001", categoria: "Alimentação", estoque: 42, estoqueMin: 10, custo: 89.90, venda: 149.90, status: "Ativo" },
  { id: 2, nome: "Shampoo Neutro para Cães 500ml", sku: "SHP-002", categoria: "Higiene", estoque: 8, estoqueMin: 15, custo: 12.50, venda: 24.90, status: "Ativo" },
  { id: 3, nome: "Coleira Antipulgas Seresto", sku: "COL-003", categoria: "Saúde", estoque: 5, estoqueMin: 10, custo: 45.00, venda: 89.90, status: "Ativo" },
  { id: 4, nome: "Brinquedo Kong Classic M", sku: "BRI-004", categoria: "Brinquedos", estoque: 22, estoqueMin: 5, custo: 18.00, venda: 39.90, status: "Ativo" },
  { id: 5, nome: "Ração Gatos Whiskas 3kg", sku: "RAC-005", categoria: "Alimentação", estoque: 3, estoqueMin: 10, custo: 28.00, venda: 49.90, status: "Ativo" },
  { id: 6, nome: "Tapete Higiênico c/30 unid.", sku: "TAP-006", categoria: "Higiene", estoque: 0, estoqueMin: 5, custo: 22.00, venda: 44.90, status: "Ativo" },
  { id: 7, nome: "Vermífugo Drontal Plus", sku: "VER-007", categoria: "Saúde", estoque: 19, estoqueMin: 8, custo: 14.00, venda: 29.90, status: "Ativo" },
  { id: 8, nome: "Arranhador Cat Tree", sku: "ARR-008", categoria: "Acessórios", estoque: 7, estoqueMin: 3, custo: 65.00, venda: 129.90, status: "Ativo" },
];

export const servicos = [
  { id: 1, nome: "Banho", descricao: "Banho completo com secagem", duracao: "1h", preco: 45.00, funcionario: "Ana Tosadora", status: "Ativo" },
  { id: 2, nome: "Tosa", descricao: "Tosa completa no padrão da raça", duracao: "2h", preco: 65.00, funcionario: "Carlos Tosador", status: "Ativo" },
  { id: 3, nome: "Banho + Tosa", descricao: "Banho completo + tosa padrão", duracao: "2h30", preco: 85.00, funcionario: "Ana Tosadora", status: "Ativo" },
  { id: 4, nome: "Tosa Higiênica", descricao: "Limpeza das áreas íntimas", duracao: "30min", preco: 25.00, funcionario: "Carlos Tosador", status: "Ativo" },
  { id: 5, nome: "Corte de Unhas", descricao: "Corte e limpeza das unhas", duracao: "20min", preco: 18.00, funcionario: "Ana Tosadora", status: "Ativo" },
  { id: 6, nome: "Consulta Veterinária", descricao: "Consulta clínica geral", duracao: "1h", preco: 120.00, funcionario: "Dra. Beatriz Santos", status: "Ativo" },
  { id: 7, nome: "Vacinação", descricao: "Aplicação de vacinas", duracao: "20min", preco: 65.00, funcionario: "Dra. Beatriz Santos", status: "Ativo" },
];

export const agendamentos = [
  { id: 1, horario: "08:00", pet: "Thor", tutor: "João Carlos Ferreira", servico: "Banho + Tosa", funcionario: "Ana Tosadora", status: "Confirmado" },
  { id: 2, horario: "09:00", pet: "Luna", tutor: "Mariana Costa", servico: "Banho", funcionario: "Carlos Tosador", status: "Em atendimento" },
  { id: 3, horario: "10:00", pet: "Rex", tutor: "Rafael Souza", servico: "Consulta Veterinária", funcionario: "Dra. Beatriz Santos", status: "Agendado" },
  { id: 4, horario: "11:30", pet: "Mel", tutor: "João Carlos Ferreira", servico: "Corte de Unhas", funcionario: "Ana Tosadora", status: "Agendado" },
  { id: 5, horario: "13:00", pet: "Simba", tutor: "Fernando Alves", servico: "Tosa Higiênica", funcionario: "Carlos Tosador", status: "Agendado" },
  { id: 6, horario: "14:30", pet: "Thor", tutor: "João Carlos Ferreira", servico: "Vacinação", funcionario: "Dra. Beatriz Santos", status: "Agendado" },
  { id: 7, horario: "16:00", pet: "Bolt", tutor: "Camila Rodrigues", servico: "Banho + Tosa", funcionario: "Ana Tosadora", status: "Concluído" },
];

export const funcionarios = [
  { id: 1, nome: "João Carlos Ferreira", cargo: "Proprietário", telefone: "(11) 99234-5678", email: "joao@patinhaspetshop.com.br", status: "Ativo" },
  { id: 2, nome: "Fernanda Oliveira", cargo: "Gerente", telefone: "(11) 99111-2233", email: "fernanda@patinhaspetshop.com.br", status: "Ativo" },
  { id: 3, nome: "Ana Tosadora", cargo: "Tosadora", telefone: "(11) 99222-3344", email: "ana@patinhaspetshop.com.br", status: "Ativo" },
  { id: 4, nome: "Carlos Tosador", cargo: "Tosador", telefone: "(11) 99333-4455", email: "carlos@patinhaspetshop.com.br", status: "Ativo" },
  { id: 5, nome: "Dra. Beatriz Santos", cargo: "Veterinária", telefone: "(11) 99444-5566", email: "beatriz@patinhaspetshop.com.br", status: "Ativo" },
  { id: 6, nome: "Ricardo Caixa", cargo: "Caixa", telefone: "(11) 99555-6677", email: "ricardo@patinhaspetshop.com.br", status: "Ativo" },
  { id: 7, nome: "Patrícia Atendente", cargo: "Atendente", telefone: "(11) 99666-7788", email: "patricia@patinhaspetshop.com.br", status: "Inativo" },
];

export const faturamentoMensal = [
  { mes: "Mar", receita: 18200, despesas: 9800 },
  { mes: "Abr", receita: 21500, despesas: 11200 },
  { mes: "Mai", receita: 19800, despesas: 10500 },
  { mes: "Jun", receita: 23400, despesas: 12100 },
  { mes: "Jul", receita: 25800, despesas: 13400 },
  { mes: "Ago", receita: 22100, despesas: 11900 },
];

export const vendasCategoria = [
  { name: "Alimentação", value: 38 },
  { name: "Higiene", value: 24 },
  { name: "Saúde", value: 19 },
  { name: "Brinquedos", value: 12 },
  { name: "Acessórios", value: 7 },
];

export const movimentacoesEstoque = [
  { id: 1, produto: "Ração Premium Golden 15kg", tipo: "Entrada", quantidade: 20, motivo: "Compra fornecedor", usuario: "João Carlos", data: "12/08/2026" },
  { id: 2, produto: "Shampoo Neutro 500ml", tipo: "Saída", quantidade: 3, motivo: "Venda PDV", usuario: "Ricardo Caixa", data: "12/08/2026" },
  { id: 3, produto: "Tapete Higiênico c/30", tipo: "Saída", quantidade: 5, motivo: "Venda PDV", usuario: "Ricardo Caixa", data: "11/08/2026" },
  { id: 4, produto: "Coleira Antipulgas", tipo: "Ajuste", quantidade: -2, motivo: "Avaria", usuario: "João Carlos", data: "10/08/2026" },
  { id: 5, produto: "Ração Gatos Whiskas 3kg", tipo: "Entrada", quantidade: 12, motivo: "Compra fornecedor", usuario: "Fernanda Oliveira", data: "09/08/2026" },
];

export const contasReceber = [
  { id: 1, descricao: "Venda PDV #1042", categoria: "Vendas", valor: 349.80, vencimento: "15/08/2026", status: "Pendente", forma: "PIX" },
  { id: 2, descricao: "Serviço Banho + Tosa", categoria: "Serviços", valor: 85.00, vencimento: "14/08/2026", status: "Recebido", forma: "Cartão Débito" },
  { id: 3, descricao: "Consulta Veterinária", categoria: "Serviços", valor: 120.00, vencimento: "13/08/2026", status: "Recebido", forma: "Dinheiro" },
  { id: 4, descricao: "Venda PDV #1041", categoria: "Vendas", valor: 189.90, vencimento: "20/08/2026", status: "Pendente", forma: "Cartão Crédito" },
];

export const contasPagar = [
  { id: 1, descricao: "Aluguel — Vila Madalena", categoria: "Infraestrutura", valor: 3500.00, vencimento: "20/08/2026", status: "Pendente", forma: "Transferência" },
  { id: 2, descricao: "Fornecedor PetNutri Ltda.", categoria: "Estoque", valor: 1890.00, vencimento: "18/08/2026", status: "Pendente", forma: "Boleto" },
  { id: 3, descricao: "Folha de pagamento", categoria: "RH", valor: 8200.00, vencimento: "30/08/2026", status: "Pendente", forma: "Transferência" },
  { id: 4, descricao: "Internet + Telefone", categoria: "Infraestrutura", valor: 249.90, vencimento: "15/08/2026", status: "Pago", forma: "Débito automático" },
];

export const pedidosCliente = [
  { id: "#1042", data: "10/08/2026", produtos: "Ração Premium 15kg, Brinquedo Kong", valor: 189.80, status: "Entregue" },
  { id: "#1038", data: "01/08/2026", produtos: "Shampoo Neutro, Tapete Higiênico", valor: 69.80, status: "Entregue" },
  { id: "#1051", data: "12/08/2026", produtos: "Ração Premium 15kg", valor: 149.90, status: "Em preparação" },
];
