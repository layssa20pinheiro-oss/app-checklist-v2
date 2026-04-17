import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Plus, Users, Calendar, Briefcase, ChevronRight, Wallet, Sparkles } from 'lucide-react';
import Head from 'next/head';

const supabase = createClient(
  'https://rticfwqptlxkpgawpzwf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0aWNmd3FwdGx4a3BnYXdwendmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NDA2MTEsImV4cCI6MjA4OTQxNjYxMX0.vOmi-rKKxXuZ5SP7uZe81Cr0fKW_fWN4Hmuf90soijM'
);

export default function DashboardNC() {
  const router = useRouter();
  const [estatisticas, setEstatisticas] = useState({ ativos: 0, saldo: 0 });

  useEffect(() => {
    async function carregarDashboard() {
      const { count } = await supabase.from('eventos').select('*', { count: 'exact', head: true });
      const { data: fin } = await supabase.from('financeiro_negocio').select('valor, tipo');
      
      const total = fin?.reduce((acc, curr) => 
        curr.tipo === 'receita' ? acc + Number(curr.valor) : acc - Number(curr.valor), 0) || 0;
      
      setEstatisticas({ ativos: count || 0, saldo: total });
    }
    carregarDashboard();
  }, []);

  return (
    <div className="min-h-screen bg-[#7e7f7f] font-sans pb-10">
      <Head><title>Studio NC | Controladoria de Eventos</title></Head>

      {/* HEADER PREMIUM */}
      <div className="pt-20 pb-12 px-8 max-w-2xl mx-auto flex justify-between items-center text-white">
        <div>
          <div className="flex items-center gap-2 mb-1 opacity-60">
            <Sparkles size={12} className="text-[#ded0b8]" />
            <span className="text-[10px] font-bold uppercase tracking-[4px]">Gestão de Elite</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tighter">Olá, Lay!</h1>
        </div>
        <button 
          onClick={() => router.push('/eventos-novo')}
          className="p-5 bg-[#ded0b8] rounded-[30px] text-white shadow-[0_15px_35px_rgba(222,208,184,0.3)] active:scale-95 transition-all"
        >
          <Plus size={28} />
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-6 space-y-8">
        
        {/* CARDS DE RESUMO (A BELEZA DOS NÚMEROS) */}
        <div className="grid grid-cols-2 gap-5">
          <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-7 rounded-[45px] shadow-2xl">
            <div className="w-10 h-10 bg-[#ded0b8]/20 rounded-2xl flex items-center justify-center mb-4 text-[#ded0b8]">
              <Users size={20} />
            </div>
            <p className="text-white/40 text-[9px] font-bold uppercase tracking-[3px] mb-1">Eventos Ativos</p>
            <h3 className="text-white text-2xl font-bold">{estatisticas.ativos}</h3>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-7 rounded-[45px] shadow-2xl">
            <div className="w-10 h-10 bg-[#ded0b8]/20 rounded-2xl flex items-center justify-center mb-4 text-[#ded0b8]">
              <Wallet size={20} />
            </div>
            <p className="text-white/40 text-[9px] font-bold uppercase tracking-[3px] mb-1">Saldo em Caixa</p>
            <h3 className="text-white text-2xl font-bold">R$ {estatisticas.saldo.toLocaleString('pt-BR')}</h3>
          </div>
        </div>

        {/* MENU DE NAVEGAÇÃO SOFISTICADO */}
        <div className="bg-white rounded-[50px] p-6 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] space-y-3">
          {[
            { label: 'Meus Eventos', sub: 'Gestão completa das noivas', rota: '/eventos-lista', icon: <Users size={20}/> },
            { label: 'Gestão Financeira', sub: 'Lucros e projeções futuras', rota: '/financeiro', icon: <Briefcase size={20}/> },
            { label: 'Minha Agenda', sub: 'Compromissos e visitas', rota: '/agenda', icon: <Calendar size={20}/> }
          ].map((item, idx) => (
            <button 
              key={idx}
              onClick={() => router.push(item.rota)}
              className="w-full flex items-center justify-between p-6 hover:bg-gray-50 rounded-[35px] transition-all group border border-transparent hover:border-gray-100"
            >
              <div className="flex items-center gap-5">
                <div className="p-4 bg-gray-50 rounded-2xl text-gray-400 group-hover:bg-[#ded0b8]/10 group-hover:text-[#ded0b8] transition-all">
                  {item.icon}
                </div>
                <div className="text-left">
                  <h4 className="text-[13px] font-bold text-gray-800 uppercase tracking-tight">{item.label}</h4>
                  <p className="text-[10px] text-gray-400 font-medium">{item.sub}</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-300 group-hover:translate-x-1 transition-transform" />
            </button>
          ))}
        </div>

        {/* ASSINATURA */}
        <div className="text-center pt-8">
            <p className="text-white/20 text-[9px] font-bold uppercase tracking-[6px]">NC Cerimonial & Eventos</p>
        </div>
      </div>
    </div>
  );
}
