import { NavLink, Outlet, useNavigate } from "react-router";
import { Home, Calendar, ShoppingBag, Dog, User, LogOut, Bell, Store, PawPrint } from "lucide-react";

const navItems = [
  { to: "/portal", label: "Início", icon: Home, end: true },
  { to: "/portal/meus-pets", label: "Pets", icon: Dog },
  { to: "/portal/agendamento", label: "Agendar", icon: Calendar },
  { to: "/portal/loja", label: "Loja", icon: Store },
  { to: "/portal/pedidos", label: "Pedidos", icon: ShoppingBag },
  { to: "/portal/perfil", label: "Perfil", icon: User },
];

export default function ClientLayout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f9fafb] pb-20 md:pb-0">
      {/* Top header — logo + actions only */}
      <header className="bg-white border-b border-[#e5e7eb] sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#16a34a] flex items-center justify-center flex-shrink-0">
              <PawPrint size={16} className="text-white" />
            </div>
            <span
              className="font-bold text-[14px] md:text-[15px] text-[#111827] truncate"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Patinhas Pet Shop
            </span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#dcfce7] text-[#15803d]"
                      : "text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#111827]"
                  }`
                }
              >
                <Icon size={15} />
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button className="relative p-2 text-[#6b7280] hover:text-[#111827] hover:bg-[#f3f4f6] rounded-lg transition-colors">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ef4444] rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-full bg-[#16a34a] flex items-center justify-center">
              <span className="text-white text-xs font-bold">JC</span>
            </div>
            <button
              onClick={() => navigate("/")}
              className="hidden md:flex text-[#9ca3af] hover:text-[#ef4444] transition-colors p-1"
              title="Sair"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-5 md:py-8">
        <Outlet />
      </main>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#e5e7eb] flex items-center">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 transition-colors ${
                isActive ? "text-[#16a34a]" : "text-[#9ca3af]"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-1.5 rounded-xl transition-all ${isActive ? "bg-[#dcfce7]" : ""}`}>
                  <Icon size={20} />
                </div>
                <span className="text-[10px] font-medium leading-none">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
