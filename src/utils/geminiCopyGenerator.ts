import { AffiliateDeal } from '../types';

export interface CopyGenerationOptions {
  style?: 'urgencia' | 'achadinho' | 'viral' | 'cupom' | 'corujao';
  isNightOwl?: boolean;
}

/**
 * Utilitário que utiliza a API do Gemini via backend para gerar textos de venda persuasivos
 * baseados nas informações reais do produto, formatados para WhatsApp com emojis e gatilhos mentais.
 */
export async function generatePersuasiveCopy(
  product: AffiliateDeal,
  options?: CopyGenerationOptions
): Promise<string> {
  const currentHour = new Date().getHours();
  const isNightTime = options?.isNightOwl ?? (currentHour >= 23 || currentHour < 6);
  const style = options?.style || (isNightTime ? 'corujao' : 'urgencia');

  const marketplaceName =
    product.marketplace === 'amazon'
      ? 'Amazon Brasil 📦'
      : product.marketplace === 'mercadolivre'
      ? 'Mercado Livre Full ⚡'
      : 'Shopee Oficial 🛍️';

  const priceFormatted = product.price.toFixed(2).replace('.', ',');
  const originalPriceFormatted = product.originalPrice.toFixed(2).replace('.', ',');

  try {
    const response = await fetch('/api/generate-copy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: product.title,
        price: priceFormatted,
        originalPrice: originalPriceFormatted,
        discount: `${product.discountPercent}% OFF`,
        coupon: product.coupon || 'Frete Grátis Ativado',
        affiliateLink: product.affiliateUrl,
        rating: `${product.rating} ⭐`,
        salesCount: `+${product.salesCount.toLocaleString()} vendidos`,
        marketplace: product.marketplace,
        style,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.copy && typeof data.copy === 'string' && data.copy.trim().length > 20) {
        return data.copy.trim();
      }
    }
  } catch (err) {
    console.warn('Fallback local para geração de copy:', err);
  }

  // Fallback persuasivo de alta conversão caso offline ou timeout
  if (style === 'corujao') {
    return `🦉 *PLANTÃO CORUJÃO / ACHADINHO DA MADRUGADA!* 🌙\n\n${marketplaceName}\n✨ *${product.title}*\n\n❌ Preço Normal: ~R$ ${originalPriceFormatted}~\n🔥 *Noite com Desconto: R$ ${priceFormatted}* (${product.discountPercent}% OFF!)\n\n🎟️ *Benefício:* ${product.coupon || 'Frete Grátis Ativado'}\n⭐ Avaliação: ${product.rating} ⭐ (+${product.salesCount.toLocaleString()} vendidos)\n\n⚠️ *Aproveite antes do estoque zerar na virada do dia!*\n🛒 *Garanta o seu aqui:* ${product.affiliateUrl}\n\n⚡ _Disparado via PromoRadar Pro_`;
  }

  return `🚨 *ALERTA DE PREÇO BAIXO DETECTADO!* 🚨\n\n${marketplaceName}\n✨ *${product.title}*\n\n❌ De: ~R$ ${originalPriceFormatted}~\n🔥 *Por apenas: R$ ${priceFormatted}* (${product.discountPercent}% OFF!)\n\n🎟️ *Cupom/Benefício:* ${product.coupon || 'Frete Grátis Ativado'}\n⭐ Avaliação: ${product.rating} ⭐ (+${product.salesCount.toLocaleString()} vendidos)\n\n⚠️ *Estoque promocional limitado!*\n👉 *Garanta o seu com desconto:* ${product.affiliateUrl}\n\n⚡ _Disparado via PromoRadar Pro_`;
}
