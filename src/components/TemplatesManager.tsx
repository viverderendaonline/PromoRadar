import React, { useState } from 'react';
import {
  MessageSquare,
  Sparkles,
  Save,
  Check,
  Tag,
  Eye,
  RotateCcw,
  Copy,
  Plus,
} from 'lucide-react';
import { MessageTemplate, ShopeeProduct } from '../types';
import { WhatsAppChatSimulation } from './WhatsAppChatSimulation';

interface TemplatesManagerProps {
  templates: MessageTemplate[];
  setTemplates: React.Dispatch<React.SetStateAction<MessageTemplate[]>>;
  sampleProducts: ShopeeProduct[];
}

export const TemplatesManager: React.FC<TemplatesManagerProps> = ({
  templates,
  setTemplates,
  sampleProducts,
}) => {
  const [activeTemplateId, setActiveTemplateId] = useState(templates[0].id);
  const [currentText, setCurrentText] = useState(templates[0].content);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const activeTemplate = templates.find((t) => t.id === activeTemplateId) || templates[0];

  const availableTags = [
    { tag: '{titulo}', desc: 'Título do produto' },
    { tag: '{preco}', desc: 'Preço promocional' },
    { tag: '{preco_antigo}', desc: 'Preço original' },
    { tag: '{desconto}', desc: '% de desconto' },
    { tag: '{cupom}', desc: 'Cupom de desconto' },
    { tag: '{avaliacao}', desc: 'Nota em estrelas' },
    { tag: '{vendas}', desc: 'Total vendido' },
    { tag: '{link}', desc: 'Seu link de afiliado' },
  ];

  const handleSelectTemplate = (tpl: MessageTemplate) => {
    setActiveTemplateId(tpl.id);
    setCurrentText(tpl.content);
  };

  const handleInsertTag = (tag: string) => {
    setCurrentText((prev) => prev + ` ${tag}`);
  };

  const handleSave = () => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === activeTemplateId ? { ...t, content: currentText } : t))
    );
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#191414] tracking-tight">
            Modelos de Mensagem (Templates)
          </h2>
          <p className="text-xs sm:text-sm text-[#6b635b] mt-1">
            Personalize textos, emojis e tags dinâmicas para postagens no WhatsApp com pré-visualização em tempo real.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ee4d2d] hover:bg-[#d73211] text-white font-extrabold text-xs shadow-sm transition-all cursor-pointer self-start sm:self-auto"
        >
          {saveSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{saveSuccess ? 'Salvo no Robô! ✓' : 'Salvar Este Modelo'}</span>
        </button>
      </div>

      {/* Template Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {templates.map((tpl) => (
          <button
            key={tpl.id}
            onClick={() => handleSelectTemplate(tpl)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
              activeTemplateId === tpl.id
                ? 'bg-orange-50 border-[#ee4d2d] text-[#ee4d2d] shadow-sm'
                : 'bg-white border-[#ede8e3] text-[#6b635b] hover:border-orange-200'
            }`}
          >
            {tpl.name}
          </button>
        ))}
      </div>

      {/* Two Column Layout: Editor + Live Phone Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor Column */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#ede8e3] p-6 shadow-sm space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#4a423b] mb-1.5">
              Nome do Modelo:
            </label>
            <input
              type="text"
              value={activeTemplate.name}
              readOnly
              className="w-full px-3.5 py-2 rounded-xl border border-[#e2dbd2] bg-[#faf8f5] text-xs font-semibold text-[#191414]"
            />
          </div>

          {/* Quick Tag Inserters */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#4a423b] mb-2 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-[#ee4d2d]" />
              <span>Clique para Inserir Tags Dinâmicas:</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {availableTags.map((item) => (
                <button
                  key={item.tag}
                  onClick={() => handleInsertTag(item.tag)}
                  title={item.desc}
                  className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-[#faf8f5] hover:bg-orange-100 hover:text-[#ee4d2d] border border-[#ede8e3] text-[#4a423b] transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3 h-3 text-[#ee4d2d]" />
                  <span>{item.tag}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Text Area */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#4a423b] mb-1.5">
              Conteúdo da Mensagem com Formatação WhatsApp (*negrito*, _itálico_):
            </label>
            <textarea
              value={currentText}
              onChange={(e) => setCurrentText(e.target.value)}
              rows={13}
              className="w-full p-4 rounded-xl border border-[#e2dbd2] focus:ring-2 focus:ring-[#ee4d2d]/30 focus:border-[#ee4d2d] outline-none text-xs sm:text-sm font-sans leading-relaxed bg-[#faf8f5]"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-orange-50/70 border border-orange-200 text-xs text-[#6b635b] flex items-center justify-between">
            <span>
              O robô substitui automaticamente tags como <code>{'{titulo}'}</code> e{' '}
              <code>{'{link}'}</code> pelo link com seu ID de afiliado oficial.
            </span>
          </div>
        </div>

        {/* Live WhatsApp Bubble Preview Column */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8c827a] flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-emerald-600" />
              Visualização no WhatsApp
            </span>
          </div>

          <WhatsAppChatSimulation
            products={sampleProducts}
            customText={currentText}
            showCycleControls={true}
          />
        </div>
      </div>
    </div>
  );
};
