import { AffiliateDeal, WhatsAppGroup, MessageTemplate, PlanTier, AutomationSettings, MultiMarketplaceCredentials } from '../types';

export const INITIAL_PRODUCTS: AffiliateDeal[] = [
  // AMAZON BRASIL DEALS
  {
    id: 'prod-amz-001',
    title: 'Echo Dot 5ª Geração Smart Speaker com Alexa e Som Imersivo',
    marketplace: 'amazon',
    category: 'Smart Home & Alexa',
    price: 299.0,
    originalPrice: 449.0,
    discountPercent: 33,
    rating: 4.9,
    reviewCount: 38400,
    salesCount: 82000,
    commissionRate: 9.0,
    estimatedCommission: 26.91,
    smartScore: 99,
    imageUrl: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=600&auto=format&fit=crop&q=80',
    productUrl: 'https://www.amazon.com.br/dp/B09B8V1LZ3',
    affiliateUrl: 'https://www.amazon.com.br/dp/B09B8V1LZ3?tag=promoradar-20',
    coupon: 'Frete Grátis com Amazon Prime',
    isViral: true,
    highlightHook: 'O queridinho da Amazon com o menor valor histórico do ano!',
  },
  {
    id: 'prod-amz-002',
    title: 'Kindle 11ª Geração com Tela de 6" Antirreflexo e 16GB de Armazenamento',
    marketplace: 'amazon',
    category: 'Eletrônicos & Tech',
    price: 449.1,
    originalPrice: 499.0,
    discountPercent: 10,
    rating: 4.9,
    reviewCount: 19500,
    salesCount: 45000,
    commissionRate: 9.0,
    estimatedCommission: 40.41,
    smartScore: 97,
    imageUrl: 'https://images.unsplash.com/photo-1592496001020-d31bd830651f?w=600&auto=format&fit=crop&q=80',
    productUrl: 'https://www.amazon.com.br/dp/B09SWW583J',
    affiliateUrl: 'https://www.amazon.com.br/dp/B09SWW583J?tag=promoradar-20',
    coupon: 'Parcelamento sem juros + Prime',
    isViral: false,
    highlightHook: 'Bateria para semanas e luz embutida ajustável.',
  },
  {
    id: 'prod-amz-003',
    title: 'Fone de Ouvido Bluetooth JBL Wave Buds TWS com Graves Profundos e Bateria 32h',
    marketplace: 'amazon',
    category: 'Áudio & Música',
    price: 219.0,
    originalPrice: 329.0,
    discountPercent: 33,
    rating: 4.8,
    reviewCount: 14200,
    salesCount: 38000,
    commissionRate: 9.0,
    estimatedCommission: 19.71,
    smartScore: 95,
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
    productUrl: 'https://www.amazon.com.br/dp/B0BG76M841',
    affiliateUrl: 'https://www.amazon.com.br/dp/B0BG76M841?tag=promoradar-20',
    coupon: 'Entrega Prime 24h',
    isViral: true,
    highlightHook: 'Qualidade sonora JBL legítima e resistência à água.',
  },

  // MERCADO LIVRE DEALS
  {
    id: 'prod-meli-001',
    title: 'Fritadeira Sem Óleo Air Fryer Mondial Family 4 Litros Inox 1500W',
    marketplace: 'mercadolivre',
    category: 'Cozinha & Eletroportáteis',
    price: 279.9,
    originalPrice: 499.0,
    discountPercent: 44,
    rating: 4.9,
    reviewCount: 42100,
    salesCount: 95000,
    commissionRate: 12.0,
    estimatedCommission: 33.58,
    smartScore: 98,
    imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80',
    productUrl: 'https://produto.mercadolivre.com.br/MLB-351029384-airfryer-mondial-4l',
    affiliateUrl: 'https://mercadolivre.com/sec/airfryer4l?tracking_id=promoradar',
    coupon: 'Envio Full no Mesmo Dia',
    isViral: true,
    highlightHook: 'A Air Fryer mais vendida de todo o Mercado Livre!',
  },
  {
    id: 'prod-meli-002',
    title: 'Parafusadeira e Furadeira de Impacto Bateria 12V Bivolt com Maleta e 13 Acessórios',
    marketplace: 'mercadolivre',
    category: 'Ferramentas & Construção',
    price: 139.9,
    originalPrice: 289.0,
    discountPercent: 51,
    rating: 4.8,
    reviewCount: 16700,
    salesCount: 42000,
    commissionRate: 12.0,
    estimatedCommission: 16.78,
    smartScore: 94,
    imageUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=80',
    productUrl: 'https://produto.mercadolivre.com.br/MLB-2940291-parafusadeira-12v',
    affiliateUrl: 'https://mercadolivre.com/sec/parafusadeira12v?tracking_id=promoradar',
    coupon: 'Frete Grátis Mercado Envios',
    isViral: false,
    highlightHook: 'Indispensável para consertos em casa pagando metade do preço.',
  },

  // SHOPEE DEALS
  {
    id: 'prod-shp-001',
    title: 'Mini Selador Térmico Portátil para Embalagens e Sacos Plásticos',
    marketplace: 'shopee',
    category: 'Cozinha Prática',
    price: 18.9,
    originalPrice: 49.9,
    discountPercent: 62,
    rating: 4.9,
    reviewCount: 4890,
    salesCount: 14200,
    commissionRate: 15.0,
    estimatedCommission: 2.83,
    smartScore: 97,
    imageUrl: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80',
    productUrl: 'https://shopee.com.br/product/mini-selador-termico-portatil',
    affiliateUrl: 'https://shope.ee/achadinho01?sub_id=promoradar',
    coupon: 'Frete Grátis acima de R$ 19',
    isViral: true,
    highlightHook: 'Economize comida e mantenha tudo crocante por menos de 20 reais!',
  },
  {
    id: 'prod-shp-002',
    title: 'Luminária Astronauta Projetor Galáxia e Estrelas 360° com Controle Remoto',
    marketplace: 'shopee',
    category: 'Casa & Decoração',
    price: 49.9,
    originalPrice: 119.9,
    discountPercent: 58,
    rating: 4.9,
    reviewCount: 8200,
    salesCount: 23100,
    commissionRate: 14.0,
    estimatedCommission: 6.98,
    smartScore: 99,
    imageUrl: 'https://images.unsplash.com/photo-1507499739999-097706ad8914?w=600&auto=format&fit=crop&q=80',
    productUrl: 'https://shopee.com.br/product/luminaria-astronauta-projetor',
    affiliateUrl: 'https://shope.ee/achadinho02?sub_id=promoradar',
    coupon: 'CUPOM R$ 10 OFF no App',
    isViral: true,
    highlightHook: 'O astronauta mais viral do TikTok com o menor preço do ano!',
  },
  {
    id: 'prod-shp-003',
    title: 'Mini Processador e Triturador Elétrico de Alimentos USB sem Fio 250ml',
    marketplace: 'shopee',
    category: 'Cozinha Prática',
    price: 24.5,
    originalPrice: 59.9,
    discountPercent: 59,
    rating: 4.8,
    reviewCount: 12500,
    salesCount: 38000,
    commissionRate: 16.0,
    estimatedCommission: 3.92,
    smartScore: 95,
    imageUrl: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&auto=format&fit=crop&q=80',
    productUrl: 'https://shopee.com.br/product/mini-processador-usb',
    affiliateUrl: 'https://shope.ee/achadinho03?sub_id=promoradar',
    coupon: 'Frete Grátis ativado',
    isViral: true,
    highlightHook: 'Pica alho e cebola em 3 segundos sem cheiro na mão!',
  },
];

export const INITIAL_GROUPS: WhatsAppGroup[] = [
  {
    id: 'grp-01',
    name: '🔥 Ofertas Relâmpago Shopee & Amazon VIP [01]',
    memberCount: 820,
    isActive: true,
    lastDispatchedAt: '12 min atrás',
    totalSentToday: 15,
    type: 'group',
    targetMarketplaces: ['shopee', 'amazon', 'mercadolivre'],
  },
  {
    id: 'grp-02',
    name: '🛍️ Achadinhos de Casa & Decoração Shopee [02]',
    memberCount: 940,
    isActive: true,
    lastDispatchedAt: '28 min atrás',
    totalSentToday: 18,
    type: 'group',
    targetMarketplaces: ['shopee', 'mercadolivre'],
  },
  {
    id: 'grp-03',
    name: '📦 Promoções Amazon Prime & Alexa 🎧',
    memberCount: 650,
    isActive: true,
    lastDispatchedAt: '45 min atrás',
    totalSentToday: 12,
    type: 'group',
    targetMarketplaces: ['amazon'],
  },
  {
    id: 'grp-04',
    name: '⚡ Mercado Livre Full & Cupons 🚚',
    memberCount: 710,
    isActive: true,
    lastDispatchedAt: '1h atrás',
    totalSentToday: 8,
    type: 'group',
    targetMarketplaces: ['mercadolivre'],
  },
  {
    id: 'grp-05',
    name: '📢 Canal Oficial Multi-Ofertas (Geral)',
    memberCount: 3150,
    isActive: true,
    lastDispatchedAt: '5 min atrás',
    totalSentToday: 24,
    type: 'channel',
    targetMarketplaces: ['shopee', 'amazon', 'mercadolivre'],
  },
];

export const INITIAL_TEMPLATES: MessageTemplate[] = [
  {
    id: 'tpl-01',
    name: '🚨 Alerta de Preço Baixo Multi-Marketplace',
    category: 'urgencia',
    description: 'Focado em escassez, selo da loja oficial e desconto imediato',
    content: `🚨 *ALERTA DE PREÇO BAIXO!* 🚨

📦 *{marketplace_badge}*
✨ *{titulo}*

❌ De: ~R$ {preco_antigo}~
🔥 *Por apenas: R$ {preco}* ({desconto})

🎟️ *Benefício:* {cupom}
⭐ Avaliação: {avaliacao} | 📦 {vendas}

⚠️ *Corre que o lote promocional acaba rápido!*
👉 *Garanta o seu com desconto:* {link}

⚡ _Disparado via PromoRadar Pro_`,
    isDefault: true,
  },
  {
    id: 'tpl-02',
    name: '🤫 Achadinho Secreto (Estilo Amiga)',
    category: 'achadinho',
    description: 'Tom pessoal e descontraído de recomendação genuína',
    content: `🤫 *MENINAS, OLHA ESSE ACHADINHO!* ✨

Pára tudo! Acabei de encontrar essa oferta surreal na {marketplace_badge}!

🛍️ *{titulo}*

💰 *Por apenas R$ {preco}*
(Normalmente custa ~R$ {preco_antigo}~)

⭐️ Avaliação máxima dos compradores ({avaliacao})
🏷️ Dica: {cupom}

👇 *Link seguro verificado:*
🔗 {link}

💖 _Aproveitem antes que suba de preço!_`,
    isDefault: false,
  },
  {
    id: 'tpl-03',
    name: '📱 Queridinho do TikTok (Viral)',
    category: 'viral',
    description: 'Para produtos com alto apelo visual e virais em redes sociais',
    content: `🔥 *O QUERIDINHO DO TIKTOK CHEGOU NA PROMOÇÃO!* 📲

Todo mundo tava procurando e finalmente entrou em oferta relâmpago!
📦 *{marketplace_badge}*

✨ *{titulo}*

💥 *SUPER DESCONTO: R$ {preco}*
(Preço original: ~R$ {preco_antigo}~)

⚡ {desconto} + {cupom}!
🌟 {vendas} pedidos entregues e aprovados!

🛒 *Compre com desconto antes de esgotar:*
👉 {link}`,
    isDefault: false,
  },
];

export const INITIAL_PLANS: PlanTier[] = [
  {
    id: 'plan-starter',
    name: 'Iniciante Multi',
    price: 59.9,
    period: 'mês',
    groupLimit: 2,
    tagline: 'Ideal para quem está começando grupos de Shopee e Mercado Livre',
    features: [
      '2 Grupos ou Canais de WhatsApp',
      'Suporte para Shopee, Amazon e Mercado Livre',
      'Links com seus IDs de Afiliado automáticos',
      'Proteção Anti-Bloqueio com delay inteligente',
      'Templates de mensagens customizáveis',
      'Escudo de Segurança Ativo',
    ],
    isPopular: false,
  },
  {
    id: 'plan-pro',
    name: 'Profissional (Pro)',
    price: 99.9,
    period: 'mês',
    groupLimit: 6,
    tagline: 'O mais escolhido por afiliados que vendem múltiplos marketplaces',
    features: [
      'Até 6 Grupos e Canais de WhatsApp',
      'Shopee + Amazon + Mercado Livre simultâneos',
      'Algoritmo Smart Score de Alta Conversão com IA',
      'Disparos 24 horas programados no piloto automático',
      'Sem nenhuma marca d’água nos posts',
      'Webhook Gateway para integração com APIs WhatsApp',
      'Suporte prioritário via WhatsApp',
    ],
    isPopular: true,
    badge: 'MAIS POPULAR ⭐',
  },
  {
    id: 'plan-scale',
    name: 'VIP Multi-Rede',
    price: 199.9,
    period: 'mês',
    groupLimit: 20,
    tagline: 'Para redes de grupos de grande escala e agências',
    features: [
      'Até 20 Grupos e Canais de WhatsApp simultâneos',
      'Envio multithread com rotatividade inteligente',
      'Disparo de ofertas relâmpago Amazon Prime e Meli Full',
      'Múltiplos IDs de Afiliado e SubIDs por grupo',
      'Monitoramento de cliques em tempo real',
      'Firewall Anti-Spam e proteção brutal de credenciais',
      'Gerente de conta exclusivo',
    ],
    isPopular: false,
  },
];

export const INITIAL_AUTOMATION_SETTINGS: AutomationSettings = {
  isEnabled: true,
  intervalMinutes: 25,
  startHour: '08:00',
  endHour: '22:30',
  selectedCategories: [
    'Smart Home & Alexa',
    'Cozinha & Eletroportáteis',
    'Casa & Decoração',
    'Eletrônicos & Tech',
    'Ferramentas & Construção',
  ],
  selectedMarketplaces: ['shopee', 'amazon', 'mercadolivre'],
  minCommissionRate: 9.0,
  minRating: 4.8,
  minSmartScore: 85,
  antiBanHumanDelay: true,
  rotateTemplates: true,
  targetGroupIds: ['grp-01', 'grp-02', 'grp-03', 'grp-04', 'grp-05'],
  activeTemplateId: 'tpl-01',
};

export const INITIAL_CREDENTIALS: MultiMarketplaceCredentials = {
  shopee: {
    appId: '10849201',
    appSecret: '9f83ac4e72b109d7',
    affiliateId: 'promoradar_shopee',
    subId: 'zap_grupo_01',
    isConnected: true,
    lastVerifiedAt: 'Hoje às 14:32',
  },
  amazon: {
    associateTag: 'promoradar-20',
    accessKeyId: 'AKIAIOSFODNN7EXAMPLE',
    secretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
    region: 'BR',
    isConnected: true,
    lastVerifiedAt: 'Hoje às 15:10',
  },
  mercadolivre: {
    appId: '84920184029',
    clientSecret: 'sec_7894a8c90b12e34',
    trackingCode: 'promoradar_meli',
    isConnected: true,
    lastVerifiedAt: 'Hoje às 15:15',
  },
};
