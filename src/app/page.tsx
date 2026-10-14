'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
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
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  Check,
  AlertTriangle
} from 'lucide-react';

export default function Dashboard() {
  const [modalEquipamentoAberto, setModalEquipamentoAberto] = useState(false);
  const [modalNovaLocacaoAberto, setModalNovaLocacaoAberto] = useState(false);
  const [modalConfiguracoesAberto, setModalConfiguracoesAberto] = useState(false);

  // Estados do Banco de Dados
  const [equipamentos, setEquipamentos] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [equipamentoSelecionado, setEquipamentoSelecionado] = useState<any>(null);

  // Estados do Wizard de Nova Locação
  const [etapaLocacao, setEtapaLocacao] = useState(1);
  const [clienteId, setClienteId] = useState('');
  const [clienteObj, setClienteObj] = useState<any>(null);
  const [liberacaoExcecao, setLiberacaoExcecao] = useState(false);
  
  const [equipamentoId, setEquipamentoId] = useState('');
  const [equipamentoObj, setEquipamentoObj] = useState<any>(null);
  
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [totalDias, setTotalDias] = useState(1);
  const [valorTotal, setValorTotal] = useState(0);

  // Buscar dados no Supabase
  const carregarDados = async () => {
    const { data: dadosEquipamentos } = await supabase.from('equipamentos').select('*');
    if (dadosEquipamentos) setEquipamentos(dadosEquipamentos);

    const { data: dadosClientes } = await supabase.from('clientes').select('*');
    if (dadosClientes) setClientes(dadosClientes);
  };

  // Realtime Supabase
  useEffect(() => {
    carregarDados();
    const canal = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => carregarDados())
      .subscribe();

    return () => {
      supabase.removeChannel(canal);
    };
  }, []);

  // Sincronizar cliente
  useEffect(() => {
    if (clienteId && clientes.length > 0) {
      setClienteObj(clientes.find((c) => c.id === clienteId) || null);
    }
  }, [clientes, clienteId]);

  // Sincronizar equipamento
  useEffect(() => {
    if (equipamentoId && equipamentos.length > 0) {
      setEquipamentoObj(equipamentos.find((e) => e.id === equipamentoId) || null);
    }
  }, [equipamentos, equipamentoId]);

  // Cálculo Automático: Diária x Quantidade de Dias
  useEffect(() => {
    if (dataInicio && dataFim && equipamentoObj?.diaria) {
      const dtInicio = new Date(dataInicio);
      const dtFim = new Date(dataFim);
      const diferencaTempo = dtFim.getTime() - dtInicio.getTime();
      const calculoDias = Math.ceil(diferencaTempo / (1000 * 3600 * 24));
      const diasFinal = calculoDias > 0 ? calculoDias : 1;
      const valorDiaria = Number(equipamentoObj.diaria) || 0;

      setTotalDias(diasFinal);
      setValorTotal(diasFinal * valorDiaria);
    } else if (equipamentoObj?.diaria) {
      setTotalDias(1);
      setValorTotal(Number(equipamentoObj.diaria) || 0);
    }
  }, [dataInicio, dataFim, equipamentoObj]);

  const fecharModalLocacao = () => {
    setModalNovaLocacaoAberto(false);
    setEtapaLocacao(1);
    setClienteId('');
    setClienteObj(null);
    setLiberacaoExcecao(false);
    setEquipamentoId('');
    setEquipamentoObj(null);
    setDataInicio('');
    setDataFim('');
    setTotalDias(1);
    setValorTotal(0);
  };

  const handleSelectCliente = (id: string) => {
    setClienteId(id);
    setLiberacaoExcecao(false);
    setClienteObj(clientes.find((c) => c.id === id) || null);
  };

  const confirmarLocacao = async () => {
    if (!clienteId || !equipamentoId) return;

    const { error } = await supabase.from('locacoes').insert([
      {
        cliente_id: clienteId,
        equipamento_id: equipamentoId,
        data_inicio: dataInicio || new Date().toISOString(),
        data_fim: dataFim || new Date().toISOString(),
        valor_total: valorTotal,
        status: 'Ativa',
        observacoes: liberacaoExcecao ? 'Locação autorizada com liberação de exceção' : null
      }
    ]);

    if (!error) {
      await supabase.from('equipamentos').update({ status: 'Alugado' }).eq('id', equipamentoId);
      fecharModalLocacao();
    } else {
      alert('Erro ao gravar locação: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f10] text-neutral-100 font-sans flex flex-col md:flex-row">
      {/* MENU LATERAL */}
      <aside className="w-full md:w-64 bg-[#141416] border-r border-neutral-800 p-5 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-gradient-to-tr from-amber-600 to-yellow-400 p-2.5 rounded-xl text-black font-black text-xl shadow-lg shadow-amber-500/20">👑</div>
            <div>
              <h1 className="text-lg font-black tracking-wide text-amber-400 leading-tight">IMPÉRIO</h1>
              <p className="text-xs font-bold tracking-widest text-neutral-400">LOCAÇÕES</p>
            </div>
          </div>
          <nav className="space-y-1">
            <button className="w-full flex items-center gap-3 bg-amber-500/10 text-amber-400 font-semibold px-4 py-3 rounded-xl text-sm border border-amber-500/20"><LayoutDashboard size={18} /> Painel</button>
            <button className="w-full flex items-center gap-3 text-neutral-400 hover:bg-neutral-800/50 px-4 py-3 rounded-xl text-sm"><Wrench size={18} /> Equipamentos</button>
            <button className="w-full flex items-center gap-3 text-neutral-400 hover:bg-neutral-800/50 px-4 py-3 rounded-xl text-sm"><FileText size={18} /> Locações</button>
            <button className="w-full flex items-center gap-3 text-neutral-400 hover:bg-neutral-800/50 px-4 py-3 rounded-xl text-sm"><Users size={18} /> Clientes</button>
            <button className="w-full flex items-center gap-3 text-neutral-400 hover:bg-neutral-800/50 px-4 py-3 rounded-xl text-sm"><DollarSign size={18} /> Financeiro</button>
            <button className="w-full flex items-center gap-3 text-neutral-400 hover:bg-neutral-800/50 px-4 py-3 rounded-xl text-sm"><TrendingUp size={18} /> Relatórios</button>
            <button onClick={() => setModalConfiguracoesAberto(true)} className="w-full flex items-center gap-3 text-neutral-400 hover:bg-neutral-800/50 px-4 py-3 rounded-xl text-sm text-left"><Settings size={18} /> Configurações</button>
          </nav>
        </div>
      </aside>

      {/* PAINEL PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-[#141416] border-b border-neutral-800 px-6 py-4 flex justify-between items-center gap-4">
          <h2 className="text-xl font-bold text-neutral-100 hidden sm:block">Painel de Controle</h2>
          <div className="flex items-center gap-3 ml-auto">
            <button onClick={() => setModalNovaLocacaoAberto(true)} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-4 py-2.5 rounded-xl text-sm shadow-lg shadow-amber-500/10">
              <Plus size={18} /> Nova Locação
            </button>
          </div>
        </header>

        <main className="p-6 space-y-6 overflow-y-auto">
          {/* INDICADORES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#141416] border border-neutral-800/80 p-4 rounded-2xl flex items-center justify-between">
              <div><p className="text-xs text-neutral-400 font-medium">Em Campo</p><h3 className="text-2xl font-black text-amber-400 mt-1">{equipamentos.filter(e => e.status === 'Alugado').length}</h3></div>
              <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl"><Clock size={22} /></div>
            </div>
            <div className="bg-[#141416] border border-neutral-800/80 p-4 rounded-2xl flex items-center justify-between">
              <div><p className="text-xs text-neutral-400 font-medium">Disponíveis</p><h3 className="text-2xl font-black text-emerald-400 mt-1">{equipamentos.filter(e => e.status === 'Disponível').length}</h3></div>
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl"><CheckCircle2 size={22} /></div>
            </div>
            <div className="bg-[#141416] border border-neutral-800/80 p-4 rounded-2xl flex items-center justify-between">
              <div><p className="text-xs text-neutral-400 font-medium">A Receber</p><h3 className="text-2xl font-black text-neutral-100 mt-1">R$ 14.250</h3></div>
              <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl"><DollarSign size={22} /></div>
            </div>
            <div className="bg-[#141416] border border-neutral-800/80 p-4 rounded-2xl flex items-center justify-between">
              <div><p className="text-xs text-neutral-400 font-medium">A Pagar</p><h3 className="text-2xl font-black text-rose-400 mt-1">R$ 2.100</h3></div>
              <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl"><AlertCircle size={22} /></div>
            </div>
          </div>

          {/* FROTA */}
          <section className="bg-[#141416] border border-neutral-800/80 rounded-2xl p-6">
            <h3 className="text-base font-bold text-neutral-200 mb-6 flex items-center gap-2">
              <Wrench size={18} className="text-amber-400" /> Frota de Equipamentos ({equipamentos.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {equipamentos.map((item) => (
                <div key={item.id} onClick={() => { setEquipamentoSelecionado(item); setModalEquipamentoAberto(true); }} className="bg-[#0f0f10] border border-neutral-800/80 hover:border-amber-500/60 p-4 rounded-2xl cursor-pointer">
                  <div className="flex justify-between mb-3">
                    <span className="text-[10px] font-mono text-neutral-500 bg-neutral-800/50 px-2 py-0.5 rounded">{item.codigo}</span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${item.status === 'Disponível' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>• {item.status}</span>
                  </div>
                  <h4 className="font-bold text-neutral-100">{item.nome}</h4>
                  <div className="mt-4 pt-3 border-t border-neutral-800/60 flex justify-between text-xs text-neutral-400">
                    <span>Diária: <strong className="text-neutral-200">R$ {item.diaria}</strong></span>
                    <span>Mensal: <strong className="text-neutral-200">R$ {item.mensal}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>

      {/* MODAL NOVA LOCAÇÃO (PASSO A PASSO) */}
      {modalNovaLocacaoAberto && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-[#141416] border border-neutral-800 text-neutral-100 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-[#18181b]">
              <h3 className="font-bold text-base flex items-center gap-2"><Plus size={18} className="text-amber-400" /> Nova Locação</h3>
              <button onClick={fecharModalLocacao} className="p-1.5 text-neutral-400 hover:text-neutral-100"><X size={18} /></button>
            </div>

            <div className="bg-[#0f0f10] border-b border-neutral-800 px-6 py-3 flex justify-between text-xs">
              <span className={etapaLocacao >= 1 ? 'text-amber-400 font-bold' : 'text-neutral-500'}>1. Cliente</span>
              <span className={etapaLocacao >= 2 ? 'text-amber-400 font-bold' : 'text-neutral-500'}>2. Equipamento</span>
              <span className={etapaLocacao >= 3 ? 'text-amber-400 font-bold' : 'text-neutral-500'}>3. Período</span>
            </div>

            <div className="p-6 space-y-4 text-xs min-h-[300px] flex flex-col justify-between">
              {etapaLocacao === 1 && (
                <div className="space-y-4">
                  <label className="block text-neutral-300 font-semibold mb-2">Selecione o Cliente</label>
                  <select value={clienteId} onChange={(e) => handleSelectCliente(e.target.value)} className="w-full bg-[#0f0f10] border border-neutral-800 rounded-xl p-3 text-neutral-200 focus:outline-none focus:border-amber-500 text-sm">
                    <option value="">-- Clique para escolher --</option>
                    {clientes.map(cli => (<option key={cli.id} value={cli.id}>{cli.nome} (Status: {cli.status})</option>))}
                  </select>

                  {clienteObj?.status === 'Em Atraso' && (
                    <div className="bg-rose-500/10 border border-rose-500/30 p-4 rounded-xl space-y-3">
                      <div className="flex items-start gap-3 text-rose-300">
                        <ShieldAlert size={22} className="shrink-0 text-rose-400 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-rose-400 text-sm">CLIENTE EM ATRASO DETECTADO!</h4>
                          <p className="text-xs text-rose-300/80 mt-1">Este cliente possui pendências financeiras. Deseja cancelar ou prosseguir mesmo assim?</p>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-rose-500/20 flex gap-2 justify-end">
                        <button onClick={fecharModalLocacao} className="px-3.5 py-1.5 bg-neutral-800 text-neutral-300 rounded-lg">Cancelar</button>
                        <button onClick={() => { setLiberacaoExcecao(true); setEtapaLocacao(2); }} className="px-3.5 py-1.5 bg-rose-500 text-black font-bold rounded-lg flex items-center gap-1.5"><AlertTriangle size={14} /> Prosseguir Mesmo Assim</button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {etapaLocacao === 2 && (
                <div className="space-y-3">
                  <label className="block text-neutral-300 font-semibold">Escolha o Equipamento Disponível</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-56 overflow-y-auto">
                    {equipamentos.filter(e => e.status === 'Disponível').map((eq) => (
                      <div key={eq.id} onClick={() => { setEquipamentoId(eq.id); setEquipamentoObj(eq); }} className={`p-3 rounded-xl border cursor-pointer ${equipamentoId === eq.id ? 'border-amber-500 bg-amber-500/10' : 'border-neutral-800 bg-[#0f0f10]'}`}>
                        <div className="flex justify-between"><span className="text-[10px] text-amber-400 font-mono">{eq.codigo}</span>{equipamentoId === eq.id && <Check size={14} className="text-amber-400" />}</div>
                        <h4 className="font-bold text-neutral-200 mt-1">{eq.nome}</h4>
                        <p className="text-[11px] text-neutral-400 mt-2">Diária: <strong className="text-neutral-200">R$ {eq.diaria}</strong></p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {etapaLocacao === 3 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-neutral-400 mb-1">Data Início</label>
                      <input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} className="w-full bg-[#0f0f10] border border-neutral-800 rounded-xl p-2.5 text-neutral-200" />
                    </div>
                    <div>
                      <label className="block text-neutral-400 mb-1">Data Devolução</label>
                      <input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} className="w-full bg-[#0f0f10] border border-neutral-800 rounded-xl p-2.5 text-neutral-200" />
                    </div>
                  </div>

                  <div className="bg-[#0f0f10] border border-neutral-800 p-4 rounded-xl space-y-2">
                    <h4 className="font-bold text-amber-400 text-xs uppercase">Resumo da Locação</h4>
                    <div className="flex justify-between text-neutral-300"><span>Cliente:</span><strong>{clienteObj?.nome} {liberacaoExcecao && '(Exceção)'}</strong></div>
                    <div className="flex justify-between text-neutral-300"><span>Equipamento:</span><strong>{equipamentoObj?.nome}</strong></div>
                    <div className="flex justify-between text-neutral-300 pt-2 border-t border-neutral-800/60"><span>Período:</span><strong className="text-amber-400">{totalDias} {totalDias === 1 ? 'diária' : 'diárias'}</strong></div>
                    <div className="flex justify-between text-neutral-300"><span>Diária:</span><strong>R$ {equipamentoObj?.diaria}</strong></div>
                    <div className="flex justify-between items-center pt-3 border-t border-neutral-800 text-sm font-bold">
                      <span>TOTAL ESTIMADO:</span>
                      <span className="text-amber-400 text-lg font-black">R$ {valorTotal.toLocaleString('pt-BR')}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-neutral-800 flex justify-between items-center mt-auto">
                {etapaLocacao > 1 ? (<button onClick={() => setEtapaLocacao(etapaLocacao - 1)} className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded-xl flex items-center gap-1"><ArrowLeft size={16} /> Voltar</button>) : <div />}
                {etapaLocacao < 3 ? (
                  <button disabled={!clienteId || (clienteObj?.status === 'Em Atraso' && !liberacaoExcecao) || (etapaLocacao === 2 && !equipamentoId)} onClick={() => setEtapaLocacao(etapaLocacao + 1)} className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl flex items-center gap-1">Avançar <ArrowRight size={16} /></button>
                ) : (
                  <button onClick={confirmarLocacao} className="px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl flex items-center gap-1">Emitir Contrato <Check size={16} /></button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DETALHES EQUIPAMENTO */}
      {modalEquipamentoAberto && equipamentoSelecionado && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-[#141416] border border-neutral-800 text-neutral-100 w-full max-w-md rounded-2xl shadow-2xl p-5 space-y-4 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
              <h3 className="font-bold text-sm">{equipamentoSelecionado.nome}</h3>
              <button onClick={() => setModalEquipamentoAberto(false)}><X size={18} /></button>
            </div>
            <div className="bg-[#0f0f10] p-3 rounded-xl space-y-2">
              <div className="flex justify-between"><span>Diária</span><strong className="text-amber-400">R$ {equipamentoSelecionado.diaria}</strong></div>
              <div className="flex justify-between"><span>Semanal</span><strong className="text-amber-400">R$ {equipamentoSelecionado.semanal}</strong></div>
              <div className="flex justify-between"><span>Quinzenal</span><strong className="text-amber-400">R$ {equipamentoSelecionado.quinzenal}</strong></div>
              <div className="flex justify-between"><span>Mensal</span><strong className="text-amber-400">R$ {equipamentoSelecionado.mensal}</strong></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}