import React, { useState, useEffect } from 'react';
import {
  INITIAL_PRODUCTS,
  INITIAL_GROUPS,
  INITIAL_TEMPLATES,
  INITIAL_PLANS,
  INITIAL_AUTOMATION_SETTINGS,
  INITIAL_CREDENTIALS,
} from './data/mockData';
import {
  AffiliateDeal,
  WhatsAppGroup,
  MessageTemplate,
  PlanTier,
  AutomationSettings,
  MultiMarketplaceCredentials,
  DispatchLog,
  AffiliateOrder,
} from './types';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { FreeMessageGenerator } from './components/FreeMessageGenerator';
import { DashboardLayout } from './components/DashboardLayout';
import { DashboardOverview } from './components/DashboardOverview';
import { ProductsCatalog } from './components/ProductsCatalog';
import { AutomationsManager } from './components/AutomationsManager';
import { TemplatesManager } from './components/TemplatesManager';
import { WhatsAppConnection } from './components/WhatsAppConnection';
import { CredentialsManager } from './components/CredentialsManager';
import { PlansView } from './components/PlansView';
import { ReferralProgram } from './components/ReferralProgram';
import { SendDealModal } from './components/SendDealModal';
import { TrialModal } from './components/TrialModal';
import { SecurityShieldModal } from './components/SecurityShieldModal';
import { UrlShortenerManager } from './components/UrlShortenerManager';
import { WebhookOrdersManager } from './components/WebhookOrdersManager';
import { SmartScheduleManager } from './components/SmartScheduleManager';
import { generatePersuasiveCopy } from './utils/geminiCopyGenerator';
import { CheckCircle2, Webhook, Bell, X, Sparkles } from 'lucide-react';

export default function App() {
  // Navigation State
  const [isDashboardMode, setIsDashboardMode] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<string>('home');

  // Application Data States
  const [products, setProducts] = useState<AffiliateDeal[]>(INITIAL_PRODUCTS);
  const [groups, setGroups] = useState<WhatsAppGroup[]>(INITIAL_GROUPS);
  const [templates, setTemplates] = useState<MessageTemplate[]>(INITIAL_TEMPLATES);
  const [plans] = useState<PlanTier[]>(INITIAL_PLANS);
  const [automationSettings, setAutomationSettings] = useState<AutomationSettings>(
    INITIAL_AUTOMATION_SETTINGS
  );
  const [credentials, setCredentials] = useState<MultiMarketplaceCredentials>(
    INITIAL_CREDENTIALS
  );

  const [logs, setLogs] = useState<DispatchLog[]>([
    {
      id: 'disp-1',
      timestamp: 'Há 8 min',
      marketplace: 'amazon',
      productTitle: 'Kindle 11ª Geração com Tela 6" antirreflexo 16GB',
      price: 449.1,
      groupName: '🔥 Ofertas Relâmpago Shopee & Amazon VIP [01]',
      status: 'sent',
      link: 'https://www.amazon.com.br/dp/B09SWW583J?tag=promoradar-20',
      commission: 40.41,
      deliveryMethod: 'WhatsApp Web / Direct API',
    },
    {
      id: 'disp-2',
      timestamp: 'Há 22 min',
      marketplace: 'shopee',
      productTitle: 'Mini Selador Térmico Portátil para Embalagens',
      price: 18.9,
      groupName: '🛍️ Achadinhos de Casa & Decoração Shopee [02]',
      status: 'sent',
      link: 'https://shope.ee/achadinho01',
      commission: 2.83,
      deliveryMethod: 'WhatsApp Web / Click-to-Chat',
    },
    {
      id: 'disp-3',
      timestamp: 'Há 39 min',
      marketplace: 'mercadolivre',
      productTitle: 'Fritadeira Sem Óleo Air Fryer Mondial 4L Inox 1500W',
      price: 279.9,
      groupName: '📢 Canal Oficial Multi-Ofertas (Geral)',
      status: 'sent',
      link: 'https://mercadolivre.com/sec/airfryer4l?tracking_id=promoradar',
      commission: 33.58,
      deliveryMethod: 'WhatsApp Web / Direct API',
    },
  ]);

  const [isBotActive, setIsBotActive] = useState<boolean>(true);

  // Modals & Feedback
  const [isTrialModalOpen, setIsTrialModalOpen] = useState<boolean>(false);
  const [isSendDealModalOpen, setIsSendDealModalOpen] = useState<boolean>(false);
  const [isSecurityShieldOpen, setIsSecurityShieldOpen] = useState<boolean>(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState<AffiliateDeal | undefined>(
    undefined
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [liveOrderNotification, setLiveOrderNotification] = useState<AffiliateOrder | null>(null);
  const [, setKnownOrderIds] = useState<Set<string>>(new Set());

  const playOrderChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.12);
      osc.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch {
      // Audio autoplay policy fallback
    }
  };

  useEffect(() => {
    let isSubscribed = true;
    let initialLoad = true;

    const pollIncomingOrders = async () => {
      try {
        const res = await fetch('/api/webhooks/orders');
        if (!res.ok) return;
        const data = await res.json();
        if (data.orders && Array.isArray(data.orders)) {
          if (initialLoad) {
            initialLoad = false;
            const initialIds = new Set<string>(data.orders.map((o: AffiliateOrder) => o.id));
            setKnownOrderIds(initialIds);
            return;
          }

          const newestOrder: AffiliateOrder = data.orders[0];
          if (newestOrder) {
            setKnownOrderIds((prev) => {
              if (!prev.has(newestOrder.id)) {
                // New incoming order detected!
                if (isSubscribed) {
                  setLiveOrderNotification(newestOrder);
                  playOrderChime();
                  setTimeout(() => {
                    if (isSubscribed) setLiveOrderNotification(null);
                  }, 8000);
                }
                const updated = new Set(prev);
                data.orders.forEach((o: AffiliateOrder) => updated.add(o.id));
                return updated;
              }
              return prev;
            });
          }
        }
      } catch {
        // silent catch
      }
    };

    pollIncomingOrders();
    const interval = setInterval(pollIncomingOrders, 6000);
    return () => {
      isSubscribed = false;
      clearInterval(interval);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handler for manual dispatch confirmation
  const handleConfirmDispatch = (
    product: AffiliateDeal,
    targetGroup: WhatsAppGroup,
    _copy: string
  ) => {
    const newLog: DispatchLog = {
      id: 'log-' + Date.now(),
      timestamp: 'Agora mesmo',
      marketplace: product.marketplace,
      productTitle: product.title,
      price: product.price,
      groupName: targetGroup.name,
      status: 'sent',
      link: product.affiliateUrl,
      commission: product.estimatedCommission,
      deliveryMethod: 'WhatsApp Web / Click-to-Chat',
    };

    setLogs((prev) => [newLog, ...prev]);
    showToast(
      `✓ Oferta [${product.marketplace.toUpperCase()}] "${product.title.slice(0, 25)}..." enviada para ${targetGroup.name}!`
    );
  };

  // Handler for quick test dispatch from automations tab
  const handleTestDispatch = () => {
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    const activeGroup = groups.find((g) => g.isActive) || groups[0];

    handleConfirmDispatch(randomProduct, activeGroup, '');
  };

  // Handler for generating and copying AI-powered persuasive copy via Gemini
  const handleCopyProductCopy = async (product: AffiliateDeal) => {
    showToast(`🤖 Gerando copy persuasiva com Gemini AI para [${product.marketplace.toUpperCase()}]...`);
    try {
      const copy = await generatePersuasiveCopy(product);
      await navigator.clipboard.writeText(copy);
      showToast('✓ Copy persuasiva gerada pelo Gemini e copiada com seu link oficial!');
    } catch {
      const marketplaceName =
        product.marketplace === 'amazon'
          ? 'Amazon Brasil 📦'
          : product.marketplace === 'mercadolivre'
          ? 'Mercado Livre Full ⚡'
          : 'Shopee Oficial 🛍️';

      const fallback = `🚨 *ALERTA DE PREÇO BAIXO!* 🚨\n\n${marketplaceName}\n✨ *${product.title}*\n\n❌ De: ~R$ ${product.originalPrice.toFixed(2).replace('.', ',')}~\n🔥 *Por apenas: R$ ${product.price.toFixed(2).replace('.', ',')}* (${product.discountPercent}% OFF!)\n\n🎟️ *Benefício:* ${product.coupon || 'Frete Grátis Ativado'}\n⭐ Avaliação: ${product.rating} ⭐ | 📦 +${product.salesCount.toLocaleString()} vendidos\n\n👉 *Garanta o seu aqui:* ${product.affiliateUrl}\n\n⚡ _Disparado via PromoRadar Pro_`;
      await navigator.clipboard.writeText(fallback);
      showToast('✓ Mensagem copiada com seu link oficial de afiliado!');
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col font-sans">
      {/* Real-Time Affiliate Webhook Order Notification Card */}
      {liveOrderNotification && (
        <div className="fixed top-6 right-6 z-50 max-w-sm sm:max-w-md bg-gradient-to-r from-slate-900 via-slate-950 to-indigo-950 text-white p-4 sm:p-5 rounded-3xl shadow-2xl border-2 border-emerald-500/80 shadow-emerald-500/20 flex items-start gap-3.5 transition-all">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/40 animate-pulse">
            <Bell className="w-5 h-5 fill-emerald-400" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950">
                🎉 NOVA VENDA DE AFILIADO!
              </span>
              <span className="text-[10px] text-slate-400">Agora mesmo</span>
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1">
              {liveOrderNotification.productTitle}
            </h4>
            <div className="flex items-center gap-2 mt-1 text-xs">
              <span className="text-slate-300">
                Venda: R$ {liveOrderNotification.orderAmount.toFixed(2)}
              </span>
              <span className="text-slate-500">•</span>
              <span className="font-extrabold text-emerald-400">
                Sua Comissão: +R$ {liveOrderNotification.commissionAmount.toFixed(2)}
              </span>
            </div>
            <div className="mt-2.5 flex items-center gap-2">
              <button
                onClick={() => {
                  setIsDashboardMode(true);
                  setCurrentTab('webhooks');
                  setLiveOrderNotification(null);
                }}
                className="text-[11px] font-bold px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white transition cursor-pointer flex items-center gap-1"
              >
                <span>Ver no Painel de Webhooks</span>
                <Webhook className="w-3 h-3" />
              </button>
              <button
                onClick={() => setLiveOrderNotification(null)}
                className="text-[11px] text-slate-400 hover:text-white px-2 py-1 cursor-pointer"
              >
                Dispensar
              </button>
            </div>
          </div>
          <button
            onClick={() => setLiveOrderNotification(null)}
            className="text-slate-400 hover:text-white p-1 cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0f172a] text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 text-xs sm:text-sm animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Top Navigation (visible on public site or top) */}
      {!isDashboardMode ? (
        <>
          <Navbar
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            isDashboardMode={isDashboardMode}
            setIsDashboardMode={setIsDashboardMode}
            onOpenTrial={() => setIsTrialModalOpen(true)}
            onOpenSecurityShield={() => setIsSecurityShieldOpen(true)}
          />

          <main className="flex-1">
            {currentTab === 'gerador' ? (
              <FreeMessageGenerator
                products={products}
                onOpenDashboard={() => {
                  setIsDashboardMode(true);
                  setCurrentTab('dashboard');
                }}
                onOpenSecurityShield={() => setIsSecurityShieldOpen(true)}
              />
            ) : (
              <LandingPage
                products={products}
                plans={plans}
                onOpenTrial={() => setIsTrialModalOpen(true)}
                onOpenDashboard={() => {
                  setIsDashboardMode(true);
                  setCurrentTab('dashboard');
                }}
                onOpenGenerator={() => setCurrentTab('gerador')}
                onOpenSecurityShield={() => setIsSecurityShieldOpen(true)}
              />
            )}
          </main>
        </>
      ) : (
        /* Full Dashboard Application */
        <DashboardLayout
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          onExitDashboard={() => {
            setIsDashboardMode(false);
            setCurrentTab('home');
          }}
          onOpenQuickSend={() => {
            setSelectedProductForModal(products[0]);
            setIsSendDealModalOpen(true);
          }}
          onOpenSecurityShield={() => setIsSecurityShieldOpen(true)}
          isBotActive={isBotActive}
          setIsBotActive={setIsBotActive}
        >
          {currentTab === 'dashboard' && (
            <DashboardOverview
              products={products}
              groups={groups}
              logs={logs}
              isBotActive={isBotActive}
              onOpenQuickSend={() => {
                setSelectedProductForModal(products[0]);
                setIsSendDealModalOpen(true);
              }}
              onNavigateTab={(tab) => setCurrentTab(tab)}
              onOpenSecurityShield={() => setIsSecurityShieldOpen(true)}
            />
          )}

          {currentTab === 'products' && (
            <ProductsCatalog
              products={products}
              onSelectProductForDispatch={(product) => {
                setSelectedProductForModal(product);
                setIsSendDealModalOpen(true);
              }}
              onCopyProductCopy={handleCopyProductCopy}
            />
          )}

          {currentTab === 'shortener' && <UrlShortenerManager />}

          {currentTab === 'webhooks' && (
            <WebhookOrdersManager
              onOrderReceived={(newOrder) => {
                setLiveOrderNotification(newOrder);
                playOrderChime();
                showToast(
                  `✓ Pedido recebido! [${newOrder.marketplace.toUpperCase()}] Comissão: +R$ ${newOrder.commissionAmount.toFixed(2)}`
                );
              }}
            />
          )}

          {currentTab === 'automations' && (
            <AutomationsManager
              settings={automationSettings}
              setSettings={setAutomationSettings}
              groups={groups}
              templates={templates}
              onTriggerTestDispatch={handleTestDispatch}
              onOpenSecurityShield={() => setIsSecurityShieldOpen(true)}
              onNavigateTab={(tab) => setCurrentTab(tab)}
            />
          )}

          {currentTab === 'schedule' && (
            <SmartScheduleManager
              onOpenSecurityShield={() => setIsSecurityShieldOpen(true)}
              onNavigateTab={(tab) => setCurrentTab(tab)}
            />
          )}

          {currentTab === 'templates' && (
            <TemplatesManager
              templates={templates}
              setTemplates={setTemplates}
              sampleProducts={products}
            />
          )}

          {currentTab === 'whatsapp' && (
            <WhatsAppConnection groups={groups} setGroups={setGroups} />
          )}

          {currentTab === 'credentials' && (
            <CredentialsManager
              credentials={credentials}
              setCredentials={setCredentials}
            />
          )}

          {currentTab === 'plans' && (
            <PlansView
              plans={plans}
              onOpenTrial={() => setIsTrialModalOpen(true)}
            />
          )}

          {currentTab === 'indique' && <ReferralProgram />}
        </DashboardLayout>
      )}

      {/* Security Shield Audit Modal */}
      <SecurityShieldModal
        isOpen={isSecurityShieldOpen}
        onClose={() => setIsSecurityShieldOpen(false)}
      />

      {/* Trial Activation Modal */}
      <TrialModal
        isOpen={isTrialModalOpen}
        onClose={() => setIsTrialModalOpen(false)}
        plans={plans}
        onActivateTrial={(_planId) => {
          showToast(`✓ Parabéns! Seus 3 dias de teste foram liberados!`);
          setIsDashboardMode(true);
          setCurrentTab('dashboard');
        }}
      />

      {/* Quick Send Deal Modal */}
      <SendDealModal
        isOpen={isSendDealModalOpen}
        onClose={() => setIsSendDealModalOpen(false)}
        products={products}
        groups={groups}
        templates={templates}
        initialProduct={selectedProductForModal}
        onConfirmDispatch={handleConfirmDispatch}
      />
    </div>
  );
}
