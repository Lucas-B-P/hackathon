import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import {
  LayoutDashboard, Calendar, ShoppingCart, Package, Archive,
  Users, Dog, Scissors, Stethoscope, DollarSign, UserCheck,
  BarChart2, Settings, LogOut, ChevronLeft, ChevronRight,
  ClipboardList, Bath, Bell, Search, Menu, X, PawPrint
} from "lucide-react";
import { clearToken, getMe } from "../services/api";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/agenda", label: "Agenda", icon: Calendar },
  { to: "/admin/vendas", label: "Vendas / PDV", icon: ShoppingCart },
  { to: "/admin/pedidos", label: "Pedidos", icon: ClipboardList },
  { to: "/admin/produtos", label: "Produtos", icon: Package },
  { to: "/admin/estoque", label: "Estoque", icon: Archive },
  { to: "/admin/clientes", label: "Clientes", icon: Users },
  { to: "/admin/pets", label: "Pets", icon: Dog },
  { to: "/admin/servicos", label: "Serviços", icon: Scissors },
  { to: "/admin/banho-tosa", label: "Banho e Tosa", icon: Bath },
  { to: "/admin/veterinario", label: "Veterinário", icon: Stethoscope },
  { to: "/admin/financeiro", label: "Financeiro", icon: DollarSign },
  { to: "/admin/funcionarios", label: "Funcionários", icon: UserCheck },
  { to: "/admin/relatorios", label: "Relatórios", icon: BarChart2 },
  { to: "/admin/configuracoes", label: "Configurações", icon: Settings },
];

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const [checkingSession, setCheckingSession] = useState(true);
  useEffect(() => {
    if (!localStorage.getItem("patinhas_access_token")) { navigate("/", { replace: true }); return; }
    getMe().then((user) => { if (!["admin", "gerente", "atendente", "caixa", "tosador", "vet"].includes(user.role)) throw new Error("forbidden"); setCheckingSession(false); }).catch(() => { clearToken(); navigate("/", { replace: true }); });
  }, [navigate]);
  if (checkingSession) return <div className="min-h-screen bg-[#f8fafc]" />;

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 h-16 border-b border-[#e5e7eb] flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-[#16a34a] flex items-center justify-center flex-shrink-0">
          <PawPrint size={15} className="text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <span
              className="font-bold text-[13px] text-[#111827] block truncate"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Patinhas Pet Shop
            </span>
            <span className="text-[10px] text-[#9ca3af]">via Petzio ERP</span>
          </div>
        )}
        {/* Mobile close */}
        <button
          className="ml-auto md:hidden text-[#9ca3af] hover:text-[#374151]"
          onClick={() => setMobileOpen(false)}
        >
          <X size={20} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 mx-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-0.5 ${
                isActive
                  ? "bg-[#dcfce7] text-[#15803d]"
                  : "text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#111827]"
              }`
            }
            title={collapsed ? label : undefined}
          >
            <Icon size={17} className="flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-[#e5e7eb] p-3">
        {!collapsed ? (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#16a34a] flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">JC</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#111827] truncate">João Carlos</p>
              <p className="text-[11px] text-[#6b7280]">Proprietário</p>
            </div>
            <button
              onClick={() => navigate("/")}
              className="text-[#9ca3af] hover:text-[#ef4444] transition-colors"
              title="Sair"
            >
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center w-full text-[#9ca3af] hover:text-[#ef4444] transition-colors"
            title="Sair"
          >
            <LogOut size={15} />
          </button>
        )}
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-[#f9fafb] overflow-hidden">
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex flex-col bg-white border-r border-[#e5e7eb] transition-all duration-300 flex-shrink-0 relative"
        style={{ width: collapsed ? 64 : 228 }}
      >
        <SidebarContent />
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(c => !c)}
          className="absolute top-1/2 -translate-y-1/2 translate-x-full w-5 h-10 bg-white border border-[#e5e7eb] rounded-r-lg flex items-center justify-center text-[#9ca3af] hover:text-[#374151] shadow-sm z-10"
          style={{ left: collapsed ? 64 : 228, transition: "left 0.3s" }}
        >
          {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
        </button>
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative flex flex-col bg-white w-64 h-full shadow-2xl">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-14 md:h-16 bg-white border-b border-[#e5e7eb] flex items-center px-4 md:px-6 gap-3 flex-shrink-0">
          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-[#6b7280] hover:bg-[#f3f4f6] rounded-lg transition-colors"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={20} />
          </button>

          {/* Mobile logo */}
          <div className="md:hidden flex items-center gap-2">
            <span className="font-bold text-sm text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Patinhas
            </span>
          </div>

          {/* Desktop search */}
          <div className="hidden md:block flex-1 relative max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full pl-9 pr-4 py-1.5 text-sm bg-[#f9fafb] border border-[#e5e7eb] rounded-lg outline-none focus:border-[#16a34a] transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button className="relative p-2 text-[#6b7280] hover:text-[#111827] hover:bg-[#f3f4f6] rounded-lg transition-colors">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#ef4444] rounded-full" />
            </button>
            <NavLink
              to="/portal"
              className="hidden sm:block text-xs font-medium text-[#16a34a] bg-[#dcfce7] px-3 py-1.5 rounded-lg hover:bg-[#bbf7d0] transition-colors whitespace-nowrap"
            >
              Portal →
            </NavLink>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
