import React, { useState, useEffect } from 'react';
import {
  QrCode,
  CheckCircle2,
  RefreshCw,
  Smartphone,
  ShieldCheck,
  Users,
  Plus,
  Trash2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { WhatsAppGroup } from '../types';

interface WhatsAppConnectionProps {
  groups: WhatsAppGroup[];
  setGroups: React.Dispatch<React.SetStateAction<WhatsAppGroup[]>>;
}

export const WhatsAppConnection: React.FC<WhatsAppConnectionProps> = ({
  groups,
  setGroups,
}) => {
  const [isConnected, setIsConnected] = useState(true);
  const [countdown, setCountdown] = useState(45);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    if (!isConnected) {
      const timer = setInterval(() => {
        setCountdown((prev) => (prev > 1 ? prev - 1 : 60));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isConnected]);

  const handleRefreshQr = () => {
    setIsRefreshing(true);
    setCountdown(60);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const handleToggleGroup = (id: string) => {
    setGroups((prev) =>
      prev.map((g) => (g.id === id ? { ...g, isActive: !g.isActive } : g))
    );
  };

  const handleAddGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    const newGroup: WhatsAppGroup = {
      id: 'grp-' + Date.now(),
      name: newGroupName.trim(),
      memberCount: Math.floor(Math.random() * 400) + 120,
      isActive: true,
      lastDispatchedAt: 'Agora mesmo',
      totalSentToday: 0,
      type: 'group',
    };

    setGroups((prev) => [...prev, newGroup]);
    setNewGroupName('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-black text-[#191414] tracking-tight">
          Conexão WhatsApp & Grupos
        </h2>
        <p className="text-xs sm:text-sm text-[#6b635b] mt-1">
          Gerencie a sessão ativa do seu WhatsApp e configure quais grupos recebem as postagens automáticas.
        </p>
      </div>

      {/* Connection Status Card */}
      <div className="bg-white rounded-3xl border border-[#ede8e3] p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#25d366] shrink-0">
              <Smartphone className="w-8 h-8" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-[#191414]">Sessão do WhatsApp</h3>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                    isConnected
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : 'bg-amber-100 text-amber-800 border-amber-300'
                  }`}
                >
                  {isConnected ? '✓ CONECTADO' : 'AGUARDANDO LEITURA QR'}
                </span>
              </div>
              <p className="text-xs text-[#6b635b] mt-1">
                {isConnected ? (
                  <>
                    Linha conectada: <strong>+55 (11) 98452-9103</strong> • Latência: 42ms • Status de envio 100% operacional
                  </>
                ) : (
                  'Abra seu WhatsApp no celular > Aparelhos conectados > Conectar um aparelho'
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isConnected ? (
              <button
                onClick={() => setIsConnected(false)}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 px-4 py-2 rounded-xl border border-rose-200 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                Desconectar WhatsApp
              </button>
            ) : (
              <button
                onClick={() => setIsConnected(true)}
                className="text-xs font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-4 py-2 rounded-xl transition-colors cursor-pointer"
              >
                Simular Leitura do QR Code
              </button>
            )}
          </div>
        </div>

        {/* QR Code view if disconnected */}
        {!isConnected && (
          <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col items-center text-center space-y-4">
            <div className="p-4 bg-white rounded-2xl border-2 border-dashed border-[#ee4d2d] shadow-md inline-block">
              {/* Simulated high-fidelity QR Code pattern */}
              <div className="w-48 h-48 bg-[#111b21] p-3 rounded-lg flex flex-col justify-between">
                <div className="flex justify-between">
                  <div className="w-12 h-12 border-4 border-white bg-black rounded" />
                  <div className="w-12 h-12 border-4 border-white bg-black rounded" />
                </div>
                <div className="text-center font-mono text-[10px] text-white/80">
                  ACHADINHOS-BOT-AUTH
                </div>
                <div className="flex justify-between items-end">
                  <div className="w-12 h-12 border-4 border-white bg-black rounded" />
                  <div className="w-8 h-8 bg-white/20 rounded" />
                </div>
              </div>
            </div>

            <div className="text-xs text-[#6b635b] space-y-1">
              <p className="font-semibold text-[#191414]">
                O código QR expira em: <span className="text-[#ee4d2d] font-bold">{countdown} segundos</span>
              </p>
              <p>Não feche esta página enquanto o WhatsApp sincroniza suas conversas.</p>
            </div>

            <button
              onClick={handleRefreshQr}
              className="flex items-center gap-1.5 text-xs font-bold text-[#ee4d2d] hover:underline cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Atualizar QR Code</span>
            </button>
          </div>
        )}
      </div>

      {/* Anti-Ban Health Card */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 rounded-3xl border border-emerald-200/80 p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-emerald-950">
                Saúde da Linha & Proteção Anti-Ban: 98% (Excelente)
              </h4>
              <p className="text-xs text-emerald-800 mt-1">
                Seu intervalo atual de 25 minutos com variação randômica humanizada garante total segurança contra restrições de spam da Meta.
              </p>
            </div>
          </div>
          <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-600 text-white shadow-sm shrink-0">
            SEGURO
          </span>
        </div>
      </div>

      {/* Connected Groups List */}
      <div className="bg-white rounded-3xl border border-[#ede8e3] p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#f0ebe4]">
          <div>
            <h3 className="text-base font-bold text-[#191414] flex items-center gap-2">
              <Users className="w-5 h-5 text-[#ee4d2d]" />
              Grupos e Canais Vinculados ({groups.length})
            </h3>
            <p className="text-xs text-[#6b635b]">
              Ative ou desative o envio automático para cada grupo individualmente.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 text-xs font-bold text-white bg-[#ee4d2d] hover:bg-[#d73211] px-4 py-2 rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Vincular Novo Grupo</span>
          </button>
        </div>

        <div className="divide-y divide-gray-100">
          {groups.map((group) => (
            <div key={group.id} className="py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-xs font-bold text-[#ee4d2d] shrink-0">
                  {group.type === 'channel' ? '📢' : '🛍️'}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-[#191414] truncate">
                    {group.name}
                  </h4>
                  <p className="text-[11px] text-[#6b635b]">
                    {group.memberCount} membros • {group.totalSentToday} achadinhos hoje • Último envio: {group.lastDispatchedAt || 'Nenhum'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <button
                  onClick={() => handleToggleGroup(group.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    group.isActive
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {group.isActive ? 'Envio Ativo ✓' : 'Pausado'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Group Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-[#191414]">Vincular Novo Grupo de WhatsApp</h3>
            <p className="text-xs text-[#6b635b]">
              Insira o nome do grupo ou canal existente na sua conta para que o bot comece a postar.
            </p>

            <form onSubmit={handleAddGroup} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#4a423b] mb-1">Nome do Grupo:</label>
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="ex: 🛍️ Achadinhos Shopee [Grupo 03]"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2dbd2] text-xs outline-none focus:ring-2 focus:ring-[#ee4d2d]/30"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#6b635b] hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#ee4d2d] hover:bg-[#d73211]"
                >
                  Salvar Grupo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
