import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ArrowLeft, Plus, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import Head from 'next/head';

const supabase = createClient('SUA_URL', 'SUA_CHAVE');

export default function FinanceiroNegocio() {
  const router = useRouter();
  const [transacoes, setTransacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [abaAtiva, setAbaAtiva] = useState('mensal'); // 'mensal' ou 'futuro'

  useEffect(() => { carregarDados(); }, []);

  async function carregarDados() {
    const { data } = await supabase.from('financeiro_negocio').select('*').order('data_vencimento', { ascending: true });
    if (data) setTransacoes(data);
    setLoading(false);
  }

  // Lógica de Datas
  const hoje = new Date();
  const mesAtual = hoje.getMonth();
  const anoAtual = hoje.getFullYear();

  // Filtragem por Abas
  const transacoesMensais = transacoes.filter(t => {
    const dataVenc = new Date(t.data_vencimento);
    return dataVenc.getMonth() === mesAtual && dataVenc.getFullYear() === anoAtual;
  });

  const transacoesFuturas = transacoes.filter(t => {
    const dataVenc = new Date(t.data_vencimento);
    return dataVenc > new Date(anoAtual, mesAtual + 1, 0); // Tudo após o último dia do mês atual
  });

  const listaExibida = abaAtiva === 'mensal' ? transacoesMensais : transacoesFuturas;

  // Cálculos do Painel (Sempre baseados no Mês Atual para controle de caixa)
  const receitaMes = transacoesMensais.filter(t => t.tipo === 'receita').reduce((acc, curr) => acc + Number(curr.valor), 0);
  const despesaMes = transacoesMensais.filter(t => t.tipo === 'despesa').reduce((acc, curr) => acc + Number(curr.valor), 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#5a5b5b] to-[#7e7f7f] font-sans pb-10 px-6">
      <Head><title>Financeiro | NC</title></Head>

      {/* HEADER */}
      <div className="pt-16 pb-8 max-w-2xl mx-auto flex justify-between items-center text-white">
        <button onClick={() => router.push('/')} className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition"><ArrowLeft size={20}/></button>
        <h1 className="text-xs font-bold uppercase tracking-[4px]">Gestão Financeira</h1>
        <button onClick={() => router.push('/financeiro-novo')} className="p-3 bg-[#ded0b8] rounded-2xl text-white shadow-lg"><Plus size={20}/></button>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* CARD DE RESUMO MENSAL */}
        <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-[40px] p-8 text-center shadow-2xl">
          <p className="text-[#ded0b8] text-[9px] font-bold uppercase tracking-[4px] mb-2">Lucro Projetado (Mês Atual)</p>
          <h2 className="text-white text-3xl font-bold mb-6">
            R$ {(receitaMes - despesaMes).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-emerald-500/10 p-4 rounded-3xl border border-emerald-500/20 text-emerald-400">
              <TrendingUp size={14} className="mx-auto mb-1" />
              <p className="text-[10px] font-bold uppercase tracking-widest">Receitas</p>
              <p className="text-white font-bold text-sm">R$ {receitaMes.toLocaleString('pt-BR')}</p>
            </div>
            <div className="bg-red-500/10 p-4 rounded-3xl border border-red-500/20 text-red-400">
              <TrendingDown size={14} className="mx-auto mb-1" />
              <p className="text-[10px] font-bold uppercase tracking-widest">Despesas</p>
              <p className="text-white font-bold text-sm">R$ {despesaMes.toLocaleString('pt-BR')}</p>
            </div>
          </div>
        </div>

        {/* SELETOR DE ABAS */}
        <div className="flex gap-6 border-b border-white/10 px-4">
          <button 
            onClick={() => setAbaAtiva('mensal')}
            className={`pb-4 text-[10px] font-bold uppercase tracking-[2px] ${abaAtiva === 'mensal' ? 'text-[#ded0b8] border-b-2 border-[#ded0b8]' : 'text-white/30'}`}
          >
            Este Mês
          </button>
          <button 
            onClick={() => setAbaAtiva('futuro')}
            className={`pb-4 text-[10px] font-bold uppercase tracking-[2px] ${abaAtiva === 'futuro' ? 'text-[#ded0b8] border-b-2 border-[#ded0b8]' : 'text-white/30'}`}
          >
            Futuros
          </button>
        </div>

        {/* LISTA DINÂMICA */}
        <div className="space-y-3">
          {listaExibida.map(t => (
            <div key={t.id} className="bg-white/5 border border-white/5 rounded-[30px] p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${t.tipo === 'receita' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}><DollarSign size={20}/></div>
                <div>
                  <h4 className="text-white text-xs font-bold uppercase">{t.descricao}</h4>
                  <p className="text-[8px] text-white/30 font-bold uppercase mt-1">{new Date(t.data_vencimento).toLocaleDateString('pt-BR')} • {t.categoria}</p>
                </div>
              </div>
              <p className={`text-sm font-bold ${t.tipo === 'receita' ? 'text-emerald-400' : 'text-white'}`}>
                R$ {Number(t.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          ))}
          {listaExibida.length === 0 && <p className="text-center py-10 text-white/20 uppercase text-[9px] tracking-widest">Sem lançamentos para este período</p>}
        </div>
      </div>
    </div>
  );
}
