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
  const [usuarioNome, setUsuarioNome] = useState('Lay Pinheiro'); 

  useEffect(() => {
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12) setSaudacao('Bom dia');
    else if (hora >= 12 && hora < 18) setSaudacao('Boa tarde');
    else setSaudacao('Boa noite');
  }, []);

  const modulos = [
    { id: 1, titulo: 'Meus Eventos', icon: <LayoutDashboard size={24}/>, cor: 'bg-blue-500/20 text-blue-300', rota: '/eventos-lista' },
    { id: 2, titulo: 'Financeiro', icon: <DollarSign size={24}/>, cor: 'bg-emerald-500/20 text-emerald-300', rota: '/financeiro' },
    { id: 3, titulo: 'Agenda', icon: <Calendar size={24}/>, cor: 'bg-orange-500/20 text-orange-300', rota: '/agenda' },
    { id: 4, titulo: 'Parceiros', icon: <Briefcase size={24}/>, cor: 'bg-[#ded0b8]/20 text-[#ded0b8]', rota: '/catalogo-fornecedores' },
    { id: 5, titulo: 'Config. Geral', icon: <Settings2 size={24}/>, cor: 'bg-purple-500/20 text-purple-300', rota: '/config-global' },
  ];

  return (
    // Sugestão de fundo: um gradiente sutil para mais elegância
    <div className="min-h-screen bg-gradient-to-b from-[#5a5b5b] to-[#7e7f7f] font-sans pb-10 px-6">
      <Head><title>Studio de Gestão | NC</title></Head>

      {/* HEADER: LOGO AUMENTADA E SAUDAÇÃO */}
      <div className="pt-16 pb-10 text-center max-w-2xl mx-auto">
        <img 
          src="/logo_nc_transparente.png" 
          alt="NC Cerimonial" 
          className="h-22 mx-auto mb-8 object-contain" // Logo aumentada
        />
        <p className="text-[#ded0b8] text-[10px] uppercase font-bold tracking-[5px] mb-2">
          {saudacao}, {usuarioNome}
        </p>
        <h1 className="text-white/40 text-[11px] font-light uppercase tracking-[3px]">Studio de Gestão</h1>
      </div>

      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* SEÇÃO: PRIORIDADES (COMPROMISSOS) */}
        <div className="space-y-3">
          <h2 className="text-[9px] font-bold uppercase tracking-widest text-white/30 px-2">Prioridades de Hoje</h2>
          
          {/* Pendências WhatsApp (DESABILITADO) */}
          <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-[30px] p-5 flex items-center gap-4 opacity-40 grayscale cursor-not-allowed">
            <div className="p-3 bg-white/10 text-white/50 rounded-2xl">
              <MessageSquare size={18} />
            </div>
            <div className="flex-1">
              <h3 className="text-white/50 text-xs font-bold uppercase tracking-wider">Pendências de Resposta</h3>
              <p className="text-[9px] text-white/20 mt-1 uppercase">Em breve: Integração de mensagens</p>
            </div>
          </div>

          {/* Próximo Compromisso (MANTIDO LARGO) */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[35px] p-6 flex items-center gap-5 shadow-xl ring-1 ring-white/5">
            <div className="p-3 bg-[#ded0b8]/20 text-[#ded0b8] rounded-2xl">
              <Clock size={20} />
            </div>
            <div className="flex-1">
              <h3 className="text-white text-xs font-bold uppercase tracking-wider">Próxima Reunião</h3>
              <p className="text-[10px] text-white/50 mt-1 uppercase tracking-tight">14:00 - Visita Técnica (Julia)</p>
            </div>
            <ArrowRight size={16} className="text-white/20" />
          </div>
        </div>

        {/* MENU PRINCIPAL: BOTÕES LADO A LADO */}
        <div className="grid grid-cols-2 gap-3 pb-10">
          {modulos.map(item => (
            <button 
              key={item.id}
              onClick={() => router.push(item.rota)}
              className="group bg-white/5 border border-white/10 p-6 rounded-[35px] flex flex-col items-center justify-center gap-3 hover:bg-white/10 transition-all active:scale-[0.95]"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${item.cor}`}>
                {item.icon}
              </div>
              <h3 className="text-white font-bold text-[8px] uppercase tracking-[2px] text-center">
                {item.titulo}
              </h3>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
