import { useRouter } from 'next/router';
import { Plus, Users, Calendar, Briefcase, ChevronRight } from 'lucide-react';
import Head from 'next/head';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#7e7f7f] font-sans pb-10 px-6">
      <Head><title>Studio NC | Gestão</title></Head>

      <div className="pt-16 pb-10 max-w-2xl mx-auto flex justify-between items-center text-white">
        <h1 className="text-2xl font-bold tracking-tight">Studio de Gestão</h1>
        <button 
          onClick={() => router.push('/eventos-novo')} 
          className="p-4 bg-[#ded0b8] rounded-3xl shadow-lg"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="max-w-2xl mx-auto bg-white rounded-[40px] p-4 shadow-2xl space-y-2">
        {[
          { label: 'Meus Eventos', rota: '/eventos-lista', icon: <Users size={20}/> },
          { label: 'Gestão Financeira', rota: '/financeiro', icon: <Briefcase size={20}/> },
          { label: 'Minha Agenda', rota: '/agenda', icon: <Calendar size={20}/> }
        ].map((item, idx) => (
          <button 
            key={idx}
            onClick={() => router.push(item.rota)}
            className="w-full flex items-center justify-between p-6 hover:bg-gray-50 rounded-[30px] transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-100 rounded-2xl text-gray-400 group-hover:text-[#ded0b8]">
                {item.icon}
              </div>
              <h4 className="text-sm font-bold text-gray-700 uppercase tracking-tight">{item.label}</h4>
            </div>
            <ChevronRight size={18} className="text-gray-300" />
          </button>
        ))}
      </div>
    </div>
  );
}
