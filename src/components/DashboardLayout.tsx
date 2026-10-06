import React from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Zap,
  MessageSquare,
  QrCode,
  KeyRound,
  CreditCard,
  Gift,
  Radar,
  ArrowLeft,
  Send,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Link2,
  Webhook,
  CalendarClock,
} from 'lucide-react';

interface DashboardLayoutProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onExitDashboard: () => void;
  onOpenQuickSend: () => void;
  onOpenSecurityShield: () => void;
  isBotActive: boolean;
  setIsBotActive: (active: boolean) => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentTab,
  setCurrentTab,
  onExitDashboard,
  onOpenQuickSend,
  onOpenSecurityShield,
  isBotActive,
  setIsBotActive,
  children,
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Visão Geral & Métricas', icon: LayoutDashboard },
    { id: 'products', label: 'Catálogo Multi-Lojas', icon: ShoppingBag, badge: '3 LOJAS' },
    { id: 'shortener', label: 'Encurtador & Cliques', icon: Link2, badge: 'TRACK' },
    { id: 'webhooks', label: 'Webhooks de Pedidos', icon: Webhook, badge: 'LIVE' },
    { id: 'automations', label: 'Automações & Anti-Ban', icon: Zap },
    { id: 'schedule', label: 'Agendamento & Picos', icon: CalendarClock, badge: 'SMART' },
    { id: 'templates', label: 'Modelos de Copy', icon: MessageSquare },
    { id: 'whatsapp', label: 'Conexão WhatsApp', icon: QrCode, statusDot: true },
    { id: 'credentials', label: 'Chaves dos Marketplaces', icon: KeyRound },
    { id: 'plans', label: 'Meu Plano (Pro)', icon: CreditCard },
    { id: 'indique', label: 'Indique & Ganhe', icon: Gift, badge: '20%' },
  ];

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-[#ede8e3] flex flex-col shrink-0">
        {/* Brand Header */}
        <div className="p-5 border-b border-[#f0ebe4] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#ee4d2d] flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <Radar className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-[#191414] leading-tight block">
                Promo<span className="text-[#ee4d2d]">Radar</span>
              </span>
              <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Painel Multi-Afiliados
              </span>
            </div>
          </div>
        </div>

        {/* Security Shield Status Box in Sidebar */}
        <div className="p-3 mx-3 mt-3 rounded-xl bg-slate-900 text-white border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-bold text-[11px]">Escudo Ativo</span>
          </div>
          <button
            onClick={onOpenSecurityShield}
            className="text-[10px] font-bold text-amber-300 hover:underline cursor-pointer"
          >
            Auditar →
          </button>
        </div>

        {/* Bot Master Switch in Sidebar */}
        <div className="p-4 mx-3 my-2 rounded-2xl bg-gradient-to-br from-[#faf8f5] to-orange-50/50 border border-orange-200/70">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#191414]">Status do Robô:</span>
            <span
              className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                isBotActive
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {isBotActive ? 'OPERANDO 24H' : 'PAUSADO'}
            </span>
          </div>

          <button
            onClick={() => setIsBotActive(!isBotActive)}
            className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              isBotActive
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                : 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm'
            }`}
          >
            {isBotActive ? 'Pausar Automação' : 'Iniciar Automação'}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-orange-50 text-[#ee4d2d] border border-orange-200/80'
                    : 'text-[#6b635b] hover:text-[#191414] hover:bg-[#f5efe6]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#ee4d2d]' : 'text-[#8c827a]'}`} />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-slate-900 text-amber-300">
                      {item.badge}
                    </span>
                  )}
                  {item.statusDot && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500" title="WhatsApp Ativo" />
                  )}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Exit to public site button */}
        <div className="p-4 border-t border-[#ede8e3]">
          <button
            onClick={onExitDashboard}
            className="w-full flex items-center justify-center gap-2 text-xs font-bold text-[#6b635b] hover:text-[#ee4d2d] py-2 px-3 rounded-xl border border-[#e2dbd2] hover:bg-orange-50 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar ao Site Principal</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top bar inside dashboard */}
        <div className="bg-white border-b border-[#ede8e3] px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8c827a]">
              Marketplaces Conectados:
            </span>
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded">Shopee ✓</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Amazon ✓</span>
              <span className="bg-yellow-100 text-yellow-900 px-2 py-0.5 rounded">Mercado Livre ✓</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenQuickSend}
              className="flex items-center gap-2 bg-[#ee4d2d] hover:bg-[#d73211] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Disparar Oferta Agora</span>
            </button>
          </div>
        </div>

        {/* View Container */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1">{children}</div>
      </main>
    </div>
  );
};
