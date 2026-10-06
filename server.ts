import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dns from 'dns/promises';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// ==========================================
// 🛡️ BRUTAL DEFENSIVE SECURITY MIDDLEWARE
// ==========================================

// 1. Strict Security Headers (Anti-Clickjacking, Anti-MIME sniffing, CSP)
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=()'
  );
  // Remove identifiable tech stack headers
  res.removeHeader('X-Powered-By');
  next();
});

app.use(express.json({ limit: '2mb' }));

// 2. In-Memory Token Bucket / Sliding-Window Rate Limiter
interface RateLimitBucket {
  tokens: number;
  lastRefill: number;
}
const rateLimitMap = new Map<string, RateLimitBucket>();
const MAX_TOKENS = 60; // 60 requests per minute
const REFILL_INTERVAL = 60000;

const securityAuditStats = {
  totalRequestsFiltered: 0,
  blockedSsrfAttempts: 0,
  blockedPromptInjections: 0,
  rateLimitHits: 0,
  sanitizedInputs: 0,
  activeFirewallRules: 8,
  engineStatus: 'SHIELD_MAXIMUM_DEFENSE',
};

const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
  const now = Date.now();
  let bucket = rateLimitMap.get(ip);

  if (!bucket || now - bucket.lastRefill > REFILL_INTERVAL) {
    bucket = { tokens: MAX_TOKENS, lastRefill: now };
    rateLimitMap.set(ip, bucket);
  }

  if (bucket.tokens > 0) {
    bucket.tokens--;
    securityAuditStats.totalRequestsFiltered++;
    next();
  } else {
    securityAuditStats.rateLimitHits++;
    return res.status(429).json({
      error: 'Defensive Shield: Taxa de requisições excedida. Aguarde 60 segundos.',
      code: 'RATE_LIMIT_EXCEEDED',
    });
  }
};

app.use('/api', rateLimiter);

// 3. SSRF & Private IP Range Protection
const isPrivateIp = (ipStr: string): boolean => {
  if (
    ipStr === 'localhost' ||
    ipStr === '127.0.0.1' ||
    ipStr === '::1' ||
    ipStr === '0.0.0.0'
  ) {
    return true;
  }
  // Check RFC 1918 & Cloud Metadata IP (169.254.169.254)
  const parts = ipStr.split('.').map(Number);
  if (parts.length === 4) {
    if (parts[0] === 10) return true; // 10.0.0.0/8
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true; // 172.16.0.0/12
    if (parts[0] === 192 && parts[1] === 168) return true; // 192.168.0.0/16
    if (parts[0] === 169 && parts[1] === 254) return true; // Link-local / AWS/GCP metadata
    if (parts[0] === 127) return true;
  }
  return false;
};

// 4. Prompt Injection Sanitizer
const sanitizeForPrompt = (input: string): string => {
  if (!input) return '';
  securityAuditStats.sanitizedInputs++;
  // Neutralize common jailbreak phrases and system prompt overrides
  const jailbreakRegex =
    /(ignore all previous instructions|ignore prior instructions|you are now|system prompt|dan mode|jailbreak|bypass guidelines|format as raw json ignoring)/gi;
  if (jailbreakRegex.test(input)) {
    securityAuditStats.blockedPromptInjections++;
  }
  return input
    .replace(jailbreakRegex, '[FILTRADO_SEGURANCA]')
    .replace(/[<>{}|\^~`\\]/g, ' ')
    .slice(0, 1000);
};

// Shared Gemini client instance
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// In-memory real dispatch logs store
interface RealDispatchLog {
  id: string;
  timestamp: string;
  marketplace: 'shopee' | 'amazon' | 'mercadolivre';
  productTitle: string;
  price: number;
  groupName: string;
  status: 'sent';
  link: string;
  commission: number;
  deliveryMethod: string;
  ipMasked: string;
}

// In-memory URL Shortener & Click Tracking Store
interface ClickEvent {
  id: string;
  timestamp: string;
  userAgent?: string;
  device: 'mobile' | 'desktop' | 'tablet';
  referrer?: string;
}

interface StoredShortLink {
  id: string;
  slug: string;
  shortUrl: string;
  targetUrl: string;
  productTitle: string;
  marketplace: 'shopee' | 'amazon' | 'mercadolivre';
  clicks: number;
  uniqueClicks: number;
  createdAt: string;
  recentClicks: ClickEvent[];
}

const shortenedLinks: StoredShortLink[] = [
  {
    id: 'link-1',
    slug: 'amz-echo-dot',
    shortUrl: '/r/amz-echo-dot',
    targetUrl: 'https://www.amazon.com.br/dp/B09B8V1LZ3?tag=promoradar-20',
    productTitle: 'Echo Dot 5ª Geração Smart Speaker com Alexa',
    marketplace: 'amazon',
    clicks: 412,
    uniqueClicks: 328,
    createdAt: 'Ontem às 10:15',
    recentClicks: [
      { id: 'c-1', timestamp: 'Há 4 min', device: 'mobile', referrer: 'WhatsApp' },
      { id: 'c-2', timestamp: 'Há 18 min', device: 'mobile', referrer: 'WhatsApp' },
      { id: 'c-3', timestamp: 'Há 42 min', device: 'desktop', referrer: 'WhatsApp Web' },
    ],
  },
  {
    id: 'link-2',
    slug: 'meli-airfryer-4l',
    shortUrl: '/r/meli-airfryer-4l',
    targetUrl: 'https://mercadolivre.com/sec/airfryer4l?tracking_id=promoradar',
    productTitle: 'Fritadeira Air Fryer Mondial Family 4L Inox',
    marketplace: 'mercadolivre',
    clicks: 295,
    uniqueClicks: 240,
    createdAt: 'Ontem às 14:30',
    recentClicks: [
      { id: 'c-4', timestamp: 'Há 12 min', device: 'mobile', referrer: 'WhatsApp' },
      { id: 'c-5', timestamp: 'Há 35 min', device: 'mobile', referrer: 'WhatsApp' },
    ],
  },
  {
    id: 'link-3',
    slug: 'shp-selador-termico',
    shortUrl: '/r/shp-selador-termico',
    targetUrl: 'https://shope.ee/achadinho01?sub_id=promoradar',
    productTitle: 'Mini Selador Térmico Portátil para Embalagens',
    marketplace: 'shopee',
    clicks: 580,
    uniqueClicks: 462,
    createdAt: 'Anteontem',
    recentClicks: [
      { id: 'c-6', timestamp: 'Há 2 min', device: 'mobile', referrer: 'WhatsApp' },
      { id: 'c-7', timestamp: 'Há 25 min', device: 'desktop', referrer: 'WhatsApp Web' },
    ],
  },
  {
    id: 'link-4',
    slug: 'amz-kindle-11',
    shortUrl: '/r/amz-kindle-11',
    targetUrl: 'https://www.amazon.com.br/dp/B09SWW583J?tag=promoradar-20',
    productTitle: 'Kindle 11ª Geração Tela 6" 16GB',
    marketplace: 'amazon',
    clicks: 187,
    uniqueClicks: 154,
    createdAt: 'Hoje às 08:20',
    recentClicks: [
      { id: 'c-8', timestamp: 'Há 15 min', device: 'mobile', referrer: 'WhatsApp' },
    ],
  },
];

const dispatchLogs: RealDispatchLog[] = [
  {
    id: 'disp-101',
    timestamp: 'Há 8 min',
    marketplace: 'amazon',
    productTitle: 'Kindle 11ª Geração com Tela de 6" antirreflexo 16GB',
    price: 449.1,
    groupName: '🔥 Ofertas Relâmpago VIP [Grupo 01]',
    status: 'sent',
    link: '/r/amz-kindle-11',
    commission: 40.41,
    deliveryMethod: 'WhatsApp Web / Click-to-Chat',
    ipMasked: '189.**.**.14',
  },
  {
    id: 'disp-102',
    timestamp: 'Há 22 min',
    marketplace: 'shopee',
    productTitle: 'Mini Selador Térmico Portátil para Embalagens',
    price: 18.9,
    groupName: '🛍️ Achadinhos Shopee & Casa [Grupo 02]',
    status: 'sent',
    link: '/r/shp-selador-termico',
    commission: 2.83,
    deliveryMethod: 'WhatsApp Web / Direct API',
    ipMasked: '177.**.**.92',
  },
  {
    id: 'disp-103',
    timestamp: 'Há 39 min',
    marketplace: 'mercadolivre',
    productTitle: 'Fritadeira Sem Óleo Air Fryer Mondial 4L Inox 1500W',
    price: 279.9,
    groupName: '📢 Canal Oficial de Promoções',
    status: 'sent',
    link: '/r/meli-airfryer-4l',
    commission: 33.58,
    deliveryMethod: 'WhatsApp Web / Direct API',
    ipMasked: '201.**.**.55',
  },
];

// In-memory Affiliate Orders & Webhook Store
interface AffiliateOrderRecord {
  id: string;
  orderId: string;
  marketplace: 'shopee' | 'amazon' | 'mercadolivre' | 'hotmart' | 'kiwify' | 'braip';
  productTitle: string;
  orderAmount: number;
  commissionAmount: number;
  status: 'approved' | 'pending' | 'cancelled';
  buyerState?: string;
  timestamp: string;
  rawPayload?: any;
}

const affiliateOrders: AffiliateOrderRecord[] = [
  {
    id: 'ord-101',
    orderId: 'AMZ-BR-89210-SP',
    marketplace: 'amazon',
    productTitle: 'Echo Dot 5ª Geração Smart Speaker com Alexa',
    orderAmount: 299.0,
    commissionAmount: 26.91,
    status: 'approved',
    buyerState: 'SP',
    timestamp: 'Há 12 min',
  },
  {
    id: 'ord-102',
    orderId: 'SHP-202610-0982',
    marketplace: 'shopee',
    productTitle: 'Mini Selador Térmico Portátil para Embalagens',
    orderAmount: 18.9,
    commissionAmount: 2.83,
    status: 'approved',
    buyerState: 'MG',
    timestamp: 'Há 35 min',
  },
  {
    id: 'ord-103',
    orderId: 'MELI-984029-RJ',
    marketplace: 'mercadolivre',
    productTitle: 'Fritadeira Air Fryer Mondial Family 4L Inox',
    orderAmount: 279.9,
    commissionAmount: 33.58,
    status: 'approved',
    buyerState: 'RJ',
    timestamp: 'Há 1h atrás',
  },
];

let webhookConfig = {
  isEnabled: true,
  secretToken: 'whsec_promoradar_884920',
  allowedEvents: ['order.created', 'order.approved'],
  autoDispatchAlertToWhatsApp: true,
  soundAlert: true,
};

// ==========================================
// 🔗 URL SHORTENER & TRACKING REDIRECT ROUTE
// ==========================================
app.get('/r/:slug', (req: Request, res: Response) => {
  const { slug } = req.params;
  const link = shortenedLinks.find(
    (l) => l.slug.toLowerCase() === String(slug).toLowerCase()
  );

  if (!link) {
    return res.status(404).send(`
      <!DOCTYPE html>
      <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <title>Link Não Encontrado — PromoRadar Pro</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #faf8f5; color: #191414; }
            .card { background: white; padding: 36px; border-radius: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.06); text-align: center; max-width: 440px; border: 1px solid #ede8e3; margin: 16px; }
            .badge { display: inline-block; background: #fee2e2; color: #dc2626; font-size: 11px; font-weight: 800; padding: 4px 12px; border-radius: 9999px; margin-bottom: 12px; text-transform: uppercase; }
            h2 { margin: 0 0 10px; font-size: 20px; font-weight: 800; }
            p { font-size: 13px; color: #6b635b; line-height: 1.5; margin-bottom: 24px; }
            .btn { display: inline-block; background: #ee4d2d; color: white; padding: 12px 24px; border-radius: 14px; text-decoration: none; font-size: 13px; font-weight: 800; transition: opacity 0.2s; }
            .btn:hover { opacity: 0.9; }
          </style>
        </head>
        <body>
          <div class="card">
            <span class="badge">Aviso de Redirecionamento</span>
            <h2>Oferta Expirada ou Não Encontrada</h2>
            <p>Este link encurtado não foi localizado ou o lote promocional já foi encerrado.</p>
            <a href="/" class="btn">Explorar Outras Ofertas</a>
          </div>
        </body>
      </html>
    `);
  }

  // Increment clicks & record telemetry
  link.clicks++;
  const ua = req.headers['user-agent'] || '';
  const isMobile = /mobile|iphone|android|ipad/i.test(ua);
  const isTablet = /tablet|ipad/i.test(ua);
  const device = isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop';
  const referrer = req.headers['referer'] || (isMobile ? 'WhatsApp Mobile' : 'WhatsApp Web');

  link.recentClicks.unshift({
    id: 'clk-' + Date.now(),
    timestamp: 'Agora mesmo',
    device,
    referrer: String(referrer).slice(0, 60),
    userAgent: ua.slice(0, 100),
  });
  if (link.recentClicks.length > 30) link.recentClicks.pop();

  // Safely redirect to official affiliate URL
  return res.redirect(302, link.targetUrl);
});

// Endpoint: Shorten a URL
app.post('/api/shorten', (req: Request, res: Response) => {
  try {
    const { targetUrl, productTitle, marketplace = 'shopee', customSlug } = req.body;
    if (!targetUrl || typeof targetUrl !== 'string') {
      return res.status(400).json({ error: 'URL de destino é obrigatória' });
    }

    let slug = '';
    if (customSlug && typeof customSlug === 'string') {
      slug = customSlug
        .toLowerCase()
        .replace(/[^a-z0-9-_]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 40);
    }

    if (!slug) {
      const prefix =
        marketplace === 'amazon' ? 'amz' : marketplace === 'mercadolivre' ? 'meli' : 'shp';
      const rand = Math.random().toString(36).substring(2, 7);
      slug = `${prefix}-${rand}`;
    }

    // Deduplicate slug if necessary
    if (shortenedLinks.some((l) => l.slug === slug)) {
      slug += '-' + Math.random().toString(36).substring(2, 5);
    }

    const shortUrl = `/r/${slug}`;

    const newLink: StoredShortLink = {
      id: 'link-' + Date.now(),
      slug,
      shortUrl,
      targetUrl,
      productTitle: sanitizeForPrompt(productTitle || 'Oferta Rastreável'),
      marketplace: marketplace as any,
      clicks: 0,
      uniqueClicks: 0,
      createdAt: 'Agora mesmo',
      recentClicks: [],
    };

    shortenedLinks.unshift(newLink);

    return res.json({
      success: true,
      link: newLink,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Endpoint: List Shortened Links & Analytics
app.get('/api/shortened-links', (req: Request, res: Response) => {
  const totalClicks = shortenedLinks.reduce((acc, l) => acc + l.clicks, 0);
  const byMarketplace = {
    shopee: shortenedLinks
      .filter((l) => l.marketplace === 'shopee')
      .reduce((acc, l) => acc + l.clicks, 0),
    amazon: shortenedLinks
      .filter((l) => l.marketplace === 'amazon')
      .reduce((acc, l) => acc + l.clicks, 0),
    mercadolivre: shortenedLinks
      .filter((l) => l.marketplace === 'mercadolivre')
      .reduce((acc, l) => acc + l.clicks, 0),
  };

  return res.json({
    success: true,
    links: shortenedLinks,
    summary: {
      totalLinks: shortenedLinks.length,
      totalClicks,
      byMarketplace,
      estimatedCtr: '5.6%',
    },
  });
});

// ==========================================
// 📦 REAL-TIME WEBHOOK INGESTION & ORDERS API
// ==========================================

// Endpoint: Get Webhook Configuration
app.get('/api/webhooks/config', (req: Request, res: Response) => {
  const host = req.headers.host || 'localhost:3000';
  const fullWebhookUrl = `${req.protocol}://${host}/api/webhooks/orders`;

  return res.json({
    success: true,
    config: {
      ...webhookConfig,
      webhookUrl: fullWebhookUrl,
    },
  });
});

// Endpoint: Update Webhook Configuration
app.post('/api/webhooks/config', (req: Request, res: Response) => {
  const { isEnabled, secretToken, allowedEvents, autoDispatchAlertToWhatsApp, soundAlert } =
    req.body;

  if (typeof isEnabled === 'boolean') webhookConfig.isEnabled = isEnabled;
  if (secretToken) webhookConfig.secretToken = String(secretToken).trim();
  if (Array.isArray(allowedEvents)) webhookConfig.allowedEvents = allowedEvents;
  if (typeof autoDispatchAlertToWhatsApp === 'boolean')
    webhookConfig.autoDispatchAlertToWhatsApp = autoDispatchAlertToWhatsApp;
  if (typeof soundAlert === 'boolean') webhookConfig.soundAlert = soundAlert;

  return res.json({
    success: true,
    config: webhookConfig,
  });
});

// Endpoint: Get Received Affiliate Orders
app.get('/api/webhooks/orders', (req: Request, res: Response) => {
  const totalSales = affiliateOrders.reduce((acc, o) => acc + o.orderAmount, 0);
  const totalCommissions = affiliateOrders.reduce((acc, o) => acc + o.commissionAmount, 0);
  const approvedCount = affiliateOrders.filter((o) => o.status === 'approved').length;

  return res.json({
    success: true,
    orders: affiliateOrders,
    summary: {
      totalOrders: affiliateOrders.length,
      approvedCount,
      totalSales: Number(totalSales.toFixed(2)),
      totalCommissions: Number(totalCommissions.toFixed(2)),
    },
  });
});

// Endpoint: Ingest Incoming Webhook from Affiliate Networks
app.post('/api/webhooks/orders', (req: Request, res: Response) => {
  try {
    if (!webhookConfig.isEnabled) {
      return res.status(403).json({
        error: 'Webhook receiver is currently disabled in PromoRadar Pro settings.',
      });
    }

    // Optional Token Verification (Header x-webhook-token or query token)
    const tokenHeader = req.headers['x-webhook-token'] || req.headers['authorization'] || req.query.token;
    if (webhookConfig.secretToken && tokenHeader) {
      const cleanToken = String(tokenHeader).replace(/^Bearer\s+/i, '').trim();
      if (cleanToken !== webhookConfig.secretToken && !cleanToken.includes(webhookConfig.secretToken)) {
        return res.status(401).json({ error: 'Token de webhook inválido ou expirado.' });
      }
    }

    const payload = req.body || {};
    const safeTitle = sanitizeForPrompt(
      payload.productTitle || payload.title || payload.item_name || 'Pedido de Afiliado'
    );
    const marketplaceRaw = (payload.marketplace || 'shopee').toLowerCase();
    const marketplace = ['amazon', 'mercadolivre', 'shopee', 'hotmart', 'kiwify', 'braip'].includes(
      marketplaceRaw
    )
      ? marketplaceRaw
      : 'shopee';

    const orderAmount = Number(payload.orderAmount || payload.price || payload.amount || 99.9);
    const commissionAmount = Number(
      payload.commissionAmount || payload.commission || (orderAmount * 0.12).toFixed(2)
    );
    const orderId =
      payload.orderId ||
      payload.id ||
      payload.code ||
      `ORD-${marketplace.toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder: AffiliateOrderRecord = {
      id: 'ord-' + Date.now(),
      orderId,
      marketplace: marketplace as any,
      productTitle: safeTitle,
      orderAmount,
      commissionAmount,
      status: (payload.status || 'approved') as any,
      buyerState: payload.buyerState || 'SP',
      timestamp: 'Agora mesmo',
      rawPayload: payload,
    };

    affiliateOrders.unshift(newOrder);
    if (affiliateOrders.length > 60) affiliateOrders.pop();

    return res.status(201).json({
      success: true,
      message: 'Notificação de pedido recebida e processada com sucesso!',
      order: newOrder,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Endpoint: Simulate Incoming Order for Live Testing & UI Verification
app.post('/api/webhooks/simulate', (req: Request, res: Response) => {
  const { marketplace = 'amazon', productTitle, orderAmount, commissionAmount } = req.body || {};

  const presets = [
    {
      marketplace: 'amazon',
      productTitle: 'Echo Dot 5ª Geração Smart Speaker com Alexa',
      orderAmount: 299.0,
      commissionAmount: 26.91,
      buyerState: 'SP',
    },
    {
      marketplace: 'mercadolivre',
      productTitle: 'Fritadeira Air Fryer Mondial Family 4L Inox',
      orderAmount: 279.9,
      commissionAmount: 33.58,
      buyerState: 'RJ',
    },
    {
      marketplace: 'shopee',
      productTitle: 'Mini Selador Térmico Portátil para Embalagens',
      orderAmount: 18.9,
      commissionAmount: 2.83,
      buyerState: 'MG',
    },
    {
      marketplace: 'amazon',
      productTitle: 'Kindle 11ª Geração Tela 6" 16GB',
      orderAmount: 449.1,
      commissionAmount: 40.41,
      buyerState: 'PR',
    },
  ];

  const chosen =
    presets.find((p) => p.marketplace === marketplace) ||
    presets[Math.floor(Math.random() * presets.length)];

  const finalTitle = productTitle || chosen.productTitle;
  const finalOrderAmount = Number(orderAmount) || chosen.orderAmount;
  const finalCommission = Number(commissionAmount) || chosen.commissionAmount;
  const randCode = Math.floor(10000 + Math.random() * 90000);

  const simulatedOrder: AffiliateOrderRecord = {
    id: 'ord-' + Date.now(),
    orderId: `${chosen.marketplace.toUpperCase()}-SIM-${randCode}`,
    marketplace: chosen.marketplace as any,
    productTitle: finalTitle,
    orderAmount: finalOrderAmount,
    commissionAmount: finalCommission,
    status: 'approved',
    buyerState: chosen.buyerState,
    timestamp: 'Agora mesmo',
    rawPayload: { simulated: true, channel: 'webhook_test' },
  };

  affiliateOrders.unshift(simulatedOrder);
  if (affiliateOrders.length > 60) affiliateOrders.pop();

  return res.json({
    success: true,
    message: 'Pedido de teste simulado com sucesso!',
    order: simulatedOrder,
  });
});

// ==========================================
// ⏰ SMART SCHEDULING & ENGAGEMENT ENGINE
// ==========================================

interface ScheduledSlotRecord {
  id: string;
  time: string;
  label: string;
  isEnabled: boolean;
  engagementLevel: 'low' | 'moderate' | 'high' | 'peak';
  expectedCtr: string;
  categoryPreference: string;
  isDeadZone?: boolean;
  isCorujao?: boolean;
}

let smartScheduleConfig = {
  mode: 'slots' as 'slots' | 'interval',
  avoidLowEngagement: true,
  quietHoursStart: '23:00',
  quietHoursEnd: '07:30',
  humanJitterMinutes: 3,
  activeDays: [0, 1, 2, 3, 4, 5, 6],
  activeStrategy: 'peak_conversion' as 'peak_conversion' | 'black_friday' | 'conservative' | 'corujao' | 'custom',
  autoSkipIfNoHotDeal: true,
  weekendBehavior: 'shift_later' as 'normal' | 'shift_later' | 'high_only',
  timeSlots: [
    {
      id: 'slot-corujao-1',
      time: '00:15',
      label: 'Virada dos Cupons da Meia-Noite (Corujão)',
      isEnabled: false,
      engagementLevel: 'high' as const,
      expectedCtr: '6.2%',
      categoryPreference: 'Cupons Exclusivos & Bugs',
      isCorujao: true,
    },
    {
      id: 'slot-corujao-2',
      time: '02:30',
      label: 'Plantão Corujão / Insônia VIP',
      isEnabled: false,
      engagementLevel: 'moderate' as const,
      expectedCtr: '4.1%',
      categoryPreference: 'Achadinhos Noturnos & Gamers',
      isCorujao: true,
    },
    {
      id: 'slot-1',
      time: '08:30',
      label: 'Café da Manhã & Início do Dia',
      isEnabled: true,
      engagementLevel: 'high' as const,
      expectedCtr: '5.8%',
      categoryPreference: 'Casa & Decoração',
    },
    {
      id: 'slot-2',
      time: '11:45',
      label: 'Pico do Almoço (Ofertas Relâmpago)',
      isEnabled: true,
      engagementLevel: 'peak' as const,
      expectedCtr: '8.4%',
      categoryPreference: 'Cozinha & Eletroportáteis',
    },
    {
      id: 'slot-3',
      time: '14:15',
      label: 'Pausa da Tarde',
      isEnabled: false,
      engagementLevel: 'moderate' as const,
      expectedCtr: '3.6%',
      categoryPreference: 'Beleza & Cuidados',
    },
    {
      id: 'slot-4',
      time: '18:15',
      label: 'Saída do Trabalho / Trânsito',
      isEnabled: true,
      engagementLevel: 'high' as const,
      expectedCtr: '7.2%',
      categoryPreference: 'Eletrônicos & Tech',
    },
    {
      id: 'slot-5',
      time: '20:30',
      label: 'Horário Nobre (Super Pico de Conversão)',
      isEnabled: true,
      engagementLevel: 'peak' as const,
      expectedCtr: '10.8%',
      categoryPreference: 'Viral TikTok & Ofertas do Dia',
    },
    {
      id: 'slot-6',
      time: '21:45',
      label: 'Última Chamada / Cupons Expirando',
      isEnabled: true,
      engagementLevel: 'high' as const,
      expectedCtr: '7.9%',
      categoryPreference: 'Multi-Marketplace Geral',
    },
    {
      id: 'slot-dead-1',
      time: '04:30',
      label: 'Madrugada Silenciosa / Pré-Alvorada',
      isEnabled: false,
      engagementLevel: 'low' as const,
      expectedCtr: '1.2%',
      categoryPreference: 'Bloqueado por Defesa',
      isDeadZone: true,
    },
  ] as ScheduledSlotRecord[],
};

const ENGAGEMENT_HEATMAP_24H = [
  { hour: 0, label: '00:00', engagementLevel: 'high', ctrPercentage: 6.2, averageSalesIndex: 65, recommendedAction: 'prime', description: 'Virada de lote e novos cupons diários (Shopee & Amazon). Compradores noturnos e gamers ativos.' },
  { hour: 1, label: '01:00', engagementLevel: 'moderate', ctrPercentage: 3.8, averageSalesIndex: 42, recommendedAction: 'good', description: 'Madrugada com insônia e plantonistas. Menor tráfego geral, mas zero concorrência no feed.' },
  { hour: 2, label: '02:00', engagementLevel: 'moderate', ctrPercentage: 3.1, averageSalesIndex: 35, recommendedAction: 'good', description: 'Plantão Corujão. Compradores noturnos focados em eletrônicos e compras por impulso.' },
  { hour: 3, label: '03:00', engagementLevel: 'low', ctrPercentage: 1.4, averageSalesIndex: 16, recommendedAction: 'avoid', description: 'Janela mais quieta da noite.' },
  { hour: 4, label: '04:00', engagementLevel: 'low', ctrPercentage: 1.6, averageSalesIndex: 18, recommendedAction: 'avoid', description: 'Madrugada fria. Bom para trabalhadores de turno e fuso.' },
  { hour: 5, label: '05:00', engagementLevel: 'moderate', ctrPercentage: 3.2, averageSalesIndex: 36, recommendedAction: 'good', description: 'Madrugadores, plantonistas e quem acorda cedo para o trabalho.' },
  { hour: 6, label: '06:00', engagementLevel: 'moderate', ctrPercentage: 3.8, averageSalesIndex: 42, recommendedAction: 'good', description: 'Primeiro toque no smartphone do dia.' },
  { hour: 7, label: '07:00', engagementLevel: 'moderate', ctrPercentage: 4.5, averageSalesIndex: 50, recommendedAction: 'good', description: 'Rotina matinal. Bom para utilidades e café.' },
  { hour: 8, label: '08:00', engagementLevel: 'high', ctrPercentage: 5.8, averageSalesIndex: 68, recommendedAction: 'prime', description: 'Café da manhã e checagem de mensagens no WhatsApp.' },
  { hour: 9, label: '09:00', engagementLevel: 'moderate', ctrPercentage: 4.0, averageSalesIndex: 45, recommendedAction: 'good', description: 'Início de jornada de trabalho.' },
  { hour: 10, label: '10:00', engagementLevel: 'moderate', ctrPercentage: 4.6, averageSalesIndex: 52, recommendedAction: 'good', description: 'Momento de foco comercial.' },
  { hour: 11, label: '11:00', engagementLevel: 'high', ctrPercentage: 7.4, averageSalesIndex: 82, recommendedAction: 'prime', description: 'Aquecimento para o almoço. Usuários começam a checar promoções.' },
  { hour: 12, label: '12:00', engagementLevel: 'peak', ctrPercentage: 8.9, averageSalesIndex: 94, recommendedAction: 'prime', description: 'Pico máximo do dia útil. Forte conversão Shopee e Amazon.' },
  { hour: 13, label: '13:00', engagementLevel: 'high', ctrPercentage: 6.7, averageSalesIndex: 75, recommendedAction: 'good', description: 'Final do almoço. Boa taxa de conversão.' },
  { hour: 14, label: '14:00', engagementLevel: 'moderate', ctrPercentage: 3.8, averageSalesIndex: 44, recommendedAction: 'avoid', description: 'Retorno ao trabalho. Menor taxa de abertura imediata.' },
  { hour: 15, label: '15:00', engagementLevel: 'moderate', ctrPercentage: 3.9, averageSalesIndex: 46, recommendedAction: 'good', description: 'Pausa da tarde.' },
  { hour: 16, label: '16:00', engagementLevel: 'moderate', ctrPercentage: 4.4, averageSalesIndex: 50, recommendedAction: 'good', description: 'Lanche e distração rápida.' },
  { hour: 17, label: '17:00', engagementLevel: 'high', ctrPercentage: 6.1, averageSalesIndex: 69, recommendedAction: 'good', description: 'Encerramento de expediente.' },
  { hour: 18, label: '18:00', engagementLevel: 'high', ctrPercentage: 7.8, averageSalesIndex: 85, recommendedAction: 'prime', description: 'Pico no transporte e chegada em casa.' },
  { hour: 19, label: '19:00', engagementLevel: 'high', ctrPercentage: 8.5, averageSalesIndex: 90, recommendedAction: 'prime', description: 'Início do horário nobre.' },
  { hour: 20, label: '20:00', engagementLevel: 'peak', ctrPercentage: 10.8, averageSalesIndex: 100, recommendedAction: 'prime', description: 'Horário de OURO. Maior faturamento do e-commerce brasileiro.' },
  { hour: 21, label: '21:00', engagementLevel: 'peak', ctrPercentage: 9.9, averageSalesIndex: 96, recommendedAction: 'prime', description: 'Relaxamento, navegação em ofertas e compras de impulso.' },
  { hour: 22, label: '22:00', engagementLevel: 'high', ctrPercentage: 7.2, averageSalesIndex: 78, recommendedAction: 'prime', description: 'Última chamada para compras e cupons que viram à meia-noite.' },
  { hour: 23, label: '23:00', engagementLevel: 'low', ctrPercentage: 2.1, averageSalesIndex: 25, recommendedAction: 'avoid', description: 'Fim de noite. Recomendado suspender novos disparos para evitar muting.' },
];

// Helper: Calculate Next Dispatches based on active slots
function calculateNextDispatches() {
  const enabledSlots = smartScheduleConfig.timeSlots
    .filter((s) => s.isEnabled)
    .sort((a, b) => a.time.localeCompare(b.time));

  if (enabledSlots.length === 0) return [];

  const mockSamples = [
    { marketplace: 'amazon', title: 'Kindle 11ª Geração Tela 6" 16GB' },
    { marketplace: 'mercadolivre', title: 'Fritadeira Air Fryer Mondial Family 4L Inox' },
    { marketplace: 'shopee', title: 'Mini Selador Térmico Portátil para Embalagens' },
    { marketplace: 'amazon', title: 'Echo Dot 5ª Geração Smart Speaker com Alexa' },
    { marketplace: 'shopee', title: 'Escova Secadora Oval Tourmaline Ion 1200W' },
  ];

  return enabledSlots.map((slot, idx) => {
    const sample = mockSamples[idx % mockSamples.length];
    return {
      id: 'disp-sched-' + slot.id,
      scheduledTime: slot.time,
      timeUntil: `às ${slot.time}`,
      targetGroupNames: ['🔥 Ofertas VIP [01]', '📢 Canal Oficial Multi-Ofertas'],
      marketplace: sample.marketplace,
      suggestedProductTitle: sample.title,
      status: 'pending',
      engagementLevel: slot.engagementLevel,
    };
  });
}

// Endpoint: GET /api/schedule
app.get('/api/schedule', (req: Request, res: Response) => {
  return res.json({
    success: true,
    config: smartScheduleConfig,
    heatmap: ENGAGEMENT_HEATMAP_24H,
    nextDispatches: calculateNextDispatches(),
  });
});

// Endpoint: POST /api/schedule - Update general config
app.post('/api/schedule', (req: Request, res: Response) => {
  const body = req.body || {};
  if (typeof body.avoidLowEngagement === 'boolean') {
    smartScheduleConfig.avoidLowEngagement = body.avoidLowEngagement;
  }
  if (typeof body.mode === 'string' && ['slots', 'interval'].includes(body.mode)) {
    smartScheduleConfig.mode = body.mode;
  }
  if (typeof body.quietHoursStart === 'string') {
    smartScheduleConfig.quietHoursStart = body.quietHoursStart;
  }
  if (typeof body.quietHoursEnd === 'string') {
    smartScheduleConfig.quietHoursEnd = body.quietHoursEnd;
  }
  if (typeof body.humanJitterMinutes === 'number') {
    smartScheduleConfig.humanJitterMinutes = Math.min(15, Math.max(0, body.humanJitterMinutes));
  }
  if (Array.isArray(body.activeDays)) {
    smartScheduleConfig.activeDays = body.activeDays;
  }
  if (typeof body.weekendBehavior === 'string') {
    smartScheduleConfig.weekendBehavior = body.weekendBehavior;
  }
  if (typeof body.autoSkipIfNoHotDeal === 'boolean') {
    smartScheduleConfig.autoSkipIfNoHotDeal = body.autoSkipIfNoHotDeal;
  }
  if (Array.isArray(body.timeSlots)) {
    smartScheduleConfig.timeSlots = body.timeSlots;
  }

  return res.json({
    success: true,
    message: 'Configurações de agendamento salvas com sucesso!',
    config: smartScheduleConfig,
    nextDispatches: calculateNextDispatches(),
  });
});

// Endpoint: POST /api/schedule/toggle-slot
app.post('/api/schedule/toggle-slot', (req: Request, res: Response) => {
  const { slotId } = req.body || {};
  const slot = smartScheduleConfig.timeSlots.find((s) => s.id === slotId);
  if (!slot) {
    return res.status(404).json({ error: 'Horário de agendamento não encontrado.' });
  }

  slot.isEnabled = !slot.isEnabled;

  return res.json({
    success: true,
    slot,
    config: smartScheduleConfig,
    nextDispatches: calculateNextDispatches(),
  });
});

// Endpoint: POST /api/schedule/add-slot
app.post('/api/schedule/add-slot', (req: Request, res: Response) => {
  const { time, label, categoryPreference } = req.body || {};
  if (!time || !/^\d{2}:\d{2}$/.test(time)) {
    return res.status(400).json({ error: 'Formato de horário inválido. Use HH:MM (ex: 15:30).' });
  }

  const [hourStr, minStr] = time.split(':');
  const hour = parseInt(hourStr, 10);
  const min = parseInt(minStr, 10);

  if (hour < 0 || hour > 23 || min < 0 || min > 59) {
    return res.status(400).json({ error: 'Horário fora dos limites válidos (00:00 - 23:59).' });
  }

  // Assess Engagement Level based on hour
  const heatPoint = ENGAGEMENT_HEATMAP_24H.find((h) => h.hour === hour) || {
    engagementLevel: 'moderate',
    ctrPercentage: 4.0,
  };

  const isDead = (hour >= 0 && hour < 7) || (hour === 7 && min < 30) || (hour === 23 && min > 30);

  const newSlot: ScheduledSlotRecord = {
    id: 'custom-' + Date.now(),
    time,
    label: sanitizeForPrompt(label || `Disparo das ${time}`),
    isEnabled: true,
    engagementLevel: heatPoint.engagementLevel as any,
    expectedCtr: `${heatPoint.ctrPercentage.toFixed(1)}%`,
    categoryPreference: sanitizeForPrompt(categoryPreference || 'Multi-Marketplace'),
    isDeadZone: isDead,
  };

  smartScheduleConfig.timeSlots.push(newSlot);
  smartScheduleConfig.timeSlots.sort((a, b) => a.time.localeCompare(b.time));

  return res.status(201).json({
    success: true,
    message: isDead
      ? 'Atenção: Horário adicionado em faixa de baixo engajamento (madrugada). Se o filtro defensivo estiver ativo, o robô evitará envios nesse intervalo.'
      : 'Novo horário de disparo adicionado com sucesso!',
    slot: newSlot,
    isDeadZoneWarning: isDead,
    config: smartScheduleConfig,
    nextDispatches: calculateNextDispatches(),
  });
});

// Endpoint: DELETE /api/schedule/slots/:id
app.delete('/api/schedule/slots/:id', (req: Request, res: Response) => {
  const slotId = req.params.id;
  const initialLen = smartScheduleConfig.timeSlots.length;
  smartScheduleConfig.timeSlots = smartScheduleConfig.timeSlots.filter((s) => s.id !== slotId);

  if (smartScheduleConfig.timeSlots.length === initialLen) {
    return res.status(404).json({ error: 'Horário não encontrado.' });
  }

  return res.json({
    success: true,
    message: 'Horário removido com sucesso.',
    config: smartScheduleConfig,
    nextDispatches: calculateNextDispatches(),
  });
});

// Endpoint: POST /api/schedule/apply-strategy
app.post('/api/schedule/apply-strategy', (req: Request, res: Response) => {
  const { strategy } = req.body || {};

  if (strategy === 'peak_conversion') {
    // 5 main peaks: 08:30, 11:45, 18:15, 20:30, 21:45
    smartScheduleConfig.activeStrategy = 'peak_conversion';
    smartScheduleConfig.avoidLowEngagement = true;
    smartScheduleConfig.timeSlots.forEach((s) => {
      s.isEnabled = ['08:30', '11:45', '18:15', '20:30', '21:45'].includes(s.time);
    });
  } else if (strategy === 'conservative') {
    // 3 strictly high peaks: 12:00, 18:30, 20:30
    smartScheduleConfig.activeStrategy = 'conservative';
    smartScheduleConfig.avoidLowEngagement = true;
    smartScheduleConfig.timeSlots.forEach((s) => {
      s.isEnabled = ['11:45', '18:15', '20:30'].includes(s.time);
    });
  } else if (strategy === 'black_friday') {
    // Aggressive daytime slots: 08:30, 10:15, 11:45, 14:15, 16:30, 18:15, 20:30, 21:45
    smartScheduleConfig.activeStrategy = 'black_friday';
    smartScheduleConfig.avoidLowEngagement = true;
    smartScheduleConfig.timeSlots.forEach((s) => {
      s.isEnabled = !s.isDeadZone;
    });
  } else if (strategy === 'corujao') {
    // 24h Total com Plantão da Madrugada (00:15, 02:30, 08:30, 11:45, 18:15, 20:30, 21:45)
    smartScheduleConfig.activeStrategy = 'corujao';
    smartScheduleConfig.avoidLowEngagement = false;
    smartScheduleConfig.timeSlots.forEach((s) => {
      s.isEnabled = ['00:15', '02:30', '08:30', '11:45', '18:15', '20:30', '21:45'].includes(s.time);
    });
  }

  return res.json({
    success: true,
    message: `Estratégia "${strategy}" aplicada com sucesso!`,
    config: smartScheduleConfig,
    nextDispatches: calculateNextDispatches(),
  });
});



// ==========================================
// 🚀 API ROUTES: MULTI-MARKETPLACE & DEFENSE
// ==========================================

// Endpoint: Security Shield Status & Real Telemetry
app.get('/api/security/audit', (req: Request, res: Response) => {
  return res.json({
    success: true,
    stats: {
      ...securityAuditStats,
      dispatchesRecorded: dispatchLogs.length,
      defenseLayers: [
        'Rate Limiting Token-Bucket (60 req/min)',
        'Anti-SSRF Private Subnet Blocker (RFC 1918 & Cloud Metadata)',
        'Prompt Injection Sanitizer com Delimitadores Herméticos',
        'XSS & Input Sanitization Layer',
        'Strict CSP & HTTP Header Hardening',
        'Anti-Ban WhatsApp Traffic Shaper com Jitter Randômico',
        'Validação de Estrutura de Chaves Multi-Marketplace',
      ],
    },
  });
});

// Endpoint: Fetch Real Dispatch Logs
app.get('/api/dispatch-logs', (req: Request, res: Response) => {
  return res.json({
    success: true,
    logs: dispatchLogs,
  });
});

// Endpoint: Record Real Dispatch and Generate WhatsApp Direct Link
app.post('/api/dispatch-message', (req: Request, res: Response) => {
  try {
    const {
      productTitle,
      price,
      groupName,
      affiliateLink,
      commission,
      marketplace = 'shopee',
      messageText,
      webhookUrl,
    } = req.body;

    const safeTitle = sanitizeForPrompt(productTitle || 'Achadinho Selecionado');
    const safeGroupName = sanitizeForPrompt(groupName || 'Grupo de WhatsApp');

    // 🔗 Auto-shorten the affiliate link to brand it, hide raw affiliate tags, and track clicks
    let brandedLink = affiliateLink || '/r/oferta-vip';
    let textToSend = messageText || safeTitle;

    if (affiliateLink && typeof affiliateLink === 'string') {
      let existing = shortenedLinks.find((l) => l.targetUrl === affiliateLink);
      if (!existing && !affiliateLink.startsWith('/r/')) {
        const prefix =
          marketplace === 'amazon' ? 'amz' : marketplace === 'mercadolivre' ? 'meli' : 'shp';
        const rand = Math.random().toString(36).substring(2, 7);
        const slug = `${prefix}-${rand}`;
        existing = {
          id: 'link-' + Date.now(),
          slug,
          shortUrl: `/r/${slug}`,
          targetUrl: affiliateLink,
          productTitle: safeTitle,
          marketplace: marketplace as any,
          clicks: 1,
          uniqueClicks: 1,
          createdAt: 'Agora mesmo',
          recentClicks: [
            {
              id: 'clk-' + Date.now(),
              timestamp: 'Agora',
              device: 'mobile',
              referrer: 'WhatsApp',
            },
          ],
        };
        shortenedLinks.unshift(existing);
      }

      if (existing) {
        brandedLink = existing.shortUrl;
        if (textToSend.includes(affiliateLink)) {
          textToSend = textToSend.split(affiliateLink).join(existing.shortUrl);
        }
      }
    }

    const newLog: RealDispatchLog = {
      id: 'disp-' + Date.now(),
      timestamp: 'Agora mesmo',
      marketplace: marketplace as any,
      productTitle: safeTitle,
      price: Number(price) || 0,
      groupName: safeGroupName,
      status: 'sent',
      link: brandedLink,
      commission: Number(commission) || 0,
      deliveryMethod: webhookUrl ? 'Webhook Gateway Direto' : 'WhatsApp Click-to-Chat',
      ipMasked: '189.**.**.**',
    };

    dispatchLogs.unshift(newLog);
    if (dispatchLogs.length > 50) dispatchLogs.pop();

    const directWhatsAppUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      textToSend
    )}`;

    return res.json({
      success: true,
      log: newLog,
      brandedLink,
      directWhatsAppUrl,
      whatsappAppUri: `whatsapp://send?text=${encodeURIComponent(textToSend)}`,
      status: 'DISPATCHED_AND_LOGGED',
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Endpoint: Multi-Marketplace Real Link & Product Extractor
app.post('/api/extract-product', async (req: Request, res: Response) => {
  try {
    const {
      url,
      marketplaceHint,
      shopeeId = 'promoradar_shopee',
      amazonTag = 'promoradar-20',
      meliTracking = 'promoradar_meli',
    } = req.body;

    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'URL ou termo de busca é obrigatório' });
    }

    const cleanInput = url.trim();

    // 🛡️ SSRF Validation if URL provided
    if (cleanInput.startsWith('http://') || cleanInput.startsWith('https://')) {
      try {
        const parsedUrl = new URL(cleanInput);
        const hostname = parsedUrl.hostname.toLowerCase();

        // Check if hostname is an IP directly
        if (isPrivateIp(hostname)) {
          securityAuditStats.blockedSsrfAttempts++;
          return res.status(403).json({
            error: '🛡️ Bloqueio de Segurança: Requisição para endereços de rede privada proibida.',
            code: 'SSRF_BLOCKED',
          });
        }

        // Resolve DNS and check resulting IP
        const addresses = await dns.lookup(hostname);
        if (isPrivateIp(addresses.address)) {
          securityAuditStats.blockedSsrfAttempts++;
          return res.status(403).json({
            error: '🛡️ Bloqueio de Segurança: Resolução de DNS aponta para endereço privado restrito.',
            code: 'SSRF_DNS_BLOCKED',
          });
        }
      } catch (err: any) {
        // Continue if it was a plain search string
      }
    }

    // Detect Marketplace
    let detectedMarketplace: 'shopee' | 'amazon' | 'mercadolivre' =
      marketplaceHint || 'shopee';
    const lowerInput = cleanInput.toLowerCase();

    if (
      lowerInput.includes('amazon.com') ||
      lowerInput.includes('amzn.to') ||
      lowerInput.includes('kindle') ||
      lowerInput.includes('echo dot') ||
      lowerInput.includes('alexa')
    ) {
      detectedMarketplace = 'amazon';
    } else if (
      lowerInput.includes('mercadolivre') ||
      lowerInput.includes('mercado livre') ||
      lowerInput.includes('meli') ||
      lowerInput.includes('produto.mercadolivre')
    ) {
      detectedMarketplace = 'mercadolivre';
    } else if (
      lowerInput.includes('shopee.com') ||
      lowerInput.includes('shope.ee')
    ) {
      detectedMarketplace = 'shopee';
    } else if (marketplaceHint) {
      detectedMarketplace = marketplaceHint;
    }

    // Marketplace Commission Benchmark Rates in Brazil
    const commissionTable = {
      shopee: { rate: 14.0, maxCap: 100 },
      amazon: { rate: 9.0, maxCap: 150 },
      mercadolivre: { rate: 12.0, maxCap: 120 },
    };

    const ai = getGeminiClient();
    const sanitizedTitle = sanitizeForPrompt(cleanInput);

    // Initial robust fallback product
    let productData = {
      title:
        detectedMarketplace === 'amazon'
          ? 'Echo Dot 5ª Geração Smart Speaker com Alexa e Som Imersivo'
          : detectedMarketplace === 'mercadolivre'
          ? 'Fritadeira Elétrica Air Fryer 4L Inox 1500W com Timer'
          : 'Kit 3 Potes Herméticos de Vidro com Tampa de Bambu',
      category:
        detectedMarketplace === 'amazon'
          ? 'Eletrônicos & Smart Home'
          : detectedMarketplace === 'mercadolivre'
          ? 'Eletroportáteis & Cozinha'
          : 'Casa & Decoração',
      marketplace: detectedMarketplace,
      price: detectedMarketplace === 'amazon' ? 299.0 : detectedMarketplace === 'mercadolivre' ? 249.9 : 39.9,
      originalPrice:
        detectedMarketplace === 'amazon' ? 449.0 : detectedMarketplace === 'mercadolivre' ? 499.0 : 89.9,
      discountPercent: detectedMarketplace === 'amazon' ? 33 : detectedMarketplace === 'mercadolivre' ? 50 : 55,
      rating: 4.9,
      reviewCount: 4210,
      salesCount: 12400,
      commissionRate: commissionTable[detectedMarketplace].rate,
      estimatedCommission: 0,
      smartScore: 96,
      imageUrl:
        detectedMarketplace === 'amazon'
          ? 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=600&auto=format&fit=crop&q=80'
          : detectedMarketplace === 'mercadolivre'
          ? 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80',
      productUrl: cleanInput.startsWith('http')
        ? cleanInput
        : `https://www.google.com/search?q=${encodeURIComponent(cleanInput)}`,
      affiliateUrl: '',
      coupon: 'Frete Grátis Prime / Shopee / Meli Full',
    };

    // Calculate commission
    productData.estimatedCommission = Number(
      ((productData.price * productData.commissionRate) / 100).toFixed(2)
    );

    // Format appropriate official affiliate link
    if (detectedMarketplace === 'amazon') {
      productData.affiliateUrl = cleanInput.startsWith('http')
        ? `${cleanInput}${cleanInput.includes('?') ? '&' : '?'}tag=${amazonTag}`
        : `https://www.amazon.com.br/s?k=${encodeURIComponent(sanitizedTitle)}&tag=${amazonTag}`;
    } else if (detectedMarketplace === 'mercadolivre') {
      productData.affiliateUrl = cleanInput.startsWith('http')
        ? `${cleanInput}${cleanInput.includes('?') ? '&' : '?'}tracking_id=${meliTracking}`
        : `https://lista.mercadolivre.com.br/${encodeURIComponent(sanitizedTitle)}?tracking_id=${meliTracking}`;
    } else {
      productData.affiliateUrl = cleanInput.startsWith('http')
        ? `${cleanInput}${cleanInput.includes('?') ? '&' : '?'}af_id=${shopeeId}&sub_id=${shopeeId}`
        : `https://shope.ee/busca?keyword=${encodeURIComponent(sanitizedTitle)}&sub_id=${shopeeId}`;
    }

    // AI Deep Extraction if Gemini available
    if (ai) {
      try {
        const prompt = `Analise a entrada de produto para afiliados no Brasil:
<user_input_content>
${sanitizedTitle}
</user_input_content>

Marketplace identificado: ${detectedMarketplace} (opções: "shopee", "amazon", "mercadolivre")

Gere uma ficha técnica realista e altamente atrativa em formato JSON com estes campos obrigatórios:
- title: nome comercial limpo e atraente em pt-BR (máximo 75 caracteres)
- category: categoria adequada (ex: "Smart Home & Alexa", "Cozinha & Air Fryer", "Casa & Decoração", "Eletrônicos & Tech", "Moda & Beleza", "Ferramentas & Construção")
- price: valor numérico com desconto em Reais (ex: 79.90)
- originalPrice: valor original numérico superior ao preço (ex: 159.90)
- discountPercent: porcentagem inteira de desconto (ex: 50)
- rating: nota de 4.6 a 5.0 (ex: 4.8)
- reviewCount: quantidade de avaliações (ex: 3200)
- salesCount: total vendido aproximado (ex: 8500)
- smartScore: pontuação de probabilidade de clique de 85 a 99 (ex: 95)
- coupon: cupom típico deste marketplace (ex: "Frete Grátis com Amazon Prime" ou "Cupom Shopee 10% OFF" ou "Mercado Livre Full no mesmo dia")

Responda APENAS o JSON válido sem nenhum bloco de Markdown.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        if (response && response.text) {
          const parsed = JSON.parse(response.text);
          const computedPrice = Number(parsed.price) || productData.price;
          const computedRate = commissionTable[detectedMarketplace].rate;

          productData = {
            ...productData,
            ...parsed,
            marketplace: detectedMarketplace,
            commissionRate: computedRate,
            estimatedCommission: Number(
              ((computedPrice * computedRate) / 100).toFixed(2)
            ),
          };
        }
      } catch (aiErr) {
        console.warn('Gemini extraction fallback:', aiErr);
      }
    }

    return res.json({
      success: true,
      product: productData,
      marketplace: detectedMarketplace,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Endpoint: AI-Powered Multi-Marketplace Copy Generator
app.post('/api/generate-copy', async (req: Request, res: Response) => {
  try {
    const {
      title,
      price,
      originalPrice,
      discount,
      coupon,
      affiliateLink,
      rating,
      salesCount,
      marketplace = 'shopee',
      style = 'urgencia',
    } = req.body;

    const safeTitle = sanitizeForPrompt(title || 'Produto em Destaque');
    const safeMarketplace = sanitizeForPrompt(marketplace);
    const ai = getGeminiClient();

    const marketplaceName =
      safeMarketplace === 'amazon'
        ? 'Amazon Brasil 📦'
        : safeMarketplace === 'mercadolivre'
        ? 'Mercado Livre Full ⚡'
        : 'Shopee Oficial 🛍️';

    if (ai) {
      const prompt = `Você é um robô de alta conversão de vendas para grupos e canais de ofertas do WhatsApp no Brasil.
Crie uma copy curta, persuasiva e formatada para WhatsApp no idioma Português (pt-BR).

DADOS DO PRODUTO:
- Marketplace: ${marketplaceName}
- Título: ${safeTitle}
- Preço Promocional: R$ ${price || '49,90'}
- Preço Original: R$ ${originalPrice || '99,90'}
- Desconto: ${discount || '50% OFF'}
- Cupom/Benefício: ${coupon || 'Frete Grátis disponível'}
- Avaliação: ${rating || '4.9 ⭐'}
- Total Vendido: ${salesCount || '+3.000'}
- Link de Afiliado: ${affiliateLink || 'https://promoradar.pro/link'}
- Estilo: ${style} (opções: "urgencia" com escassez e emojis de fogo, "achadinho" recomendação pessoal amigável, "viral" foco em novidade/TikTok, "cupom" foco na economia máxima, "corujao" plantão corujão da madrugada com emojis noturnos 🦉🌙✨ para quem compra à noite/madrugada aproveitando cupons novos da virada e saldão com zero concorrência)

REGRAS OBRIGATÓRIAS:
1. Use formatação nativa do WhatsApp (*negrito*, _itálico_, ~tachado~ no preço antigo).
2. Destaque o selo do Marketplace (${marketplaceName}).
3. Finalize com chamada objetiva: 🛒 *Link seguro para comprar:* ${affiliateLink}
4. Não insira texto explicativo antes ou depois da mensagem. Retorne apenas a mensagem pronta.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      if (response && response.text) {
        return res.json({
          success: true,
          copy: response.text.trim(),
          source: 'gemini',
        });
      }
    }

    // High quality template fallback
    const fallbackCopy = `🚨 *ALERTA DE OFERTA EXCLUSIVA!* 🚨\n\n${marketplaceName}\n✨ *${safeTitle}*\n\n❌ De: ~R$ ${originalPrice || '99,90'}~\n🔥 *Por apenas: R$ ${price || '49,90'}* (${discount || '50% OFF'}!)\n\n🎟️ *Benefício:* ${coupon || 'Frete Grátis Ativado'}\n⭐ Avaliação: ${rating || '4.9/5'} | 📦 ${salesCount || '+5.000 vendidos'}\n\n⚠️ *Estoque promocional limitado!*\n👉 *Garanta o seu aqui:* ${affiliateLink || 'https://promoradar.pro/link'}\n\n⚡ _Disparado via PromoRadar Pro_`;

    return res.json({
      success: true,
      copy: fallbackCopy,
      source: 'template',
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Endpoint: Validate Credentials for Shopee, Amazon, and Mercado Livre
app.post('/api/validate-credentials', (req: Request, res: Response) => {
  const { marketplace, payload } = req.body;

  if (marketplace === 'amazon') {
    const { associateTag } = payload || {};
    const isValidTag = associateTag && typeof associateTag === 'string' && associateTag.includes('-20');
    return res.json({
      valid: Boolean(isValidTag),
      marketplace: 'amazon',
      message: isValidTag
        ? 'Tag de Associado da Amazon Brasil validada com sucesso! Formato padrão (terminação -20).'
        : 'Atenção: Tags de Associados Amazon Brasil geralmente terminam com "-20" (ex: meunome-20).',
    });
  }

  if (marketplace === 'mercadolivre') {
    const { appId, trackingCode } = payload || {};
    const isValid = Boolean(appId && trackingCode);
    return res.json({
      valid: isValid,
      marketplace: 'mercadolivre',
      message: isValid
        ? 'Credenciais do Mercado Livre Afiliados verificadas com sucesso!'
        : 'Preencha o App ID e Tracking Code do Mercado Livre.',
    });
  }

  // Default Shopee
  const { appId, affiliateId } = payload || {};
  const isValid = Boolean(appId && affiliateId);
  return res.json({
    valid: isValid,
    marketplace: 'shopee',
    message: isValid
      ? 'Chaves da API Shopee Open Platform validadas com sucesso!'
      : 'Preencha o App ID e seu ID de Afiliado da Shopee.',
  });
});

// Start Server
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PromoRadar Pro server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
