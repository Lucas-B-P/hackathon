import { createBrowserRouter } from "react-router";

import AdminLayout from "./layouts/AdminLayout";
import ClientLayout from "./layouts/ClientLayout";

import Login from "./pages/Login";
import Dashboard from "./pages/admin/Dashboard";
import Agenda from "./pages/admin/Agenda";
import Clientes from "./pages/admin/Clientes";
import Pets from "./pages/admin/Pets";
import Produtos from "./pages/admin/Produtos";
import Estoque from "./pages/admin/Estoque";
import Vendas from "./pages/admin/Vendas";
import Servicos from "./pages/admin/Servicos";
import BanhoTosa from "./pages/admin/BanhoTosa";
import Veterinario from "./pages/admin/Veterinario";
import Financeiro from "./pages/admin/Financeiro";
import Funcionarios from "./pages/admin/Funcionarios";
import Relatorios from "./pages/admin/Relatorios";
import Configuracoes from "./pages/admin/Configuracoes";
import Pedidos from "./pages/admin/Pedidos";

import ClientDashboard from "./pages/client/ClientDashboard";
import MeusPets from "./pages/client/MeusPets";
import Agendamento from "./pages/client/Agendamento";
import PedidosCliente from "./pages/client/Pedidos";
import Loja from "./pages/client/Loja";
import Perfil from "./pages/client/Perfil";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
  },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "agenda", Component: Agenda },
      { path: "vendas", Component: Vendas },
      { path: "pedidos", Component: Pedidos },
      { path: "produtos", Component: Produtos },
      { path: "estoque", Component: Estoque },
      { path: "clientes", Component: Clientes },
      { path: "pets", Component: Pets },
      { path: "servicos", Component: Servicos },
      { path: "banho-tosa", Component: BanhoTosa },
      { path: "veterinario", Component: Veterinario },
      { path: "financeiro", Component: Financeiro },
      { path: "funcionarios", Component: Funcionarios },
      { path: "relatorios", Component: Relatorios },
      { path: "configuracoes", Component: Configuracoes },
    ],
  },
  {
    path: "/portal",
    Component: ClientLayout,
    children: [
      { index: true, Component: ClientDashboard },
      { path: "meus-pets", Component: MeusPets },
      { path: "agendamento", Component: Agendamento },
      { path: "loja", Component: Loja },
      { path: "pedidos", Component: PedidosCliente },
      { path: "perfil", Component: Perfil },
    ],
  },
]);
