import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ArrowLeft, Plus, TrendingUp, TrendingDown, DollarSign, Filter } from 'lucide-react';
import Head from 'next/head';

const supabase = createClient(
  'https://rticfwqptlxkpgawpzwf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0aWNmd3FwdGx4a3BnYXdwendmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NDA2MTEsImV4cCI6MjA4OTQxNjYxMX0.vOmi-rKKxXuZ5SP7uZe81Cr0fKW_fWN4Hmuf90soijM'
);

export default function FinanceiroNegocio() {
  const router = useRouter();
  const [transacoes, setTransacoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    carregarDados(); 
  }, []);

  async function carregarDados() {
    const { data } = await supabase
      .from('financeiro_negocio')
      .select('*')
      .order('data_vencimento', { ascending: true });
    
    if (data) setTransacoes(data);
    setLoading(false);
  }

  // Cálculos de Controladoria
  const totalReceitas = transacoes
    .filter(t => t.tipo === 'receita')
    .reduce((acc, curr) => acc + Number(curr.valor), 0);
  
  const totalDespesas = transacoes
    .filter(t => t.tipo === 'despesa')
    .reduce((acc, curr) => acc + Number(curr.valor), 0);
  
  const saldo = totalReceitas - totalDespesas;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#5a5b5b] to-[#7e7f7f] font-sans pb-10 px-6">
      <Head><title>Financeiro | Studio NC</title></Head>

      {/* HEADER: BOTÃO VOLTAR | TÍTULO | BOTÃO NOVO */}
      <div className="pt-16 pb-8 max-w-2xl mx-auto flex justify-between items-center text-white">
        <button 
          onClick={() => router.push('/')} 
          className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition shadow-lg"
        >
          <ArrowLeft size={20} />
        </button>
        
        <h1 className="text-xs font-bold uppercase tracking-[4px]">Gestão Financeira</h1>
        
        <button 
          onClick={() => router.push('/financeiro-novo')}
          className="p-3 bg-[#ded0b8] rounded-2xl text-white shadow-xl active:scale-95 transition"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* CARD DE RESUMO (LUCRO) */}
        <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-[40px] p-8 text-center shadow-2xl ring-1 ring-white/5">
          <p className="text-[#ded0b8] text-[10px] font-bold uppercase tracking-[3px] mb-2">Saldo Total em Caixa</p>
          <h2 className="text-white text-3xl font-bold mb-6 tracking-tight">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(saldo)}
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-emerald-500/10 p-4 rounded-3xl border border-emerald-500/20">
              <div className="flex items-center justify-center gap-2 text-emerald-400 mb-1">
                <TrendingUp size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Receitas</span>
              </div>
              <p className="text-white font-bold text-sm">R$ {totalReceitas.toLocaleString('pt-BR')}</p>
            </div>
            
            <div className="bg-red-500/10 p-4 rounded-3xl border border-red-500/20">
              <div className="flex items-center justify-center gap-2 text-red-400 mb-1">
                <TrendingDown size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Despesas</span>
              </div>
              <p className="text-white font-bold text-sm">R$ {totalDespesas.toLocaleString('pt-BR')}</p>
            </div>
          </div>
        </div>

        {/* LISTA DE LANÇAMENTOS */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/30">Fluxo de Caixa Recente</h3>
            <Filter size={14} className="text-white/20" />
          </div>

          {loading ? (
             <p className="text-center py-20 text-white/20 uppercase text-[9px] tracking-widest animate-pulse">Carregando lançamentos...</p>
          ) : (
            <>
              {transacoes.map((t) => (
                <div key={t.id} className="bg-white/5 backdrop-blur-sm border border-white/5 rounded-[30px] p-5 flex items-center gap-4 hover:bg-white/10 transition-all">
                  <div className={`p-3 rounded-2xl ${t.tipo === 'receita' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                    <DollarSign size={18} />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="text-white text-xs font-bold uppercase tracking-tight">{t.descricao}</h4>
                    <p className="text-[9px] text-white/30 uppercase mt-1 font-bold">
                      {new Date(t.data_vencimento).toLocaleDateString('pt-BR')} • {t.categoria}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className={`text-sm font-bold ${t.tipo === 'receita' ? 'text-emerald-400' : 'text-white'}`}>
                      {t.tipo === 'despesa' ? '-' : '+'} R$ {Number(t.valor).toLocaleString('pt-BR')}
                    </p>
                    <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${t.status === 'concluido' ? 'bg-emerald-500/10 text-emerald-500/60' : 'bg-orange-500/10 text-orange-400/60'}`}>
                      {t.status}
                    </span>
                  </div>
                </div>
              ))}

              {transacoes.length === 0 && (
                <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-[40px]">
                  <p className="text-white/20 text-[9px] font-bold uppercase tracking-widest">Nenhum lançamento encontrado</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
