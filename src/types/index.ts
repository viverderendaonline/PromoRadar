export type Marketplace = 'shopee' | 'amazon' | 'mercadolivre';

export interface AffiliateDeal {
  id: string;
  title: string;
  marketplace: Marketplace;
  category: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  salesCount: number;
  commissionRate: number; // e.g. 14.5%
  estimatedCommission: number; // e.g. R$ 5.78
  smartScore: number; // 0 - 100
  imageUrl: string;
  productUrl: string;
  affiliateUrl: string;
  coupon?: string;
  isViral?: boolean;
  highlightHook?: string;
}

// Backward compatibility alias
export type ShopeeProduct = AffiliateDeal;

export interface WhatsAppGroup {
  id: string;
  name: string;
  memberCount: number;
  isActive: boolean;
  lastDispatchedAt?: string;
  totalSentToday: number;
  type: 'group' | 'channel';
  targetMarketplaces?: Marketplace[];
}

export interface MessageTemplate {
  id: string;
  name: string;
  category: 'urgencia' | 'achadinho' | 'viral' | 'cupom' | 'clean';
  description: string;
  content: string;
  isDefault?: boolean;
}

export interface AutomationSettings {
  isEnabled: boolean;
  intervalMinutes: number; // e.g. 20 min
  startHour: string; // e.g. "08:00"
  endHour: string; // e.g. "22:30"
  selectedCategories: string[];
  selectedMarketplaces: Marketplace[];
  minCommissionRate: number; // e.g. 10%
  minRating: number; // e.g. 4.8
  minSmartScore: number; // e.g. 80
  antiBanHumanDelay: boolean; // jitter delay +/- 3 min
  rotateTemplates: boolean;
  targetGroupIds: string[];
  activeTemplateId: string;
  webhookUrl?: string; // Optional external webhook (e.g. Evolution API, Baileys, Z-API)
}

export interface MultiMarketplaceCredentials {
  shopee: {
    appId: string;
    appSecret: string;
    affiliateId: string;
    subId: string;
    isConnected: boolean;
    lastVerifiedAt?: string;
  };
  amazon: {
    associateTag: string;
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
    isConnected: boolean;
    lastVerifiedAt?: string;
  };
  mercadolivre: {
    appId: string;
    clientSecret: string;
    trackingCode: string;
    isConnected: boolean;
    lastVerifiedAt?: string;
  };
}

export interface DispatchLog {
  id: string;
  timestamp: string;
  marketplace?: Marketplace;
  productTitle: string;
  price: number;
  groupName: string;
  status: 'sent' | 'pending' | 'failed';
  link: string;
  commission: number;
  deliveryMethod?: string;
}

export interface PlanTier {
  id: string;
  name: string;
  price: number;
  period: string;
  groupLimit: number;
  tagline: string;
  features: string[];
  isPopular?: boolean;
  badge?: string;
}

export interface SecurityAuditStats {
  totalRequestsFiltered: number;
  blockedSsrfAttempts: number;
  blockedPromptInjections: number;
  rateLimitHits: number;
  sanitizedInputs: number;
  activeFirewallRules: number;
  engineStatus: string;
  dispatchesRecorded?: number;
  defenseLayers?: string[];
}

export interface ClickEvent {
  id: string;
  timestamp: string;
  userAgent?: string;
  device: 'mobile' | 'desktop' | 'tablet';
  referrer?: string;
}

export interface ShortenedLink {
  id: string;
  slug: string;
  shortUrl: string;
  targetUrl: string;
  productTitle: string;
  marketplace: Marketplace;
  clicks: number;
  uniqueClicks: number;
  createdAt: string;
  recentClicks?: ClickEvent[];
}

export type OrderStatus = 'approved' | 'pending' | 'cancelled';

export interface AffiliateOrder {
  id: string;
  orderId: string;
  marketplace: Marketplace | 'hotmart' | 'kiwify' | 'braip';
  productTitle: string;
  orderAmount: number;
  commissionAmount: number;
  status: OrderStatus;
  buyerState?: string;
  timestamp: string;
  rawPayload?: any;
}

export interface WebhookSettings {
  isEnabled: boolean;
  webhookUrl: string;
  secretToken: string;
  allowedEvents: string[];
  autoDispatchAlertToWhatsApp: boolean;
  soundAlert: boolean;
}

export type EngagementLevel = 'low' | 'moderate' | 'high' | 'peak';

export interface ScheduledTimeSlot {
  id: string;
  time: string; // "08:30"
  label: string; // "Café da Manhã & Início do Dia"
  isEnabled: boolean;
  engagementLevel: EngagementLevel;
  expectedCtr: string; // "8.2%"
  categoryPreference?: string;
  isDeadZone?: boolean;
  isCorujao?: boolean; // For night-owl / madrugada buyers
}

export interface EngagementHourInsight {
  hour: number; // 0 to 23
  label: string; // "08:00"
  engagementLevel: EngagementLevel;
  ctrPercentage: number;
  averageSalesIndex: number; // 1-100
  recommendedAction: 'block' | 'avoid' | 'good' | 'prime';
  description: string;
}

export interface SmartScheduleConfig {
  mode: 'slots' | 'interval';
  avoidLowEngagement: boolean;
  quietHoursStart: string; // "23:00"
  quietHoursEnd: string; // "07:30"
  humanJitterMinutes: number; // 3
  activeDays: number[]; // [0,1,2,3,4,5,6] (0 = Domingo)
  timeSlots: ScheduledTimeSlot[];
  activeStrategy: 'peak_conversion' | 'black_friday' | 'conservative' | 'corujao' | 'custom';
  autoSkipIfNoHotDeal: boolean;
  weekendBehavior: 'normal' | 'shift_later' | 'high_only';
}

export interface NextScheduledDispatch {
  id: string;
  scheduledTime: string; // "20:30"
  timeUntil: string; // "em 35 min"
  targetGroupNames: string[];
  marketplace: Marketplace;
  suggestedProductTitle: string;
  status: 'pending' | 'ready' | 'skipped';
  engagementLevel: EngagementLevel;
}



