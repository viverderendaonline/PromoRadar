import React, { useState } from 'react';
import {
  Search,
  Filter,
  Sparkles,
  Send,
  Copy,
  Check,
  ExternalLink,
  Star,
  Tag,
  DollarSign,
} from 'lucide-react';
import { AffiliateDeal, Marketplace } from '../types';

interface ProductsCatalogProps {
  products: AffiliateDeal[];
  onSelectProductForDispatch: (product: AffiliateDeal) => void;
  onCopyProductCopy: (product: AffiliateDeal) => void;
}

export const ProductsCatalog: React.FC<ProductsCatalogProps> = ({
  products,
  onSelectProductForDispatch,
  onCopyProductCopy,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMarketplace, setSelectedMarketplace] = useState<string>('todos');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [minCommission, setMinCommission] = useState(0);
  const [sortBy, setSortBy] = useState<'score' | 'commission' | 'discount' | 'sales'>('score');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    'Todas',
    'Smart Home & Alexa',
    'Cozinha & Eletroportáteis',
    'Cozinha Prática',
    'Casa & Decoração',
    'Eletrônicos & Tech',
    'Ferramentas & Construção',
    'Áudio & Música',
  ];

  const filteredProducts = products
    .filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMarketplace =
        selectedMarketplace === 'todos' || p.marketplace === selectedMarketplace;
      const matchesCategory = selectedCategory === 'Todas' || p.category === selectedCategory;
      const matchesCommission = p.commissionRate >= minCommission;
      return matchesSearch && matchesMarketplace && matchesCategory && matchesCommission;
    })
    .sort((a, b) => {
      if (sortBy === 'score') return b.smartScore - a.smartScore;
      if (sortBy === 'commission') return b.commissionRate - a.commissionRate;
      if (sortBy === 'discount') return b.discountPercent - a.discountPercent;
      if (sortBy === 'sales') return b.salesCount - a.salesCount;
      return 0;
    });

  const handleCopy = (product: AffiliateDeal) => {
    onCopyProductCopy(product);
    setCopiedId(product.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#191414] tracking-tight">
            Catálogo Multi-Marketplace & Ofertas
          </h2>
          <p className="text-xs sm:text-sm text-[#6b635b] mt-1">
            Explore achadinhos e ofertas ativas na <strong>Shopee</strong>, <strong>Amazon</strong> e <strong>Mercado Livre</strong> com comissões calculadas.
          </p>
        </div>

        {/* Marketplace Filter Pills */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-[#ede8e3] shadow-sm">
          <button
            onClick={() => setSelectedMarketplace('todos')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedMarketplace === 'todos'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-[#6b635b] hover:bg-gray-100'
            }`}
          >
            Todas as Lojas
          </button>
          <button
            onClick={() => setSelectedMarketplace('amazon')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              selectedMarketplace === 'amazon'
                ? 'bg-[#232f3e] text-amber-300 shadow-sm'
                : 'text-[#6b635b] hover:bg-gray-100'
            }`}
          >
            <span>📦 Amazon</span>
          </button>
          <button
            onClick={() => setSelectedMarketplace('mercadolivre')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              selectedMarketplace === 'mercadolivre'
                ? 'bg-[#ffe600] text-black shadow-sm font-extrabold'
                : 'text-[#6b635b] hover:bg-gray-100'
            }`}
          >
            <span>⚡ Mercado Livre</span>
          </button>
          <button
            onClick={() => setSelectedMarketplace('shopee')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              selectedMarketplace === 'shopee'
                ? 'bg-[#ee4d2d] text-white shadow-sm'
                : 'text-[#6b635b] hover:bg-gray-100'
            }`}
          >
            <span>🛍️ Shopee</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#ede8e3] shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-[#8c827a] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nome, marca ou utilidade..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e2dbd2] focus:ring-2 focus:ring-[#ee4d2d]/30 focus:border-[#ee4d2d] outline-none text-xs sm:text-sm bg-[#faf8f5]"
            />
          </div>

          {/* Min Commission Filter */}
          <div className="md:col-span-3">
            <select
              value={minCommission}
              onChange={(e) => setMinCommission(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2dbd2] focus:ring-2 focus:ring-[#ee4d2d]/30 focus:border-[#ee4d2d] outline-none text-xs sm:text-sm bg-[#faf8f5] font-medium"
            >
              <option value={0}>Qualquer comissão</option>
              <option value={9}>Mínimo 9% (Amazon/Shopee)</option>
              <option value={12}>Mínimo 12% de comissão</option>
              <option value={15}>Mínimo 15% de comissão</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="md:col-span-3">
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2dbd2] focus:ring-2 focus:ring-[#ee4d2d]/30 focus:border-[#ee4d2d] outline-none text-xs sm:text-sm bg-[#faf8f5] font-medium"
            >
              <option value="score">Ordenar: Smart Score</option>
              <option value="commission">Ordenar: Maior Comissão (%)</option>
              <option value="discount">Ordenar: Maior Desconto</option>
              <option value="sales">Ordenar: Mais Vendidos</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === c
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-[#faf8f5] text-[#6b635b] hover:bg-orange-50 hover:text-[#ee4d2d] border border-[#ede8e3]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredProducts.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-2xl border border-[#ede8e3] overflow-hidden shadow-sm hover:border-orange-300 hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Product Image & Badges */}
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                <img
                  src={p.imageUrl}
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Marketplace Badge */}
                <div
                  className={`absolute top-2 left-2 text-white text-[10px] font-black px-2 py-0.5 rounded shadow ${
                    p.marketplace === 'amazon'
                      ? 'bg-[#232f3e]'
                      : p.marketplace === 'mercadolivre'
                      ? 'bg-[#ffe600] text-black font-extrabold'
                      : 'bg-[#ee4d2d]'
                  }`}
                >
                  {p.marketplace === 'amazon'
                    ? '📦 AMAZON'
                    : p.marketplace === 'mercadolivre'
                    ? '⚡ MERCADO LIVRE'
                    : '🛍️ SHOPEE'}
                </div>

                <div className="absolute top-2 right-2 bg-[#ee4d2d] text-white text-[10px] font-black px-2 py-0.5 rounded shadow">
                  🔥 {p.discountPercent}% OFF
                </div>

                <div className="absolute bottom-2 right-2 bg-black/75 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" /> Score {p.smartScore}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4 space-y-2">
                <span className="text-[10px] uppercase font-bold text-[#8c827a] tracking-wider">
                  {p.category}
                </span>
                <h3 className="text-xs sm:text-sm font-bold text-[#191414] line-clamp-2 leading-snug">
                  {p.title}
                </h3>

                <div className="flex items-center gap-2 text-[11px] text-[#6b635b]">
                  <span className="flex items-center text-amber-500 font-bold">
                    <Star className="w-3 h-3 fill-amber-400 mr-0.5" />
                    {p.rating}
                  </span>
                  <span>•</span>
                  <span>+{p.salesCount.toLocaleString()} vendidos</span>
                </div>

                {/* Price and Commission Box */}
                <div className="pt-2 border-t border-gray-100 flex items-end justify-between">
                  <div>
                    <span className="text-[11px] text-gray-400 line-through block">
                      R$ {p.originalPrice.toFixed(2)}
                    </span>
                    <span className="text-base sm:text-lg font-black text-[#ee4d2d]">
                      R$ {p.price.toFixed(2)}
                    </span>
                  </div>

                  <div className="text-right bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-lg">
                    <span className="text-[10px] font-semibold text-emerald-800 block">
                      Comissão Estimada:
                    </span>
                    <span className="text-xs font-black text-emerald-700">
                      R$ {p.estimatedCommission.toFixed(2)} ({p.commissionRate}%)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-3 pt-0 grid grid-cols-2 gap-2">
              <button
                onClick={() => handleCopy(p)}
                className="w-full py-2 px-2 rounded-xl border border-orange-200 bg-orange-50/70 hover:bg-orange-100 text-[#ee4d2d] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedId === p.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Copy</span>
                  </>
                )}
              </button>

              <button
                onClick={() => onSelectProductForDispatch(p)}
                className="w-full py-2 px-2 rounded-xl bg-[#ee4d2d] hover:bg-[#d73211] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Disparar</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
