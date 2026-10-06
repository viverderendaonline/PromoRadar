import React, { useState } from 'react';
import {
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Eye,
  EyeOff,
  RefreshCw,
  Lock,
} from 'lucide-react';
import { MultiMarketplaceCredentials, Marketplace } from '../types';

interface CredentialsManagerProps {
  credentials: MultiMarketplaceCredentials;
  setCredentials: React.Dispatch<React.SetStateAction<MultiMarketplaceCredentials>>;
}

export const CredentialsManager: React.FC<CredentialsManagerProps> = ({
  credentials,
  setCredentials,
}) => {
  const [activeMarketplace, setActiveMarketplace] = useState<Marketplace>('amazon');
  const [showSecret, setShowSecret] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    valid: boolean;
    message: string;
  } | null>(null);

  const handleValidate = async () => {
    setIsValidating(true);
    setValidationResult(null);

    try {
      let payload: any = {};
      if (activeMarketplace === 'amazon') {
        payload = credentials.amazon;
      } else if (activeMarketplace === 'mercadolivre') {
        payload = credentials.mercadolivre;
      } else {
        payload = credentials.shopee;
      }

      const res = await fetch('/api/validate-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          marketplace: activeMarketplace,
          payload,
        }),
      });

      const data = await res.json();
      setValidationResult(data);

      if (data.valid) {
        setCredentials((prev) => ({
          ...prev,
          [activeMarketplace]: {
            ...prev[activeMarketplace],
            isConnected: true,
            lastVerifiedAt: 'Agora mesmo',
          },
        }));
      }
    } catch (e: any) {
      setValidationResult({
        valid: false,
        message: 'Erro ao validar chaves nos servidores: ' + e.message,
      });
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-black text-[#191414] tracking-tight">
          Credenciais Multi-Marketplace Oficiais
        </h2>
        <p className="text-xs sm:text-sm text-[#6b635b] mt-1">
          Configure suas chaves da <strong>Amazon</strong>, <strong>Mercado Livre</strong> e <strong>Shopee</strong> para gerar links de afiliados certificados e rastreáveis.
        </p>
      </div>

      {/* Marketplace Selector Tabs */}
      <div className="flex items-center gap-3 border-b border-[#ede8e3] pb-3">
        <button
          onClick={() => {
            setActiveMarketplace('amazon');
            setValidationResult(null);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeMarketplace === 'amazon'
              ? 'bg-[#232f3e] text-amber-300 shadow-sm'
              : 'bg-white border border-[#ede8e3] text-[#6b635b] hover:bg-gray-50'
          }`}
        >
          <span>📦 Amazon Associados</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
        </button>

        <button
          onClick={() => {
            setActiveMarketplace('mercadolivre');
            setValidationResult(null);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeMarketplace === 'mercadolivre'
              ? 'bg-[#ffe600] text-black font-extrabold shadow-sm'
              : 'bg-white border border-[#ede8e3] text-[#6b635b] hover:bg-gray-50'
          }`}
        >
          <span>⚡ Mercado Livre Afiliados</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
        </button>

        <button
          onClick={() => {
            setActiveMarketplace('shopee');
            setValidationResult(null);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeMarketplace === 'shopee'
              ? 'bg-[#ee4d2d] text-white shadow-sm'
              : 'bg-white border border-[#ede8e3] text-[#6b635b] hover:bg-gray-50'
          }`}
        >
          <span>🛍️ Shopee Open Platform</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
        </button>
      </div>

      {/* Active Form */}
      <div className="bg-white rounded-3xl border border-[#ede8e3] p-6 sm:p-8 shadow-sm space-y-5">
        {activeMarketplace === 'amazon' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-base text-[#191414]">Configuração Amazon Brasil Associados</h3>
              <a
                href="https://associados.amazon.com.br"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-blue-700 font-bold hover:underline flex items-center gap-1"
              >
                <span>Painel de Associados Amazon</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4a423b] mb-1">
                  Tag de Associado Amazon Brasil (Store ID):
                </label>
                <input
                  type="text"
                  value={credentials.amazon.associateTag}
                  onChange={(e) =>
                    setCredentials((prev) => ({
                      ...prev,
                      amazon: { ...prev.amazon, associateTag: e.target.value },
                    }))
                  }
                  placeholder="ex: meunome-20"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2dbd2] font-mono text-xs sm:text-sm bg-[#faf8f5]"
                />
                <span className="text-[10px] text-gray-500 mt-1 block">
                  Tags no Brasil obrigatoriamente terminam em "-20".
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4a423b] mb-1">
                  Região de Atuação:
                </label>
                <input
                  type="text"
                  readOnly
                  value="Amazon Brasil (amazon.com.br)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2dbd2] text-xs sm:text-sm bg-gray-100 text-gray-600 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4a423b] mb-1">
                  PA-API Access Key ID (Opcional):
                </label>
                <input
                  type="text"
                  value={credentials.amazon.accessKeyId}
                  onChange={(e) =>
                    setCredentials((prev) => ({
                      ...prev,
                      amazon: { ...prev.amazon, accessKeyId: e.target.value },
                    }))
                  }
                  placeholder="AKIAIOSFODNN7EXAMPLE"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2dbd2] font-mono text-xs sm:text-sm bg-[#faf8f5]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4a423b] mb-1">
                  PA-API Secret Access Key:
                </label>
                <input
                  type={showSecret ? 'text' : 'password'}
                  value={credentials.amazon.secretAccessKey}
                  onChange={(e) =>
                    setCredentials((prev) => ({
                      ...prev,
                      amazon: { ...prev.amazon, secretAccessKey: e.target.value },
                    }))
                  }
                  placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCY..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2dbd2] font-mono text-xs sm:text-sm bg-[#faf8f5]"
                />
              </div>
            </div>
          </div>
        )}

        {activeMarketplace === 'mercadolivre' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-base text-[#191414]">Configuração Mercado Livre Afiliados</h3>
              <a
                href="https://www.mercadolivre.com.br/afiliados"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-yellow-700 font-bold hover:underline flex items-center gap-1"
              >
                <span>Portal de Afiliados Mercado Livre</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4a423b] mb-1">
                  Tracking Code / Código de Afiliado Meli:
                </label>
                <input
                  type="text"
                  value={credentials.mercadolivre.trackingCode}
                  onChange={(e) =>
                    setCredentials((prev) => ({
                      ...prev,
                      mercadolivre: { ...prev.mercadolivre, trackingCode: e.target.value },
                    }))
                  }
                  placeholder="ex: promoradar_meli"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2dbd2] text-xs sm:text-sm bg-[#faf8f5]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4a423b] mb-1">
                  Meli App ID (API Oficial):
                </label>
                <input
                  type="text"
                  value={credentials.mercadolivre.appId}
                  onChange={(e) =>
                    setCredentials((prev) => ({
                      ...prev,
                      mercadolivre: { ...prev.mercadolivre, appId: e.target.value },
                    }))
                  }
                  placeholder="ex: 84920184029"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2dbd2] font-mono text-xs sm:text-sm bg-[#faf8f5]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4a423b] mb-1">
                  Meli Client Secret Key:
                </label>
                <input
                  type={showSecret ? 'text' : 'password'}
                  value={credentials.mercadolivre.clientSecret}
                  onChange={(e) =>
                    setCredentials((prev) => ({
                      ...prev,
                      mercadolivre: { ...prev.mercadolivre, clientSecret: e.target.value },
                    }))
                  }
                  placeholder="sec_..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2dbd2] font-mono text-xs sm:text-sm bg-[#faf8f5]"
                />
              </div>
            </div>
          </div>
        )}

        {activeMarketplace === 'shopee' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-base text-[#191414]">Configuração Shopee Open Platform</h3>
              <a
                href="https://affiliate.shopee.com.br"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-[#ee4d2d] font-bold hover:underline flex items-center gap-1"
              >
                <span>Shopee Affiliate Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4a423b] mb-1">
                  Shopee Partner App ID:
                </label>
                <input
                  type="text"
                  value={credentials.shopee.appId}
                  onChange={(e) =>
                    setCredentials((prev) => ({
                      ...prev,
                      shopee: { ...prev.shopee, appId: e.target.value },
                    }))
                  }
                  placeholder="ex: 10849201"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2dbd2] font-mono text-xs sm:text-sm bg-[#faf8f5]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4a423b] mb-1">
                  ID Oficial de Afiliado Shopee:
                </label>
                <input
                  type="text"
                  value={credentials.shopee.affiliateId}
                  onChange={(e) =>
                    setCredentials((prev) => ({
                      ...prev,
                      shopee: { ...prev.shopee, affiliateId: e.target.value },
                    }))
                  }
                  placeholder="ex: promoradar_shopee"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2dbd2] text-xs sm:text-sm bg-[#faf8f5]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4a423b] mb-1">
                  SubID Padrão:
                </label>
                <input
                  type="text"
                  value={credentials.shopee.subId}
                  onChange={(e) =>
                    setCredentials((prev) => ({
                      ...prev,
                      shopee: { ...prev.shopee, subId: e.target.value },
                    }))
                  }
                  placeholder="zap_grupo_01"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2dbd2] text-xs sm:text-sm bg-[#faf8f5]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4a423b] mb-1">
                  Shopee Partner Secret:
                </label>
                <input
                  type={showSecret ? 'text' : 'password'}
                  value={credentials.shopee.appSecret}
                  onChange={(e) =>
                    setCredentials((prev) => ({
                      ...prev,
                      shopee: { ...prev.shopee, appSecret: e.target.value },
                    }))
                  }
                  placeholder="9f83ac4e..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2dbd2] font-mono text-xs sm:text-sm bg-[#faf8f5]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Validation Result Box */}
        {validationResult && (
          <div
            className={`p-4 rounded-xl border text-xs flex items-center gap-2 ${
              validationResult.valid
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-amber-50 border-amber-300 text-amber-800'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{validationResult.message}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowSecret(!showSecret)}
            className="text-xs text-[#6b635b] hover:text-[#191414] flex items-center gap-1 font-semibold cursor-pointer"
          >
            {showSecret ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showSecret ? 'Ocultar Chaves Secretas' : 'Mostrar Chaves Secretas'}</span>
          </button>

          <button
            onClick={handleValidate}
            disabled={isValidating}
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isValidating ? 'animate-spin' : ''}`} />
            <span>{isValidating ? 'Validando nos Servidores...' : 'Validar e Salvar Chaves'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
