import React, { useState } from 'react';
import {
  Zap,
  Clock,
  ShieldCheck,
  RotateCw,
  Users,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
  Send,
  Sparkles,
  Server,
  Layers,
  CalendarClock,
} from 'lucide-react';
import { AutomationSettings, WhatsAppGroup, MessageTemplate, Marketplace } from '../types';

interface AutomationsManagerProps {
  settings: AutomationSettings;
  setSettings: React.Dispatch<React.SetStateAction<AutomationSettings>>;
  groups: WhatsAppGroup[];
  templates: MessageTemplate[];
  onTriggerTestDispatch: () => void;
  onOpenSecurityShield?: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const AutomationsManager: React.FC<AutomationsManagerProps> = ({
  settings,
  setSettings,
  groups,
  templates,
  onTriggerTestDispatch,
  onOpenSecurityShield,
  onNavigateTab,
}) => {
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isTestSending, setIsTestSending] = useState(false);

  const allCategories = [
    'Smart Home & Alexa',
    'Cozinha & Eletroportáteis',
    'Cozinha Prática',
    'Casa & Decoração',
    'Eletrônicos & Tech',
    'Ferramentas & Construção',
    'Áudio & Música',
  ];

  const handleToggleMarketplace = (m: Marketplace) => {
    setSettings((prev) => {
      const exists = prev.selectedMarketplaces.includes(m);
      if (exists && prev.selectedMarketplaces.length === 1) return prev; // keep at least one
      return {
        ...prev,
        selectedMarketplaces: exists
          ? prev.selectedMarketplaces.filter((item) => item !== m)
          : [...prev.selectedMarketplaces, m],
      };
    });
  };

  const handleToggleCategory = (cat: string) => {
    setSettings((prev) => {
      const exists = prev.selectedCategories.includes(cat);
      return {
        ...prev,
        selectedCategories: exists
          ? prev.selectedCategories.filter((c) => c !== cat)
          : [...prev.selectedCategories, cat],
      };
    });
  };

  const handleToggleGroup = (groupId: string) => {
    setSettings((prev) => {
      const exists = prev.targetGroupIds.includes(groupId);
      return {
        ...prev,
        targetGroupIds: exists
          ? prev.targetGroupIds.filter((id) => id !== groupId)
          : [...prev.targetGroupIds, groupId],
      };
    });
  };

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleTestDispatch = () => {
    setIsTestSending(true);
    setTimeout(() => {
      onTriggerTestDispatch();
      setIsTestSending(false);
    }, 700);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#191414] tracking-tight">
            Automações & Regras de Disparo 24h
          </h2>
          <p className="text-xs sm:text-sm text-[#6b635b] mt-1">
            Configure frequência, marketplaces ativos e o firewall anti-bloqueio humanizado para WhatsApp.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleTestDispatch}
            disabled={isTestSending}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-orange-200 bg-orange-50 hover:bg-orange-100 text-[#ee4d2d] font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <Send className={`w-3.5 h-3.5 ${isTestSending ? 'animate-spin' : ''}`} />
            <span>{isTestSending ? 'Disparando...' : 'Testar Disparo Agora'}</span>
          </button>

          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-sm transition-all cursor-pointer"
          >
            {saveSuccess ? 'Salvo com Sucesso! ✓' : 'Salvar Alterações'}
          </button>
        </div>
      </div>

      {/* Smart Schedule Recommendation Banner */}
      {onNavigateTab && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/30 shrink-0">
              <CalendarClock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-white">
                Deseja disparar em horários específicos em vez de minutos corridos?
              </h4>
              <p className="text-[11px] text-slate-300">
                Use a nova aba de <strong>Agendamento & Picos</strong> para bloquear madrugadas (zona morta) e focar nos 5 picos de compra (almoço e horário nobre).
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('schedule')}
            className="text-xs font-black px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white transition cursor-pointer shrink-0 self-start sm:self-auto"
          >
            Abrir Agendamento →
          </button>
        </div>
      )}

      {/* Main Switch Card */}
      <div className="bg-white rounded-3xl border border-[#ede8e3] p-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white ${
              settings.isEnabled ? 'bg-emerald-600' : 'bg-gray-400'
            }`}
          >
            <Zap className="w-6 h-6 fill-white" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#191414]">
              Status Geral da Automação:{' '}
              <span className={settings.isEnabled ? 'text-emerald-700' : 'text-gray-500'}>
                {settings.isEnabled ? 'Ativado (Postando 24h)' : 'Pausado'}
              </span>
            </h3>
            <p className="text-xs text-[#6b635b]">
              Varre periodicamente os melhores achadinhos e posta nos grupos conectados com intervalos anti-ban.
            </p>
          </div>
        </div>

        <button
          onClick={() => setSettings((prev) => ({ ...prev, isEnabled: !prev.isEnabled }))}
          className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
            settings.isEnabled ? 'bg-emerald-500' : 'bg-gray-300'
          }`}
        >
          <div
            className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${
              settings.isEnabled ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Marketplaces Selection Card */}
      <div className="bg-white rounded-3xl border border-[#ede8e3] p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-orange-500" />
            <h3 className="text-sm font-bold text-[#191414] uppercase tracking-wider">
              Marketplaces Autorizados para Automação:
            </h3>
          </div>
          <span className="text-xs font-bold text-slate-700">
            {settings.selectedMarketplaces.length} de 3 ativos
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <label
            onClick={() => handleToggleMarketplace('amazon')}
            className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
              settings.selectedMarketplaces.includes('amazon')
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                : 'bg-[#faf8f5] text-[#6b635b] border-[#ede8e3]'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-xs">
              <span>📦 Amazon Brasil</span>
            </div>
            <input
              type="checkbox"
              checked={settings.selectedMarketplaces.includes('amazon')}
              readOnly
              className="w-4 h-4 accent-amber-400 pointer-events-none"
            />
          </label>

          <label
            onClick={() => handleToggleMarketplace('mercadolivre')}
            className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
              settings.selectedMarketplaces.includes('mercadolivre')
                ? 'bg-[#ffe600] text-black font-extrabold border-amber-400 shadow-sm'
                : 'bg-[#faf8f5] text-[#6b635b] border-[#ede8e3]'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-xs">
              <span>⚡ Mercado Livre</span>
            </div>
            <input
              type="checkbox"
              checked={settings.selectedMarketplaces.includes('mercadolivre')}
              readOnly
              className="w-4 h-4 accent-black pointer-events-none"
            />
          </label>

          <label
            onClick={() => handleToggleMarketplace('shopee')}
            className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
              settings.selectedMarketplaces.includes('shopee')
                ? 'bg-[#ee4d2d] text-white border-[#ee4d2d] shadow-sm'
                : 'bg-[#faf8f5] text-[#6b635b] border-[#ede8e3]'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-xs">
              <span>🛍️ Shopee Brasil</span>
            </div>
            <input
              type="checkbox"
              checked={settings.selectedMarketplaces.includes('shopee')}
              readOnly
              className="w-4 h-4 accent-white pointer-events-none"
            />
          </label>
        </div>
      </div>

      {/* Configuration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Interval and Schedule */}
        <div className="bg-white rounded-3xl border border-[#ede8e3] p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-[#f0ebe4]">
            <Clock className="w-5 h-5 text-[#ee4d2d]" />
            <h3 className="text-sm font-bold text-[#191414] uppercase tracking-wider">
              Intervalo Anti-Ban & Agendamento
            </h3>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-[#4a423b]">Intervalo entre envios:</label>
              <span className="text-xs font-black text-[#ee4d2d] bg-orange-50 px-2.5 py-0.5 rounded border border-orange-200">
                A cada {settings.intervalMinutes} minutos
              </span>
            </div>
            <input
              type="range"
              min={15}
              max={120}
              step={5}
              value={settings.intervalMinutes}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, intervalMinutes: Number(e.target.value) }))
              }
              className="w-full accent-[#ee4d2d] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#8c827a] mt-1 font-medium">
              <span>15 min</span>
              <span>25 min (Recomendado)</span>
              <span>120 min</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#4a423b] mb-1.5">Hora de Início:</label>
              <input
                type="time"
                value={settings.startHour}
                onChange={(e) => setSettings((prev) => ({ ...prev, startHour: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-[#e2dbd2] text-xs font-semibold bg-[#faf8f5]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#4a423b] mb-1.5">Hora de Término:</label>
              <input
                type="time"
                value={settings.endHour}
                onChange={(e) => setSettings((prev) => ({ ...prev, endHour: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-[#e2dbd2] text-xs font-semibold bg-[#faf8f5]"
              />
            </div>
          </div>

          {/* Anti-Ban and Rotation Toggles */}
          <div className="space-y-3 pt-2">
            <label className="flex items-center justify-between p-3 rounded-xl border border-emerald-200 bg-emerald-50/50 cursor-pointer">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <div className="text-xs">
                  <p className="font-bold text-emerald-950">Motor Anti-Bloqueio com Jitter Randômico</p>
                  <p className="text-[11px] text-emerald-800">Adiciona variação de ±180s para simular comportamento humano</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.antiBanHumanDelay}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, antiBanHumanDelay: e.target.checked }))
                }
                className="w-4 h-4 accent-emerald-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-[#ede8e3] bg-[#faf8f5] cursor-pointer">
              <div className="flex items-center gap-2.5">
                <RotateCw className="w-4 h-4 text-purple-600" />
                <div className="text-xs">
                  <p className="font-bold text-[#191414]">Alternar Modelos de Copy</p>
                  <p className="text-[11px] text-[#6b635b]">Evita mensagens consecutivas idênticas</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.rotateTemplates}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, rotateTemplates: e.target.checked }))
                }
                className="w-4 h-4 accent-[#ee4d2d] rounded"
              />
            </label>
          </div>
        </div>

        {/* Target WhatsApp Groups & Webhook Gateway */}
        <div className="bg-white rounded-3xl border border-[#ede8e3] p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#f0ebe4]">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-bold text-[#191414] uppercase tracking-wider">
                Grupos Vinculados
              </h3>
            </div>
            <span className="text-xs font-bold text-slate-800">
              {settings.targetGroupIds.length} selecionados
            </span>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {groups.map((g) => {
              const isSelected = settings.targetGroupIds.includes(g.id);
              return (
                <div
                  key={g.id}
                  onClick={() => handleToggleGroup(g.id)}
                  className={`p-3 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
                    isSelected
                      ? 'border-slate-800 bg-slate-900 text-white font-semibold'
                      : 'border-[#ede8e3] bg-[#faf8f5] text-[#6b635b]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="w-2 h-2 rounded-full bg-[#25d366]" />
                    <span className="truncate">{g.name}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] opacity-80">{g.memberCount} membros</span>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      readOnly
                      className="w-4 h-4 accent-amber-400 rounded pointer-events-none"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Webhook Gateway for Real WhatsApp APIs */}
          <div className="pt-2 border-t border-gray-100">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#4a423b] mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-blue-600" />
                Webhook Gateway de Disparo (Opcional):
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold">API Direta / Evolution / Z-API</span>
            </label>
            <input
              type="url"
              value={settings.webhookUrl || ''}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, webhookUrl: e.target.value }))
              }
              placeholder="https://api.meuservidor.com/webhook/send-message"
              className="w-full px-3 py-2 rounded-xl border border-[#e2dbd2] text-xs font-mono bg-[#faf8f5]"
            />
            <span className="text-[10px] text-gray-500 mt-1 block">
              Se informado, cada oferta é enviada via requisição HTTP POST para o seu gateway de WhatsApp.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
