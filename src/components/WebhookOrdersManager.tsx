import React, { useState, useEffect } from 'react';
import {
  Webhook,
  Copy,
  Check,
  RefreshCw,
  Bell,
  DollarSign,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Lock,
  Eye,
  EyeOff,
  ShoppingBag,
  Send,
  AlertCircle,
  FileCode,
} from 'lucide-react';
import { AffiliateOrder, WebhookSettings } from '../types';

interface WebhookOrdersManagerProps {
  onOrderReceived?: (order: AffiliateOrder) => void;
}

export const WebhookOrdersManager: React.FC<WebhookOrdersManagerProps> = ({
  onOrderReceived,
}) => {
  const [config, setConfig] = useState<WebhookSettings>({
    isEnabled: true,
    webhookUrl: '',
    secretToken: 'whsec_promoradar_884920',
    allowedEvents: ['order.created', 'order.approved'],
    autoDispatchAlertToWhatsApp: true,
    soundAlert: true,
  });

  const [orders, setOrders] = useState<AffiliateOrder[]>([]);
  const [summary, setSummary] = useState({
    totalOrders: 0,
    approvedCount: 0,
    totalSales: 0,
    totalCommissions: 0,
  });

  const [loading, setLoading] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [selectedRawOrder, setSelectedRawOrder] = useState<AffiliateOrder | null>(null);

  const fetchWebhookData = async () => {
    try {
      setLoading(true);
      const [configRes, ordersRes] = await Promise.all([
        fetch('/api/webhooks/config'),
        fetch('/api/webhooks/orders'),
      ]);

      if (configRes.ok) {
        const cData = await configRes.json();
        setConfig(cData.config);
      }

      if (ordersRes.ok) {
        const oData = await ordersRes.json();
        setOrders(oData.orders || []);
        if (oData.summary) {
          setSummary(oData.summary);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWebhookData();
  }, []);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(config.webhookUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleCopyToken = () => {
    navigator.clipboard.writeText(config.secretToken);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const handleSaveConfig = async () => {
    try {
      const res = await fetch('/api/webhooks/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSimulateOrder = async (marketplace: 'amazon' | 'mercadolivre' | 'shopee') => {
    setIsSimulating(true);
    try {
      const res = await fetch('/api/webhooks/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ marketplace }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.order) {
          setOrders((prev) => [data.order, ...prev]);
          setSummary((prev) => ({
            ...prev,
            totalOrders: prev.totalOrders + 1,
            approvedCount: prev.approvedCount + 1,
            totalSales: prev.totalSales + data.order.orderAmount,
            totalCommissions: prev.totalCommissions + data.order.commissionAmount,
          }));

          // Trigger live notification in the dashboard
          if (onOrderReceived) {
            onOrderReceived(data.order);
          }
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Title and Top Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#191414] tracking-tight">
            Webhooks & Notificações de Vendas em Tempo Real
          </h2>
          <p className="text-xs sm:text-sm text-[#6b635b] mt-1">
            Receba alertas instantâneos de comissões geradas na <strong>Shopee</strong>, <strong>Amazon</strong>, <strong>Mercado Livre</strong> e plataformas parceiras.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSimulateOrder('amazon')}
            disabled={isSimulating}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-900 text-amber-300 font-bold text-xs hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simular Venda Amazon</span>
          </button>

          <button
            onClick={() => handleSimulateOrder('mercadolivre')}
            disabled={isSimulating}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-amber-300 bg-[#ffe600] text-black font-extrabold text-xs hover:bg-yellow-400 transition-colors cursor-pointer disabled:opacity-50"
          >
            <span>Simular Meli</span>
          </button>

          <button
            onClick={() => handleSimulateOrder('shopee')}
            disabled={isSimulating}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#ee4d2d] text-white font-bold text-xs hover:bg-[#d73211] transition-colors cursor-pointer disabled:opacity-50"
          >
            <span>Simular Shopee</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-[#ede8e3] shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8c827a] block mb-1">
            Comissões Recebidas via Webhook
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-700">
              R$ {summary.totalCommissions.toFixed(2)}
            </span>
            <span className="text-xs text-emerald-600 font-bold">Ao Vivo</span>
          </div>
          <p className="text-[11px] text-[#8c827a] mt-2">Atualizado em milissegundos</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#ede8e3] shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8c827a] block mb-1">
            Total de Pedidos Notificados
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#191414]">{summary.totalOrders}</span>
            <span className="text-xs text-emerald-600 font-bold">{summary.approvedCount} aprovados</span>
          </div>
          <p className="text-[11px] text-[#8c827a] mt-2">Sem necessidade de checagem manual</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#ede8e3] shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8c827a] block mb-1">
            Volume de Vendas Faturado
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#191414]">
              R$ {summary.totalSales.toFixed(2)}
            </span>
            <span className="text-xs text-blue-600 font-bold">GMV</span>
          </div>
          <p className="text-[11px] text-[#8c827a] mt-2">Valor bruto dos produtos</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#ede8e3] shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8c827a] block mb-1">
            Status do Receptor
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`w-3 h-3 rounded-full ${
                config.isEnabled ? 'bg-emerald-500 animate-ping' : 'bg-gray-400'
              }`}
            />
            <span
              className={`text-base font-black ${
                config.isEnabled ? 'text-emerald-700' : 'text-gray-500'
              }`}
            >
              {config.isEnabled ? 'RECEPTOR ONLINE' : 'PAUSADO'}
            </span>
          </div>
          <p className="text-[11px] text-[#8c827a] mt-2">Porta 3000 ativa e ouvindo</p>
        </div>
      </div>

      {/* Webhook Configuration Card */}
      <div className="bg-white rounded-3xl border border-[#ede8e3] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <Webhook className="w-5 h-5 text-[#ee4d2d]" />
            <h3 className="font-bold text-base text-[#191414]">URL de Notificação & Autenticação</h3>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
              <span>Receptor Ativo:</span>
              <input
                type="checkbox"
                checked={config.isEnabled}
                onChange={(e) => setConfig((prev) => ({ ...prev, isEnabled: e.target.checked }))}
                className="w-4 h-4 accent-emerald-600 rounded"
              />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Endpoint URL */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#4a423b] mb-1.5 flex items-center justify-between">
              <span>URL de Ingestão de Webhook (POST):</span>
              <span className="text-[10px] text-emerald-700 font-bold">SSL Seguro</span>
            </label>
            <div className="flex items-center">
              <input
                type="text"
                readOnly
                value={config.webhookUrl || `${window.location.origin}/api/webhooks/orders`}
                className="w-full px-3.5 py-2.5 rounded-l-xl border border-r-0 border-[#e2dbd2] font-mono text-xs bg-[#faf8f5] text-slate-800"
              />
              <button
                onClick={handleCopyUrl}
                className="px-4 py-2.5 rounded-r-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                {copiedUrl ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedUrl ? 'Copiado!' : 'Copiar'}</span>
              </button>
            </div>
            <span className="text-[11px] text-gray-500 mt-1 block">
              Insira esta URL nas configurações de postback/webhooks do seu painel de afiliado.
            </span>
          </div>

          {/* Secret Token */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#4a423b] mb-1.5 flex items-center justify-between">
              <span>Token Secreto de Validação (Header x-webhook-token):</span>
              <button
                type="button"
                onClick={() => setShowSecret(!showSecret)}
                className="text-[11px] text-[#ee4d2d] hover:underline flex items-center gap-1 font-normal cursor-pointer"
              >
                {showSecret ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                <span>{showSecret ? 'Ocultar' : 'Visualizar'}</span>
              </button>
            </label>
            <div className="flex items-center">
              <input
                type={showSecret ? 'text' : 'password'}
                value={config.secretToken}
                onChange={(e) => setConfig((prev) => ({ ...prev, secretToken: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-l-xl border border-r-0 border-[#e2dbd2] font-mono text-xs bg-[#faf8f5] text-slate-800"
              />
              <button
                onClick={handleCopyToken}
                className="px-4 py-2.5 rounded-r-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                {copiedToken ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedToken ? 'Copiado!' : 'Copiar'}</span>
              </button>
            </div>
            <span className="text-[11px] text-gray-500 mt-1 block">
              Usado para assinar e validar a autenticidade das requisições recebidas.
            </span>
          </div>
        </div>

        {/* Action Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <label className="flex items-center justify-between p-3.5 rounded-xl border border-gray-200 bg-[#faf8f5] cursor-pointer">
            <div className="flex items-center gap-2.5">
              <Bell className="w-4 h-4 text-emerald-600" />
              <div className="text-xs">
                <p className="font-bold text-[#191414]">Notificação Visual no Painel</p>
                <p className="text-[11px] text-[#6b635b]">Exibe pop-up animado em tempo real a cada comissão</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={config.soundAlert}
              onChange={(e) => setConfig((prev) => ({ ...prev, soundAlert: e.target.checked }))}
              className="w-4 h-4 accent-emerald-600 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-xl border border-gray-200 bg-[#faf8f5] cursor-pointer">
            <div className="flex items-center gap-2.5">
              <Send className="w-4 h-4 text-blue-600" />
              <div className="text-xs">
                <p className="font-bold text-[#191414]">Encaminhar Notificação ao WhatsApp</p>
                <p className="text-[11px] text-[#6b635b]">Dispara aviso no seu grupo de administração</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={config.autoDispatchAlertToWhatsApp}
              onChange={(e) =>
                setConfig((prev) => ({ ...prev, autoDispatchAlertToWhatsApp: e.target.checked }))
              }
              className="w-4 h-4 accent-blue-600 rounded"
            />
          </label>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleSaveConfig}
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
          >
            {saveSuccess ? 'Configurações Salvas! ✓' : 'Salvar Configurações'}
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-[#ede8e3] p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-base text-[#191414]">Pedidos Recebidos em Tempo Real</h3>
          </div>
          <span className="text-xs text-[#8c827a] font-medium">{orders.length} pedidos no histórico</span>
        </div>

        <div className="divide-y divide-gray-100">
          {orders.map((order) => (
            <div key={order.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                    order.marketplace === 'amazon'
                      ? 'bg-[#232f3e] text-amber-300'
                      : order.marketplace === 'mercadolivre'
                      ? 'bg-[#ffe600] text-black font-extrabold'
                      : 'bg-[#ee4d2d] text-white'
                  }`}
                >
                  {order.marketplace === 'amazon'
                    ? 'AMZ'
                    : order.marketplace === 'mercadolivre'
                    ? 'MELI'
                    : 'SHP'}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-800">
                      {order.orderId}
                    </span>
                    {order.buyerState && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-gray-100 text-gray-700">
                        {order.buyerState}
                      </span>
                    )}
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-[11px] text-gray-500">{order.timestamp}</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-semibold text-[#191414] truncate">
                    {order.productTitle}
                  </h4>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pl-12 sm:pl-0">
                <div className="text-right">
                  <span className="text-[11px] text-gray-500 block">
                    Valor: R$ {order.orderAmount.toFixed(2)}
                  </span>
                  <span className="text-sm font-black text-emerald-700 block">
                    +R$ {order.commissionAmount.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Aprovado ✓
                  </span>

                  {order.rawPayload && (
                    <button
                      onClick={() => setSelectedRawOrder(order)}
                      className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-500 transition-colors"
                      title="Ver Payload JSON"
                    >
                      <FileCode className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Raw Payload Modal */}
      {selectedRawOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-700">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold font-mono text-amber-300">
                Payload JSON: {selectedRawOrder.orderId}
              </span>
              <button
                onClick={() => setSelectedRawOrder(null)}
                className="text-gray-400 hover:text-white text-xs font-bold"
              >
                ✕ Fechar
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-slate-950 font-mono text-[11px] text-emerald-400 overflow-x-auto max-h-72">
              {JSON.stringify(selectedRawOrder, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
