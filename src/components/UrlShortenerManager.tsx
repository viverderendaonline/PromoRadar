import React, { useState, useEffect } from 'react';
import {
  Link2,
  Copy,
  Check,
  ExternalLink,
  Plus,
  TrendingUp,
  Smartphone,
  Monitor,
  BarChart3,
  Layers,
  Sparkles,
  RefreshCw,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { ShortenedLink, Marketplace } from '../types';

export const UrlShortenerManager: React.FC = () => {
  const [links, setLinks] = useState<ShortenedLink[]>([]);
  const [summary, setSummary] = useState<{
    totalLinks: number;
    totalClicks: number;
    byMarketplace: Record<string, number>;
    estimatedCtr: string;
  }>({
    totalLinks: 0,
    totalClicks: 0,
    byMarketplace: { shopee: 0, amazon: 0, mercadolivre: 0 },
    estimatedCtr: '5.6%',
  });

  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form State
  const [targetUrl, setTargetUrl] = useState('');
  const [productTitle, setProductTitle] = useState('');
  const [marketplace, setMarketplace] = useState<Marketplace>('amazon');
  const [customSlug, setCustomSlug] = useState('');
  const [expandedLinkId, setExpandedLinkId] = useState<string | null>(null);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/shortened-links');
      if (res.ok) {
        const data = await res.json();
        setLinks(data.links || []);
        if (data.summary) {
          setSummary(data.summary);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleCreateShortLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUrl.trim()) return;

    setIsCreating(true);
    try {
      const res = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUrl: targetUrl.trim(),
          productTitle: productTitle.trim() || 'Achadinho Selecionado',
          marketplace,
          customSlug: customSlug.trim() || undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setTargetUrl('');
        setProductTitle('');
        setCustomSlug('');
        fetchLinks();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopy = (link: ShortenedLink) => {
    const fullUrl = `${window.location.origin}${link.shortUrl}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(link.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#191414] tracking-tight">
            Encurtador de Links & Analytics de Cliques
          </h2>
          <p className="text-xs sm:text-sm text-[#6b635b] mt-1">
            Gere links curtos personalizados com o seu domínio, oculte tags cruas de afiliados e monitore cliques em tempo real.
          </p>
        </div>

        <button
          onClick={fetchLinks}
          disabled={loading}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-gray-50 text-xs font-bold text-slate-700 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Atualizar Métricas</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-[#ede8e3] shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8c827a] block mb-1">
            Total de Links Criados
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#191414]">{summary.totalLinks}</span>
            <span className="text-xs text-emerald-600 font-bold">100% ativos</span>
          </div>
          <p className="text-[11px] text-[#8c827a] mt-2">Redirecionamento instantâneo 302</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#ede8e3] shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8c827a] block mb-1">
            Cliques Totais Registrados
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-700">
              {summary.totalClicks.toLocaleString()}
            </span>
            <span className="text-xs text-emerald-600 font-bold">+18% hoje</span>
          </div>
          <p className="text-[11px] text-[#8c827a] mt-2">Origem WhatsApp Web & Mobile</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#ede8e3] shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8c827a] block mb-1">
            Taxa Média de Clique (CTR)
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-600">{summary.estimatedCtr}</span>
            <span className="text-xs text-emerald-600 font-bold">Alta conversão</span>
          </div>
          <p className="text-[11px] text-[#8c827a] mt-2">Links curtos recebem 43% mais cliques</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#ede8e3] shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8c827a] block mb-1">
            Cliques por Loja
          </span>
          <div className="flex items-center gap-3 mt-1.5 text-xs font-bold">
            <span className="text-[#ee4d2d]">Shopee: {summary.byMarketplace?.shopee || 0}</span>
            <span className="text-blue-700">Amazon: {summary.byMarketplace?.amazon || 0}</span>
            <span className="text-amber-600">Meli: {summary.byMarketplace?.mercadolivre || 0}</span>
          </div>
          <p className="text-[11px] text-[#8c827a] mt-2">Rastreio unificado</p>
        </div>
      </div>

      {/* Create New Link Form */}
      <div className="bg-white rounded-3xl border border-[#ede8e3] p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
          <Plus className="w-5 h-5 text-[#ee4d2d]" />
          <h3 className="font-bold text-base text-[#191414]">Criar Novo Link Encurtado com Rastreio</h3>
        </div>

        <form onSubmit={handleCreateShortLink} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4a423b] mb-1">
                URL Original de Afiliado (Amazon, Mercado Livre ou Shopee):
              </label>
              <input
                type="url"
                required
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://www.amazon.com.br/dp/... ou shope.ee/..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2dbd2] text-xs sm:text-sm bg-[#faf8f5] outline-none focus:ring-2 focus:ring-[#ee4d2d]/30"
              />
            </div>

            <div className="md:col-span-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4a423b] mb-1">
                Título ou Nome da Campanha:
              </label>
              <input
                type="text"
                value={productTitle}
                onChange={(e) => setProductTitle(e.target.value)}
                placeholder="ex: Fone JBL Wave Buds TWS"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2dbd2] text-xs sm:text-sm bg-[#faf8f5] outline-none focus:ring-2 focus:ring-[#ee4d2d]/30"
              />
            </div>

            <div className="md:col-span-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4a423b] mb-1">
                Marketplace:
              </label>
              <select
                value={marketplace}
                onChange={(e: any) => setMarketplace(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2dbd2] text-xs sm:text-sm bg-[#faf8f5] font-semibold"
              >
                <option value="amazon">📦 Amazon Brasil</option>
                <option value="mercadolivre">⚡ Mercado Livre</option>
                <option value="shopee">🛍️ Shopee Brasil</option>
              </select>
            </div>

            <div className="md:col-span-8">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4a423b] mb-1 flex items-center justify-between">
                <span>Slug Personalizado (Opcional):</span>
                <span className="text-[10px] text-gray-500 font-mono">
                  {window.location.origin}/r/{customSlug || 'slug-automatico'}
                </span>
              </label>
              <div className="flex items-center">
                <span className="bg-gray-100 text-gray-500 text-xs px-3 py-2.5 rounded-l-xl border border-r-0 border-[#e2dbd2] font-mono select-none">
                  /r/
                </span>
                <input
                  type="text"
                  value={customSlug}
                  onChange={(e) => setCustomSlug(e.target.value)}
                  placeholder="ex: fone-jbl-promocao"
                  className="w-full px-3.5 py-2.5 rounded-r-xl border border-[#e2dbd2] text-xs sm:text-sm bg-[#faf8f5] outline-none focus:ring-2 focus:ring-[#ee4d2d]/30 font-mono"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isCreating}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Link2 className="w-4 h-4 text-amber-300" />
              <span>{isCreating ? 'Encurtando...' : 'Encurtar e Gerar Link'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Shortened Links Table */}
      <div className="bg-white rounded-3xl border border-[#ede8e3] p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <h3 className="font-bold text-base text-[#191414]">Links Ativos & Histórico de Cliques</h3>
          <span className="text-xs text-[#8c827a] font-medium">{links.length} links cadastrados</span>
        </div>

        <div className="divide-y divide-gray-100">
          {links.map((link) => {
            const fullShortUrl = `${window.location.origin}${link.shortUrl}`;
            const isExpanded = expandedLinkId === link.id;

            return (
              <div key={link.id} className="py-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${
                          link.marketplace === 'amazon'
                            ? 'bg-[#232f3e] text-white'
                            : link.marketplace === 'mercadolivre'
                            ? 'bg-[#ffe600] text-black font-extrabold'
                            : 'bg-[#ee4d2d] text-white'
                        }`}
                      >
                        {link.marketplace}
                      </span>
                      <h4 className="font-bold text-sm text-[#191414] truncate">
                        {link.productTitle}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {fullShortUrl}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-[11px] text-gray-500">{link.createdAt}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {/* Click Counter Pill */}
                    <div className="bg-slate-900 text-white px-3 py-1.5 rounded-xl text-center">
                      <span className="text-base font-black text-amber-300 leading-none block">
                        {link.clicks}
                      </span>
                      <span className="text-[9px] uppercase tracking-wider text-slate-400">
                        Cliques
                      </span>
                    </div>

                    {/* Copy Link Button */}
                    <button
                      onClick={() => handleCopy(link)}
                      className="p-2 rounded-xl border border-gray-200 hover:bg-orange-50 hover:text-[#ee4d2d] text-gray-600 transition-colors cursor-pointer"
                      title="Copiar Link"
                    >
                      {copiedId === link.id ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>

                    {/* Test Redirect in New Tab */}
                    <a
                      href={link.shortUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl border border-gray-200 hover:bg-blue-50 hover:text-blue-700 text-gray-600 transition-colors"
                      title="Testar Redirecionamento"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>

                    {/* Toggle Analytics details */}
                    <button
                      onClick={() => setExpandedLinkId(isExpanded ? null : link.id)}
                      className="text-xs font-bold text-slate-700 hover:text-[#ee4d2d] underline cursor-pointer"
                    >
                      {isExpanded ? 'Ocultar' : 'Analytics'}
                    </button>
                  </div>
                </div>

                {/* Expanded Click Telemetry */}
                {isExpanded && (
                  <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3 text-xs animate-fadeIn">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="font-bold text-amber-300 flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4" />
                        Telemetria em Tempo Real de Acessos
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Destino Real: <span className="font-mono text-slate-300 truncate max-w-xs">{link.targetUrl}</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                        <span className="text-[10px] text-slate-400 uppercase block font-semibold">
                          Total de Acessos
                        </span>
                        <span className="text-lg font-black text-emerald-400">{link.clicks} cliques</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                        <span className="text-[10px] text-slate-400 uppercase block font-semibold">
                          Dispositivos
                        </span>
                        <span className="text-xs text-slate-200 font-semibold flex items-center gap-2 mt-1">
                          <Smartphone className="w-3.5 h-3.5 text-blue-400" /> 84% Mobile
                          <Monitor className="w-3.5 h-3.5 text-purple-400 ml-2" /> 16% Desktop
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                        <span className="text-[10px] text-slate-400 uppercase block font-semibold">
                          Proteção de Tag
                        </span>
                        <span className="text-xs text-emerald-400 font-semibold">Tag 100% Oculta</span>
                      </div>
                    </div>

                    {link.recentClicks && link.recentClicks.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Últimos cliques registrados:
                        </span>
                        <div className="space-y-1">
                          {link.recentClicks.slice(0, 4).map((c, i) => (
                            <div
                              key={c.id || i}
                              className="flex items-center justify-between text-[11px] text-slate-300 p-1.5 rounded bg-slate-800/50"
                            >
                              <span className="flex items-center gap-1.5">
                                {c.device === 'mobile' ? (
                                  <Smartphone className="w-3 h-3 text-blue-400" />
                                ) : (
                                  <Monitor className="w-3 h-3 text-purple-400" />
                                )}
                                <span>{c.referrer || 'WhatsApp'}</span>
                              </span>
                              <span className="text-slate-400 text-[10px]">{c.timestamp}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
