import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ArrowLeft, UserCheck, Clock, Users, Search } from 'lucide-react';
import Head from 'next/head';

const supabase = createClient(
 'https://rticfwqptlxkpgawpzwf.supabase.co',
 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0aWNmd3FwdGx4a3BnYXdwendmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NDA2MTEsImV4cCI6MjA4OTQxNjYxMX0.vOmi-rKKxXuZ5SP7uZe81Cr0fKW_fWN4Hmuf90soijM'
);

export default function ClienteLista() {
  const router = useRouter();
  const { id } = router.query;
  const [lista, setLista] = useState([]);
  const [evento, setEvento] = useState(null);
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      carregarDados();
    }
  }, [id]);

  async function carregarDados() {
    // Busca nome do evento
    const { data: ev } = await supabase.from('eventos').select('nome').eq('id', id).single();
    if (ev) setEvento(ev);

    // Busca convidados
    const { data: conv } = await supabase.from('convidados').select('*').eq('evento_id', id).order('nome');
    if (conv) setLista(conv);
    
    setLoading(false);
  }

  const filtrados = lista.filter(c => c.nome.toLowerCase().includes(busca.toLowerCase()));
  const confirmados = lista.filter(c => c.rsvp === 'confirmado').length;
  const pendentes = lista.filter(c => c.rsvp === 'pendente').length;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#7e7f7f]">
       <div className="text-white/40 uppercase tracking-[4px] text-[10px] animate-pulse">Carregando Lista...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#7e7f7f] font-sans pb-10">
      <Head><title>Lista de Convidados | {evento?.nome}</title></Head>

      {/* HEADER */}
      <div className="pt-12 pb-6 px-6 text-white sticky top-0 bg-[#7e7f7f] z-20">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button onClick={() => router.back()} className="p-2 bg-white/10 rounded-full">
            <ArrowLeft size={20} />
          </button>
          <div className="text-center">
             <h1 className="text-xs font-bold uppercase tracking-[3px]">Lista de Convidados</h1>
             <p className="text-[9px] text-white/40 uppercase font-bold mt-1 tracking-widest">{evento?.nome}</p>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 space-y-6">
        
        {/* RESUMO TRANSPARENTE (Estilo que você gostou) */}
        <div className="bg-white/5 backdrop-blur-sm rounded-[25px] p-4 flex justify-around text-center border border-white/10">
           <div>
              <p className="text-[8px] uppercase font-bold text-white/40 mb-1 tracking-widest">Total</p>
              <p className="text-lg font-bold text-white/90">{lista.length}</p>
           </div>
           <div className="w-px bg-white/10 h-8 my-auto"></div>
           <div>
              <p className="text-[8px] uppercase font-bold text-white/40 mb-1 tracking-widest">Confirmados</p>
              <p className="text-lg font-bold text-[#8da38d]">{confirmados}</p>
           </div>
           <div className="w-px bg-white/10 h-8 my-auto"></div>
           <div>
              <p className="text-[8px] uppercase font-bold text-white/40 mb-1 tracking-widest">Pendentes</p>
              <p className="text-lg font-bold text-amber-200/70">{pendentes}</p>
           </div>
        </div>

        {/* CAMPO DE BUSCA */}
        <div className="relative">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
           <input 
              type="text"
              placeholder="PESQUISAR NOME..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-xs text-white outline-none focus:border-[#ded0b8]/50 transition-all placeholder:text-white/20"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
           />
        </div>

        {/* LISTA DE CONVIDADOS */}
        <div className="space-y-3">
          {filtrados.map(c => (
            <div key={c.id} className="bg-white p-4 rounded-[22px] flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${c.rsvp === 'confirmado' ? 'bg-green-50 text-green-500' : 'bg-gray-50 text-gray-300'}`}>
                  {c.rsvp === 'confirmado' ? <UserCheck size={18}/> : <Clock size={18}/>}
                </div>
                <div>
                  <h3 className="font-bold text-gray-700 text-xs uppercase">{c.nome}</h3>
                  <p className="text-[9px] text-gray-400 font-bold uppercase mt-0.5">Mesa: {c.mesa || 'Livre'}</p>
                </div>
              </div>
              <span className={`text-[8px] font-bold uppercase px-2 py-1 rounded-full ${c.rsvp === 'confirmado' ? 'text-green-500 bg-green-50' : 'text-gray-400 bg-gray-50'}`}>
                {c.rsvp}
              </span>
            </div>
          ))}
          {filtrados.length === 0 && (
            <p className="text-center text-white/20 text-[10px] uppercase font-bold py-10 tracking-[3px]">Nenhum nome encontrado</p>
          )}
        </div>

      </div>
    </div>
  );
}
