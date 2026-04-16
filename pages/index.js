import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Briefcase, Calendar, 
  Settings2, DollarSign, Bell, ArrowRight, Clock 
} from 'lucide-react';
import Head from 'next/head';

export default function HomeAdmin() {
  const router = useRouter();
  const [saudacao, setSaudacao] = useState('');

  // Lógica de Saudação Dinâmica
  useEffect(() => {
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12) setSaudacao('Bom dia');
    else if (hora >= 12 && hora < 18) setSaudacao('Boa tarde');
    else setSaudacao('Boa noite');
  }, []);

  const modulos = [
    { id: 1, titulo: 'Meus Eventos', icon: <LayoutDashboard size={24}/>, cor: 'bg-blue-500/20 text-blue-400', rota: '/eventos-lista' },
    { id: 2, titulo: 'Controle Financeiro', icon: <DollarSign size={24}/>, cor: 'bg-emerald-500/20 text-emerald-400', rota: '/financeiro' },
    { id: 3, titulo: 'Agenda', icon: <Calendar size={24}/>, cor: 'bg-orange-500/20 text-orange-400', rota: '/agenda' },
    { id: 4, titulo: 'Parceiros Master', icon: <Briefcase size={24}/>, cor: 'bg-[#ded0b8]/20 text-[#ded0b8]', rota: '/catalogo-fornecedores' },
    { id: 5, titulo: 'Configuração Geral', icon: <Settings2 size={24}/>, cor: 'bg-purple-500/20 text-purple-400', rota: '/config-global' },
  ];

  return (
    <div className="min-h-screen bg-[#7e7f7f] font-sans pb-10">
      <Head><title>Admin | NC Cerimonial</title></Head>

      {/* HEADER: LOGO E SAUDAÇÃO */}
      <div className="pt-16 pb-8 px-8 max-w-2xl mx-auto text-center">
        <img src="/logo_nc_transparente.png" alt="NC" className="h-14 mx-auto mb-6 object-contain" />
        <p className="text-[#ded0b8] text-[10px] uppercase font-bold tracking-[4px] mb-2">{saudacao}, Lay Pinheiro!</p>
        <h1 className="text-white text-2xl font-bold uppercase tracking-tight">Torre de Controle</h1>
      </div>

      <div className="max-w-2xl mx-auto px-6 space-y-8">
        
        {/* SEÇÃO: COMPROMISSOS DO DIA */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-white/40">Compromissos de Hoje</h2>
            <Clock size={14} className="text-white/20" />
          </div>
          
          {/* Exemplo de compromisso (depois buscaremos do banco) */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[30px] p-5 flex items-center gap-4">
            <div className="bg-[#ded0b8] w-2 h-10 rounded-full"></div>
            <div className="flex-1">
              <p className="text-[10px] text-[#ded0b8] font-bold uppercase tracking-widest">14:00 - Reunião</p>
              <h3 className="text-white text-sm font-bold uppercase mt-1">Visita Técnica - Espaço Garden (Julia)</h3>
            </div>
            <ArrowRight size={16} className="text-white/20" />
          </div>
        </div>

        {/* SEÇÃO: FERRAMENTAS (MODULOS) */}
        <div className="grid grid-cols-1 gap-3">
          {modulos.map(item => (
            <button 
              key={item.id}
              onClick={() => router.push(item.rota)}
              className="group bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-[30px] flex items-center gap-4 hover:bg-white/10 transition-all active:scale-[0.98]"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.cor}`}>
                {item.icon}
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-white font-bold text-xs uppercase tracking-widest">{item.titulo}</h3>
              </div>
              <ArrowRight size={16} className="text-white/10 group-hover:text-[#ded0b8] transition-colors" />
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
