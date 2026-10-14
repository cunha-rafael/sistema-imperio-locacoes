'use client';

import React, { useState } from 'react';
import { 
  Wrench, 
  Users, 
  FileText, 
  DollarSign, 
  Plus, 
  X, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  LayoutDashboard,
  TrendingUp,
  Settings,
  Search,
  Filter,
  Image as ImageIcon,
  ShieldAlert
} from 'lucide-react';

export default function Dashboard() {
  // Estados para modais e visualizações
  const [modalEquipamentoAberto, setModalEquipamentoAberto] = useState(false);
  const [modalNovaLocacaoAberto, setModalNovaLocacaoAberto] = useState(false);
  const [modalConfiguracoesAberto, setModalConfiguracoesAberto] = useState(false);

  // Estados da simulação de Nova Locação com trava de atraso
  const [clienteSelecionado, setClienteSelecionado] = useState('');
  const [equipamentoSelecionadoImg, setEquipamentoSelecionadoImg] = useState('/imagens/betoneira-1.jpg');

  // Galeria de imagens pré-definidas para equipamentos da construção civil
  const galeriaImagens = {
    compactador: [
      { id: 'comp-1', nome: 'Compactador de Solo Sapo', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80' },
      { id: 'comp-2', nome: 'Rolo Compactador Pequeno', url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=300&q=80' }
    ],
    betoneira: [
      { id: 'bet-1', nome: 'Betoneira 400L Amarela', url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=300&q=80' },
      { id: 'bet-2', nome: 'Betoneira Portátil 150L', url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=300&q=80' }
    ]
  };

  const equipamentoExemplo = {
    nome: 'Gerador 7,5 kVA',
    codigo: 'EQ-0075',
    status: 'Disponível',
    unidades: 1,
    comoAlugado: 'Por unidade',
    precios: {
      diaria: '168,00',
      semanal: '546,00',
      quinzenal: '661,00',
      mensal: '900,00'
    },
    statusQuantidades: {
      alugadas: 0,
      reservadas: 0,
      disponiveis: 1,
      total: 1
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f10] text-neutral-100 font-sans flex flex-col md:flex-row">
      
      {/* MENU LATERAL (SIDEBAR) */}
      <aside className="w-full md:w-64 bg-[#141416] border-r border-neutral-800 p-5 flex flex-col justify-between shrink-0">
        <div>
          {/* LOGO IMPÉRIO LOCAÇÕES */}
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-gradient-to-tr from-amber-600 to-yellow-400 p-2.5 rounded-xl text-black font-black text-xl shadow-lg shadow-amber-500/20">
              👑
            </div>
            <div>
              <h1 className="text-lg font-black tracking-wide text-amber-400 leading-tight">IMPÉRIO</h1>
              <p className="text-xs font-bold tracking-widest text-neutral-400">LOCAÇÕES</p>
            </div>
          </div>

          {/* ITENS DO MENU */}
          <nav className="space-y-1">
            <button className="w-full flex items-center gap-3 bg-amber-500/10 text-amber-400 font-semibold px-4 py-3 rounded-xl text-sm border border-amber-500/20">
              <LayoutDashboard size={18} /> Painel
            </button>
            <button className="w-full flex items-center gap-3 text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200 px-4 py-3 rounded-xl text-sm transition-all">
              <Wrench size={18} /> Equipamentos
            </button>
            <button className="w-full flex items-center gap-3 text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200 px-4 py-3 rounded-xl text-sm transition-all">
              <FileText size={18} /> Locações
            </button>
            <button className="w-full flex items-center gap-3 text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200 px-4 py-3 rounded-xl text-sm transition-all">
              <Users size={18} /> Clientes
            </button>
            <button className="w-full flex items-center gap-3 text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200 px-4 py-3 rounded-xl text-sm transition-all">
              <DollarSign size={18} /> Financeiro
            </button>
            <button className="w-full flex items-center gap-3 text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200 px-4 py-3 rounded-xl text-sm transition-all">
              <TrendingUp size={18} /> Relatórios
            </button>
            <button 
              onClick={() => setModalConfiguracoesAberto(true)}
              className="w-full flex items-center gap-3 text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200 px-4 py-3 rounded-xl text-sm transition-all text-left"
            >
              <Settings size={18} /> Configurações
            </button>
          </nav>
        </div>

        <div className="mt-8 pt-4 border-t border-neutral-800/60 hidden md:block">
          <p className="text-xs text-amber-500/80 font-medium italic">
            "Equipamentos que constroem seus projetos!"
          </p>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL DA TELA */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* CABEÇALHO DA PÁGINA */}
        <header className="bg-[#141416] border-b border-neutral-800 px-6 py-4 flex justify-between items-center gap-4">
          <h2 className="text-xl font-bold text-neutral-100 hidden sm:block">Painel de Controle</h2>
          
          <div className="flex items-center gap-3 ml-auto">
            <button 
              onClick={() => setModalNovaLocacaoAberto(true)}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-4 py-2.5 rounded-xl transition-all text-sm shadow-lg shadow-amber-500/10"
            >
              <Plus size={18} /> Nova Locação
            </button>
            <button className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-4 py-2.5 rounded-xl transition-all text-sm border border-neutral-700">
              <Users size={18} /> Clientes
            </button>
          </div>
        </header>

        {/* CONTEÚDO (CARDS E LISTAS) */}
        <main className="p-6 space-y-6 overflow-y-auto">
          
          {/* INDICADORES RÁPIDOS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#141416] border border-neutral-800/80 p-4 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 font-medium">Equipamentos em Campo</p>
                <h3 className="text-2xl font-black text-amber-400 mt-1">12</h3>
              </div>
              <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
                <Clock size={22} />
              </div>
            </div>

            <div className="bg-[#141416] border border-neutral-800/80 p-4 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 font-medium">Disponíveis para Alugar</p>
                <h3 className="text-2xl font-black text-emerald-400 mt-1">28</h3>
              </div>
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
                <CheckCircle2 size={22} />
              </div>
            </div>

            <div className="bg-[#141416] border border-neutral-800/80 p-4 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 font-medium">Contas a Receber</p>
                <h3 className="text-2xl font-black text-neutral-100 mt-1">R$ 14.250</h3>
              </div>
              <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
                <DollarSign size={22} />
              </div>
            </div>

            <div className="bg-[#141416] border border-neutral-800/80 p-4 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 font-medium">Contas a Pagar</p>
                <h3 className="text-2xl font-black text-rose-400 mt-1">R$ 2.100</h3>
              </div>
              <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl">
                <AlertCircle size={22} />
              </div>
            </div>
          </div>

          {/* FROTA DE EQUIPAMENTOS */}
          <section className="bg-[#141416] border border-neutral-800/80 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h3 className="text-base font-bold text-neutral-200 flex items-center gap-2">
                <Wrench size={18} className="text-amber-400" /> Frota de Equipamentos
              </h3>
              
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input 
                    type="text" 
                    placeholder="Buscar equipamento..." 
                    className="w-full bg-[#0f0f10] border border-neutral-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-amber-500/50"
                  />
                </div>
                <button className="bg-[#0f0f10] border border-neutral-800 p-2 rounded-xl text-neutral-400 hover:text-neutral-200">
                  <Filter size={16} />
                </button>
              </div>
            </div>

            {/* GRID DOS CARDS DE EQUIPAMENTO */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* CARD 1: GERADOR 7,5 KVA */}
              <div 
                onClick={() => setModalEquipamentoAberto(true)}
                className="bg-[#0f0f10] border border-neutral-800/80 hover:border-amber-500/60 p-4 rounded-2xl cursor-pointer transition-all hover:scale-[1.01] group relative"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] font-mono text-neutral-500 bg-neutral-800/50 px-2 py-0.5 rounded">EQ-0075</span>
                  <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-emerald-500/20">
                    • Disponível
                  </span>
                </div>

                <h4 className="font-bold text-neutral-100 group-hover:text-amber-400 transition-colors">
                  Gerador 7,5 kVA
                </h4>

                <div className="mt-4 pt-3 border-t border-neutral-800/60 flex justify-between text-xs text-neutral-400">
                  <span>Diária: <strong className="text-neutral-200">R$ 168,00</strong></span>
                  <span>Mensal: <strong className="text-neutral-200">R$ 900,00</strong></span>
                </div>

                <button className="w-full mt-3 bg-neutral-800/60 hover:bg-amber-500 hover:text-black text-neutral-300 font-semibold py-2 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5">
                  Ver detalhes
                </button>
              </div>

              {/* CARD 2: BETONEIRA 400L */}
              <div className="bg-[#0f0f10] border border-neutral-800/80 p-4 rounded-2xl">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] font-mono text-neutral-500 bg-neutral-800/50 px-2 py-0.5 rounded">EQ-0040</span>
                  <span className="bg-amber-500/10 text-amber-400 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-amber-500/20">
                    • Alugado
                  </span>
                </div>

                <h4 className="font-bold text-neutral-100">Betoneira 400L</h4>

                <div className="mt-4 pt-3 border-t border-neutral-800/60 flex justify-between text-xs text-neutral-400">
                  <span>Diária: <strong className="text-neutral-200">R$ 98,00</strong></span>
                  <span>Mensal: <strong className="text-neutral-200">R$ 520,00</strong></span>
                </div>

                <button className="w-full mt-3 bg-neutral-800/40 text-neutral-500 font-semibold py-2 rounded-xl text-xs cursor-not-allowed">
                  Em campo
                </button>
              </div>

              {/* CARD 3: COMPACTADOR DE SOLO */}
              <div className="bg-[#0f0f10] border border-neutral-800/80 p-4 rounded-2xl">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] font-mono text-neutral-500 bg-neutral-800/50 px-2 py-0.5 rounded">EQ-0100</span>
                  <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-emerald-500/20">
                    • Disponível
                  </span>
                </div>

                <h4 className="font-bold text-neutral-100">Compactador de Solo</h4>

                <div className="mt-4 pt-3 border-t border-neutral-800/60 flex justify-between text-xs text-neutral-400">
                  <span>Diária: <strong className="text-neutral-200">R$ 120,00</strong></span>
                  <span>Mensal: <strong className="text-neutral-200">R$ 650,00</strong></span>
                </div>

                <button className="w-full mt-3 bg-neutral-800/60 hover:bg-amber-500 hover:text-black text-neutral-300 font-semibold py-2 rounded-xl text-xs transition-all">
                  Ver detalhes
                </button>
              </div>

            </div>
          </section>

        </main>
      </div>

      {/* MODAL 1: DETALHES DO EQUIPAMENTO */}
      {modalEquipamentoAberto && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-[#141416] border border-neutral-800 text-neutral-100 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-[#18181b]">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                  ◇
                </div>
                <h3 className="font-bold text-neutral-100 text-base">{equipamentoExemplo.nome}</h3>
              </div>
              <button 
                onClick={() => setModalEquipamentoAberto(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="flex justify-between items-center pb-3 border-b border-neutral-800/80">
                <div>
                  <p className="text-neutral-400 text-[11px]">Equipamento</p>
                  <p className="font-bold text-neutral-100 text-sm mt-0.5">
                    {equipamentoExemplo.codigo} · {equipamentoExemplo.nome}
                  </p>
                </div>
                <span className="bg-emerald-500/10 text-emerald-400 text-xs px-3 py-1 rounded-full font-semibold border border-emerald-500/20">
                  • {equipamentoExemplo.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-neutral-800/80">
                <div>
                  <p className="text-neutral-400 text-[11px]">Unidades</p>
                  <p className="font-bold text-neutral-100 text-sm mt-0.5">{equipamentoExemplo.unidades}</p>
                </div>
                <div>
                  <p className="text-neutral-400 text-[11px]">Como é alugado</p>
                  <p className="font-bold text-neutral-100 text-sm mt-0.5">{equipamentoExemplo.comoAlugado}</p>
                </div>
              </div>

              <div>
                <p className="text-[11px] font-bold text-neutral-400 tracking-wider uppercase mb-2">TABELA DE PREÇOS</p>
                <div className="bg-[#0f0f10] border border-neutral-800/80 rounded-xl p-3 space-y-2">
                  <div className="flex justify-between text-neutral-400">
                    <span>Diária</span>
                    <strong className="text-amber-400 font-mono">R$ {equipamentoExemplo.precios.diaria}</strong>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Semanal</span>
                    <strong className="text-amber-400 font-mono">R$ {equipamentoExemplo.precios.semanal}</strong>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Quinzenal</span>
                    <strong className="text-amber-400 font-mono">R$ {equipamentoExemplo.precios.quinzenal}</strong>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Mensal</span>
                    <strong className="text-amber-400 font-mono">R$ {equipamentoExemplo.precios.mensal}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: NOVA LOCAÇÃO (COM ALERTA DE CLIENTE EM ATRASO E GALERIA DE FOTOS) */}
      {modalNovaLocacaoAberto && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-[#141416] border border-neutral-800 text-neutral-100 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-[#18181b]">
              <h3 className="font-bold text-neutral-100 text-base flex items-center gap-2">
                <Plus size={18} className="text-amber-400" /> Nova Locação de Equipamento
              </h3>
              <button 
                onClick={() => setModalNovaLocacaoAberto(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              {/* SELEÇÃO DE CLIENTE */}
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Selecione o Cliente</label>
                <select 
                  value={clienteSelecionado}
                  onChange={(e) => setClienteSelecionado(e.target.value)}
                  className="w-full bg-[#0f0f10] border border-neutral-800 rounded-xl p-2.5 text-neutral-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="">-- Selecione o cliente --</option>
                  <option value="em_dia">Construtora Silva (Status: Em Dia 🟢)</option>
                  <option value="em_atraso">Mendes Engenharia (Status: EM ATRASO 🔴)</option>
                </select>
              </div>

              {/* AVISO / TRAVA DE CLIENTE EM ATRASO */}
              {clienteSelecionado === 'em_atraso' && (
                <div className="bg-rose-500/10 border border-rose-500/30 p-3.5 rounded-xl flex items-start gap-3 text-rose-300">
                  <ShieldAlert size={22} className="shrink-0 text-rose-400 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-rose-400 text-sm">CLIENTE EM ATRASO DETECTADO!</h4>
                    <p className="text-[11px] text-rose-300/80 mt-0.5">
                      Este cliente possui 2 faturas vencidas. O sistema recomenda a regularização antes de emitir um novo contrato de locação.
                    </p>
                  </div>
                </div>
              )}

              {/* GALERIA DE FOTOS PRÉ-DEFINIDAS */}
              <div>
                <label className="block text-neutral-300 font-semibold mb-1 flex items-center gap-1.5">
                  <ImageIcon size={14} className="text-amber-400" /> Selecionar Imagem Pré-definida
                </label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {galeriaImagens.compactador.map((img) => (
                    <div 
                      key={img.id}
                      onClick={() => setEquipamentoSelecionadoImg(img.url)}
                      className={`border rounded-xl p-2 cursor-pointer transition-all flex items-center gap-2 ${
                        equipamentoSelecionadoImg === img.url 
                          ? 'border-amber-500 bg-amber-500/10' 
                          : 'border-neutral-800 bg-[#0f0f10] hover:border-neutral-700'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-neutral-800 overflow-hidden shrink-0">
                        <img src={img.url} alt={img.nome} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[11px] text-neutral-300 leading-tight">{img.nome}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-800 flex justify-end gap-2">
                <button 
                  onClick={() => setModalNovaLocacaoAberto(false)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl font-semibold"
                >
                  Cancelar
                </button>
                <button 
                  disabled={clienteSelecionado === 'em_atraso'}
                  className={`px-4 py-2 rounded-xl font-bold transition-all ${
                    clienteSelecionado === 'em_atraso'
                      ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                      : 'bg-amber-500 hover:bg-amber-400 text-black'
                  }`}
                >
                  Confirmar Locação
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: CONFIGURAÇÕES (ENGRENAGEM) */}
      {modalConfiguracoesAberto && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-[#141416] border border-neutral-800 text-neutral-100 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-[#18181b]">
              <h3 className="font-bold text-neutral-100 text-base flex items-center gap-2">
                <Settings size={18} className="text-amber-400" /> Configurações do Sistema
              </h3>
              <button 
                onClick={() => setModalConfiguracoesAberto(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Aviso de Vencimento de Faturas</label>
                <select className="w-full bg-[#0f0f10] border border-neutral-800 rounded-xl p-2.5 text-neutral-200">
                  <option>Avisar 3 dias antes</option>
                  <option>Avisar 5 dias antes</option>
                  <option>Avisar no dia do vencimento</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Taxa Diária de Multa por Atraso (%)</label>
                <input 
                  type="text" 
                  defaultValue="2.0%" 
                  className="w-full bg-[#0f0f10] border border-neutral-800 rounded-xl p-2.5 text-neutral-200"
                />
              </div>

              <div className="pt-3 border-t border-neutral-800 flex justify-end">
                <button 
                  onClick={() => setModalConfiguracoesAberto(false)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black rounded-xl font-bold"
                >
                  Salvar Preferências
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}