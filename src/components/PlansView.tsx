import React, { useState } from 'react';
import { CreditCard, CheckCircle2, Flame, ArrowRight, ShieldCheck } from 'lucide-react';
import { PlanTier } from '../types';

interface PlansViewProps {
  plans: PlanTier[];
  onOpenTrial: () => void;
}

export const PlansView: React.FC<PlansViewProps> = ({ plans, onOpenTrial }) => {
  const [currentPlanId, setCurrentPlanId] = useState('plan-pro');

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-black text-[#191414] tracking-tight">
          Meu Plano & Assinatura
        </h2>
        <p className="text-xs sm:text-sm text-[#6b635b] mt-1">
          Você está no plano <strong>Profissional (Pro)</strong>. Gerencie sua assinatura ou aumente o limite de grupos.
        </p>
      </div>

      {/* Current Active Plan Card */}
      <div className="bg-white rounded-3xl border-2 border-emerald-500 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              Plano Atual
            </span>
            <span className="text-xs text-[#8c827a] font-medium">Renovação em 27 dias</span>
          </div>
          <h3 className="text-2xl font-black text-[#191414] mt-2">Profissional (Pro) — R$ 99,90/mês</h3>
          <p className="text-xs text-[#6b635b] mt-1">
            Permite até 5 grupos/canais de WhatsApp simultâneos com Score Inteligente e sem marca d’água.
          </p>
        </div>

        <button
          onClick={onOpenTrial}
          className="px-5 py-2.5 rounded-xl bg-[#ee4d2d] hover:bg-[#d73211] text-white text-xs font-bold shadow-sm transition-all cursor-pointer shrink-0"
        >
          Fazer Upgrade para VIP (15 Grupos)
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p) => {
          const isCurrent = p.id === currentPlanId;
          return (
            <div
              key={p.id}
              className={`bg-white rounded-3xl p-6 border flex flex-col justify-between transition-all ${
                isCurrent
                  ? 'border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                  : 'border-[#ede8e3] hover:border-orange-200'
              }`}
            >
              <div>
                <h4 className="text-lg font-bold text-[#191414]">{p.name}</h4>
                <div className="my-4 flex items-baseline gap-1">
                  <span className="text-xs font-semibold text-[#6b635b]">R$</span>
                  <span className="text-3xl font-black text-[#191414]">
                    {p.price.toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-xs font-medium text-[#6b635b]">/{p.period}</span>
                </div>

                <div className="space-y-2.5 pt-3 border-t border-gray-100">
                  {p.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-[#4a423b]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <button
                  disabled={isCurrent}
                  onClick={onOpenTrial}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                      : 'bg-[#ee4d2d] hover:bg-[#d73211] text-white shadow-sm'
                  }`}
                >
                  {isCurrent ? 'Plano Ativo' : 'Mudar para este'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
