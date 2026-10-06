import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  Send,
  Users,
  DollarSign,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Zap,
  Webhook,
  Bell,
  ShoppingBag,
  ArrowUpRight,
} from 'lucide-react';
import { AffiliateDeal, WhatsAppGroup, DispatchLog, AffiliateOrder } from '../types';

interface DashboardOverviewProps {
  products: AffiliateDeal[];
  groups: WhatsAppGroup[];
  logs: DispatchLog[];
  isBotActive: boolean;
  onOpenQuickSend: () => void;
  onNavigateTab: (tab: string) => void;
  onOpenSecurityShield?: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  products,
  groups,
  logs,
  isBotActive,
  onOpenQuickSend,
  onNavigateTab,
  onOpenSecurityShield,
}) => {
  const activeGroupsCount = groups.filter((g) => g.isActive).length;
  const totalMembers = groups.reduce((acc, g) => acc + (g.isActive ? g.memberCount : 0), 0);

  const [realLogs, setRealLogs] = useState<DispatchLog[]>(logs);
  const [webhookOrders, setWebhookOrders] = useState<AffiliateOrder[]>([]);
  const [webhookSummary, setWebhookSummary] = useState({
    totalOrders: 0,
    totalSales: 0,
    totalCommissions: 0,
  });

  const loadWebhookOrders = () => {
    fetch('/api/webhooks/orders')
      .then((res) => res.json())
      .then((data) => {
        if (data.orders) setWebhookOrders(data.orders);
        if (data.summary) setWebhookSummary(data.summary);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    // Fetch real recorded dispatches from backend
    fetch('/api/dispatch-logs')
      .then((res) => res.json())
      .then((data) => {
        if (data.logs && data.logs.length > 0) {
          setRealLogs(data.logs);
        }
      })
      .catch((err) => console.error(err));

    loadWebhookOrders();
    const interval = setInterval(loadWebhookOrders, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Bot Automation Status Header Card */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 sm:p-8 border border-slate-700 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20 shrink-0">
            <Zap className="w-8 h-8 fill-slate-950 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Automação Multi-Marketplace 24h
              </h2>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                  isBotActive
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                }`}
              >
                {isBotActive ? '🟢 OPERANDO ATIVAMENTE' : '🟡 PAUSADO'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Varrendo <strong>Amazon</strong>, <strong>Mercado Livre</strong> e <strong>Shopee</strong>. Próximo envio em <strong>14 min</strong> nos <strong>{activeGroupsCount} grupos ativos</strong> ({totalMembers} membros).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {onOpenSecurityShield && (
            <button
              onClick={onOpenSecurityShield}
              className="flex-1 md:flex-initial text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-emerald-400 transition-colors cursor-pointer text-center"
            >
              Auditoria de Segurança
            </button>
          )}
          <button
            onClick={onOpenQuickSend}
            className="flex-1 md:flex-initial text-xs font-extrabold px-5 py-2.5 rounded-xl bg-[#ee4d2d] hover:bg-[#d73211] text-white shadow-md shadow-orange-500/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Disparar Agora</span>
          </button>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-[#ede8e3] shadow-sm">
          <div className="flex items-center justify-between text-[#8c827a] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Disparos Registrados Hoje</span>
            <Send className="w-4 h-4 text-[#ee4d2d]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#191414]">74</span>
            <span className="text-xs text-emerald-600 font-bold">+24% vs ontem</span>
          </div>
          <p className="text-[11px] text-[#8c827a] mt-2">Média de 1 post a cada 20 min</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#ede8e3] shadow-sm">
          <div className="flex items-center justify-between text-[#8c827a] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Comissão Estimada Acumulada</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-700">R$ 382,90</span>
            <span className="text-xs text-emerald-600 font-bold">Multi-Lojas</span>
          </div>
          <p className="text-[11px] text-[#8c827a] mt-2">Amazon (R$ 142) • Shopee (R$ 130) • Meli (R$ 110)</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#ede8e3] shadow-sm">
          <div className="flex items-center justify-between text-[#8c827a] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Cliques nos Links Oficiais</span>
            <TrendingUp className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#191414]">1.940</span>
            <span className="text-xs text-emerald-600 font-bold">CTR 5.2%</span>
          </div>
          <p className="text-[11px] text-[#8c827a] mt-2">Links curtos oficiais e seguros</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#ede8e3] shadow-sm">
          <div className="flex items-center justify-between text-[#8c827a] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Alcance dos Grupos</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#191414]">{totalMembers.toLocaleString()}</span>
            <span className="text-xs text-blue-600 font-bold">{activeGroupsCount} grupos</span>
          </div>
          <p className="text-[11px] text-[#8c827a] mt-2">Total de membros no WhatsApp</p>
        </div>
      </div>

      {/* REAL-TIME AFFILIATE WEBHOOK ORDER NOTIFICATION PANEL */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 border border-slate-700/80 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/30">
              <Webhook className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Notificações em Tempo Real de Novos Pedidos (Webhooks)
                </h3>
                <span className="flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  RECEPTOR ATIVO
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Receba confirmações imediatas de vendas das suas redes (Amazon, Shopee, Mercado Livre, Kiwify, etc.)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                fetch('/api/webhooks/simulate', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ marketplace: 'amazon' }),
                })
                  .then((r) => r.json())
                  .then(() => loadWebhookOrders())
                  .catch(console.error);
              }}
              className="text-xs font-semibold px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer flex items-center gap-1.5"
            >
              <Bell className="w-3.5 h-3.5 text-amber-400" />
              <span>Simular Venda</span>
            </button>
            <button
              onClick={() => onNavigateTab('webhooks')}
              className="text-xs font-bold px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white transition shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <span>Gerenciar Webhook</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Live Orders Stream Cards */}
        {webhookOrders.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400 border border-dashed border-slate-800 rounded-2xl">
            Nenhum pedido recebido ainda. Configure seu endpoint ou clique em "Simular Venda" para testar a notificação visual.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {webhookOrders.slice(0, 3).map((ord) => (
              <div
                key={ord.id}
                className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 rounded-2xl p-3.5 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase ${
                        ord.marketplace === 'amazon'
                          ? 'bg-[#232f3e] text-white border border-slate-700'
                          : ord.marketplace === 'mercadolivre'
                          ? 'bg-[#ffe600] text-black font-extrabold'
                          : ord.marketplace === 'shopee'
                          ? 'bg-[#ee4d2d] text-white'
                          : 'bg-indigo-600 text-white'
                      }`}
                    >
                      {ord.marketplace}
                    </span>
                    <span className="text-[10px] text-slate-400">{ord.timestamp}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white line-clamp-1 mb-1">
                    {ord.productTitle}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Valor: R$ {ord.orderAmount.toFixed(2)} • {ord.buyerState || 'BR'}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-700/60 flex items-center justify-between">
                  <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    Venda Aprovada
                  </span>
                  <span className="text-xs font-black text-emerald-300">
                    +R$ {ord.commissionAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* TWO COLUMN SECTION: TOP VIRAL PRODUCTS + RECENT LOGS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Top Multi-Marketplace Deals */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#ede8e3] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#f0ebe4]">
            <div>
              <h3 className="text-base font-bold text-[#191414] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#ee4d2d]" />
                Top Ofertas Selecionadas pelo Radar
              </h3>
              <p className="text-xs text-[#6b635b]">
                Produtos com maior Smart Score e comissão ativa hoje
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('products')}
              className="text-xs font-bold text-[#ee4d2d] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Ver Catálogo Completo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {products.slice(0, 4).map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-3 rounded-2xl border border-[#f0ebe4] hover:border-orange-200 hover:bg-[#faf8f5] transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={p.imageUrl}
                    alt={p.title}
                    className="w-12 h-12 rounded-xl object-cover shrink-0 bg-gray-100"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span
                        className={`text-[9px] font-black px-1.5 py-0.2 rounded uppercase ${
                          p.marketplace === 'amazon'
                            ? 'bg-[#232f3e] text-white'
                            : p.marketplace === 'mercadolivre'
                            ? 'bg-[#ffe600] text-black font-extrabold'
                            : 'bg-[#ee4d2d] text-white'
                        }`}
                      >
                        {p.marketplace}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-[#191414] truncate">
                        {p.title}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#6b635b]">
                      <span className="font-extrabold text-[#ee4d2d]">
                        R$ {p.price.toFixed(2)}
                      </span>
                      <span>•</span>
                      <span className="text-emerald-700 font-bold">
                        Comissão: R$ {p.estimatedCommission.toFixed(2)} ({p.commissionRate}%)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0 pl-3">
                  <span className="inline-block text-[11px] font-black px-2 py-0.5 rounded-full bg-slate-900 text-amber-300">
                    Score {p.smartScore}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Activity Dispatches Stream */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#ede8e3] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#f0ebe4]">
            <h3 className="text-base font-bold text-[#191414] flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              Histórico Real de Disparos
            </h3>
            <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Ao Vivo
            </span>
          </div>

          <div className="space-y-3">
            {realLogs.slice(0, 5).map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-[#faf8f5] border border-[#ede8e3] text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 truncate max-w-[200px]">
                    {log.marketplace && (
                      <span className="text-[9px] font-bold px-1 rounded bg-slate-200 text-slate-800 uppercase">
                        {log.marketplace}
                      </span>
                    )}
                    <span className="font-bold text-[#191414] truncate">{log.groupName}</span>
                  </div>
                  <span className="text-[10px] text-[#8c827a] font-medium">{log.timestamp}</span>
                </div>
                <p className="text-[11px] text-[#6b635b] truncate">{log.productTitle}</p>
                <div className="flex items-center justify-between pt-1 border-t border-gray-100 text-[10px]">
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Enviado via {log.deliveryMethod || 'WhatsApp Web'}
                  </span>
                  <span className="font-semibold text-emerald-700">
                    Comissão: R$ {log.commission.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
