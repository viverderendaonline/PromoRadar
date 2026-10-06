import React, { useState } from 'react';
import {
  Radar,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  Lock,
  TrendingUp,
  Users,
  Search,
  MessageSquare,
  ChevronDown,
  Star,
  ExternalLink,
  Smartphone,
  DollarSign,
  ShieldAlert,
  Server,
  Layers,
} from 'lucide-react';
import { AffiliateDeal, PlanTier } from '../types';
import { WhatsAppChatSimulation } from './WhatsAppChatSimulation';

interface LandingPageProps {
  products: AffiliateDeal[];
  plans: PlanTier[];
  onOpenTrial: () => void;
  onOpenDashboard: () => void;
  onOpenGenerator: () => void;
  onOpenSecurityShield: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  products,
  plans,
  onOpenTrial,
  onOpenDashboard,
  onOpenGenerator,
  onOpenSecurityShield,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Quais marketplaces são suportados pelo PromoRadar Pro?',
      a: 'O PromoRadar Pro foi construído para operar simultaneamente com a Amazon Brasil (Associate Tag), Mercado Livre Afiliados (Tracking ID / API) e Shopee (API Oficial Open Platform). Você pode disparar ofertas de todas as lojas no mesmo grupo ou separar grupos específicos por loja.',
    },
    {
      q: 'Como funciona a segurança extremamente defensiva (Anti-Ban e Firewall)?',
      a: 'Nossa arquitetura conta com 8 camadas de segurança: motor anti-bloqueio que adiciona jitter pseudo-aleatório aos disparos, firewall anti-SSRF que impede requisições para IPs internos, sanitizador hermético de Prompt Injection em IA, e rate limiting por token bucket. Seus números do WhatsApp e contas de afiliados operam em ambiente blindado.',
    },
    {
      q: 'Os disparos para WhatsApp funcionam de verdade?',
      a: 'Sim! Você pode disparar diretamente via WhatsApp Web / Click-to-Chat com preenchimento instantâneo em 1 clique para celular ou desktop, ou configurar a URL de Webhook para gateways e APIs de WhatsApp (como Evolution API, Baileys, Z-API) para disparo 100% automático em segundo plano.',
    },
    {
      q: 'Preciso deixar meu computador ligado?',
      a: 'Não. O PromoRadar Pro opera na nuvem. Suas rotinas de agendamento, busca de preços e rotação de cópias rodam em servidores dedicados 24 horas por dia.',
    },
    {
      q: 'Para onde vão as comissões das vendas?',
      a: 'Todas as mensagens usam os seus próprios links oficiais de afiliado (Amazon Tag, Shopee SubID e Mercado Livre Tracking Code). As comissões são creditadas diretamente nas suas contas oficiais em cada marketplace.',
    },
  ];

  return (
    <div className="space-y-24 pb-16">
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
        {/* Decorative background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-slate-900/10 via-[#ee4d2d]/10 to-amber-300/10 blur-3xl pointer-events-none rounded-full -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Security & Multi-Store Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 text-white text-xs font-bold shadow-sm border border-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-amber-300">Shopee</span> •{' '}
                <span className="text-blue-300">Amazon</span> •{' '}
                <span className="text-yellow-300">Mercado Livre</span>
                <span className="text-slate-400 font-normal">| Blindagem Defensiva Ativa</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#191414] tracking-tight leading-[1.15]">
                Automatize Ofertas da{' '}
                <span className="text-[#ee4d2d]">Shopee</span>,{' '}
                <span className="text-blue-600">Amazon</span> e{' '}
                <span className="text-amber-500">Mercado Livre</span> no WhatsApp
              </h1>

              {/* Subheadline */}
              <p className="text-lg sm:text-xl text-[#6b635b] font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
                A única plataforma multi-marketplace com motor anti-ban humanizado, rastreio oficial de comissões e firewall de segurança brutal. Conecte seus grupos e fature 24 horas por dia.
              </p>

              {/* Call to Actions */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={onOpenTrial}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#1e293b] via-[#0f172a] to-[#ee4d2d] hover:opacity-95 text-white font-extrabold text-base flex items-center justify-center gap-3 shadow-xl shadow-slate-900/25 transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
                >
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>Testar 3 Dias Grátis Multi-Lojas</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <button
                  onClick={onOpenGenerator}
                  className="w-full sm:w-auto px-6 py-4 rounded-xl bg-white hover:bg-orange-50 text-[#191414] hover:text-[#ee4d2d] font-bold text-base border border-[#e2dbd2] hover:border-orange-300 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-[#ee4d2d]" />
                  <span>Gerador de Mensagens Grátis</span>
                </button>
              </div>

              {/* Badges strip */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs text-[#6b635b]">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="font-bold text-[#191414] ml-1">4.9/5 estrelas</span>
                </div>
                <div className="flex items-center gap-1.5 font-semibold text-emerald-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Proteção Anti-Bloqueio & Anti-SSRF</span>
                </div>
                <button
                  onClick={onOpenSecurityShield}
                  className="text-xs font-bold text-slate-800 hover:text-[#ee4d2d] underline cursor-pointer"
                >
                  Ver Certificação de Segurança →
                </button>
              </div>
            </div>

            {/* Right Hero Column: WhatsApp Phone Simulator */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm sm:max-w-md">
                <WhatsAppChatSimulation products={products} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARKETPLACES STRIP */}
      <section id="marketplaces" className="bg-white border-y border-[#ede8e3] py-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-wider text-center text-[#8c827a] mb-6">
            Integração Nativa com os 3 Maiores Gigantes do E-Commerce
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl border border-orange-200 bg-orange-50/50 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#ee4d2d] text-white flex items-center justify-center font-black text-xl shrink-0">
                S
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#191414]">Shopee Brasil</h4>
                <p className="text-xs text-[#6b635b]">API Oficial Open Platform • Links shope.ee • Até 18% comissão</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-slate-300 bg-slate-50 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#232f3e] text-amber-400 flex items-center justify-center font-black text-xl shrink-0">
                A
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#191414]">Amazon Associados</h4>
                <p className="text-xs text-[#6b635b]">Tag oficial -20 • Produtos Prime • Alexa & Kindle com alta conversão</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-yellow-300 bg-yellow-50/50 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#ffe600] text-blue-900 flex items-center justify-center font-black text-xl shrink-0">
                M
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#191414]">Mercado Livre Afiliados</h4>
                <p className="text-xs text-[#6b635b]">Tracking code Meli • Envio Full no mesmo dia • Eletrônicos & Casa</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DEFENSIVE SECURITY SECTION */}
      <section id="seguranca" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0f172a] text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/50 text-emerald-400 text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>ARQUITETURA DE SEGURANÇA EXTREMAMENTE DEFENSIVA</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Sua conta de WhatsApp e suas credenciais blindadas contra qualquer risco
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Desenvolvemos um conjunto militar de defesas que protege seus grupos e contas contra bloqueios da Meta, vazamento de chaves e ataques de rede.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-slate-800">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Anti-Ban Humanizado</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Intervalos com variação randômica, pausas noturnas e simulação de velocidade de digitação humana para evitar detecção de spam.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-rose-400">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Firewall Anti-SSRF</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Validação estrita de DNS e bloqueio imediato contra requisições a subredes privadas e metadados de nuvem.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-amber-400">
                <Server className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Blindagem Hermética de IA</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Sanitização profunda de entradas antes de consultar modelos de linguagem, impedindo Prompt Injection e vazamento de regras internas.
              </p>
            </div>
          </div>

          <div className="mt-8 text-right">
            <button
              onClick={onOpenSecurityShield}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
            >
              <span>Abrir Painel de Auditoria de Segurança</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="planos" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#ee4d2d] bg-orange-100 px-3 py-1 rounded-full border border-orange-200">
            Planos & Preços
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#191414] mt-3 tracking-tight">
            Escolha seu plano e comece com 3 dias grátis
          </h2>
          <p className="text-base text-[#6b635b] mt-2">
            Multi-marketplace ativado em todos os planos: Shopee, Amazon e Mercado Livre.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((p) => (
            <div
              key={p.id}
              className={`rounded-3xl p-8 flex flex-col justify-between transition-all relative ${
                p.isPopular
                  ? 'bg-white border-2 border-[#ee4d2d] shadow-xl shadow-orange-500/10 md:-translate-y-2'
                  : 'bg-white border border-[#ede8e3] shadow-sm hover:border-orange-200'
              }`}
            >
              {p.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#ee4d2d] to-[#ff5722] text-white text-[11px] font-black tracking-wider uppercase py-1 px-4 rounded-full shadow">
                  {p.badge}
                </div>
              )}

              <div>
                <h4 className="text-xl font-bold text-[#191414]">{p.name}</h4>
                <p className="text-xs text-[#6b635b] mt-1 min-h-[32px]">{p.tagline}</p>

                <div className="my-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-semibold text-[#6b635b]">R$</span>
                    <span className="text-4xl font-black text-[#191414]">
                      {p.price.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-xs font-medium text-[#6b635b]">/{p.period}</span>
                  </div>
                  <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                    ✨ 3 dias de teste grátis inclusos
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-gray-100">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#4a423b]">
                    Recursos incluídos:
                  </div>
                  {p.features.map((f, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-[#4a423b]">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={onOpenTrial}
                  className={`w-full py-3.5 px-4 rounded-xl font-extrabold text-sm transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    p.isPopular
                      ? 'bg-[#ee4d2d] hover:bg-[#d73211] text-white shadow-lg shadow-orange-500/25'
                      : 'bg-orange-50 hover:bg-orange-100 text-[#ee4d2d] border border-orange-200'
                  }`}
                >
                  <span>Ativar Teste de 3 Dias</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#ee4d2d] bg-orange-100 px-3 py-1 rounded-full border border-orange-200">
            Dúvidas Frequentes
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#191414] mt-2">
            Perguntas & Respostas
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-[#ede8e3] overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left p-5 flex items-center justify-between font-bold text-sm sm:text-base text-[#191414] hover:text-[#ee4d2d] transition-colors cursor-pointer"
              >
                <span>{f.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#6b635b] transition-transform ${
                    openFaq === i ? 'rotate-180 text-[#ee4d2d]' : ''
                  }`}
                />
              </button>
              {openFaq === i && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-[#6b635b] leading-relaxed border-t border-gray-50 pt-3">
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 border-t border-[#ede8e3] text-xs text-[#6b635b]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6">
          <div className="flex items-center gap-2">
            <Radar className="w-5 h-5 text-[#ee4d2d]" />
            <span className="font-extrabold text-[#191414]">PromoRadar Pro</span>
            <span>— Automação de Afiliados Multi-Marketplace</span>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={onOpenGenerator} className="hover:text-[#ee4d2d] cursor-pointer">
              Gerador de Mensagens
            </button>
            <a href="#marketplaces" className="hover:text-[#ee4d2d]">
              Marketplaces
            </a>
            <a href="#seguranca" className="hover:text-[#ee4d2d]">
              Segurança
            </a>
            <a href="#planos" className="hover:text-[#ee4d2d]">
              Planos
            </a>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4 text-center text-[11px] text-[#8c827a] space-y-1">
          <p>© {new Date().getFullYear()} PromoRadar Pro. Todos os direitos reservados.</p>
          <p>
            * For educational purposes only; not a substitute for professional advice. Ferramenta de produtividade independente para afiliados de Shopee, Amazon e Mercado Livre.
          </p>
        </div>
      </footer>
    </div>
  );
};
