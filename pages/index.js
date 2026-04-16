import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Briefcase, Calendar, 
  Settings2, DollarSign, Bell, ArrowRight, Clock, MessageSquare 
} from 'lucide-react';
import Head from 'next/head';

export default function HomeAdmin() {
  const router = useRouter();
  const [saudacao, setSaudacao] = useState('');
  
  // No futuro, esse nome virá do login da cliente
  const [usuarioNome, setUsuarioNome] = useState('Lay Pinheiro'); 

  useEffect(() => {
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12) setSaudacao('Bom dia');
    else if (hora >= 12 && hora < 18) setSaudacao('Boa tarde');
    else setSaudacao('Boa noite');
  }, []);

  const modulos = [
    { id: 1, titulo: 'Meus Eventos', icon: <LayoutDashboard size={22}/>, cor: 'bg-blue-500/20 text-blue-400', rota: '/eventos-lista' },
    { id: 2, titulo: 'Controle Financeiro', icon: <DollarSign size={22}/>, cor: 'bg-emerald-500/20 text-emerald-400', rota: '/financeiro' },
    { id: 3, titulo: 'Agenda de Reuniões', icon: <Calendar size={22}/>, cor: 'bg-orange-500/20 text-orange-400', rota: '/agenda' },
    { id: 4, titulo: 'Parceiros Master', icon: <Briefcase size={22}/>, cor: 'bg-[#ded0b8]/20 text-[#ded0b8]', rota: '/catalogo-fornecedores' },
    { id: 5, titulo: 'Configuração Geral', icon: <Settings2 size={22}/>, cor: 'bg-purple-500/20 text-purple-400', rota: '/config-global' },
  ];

  return (
    <div className="min-h-screen bg-[#7e7f7f] font-sans pb-10">
      <Head><title>Studio de Gestão | NC</title></Head>

      {/* HEADER ELEGANTE */}
      <div className="pt-16 pb-12 px-8 max-w-2xl mx-auto text-center">
        <img src="/logo_nc_transparente.png" alt="NC" className="h-12 mx-auto mb-6 object-contain" />
        <p className="text-[#ded0b8] text-[9px] uppercase font-bold tracking-[5px] mb-2">{saudacao}, {usuarioNome}</p>
        <h1 className="text-white text-xl font-light uppercase tracking-[2px]">Studio de Gestão</h1>
      </div>

      <div className="max-w-2xl mx-auto px-6 space-y-10">
        
        {/* SEÇÃO: MENSAGENS E COMPROMISSOS (FOCO TOTAL) */}
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-[9px] font-bold uppercase tracking-widest text-white/30">Prioridades de Hoje</h2>
          </div>
          
          {/* Card WhatsApp / Pendências */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[35px] p-6 flex items-center gap-5 ring-1 ring-white/5 shadow-2xl">
            <div className="p-3 bg-green-500/20 text-green-400 rounded-2xl">
              <MessageSquare size={20} />
            </div>
            <div className="flex-1">
              <h3 className="text-white text-xs font-bold uppercase tracking-wider">Pendências de Resposta</h3>
              <p className="text-[10px] text-white/40 mt-1 uppercase">3 noivas aguardando retorno</p>
            </div>
            <button className="text-[9px] font-bold text-[#ded0b8] uppercase tracking-widest bg-[#ded0b8]/10 px-4 py-2 rounded-full border border-[#ded0b8]/20">Ver</button>
          </div>

          {/* Próximo Evento/Compromisso */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[35px] p-6 flex items-center gap-5 ring-1 ring-white/5">
            <div className="p-3 bg-blue-400/20 text-blue-300 rounded-2xl">
              <Clock size={20} />
            </div>
            <div className="flex-1">
              <h3 className="text-white text-xs font-bold uppercase tracking-wider">Próximo Compromisso</h3>
              <p className="text-[10px] text-white/40 mt-1 uppercase">14:00 - Reunião Técnica (Julia)</p>
            </div>
          </div>
        </div>

        {/* MENU PRINCIPAL EM GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-10">
          {modulos.map(item => (
            <button 
              key={item.id}
              onClick={() => router.push(item.rota)}
              className="group bg-white/5 border border-white/10 p-5 rounded-[30px] flex flex-col items-center gap-4 hover:bg-white/10 transition-all active:scale-[0.98] text-center"
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg ${item.cor}`}>
                {item.icon}
              </div>
              <h3 className="text-white font-bold text-[9px] uppercase tracking-[2px]">{item.titulo}</h3>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
