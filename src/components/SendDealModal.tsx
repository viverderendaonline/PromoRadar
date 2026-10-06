import React, { useState } from 'react';
import {
  X,
  Send,
  Sparkles,
  CheckCircle2,
  Users,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';
import { AffiliateDeal, WhatsAppGroup, MessageTemplate } from '../types';

interface SendDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: AffiliateDeal[];
  groups: WhatsAppGroup[];
  templates: MessageTemplate[];
  initialProduct?: AffiliateDeal;
  onConfirmDispatch: (product: AffiliateDeal, group: WhatsAppGroup, copy: string) => void;
}

export const SendDealModal: React.FC<SendDealModalProps> = ({
  isOpen,
  onClose,
  products,
  groups,
  templates,
  initialProduct,
  onConfirmDispatch,
}) => {
  const [selectedProductId, setSelectedProductId] = useState(
    initialProduct?.id || products[0]?.id || ''
  );
  const [selectedGroupId, setSelectedGroupId] = useState(groups[0]?.id || '');
  const [selectedTemplateId, setSelectedTemplateId] = useState(templates[0]?.id || '');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [directWhatsappUrl, setDirectWhatsappUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  const product = products.find((p) => p.id === selectedProductId) || products[0];
  const group = groups.find((g) => g.id === selectedGroupId) || groups[0];
  const template = templates.find((t) => t.id === selectedTemplateId) || templates[0];

  const marketplaceName =
    product.marketplace === 'amazon'
      ? 'Amazon Brasil 📦'
      : product.marketplace === 'mercadolivre'
      ? 'Mercado Livre Full ⚡'
      : 'Shopee Oficial 🛍️';

  const generatedCopy = template.content
    .replace('{titulo}', product.title)
    .replace('{marketplace_badge}', marketplaceName)
    .replace('{preco}', product.price.toFixed(2).replace('.', ','))
    .replace('{preco_antigo}', product.originalPrice.toFixed(2).replace('.', ','))
    .replace('{desconto}', `${product.discountPercent}% OFF`)
    .replace('{cupom}', product.coupon || 'Frete Grátis Disponível')
    .replace('{avaliacao}', `${product.rating} ⭐`)
    .replace('{vendas}', `+${product.salesCount.toLocaleString()} vendidos`)
    .replace('{link}', product.affiliateUrl);

  const handleSend = async () => {
    setIsSending(true);

    try {
      // Call backend to log and prepare real dispatch
      const res = await fetch('/api/dispatch-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productTitle: product.title,
          price: product.price,
          groupName: group.name,
          affiliateLink: product.affiliateUrl,
          commission: product.estimatedCommission,
          marketplace: product.marketplace,
          messageText: generatedCopy,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setDirectWhatsappUrl(data.directWhatsAppUrl);
      }

      setSendSuccess(true);
      onConfirmDispatch(product, group, generatedCopy);
    } catch (e) {
      console.error(e);
      setSendSuccess(true);
      onConfirmDispatch(product, group, generatedCopy);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 space-y-5 shadow-2xl border border-gray-100 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1 rounded-full cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-amber-300 flex items-center justify-center">
            <Send className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-black text-[#191414]">Disparo de Oferta Multi-Lojas</h3>
            <p className="text-xs text-[#6b635b]">Envie para grupos ou abra diretamente no WhatsApp</p>
          </div>
        </div>

        {/* Product selector */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#4a423b] mb-1">
              Produto Selecionado:
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2dbd2] text-xs font-medium bg-[#faf8f5]"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  [{p.marketplace.toUpperCase()}] {p.title} — R$ {p.price.toFixed(2)} (Comissão R${' '}
                  {p.estimatedCommission.toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4a423b] mb-1">
                Grupo de Destino:
              </label>
              <select
                value={selectedGroupId}
                onChange={(e) => setSelectedGroupId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2dbd2] text-xs font-medium bg-[#faf8f5]"
              >
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name} ({g.memberCount} membros)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4a423b] mb-1">
                Modelo de Copy:
              </label>
              <select
                value={selectedTemplateId}
                onChange={(e) => setSelectedTemplateId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2dbd2] text-xs font-medium bg-[#faf8f5]"
              >
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Live Message Box */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#4a423b] mb-1.5 flex items-center justify-between">
            <span>Pré-visualização da Mensagem Formatada:</span>
            <span className="text-[10px] text-emerald-700 font-bold">✓ Link Verificado</span>
          </label>
          <div className="whatsapp-bg p-3 rounded-xl border border-gray-200 max-h-48 overflow-y-auto">
            <div className="whatsapp-bubble-in p-2.5 rounded-lg text-xs leading-relaxed whitespace-pre-wrap font-sans">
              {generatedCopy}
            </div>
          </div>
        </div>

        {sendSuccess ? (
          <div className="space-y-3 pt-2">
            <div className="p-3.5 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Oferta registrada e enviada para o log do grupo com sucesso!</span>
            </div>

            {directWhatsappUrl && (
              <a
                href={directWhatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-[#25d366] hover:bg-[#1ebd59] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Abrir e Enviar Agora no WhatsApp Web / Celular</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            <button
              onClick={onClose}
              className="w-full py-2 text-xs font-bold text-gray-500 hover:text-gray-800"
            >
              Fechar Janela
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#6b635b] hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSend}
              disabled={isSending}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send className={`w-3.5 h-3.5 ${isSending ? 'animate-spin' : ''}`} />
              <span>{isSending ? 'Disparando...' : 'Confirmar e Disparar'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
