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
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  Tag,
  Info,
  Truck,
  MapPin,
  RefreshCw,
  CreditCard,
  Printer,
  Eye,
  Edit3,
  Ban,
  Calendar,
  Trash2,
  Save,
  ShoppingCart,
  Search,
  UserPlus,
  User,
  Image as ImageIcon,
  Upload
} from 'lucide-react';

// FUNÇÃO PARA IMAGEM PADRÃO INTELIGENTE BASEADA NO NOME DO EQUIPAMENTO
function obterImagemPadraoEquipamento(nome: string, urlOriginal?: string): string {
  if (urlOriginal && urlOriginal.trim() !== '') return urlOriginal;

  const nomeMinusculo = (nome || '').toLowerCase();

  if (nomeMinusculo.includes('martelete') || nomeMinusculo.includes('rompedor') || nomeMinusculo.includes('demolidor')) {
    return 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80';
  }
  if (nomeMinusculo.includes('betoneira') || nomeMinusculo.includes('misturador')) {
    return 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=600&q=80';
  }
  if (nomeMinusculo.includes('gerador') || nomeMinusculo.includes('energia')) {
    return 'https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=600&q=80';
  }
  if (nomeMinusculo.includes('compactador') || nomeMinusculo.includes('sapo') || nomeMinusculo.includes('solo')) {
    return 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80';
  }
  if (nomeMinusculo.includes('furadeira') || nomeMinusculo.includes('parafusadeira')) {
    return 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80';
  }
  if (nomeMinusculo.includes('serra') || nomeMinusculo.includes('marmore') || nomeMinusculo.includes('corte')) {
    return 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=600&q=80';
  }
  if (nomeMinusculo.includes('lavadora') || nomeMinusculo.includes('pressao')) {
    return 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=600&q=80';
  }

  return 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80';
}

// VALIDAÇÃO MATEMÁTICA DE CPF
function validarCPF(cpf: string): boolean {
  const limpo = cpf.replace(/\D/g, '');
  if (limpo.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(limpo)) return false;

  let soma = 0;
  let resto: number;

  for (let i = 1; i <= 9; i++) soma += parseInt(limpo.substring(i - 1, i)) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(limpo.substring(9, 10))) return false;

  soma = 0;
  for (let i = 1; i <= 10; i++) soma += parseInt(limpo.substring(i - 1, i)) * (12 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(limpo.substring(10, 11))) return false;

  return true;
}

// VALIDAÇÃO MATEMÁTICA DE CNPJ
function validarCNPJ(cnpj: string): boolean {
  const limpo = cnpj.replace(/\D/g, '');
  if (limpo.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(limpo)) return false;

  let tamanho = limpo.length - 2;
  let numeros = limpo.substring(0, tamanho);
  const digitos = limpo.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(0))) return false;

  tamanho = tamanho + 1;
  numeros = limpo.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(1))) return false;

  return true;
}

function validarCpfCnpj(documento: string): { valido: boolean; tipo: 'CPF' | 'CNPJ' | 'Invalido' } {
  const limpo = documento.replace(/\D/g, '');
  if (!limpo) return { valido: true, tipo: 'Invalido' };

  if (limpo.length <= 11) {
    return { valido: validarCPF(limpo), tipo: 'CPF' };
  } else if (limpo.length <= 14) {
    return { valido: validarCNPJ(limpo), tipo: 'CNPJ' };
  }
  return { valido: false, tipo: 'Invalido' };
}

export default function Dashboard() {
  const [modalEquipamentoAberto, setModalEquipamentoAberto] = useState(false);
  const [modalCadastroEquipamentoAberto, setModalCadastroEquipamentoAberto] = useState(false);
  const [modalNovaLocacaoAberto, setModalNovaLocacaoAberto] = useState(false);
  const [modalEmCampoAberto, setModalEmCampoAberto] = useState(false);
  const [modalDetalhesLocacaoAberto, setModalDetalhesLocacaoAberto] = useState(false);
  const [modalConfiguracoesAberto, setModalConfiguracoesAberto] = useState(false);
  const [modalContratoPreviaAberto, setModalContratoPreviaAberto] = useState(false);

  // Modais de Clientes (CRUD)
  const [modalClientesAberto, setModalClientesAberto] = useState(false);
  const [modalCadastroClienteAberto, setModalCadastroClienteAberto] = useState(false);

  // Estados do Banco de Dados
  const [equipamentos, setEquipamentos] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [locacoes, setLocacoes] = useState<any[]>([]);
  
  const [equipamentoSelecionado, setEquipamentoSelecionado] = useState<any>(null);
  const [locacaoSelecionada, setLocacaoSelecionada] = useState<any>(null);

  // Form de Equipamento (Novo / Edição)
  const [eqIdEdicao, setEqIdEdicao] = useState<string | null>(null);
  const [eqNome, setEqNome] = useState('');
  const [eqCodigo, setEqCodigo] = useState('');
  const [eqPatrimonio, setEqPatrimonio] = useState('');
  const [eqFotoUrl, setEqFotoUrl] = useState('');
  const [eqValorIndenizacao, setEqValorIndenizacao] = useState<number | ''>('');
  const [eqObservacoes, setEqObservacoes] = useState('');

  // Tarifas do Equipamento
  const [eqDiaria, setEqDiaria] = useState<number | ''>('');
  const [eqSemanal, setEqSemanal] = useState<number | ''>('');
  const [eqQuinzenal, setEqQuinzenal] = useState<number | ''>('');
  const [eqMensal, setEqMensal] = useState<number | ''>('');
  const [eqTrimestral, setEqTrimestral] = useState<number | ''>('');
  const [eqAnual, setEqAnual] = useState<number | ''>('');

  // Visibilidade de Tarifas
  const [temSemanal, setTemSemanal] = useState(true);
  const [temQuinzenal, setTemQuinzenal] = useState(true);
  const [temMensal, setTemMensal] = useState(true);
  const [temTrimestral, setTemTrimestral] = useState(true);
  const [temAnual, setTemAnual] = useState(true);

  // Form de Cliente (Novo / Edição)
  const [cliIdEdicao, setCliIdEdicao] = useState<string | null>(null);
  const [cliNome, setCliNome] = useState('');
  const [cliCpfCnpj, setCliCpfCnpj] = useState('');
  const [cliTelefone, setCliTelefone] = useState('');
  const [cliEndereco, setCliEndereco] = useState('');
  const [cliStatus, setCliStatus] = useState<'Ativo' | 'Em Atraso' | 'Bloqueado'>('Ativo');
  const [buscaCliente, setBuscaCliente] = useState('');

  // Estados do Wizard de Nova Locação / Renovação
  const [etapaLocacao, setEtapaLocacao] = useState(1);
  const [clienteId, setClienteId] = useState('');
  const [clienteObj, setClienteObj] = useState<any>(null);
  const [liberacaoExcecao, setLiberacaoExcecao] = useState(false);
  
  // HOJE EM FORMATO YYYY-MM-DD
  const hojeDataFormatada = new Date().toISOString().split('T')[0];

  // CARRINHO DE ITENS DA LOCAÇÃO
  const [itensLocacao, setItensLocacao] = useState<Array<{
    equipamento: any;
    quantidade: number;
    modalidade: 'diaria' | 'semanal' | 'quinzenal' | 'mensal' | 'trimestral' | 'anual';
    dataInicio: string;
    dataFim: string;
    diasDiaria: number;
  }>>([]);

  // Logística
  const [enderecoEntrega, setEnderecoEntrega] = useState('');
  const [pontoReferencia, setPontoReferencia] = useState('');
  const [responsavelRecebimento, setResponsavelRecebimento] = useState('');

  // Financeiro
  const [observacaoPagamento, setObservacaoPagamento] = useState('A combinar');
  const [desconto, setDesconto] = useState<number>(0);
  const [frete, setFrete] = useState<number>(0);
  const [statusPagamento, setStatusPagamento] = useState<'Pago' | 'Pendente'>('Pendente');
  
  const [subtotal, setSubtotal] = useState<number>(0);
  const [valorTotal, setValorTotal] = useState<number>(0);
  
  const [locacaoOrigemId, setLocacaoOrigemId] = useState<string | null>(null);

  // PROCESSAR UPLOAD DE IMAGEM DO COMPUTADOR
  const handleUploadFotoComputador = (e: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;

    if (arquivo.size > 5 * 1024 * 1024) {
      alert('A imagem selecionada é muito grande! Por favor, escolha uma imagem de até 5MB.');
      return;
    }

    const leitor = new FileReader();
    leitor.onloadend = () => {
      setEqFotoUrl(leitor.result as string);
    };
    leitor.readAsDataURL(arquivo);
  };

  // Buscar dados no Supabase
  const carregarDados = async () => {
    const { data: dadosEquipamentos } = await supabase.from('equipamentos').select('*').order('created_at', { ascending: false });
    if (dadosEquipamentos) setEquipamentos(dadosEquipamentos);

    const { data: dadosClientes } = await supabase.from('clientes').select('*').order('created_at', { ascending: false });
    if (dadosClientes) setClientes(dadosClientes);

    const { data: dadosLocacoes } = await supabase.from('locacoes').select('*, clientes(*), equipamentos(*)');
    if (dadosLocacoes) setLocacoes(dadosLocacoes);
  };

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

  useEffect(() => {
    if (clienteId && clientes.length > 0) {
      setClienteObj(clientes.find((c) => c.id === clienteId) || null);
    }
  }, [clientes, clienteId]);

  const adicionarDiasAData = (dataStr: string, dias: number) => {
    if (!dataStr) return hojeDataFormatada;
    const [ano, mes, dia] = dataStr.split('-').map(Number);
    const data = new Date(ano, mes - 1, dia);
    data.setDate(data.getDate() + (dias > 0 ? dias : 0));
    return data.toISOString().split('T')[0];
  };

  const calcularDiasEntreDatas = (inicio: string, fim: string) => {
    if (!inicio || !fim) return 1;
    const [a1, m1, d1] = inicio.split('-').map(Number);
    const [a2, m2, d2] = fim.split('-').map(Number);
    const dtInicio = new Date(a1, m1 - 1, d1);
    const dtFim = new Date(a2, m2 - 1, d2);
    const diferencaTempo = dtFim.getTime() - dtInicio.getTime();
    const dias = Math.ceil(diferencaTempo / (1000 * 3600 * 24));
    return dias >= 0 ? dias : 1;
  };

  useEffect(() => {
    if (itensLocacao.length === 0) {
      setSubtotal(0);
      setValorTotal(0);
      return;
    }

    let somaSubtotal = 0;

    itensLocacao.forEach(item => {
      const eq = item.equipamento;
      if (!eq) return;

      const mod = item.modalidade || 'diaria';
      const valDiaria = Number(eq.diaria) || 0;
      const valSemanal = Number(eq.semanal) || valDiaria * 7;
      const valQuinzenal = Number(eq.quinzenal) || valDiaria * 15;
      const valMensal = Number(eq.mensal) || valDiaria * 30;
      const valTrimestral = Number(eq.trimestral) || valMensal * 3;
      const valAnual = Number(eq.anual) || valMensal * 12;

      let valorUnitarioItem = 0;

      if (mod === 'diaria') {
        const dias = item.diasDiaria > 0 ? item.diasDiaria : 1;
        valorUnitarioItem = valDiaria * dias;
      } else if (mod === 'semanal') valorUnitarioItem = valSemanal;
      else if (mod === 'quinzenal') valorUnitarioItem = valQuinzenal;
      else if (mod === 'mensal') valorUnitarioItem = valMensal;
      else if (mod === 'trimestral') valorUnitarioItem = valTrimestral;
      else if (mod === 'anual') valorUnitarioItem = valAnual;

      somaSubtotal += valorUnitarioItem * item.quantidade;
    });

    setSubtotal(somaSubtotal);
    const desc = Number(desconto) || 0;
    const frt = Number(frete) || 0;
    const totalComDescontoEFrete = (somaSubtotal - desc) + frt;
    setValorTotal(totalComDescontoEFrete > 0 ? totalComDescontoEFrete : 0);
  }, [itensLocacao, desconto, frete]);

  const adicionarAoCarrinho = (eq: any) => {
    setItensLocacao(prev => {
      const existe = prev.find(i => i.equipamento.id === eq.id);
      if (existe) {
        return prev.map(i => i.equipamento.id === eq.id ? { ...i, quantidade: i.quantidade + 1 } : i);
      }
      return [...prev, { 
        equipamento: eq, 
        quantidade: 1, 
        modalidade: 'diaria',
        dataInicio: hojeDataFormatada,
        dataFim: adicionarDiasAData(hojeDataFormatada, 1),
        diasDiaria: 1
      }];
    });
  };

  const alterarModalidadeItem = (eqId: string, modalidade: any) => {
    setItensLocacao(prev => prev.map(i => {
      if (i.equipamento.id !== eqId) return i;
      let dias = i.diasDiaria;
      if (modalidade === 'semanal') dias = 7;
      else if (modalidade === 'quinzenal') dias = 15;
      else if (modalidade === 'mensal') dias = 30;
      else if (modalidade === 'trimestral') dias = 90;
      else if (modalidade === 'anual') dias = 365;
      else if (modalidade === 'diaria') dias = i.diasDiaria > 0 ? i.diasDiaria : 1;

      const novaDataFim = adicionarDiasAData(i.dataInicio, dias);

      return { ...i, modalidade, diasDiaria: dias, dataFim: novaDataFim };
    }));
  };

  const alterarDiasDiariaDirect = (eqId: string, diasDiaria: number) => {
    const diasLimpos = diasDiaria > 0 ? diasDiaria : 1;
    setItensLocacao(prev => prev.map(i => {
      if (i.equipamento.id !== eqId) return i;
      const novaDataFim = adicionarDiasAData(i.dataInicio, diasLimpos);
      return { ...i, diasDiaria: diasLimpos, dataFim: novaDataFim };
    }));
  };

  const alterarDataInicioItem = (eqId: string, novaDataInicio: string) => {
    setItensLocacao(prev => prev.map(i => {
      if (i.equipamento.id !== eqId) return i;
      const novaDataFim = adicionarDiasAData(novaDataInicio, i.diasDiaria);
      return { ...i, dataInicio: novaDataInicio, dataFim: novaDataFim };
    }));
  };

  const alterarDataFimItem = (eqId: string, novaDataFim: string) => {
    setItensLocacao(prev => prev.map(i => {
      if (i.equipamento.id !== eqId) return i;
      const novosDias = calcularDiasEntreDatas(i.dataInicio, novaDataFim);
      return { ...i, dataFim: novaDataFim, diasDiaria: novosDias };
    }));
  };

  const alterarQuantidadeCarrinho = (eqId: string, quantidade: number) => {
    if (quantidade <= 0) {
      removerDoCarrinho(eqId);
      return;
    }
    setItensLocacao(prev => prev.map(i => i.equipamento.id === eqId ? { ...i, quantidade } : i));
  };

  const removerDoCarrinho = (eqId: string) => {
    setItensLocacao(prev => prev.filter(i => i.equipamento.id !== eqId));
  };

  // GERENCIAMENTO DE CLIENTES
  const abrirNovoCliente = () => {
    setCliIdEdicao(null);
    setCliNome('');
    setCliCpfCnpj('');
    setCliTelefone('');
    setCliEndereco('');
    setCliStatus('Ativo');
    setModalCadastroClienteAberto(true);
  };

  const abrirEdicaoCliente = (cli: any) => {
    setCliIdEdicao(cli.id);
    setCliNome(cli.nome || '');
    setCliCpfCnpj(cli.cpf_cnpj || cli.cpf || '');
    setCliTelefone(cli.telefone || '');
    setCliEndereco(cli.endereco || '');
    setCliStatus(cli.status || 'Ativo');
    setModalCadastroClienteAberto(true);
  };

  const salvarCliente = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cliNome) {
      alert('O nome do cliente é obrigatório.');
      return;
    }

    if (cliCpfCnpj.trim() !== '') {
      const checagem = validarCpfCnpj(cliCpfCnpj);
      if (!checagem.valido) {
        alert(`O ${checagem.tipo === 'Invalido' ? 'CPF/CNPJ' : checagem.tipo} informado é inválido! Por favor, verifique o número digitado.`);
        return;
      }
    }

    const payload = {
      nome: cliNome,
      cpf_cnpj: cliCpfCnpj || null,
      telefone: cliTelefone || null,
      endereco: cliEndereco || null,
      status: cliStatus
    };

    if (cliIdEdicao) {
      const { error } = await supabase.from('clientes').update(payload).eq('id', cliIdEdicao);
      if (error) {
        alert('Erro ao atualizar cliente: ' + error.message);
        return;
      }
    } else {
      const { error } = await supabase.from('clientes').insert([payload]);
      if (error) {
        alert('Erro ao cadastrar cliente: ' + error.message);
        return;
      }
    }

    setModalCadastroClienteAberto(false);
    carregarDados();
    alert(cliIdEdicao ? 'Cliente atualizado com sucesso!' : 'Cliente cadastrado com sucesso!');
  };

  const deletarCliente = async (cli: any) => {
    const locsCliente = locacoes.filter(l => l.cliente_id === cli.id);
    if (locsCliente.length > 0) {
      alert(`Não é possível excluir este cliente porque existem ${locsCliente.length} locações associadas a ele.`);
      return;
    }

    const confirmacao = window.confirm(`Deseja EXCLUIR permanentemente o cliente:\n\n${cli.nome}?`);
    if (!confirmacao) return;

    const { error } = await supabase.from('clientes').delete().eq('id', cli.id);
    if (error) {
      alert('Erro ao excluir cliente: ' + error.message);
      return;
    }

    carregarDados();
    alert('Cliente removido com sucesso!');
  };

  // EQUIPAMENTOS
  const abrirNovoEquipamento = () => {
    setEqIdEdicao(null);
    setEqNome('');
    setEqCodigo('');
    setEqPatrimonio('');
    setEqFotoUrl('');
    setEqValorIndenizacao('');
    setEqObservacoes('');
    setEqDiaria('');
    setEqSemanal('');
    setEqQuinzenal('');
    setEqMensal('');
    setEqTrimestral('');
    setEqAnual('');

    setTemSemanal(true);
    setTemQuinzenal(true);
    setTemMensal(true);
    setTemTrimestral(true);
    setTemAnual(true);

    setModalCadastroEquipamentoAberto(true);
  };

  const abrirEdicaoEquipamento = (eq: any) => {
    setEqIdEdicao(eq.id);
    setEqNome(eq.nome || '');
    setEqCodigo(eq.codigo || '');
    setEqPatrimonio(eq.patrimonio || '');
    setEqFotoUrl(eq.foto_url || eq.imagem_url || '');
    setEqValorIndenizacao(eq.valor_indenizacao || '');
    setEqObservacoes(eq.observacoes || '');

    setEqDiaria(eq.diaria ?? '');
    setEqSemanal(eq.semanal ?? '');
    setEqQuinzenal(eq.quinzenal ?? '');
    setEqMensal(eq.mensal ?? '');
    setEqTrimestral(eq.trimestral ?? '');
    setEqAnual(eq.anual ?? '');

    setTemSemanal(eq.semanal !== null && eq.semanal !== undefined);
    setTemQuinzenal(eq.quinzenal !== null && eq.quinzenal !== undefined);
    setTemMensal(eq.mensal !== null && eq.mensal !== undefined);
    setTemTrimestral(eq.trimestral !== null && eq.trimestral !== undefined);
    setTemAnual(eq.anual !== null && eq.anual !== undefined);

    setModalEquipamentoAberto(false);
    setModalCadastroEquipamentoAberto(true);
  };

  const salvarEquipamento = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eqNome || eqDiaria === '') {
      alert('Preencha ao menos o nome do equipamento e o valor da diária.');
      return;
    }

    const payload = {
      nome: eqNome,
      codigo: eqCodigo || eqPatrimonio,
      patrimonio: eqPatrimonio || eqCodigo,
      foto_url: eqFotoUrl || null,
      valor_indenizacao: eqValorIndenizacao !== '' ? Number(eqValorIndenizacao) : null,
      observacoes: eqObservacoes || null,
      diaria: Number(eqDiaria),
      semanal: temSemanal && eqSemanal !== '' ? Number(eqSemanal) : null,
      quinzenal: temQuinzenal && eqQuinzenal !== '' ? Number(eqQuinzenal) : null,
      mensal: temMensal && eqMensal !== '' ? Number(eqMensal) : null,
      trimestral: temTrimestral && eqTrimestral !== '' ? Number(eqTrimestral) : null,
      anual: temAnual && eqAnual !== '' ? Number(eqAnual) : null,
    };

    if (eqIdEdicao) {
      const { error } = await supabase.from('equipamentos').update(payload).eq('id', eqIdEdicao);
      if (error) {
        alert('Erro ao atualizar equipamento: ' + error.message);
        return;
      }
    } else {
      const { error } = await supabase.from('equipamentos').insert([{ ...payload, status: 'Disponível' }]);
      if (error) {
        alert('Erro ao cadastrar equipamento: ' + error.message);
        return;
      }
    }

    setModalCadastroEquipamentoAberto(false);
    carregarDados();
    alert(eqIdEdicao ? 'Equipamento atualizado com sucesso!' : 'Equipamento cadastrado com sucesso!');
  };

  const deletarEquipamento = async (eq: any) => {
    if (eq.status === 'Alugado') {
      alert('Não é possível excluir um equipamento que está alugado no momento! Cancele ou deponha a locação primeiro.');
      return;
    }

    const confirmacao = window.confirm(`Deseja EXCLUIR permanentemente o equipamento:\n\n[${eq.patrimonio || eq.codigo}] ${eq.nome}?`);
    if (!confirmacao) return;

    const { error } = await supabase.from('equipamentos').delete().eq('id', eq.id);
    if (error) {
      alert('Erro ao excluir equipamento: ' + error.message);
      return;
    }

    setModalEquipamentoAberto(false);
    carregarDados();
    alert('Equipamento removido com sucesso!');
  };

  const fecharModalLocacao = () => {
    setModalNovaLocacaoAberto(false);
    setModalContratoPreviaAberto(false);
    setEtapaLocacao(1);
    setClienteId('');
    setClienteObj(null);
    setLiberacaoExcecao(false);
    setItensLocacao([]);
    setEnderecoEntrega('');
    setPontoReferencia('');
    setResponsavelRecebimento('');
    setObservacaoPagamento('A combinar');
    setDesconto(0);
    setFrete(0);
    setStatusPagamento('Pendente');
    setSubtotal(0);
    setValorTotal(0);
    setLocacaoOrigemId(null);
  };

  const handleSelectCliente = (id: string) => {
    setClienteId(id);
    setLiberacaoExcecao(false);
    setClienteObj(clientes.find((c) => c.id === id) || null);
  };

  const salvarLocacaoNoBanco = async () => {
    if (!clienteId || itensLocacao.length === 0) return false;

    for (const item of itensLocacao) {
      const { error } = await supabase.from('locacoes').insert([
        {
          cliente_id: clienteId,
          equipamento_id: item.equipamento.id,
          data_inicio: item.dataInicio || hojeDataFormatada,
          data_fim: item.dataFim || hojeDataFormatada,
          modalidade: item.modalidade,
          desconto_aplicado: desconto,
          valor_frete: frete,
          valor_total: valorTotal,
          status_pagamento: statusPagamento,
          endereco_entrega: enderecoEntrega,
          ponto_referencia: pontoReferencia,
          responsavel_recebimento: responsavelRecebimento,
          locacao_origem_id: locacaoOrigemId,
          status: 'Ativa',
          observacoes: `Qtd: ${item.quantidade} un. Plano: ${item.modalidade.toUpperCase()} (${item.diasDiaria} dias). ` + (liberacaoExcecao ? '(Exceção)' : '')
        }
      ]);

      if (!error) {
        await supabase.from('equipamentos').update({ status: 'Alugado' }).eq('id', item.equipamento.id);
      } else {
        alert('Erro ao gravar locação: ' + error.message);
        return false;
      }
    }

    await carregarDados();
    return true;
  };

  const confirmarEImprimirLocacao = async () => {
    const sucesso = await salvarLocacaoNoBanco();
    if (sucesso) {
      setTimeout(() => {
        window.print();
        fecharModalLocacao();
      }, 300);
    }
  };

  const cancelarLocacao = async (loc: any) => {
    const confirmacao = window.confirm(`Tem certeza que deseja CANCELAR a locação do equipamento [${loc.equipamentos?.patrimonio || loc.equipamentos?.codigo}] ${loc.equipamentos?.nome}?\n\nO equipamento voltará para o status "Disponível" no pátio.`);
    
    if (!confirmacao) return;

    const { error: erroLocacao } = await supabase
      .from('locacoes')
      .update({ status: 'Cancelada' })
      .eq('id', loc.id);

    if (erroLocacao) {
      alert('Erro ao cancelar locação: ' + erroLocacao.message);
      return;
    }

    const { error: erroEq } = await supabase
      .from('equipamentos')
      .update({ status: 'Disponível' })
      .eq('id', loc.equipamento_id);

    if (erroEq) {
      alert('Erro ao atualizar status do equipamento: ' + erroEq.message);
      return;
    }

    setModalDetalhesLocacaoAberto(false);
    carregarDados();
    alert('Locação cancelada com sucesso! O equipamento está novamente disponível no pátio.');
  };

  const iniciarRenovacao = (loc: any) => {
    setLocacaoOrigemId(loc.id);
    setClienteId(loc.cliente_id);
    setClienteObj(loc.clientes);
    if (loc.equipamentos) {
      setItensLocacao([{ 
        equipamento: loc.equipamentos, 
        quantidade: 1, 
        modalidade: loc.modalidade || 'diaria',
        dataInicio: hojeDataFormatada,
        dataFim: adicionarDiasAData(hojeDataFormatada, 1),
        diasDiaria: 1
      }]);
    }
    setEnderecoEntrega(loc.endereco_entrega || '');
    setPontoReferencia(loc.ponto_referencia || '');
    setResponsavelRecebimento(loc.responsavel_recebimento || '');
    setDesconto(Number(loc.desconto_aplicado) || 0);
    setFrete(Number(loc.valor_frete) || 0);
    setStatusPagamento('Pendente');

    setModalDetalhesLocacaoAberto(false);
    setModalEmCampoAberto(false);
    setModalNovaLocacaoAberto(true);
    setEtapaLocacao(2);
  };

  const calcularDiasRestantes = (dataFimLocacao: string) => {
    if (!dataFimLocacao) return 0;
    const hoje = new Date();
    const fim = new Date(dataFimLocacao);
    const diferenca = fim.getTime() - hoje.getTime();
    return Math.ceil(diferenca / (1000 * 3600 * 24));
  };

  const equipamentosEmCampo = equipamentos.filter(e => e.status === 'Alugado');

  const clientesFiltrados = clientes.filter(c => 
    c.nome?.toLowerCase().includes(buscaCliente.toLowerCase()) ||
    (c.cpf_cnpj || c.cpf || '').toLowerCase().includes(buscaCliente.toLowerCase()) ||
    c.telefone?.toLowerCase().includes(buscaCliente.toLowerCase())
  );

  const checagemDocumento = validarCpfCnpj(cliCpfCnpj);

  return (
    <div className="min-h-screen bg-[#0f0f10] text-neutral-100 font-sans flex flex-col md:flex-row print:bg-white print:text-black print:p-0">
      
      {/* MENU LATERAL */}
      <aside className="w-full md:w-64 bg-[#141416] border-r border-neutral-800 p-5 flex flex-col justify-between shrink-0 print:hidden">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <img 
              src="/logo.png" 
              alt="Império Locações" 
              className="h-12 w-auto object-contain rounded-xl"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <div>
              <h1 className="text-lg font-black tracking-wide text-amber-400 leading-tight">IMPÉRIO</h1>
              <p className="text-[10px] font-bold tracking-widest text-neutral-400">LOCAÇÕES</p>
            </div>
          </div>

          <nav className="space-y-1">
            <button className="w-full flex items-center gap-3 bg-amber-500/10 text-amber-400 font-semibold px-4 py-3 rounded-xl text-sm border border-amber-500/20"><LayoutDashboard size={18} /> Painel</button>
            <button onClick={abrirNovoEquipamento} className="w-full flex items-center gap-3 text-neutral-400 hover:bg-neutral-800/50 px-4 py-3 rounded-xl text-sm text-left"><Wrench size={18} /> Cadastrar Equipamento</button>
            <button className="w-full flex items-center gap-3 text-neutral-400 hover:bg-neutral-800/50 px-4 py-3 rounded-xl text-sm"><FileText size={18} /> Locações</button>
            <button onClick={() => setModalClientesAberto(true)} className="w-full flex items-center gap-3 text-neutral-400 hover:bg-neutral-800/50 px-4 py-3 rounded-xl text-sm text-left"><Users size={18} /> Clientes</button>
            <button className="w-full flex items-center gap-3 text-neutral-400 hover:bg-neutral-800/50 px-4 py-3 rounded-xl text-sm"><DollarSign size={18} /> Financeiro</button>
            <button className="w-full flex items-center gap-3 text-neutral-400 hover:bg-neutral-800/50 px-4 py-3 rounded-xl text-sm"><TrendingUp size={18} /> Relatórios</button>
            <button onClick={() => setModalConfiguracoesAberto(true)} className="w-full flex items-center gap-3 text-neutral-400 hover:bg-neutral-800/50 px-4 py-3 rounded-xl text-sm text-left"><Settings size={18} /> Configurações</button>
          </nav>
        </div>
      </aside>

      {/* PAINEL PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0 print:hidden">
        <header className="bg-[#141416] border-b border-neutral-800 px-6 py-4 flex justify-between items-center gap-4">
          <h2 className="text-xl font-bold text-neutral-100 hidden sm:block">Gestão Empresarial</h2>
          
          <div className="flex items-center gap-3 ml-auto">
            <button 
              onClick={() => setModalEmCampoAberto(true)} 
              className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-amber-400 border border-amber-500/30 font-bold px-4 py-2.5 rounded-xl text-sm transition-all"
            >
              <Truck size={18} className="text-amber-400" /> 
              Equipamentos em Campo
              <span className="bg-amber-500/20 text-amber-400 font-black text-xs px-2 py-0.5 rounded-full border border-amber-500/30">
                {equipamentosEmCampo.length}
              </span>
            </button>

            <button onClick={abrirNovoEquipamento} className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 font-bold px-4 py-2.5 rounded-xl text-sm">
              <Plus size={18} /> Novo Equipamento
            </button>

            <button onClick={() => setModalNovaLocacaoAberto(true)} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-4 py-2.5 rounded-xl text-sm shadow-lg shadow-amber-500/10">
              <Plus size={18} /> Nova Locação
            </button>
          </div>
        </header>

        <main className="p-6 space-y-6 overflow-y-auto">
          {/* INDICADORES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#141416] border border-neutral-800/80 p-4 rounded-2xl flex items-center justify-between">
              <div><p className="text-xs text-neutral-400 font-medium">Em Campo</p><h3 className="text-2xl font-black text-amber-400 mt-1">{equipamentosEmCampo.length}</h3></div>
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

          {/* FROTA DE EQUIPAMENTOS */}
          <section className="bg-[#141416] border border-neutral-800/80 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-bold text-neutral-200 flex items-center gap-2">
                <Wrench size={18} className="text-amber-400" /> Frota de Equipamentos ({equipamentos.length})
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {equipamentos.map((item) => {
                const fotoExibicao = obterImagemPadraoEquipamento(item.nome, item.foto_url || item.imagem_url);

                return (
                  <div 
                    key={item.id} 
                    onClick={() => { setEquipamentoSelecionado(item); setModalEquipamentoAberto(true); }} 
                    className="bg-[#0f0f10] border border-neutral-800/80 hover:border-amber-500/60 p-4 rounded-2xl cursor-pointer transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded font-bold">
                          {item.patrimonio || item.codigo}
                        </span>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${item.status === 'Disponível' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                          • {item.status}
                        </span>
                      </div>

                      {/* EXIBIÇÃO DA FOTO COM MÁSCARA CSS PADRONIZADA */}
                      <div className="w-full h-36 bg-[#0a0a0b] border border-neutral-800/60 rounded-xl mb-3 overflow-hidden flex items-center justify-center relative group-hover:border-amber-500/30 transition-all">
                        <img 
                          src={fotoExibicao} 
                          alt={item.nome} 
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      <h4 className="font-bold text-neutral-100 text-sm leading-snug group-hover:text-amber-400 transition-colors">
                        {item.nome}
                      </h4>
                      
                      {item.observacoes && (
                        <p className="text-[11px] text-neutral-400 mt-1 line-clamp-1 italic">
                          "{item.observacoes}"
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-neutral-800/60 flex justify-between text-xs text-neutral-400">
                      <span>Diária: <strong className="text-amber-400">R$ {item.diaria}</strong></span>
                      <span>Mensal: <strong className="text-neutral-200">{item.mensal ? `R$ ${item.mensal}` : 'N/A'}</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </main>
      </div>

      {/* MODAL LISTAGEM E GESTÃO DE CLIENTES */}
      {modalClientesAberto && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4 print:hidden">
          <div className="bg-[#141416] border border-neutral-800 text-neutral-100 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-[#18181b]">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Users size={18} className="text-amber-400" /> Gerenciamento de Clientes ({clientes.length})
              </h3>
              <button onClick={() => setModalClientesAberto(false)} className="p-1.5 text-neutral-400 hover:text-neutral-100"><X size={18} /></button>
            </div>

            <div className="p-4 bg-[#0f0f10] border-b border-neutral-800 flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="relative w-full sm:w-80">
                <Search size={16} className="absolute left-3 top-3 text-neutral-500" />
                <input 
                  type="text" 
                  placeholder="Buscar por nome, CPF/CNPJ ou telefone..." 
                  value={buscaCliente} 
                  onChange={(e) => setBuscaCliente(e.target.value)} 
                  className="w-full bg-[#141416] border border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <button onClick={abrirNovoCliente} className="w-full sm:w-auto px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl text-xs flex items-center justify-center gap-1.5">
                <UserPlus size={16} /> Novo Cliente
              </button>
            </div>

            <div className="p-4 max-h-[420px] overflow-y-auto space-y-2 text-xs">
              {clientesFiltrados.length === 0 ? (
                <div className="text-center py-12 text-neutral-500">Nenhum cliente encontrado.</div>
              ) : (
                clientesFiltrados.map((cli) => (
                  <div key={cli.id} className="bg-[#0f0f10] border border-neutral-800/80 hover:border-amber-500/40 p-3.5 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <strong className="text-neutral-100 text-sm">{cli.nome}</strong>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                          cli.status === 'Ativo' 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : cli.status === 'Em Atraso' 
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}>
                          • {cli.status || 'Ativo'}
                        </span>
                      </div>
                      <div className="text-neutral-400 text-[11px] flex flex-wrap gap-x-4 gap-y-1">
                        {(cli.cpf_cnpj || cli.cpf) && <span>CPF/CNPJ: <strong className="text-neutral-300">{cli.cpf_cnpj || cli.cpf}</strong></span>}
                        {cli.telefone && <span>Tel: <strong className="text-neutral-300">{cli.telefone}</strong></span>}
                      </div>
                      {cli.endereco && <p className="text-neutral-400 text-[10px] truncate max-w-md">Endereço: {cli.endereco}</p>}
                    </div>

                    <div className="flex items-center gap-2 ml-auto sm:ml-0">
                      <button onClick={() => abrirEdicaoCliente(cli)} className="p-2 bg-neutral-800 hover:bg-neutral-700 text-amber-400 rounded-lg text-xs font-bold flex items-center gap-1">
                        <Edit3 size={14} /> Editar
                      </button>
                      <button onClick={() => deletarCliente(cli)} className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-lg text-xs font-bold">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL CADASTRO / EDIÇÃO DE CLIENTE */}
      {modalCadastroClienteAberto && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-[60] p-4 print:hidden">
          <div className="bg-[#141416] border border-neutral-800 text-neutral-100 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-[#18181b]">
              <h3 className="font-bold text-base flex items-center gap-2">
                <User size={18} className="text-amber-400" />
                {cliIdEdicao ? 'Editar Cliente' : 'Novo Cliente'}
              </h3>
              <button onClick={() => setModalCadastroClienteAberto(false)} className="p-1.5 text-neutral-400 hover:text-neutral-100"><X size={18} /></button>
            </div>

            <form onSubmit={salvarCliente} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Nome Completo / Razão Social *</label>
                <input type="text" placeholder="Ex: Construtora Silva Ltda" value={cliNome} onChange={(e) => setCliNome(e.target.value)} required className="w-full bg-[#0f0f10] border border-neutral-800 rounded-xl p-2.5 text-neutral-200 focus:outline-none focus:border-amber-500" />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1 flex justify-between items-center">
                    <span>CPF / CNPJ</span>
                    {cliCpfCnpj.trim() !== '' && (
                      <span className={`text-[10px] font-bold ${checagemDocumento.valido ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {checagemDocumento.valido ? `✓ ${checagemDocumento.tipo} Válido` : '✕ Inválido'}
                      </span>
                    )}
                  </label>
                  <input 
                    type="text" 
                    placeholder="000.000.000-00" 
                    value={cliCpfCnpj} 
                    onChange={(e) => setCliCpfCnpj(e.target.value)} 
                    className={`w-full bg-[#0f0f10] border rounded-xl p-2.5 text-neutral-200 focus:outline-none ${
                      cliCpfCnpj.trim() !== '' 
                        ? checagemDocumento.valido 
                          ? 'border-emerald-500/80 focus:border-emerald-500' 
                          : 'border-rose-500/80 focus:border-rose-500' 
                        : 'border-neutral-800 focus:border-amber-500'
                    }`} 
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Telefone / WhatsApp</label>
                  <input type="text" placeholder="(31) 99999-9999" value={cliTelefone} onChange={(e) => setCliTelefone(e.target.value)} className="w-full bg-[#0f0f10] border border-neutral-800 rounded-xl p-2.5 text-neutral-200 focus:outline-none focus:border-amber-500" />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Endereço Residencial / Sede</label>
                <input type="text" placeholder="Rua, Nº, Bairro, Cidade - UF" value={cliEndereco} onChange={(e) => setCliEndereco(e.target.value)} className="w-full bg-[#0f0f10] border border-neutral-800 rounded-xl p-2.5 text-neutral-200 focus:outline-none focus:border-amber-500" />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Status Financeiro do Cliente</label>
                <select value={cliStatus} onChange={(e) => setCliStatus(e.target.value as any)} className="w-full bg-[#0f0f10] border border-neutral-800 rounded-xl p-2.5 text-amber-400 font-bold focus:outline-none focus:border-amber-500">
                  <option value="Ativo">Ativo (Sem restrições)</option>
                  <option value="Em Atraso">Em Atraso (Alerta no momento da locação)</option>
                  <option value="Bloqueado">Bloqueado (Impedido de realizar locação)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-neutral-800 flex gap-2 justify-end">
                <button type="button" onClick={() => setModalCadastroClienteAberto(false)} className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded-xl">Cancelar</button>
                <button type="submit" className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl flex items-center gap-1.5"><Save size={16} /> Salvar Cliente</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CADASTRO / EDIÇÃO DE EQUIPAMENTO COM SUPORTE A UPLOAD DE ARQUIVO LOCAL */}
      {modalCadastroEquipamentoAberto && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4 print:hidden">
          <div className="bg-[#141416] border border-neutral-800 text-neutral-100 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-[#18181b]">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Wrench size={18} className="text-amber-400" />
                {eqIdEdicao ? 'Editar Equipamento' : 'Novo Equipamento'}
              </h3>
              <button onClick={() => setModalCadastroEquipamentoAberto(false)} className="p-1.5 text-neutral-400 hover:text-neutral-100"><X size={18} /></button>
            </div>

            <form onSubmit={salvarEquipamento} className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Nome do Equipamento *</label>
                <input type="text" placeholder="Ex: Martelete Demolidor 10kg SDS Max" value={eqNome} onChange={(e) => setEqNome(e.target.value)} required className="w-full bg-[#0f0f10] border border-neutral-800 rounded-xl p-2.5 text-neutral-200 focus:outline-none focus:border-amber-500" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Código / Patrimônio</label>
                  <input type="text" placeholder="Ex: EQ-01" value={eqPatrimonio} onChange={(e) => { setEqPatrimonio(e.target.value); setEqCodigo(e.target.value); }} className="w-full bg-[#0f0f10] border border-neutral-800 rounded-xl p-2.5 text-neutral-200 focus:outline-none focus:border-amber-500" />
                </div>
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Valor Indenização (R$)</label>
                  <input type="number" placeholder="Ex: 3500.00" value={eqValorIndenizacao} onChange={(e) => setEqValorIndenizacao(e.target.value === '' ? '' : Number(e.target.value))} className="w-full bg-[#0f0f10] border border-neutral-800 rounded-xl p-2.5 text-neutral-200 focus:outline-none focus:border-amber-500" />
                </div>
              </div>

              {/* SELEÇÃO DE ARQUIVO LOCAL DO COMPUTADOR OU LINK */}
              <div className="bg-[#0f0f10] border border-neutral-800 p-3.5 rounded-xl space-y-3">
                <label className="block text-neutral-300 font-semibold flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon size={15} className="text-amber-400" /> Imagem do Equipamento
                  </span>
                  <span className="text-[10px] text-neutral-400 font-normal italic">Deixe vazio para usar a foto padrão</span>
                </label>

                {/* PRÉ-VISUALIZAÇÃO DA FOTO */}
                <div className="flex items-center gap-3">
                  <div className="w-20 h-20 bg-[#141416] border border-neutral-800 rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                    <img 
                      src={obterImagemPadraoEquipamento(eqNome, eqFotoUrl)} 
                      alt="Prévia" 
                      className="w-full h-full object-cover object-center" 
                    />
                  </div>

                  <div className="flex-1 space-y-2">
                    <label className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl font-bold cursor-pointer transition-all">
                      <Upload size={14} /> Selecionar Foto do Computador
                      <input type="file" accept="image/*" onChange={handleUploadFotoComputador} className="hidden" />
                    </label>

                    {eqFotoUrl && (
                      <button 
                        type="button" 
                        onClick={() => setEqFotoUrl('')} 
                        className="text-[10px] text-rose-400 hover:underline block"
                      >
                        ✕ Remover foto personalizada e voltar para padrão
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <input 
                    type="url" 
                    placeholder="Ou cole o link (URL) da imagem aqui..." 
                    value={eqFotoUrl} 
                    onChange={(e) => setEqFotoUrl(e.target.value)} 
                    className="w-full bg-[#141416] border border-neutral-800 rounded-lg p-2 text-neutral-300 text-[11px] focus:outline-none focus:border-amber-500" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Observações Técnicas</label>
                <input type="text" placeholder="Ex: Voltagem 220V, acompanha ponteira e talhadeira" value={eqObservacoes} onChange={(e) => setEqObservacoes(e.target.value)} className="w-full bg-[#0f0f10] border border-neutral-800 rounded-xl p-2.5 text-neutral-200 focus:outline-none focus:border-amber-500" />
              </div>

              <div className="bg-[#0f0f10] border border-neutral-800 p-4 rounded-xl space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-amber-400 text-xs uppercase tracking-wider">Tabela de Tarifas</h4>
                  <span className="text-[10px] text-neutral-400 italic">Clique no X para remover tarifas não aplicáveis</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-20 text-neutral-300 font-semibold">Diária *:</span>
                    <input type="number" placeholder="0.00" value={eqDiaria} onChange={(e) => setEqDiaria(e.target.value === '' ? '' : Number(e.target.value))} required className="flex-1 bg-[#141416] border border-neutral-800 rounded-xl p-2 text-amber-400 font-bold focus:outline-none focus:border-amber-500" />
                  </div>

                  {temSemanal ? (
                    <div className="flex items-center gap-2">
                      <span className="w-20 text-neutral-300">Semanal:</span>
                      <input type="number" placeholder="0.00" value={eqSemanal} onChange={(e) => setEqSemanal(e.target.value === '' ? '' : Number(e.target.value))} className="flex-1 bg-[#141416] border border-neutral-800 rounded-xl p-2 text-neutral-200" />
                      <button type="button" onClick={() => { setTemSemanal(false); setEqSemanal(''); }} title="Remover Tarifa Semanal" className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg"><X size={16} /></button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => setTemSemanal(true)} className="text-[11px] text-amber-400 hover:underline flex items-center gap-1">+ Adicionar Tarifa Semanal</button>
                  )}

                  {temQuinzenal ? (
                    <div className="flex items-center gap-2">
                      <span className="w-20 text-neutral-300">Quinzenal:</span>
                      <input type="number" placeholder="0.00" value={eqQuinzenal} onChange={(e) => setEqQuinzenal(e.target.value === '' ? '' : Number(e.target.value))} className="flex-1 bg-[#141416] border border-neutral-800 rounded-xl p-2 text-neutral-200" />
                      <button type="button" onClick={() => { setTemQuinzenal(false); setEqQuinzenal(''); }} title="Remover Tarifa Quinzenal" className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg"><X size={16} /></button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => setTemQuinzenal(true)} className="text-[11px] text-amber-400 hover:underline flex items-center gap-1">+ Adicionar Tarifa Quinzenal</button>
                  )}

                  {temMensal ? (
                    <div className="flex items-center gap-2">
                      <span className="w-20 text-neutral-300">Mensal:</span>
                      <input type="number" placeholder="0.00" value={eqMensal} onChange={(e) => setEqMensal(e.target.value === '' ? '' : Number(e.target.value))} className="flex-1 bg-[#141416] border border-neutral-800 rounded-xl p-2 text-neutral-200" />
                      <button type="button" onClick={() => { setTemMensal(false); setEqMensal(''); }} title="Remover Tarifa Mensal" className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg"><X size={16} /></button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => setTemMensal(true)} className="text-[11px] text-amber-400 hover:underline flex items-center gap-1">+ Adicionar Tarifa Mensal</button>
                  )}

                  {temTrimestral ? (
                    <div className="flex items-center gap-2">
                      <span className="w-20 text-neutral-300">Trimestral:</span>
                      <input type="number" placeholder="0.00" value={eqTrimestral} onChange={(e) => setEqTrimestral(e.target.value === '' ? '' : Number(e.target.value))} className="flex-1 bg-[#141416] border border-neutral-800 rounded-xl p-2 text-neutral-200" />
                      <button type="button" onClick={() => { setTemTrimestral(false); setEqTrimestral(''); }} title="Remover Tarifa Trimestral" className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg"><X size={16} /></button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => setTemTrimestral(true)} className="text-[11px] text-amber-400 hover:underline flex items-center gap-1">+ Adicionar Tarifa Trimestral</button>
                  )}

                  {temAnual ? (
                    <div className="flex items-center gap-2">
                      <span className="w-20 text-neutral-300">Anual:</span>
                      <input type="number" placeholder="0.00" value={eqAnual} onChange={(e) => setEqAnual(e.target.value === '' ? '' : Number(e.target.value))} className="flex-1 bg-[#141416] border border-neutral-800 rounded-xl p-2 text-neutral-200" />
                      <button type="button" onClick={() => { setTemAnual(false); setEqAnual(''); }} title="Remover Tarifa Anual" className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg"><X size={16} /></button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => setTemAnual(true)} className="text-[11px] text-amber-400 hover:underline flex items-center gap-1">+ Adicionar Tarifa Anual</button>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-800 flex gap-2 justify-end">
                <button type="button" onClick={() => setModalCadastroEquipamentoAberto(false)} className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded-xl">Cancelar</button>
                <button type="submit" className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl flex items-center gap-1.5"><Save size={16} /> Salvar Patrimônio</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DETALHES E AÇÕES DO EQUIPAMENTO */}
      {modalEquipamentoAberto && equipamentoSelecionado && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4 print:hidden">
          <div className="bg-[#141416] border border-neutral-800 text-neutral-100 w-full max-w-md rounded-2xl shadow-2xl p-5 space-y-4 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
              <div>
                <span className="text-[10px] text-amber-400 font-mono font-bold bg-neutral-800 px-2 py-0.5 rounded">
                  {equipamentoSelecionado.patrimonio || equipamentoSelecionado.codigo}
                </span>
                <h3 className="font-bold text-sm text-neutral-100 mt-1">{equipamentoSelecionado.nome}</h3>
              </div>
              <button onClick={() => setModalEquipamentoAberto(false)}><X size={18} /></button>
            </div>

            {/* FOTO DESTACADA NO MODAL DE DETALHES COM RECORTES PADRONIZADOS */}
            <div className="w-full h-44 bg-[#0a0a0b] border border-neutral-800 rounded-xl overflow-hidden">
              <img 
                src={obterImagemPadraoEquipamento(equipamentoSelecionado.nome, equipamentoSelecionado.foto_url || equipamentoSelecionado.imagem_url)} 
                alt={equipamentoSelecionado.nome} 
                className="w-full h-full object-cover object-center" 
              />
            </div>

            <div className="bg-[#0f0f10] border border-neutral-800 p-3 rounded-xl space-y-1">
              <span className="text-neutral-400 font-medium text-[11px] flex items-center gap-1">
                <Info size={12} className="text-amber-400" /> Observações do Patrimônio:
              </span>
              <p className="text-neutral-200 italic">
                {equipamentoSelecionado.observacoes || 'Nenhuma observação registrada para este equipamento.'}
              </p>
            </div>

            <div className="bg-[#0f0f10] border border-neutral-800 p-3 rounded-xl space-y-2">
              <h4 className="font-bold text-amber-400 text-[11px] uppercase tracking-wider mb-2">Tabela de Tarifas Válidas</h4>
              
              {equipamentoSelecionado.diaria !== null && (
                <div className="flex justify-between"><span>Diária</span><strong className="text-amber-400">R$ {equipamentoSelecionado.diaria}</strong></div>
              )}
              {equipamentoSelecionado.semanal !== null && equipamentoSelecionado.semanal !== undefined && (
                <div className="flex justify-between"><span>Semanal</span><strong className="text-amber-400">R$ {equipamentoSelecionado.semanal}</strong></div>
              )}
              {equipamentoSelecionado.quinzenal !== null && equipamentoSelecionado.quinzenal !== undefined && (
                <div className="flex justify-between"><span>Quinzenal</span><strong className="text-amber-400">R$ {equipamentoSelecionado.quinzenal}</strong></div>
              )}
              {equipamentoSelecionado.mensal !== null && equipamentoSelecionado.mensal !== undefined && (
                <div className="flex justify-between"><span>Mensal</span><strong className="text-amber-400">R$ {equipamentoSelecionado.mensal}</strong></div>
              )}
              {equipamentoSelecionado.trimestral !== null && equipamentoSelecionado.trimestral !== undefined && (
                <div className="flex justify-between"><span>Trimestral</span><strong className="text-amber-400">R$ {equipamentoSelecionado.trimestral}</strong></div>
              )}
              {equipamentoSelecionado.anual !== null && equipamentoSelecionado.anual !== undefined && (
                <div className="flex justify-between"><span>Anual</span><strong className="text-amber-400">R$ {equipamentoSelecionado.anual}</strong></div>
              )}
            </div>

            <div className="pt-3 border-t border-neutral-800 flex justify-between gap-2">
              <button 
                onClick={() => deletarEquipamento(equipamentoSelecionado)} 
                className="px-3.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold rounded-xl flex items-center gap-1.5 transition-all"
              >
                <Trash2 size={15} /> Excluir
              </button>

              <button 
                onClick={() => abrirEdicaoEquipamento(equipamentoSelecionado)} 
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl flex items-center gap-1.5 shadow-lg shadow-amber-500/10"
              >
                <Edit3 size={15} /> Editar Dados
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL LISTAGEM DE EQUIPAMENTOS EM CAMPO */}
      {modalEmCampoAberto && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4 print:hidden">
          <div className="bg-[#141416] border border-neutral-800 text-neutral-100 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-[#18181b]">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Truck size={18} className="text-amber-400" /> Equipamentos Atualmente em Campo ({equipamentosEmCampo.length})
              </h3>
              <button onClick={() => setModalEmCampoAberto(false)} className="p-1.5 text-neutral-400 hover:text-neutral-100"><X size={18} /></button>
            </div>

            <div className="p-5 max-h-[480px] overflow-y-auto space-y-3 text-xs">
              {equipamentosEmCampo.length === 0 ? (
                <div className="text-center py-12 text-neutral-500">Nenhum equipamento em campo no momento.</div>
              ) : (
                equipamentosEmCampo.map((eq) => {
                  const loc = locacoes.find(l => l.equipamento_id === eq.id && l.status === 'Ativa');
                  const diasRestantes = loc ? calcularDiasRestantes(loc.data_fim) : 0;
                  return (
                    <div 
                      key={eq.id} 
                      onClick={() => {
                        if (loc) {
                          setLocacaoSelecionada(loc);
                          setModalDetalhesLocacaoAberto(true);
                        } else {
                          alert(`O equipamento [${eq.patrimonio || eq.codigo}] ${eq.nome} está marcado como Alugado.`);
                        }
                      }}
                      className="bg-[#0f0f10] border border-neutral-800/80 hover:border-amber-500/50 p-4 rounded-xl cursor-pointer flex justify-between items-center gap-4 transition-all"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-amber-400 font-mono font-bold bg-neutral-800 px-2 py-0.5 rounded">
                            {eq.patrimonio || eq.codigo}
                          </span>
                          <h4 className="font-bold text-sm text-neutral-100">{eq.nome}</h4>
                        </div>
                        <p className="text-neutral-400">Cliente: <strong className="text-neutral-200">{loc?.clientes?.nome || 'Cliente não identificado'}</strong></p>
                        {loc?.modalidade && (
                          <p className="text-[10px] text-amber-400 font-bold uppercase">
                            Plano: {loc.modalidade}
                          </p>
                        )}
                      </div>

                      <div className="text-right shrink-0 space-y-1.5">
                        {loc ? (
                          <>
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border block ${
                              diasRestantes < 0 
                                ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' 
                                : diasRestantes <= 2 
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' 
                                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            }`}>
                              {diasRestantes < 0 ? `Atrasado (${Math.abs(diasRestantes)}d)` : `${diasRestantes} dias restantes`}
                            </span>

                            <span className={`text-[10px] px-2 py-0.5 rounded font-semibold inline-block ${
                              loc.status_pagamento === 'Pago' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                            }`}>
                              {loc.status_pagamento || 'Pendente'}
                            </span>
                          </>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">Alugado</span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL DETALHES DA LOCAÇÃO ATIVA */}
      {modalDetalhesLocacaoAberto && locacaoSelecionada && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4 print:hidden">
          <div className="bg-[#141416] border border-neutral-800 text-neutral-100 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden text-xs">
            <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-[#18181b]">
              <div>
                <span className="text-[10px] text-amber-400 font-mono font-bold bg-neutral-800 px-2 py-0.5 rounded">
                  {locacaoSelecionada.equipamentos?.patrimonio || locacaoSelecionada.equipamentos?.codigo}
                </span>
                <h3 className="font-bold text-sm text-neutral-100 mt-1">{locacaoSelecionada.equipamentos?.nome}</h3>
              </div>
              <button onClick={() => setModalDetalhesLocacaoAberto(false)}><X size={18} /></button>
            </div>

            <div className="p-5 space-y-4">
              <div className="bg-[#0f0f10] border border-neutral-800 p-3 rounded-xl space-y-1">
                <span className="text-neutral-400 font-medium text-[11px]">Cliente Contratante</span>
                <h4 className="font-bold text-sm text-neutral-100">{locacaoSelecionada.clientes?.nome}</h4>
              </div>

              <div className="bg-[#0f0f10] border border-neutral-800 p-3 rounded-xl space-y-2">
                <span className="text-amber-400 font-bold text-[11px] uppercase flex items-center gap-1">
                  <MapPin size={12} /> Local de Entrega & Logística
                </span>
                <p className="text-neutral-200"><strong>Endereço:</strong> {locacaoSelecionada.endereco_entrega || 'Não informado'}</p>
                {locacaoSelecionada.ponto_referencia && <p className="text-neutral-300"><strong>Ponto de Ref.:</strong> {locacaoSelecionada.ponto_referencia}</p>}
                {locacaoSelecionada.responsavel_recebimento && <p className="text-neutral-300"><strong>Recebedor:</strong> {locacaoSelecionada.responsavel_recebimento}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#0f0f10] border border-neutral-800 p-3 rounded-xl space-y-1">
                  <span className="text-neutral-400 text-[11px]">Plano & Período</span>
                  <p className="font-bold text-amber-400 uppercase">{locacaoSelecionada.modalidade}</p>
                  <p className="text-neutral-300 text-[11px] mt-1">
                    {calcularDiasRestantes(locacaoSelecionada.data_fim)} dias restantes
                  </p>
                </div>
                <div className="bg-[#0f0f10] border border-neutral-800 p-3 rounded-xl space-y-1">
                  <span className="text-neutral-400 text-[11px]">Pagamento</span>
                  <p className={`font-bold ${locacaoSelecionada.status_pagamento === 'Pago' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {locacaoSelecionada.status_pagamento || 'Pendente'}
                  </p>
                  <p className="text-neutral-200 font-bold text-sm mt-1">
                    R$ {Number(locacaoSelecionada.valor_total).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-800 flex gap-2 justify-end">
                <button 
                  onClick={() => cancelarLocacao(locacaoSelecionada)} 
                  className="px-4 py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all text-xs"
                >
                  <Ban size={16} /> Cancelar Locação
                </button>

                <button 
                  onClick={() => iniciarRenovacao(locacaoSelecionada)} 
                  className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 text-xs"
                >
                  <RefreshCw size={16} /> Renovar Locação (Novo Contrato)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL NOVA LOCAÇÃO / RENOVAÇÃO */}
      {modalNovaLocacaoAberto && !modalContratoPreviaAberto && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4 print:hidden">
          <div className="bg-[#141416] border border-neutral-800 text-neutral-100 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-[#18181b]">
              <h3 className="font-bold text-base flex items-center gap-2">
                {locacaoOrigemId ? <RefreshCw size={18} className="text-amber-400" /> : <Plus size={18} className="text-amber-400" />}
                {locacaoOrigemId ? 'Renovação de Locação' : 'Nova Locação'}
              </h3>
              <button onClick={fecharModalLocacao} className="p-1.5 text-neutral-400 hover:text-neutral-100"><X size={18} /></button>
            </div>

            <div className="bg-[#0f0f10] border-b border-neutral-800 px-6 py-3 flex justify-between text-xs">
              <span className={etapaLocacao >= 1 ? 'text-amber-400 font-bold' : 'text-neutral-500'}>1. Cliente & Logística</span>
              <span className={etapaLocacao >= 2 ? 'text-amber-400 font-bold' : 'text-neutral-500'}>2. Carrinho, Datas e Planos ({itensLocacao.length})</span>
              <span className={etapaLocacao >= 3 ? 'text-amber-400 font-bold' : 'text-neutral-500'}>3. Fechamento e Pagamento</span>
            </div>

            <div className="p-6 space-y-4 text-xs min-h-[360px] flex flex-col justify-between overflow-y-auto max-h-[78vh]">
              {etapaLocacao === 1 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center gap-2">
                    <div className="flex-1">
                      <label className="block text-neutral-300 font-semibold mb-2">Selecione o Cliente</label>
                      <select value={clienteId} onChange={(e) => handleSelectCliente(e.target.value)} className="w-full bg-[#0f0f10] border border-neutral-800 rounded-xl p-3 text-neutral-200 focus:outline-none focus:border-amber-500 text-sm">
                        <option value="">-- Clique para escolher --</option>
                        {clientes.map(cli => (<option key={cli.id} value={cli.id}>{cli.nome} (Status: {cli.status})</option>))}
                      </select>
                    </div>
                    <button onClick={abrirNovoCliente} type="button" className="mt-6 px-3 py-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl font-bold flex items-center gap-1.5 shrink-0">
                      <UserPlus size={16} /> + Cadastrar
                    </button>
                  </div>

                  <div className="bg-[#0f0f10] border border-neutral-800 p-3.5 rounded-xl space-y-3">
                    <h4 className="font-bold text-amber-400 text-xs flex items-center gap-1.5"><MapPin size={14} /> Endereço de Entrega & Logística</h4>
                    <div>
                      <label className="block text-neutral-400 mb-1">Endereço Completo da Obra/Entrega</label>
                      <input type="text" placeholder="Rua, Nº, Bairro, Cidade" value={enderecoEntrega} onChange={(e) => setEnderecoEntrega(e.target.value)} className="w-full bg-[#141416] border border-neutral-800 rounded-xl p-2.5 text-neutral-200" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-neutral-400 mb-1">Ponto de Referência</label>
                        <input type="text" placeholder="Ex: Ao lado do galpão" value={pontoReferencia} onChange={(e) => setPontoReferencia(e.target.value)} className="w-full bg-[#141416] border border-neutral-800 rounded-xl p-2.5 text-neutral-200" />
                      </div>
                      <div>
                        <label className="block text-neutral-400 mb-1">Responsável no Local</label>
                        <input type="text" placeholder="Nome de quem vai receber" value={responsavelRecebimento} onChange={(e) => setResponsavelRecebimento(e.target.value)} className="w-full bg-[#141416] border border-neutral-800 rounded-xl p-2.5 text-neutral-200" />
                      </div>
                    </div>
                  </div>

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

              {/* ETAPA 2: CARRINHO COM AUTOMAÇÃO DE DATAS */}
              {etapaLocacao === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-neutral-300 font-semibold mb-2">Clique nos Equipamentos para Adicionar ao Pacote</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-32 overflow-y-auto pr-1">
                      {equipamentos.map((eq) => {
                        const noCarrinho = itensLocacao.find(i => i.equipamento.id === eq.id);
                        return (
                          <div 
                            key={eq.id} 
                            onClick={() => adicionarAoCarrinho(eq)} 
                            className={`p-2 rounded-xl border cursor-pointer transition-all flex justify-between items-center ${
                              noCarrinho 
                                ? 'border-amber-500 bg-amber-500/10' 
                                : 'border-neutral-800 bg-[#0f0f10] hover:border-neutral-700'
                            }`}
                          >
                            <div>
                              <span className="text-[9px] text-amber-400 font-mono font-bold bg-neutral-800 px-1.5 py-0.5 rounded">
                                {eq.patrimonio || eq.codigo}
                              </span>
                              <h4 className="font-bold text-neutral-200 text-xs mt-0.5">{eq.nome}</h4>
                            </div>
                            <button type="button" className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded-lg text-[10px] font-bold">
                              {noCarrinho ? `+ ${noCarrinho.quantidade} un` : '+ Adicionar'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-[#0f0f10] border border-neutral-800 p-3 rounded-xl space-y-2">
                    <h4 className="font-bold text-amber-400 text-xs flex items-center gap-1.5">
                      <ShoppingCart size={14} /> Plano, Datas e Quantidade de Cada Equipamento ({itensLocacao.length})
                    </h4>

                    {itensLocacao.length === 0 ? (
                      <p className="text-neutral-500 text-center py-4 italic">Nenhum equipamento adicionado. Clique nos patrimônios acima para adicionar.</p>
                    ) : (
                      <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                        {itensLocacao.map((item) => {
                          const valDiaria = Number(item.equipamento.diaria) || 0;
                          
                          let valorUnitarioPlano = 0;
                          if (item.modalidade === 'diaria') {
                            valorUnitarioPlano = valDiaria * (item.diasDiaria > 0 ? item.diasDiaria : 1);
                          } else {
                            valorUnitarioPlano = Number(item.equipamento[item.modalidade]) || valDiaria;
                          }

                          const subtotalItem = valorUnitarioPlano * item.quantidade;

                          return (
                            <div key={item.equipamento.id} className="bg-[#141416] p-3 rounded-xl border border-neutral-800 space-y-3">
                              <div className="flex justify-between items-center">
                                <div>
                                  <strong className="text-neutral-200">[{item.equipamento.patrimonio || item.equipamento.codigo}]</strong> {item.equipamento.nome}
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-neutral-400 text-[11px]">Qtd:</span>
                                  <input 
                                    type="number" 
                                    min="1" 
                                    value={item.quantidade} 
                                    onChange={(e) => alterarQuantidadeCarrinho(item.equipamento.id, Number(e.target.value))} 
                                    className="w-12 bg-[#0f0f10] border border-neutral-700 rounded text-center text-amber-400 font-bold p-1"
                                  />
                                  <button type="button" onClick={() => removerDoCarrinho(item.equipamento.id)} className="text-rose-400 hover:text-rose-300 p-1"><X size={14} /></button>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-[#0f0f10] p-2 rounded-lg border border-neutral-800">
                                <div>
                                  <label className="block text-neutral-400 text-[10px] mb-1">Plano de Tarifa:</label>
                                  <select 
                                    value={item.modalidade} 
                                    onChange={(e) => alterarModalidadeItem(item.equipamento.id, e.target.value as any)}
                                    className="bg-[#141416] border border-neutral-700 rounded-lg p-1.5 text-amber-400 font-bold text-xs focus:outline-none focus:border-amber-500 w-full"
                                  >
                                    <option value="diaria">Diária (R$ {item.equipamento.diaria}/dia)</option>
                                    {item.equipamento.semanal && <option value="semanal">Semanal (R$ {item.equipamento.semanal})</option>}
                                    {item.equipamento.quinzenal && <option value="quinzenal">Quinzenal (R$ {item.equipamento.quinzenal})</option>}
                                    {item.equipamento.mensal && <option value="mensal">Mensal (R$ {item.equipamento.mensal})</option>}
                                    {item.equipamento.trimestral && <option value="trimestral">Trimestral (R$ {item.equipamento.trimestral})</option>}
                                    {item.equipamento.anual && <option value="anual">Anual (R$ {item.equipamento.anual})</option>}
                                  </select>
                                </div>

                                {item.modalidade === 'diaria' && (
                                  <div>
                                    <label className="block text-neutral-400 text-[10px] mb-1">Qtd. Diárias:</label>
                                    <input 
                                      type="number" 
                                      min="1"
                                      value={item.diasDiaria} 
                                      onChange={(e) => alterarDiasDiariaDirect(item.equipamento.id, Number(e.target.value))}
                                      className="bg-[#141416] border border-neutral-700 rounded-lg p-1.5 text-amber-400 font-bold text-xs text-center w-full focus:outline-none focus:border-amber-500"
                                    />
                                  </div>
                                )}
                              </div>

                              <div className="grid grid-cols-2 gap-2 pt-1">
                                <div>
                                  <label className="block text-neutral-400 text-[10px] mb-1 flex items-center gap-1">
                                    <Calendar size={11} className="text-amber-400" /> Entrega Prevista:
                                  </label>
                                  <input 
                                    type="date" 
                                    value={item.dataInicio} 
                                    onChange={(e) => alterarDataInicioItem(item.equipamento.id, e.target.value)} 
                                    className="w-full bg-[#0f0f10] border border-neutral-800 rounded-lg p-1.5 text-neutral-200 text-xs focus:border-amber-500 focus:outline-none" 
                                  />
                                </div>

                                <div>
                                  <label className="block text-neutral-400 text-[10px] mb-1 flex items-center gap-1">
                                    <Calendar size={11} className="text-amber-400" /> Devolução Prevista:
                                  </label>
                                  <input 
                                    type="date" 
                                    value={item.dataFim} 
                                    onChange={(e) => alterarDataFimItem(item.equipamento.id, e.target.value)} 
                                    className="w-full bg-[#0f0f10] border border-neutral-800 rounded-lg p-1.5 text-neutral-200 text-xs focus:border-amber-500 focus:outline-none" 
                                  />
                                </div>
                              </div>

                              <div className="flex justify-between items-center text-[11px] pt-1 border-t border-neutral-800 text-neutral-400">
                                <span>Subtotal do Item ({item.diasDiaria} dia(s)):</span>
                                <strong className="text-amber-400 text-xs">R$ {subtotalItem.toLocaleString('pt-BR')}</strong>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ETAPA 3: FECHAMENTO E FINANCEIRO */}
              {etapaLocacao === 3 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-neutral-400 mb-1 flex items-center gap-1">
                        <Tag size={12} className="text-amber-400" /> Desconto (R$)
                      </label>
                      <input type="number" placeholder="0.00" value={desconto || ''} onChange={(e) => setDesconto(Number(e.target.value))} className="w-full bg-[#0f0f10] border border-neutral-800 rounded-xl p-2.5 text-amber-400 font-bold focus:outline-none focus:border-amber-500" />
                    </div>

                    <div>
                      <label className="block text-neutral-400 mb-1 flex items-center gap-1">
                        <Truck size={12} className="text-amber-400" /> Frete / Logística (R$)
                      </label>
                      <input type="number" placeholder="0.00" value={frete || ''} onChange={(e) => setFrete(Number(e.target.value))} className="w-full bg-[#0f0f10] border border-neutral-800 rounded-xl p-2.5 text-neutral-100 font-bold focus:outline-none focus:border-amber-500" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-neutral-400 mb-1">Observação de Pagamento</label>
                    <input type="text" placeholder="Ex: 30 dias após emissão da nota fiscal / À vista no Pix" value={observacaoPagamento} onChange={(e) => setObservacaoPagamento(e.target.value)} className="w-full bg-[#0f0f10] border border-neutral-800 rounded-xl p-2.5 text-neutral-200" />
                  </div>

                  <div className="bg-[#0f0f10] border border-neutral-800 p-3 rounded-xl flex items-center justify-between">
                    <span className="text-neutral-300 font-semibold flex items-center gap-2">
                      <CreditCard size={16} className="text-amber-400" /> Status do Pagamento Inicial:
                    </span>
                    <div className="flex gap-2">
                      <button 
                        type="button" 
                        onClick={() => setStatusPagamento('Pago')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${statusPagamento === 'Pago' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500' : 'bg-neutral-800 text-neutral-400 border-transparent'}`}
                      >
                        Pago
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setStatusPagamento('Pendente')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${statusPagamento === 'Pendente' ? 'bg-amber-500/20 text-amber-400 border-amber-500' : 'bg-neutral-800 text-neutral-400 border-transparent'}`}
                      >
                        Pendente
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#0f0f10] border border-neutral-800 p-4 rounded-xl space-y-2">
                    <h4 className="font-bold text-amber-400 text-xs uppercase tracking-wider">
                      Resumo Final da Locação ({itensLocacao.length} equipamento(s))
                    </h4>
                    <div className="flex justify-between text-neutral-300"><span>Cliente:</span><strong>{clienteObj?.nome} {liberacaoExcecao && '(Exceção)'}</strong></div>
                    
                    <div className="text-neutral-300 space-y-1.5 py-2 border-y border-neutral-800/60 my-2">
                      <span className="text-neutral-400 font-semibold block mb-1">Itens, Datas e Planos Contratados:</span>
                      {itensLocacao.map((i, idx) => {
                        const valDiaria = Number(i.equipamento.diaria) || 0;
                        let valPlano = 0;
                        if (i.modalidade === 'diaria') {
                          valPlano = valDiaria * (i.diasDiaria > 0 ? i.diasDiaria : 1);
                        } else {
                          valPlano = Number(i.equipamento[i.modalidade]) || valDiaria;
                        }

                        return (
                          <div key={idx} className="bg-[#141416] p-2 rounded border border-neutral-800/60 space-y-1 text-[11px]">
                            <div className="flex justify-between font-bold">
                              <span>{i.quantidade}x [{i.equipamento.patrimonio || i.equipamento.codigo}] {i.equipamento.nome}</span>
                              <span className="text-amber-400 uppercase">{i.modalidade} ({i.diasDiaria}d)</span>
                            </div>
                            <div className="flex justify-between text-neutral-400 text-[10px]">
                              <span>Período: {i.dataInicio} até {i.dataFim}</span>
                              <span className="text-neutral-200">Subtotal: R$ {(valPlano * i.quantidade).toLocaleString('pt-BR')}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="flex justify-between text-neutral-400 pt-1">
                      <span>Subtotal Geral:</span>
                      <span>R$ {subtotal.toLocaleString('pt-BR')}</span>
                    </div>

                    {desconto > 0 && (
                      <div className="flex justify-between text-rose-400 font-semibold">
                        <span>Desconto Concedido:</span>
                        <span>- R$ {Number(desconto).toLocaleString('pt-BR')}</span>
                      </div>
                    )}

                    {frete > 0 && (
                      <div className="flex justify-between text-emerald-400 font-semibold">
                        <span>Taxa de Frete / Entrega:</span>
                        <span>+ R$ {Number(frete).toLocaleString('pt-BR')}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-3 border-t border-neutral-800 text-sm font-bold">
                      <span className="text-neutral-200">VALOR TOTAL FINAL:</span>
                      <span className="text-amber-400 text-lg font-black">R$ {valorTotal.toLocaleString('pt-BR')}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-neutral-800 flex justify-between items-center mt-auto">
                {etapaLocacao > 1 ? (
                  <button onClick={() => setEtapaLocacao(etapaLocacao - 1)} className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded-xl flex items-center gap-1">
                    <ArrowLeft size={16} /> Voltar
                  </button>
                ) : (
                  <div />
                )}

                {etapaLocacao < 3 ? (
                  <button 
                    disabled={!clienteId || (clienteObj?.status === 'Em Atraso' && !liberacaoExcecao) || (etapaLocacao === 2 && itensLocacao.length === 0)} 
                    onClick={() => setEtapaLocacao(etapaLocacao + 1)} 
                    className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl flex items-center gap-1 disabled:opacity-50"
                  >
                    Avançar <ArrowRight size={16} />
                  </button>
                ) : (
                  <button onClick={() => setModalContratoPreviaAberto(true)} className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl flex items-center gap-1">
                    Gerar Prévia do Contrato <Eye size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE PRÉ-VISUALIZAÇÃO DO CONTRATO OFICIAL */}
      {modalContratoPreviaAberto && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex justify-center items-start z-[100] p-2 sm:p-6 overflow-y-auto print:p-0 print:static print:bg-white">
          <div className="bg-white text-black w-full max-w-3xl my-4 p-8 sm:p-12 shadow-2xl rounded-lg font-sans border text-xs leading-relaxed print:shadow-none print:p-0 print:border-none print:w-full print:my-0">
            
            {/* BARRA DE AÇÕES DO OPERADOR */}
            <div className="bg-neutral-900 text-white p-4 -mx-8 -mt-8 sm:-mx-12 sm:-mt-12 mb-8 rounded-t-lg flex justify-between items-center print:hidden">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-amber-400" />
                <span className="font-bold text-sm">Conferência do Contrato de Locação</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setModalContratoPreviaAberto(false)} className="px-3 py-1.5 bg-neutral-800 text-neutral-300 rounded-lg flex items-center gap-1 hover:bg-neutral-700 text-xs">
                  <Edit3 size={14} /> Editar
                </button>
                
                <button onClick={confirmarEImprimirLocacao} className="px-3.5 py-1.5 bg-emerald-500 text-black font-bold rounded-lg flex items-center gap-1.5 hover:bg-emerald-400 shadow-lg text-xs">
                  <Printer size={16} /> Salvar em PDF / Imprimir
                </button>

                <button onClick={fecharModalLocacao} title="Cancelar e Fechar Prévia" className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-all ml-1">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* CABEÇALHO DO CONTRATO */}
            <div className="border-b pb-4 mb-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img 
                  src="/logo.png" 
                  alt="Império Locações" 
                  className="h-16 w-auto object-contain mix-blend-multiply" 
                />
                <div>
                  <h1 className="text-xl font-black uppercase tracking-wider text-black">IMPÉRIO LOCAÇÕES</h1>
                  <h2 className="text-xs font-bold text-neutral-600 uppercase tracking-widest">Locação de Equipamentos e Ferramentas</h2>
                </div>
              </div>
            </div>

            <div className="text-center font-bold text-sm uppercase my-4 underline">
              CONTRATO DE LOCAÇÃO DE BENS MÓVEIS E TERMO DE RESPONSABILIDADE
            </div>

            {/* 1. DAS PARTES CONTRATANTES */}
            <div className="space-y-2 mb-4">
              <h3 className="font-bold border-b pb-1">1. DAS PARTES CONTRATANTES</h3>
              <p><strong>LOCADOR:</strong> RONALDO PEREIRA DA SILVA (Império Locações) | <strong>CNPJ:</strong> 36.921.389/0001-55</p>
              <p><strong>Endereço:</strong> Rua Estrela Dalva, nº 95, Bairro Satélite, Juatuba - MG | <strong>Contato:</strong> (31) 9 9071-0014</p>
              
              <div className="pt-2 space-y-1">
                <p><strong>LOCATÁRIO:</strong> {clienteObj?.nome || '________________________________________________'}</p>
                <p><strong>CNPJ/CPF:</strong> {clienteObj?.cpf_cnpj || clienteObj?.cpf || '____________________'} | <strong>Contato:</strong> {clienteObj?.telefone || '____________________'}</p>
                <p><strong>Endereço Residencial/Sede:</strong> {clienteObj?.endereco || '________________________________________________'}</p>
                <p><strong>Endereço de Entrega/Obra:</strong> {enderecoEntrega || '________________________________________________'}</p>
              </div>
            </div>

            {/* 2. DAS CLÁUSULAS E CONDIÇÕES GERAIS */}
            <div className="space-y-2 mb-4 text-[11px] text-justify">
              <h3 className="font-bold border-b pb-1 text-xs">2. DAS CLÁUSULAS E CONDIÇÕES GERAIS</h3>
              <p>Por este instrumento particular de contrato de locação de bens móveis e na melhor forma de direito, as partes acima qualificadas têm entre si justo e acordado o presente termo, mediante as cláusulas e condições subsequentes:</p>
              <p><strong>Cláusula Primeira (Do Recebimento e Segurança):</strong> O LOCATÁRIO declara, para fins de direito, ter recebido discriminados o(s) equipamento(s) abaixo descritos em perfeitas condições de uso e funcionamento, bem como declara ter recebido todas as devidas instruções técnicas de operação e segurança, tendo conferido os equipamentos integralmente junto ao LOCADOR no ato da entrega.</p>
              <p><strong>Cláusula Segunda (Da Responsabilidade Civil e Financeira):</strong> O(s) equipamento(s) locado(s), a partir da presente data de retirada/saída, passa(m) a ser de total responsabilidade civil, criminal e financeira do LOCATÁRIO. Esta responsabilidade abrange integralmente o valor das diárias acumuladas, despesas de transporte, bem como o valor estipulado a título de indenização em caso de danos, avarias, furto, roubo ou perda total dos bens.</p>
              <p><strong>Cláusula Terceira (Da Conservação e Devolução):</strong> O LOCATÁRIO compromete-se a zelar pela integridade dos equipamentos e a devolvê-los em perfeito estado de funcionamento e limpeza, nas mesmas condições em que lhe foram entregues.</p>
              <p><strong>Cláusula Quarta (Do Prazo e Atrasos):</strong> A devolução do equipamento deverá ser realizada obrigatoriamente na data e horário acordados neste instrumento. Caso a devolução não seja efetuada no prazo estipulado, iniciar-se-á de forma automática a cobrança de novas diárias pelo período excedente de atraso, sem prejuízo de eventuais perdas e danos.</p>
              <p><strong>Cláusula Quinta (Do Recebimento por Terceiros):</strong> Fica estabelecido que é de exclusiva responsabilidade do LOCATÁRIO a autorização e indicação de terceiros para o recebimento dos equipamentos no local de entrega, respondendo o contratante plenamente por qualquer assinatura, ato ou informação prestada por estes.</p>
            </div>

            {/* 3. DISCRIMINAÇÃO DOS EQUIPAMENTOS, PLANOS, PERÍODOS E VALORES */}
            <div className="space-y-3 mb-6">
              <h3 className="font-bold border-b pb-1">3. DISCRIMINAÇÃO DOS EQUIPAMENTOS, VALORES E PRAZOS</h3>
              
              <table className="w-full border-collapse border border-neutral-400 text-center text-[10px]">
                <thead>
                  <tr className="bg-neutral-100 border-b border-neutral-400 font-bold">
                    <th className="border border-neutral-400 p-1.5">Qtd.</th>
                    <th className="border border-neutral-400 p-1.5 text-left">Discriminação do Equipamento</th>
                    <th className="border border-neutral-400 p-1.5">Plano Contratado</th>
                    <th className="border border-neutral-400 p-1.5">Previsão Entrega / Devolução</th>
                    <th className="border border-neutral-400 p-1.5">Valor Subtotal</th>
                    <th className="border border-neutral-400 p-1.5">Indenização</th>
                  </tr>
                </thead>
                <tbody>
                  {itensLocacao.map((item, index) => {
                    const mod = item.modalidade || 'diaria';
                    const valDiaria = Number(item.equipamento.diaria) || 0;
                    
                    let valPlano = 0;
                    if (mod === 'diaria') {
                      valPlano = valDiaria * (item.diasDiaria > 0 ? item.diasDiaria : 1);
                    } else {
                      valPlano = Number(item.equipamento[mod]) || valDiaria;
                    }

                    const subtotalItem = valPlano * item.quantidade;

                    return (
                      <tr key={index}>
                        <td className="border border-neutral-400 p-1.5 font-bold">{String(item.quantidade).padStart(2, '0')}</td>
                        <td className="border border-neutral-400 p-1.5 text-left font-bold">
                          [{item.equipamento?.patrimonio || item.equipamento?.codigo}] {item.equipamento?.nome}
                        </td>
                        <td className="border border-neutral-400 p-1.5 uppercase font-bold text-neutral-800">
                          {mod} ({item.diasDiaria}d)
                        </td>
                        <td className="border border-neutral-400 p-1.5 text-[9px]">
                          {item.dataInicio} à {item.dataFim}
                        </td>
                        <td className="border border-neutral-400 p-1.5 font-bold">
                          R$ {subtotalItem.toLocaleString('pt-BR')}
                        </td>
                        <td className="border border-neutral-400 p-1.5 text-neutral-700">
                          R$ {Number(item.equipamento?.valor_indenizacao || 13800).toLocaleString('pt-BR')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="bg-neutral-50 p-3 border rounded-lg space-y-1">
                <div className="flex justify-between font-bold text-sm">
                  <span>VALOR TOTAL DA LOCAÇÃO:</span>
                  <span className="text-black">R$ {valorTotal.toLocaleString('pt-BR')}</span>
                </div>
                {desconto > 0 && <p className="text-[11px] text-neutral-600">Desconto Concedido: R$ {desconto.toLocaleString('pt-BR')}</p>}
                {frete > 0 && <p className="text-[11px] text-neutral-600">Taxa de Frete / Entrega: R$ {frete.toLocaleString('pt-BR')}</p>}
                <p className="text-[11px] font-semibold pt-1 border-t">Observação de Pagamento: {observacaoPagamento}</p>
              </div>
            </div>

            {/* RODAPÉ E ASSINATURAS */}
            <div className="pt-6 mt-8 border-t space-y-6 text-center">
              <p>E, por estarem assim justos e acordados, as partes assinam o presente instrumento em duas vias de igual teor e forma.</p>
              <p className="font-semibold">Juatuba - MG, {new Date().getDate()} de {new Date().toLocaleDateString('pt-BR', { month: 'long' })} de {new Date().getFullYear()}.</p>

              <div className="grid grid-cols-2 gap-8 pt-8">
                <div>
                  <div className="border-t border-black w-4/5 mx-auto mb-1"></div>
                  <p className="font-bold">LOCATÁRIO: {clienteObj?.nome}</p>
                  <p className="text-[10px]">CNPJ/CPF: {clienteObj?.cpf_cnpj || clienteObj?.cpf}</p>
                </div>
                <div>
                  <div className="border-t border-black w-4/5 mx-auto mb-1"></div>
                  <p className="font-bold">LOCADOR: IMPÉRIO LOCAÇÕES</p>
                  <p className="text-[10px]">CNPJ: 36.921.389/0001-55</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* MODAL CONFIGURAÇÕES */}
      {modalConfiguracoesAberto && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4 print:hidden">
          <div className="bg-[#141416] border border-neutral-800 text-neutral-100 w-full max-w-md rounded-2xl shadow-2xl p-5 space-y-4 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
              <h3 className="font-bold text-sm text-neutral-100">Configurações do Sistema</h3>
              <button onClick={() => setModalConfiguracoesAberto(false)}><X size={18} /></button>
            </div>
            <p className="text-neutral-400">Painel de configurações da empresa e preferências gerais.</p>
          </div>
        </div>
      )}

    </div>
  );
}