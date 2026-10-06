import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, Flame, ArrowRight, ShieldCheck } from 'lucide-react';
import { PlanTier } from '../types';

interface TrialModalProps {
  isOpen: boolean;
  onClose: () => void;
  plans: PlanTier[];
  onActivateTrial: (planId: string) => void;
}

export const TrialModal: React.FC<TrialModalProps> = ({
  isOpen,
  onClose,
  plans,
  onActivateTrial,
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState('plan-pro');
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [isActivating, setIsActivating] = useState(false);
  const [activated, setActivated] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsActivating(true);
    setTimeout(() => {
      setIsActivating(false);
      setActivated(true);
      setTimeout(() => {
        onActivateTrial(selectedPlanId);
        onClose();
      }, 1500);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1 rounded-full cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#ee4d2d] flex items-center justify-center mx-auto shadow-sm">
            <Flame className="w-7 h-7 fill-[#ee4d2d]" />
          </div>
          <h3 className="text-2xl font-black text-[#191414]">
            Ativar 3 Dias de Teste Grátis
          </h3>
          <p className="text-xs text-[#6b635b]">
            Sem cartão de crédito necessário. Teste todas as automações e comprove os resultados.
          </p>
        </div>

        {activated ? (
          <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto animate-bounce" />
            <h4 className="text-base font-bold text-emerald-900">Teste Grátis Ativado com Sucesso!</h4>
            <p className="text-xs text-emerald-700">
              Redirecionando você para o painel de automação...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4a423b] mb-1">
                Escolha o Plano para Testar:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {plans.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPlanId(p.id)}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      selectedPlanId === p.id
                        ? 'border-[#ee4d2d] bg-orange-50/70 font-black text-[#ee4d2d] shadow-sm'
                        : 'border-[#ede8e3] bg-[#faf8f5] text-[#6b635b]'
                    }`}
                  >
                    <p className="text-xs font-bold truncate">{p.name.split(' ')[0]}</p>
                    <p className="text-[11px] font-extrabold mt-0.5">R$ {p.price.toFixed(0)}/mês</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4a423b] mb-1">
                Seu Nome Completo:
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ex: Camila Silva"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2dbd2] text-xs outline-none focus:ring-2 focus:ring-[#ee4d2d]/30"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4a423b] mb-1">
                Seu WhatsApp com DDD:
              </label>
              <input
                type="tel"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="ex: (11) 98765-4321"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2dbd2] text-xs outline-none focus:ring-2 focus:ring-[#ee4d2d]/30"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isActivating}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#ee4d2d] to-[#ff5722] hover:from-[#d73211] hover:to-[#ee4d2d] text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition-all cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>{isActivating ? 'Criando sua conta...' : 'Liberar Meu Acesso Grátis'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-[11px] text-[#6b635b] pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Garantia de segurança • Cancele a qualquer momento com 1 clique</span>
            </div>

            <p className="text-[10px] text-[#8c827a] text-center italic">
              * For educational purposes only; not a substitute for professional advice.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
