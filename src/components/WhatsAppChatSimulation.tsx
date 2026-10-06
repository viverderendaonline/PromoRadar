import React, { useState } from 'react';
import { Phone, Video, MoreVertical, CheckCheck, Sparkles, ExternalLink, RefreshCw, ShoppingBag } from 'lucide-react';
import { AffiliateDeal } from '../types';

interface WhatsAppChatSimulationProps {
  products: AffiliateDeal[];
  selectedProduct?: AffiliateDeal;
  customText?: string;
  groupName?: string;
  showCycleControls?: boolean;
}

export const WhatsAppChatSimulation: React.FC<WhatsAppChatSimulationProps> = ({
  products,
  selectedProduct,
  customText,
  groupName = '🔥 Ofertas Relâmpago Shopee & Amazon VIP',
  showCycleControls = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const product = selectedProduct || products[currentIndex] || products[0];

  const handleNext = () => {
    setIsTyping(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
      setIsTyping(false);
    }, 400);
  };

  const marketplaceLabel =
    product.marketplace === 'amazon'
      ? 'Amazon Brasil 📦'
      : product.marketplace === 'mercadolivre'
      ? 'Mercado Livre Full ⚡'
      : 'Shopee Oficial 🛍️';

  const formattedMessage = customText
    ? customText
        .replace('{titulo}', product.title)
        .replace('{marketplace_badge}', marketplaceLabel)
        .replace('{preco}', product.price.toFixed(2).replace('.', ','))
        .replace('{preco_antigo}', product.originalPrice.toFixed(2).replace('.', ','))
        .replace('{desconto}', `${product.discountPercent}% OFF`)
        .replace('{cupom}', product.coupon || 'Frete Grátis Ativado')
        .replace('{avaliacao}', `${product.rating} ⭐`)
        .replace('{vendas}', `+${product.salesCount} vendidos`)
        .replace('{link}', product.affiliateUrl)
    : `🚨 *ALERTA DE PREÇO BAIXO!* 🚨\n\n${marketplaceLabel}\n✨ *${product.title}*\n\n❌ De: ~R$ ${product.originalPrice.toFixed(2).replace('.', ',')}~\n🔥 *Por apenas: R$ ${product.price.toFixed(2).replace('.', ',')}* (${product.discountPercent}% OFF!)\n\n🎟️ *Benefício:* ${product.coupon || 'Frete Grátis'}\n⭐ Avaliação: ${product.rating} ⭐ (Mais de 3.000 avaliações)\n\n⚠️ *Corre que o estoque com desconto acaba rápido!*\n👉 *Garanta o seu aqui:* ${product.affiliateUrl}\n\n⚡ _Disparado via PromoRadar Pro_`;

  return (
    <div className="w-full max-w-sm sm:max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-[#128c7e]/20 bg-white">
      {/* Phone status & WhatsApp Header */}
      <div className="bg-[#075e54] text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 via-orange-500 to-[#ee4d2d] flex items-center justify-center text-white font-bold text-sm shadow">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#25d366] border-2 border-[#075e54]" />
          </div>
          <div>
            <h4 className="text-sm font-bold truncate max-w-[170px] sm:max-w-[210px] leading-tight">
              {groupName}
            </h4>
            <p className="text-[11px] text-emerald-100 flex items-center gap-1">
              {isTyping ? (
                <span className="text-emerald-300 font-semibold animate-pulse">
                  PromoRadar digitando...
                </span>
              ) : (
                <span>1.840 membros • online 24h</span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-emerald-100">
          <Video className="w-4 h-4 opacity-80" />
          <Phone className="w-4 h-4 opacity-80" />
          <MoreVertical className="w-4 h-4 opacity-80" />
        </div>
      </div>

      {/* WhatsApp Body Background */}
      <div className="whatsapp-bg p-3 sm:p-4 min-h-[380px] max-h-[460px] overflow-y-auto flex flex-col justify-end">
        {/* System encryption alert bubble */}
        <div className="mx-auto my-2 bg-[#ffeecd] border border-amber-200/60 text-[#54656f] text-[10px] text-center px-3 py-1 rounded-lg max-w-[260px] shadow-sm">
          🔒 Mensagens protegidas e com links de afiliados verificados.
        </div>

        {/* The Offer Bubble */}
        <div className="whatsapp-bubble-in max-w-[92%] p-2 rounded-xl text-xs space-y-2 relative shadow-sm border border-gray-100 animate-fadeIn">
          {/* Product Image Header with Discount and Marketplace Badge */}
          <div className="relative rounded-lg overflow-hidden h-40 w-full bg-gray-100">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {/* Marketplace pill */}
            <div
              className={`absolute top-2 left-2 text-white text-[10px] font-black px-2 py-0.5 rounded shadow ${
                product.marketplace === 'amazon'
                  ? 'bg-[#232f3e]'
                  : product.marketplace === 'mercadolivre'
                  ? 'bg-[#ffe600] text-black font-extrabold'
                  : 'bg-[#ee4d2d]'
              }`}
            >
              {product.marketplace === 'amazon'
                ? '📦 AMAZON'
                : product.marketplace === 'mercadolivre'
                ? '⚡ MERCADO LIVRE'
                : '🛍️ SHOPEE'}
            </div>

            <div className="absolute top-2 right-2 bg-[#ee4d2d] text-white text-[10px] font-black px-2 py-0.5 rounded shadow">
              🔥 {product.discountPercent}% OFF
            </div>

            <div className="absolute bottom-2 right-2 bg-black/75 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" /> Score: {product.smartScore}/100
            </div>
          </div>

          {/* WhatsApp Text Content formatted */}
          <div className="text-[#111b21] leading-relaxed text-[12px] whitespace-pre-wrap font-sans">
            {formattedMessage}
          </div>

          {/* WhatsApp Interactive Action Button */}
          <div className="pt-1 border-t border-gray-100">
            <a
              href={product.productUrl}
              target="_blank"
              rel="noreferrer"
              className={`w-full py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm ${
                product.marketplace === 'amazon'
                  ? 'bg-[#ff9900] hover:bg-[#e68a00] text-black'
                  : product.marketplace === 'mercadolivre'
                  ? 'bg-[#2d3277] hover:bg-[#1e2255] text-white'
                  : 'bg-[#ee4d2d] hover:bg-[#d73211] text-white'
              }`}
            >
              <span>
                🛒 Ver Oferta na{' '}
                {product.marketplace === 'amazon'
                  ? 'Amazon'
                  : product.marketplace === 'mercadolivre'
                  ? 'Mercado Livre'
                  : 'Shopee'}
              </span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Time & Delivery Checkmarks */}
          <div className="flex items-center justify-end gap-1 text-[10px] text-gray-400 pt-0.5">
            <span>Agora mesmo</span>
            <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
          </div>
        </div>
      </div>

      {/* Cycle Controls for Visitors to Test */}
      {showCycleControls && (
        <div className="bg-[#f0ebe4] p-2.5 px-4 flex items-center justify-between border-t border-[#e2dbd2]">
          <div className="text-[11px] text-[#6b635b] font-medium">
            Testando {product.marketplace.toUpperCase()} • {currentIndex + 1} de {products.length}
          </div>
          <button
            onClick={handleNext}
            disabled={isTyping}
            className="flex items-center gap-1.5 text-xs font-bold text-[#ee4d2d] bg-white hover:bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-200 shadow-sm cursor-pointer transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTyping ? 'animate-spin' : ''}`} />
            <span>Alternar Oferta</span>
          </button>
        </div>
      )}
    </div>
  );
};
