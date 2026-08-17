import { useState, useRef, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import { Home, Calendar, ShoppingBag, Dog, User, LogOut, Bell, Store, PawPrint, Check, Tag, Clock, Stethoscope } from "lucide-react";

const navItems = [
  { to: "/portal", label: "Início", icon: Home, end: true },
  { to: "/portal/meus-pets", label: "Pets", icon: Dog },
  { to: "/portal/agendamento", label: "Agendar", icon: Calendar },
  { to: "/portal/loja", label: "Loja", icon: Store },
  { to: "/portal/pedidos", label: "Pedidos", icon: ShoppingBag },
  { to: "/portal/perfil", label: "Perfil", icon: User },
];

const NOTIFICATIONS = [
  {
    id: 1,
    icon: Calendar,
    color: "bg-[#dcfce7] text-[#16a34a]",
    title: "Agendamento confirmado",
    desc: "Banho + Tosa do Rex amanhã às 10:00",
    time: "Há 2 horas",
    unread: true,
  },
  {
    id: 2,
    icon: Stethoscope,
    color: "bg-blue-50 text-blue-600",
    title: "Lembrete de consulta",
    desc: "Consulta veterinária da Luna em 3 dias",
    time: "Há 5 horas",
    unread: true,
  },
  {
    id: 3,
    icon: Tag,
    color: "bg-amber-50 text-amber-600",
    title: "Promoção especial",
    desc: "20% off em rações premium esta semana",
    time: "Ontem",
    unread: false,
  },
  {
    id: 4,
    icon: Clock,
    color: "bg-violet-50 text-violet-600",
    title: "Pedido atualizado",
    desc: "Seu pedido #1042 saiu para entrega",
    time: "Ontem",
    unread: false,
  },
  {
    id: 5,
    icon: Check,
    color: "bg-[#dcfce7] text-[#16a34a]",
    title: "Vacinação em dia",
    desc: "Rex está com a vacinação V10 em dia",
    time: "3 dias atrás",
    unread: false,
  },
];

export default function ClientLayout() {
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [readIds, setReadIds] = useState<number[]>([]);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const unreadCount = NOTIFICATIONS.filter(n => n.unread && !readIds.includes(n.id)).length;

  function markAllRead() {
    setReadIds(NOTIFICATIONS.map(n => n.id));
  }

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
            {/* Bell with notification dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen(o => !o)}
                className="relative p-2 text-[#6b7280] hover:text-[#111827] hover:bg-[#f3f4f6] rounded-lg transition-colors"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#ef4444] rounded-full text-white text-[9px] font-bold flex items-center justify-center leading-none">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl border border-[#e5e7eb] shadow-xl z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-[#f3f4f6]">
                    <span className="font-semibold text-sm text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      Notificações {unreadCount > 0 && <span className="ml-1 text-xs bg-[#dcfce7] text-[#16a34a] px-1.5 py-0.5 rounded-full font-bold">{unreadCount}</span>}
                    </span>
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} className="text-xs text-[#16a34a] hover:underline font-medium">
                        Marcar todas lidas
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-[#f3f4f6]">
                    {NOTIFICATIONS.map(n => {
                      const isUnread = n.unread && !readIds.includes(n.id);
                      return (
                        <button
                          key={n.id}
                          onClick={() => setReadIds(r => [...r, n.id])}
                          className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-[#f9fafb] transition-colors ${isUnread ? "bg-[#f0fdf4]" : ""}`}
                        >
                          <div className={`p-2 rounded-xl flex-shrink-0 mt-0.5 ${n.color}`}>
                            <n.icon size={14} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-[#111827] leading-tight">{n.title}</p>
                            <p className="text-xs text-[#6b7280] mt-0.5 leading-snug">{n.desc}</p>
                            <p className="text-[11px] text-[#9ca3af] mt-1">{n.time}</p>
                          </div>
                          {isUnread && <div className="w-2 h-2 rounded-full bg-[#16a34a] flex-shrink-0 mt-2" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

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
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-5 md:py-8" style={{ overflow: "visible" }}>
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
