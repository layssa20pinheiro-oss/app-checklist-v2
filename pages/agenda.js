import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ArrowLeft, Plus, Calendar, Clock, MapPin, CheckCircle2, Circle } from 'lucide-react';
import Head from 'next/head';

const supabase = createClient(
  'https://rticfwqptlxkpgawpzwf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0aWNmd3FwdGx4a3BnYXdwendmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NDA2MTEsImV4cCI6MjA4OTQxNjYxMX0.vOmi-rKKxXuZ5SP7uZe81Cr0fKW_fWN4Hmuf90soijM'
);

export default function Agenda() {
  const router = useRouter();
  const [compromissos, setCompromissos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { carregarAgenda(); }, []);

  async function carregarAgenda() {
    const { data } = await supabase
      .from('agenda')
      .select('*, eventos(nome)')
      .order('data_hora', { ascending: true });
    if (data) setCompromissos(data);
    setLoading(false);
  }

  const formatarData = (isoDate) => {
    const d = new Date(isoDate);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  const formatarHora = (isoDate) => {
    const d = new Date(isoDate);
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-[#7e7f7f] font-sans pb-10">
      <Head><title>Agenda NC | Gestão</title></Head>

      {/* HEADER */}
      <div className="pt-12 pb-8 px-8 max-w-2xl mx-auto flex justify-between items-center text-white">
        <button onClick={() => router.push('/')} className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xs font-bold uppercase tracking-[4px]">Minha Agenda</h1>
        <button className="p-3 bg-[#ded0b8] rounded-2xl text-white shadow-lg active:scale-95"><Plus size={20}/></button>
      </div>

      <div className="max-w-2xl mx-auto px-6">
        {loading ? (
            <p className="text-center text-white/30 uppercase text-[9px] tracking-[4px] py-20">Sincronizando agenda...</p>
        ) : (
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-white/20 before:via-white/5 before:to-transparent">
            {compromissos.map((item) => (
              <div key={item.id} className="relative flex items-center justify-between group">
                {/* O "Ponto" na Timeline */}
                <div className="absolute left-0 w-10 h-10 bg-[#7e7f7f] rounded-full flex items-center justify-center -translate-x-1/2">
                   <div className={`w-3 h-3 rounded-full border-2 ${item.concluido ? 'bg-emerald-400 border-emerald-400' : 'bg-[#ded0b8] border-[#ded0b8]'}`}></div>
                </div>

                {/* Card do Compromisso */}
                <div className="ml-10 flex-1 bg-white p-6 rounded-[30px] shadow-xl border border-white/10 hover:scale-[1.01] transition">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[9px] font-bold text-[#ded0b8] uppercase tracking-[2px] bg-[#ded0b8]/10 px-3 py-1 rounded-full">
                        {item.tipo}
                    </span>
                    <div className="flex items-center gap-1 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                        <Clock size={12} /> {formatarHora(item.data_hora)}
                    </div>
                  </div>

                  <h3 className="text-gray-700 font-bold text-sm uppercase mb-1 tracking-tight">{item.titulo}</h3>
                  
                  {item.eventos && (
                    <p className="text-[10px] text-gray-400 font-medium uppercase mb-3 flex items-center gap-1">
                        <Calendar size={12} /> Evento: {item.eventos.nome}
                    </p>
                  )}

                  <p className="text-[10px] text-gray-500 leading-relaxed mb-4">{item.descricao}</p>
                  
                  <div className="flex justify-end border-t border-gray-50 pt-4">
                    <button className="text-[9px] font-bold text-gray-300 uppercase tracking-widest flex items-center gap-2 hover:text-emerald-500 transition-colors">
                        {item.concluido ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Circle size={16} />}
                        {item.concluido ? 'Concluído' : 'Marcar como feito'}
                    </button>
                  </div>
                </div>

                {/* Data Lateral */}
                <div className="hidden md:block absolute -left-20 text-center">
                    <p className="text-white text-lg font-bold leading-none">{formatarData(item.data_hora).split(' ')[0]}</p>
                    <p className="text-white/30 text-[9px] font-bold uppercase">{formatarData(item.data_hora).split(' ')[1]}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
