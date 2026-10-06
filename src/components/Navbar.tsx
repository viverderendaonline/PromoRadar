import React from 'react';
import { Radar, Sparkles, LayoutDashboard, ShieldAlert, ShieldCheck, Zap, ArrowRight } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isDashboardMode: boolean;
  setIsDashboardMode: (isDashboard: boolean) => void;
  onOpenTrial: () => void;
  onOpenSecurityShield: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  isDashboardMode,
  setIsDashboardMode,
  onOpenTrial,
  onOpenSecurityShield,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#faf8f5]/90 backdrop-blur-md border-b border-[#f0ebe4] transition-all">
      {/* Top security micro-banner */}
      <div className="bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white py-1.5 px-4 text-xs font-medium text-center flex items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1 text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30 text-[10px]">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          ESCUDO DEFENSIVO ATIVO
        </span>
        <span className="hidden sm:inline">
          Proteção Anti-Ban, Firewall Anti-SSRF e suporte multi-lojas: <strong>Shopee, Amazon & Mercado Livre</strong>.
        </span>
        <button
          onClick={onOpenSecurityShield}
          className="ml-2 underline font-bold text-amber-300 hover:text-amber-200 transition-colors cursor-pointer text-[11px]"
        >
          Ver Auditoria de Segurança
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => {
            setIsDashboardMode(false);
            setCurrentTab('home');
          }}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#ee4d2d] flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
            <Radar className="w-5 h-5 text-orange-400 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-[#191414]">
                Promo<span className="text-[#ee4d2d]">Radar</span>
              </span>
              <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-slate-900 text-amber-300 border border-slate-700">
                MULTI-PRO
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-[#6b635b] font-semibold hidden sm:flex">
              <span className="text-orange-600">Shopee</span> •{' '}
              <span className="text-blue-700">Amazon</span> •{' '}
              <span className="text-yellow-600">Mercado Livre</span>
            </div>
          </div>
        </div>

        {/* Navigation Items (when on landing or switching) */}
        {!isDashboardMode ? (
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#4a423b]">
            <button
              onClick={() => {
                setCurrentTab('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-[#ee4d2d] transition-colors cursor-pointer"
            >
              Início
            </button>
            <a href="#marketplaces" className="hover:text-[#ee4d2d] transition-colors">
              Marketplaces
            </a>
            <a href="#seguranca" className="hover:text-[#ee4d2d] transition-colors">
              Segurança Brutal
            </a>
            <a href="#planos" className="hover:text-[#ee4d2d] transition-colors">
              Planos
            </a>
            <button
              onClick={() => setCurrentTab('gerador')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                currentTab === 'gerador'
                  ? 'bg-orange-50 border-orange-300 text-[#ee4d2d] font-semibold'
                  : 'border-amber-200 bg-amber-50/60 text-amber-900 hover:border-orange-300'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-[#ee4d2d]" />
              Gerador Multi-Links
            </button>
          </nav>
        ) : (
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={onOpenSecurityShield}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-300 hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Escudo Defensivo Ativo (8 Regras)
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {isDashboardMode ? (
            <button
              onClick={() => setIsDashboardMode(false)}
              className="text-xs font-semibold text-[#6b635b] hover:text-[#191414] px-3 py-2 rounded-lg border border-[#e2dbd2] hover:bg-[#f5efe6] transition-colors cursor-pointer"
            >
              Ver Site Público
            </button>
          ) : (
            <button
              onClick={() => {
                setIsDashboardMode(true);
                setCurrentTab('dashboard');
              }}
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-[#4a423b] hover:text-[#ee4d2d] px-3.5 py-2 rounded-lg border border-[#e8dfd5] hover:border-orange-300 transition-colors cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4 text-[#ee4d2d]" />
              Painel do Afiliado
            </button>
          )}

          <button
            onClick={() => {
              if (!isDashboardMode) {
                setIsDashboardMode(true);
                setCurrentTab('dashboard');
              } else {
                onOpenTrial();
              }
            }}
            className="flex items-center gap-2 bg-[#ee4d2d] hover:bg-[#d73211] text-white text-xs sm:text-sm font-bold px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl shadow-md shadow-orange-500/25 hover:shadow-orange-500/35 transition-all transform active:scale-95 cursor-pointer"
          >
            <span>{isDashboardMode ? 'Gerenciar Plano' : 'Testar 3 Dias Grátis'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
