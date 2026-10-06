import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Send,
  Wand2,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Tag,
  DollarSign,
  Percent,
} from 'lucide-react';
import { AffiliateDeal, Marketplace } from '../types';

interface FreeMessageGeneratorProps {
  products: AffiliateDeal[];
  onOpenDashboard?: () => void;
  onOpenSecurityShield?: () => void;
}

export const FreeMessageGenerator: React.FC<FreeMessageGeneratorProps> = ({
  products,
  onOpenDashboard,
  onOpenSecurityShield,
}) => {
  const [inputUrl, setInputUrl] = useState('');
  const [selectedMarketplace, setSelectedMarketplace] = useState<Marketplace>('amazon');
  const [affiliateTag, setAffiliateTag] = useState('promoradar-20');
  const [selectedStyle, setSelectedStyle] = useState<'urgencia' | 'achadinho' | 'viral' | 'cupom'>('urgencia');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Current active product
  const [currentProduct, setCurrentProduct] = useState<AffiliateDeal>(products[0]);
  const [generatedMessage, setGeneratedMessage] = useState<string>(
    `🚨 *ALERTA DE PREÇO BAIXO!* 🚨\n\nAmazon Brasil 📦\n✨ *${products[0].title}*\n\n❌ De: ~R$ ${products[0].originalPrice.toFixed(2).replace('.', ',')}~\n🔥 *Por apenas: R$ ${products[0].price.toFixed(2).replace('.', ',')}* (${products[0].discountPercent}% OFF!)\n\n🎟️ *Benefício:* ${products[0].coupon || 'Frete Grátis com Prime'}\n⭐ Avaliação: ${products[0].rating} ⭐ (+38.000 avaliações)\n\n⚠️ *Corre que o lote promocional acaba rápido!*\n👉 *Garanta o seu aqui:* https://www.amazon.com.br/dp/B09B8V1LZ3?tag=promoradar-20\n\n⚡ _Disparado via PromoRadar Pro_`
  );

  // Auto-detect marketplace when typing URL
  const handleInputChange = (val: string) => {
    setInputUrl(val);
    const lower = val.toLowerCase();
    if (lower.includes('amazon') || lower.includes('amzn.to')) {
      setSelectedMarketplace('amazon');
      if (!affiliateTag.includes('-20')) setAffiliateTag('promoradar-20');
    } else if (lower.includes('mercadolivre') || lower.includes('meli')) {
      setSelectedMarketplace('mercadolivre');
      setAffiliateTag('promoradar_meli');
    } else if (lower.includes('shopee') || lower.includes('shope.ee')) {
      setSelectedMarketplace('shopee');
      setAffiliateTag('promoradar_shopee');
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMsg(null);

    try {
      let productToUse = currentProduct;

      // Extract real product data via backend
      if (inputUrl.trim()) {
        const extractRes = await fetch('/api/extract-product', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: inputUrl.trim(),
            marketplaceHint: selectedMarketplace,
            amazonTag: affiliateTag,
            shopeeId: affiliateTag,
            meliTracking: affiliateTag,
          }),
        });

        if (!extractRes.ok) {
          const errData = await extractRes.json();
          throw new Error(errData.error || 'Erro ao processar URL');
        }

        const extractData = await extractRes.json();
        if (extractData.product) {
          productToUse = {
            id: 'custom-' + Date.now(),
            ...extractData.product,
          };
          setCurrentProduct(productToUse);
          setSelectedMarketplace(extractData.marketplace || selectedMarketplace);
        }
      }

      // Generate persuasive copy via Gemini API
      const copyRes = await fetch('/api/generate-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: productToUse.title,
          price: productToUse.price.toFixed(2).replace('.', ','),
          originalPrice: productToUse.originalPrice.toFixed(2).replace('.', ','),
          discount: `${productToUse.discountPercent}% OFF`,
          coupon: productToUse.coupon || 'Frete Grátis Ativado',
          affiliateLink: productToUse.affiliateUrl || `https://promoradar.pro/link?tag=${affiliateTag}`,
          rating: `${productToUse.rating} ⭐ (${productToUse.reviewCount} avaliações)`,
          salesCount: `+${productToUse.salesCount} vendidos`,
          marketplace: productToUse.marketplace || selectedMarketplace,
          style: selectedStyle,
        }),
      });

      if (copyRes.ok) {
        const copyData = await copyRes.json();
        if (copyData.copy) {
          setGeneratedMessage(copyData.copy);
        }
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Erro ao gerar mensagem');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendWhatsApp = () => {
    const encoded = encodeURIComponent(generatedMessage);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 text-amber-300 text-xs font-bold mb-3 border border-slate-700">
          <Sparkles className="w-4 h-4 text-amber-400" />
          GERADOR MULTI-MARKETPLACE (SHOPEE • AMAZON • MERCADO LIVRE)
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#191414] tracking-tight">
          Gerador de Copies & Links de Afiliado para WhatsApp
        </h1>
        <p className="mt-3 text-base text-[#6b635b]">
          Cole o link de qualquer produto da <strong>Amazon</strong>, <strong>Mercado Livre</strong> ou <strong>Shopee</strong>. O sistema extrai os dados, embute seu código oficial de associado e gera mensagens prontas para enviar.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Controls Column */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-[#ede8e3] shadow-sm space-y-5">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold">
              ⚠️ {errorMsg}
            </div>
          )}

          {/* Marketplace Selector Tabs */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#4a423b] mb-2">
              Selecione o Marketplace:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedMarketplace('amazon');
                  setAffiliateTag('promoradar-20');
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  selectedMarketplace === 'amazon'
                    ? 'bg-[#232f3e] text-white border-[#232f3e] shadow-sm'
                    : 'bg-[#faf8f5] text-[#6b635b] border-[#ede8e3] hover:bg-gray-100'
                }`}
              >
                <span>📦 Amazon</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedMarketplace('mercadolivre');
                  setAffiliateTag('promoradar_meli');
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  selectedMarketplace === 'mercadolivre'
                    ? 'bg-[#ffe600] text-black font-extrabold border-amber-400 shadow-sm'
                    : 'bg-[#faf8f5] text-[#6b635b] border-[#ede8e3] hover:bg-gray-100'
                }`}
              >
                <span>⚡ Mercado Livre</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedMarketplace('shopee');
                  setAffiliateTag('promoradar_shopee');
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  selectedMarketplace === 'shopee'
                    ? 'bg-[#ee4d2d] text-white border-[#ee4d2d] shadow-sm'
                    : 'bg-[#faf8f5] text-[#6b635b] border-[#ede8e3] hover:bg-gray-100'
                }`}
              >
                <span>🛍️ Shopee</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#4a423b] mb-2 flex items-center justify-between">
              <span>Link do Produto ou Palavra-Chave:</span>
              <span className="text-[11px] text-[#ee4d2d] font-normal">Ex: amazon.com.br/dp/B09...</span>
            </label>
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Cole o link ou digite o nome do produto..."
              className="w-full px-4 py-3 rounded-xl border border-[#e2dbd2] focus:ring-2 focus:ring-[#ee4d2d]/30 focus:border-[#ee4d2d] outline-none text-sm bg-[#faf8f5]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4a423b] mb-2">
                Sua Tag / ID de Afiliado:
              </label>
              <input
                type="text"
                value={affiliateTag}
                onChange={(e) => setAffiliateTag(e.target.value)}
                placeholder="ex: meunome-20 ou af_id"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2dbd2] focus:ring-2 focus:ring-[#ee4d2d]/30 focus:border-[#ee4d2d] outline-none text-sm bg-[#faf8f5]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4a423b] mb-2">
                Estilo da Mensagem:
              </label>
              <select
                value={selectedStyle}
                onChange={(e: any) => setSelectedStyle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2dbd2] focus:ring-2 focus:ring-[#ee4d2d]/30 focus:border-[#ee4d2d] outline-none text-sm bg-[#faf8f5] font-medium"
              >
                <option value="urgencia">🚨 Urgência & Fogo</option>
                <option value="achadinho">🤫 Achadinho de Amiga</option>
                <option value="viral">📲 Viral do TikTok</option>
                <option value="cupom">🎟️ Cupom & Frete Grátis</option>
              </select>
            </div>
          </div>

          {/* Quick Preset Products */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#4a423b] mb-2">
              Ou selecione uma oferta de teste do catálogo:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {products.slice(0, 4).map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setCurrentProduct(p);
                    setSelectedMarketplace(p.marketplace);
                    setInputUrl(p.title);
                  }}
                  className={`text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer flex items-center gap-2 ${
                    currentProduct.id === p.id
                      ? 'border-[#ee4d2d] bg-orange-50 font-bold text-[#ee4d2d]'
                      : 'border-[#ede8e3] hover:border-orange-200 bg-[#faf8f5]'
                  }`}
                >
                  <img src={p.imageUrl} alt="" className="w-8 h-8 rounded-lg object-cover" />
                  <div className="truncate">
                    <p className="truncate font-semibold">{p.title}</p>
                    <p className="text-[10px] text-emerald-700 font-bold">
                      {p.marketplace.toUpperCase()} • R$ {p.price.toFixed(2)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#1e293b] via-[#0f172a] to-[#ee4d2d] hover:opacity-95 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 transition-all transform active:scale-98 cursor-pointer disabled:opacity-70"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Analisando Link & Gerando Mensagem...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 text-amber-300" />
                <span>Gerar Mensagem com Link Oficial</span>
              </>
            )}
          </button>

          {/* Security Banner */}
          <div className="p-3.5 rounded-xl bg-slate-900 text-white flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Sanitização Anti-SSRF e validação de URLs ativas</span>
            </div>
            {onOpenSecurityShield && (
              <button
                onClick={onOpenSecurityShield}
                className="text-[11px] text-amber-300 hover:underline font-bold cursor-pointer"
              >
                Auditar Shield →
              </button>
            )}
          </div>
        </div>

        {/* WhatsApp Preview Column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-2xl border border-[#ede8e3] p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0ebe4] mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#4a423b] flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#25d366]" />
                Visualização do WhatsApp
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#ee4d2d] bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-lg border border-orange-200 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copiado!' : 'Copiar Texto'}</span>
                </button>

                <button
                  onClick={handleSendWhatsApp}
                  className="flex items-center gap-1.5 text-xs font-bold text-white bg-[#25d366] hover:bg-[#1ebd59] px-3.5 py-1.5 rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar no WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Editable Text Area Styled as WhatsApp Bubble */}
            <div className="whatsapp-bg p-4 rounded-xl border border-gray-200">
              <div className="whatsapp-bubble-in p-3 rounded-xl shadow-sm border border-gray-100">
                {currentProduct && (
                  <div className="mb-2 rounded-lg overflow-hidden h-36 w-full bg-gray-100 relative">
                    <img
                      src={currentProduct.imageUrl}
                      alt={currentProduct.title}
                      className="w-full h-full object-cover"
                    />
                    <div
                      className={`absolute top-2 left-2 text-white text-[10px] font-black px-2 py-0.5 rounded shadow ${
                        currentProduct.marketplace === 'amazon'
                          ? 'bg-[#232f3e]'
                          : currentProduct.marketplace === 'mercadolivre'
                          ? 'bg-[#ffe600] text-black font-extrabold'
                          : 'bg-[#ee4d2d]'
                      }`}
                    >
                      {currentProduct.marketplace?.toUpperCase() || 'OFERTA'}
                    </div>
                    <div className="absolute top-2 right-2 bg-[#ee4d2d] text-white text-[10px] font-black px-2 py-0.5 rounded shadow">
                      {currentProduct.discountPercent}% OFF
                    </div>
                  </div>
                )}

                <textarea
                  value={generatedMessage}
                  onChange={(e) => setGeneratedMessage(e.target.value)}
                  rows={11}
                  className="w-full bg-transparent border-0 focus:ring-0 p-0 text-xs sm:text-[13px] leading-relaxed text-[#111b21] resize-y outline-none font-sans"
                  placeholder="Sua mensagem gerada aparecerá aqui..."
                />

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                  <span className="italic">💡 Edite livremente qualquer linha antes de copiar</span>
                  <span className="text-[#53bdeb] font-semibold">✓✓ Entregue</span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-[#8c827a] text-center italic">
            * For educational purposes only; not a substitute for professional advice. Certifique-se de respeitar os termos de afiliados da Amazon Associates, Mercado Livre e Shopee.
          </p>
        </div>
      </div>
    </div>
  );
};
