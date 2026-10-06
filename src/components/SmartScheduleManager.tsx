import React, { useState, useEffect } from 'react';
import {
  CalendarClock,
  Clock,
  ShieldCheck,
  Moon,
  Sun,
  Flame,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  Save,
  Zap,
  Coffee,
  ShoppingBag,
  TrendingUp,
  BarChart2,
  Check,
  Info,
} from 'lucide-react';
import {
  SmartScheduleConfig,
  ScheduledTimeSlot,
  EngagementHourInsight,
  NextScheduledDispatch,
  EngagementLevel,
} from '../types';

interface SmartScheduleManagerProps {
  onOpenSecurityShield?: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const SmartScheduleManager: React.FC<SmartScheduleManagerProps> = ({
  onOpenSecurityShield,
  onNavigateTab,
}) => {
  const [config, setConfig] = useState<SmartScheduleConfig>({
    mode: 'slots',
    avoidLowEngagement: true,
    quietHoursStart: '23:00',
    quietHoursEnd: '07:30',
    humanJitterMinutes: 3,
    activeDays: [0, 1, 2, 3, 4, 5, 6],
    timeSlots: [],
    activeStrategy: 'peak_conversion',
    autoSkipIfNoHotDeal: true,
    weekendBehavior: 'shift_later',
  });

  const [heatmap, setHeatmap] = useState<EngagementHourInsight[]>([]);
  const [nextDispatches, setNextDispatches] = useState<NextScheduledDispatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [hoveredHour, setHoveredHour] = useState<EngagementHourInsight | null>(null);

  // New slot form state
  const [newTime, setNewTime] = useState('15:30');
  const [newLabel, setNewLabel] = useState('Pausa da Tarde & Cupons');
  const [newCategory, setNewCategory] = useState('Cozinha & Casa');
  const [isAddingSlot, setIsAddingSlot] = useState(false);
  const [formWarning, setFormWarning] = useState<string | null>(null);

  const fetchScheduleData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/schedule');
      if (res.ok) {
        const data = await res.json();
        if (data.config) setConfig(data.config);
        if (data.heatmap) setHeatmap(data.heatmap);
        if (data.nextDispatches) setNextDispatches(data.nextDispatches);
      }
    } catch (err) {
      console.error('Error fetching schedule data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScheduleData();
  }, []);

  // Check engagement on time input change
  const handleTimeChange = (val: string) => {
    setNewTime(val);
    if (!val || !val.includes(':')) return;
    const hour = parseInt(val.split(':')[0], 10);
    if (hour >= 0 && hour < 7) {
      setFormWarning(
        '⚠️ Atenção: Horário na madrugada (00h-07h). É considerado zona de baixo engajamento e risco de reclamações no grupo.'
      );
    } else if (hour >= 23) {
      setFormWarning(
        '⚠️ Atenção: Horário de final de noite (23h+). Recomendado silenciar para evitar muting.'
      );
    } else {
      setFormWarning(null);
    }
  };

  const handleToggleSlot = async (slotId: string) => {
    try {
      const res = await fetch('/api/schedule/toggle-slot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slotId }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.config) setConfig(data.config);
        if (data.nextDispatches) setNextDispatches(data.nextDispatches);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTime) return;

    try {
      const res = await fetch('/api/schedule/add-slot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          time: newTime,
          label: newLabel,
          categoryPreference: newCategory,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.config) setConfig(data.config);
        if (data.nextDispatches) setNextDispatches(data.nextDispatches);
        setIsAddingSlot(false);
        setNewLabel('Oferta Programada');
        setFormWarning(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteSlot = async (slotId: string) => {
    try {
      const res = await fetch(`/api/schedule/slots/${slotId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        const data = await res.json();
        if (data.config) setConfig(data.config);
        if (data.nextDispatches) setNextDispatches(data.nextDispatches);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleApplyStrategy = async (
    strategy: 'peak_conversion' | 'black_friday' | 'conservative' | 'corujao'
  ) => {
    try {
      const res = await fetch('/api/schedule/apply-strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ strategy }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.config) setConfig(data.config);
        if (data.nextDispatches) setNextDispatches(data.nextDispatches);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveConfig = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.config) setConfig(data.config);
        if (data.nextDispatches) setNextDispatches(data.nextDispatches);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const toggleDay = (dayIndex: number) => {
    const active = config.activeDays.includes(dayIndex);
    const updated = active
      ? config.activeDays.filter((d) => d !== dayIndex)
      : [...config.activeDays, dayIndex];
    setConfig({ ...config, activeDays: updated });
  };

  const DAYS_MAP = [
    { idx: 0, label: 'Dom' },
    { idx: 1, label: 'Seg' },
    { idx: 2, label: 'Ter' },
    { idx: 3, label: 'Qua' },
    { idx: 4, label: 'Qui' },
    { idx: 5, label: 'Sex' },
    { idx: 6, label: 'Sáb' },
  ];

  const getEngagementBadge = (level: EngagementLevel, isDead?: boolean, isCorujao?: boolean) => {
    if (isCorujao) {
      return (
        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 flex items-center gap-1">
          <Moon className="w-3 h-3 text-indigo-300" />
          CORUJÃO (MADRUGADA)
        </span>
      );
    }
    if (isDead) {
      return (
        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-950/40 text-rose-400 border border-rose-800/60 flex items-center gap-1">
          <Moon className="w-3 h-3" />
          ZONA MORTA
        </span>
      );
    }
    switch (level) {
      case 'peak':
        return (
          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
            <Flame className="w-3 h-3 fill-emerald-400" />
            SUPER PICO
          </span>
        );
      case 'high':
        return (
          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/40 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            ALTO ENGAJAMENTO
          </span>
        );
      case 'moderate':
        return (
          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40">
            MODERADO
          </span>
        );
      case 'low':
      default:
        return (
          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
            BAIXO / EVITAR
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-[#6b635b] flex flex-col items-center justify-center gap-3">
        <Clock className="w-8 h-8 animate-spin text-[#ee4d2d]" />
        <span className="text-sm font-semibold">Carregando motor de agendamento inteligente...</span>
      </div>
    );
  }

  const enabledSlotsCount = config.timeSlots.filter((s) => s.isEnabled).length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Banner / Hero */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white p-6 sm:p-8 border border-slate-700/80 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-orange-500/20 shrink-0">
            <CalendarClock className="w-8 h-8 text-slate-950" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Agendamento Inteligente & Picos de Engajamento
              </h2>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ANTI-BAIXO ENGAJAMENTO ATIVO
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Programe ofertas em horários cirúrgicos de alta conversão no WhatsApp (almoço e horário nobre) e bloqueie automaticamente disparos em madrugadas e horários frios.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          {onOpenSecurityShield && (
            <button
              onClick={onOpenSecurityShield}
              className="text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-emerald-400 transition cursor-pointer flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Escudo Defensivo</span>
            </button>
          )}

          <button
            onClick={handleSaveConfig}
            disabled={saving}
            className="flex-1 lg:flex-initial text-xs font-black px-5 py-2.5 rounded-xl bg-[#ee4d2d] hover:bg-[#d73211] text-white shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <Clock className="w-4 h-4 animate-spin" />
            ) : saveSuccess ? (
              <Check className="w-4 h-4 text-white" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saveSuccess ? 'Salvo!' : 'Salvar Grade'}</span>
          </button>
        </div>
      </div>

      {/* STRATEGY PRESET BUTTONS */}
      <div className="bg-white rounded-3xl border border-[#ede8e3] p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#f0ebe4]">
          <div>
            <h3 className="text-base font-bold text-[#191414] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#ee4d2d]" />
              Estratégias de Disparo em 1 Clique
            </h3>
            <p className="text-xs text-[#6b635b]">
              Selecione uma estratégia testada com base nos padrões de consumo do e-commerce brasileiro
            </p>
          </div>
          <span className="text-xs font-extrabold text-[#ee4d2d]">
            {enabledSlotsCount} horários ativos por dia
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Peak Conversion */}
          <div
            onClick={() => handleApplyStrategy('peak_conversion')}
            className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between ${
              config.activeStrategy === 'peak_conversion'
                ? 'border-orange-500 bg-orange-50/40 shadow-sm'
                : 'border-[#ede8e3] hover:border-orange-200 bg-[#faf8f5]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black px-2 py-0.5 rounded-md bg-orange-500 text-white uppercase">
                  Recomendado
                </span>
                <span className="text-xs font-bold text-emerald-700">CTR ~8.5%</span>
              </div>
              <h4 className="text-sm font-extrabold text-[#191414]">Máxima Conversão</h4>
              <p className="text-xs text-[#6b635b] mt-1">
                5 disparos nos maiores picos: café da manhã (08:30), almoço (11:45), volta pra casa (18:15) e horário nobre (20:30 e 21:45).
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-orange-100 flex items-center justify-between text-[11px] font-bold text-[#ee4d2d]">
              <span>5 disparos / dia</span>
              <span>{config.activeStrategy === 'peak_conversion' ? '✓ Ativo' : 'Ativar →'}</span>
            </div>
          </div>

          {/* Conservative / Gourmet */}
          <div
            onClick={() => handleApplyStrategy('conservative')}
            className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between ${
              config.activeStrategy === 'conservative'
                ? 'border-emerald-500 bg-emerald-50/40 shadow-sm'
                : 'border-[#ede8e3] hover:border-emerald-200 bg-[#faf8f5]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black px-2 py-0.5 rounded-md bg-emerald-600 text-white uppercase">
                  Anti-Spam
                </span>
                <span className="text-xs font-bold text-emerald-700">CTR ~9.2%</span>
              </div>
              <h4 className="text-sm font-extrabold text-[#191414]">Gourmet & Conservador</h4>
              <p className="text-xs text-[#6b635b] mt-1">
                Apenas 3 disparos cirúrgicos por dia (11:45, 18:15 e 20:30). Ideal para grupos de alta renda que odeiam excesso de mensagens.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-emerald-100 flex items-center justify-between text-[11px] font-bold text-emerald-700">
              <span>3 disparos / dia</span>
              <span>{config.activeStrategy === 'conservative' ? '✓ Ativo' : 'Ativar →'}</span>
            </div>
          </div>

          {/* Black Friday */}
          <div
            onClick={() => handleApplyStrategy('black_friday')}
            className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between ${
              config.activeStrategy === 'black_friday'
                ? 'border-indigo-500 bg-indigo-50/40 shadow-sm'
                : 'border-[#ede8e3] hover:border-indigo-200 bg-[#faf8f5]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black px-2 py-0.5 rounded-md bg-slate-900 text-amber-300 uppercase">
                  Saldo Total
                </span>
                <span className="text-xs font-bold text-blue-700">Alto Volume</span>
              </div>
              <h4 className="text-sm font-extrabold text-[#191414]">Black Friday</h4>
              <p className="text-xs text-[#6b635b] mt-1">
                Disparos contínuos nas faixas diurnas com espaçamento anti-bloqueio rigoroso.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-indigo-100 flex items-center justify-between text-[11px] font-bold text-indigo-700">
              <span>Diurno Contínuo</span>
              <span>{config.activeStrategy === 'black_friday' ? '✓ Ativo' : 'Ativar →'}</span>
            </div>
          </div>

          {/* Modo Corujao (Madrugada VIP) */}
          <div
            onClick={() => handleApplyStrategy('corujao')}
            className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between ${
              config.activeStrategy === 'corujao'
                ? 'border-purple-500 bg-purple-50/40 shadow-sm'
                : 'border-[#ede8e3] hover:border-purple-200 bg-[#faf8f5]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black px-2 py-0.5 rounded-md bg-purple-600 text-white uppercase flex items-center gap-1">
                  <Moon className="w-3 h-3" />
                  Corujão 24h
                </span>
                <span className="text-xs font-bold text-purple-700">CTR ~7.8%</span>
              </div>
              <h4 className="text-sm font-extrabold text-[#191414]">Modo Corujão / Madrugada</h4>
              <p className="text-xs text-[#6b635b] mt-1">
                Ativa compras de madrugada: virada dos cupons de 00:15 e plantão noturno de 02:30 para quem compra sem concorrência no feed!
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-purple-100 flex items-center justify-between text-[11px] font-bold text-purple-700">
              <span>7 disparos / dia (24h)</span>
              <span>{config.activeStrategy === 'corujao' ? '✓ Ativo' : 'Ativar →'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* DEFENSIVE ANTI-LOW ENGAGEMENT SHIELD */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-lg space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Escudo Anti-Baixo Engajamento & Silêncio Noturno
                </h3>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950">
                  PROTEÇÃO ATIVA
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Bloqueia automaticamente disparos em faixas noturnas frias para evitar saída de membros do WhatsApp
              </p>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={config.avoidLowEngagement}
              onChange={(e) => setConfig({ ...config, avoidLowEngagement: e.target.checked })}
              className="w-5 h-5 text-emerald-500 rounded focus:ring-emerald-400"
            />
            <span className="text-xs font-bold text-slate-200">
              {config.avoidLowEngagement ? 'Filtro Ativado' : 'Desativado (Risco Alto)'}
            </span>
          </label>
        </div>

        {/* Night Owl Insight Callout */}
        <div className="p-3.5 rounded-2xl bg-indigo-950/70 border border-indigo-700/60 flex items-start gap-3 text-xs">
          <Moon className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-extrabold text-indigo-200 block mb-0.5">
              🦉 E sobre a madrugada? Tem gente que compra sim!
            </span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Plataformas como Shopee, Amazon e Mercado Livre renovam seus estoques de cupons diários e ofertas relâmpago pontualmente à <strong>00:00</strong>. Compradores com insônia, plantonistas noturnos e gamers adoram essas ofertas e seu grupo não disputa atenção com nenhum concorrente no feed. Caso seu público compre à noite, selecione a estratégia <strong>Modo Corujão</strong> acima!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/60">
            <span className="font-bold text-slate-300 block mb-1">Horário de Início do Silêncio</span>
            <input
              type="time"
              value={config.quietHoursStart}
              onChange={(e) => setConfig({ ...config, quietHoursStart: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white font-mono text-xs focus:outline-none focus:border-orange-500"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Padrão 23:00 (suspende novos envios)
            </span>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/60">
            <span className="font-bold text-slate-300 block mb-1">Horário de Fim do Silêncio</span>
            <input
              type="time"
              value={config.quietHoursEnd}
              onChange={(e) => setConfig({ ...config, quietHoursEnd: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white font-mono text-xs focus:outline-none focus:border-orange-500"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Padrão 07:30 (recomeça com o café)
            </span>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/60">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-slate-300">Variação Humana (Jitter)</span>
              <span className="font-mono text-emerald-400">±{config.humanJitterMinutes} min</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={config.humanJitterMinutes}
              onChange={(e) =>
                setConfig({ ...config, humanJitterMinutes: parseInt(e.target.value, 10) })
              }
              className="w-full accent-orange-500 cursor-pointer"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Dispara com variação aleatória para não parecer robô
            </span>
          </div>
        </div>
      </div>

      {/* 24-HOUR ENGAGEMENT HEATMAP */}
      <div className="bg-white rounded-3xl border border-[#ede8e3] p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#f0ebe4]">
          <div>
            <h3 className="text-base font-bold text-[#191414] flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-[#ee4d2d]" />
              Curva de Engajamento 24h no WhatsApp & E-commerce
            </h3>
            <p className="text-xs text-[#6b635b]">
              Passe o cursor sobre as barras para ver a taxa estimada de cliques (CTR) e recomendações por faixa horária
            </p>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-bold text-[#6b635b]">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Pico (+8%)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-400" />
              Alto (5-8%)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-300" />
              Moderado (3-5%)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
              Bloquear (&lt;1%)
            </span>
          </div>
        </div>

        {/* Heatmap Bar Graph */}
        <div className="pt-4 pb-2">
          <div className="h-32 flex items-end gap-1.5 sm:gap-2 px-1">
            {heatmap.map((h) => {
              const heightPercent = Math.max(12, (h.averageSalesIndex / 100) * 100);
              const isHovered = hoveredHour?.hour === h.hour;
              const isDead = h.recommendedAction === 'block';

              let barColor = 'bg-slate-300';
              if (h.engagementLevel === 'peak') barColor = 'bg-emerald-500 hover:bg-emerald-400';
              else if (h.engagementLevel === 'high') barColor = 'bg-orange-500 hover:bg-orange-400';
              else if (h.engagementLevel === 'moderate') barColor = 'bg-amber-400 hover:bg-amber-300';
              else if (isDead) barColor = 'bg-rose-400/80 hover:bg-rose-500';

              return (
                <div
                  key={h.hour}
                  onMouseEnter={() => setHoveredHour(h)}
                  className="flex-1 flex flex-col items-center group relative cursor-pointer"
                >
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-lg transition-all duration-200 ${barColor} ${
                      isHovered ? 'ring-2 ring-slate-900 scale-y-105' : ''
                    }`}
                  />
                  <span className="text-[10px] text-[#8c827a] font-mono mt-1 group-hover:font-black group-hover:text-black">
                    {h.hour}h
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tooltip / Diagnosis Box for hovered hour */}
        {hoveredHour ? (
          <div className="p-3.5 rounded-2xl bg-slate-900 text-white border border-slate-700 flex items-center justify-between text-xs animate-fadeIn">
            <div className="flex items-center gap-3">
              <span className="font-mono font-black text-sm text-amber-300 px-2 py-0.5 bg-slate-800 rounded-md">
                {hoveredHour.label}
              </span>
              <div>
                <span className="font-bold text-white block">{hoveredHour.description}</span>
                <span className="text-slate-400 text-[11px]">
                  Recomendação do Robô:{' '}
                  <strong
                    className={
                      hoveredHour.recommendedAction === 'block'
                        ? 'text-rose-400'
                        : hoveredHour.recommendedAction === 'prime'
                        ? 'text-emerald-400'
                        : 'text-amber-300'
                    }
                  >
                    {hoveredHour.recommendedAction === 'block'
                      ? 'BLOQUEAR (Zona Morta / Risco de Mute)'
                      : hoveredHour.recommendedAction === 'prime'
                      ? 'HORÁRIO DE OURO (Máxima Conversão)'
                      : 'ENVIAR COM MODERAÇÃO'}
                  </strong>
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-emerald-400 font-extrabold text-sm block">
                CTR ~{hoveredHour.ctrPercentage}%
              </span>
              <span className="text-[10px] text-slate-400">Índice {hoveredHour.averageSalesIndex}/100</span>
            </div>
          </div>
        ) : (
          <div className="p-2.5 rounded-xl bg-[#faf8f5] border border-dashed border-[#ede8e3] text-center text-xs text-[#8c827a]">
            Passe o mouse sobre as barras acima para ver a análise detalhada de cada horário
          </div>
        )}
      </div>

      {/* ACTIVE DAYS OF THE WEEK SELECTOR */}
      <div className="bg-white rounded-3xl border border-[#ede8e3] p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#f0ebe4]">
          <div>
            <h3 className="text-base font-bold text-[#191414] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#ee4d2d]" />
              Dias Ativos da Semana
            </h3>
            <p className="text-xs text-[#6b635b]">
              Escolha em quais dias o robô deve operar a grade automática de disparos
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700">
            {config.activeDays.length} de 7 dias selecionados
          </span>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {DAYS_MAP.map((day) => {
            const isActive = config.activeDays.includes(day.idx);
            return (
              <button
                key={day.idx}
                type="button"
                onClick={() => toggleDay(day.idx)}
                className={`flex-1 min-w-[70px] py-3 px-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-[#faf8f5] text-[#8c827a] border-[#ede8e3] hover:border-gray-400'
                }`}
              >
                <span>{day.label}</span>
                <span className="block text-[10px] font-normal mt-0.5 opacity-80">
                  {isActive ? 'Ativo' : 'Pausado'}
                </span>
              </button>
            );
          })}
        </div>

        <div className="pt-2 flex items-center justify-between text-xs text-[#6b635b]">
          <span className="font-semibold">Comportamento em Fins de Semana (Sáb/Dom):</span>
          <select
            value={config.weekendBehavior}
            onChange={(e) =>
              setConfig({
                ...config,
                weekendBehavior: e.target.value as any,
              })
            }
            className="p-1.5 rounded-xl border border-[#ede8e3] bg-white text-xs font-semibold focus:outline-none focus:border-orange-500"
          >
            <option value="shift_later">Deslocar 1h mais tarde (Padrão de acordar tarde)</option>
            <option value="high_only">Apenas os 3 maiores picos de engajamento</option>
            <option value="normal">Seguir o mesmo horário de dias úteis</option>
          </select>
        </div>
      </div>

      {/* TIME SLOTS GRID & ADD NEW SLOT */}
      <div className="bg-white rounded-3xl border border-[#ede8e3] p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#f0ebe4]">
          <div>
            <h3 className="text-base font-bold text-[#191414] flex items-center gap-2">
              <CalendarClock className="w-4 h-4 text-[#ee4d2d]" />
              Grade de Horários de Disparo
            </h3>
            <p className="text-xs text-[#6b635b]">
              Ative ou desative horários específicos ou adicione novos horários personalizados
            </p>
          </div>

          <button
            onClick={() => setIsAddingSlot(!isAddingSlot)}
            className="text-xs font-bold px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Adicionar Novo Horário</span>
          </button>
        </div>

        {/* ADD SLOT FORM (DROPDOWN / DRAWER) */}
        {isAddingSlot && (
          <form
            onSubmit={handleAddSlot}
            className="p-4 rounded-2xl bg-orange-50/60 border border-orange-200/80 space-y-4 animate-fadeIn"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-orange-950 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-[#ee4d2d]" />
                Configurar Novo Horário de Disparo
              </span>
              <button
                type="button"
                onClick={() => setIsAddingSlot(false)}
                className="text-xs font-bold text-gray-500 hover:text-black cursor-pointer"
              >
                Cancelar
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="font-bold text-[#191414] block mb-1">Horário (HH:MM)</label>
                <input
                  type="time"
                  required
                  value={newTime}
                  onChange={(e) => handleTimeChange(e.target.value)}
                  className="w-full bg-white border border-orange-200 rounded-xl p-2.5 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="font-bold text-[#191414] block mb-1">Rótulo / Descrição</label>
                <input
                  type="text"
                  required
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="Ex: Oferta Relâmpago Noturna"
                  className="w-full bg-white border border-orange-200 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="font-bold text-[#191414] block mb-1">Categoria Preferencial</label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Ex: Tech, Cozinha, Viral"
                  className="w-full bg-white border border-orange-200 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {formWarning && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{formWarning}</span>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                type="submit"
                className="text-xs font-extrabold px-4 py-2 rounded-xl bg-[#ee4d2d] hover:bg-[#d73211] text-white shadow-sm transition cursor-pointer"
              >
                Confirmar e Adicionar à Grade
              </button>
            </div>
          </form>
        )}

        {/* SLOTS LIST */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {config.timeSlots.map((slot) => {
            const isDead = slot.isDeadZone;
            return (
              <div
                key={slot.id}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                  slot.isEnabled
                    ? 'bg-white border-orange-200 shadow-sm'
                    : isDead
                    ? 'bg-rose-50/20 border-dashed border-rose-200 opacity-60'
                    : 'bg-[#faf8f5] border-[#ede8e3] opacity-75'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center shrink-0 border ${
                      slot.isEnabled
                        ? 'bg-slate-900 text-white border-slate-800'
                        : isDead
                        ? 'bg-rose-100 text-rose-700 border-rose-200'
                        : 'bg-gray-100 text-gray-500 border-gray-200'
                    }`}
                  >
                    <span className="font-mono font-black text-sm leading-none">{slot.time}</span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap mb-1">
                      {getEngagementBadge(slot.engagementLevel, slot.isDeadZone, slot.isCorujao)}
                      <span className="text-[10px] font-bold text-emerald-700">
                        CTR ~{slot.expectedCtr}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-[#191414] truncate">{slot.label}</h4>
                    <p className="text-[11px] text-[#6b635b] truncate">
                      Categoria: {slot.categoryPreference || 'Multi-Marketplace'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pl-3 shrink-0">
                  {/* Delete button if custom */}
                  {slot.id.startsWith('custom-') && (
                    <button
                      onClick={() => handleDeleteSlot(slot.id)}
                      className="p-1.5 text-gray-400 hover:text-rose-600 transition cursor-pointer"
                      title="Excluir este horário"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}

                  {/* Toggle Switch */}
                  <button
                    type="button"
                    onClick={() => handleToggleSlot(slot.id)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      slot.isEnabled ? 'bg-emerald-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        slot.isEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* UPCOMING SCHEDULED DISPATCHES QUEUE */}
      <div className="bg-white rounded-3xl border border-[#ede8e3] p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#f0ebe4]">
          <h3 className="text-base font-bold text-[#191414] flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-600" />
            Fila Dinâmica dos Próximos Disparos Automáticos
          </h3>
          <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Monitorando Janelas
          </span>
        </div>

        {nextDispatches.length === 0 ? (
          <div className="p-6 text-center text-xs text-[#8c827a] border border-dashed border-[#ede8e3] rounded-2xl">
            Nenhum horário ativo na grade. Ative os horários acima para enfileirar as próximas ofertas.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {nextDispatches.map((disp, i) => (
              <div
                key={disp.id}
                className="p-3.5 rounded-2xl bg-[#faf8f5] border border-[#ede8e3] space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-black text-slate-900 px-2 py-0.5 bg-white border border-gray-200 rounded-md">
                      {disp.scheduledTime}
                    </span>
                    <span
                      className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${
                        disp.marketplace === 'amazon'
                          ? 'bg-[#232f3e] text-white'
                          : disp.marketplace === 'mercadolivre'
                          ? 'bg-[#ffe600] text-black font-extrabold'
                          : 'bg-[#ee4d2d] text-white'
                      }`}
                    >
                      {disp.marketplace}
                    </span>
                  </div>

                  <h5 className="text-xs font-bold text-[#191414] line-clamp-1">
                    {disp.suggestedProductTitle}
                  </h5>
                  <p className="text-[11px] text-[#6b635b] truncate">
                    Grupos: {disp.targetGroupNames.join(', ')}
                  </p>
                </div>

                <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between text-[10px]">
                  <span className="font-bold text-emerald-700">✓ Aguardando Janela</span>
                  <span className="text-gray-500 font-medium">Ordem #{i + 1}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
