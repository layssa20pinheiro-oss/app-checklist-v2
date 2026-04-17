import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Plus, Users, Calendar, DollarSign, Briefcase, ChevronRight } from 'lucide-react';
import Head from 'next/head';

const supabase = createClient(
  'https://rticfwqptlxkpgawpzwf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0aWNmd3FwdGx4a3BnYXdwendmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NDA2MTEsImV4cCI6MjA4OTQxNjYxMX0.vOmi-rKKxXuZ5SP7uZe81Cr0fKW_fWN4Hmuf90soijM'
);

export default function Dashboard() {
  const router = useRouter();
  const [resumo, setResumo] = useState({ eventos: 0, financeiro: 0 });

  useEffect(() => {
    async function carregarResumo() {
      const { count } = await supabase.from('eventos').select('*', { count: 'exact', head: true });
      const { data: fin } = await supabase.from('financeiro_negocio').select('valor, tipo');
      
      const saldo = fin?.reduce((acc, curr) => 
        curr.tipo === 'receita' ? acc + Number(curr.valor) : acc - Number(curr.valor), 0) || 0;
      
      setResumo({ eventos: count || 0, financeiro: saldo });
    }
    carregarResumo();
  }, []);

  return (
    <div className="min-h-screen bg-[#7e7f7f] font-sans pb-10 px-6">
      <Head><title>Studio NC | Gestão de Luxo</title></Head>

      {/* HEADER COM SAUDAÇÃO */}
      <div className="pt-16 pb-10 max-w-2xl mx-auto flex justify-between items-end">
        <div>
          <p className="text-white/40 text-[10px] uppercase font-bold tracking-[4px] mb-1">Seja bem-vinda</p>
          <h1 className="text-white text-3xl font-bold tracking-tight">Olá, Lay!</h1>
        </div>
        <button 
          onClick={() => router.push('/eventos-novo')}
          className="p-4 bg-[#ded0b8] rounded-[24px] text-white shadow-2xl active:scale-95 transition-all"
        >
          <Plus size={28} />
        </button>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* CARDS DE RESUMO RÁPIDO */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-[35px] border border-white/10">
            <Calendar className="text-[#ded0b8] mb-3" size={20} />
            <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest">Eventos</p>
            <h3 className="text-white text-xl font-bold">{resumo.eventos} Ativos</h3>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-[35px] border border-white/10">
            <DollarSign className="text-[#ded0b8] mb-3" size={20} />
            <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest">Caixa</p>
            <h3 className="text-white text-xl font-bold">R$ {resumo.financeiro.toLocaleString('pt-BR')}</h3>
          </div>
        </div>

        {/* MENU DE NAVEGAÇÃO PRINCIPAL */}
        <div className="bg-white rounded-[40px] p-4 shadow-2xl space-y-2">
          {[
            { label: 'Meus Eventos', sub: 'Gestão de noivas e cronogramas', rota: '/eventos-lista', icon: <Users size={20}/> },
            { label: 'Gestão Financeira', sub: 'Fluxo de caixa e lucros', rota: '/financeiro', icon: <Briefcase size={20}/> },
            { label: 'Minha Agenda', sub: 'Reuniões e visitas técnicas', rota: '/agenda', icon: <Calendar size={20}/> }
          ].map((item, idx) => (
            <button 
              key={idx}
              onClick={() => router.push(item.rota)}
              className="w-full flex items-center justify-between p-5 hover:bg-gray-50 rounded-[30px] transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-100 rounded-2xl text-gray-400 group-hover:bg-[#ded0b8]/10 group-hover:text-[#ded0b8] transition-all">
                  {item.icon}
                </div>
                <div className="text-left">
                  <h4 className="text-sm font-bold text-gray-700 uppercase tracking-tight">{item.label}</h4>
                  <p className="text-[10px] text-gray-400 font-medium">{item.sub}</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-300" />
            </button>
          ))}
        </div>

        {/* LEMBRETE DE CONTROLADORIA */}
        <div className="text-center pt-4">
            <p className="text-white/20 text-[8px] font-bold uppercase tracking-[4px]">NC Cerimonial & Eventos © 2026</p>
        </div>
      </div>
    </div>
  );
}
