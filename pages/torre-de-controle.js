import { useRouter } from 'next/router';
import { 
  LayoutDashboard, 
  Briefcase, 
  Calendar, 
  Settings2, 
  MessageSquare, 
  Bell,
  ArrowRight
} from 'lucide-react';
import Head from 'next/head';

export default function TorreDeControle() {
  const router = useRouter();

  // Definição dos módulos da sua empresa
  const modulos = [
    { 
      id: 'eventos',
      titulo: 'Meus Eventos', 
      desc: 'Gestão de noivas e debutantes ativas', 
      icon: <LayoutDashboard size={28}/>, 
      cor: 'bg-blue-500/20 text-blue-400',
      rota: '/' // Onde está a sua lista atual de eventos
    },
    { 
      id: 'fornecedores',
      titulo: 'Parceiros Master', 
      desc: 'Catálogo global de fornecedores confiaveis', 
      icon: <Briefcase size={28}/>, 
      cor: 'bg-[#ded0b8]/20 text-[#ded0b8]',
      rota: '/catalogo-fornecedores' 
    },
    { 
      id: 'agenda',
      titulo: 'Agenda NC', 
      desc: 'Reuniões, visitas e cronograma da equipa', 
      icon: <Calendar size={28}/>, 
      cor: 'bg-green-500/20 text-green-400',
      rota: '/agenda' 
    },
    { 
      id: 'config',
      titulo: 'Configuração Global', 
      desc: 'Padronizar fichas técnicas e checklists', 
      icon: <Settings2 size={28}/>, 
      cor: 'bg-purple-500/20 text-purple-400',
      rota: '/config-global' 
    }
  ];

  return (
    <div className="min-h-screen bg-[#7e7f7f] font-sans pb-10">
      <Head><title>Torre de Controle | NC Cerimonial</title></Head>

      {/* CABEÇALHO DE BOAS-VINDAS */}
      <div className="pt-16 pb-12 px-8 max-w-4xl mx-auto flex justify-between items-end">
        <div>
          <img src="/logo_nc_transparente.png" alt="NC" className="h-12 mb-6 object-contain" />
          <p className="text-[#ded0b8] text-[10px] uppercase font-bold tracking-[4px] mb-2">Painel Administrativo</p>
          <h1 className="text-white text-3xl font-bold tracking-tight uppercase">Torre de Controle</h1>
        </div>
        
        <div className="flex gap-3">
            <button className="p-3 bg-white/5 rounded-2xl text-white/30 border border-white/10 relative hover:bg-white/10 transition">
                <Bell size={20} />
                <span className="absolute top-3 right-3 w-2 h-2 bg-[#ded0b8] rounded-full"></span>
            </button>
        </div>
      </div>

      {/* GRID DE MÓDULOS */}
      <div className="max-w-4xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {modulos.map(item => (
          <button 
            key={item.id}
            onClick={() => router.push(item.rota)}
            className="group bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-[40px] text-left hover:bg-white/10 transition-all active:scale-[0.98]"
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-inner ${item.cor}`}>
              {item.icon}
            </div>
            
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-2 group-hover:text-[#ded0b8] transition-colors">
                {item.titulo}
            </h3>
            <p className="text-white/40 text-[10px] font-medium leading-relaxed mb-6 uppercase tracking-wider">
                {item.desc}
            </p>
            
            <div className="flex items-center gap-2 text-[#ded0b8] text-[9px] font-bold uppercase tracking-[2px] opacity-60 group-hover:opacity-100 transition-opacity">
              Abrir Módulo <ArrowRight size={12} />
            </div>
          </button>
        ))}
      </div>

      {/* RODAPÉ ESTATÍSTICO RÁPIDO */}
      <div className="max-w-4xl mx-auto px-6 mt-12">
          <div className="bg-black/10 rounded-[30px] p-6 flex justify-between items-center border border-white/5">
              <div className="flex gap-8">
                  <div>
                      <p className="text-[8px] uppercase text-white/30 font-bold tracking-widest mb-1">Eventos Ativos</p>
                      <p className="text-white font-bold text-lg">12</p>
                  </div>
                  <div className="w-px bg-white/5 h-8 my-auto"></div>
                  <div>
                      <p className="text-[8px] uppercase text-white/30 font-bold tracking-widest mb-1">Parceiros Master</p>
                      <p className="text-white font-bold text-lg">48</p>
                  </div>
              </div>
              <div className="hidden sm:block">
                  <p className="text-[9px] text-white/20 italic font-medium uppercase tracking-[3px]">NC Business Intelligence</p>
              </div>
          </div>
      </div>
    </div>
  );
}
