import { useRouter } from 'next/router';
import { Plus, Users, Calendar, Briefcase, ChevronRight, Sparkles } from 'lucide-react';
import Head from 'next/head';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#5a5b5b] to-[#7e7f7f] font-sans pb-10 px-6">
      <Head><title>Studio NC | Gestão de Eventos</title></Head>

      {/* HEADER SOFISTICADO */}
      <div className="pt-20 pb-12 max-w-2xl mx-auto flex justify-between items-end">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#ded0b8] opacity-80">
            <Sparkles size={12} />
            <p className="text-[10px] uppercase font-bold tracking-[4px]">Plataforma Exclusiva</p>
          </div>
          <h1 className="text-white text-3xl font-bold tracking-tight">Studio de Gestão</h1>
        </div>
        
        <button 
          onClick={() => router.push('/eventos-novo')} 
          className="p-5 bg-[#ded0b8] rounded-[28px] text-white shadow-[0_10px_30px_rgba(222,208,184,0.3)] active:scale-95 transition-all"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* CONTAINER PRINCIPAL BRANCO COM DESIGN CLEAN */}
      <div className="max-w-2xl mx-auto bg-white rounded-[45px] p-5 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.3)] space-y-3">
        {[
          { 
            label: 'Meus Eventos', 
            sub: 'Acompanhamento de contratos e noivas', 
            rota: '/eventos-lista', 
            icon: <Users size={20}/> 
          },
          { 
            label: 'Gestão Financeira', 
            sub: 'Fluxo de caixa e lançamentos mensais', 
            rota: '/financeiro', 
            icon: <Briefcase size={20}/> 
          },
          { 
            label: 'Minha Agenda', 
            sub: 'Cronograma de reuniões e visitas', 
            rota: '/agenda', 
            icon: <Calendar size={20}/> 
          }
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
                <h4 className="text-[13px] font-bold text-gray-800 uppercase tracking-[1px]">{item.label}</h4>
                <p className="text-[11px] text-gray-400 mt-0.5">{item.sub}</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-300 group-hover:text-[#ded0b8] transition-all" />
          </button>
        ))}
      </div>

      {/* RODAPÉ DISCRETO */}
      <div className="mt-12 text-center">
        <p className="text-white/20 text-[9px] font-bold uppercase tracking-[5px]">NC Cerimonial & Eventos</p>
      </div>
    </div>
  );
}
