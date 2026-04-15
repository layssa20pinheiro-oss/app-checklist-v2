import { useRouter } from 'next/router';
import { 
  Users, Calendar, MessageSquare, 
  Settings2, Briefcase, LayoutDashboard, 
  ArrowRight, Bell 
} from 'lucide-react';
import Head from 'next/head';

export default function AdminMenu() {
  const router = useRouter();

  const ferramentas = [
    { 
      id: 1, 
      titulo: 'Gestão de Eventos', 
      desc: 'Lista de noivas e debutantes ativas', 
      icon: <LayoutDashboard size={24}/>, 
      cor: 'bg-blue-500/20 text-blue-400',
      rota: '/index' // ou onde estiver sua lista atual
    },
    { 
      id: 2, 
      titulo: 'Agenda Interativa', 
      desc: 'Reuniões e visitas técnicas', 
      icon: <Calendar size={24}/>, 
      cor: 'bg-green-500/20 text-green-400',
      rota: '/agenda' 
    },
    { 
      id: 3, 
      titulo: 'Catálogo de Fornecedores', 
      desc: 'Sua rede master de parceiros', 
      icon: <Briefcase size={24}/>, 
      cor: 'bg-[#ded0b8]/20 text-[#ded0b8]',
      rota: '/catalogo-fornecedores' 
    },
    { 
      id: 4, 
      titulo: 'Configuração Global', 
      desc: 'Padronizar Fichas e Checklists', 
      icon: <Settings2 size={24}/>, 
      cor: 'bg-purple-500/20 text-purple-400',
      rota: '/config-global' 
    },
    { 
      id: 5, 
      titulo: 'Chat de Comunicação', 
      desc: 'Central de mensagens com clientes', 
      icon: <MessageSquare size={24}/>, 
      cor: 'bg-pink-500/20 text-pink-400',
      rota: '/chat' 
    }
  ];

  return (
    <div className="min-h-screen bg-[#7e7f7f] font-sans pb-10">
      <Head><title>Admin | NC Cerimonial</title></Head>

      {/* HEADER PREMIUM */}
      <div className="pt-16 pb-10 px-8 flex justify-between items-center max-w-2xl mx-auto">
        <div>
          <img src="/logo_nc_transparente.png" alt="NC" className="h-10 mb-4 object-contain" />
          <h1 className="text-white text-xl font-bold uppercase tracking-[4px]">Torre de Controle</h1>
          <p className="text-white/40 text-[9px] uppercase font-bold mt-1 tracking-widest">Olá, Lay Pinheiro</p>
        </div>
        <button className="p-3 bg-white/5 rounded-2xl text-white/20 border border-white/5 relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#ded0b8] rounded-full border-2 border-[#7e7f7f]"></span>
        </button>
      </div>

      {/* GRID DE FERRAMENTAS */}
      <div className="max-w-2xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {ferramentas.map(item => (
          <button 
            key={item.id}
            onClick={() => router.push(item.rota)}
            className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-[35px] text-left hover:bg-white/10 transition-all group active:scale-95"
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${item.cor}`}>
              {item.icon}
            </div>
            <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-1">{item.titulo}</h3>
            <p className="text-white/30 text-[9px] font-medium leading-relaxed mb-4">{item.desc}</p>
            <div className="flex items-center gap-2 text-[#ded0b8] text-[8px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
              Acessar ferramenta <ArrowRight size={10} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
