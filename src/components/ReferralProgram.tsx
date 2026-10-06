import React, { useState } from 'react';
import { Gift, Copy, Check, Users, DollarSign, Share2, Sparkles } from 'lucide-react';

export const ReferralProgram: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const referralLink = 'https://achadinhosbot.com.br/r/afiliado9821';

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-black text-[#191414] tracking-tight">
          Programa Indique & Ganhe (20% Recorrente)
        </h2>
        <p className="text-xs sm:text-sm text-[#6b635b] mt-1">
          Indique outros donos de grupos e afiliados da Shopee e ganhe 20% de comissão todo mês sobre cada mensalidade paga!
        </p>
      </div>

      {/* Referral Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-orange-500 via-[#ee4d2d] to-[#ff3d00] text-white p-8 shadow-xl shadow-orange-500/20">
        <div className="flex items-center gap-3 mb-2">
          <Gift className="w-6 h-6 text-amber-300" />
          <span className="text-xs font-black uppercase tracking-wider text-amber-200">
            Renda Recorrente Extra
          </span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-black">Ganhe 20% de cada amigo indicado</h3>
        <p className="text-orange-100 text-xs sm:text-sm mt-2 max-w-xl">
          Se você indicar 10 afiliados no Plano Pro, você recebe mais de <strong>R$ 200,00 todos os meses</strong> direto no seu Pix enquanto eles continuarem ativos.
        </p>

        {/* Link Box */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-2 max-w-xl">
          <input
            type="text"
            readOnly
            value={referralLink}
            className="w-full bg-white/20 border border-white/30 text-white font-mono text-xs px-4 py-3 rounded-xl outline-none"
          />
          <button
            onClick={handleCopy}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white text-[#ee4d2d] font-black text-xs shrink-0 flex items-center justify-center gap-1.5 hover:bg-orange-50 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Link Copiado!' : 'Copiar Meu Link'}</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-[#ede8e3] shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8c827a] block mb-1">
            Amigos Cadastrados
          </span>
          <span className="text-2xl font-black text-[#191414]">7 afiliados</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#ede8e3] shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8c827a] block mb-1">
            Assinaturas Ativas
          </span>
          <span className="text-2xl font-black text-emerald-600">4 assinantes</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#ede8e3] shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8c827a] block mb-1">
            Saldo Disponível para Saque
          </span>
          <span className="text-2xl font-black text-[#ee4d2d]">R$ 159,80</span>
        </div>
      </div>
    </div>
  );
};
