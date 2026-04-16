import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Briefcase, Calendar, 
  Settings2, DollarSign, ArrowRight, Clock 
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
    <div className="min-h-screen bg-gradient-to-b from-[#9ea0a0] to-[#bcbebe] font-sans pb-10 px-6 text-slate-800">
      <Head><title>Studio de Gestão | NC</title></Head>

      <div className="pt-20 pb-12 text-center max-w-2xl mx-auto">
        <img 
          src="/logo_nc_transparente.png" 
          alt="NC Cerimonial" 
          className="h-28 mx-auto mb-8 object-contain" // Logo bem evidente
        />
        <p className="text-[#6b5d44] text-[10px] uppercase font-bold tracking-[6px] mb-2">
          {saudacao}, {usuarioNome}
        </p>
        <h1 className="text-black/30 text-[11px] font-bold uppercase tracking-[4px]">Studio de Gestão Elite</h1>
      </div>

      <div className="max-w-2xl mx-auto space-y-10">
        
        {/* PRÓXIMO COMPROMISSO EM DESTAQUE */}
        <div className="space-y-4">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-black/40 px-4">Prioridade de Agora</h2>
          <div className="bg-white p-8 rounded-[40px] flex items-center gap-6 shadow-2xl border border-white/50 ring-1 ring-black/5 scale-[1.02] transition-transform">
            <div className="p-4 bg-[#ded0b8] text-white rounded-3xl shadow-inner">
              <Clock size={28} />
            </div>
            <div className="flex-1">
              <p className="text-[11px] text-[#b0966a] font-bold uppercase tracking-[2px]">Hoje às 14:00</p>
              <h3 className="text-gray-800 text-lg font-bold uppercase tracking-tight mt-1">Visita Técnica: Julia</h3>
            </div>
            <ArrowRight size={20} className="text-gray-300" />
          </div>
        </div>

        {/* MÓDULOS EM GRADE */}
        <div className="grid grid-cols-2 gap-4 pb-10">
          {modulos.map(item => (
            <button 
              key={item.id}
              onClick={() => router.push(item.rota)}
              className="group bg-white/40 backdrop-blur-sm border border-white/60 p-6 rounded-[35px] flex flex-col items-center justify-center gap-4 hover:bg-white/80 transition-all active:scale-[0.95] shadow-sm"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-md transition-transform group-hover:rotate-3 ${item.cor}`}>
                {item.icon}
              </div>
              <h3 className="text-gray-700 font-bold text-[9px] uppercase tracking-[2px] text-center">
                {item.titulo}
              </h3>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
