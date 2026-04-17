import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  LayoutDashboard, Briefcase, Calendar, 
  Settings2, DollarSign, Plus, Clock, ChevronRight 
} from 'lucide-react';
import Head from 'next/head';

const supabase = createClient(
  'https://rticfwqptlxkpgawpzwf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0aWNmd3FwdGx4a3BnYXdwendmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NDA2MTEsImV4cCI6MjA4OTQxNjYxMX0.vOmi-rKKxXuZ5SP7uZe81Cr0fKW_fWN4Hmuf90soijM'
);

export default function HomeAdmin() {
  const router = useRouter();
  const [saudacao, setSaudacao] = useState('');
  const [estatisticas, setEstatisticas] = useState({ ativos: 0, saldo: 0 });

  useEffect(() => {
    // Lógica de saudação por horário
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12) setSaudacao('Bom dia');
    else if (hora >= 12 && hora < 18) setSaudacao('Boa tarde');
    else setSaudacao('Boa noite');

    carregarDashboard();
  }, []);

  async function carregarDashboard() {
    const { count } = await supabase.from('eventos').select('*', { count: 'exact', head: true });
    const { data: fin } = await supabase.from('financeiro_negocio').select('valor, tipo');
    
    const total = fin?.reduce((acc, curr) => 
      curr.tipo === 'receita' ? acc + Number(curr.valor) : acc - Number(curr.valor), 0) || 0;
    
    setEstatisticas({ ativos: count || 0, saldo: total });
  }

  const modulos = [
    { id: 1, titulo: 'Meus Eventos', icon: <LayoutDashboard size={20}/>, rota: '/eventos-lista' },
    { id: 2, titulo: 'Gestão Financeira', icon: <DollarSign size={20}/>, rota: '/financeiro' },
    { id: 3, titulo: 'Minha Agenda', icon: <Calendar size={20}/>, rota: '/agenda' },
    { id: 4, titulo: 'Parceiros Master', icon: <Briefcase size={20}/>, rota: '/catalogo-fornecedores' },
  ];

  return (
    <div className="min-h-screen bg-[#7e7f7f] font-sans pb-10 px-6">
      <Head><title>Studio de Gestão | NC</title></Head>

      {/* HEADER LOGO E SAUDAÇÃO */}
      <div className="pt-16 pb-10 max-w-2xl mx-auto text-center relative">
        {/* LOGO AMPLIADA (de h-10 para h-24) */}
        <img src="/logo_nc_transparente.png" alt="NC" className="h-24 mx-auto mb-10 object-contain opacity-90" />
        
        <p className="text-[#ded0b8] text-[9px] uppercase font-bold tracking-[5px] mb-2">{saudacao}, Lay Pinheiro</p>
        <h1 className="text-white text-xl font-light uppercase tracking-[3px]">Studio de Gestão</h1>
        
        {/* BOTÃO FLUTUANTE PARA NOVO CONTRATO */}
        <button 
          onClick={() => router.push('/eventos-novo')}
          className="absolute right-0 top-16 p-4 bg-[#ded0b8] rounded-[25px] text-white shadow-2xl active:scale-95 transition-all"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* CARDS DE RESUMO (CONTROLADORIA) */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-[35px] shadow-xl ring-1 ring-white/5">
            <p className="text-[#ded0b8] text-[8px] font-bold uppercase tracking-[3px] mb-1">Eventos Ativos</p>
            <h3 className="text-white text-xl font-bold tracking-tight">{estatisticas.ativos}</h3>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-[35px] shadow-xl ring-1 ring-white/5">
            <p className="text-[#ded0b8] text-[8px] font-bold uppercase tracking-[3px] mb-1">Saldo em Caixa</p>
            <h3 className="text-white text-xl font-bold tracking-tight">R$ {estatisticas.saldo.toLocaleString('pt-BR')}</h3>
          </div>
        </div>

        {/* PRÓXIMO COMPROMISSO (PRIORIDADE) */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-[35px] p-6 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-all">
          <div className="flex items-center gap-5">
            <div className="p-3 bg-[#ded0b8]/20 text-[#ded0b8] rounded-2xl">
              <Clock size={22} />
            </div>
            <div>
              <h2 className="text-[9px] font-bold uppercase tracking-widest text-white/30 mb-1">Próximo Compromisso</h2>
              <h3 className="text-white text-xs font-bold uppercase">14:00 - Reunião Técnica (Julia)</h3>
            </div>
          </div>
          <ChevronRight size={18} className="text-white/20 group-hover:text-[#ded0b8] transition-all" />
        </div>

        {/* MENU EM GRID (BOTÕES CHAMPAGNE) */}
        <div className="grid grid-cols-2 gap-4 pb-10">
          {modulos.map(item => (
            <button 
              key={item.id}
              onClick={() => router.push(item.rota)}
              className="group bg-white/5 border border-white/10 p-6 rounded-[40px] flex flex-col items-center gap-4 hover:bg-white/10 transition-all active:scale-95 shadow-lg"
            >
              <div className="w-14 h-14 rounded-[20px] flex items-center justify-center bg-[#ded0b8]/10 text-[#ded0b8] group-hover:bg-[#ded0b8] group-hover:text-white transition-all duration-500 shadow-inner">
                {item.icon}
              </div>
              <h3 className="text-white font-bold text-[9px] uppercase tracking-[2px]">{item.titulo}</h3>
            </button>
          ))}
        </div>

        <div className="text-center">
            <p className="text-white/10 text-[8px] font-bold uppercase tracking-[6px]">NC Cerimonial & Eventos © 2026</p>
        </div>
      </div>
    </div>
  );
}
