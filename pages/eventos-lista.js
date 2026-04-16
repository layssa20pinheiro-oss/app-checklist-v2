import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ArrowLeft, Plus, Settings, Calendar, Users, Trash2, Edit2 } from 'lucide-react';
import Head from 'next/head';

const supabase = createClient(
  'https://rticfwqptlxkpgawpzwf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0aWNmd3FwdGx4a3BnYXdwendmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NDA2MTEsImV4cCI6MjA4OTQxNjYxMX0.vOmi-rKKxXuZ5SP7uZe81Cr0fKW_fWN4Hmuf90soijM'
);

export default function EventosLista() {
  const router = useRouter();
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarEventos();
  }, []);

  async function carregarEventos() {
    const { data } = await supabase.from('eventos').select('*, convidados(id)');
    if (data) setEventos(data);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#7e7f7f] font-sans pb-10">
      <Head><title>Meus Eventos | NC Cerimonial</title></Head>

      {/* CABEÇALHO COM BOTÃO VOLTAR */}
      <div className="pt-12 pb-6 px-6">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button 
            onClick={() => router.push('/')} 
            className="p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition shadow-lg"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xs font-bold uppercase tracking-[4px] text-white">Meus Eventos</h1>
          <button 
            onClick={() => router.push('/eventos-novo')}
            className="p-3 bg-[#ded0b8] rounded-2xl text-white shadow-xl active:scale-95 transition"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 space-y-4">
        {loading ? (
          <p className="text-center text-white/30 uppercase text-[10px] tracking-widest py-20">Carregando eventos...</p>
        ) : (
          eventos.map(evento => (
            <div 
              key={evento.id} 
              onClick={() => router.push(`/menu-evento?id=${evento.id}`)}
              className="bg-white p-6 rounded-[35px] shadow-xl border border-white/10 hover:scale-[1.02] transition cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-gray-700 text-sm uppercase tracking-tight group-hover:text-[#ded0b8] transition-colors">
                  {evento.nome}
                </h3>
                <div className="flex gap-2 opacity-20 group-hover:opacity-100 transition-opacity">
                   <Edit2 size={14} className="text-gray-400" />
                   <Trash2 size={14} className="text-gray-400" />
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400 uppercase bg-gray-50 px-3 py-1.5 rounded-full">
                  <Calendar size={12} /> {new Date(evento.data).toLocaleDateString('pt-BR')}
                </div>
                <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400 uppercase bg-gray-50 px-3 py-1.5 rounded-full">
                  <Users size={12} /> {evento.convidados?.length || 0} Convidados
                </div>
                <div className="flex items-center gap-1.5 text-[9px] font-bold text-[#ded0b8] uppercase bg-[#ded0b8]/10 px-3 py-1.5 rounded-full">
                  {evento.tipo}
                </div>
              </div>
            </div>
          ))
        )}

        {eventos.length === 0 && !loading && (
          <div className="text-center py-20 bg-white/5 rounded-[40px] border border-dashed border-white/10">
            <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">Nenhum evento cadastrado</p>
          </div>
        )}
      </div>
    </div>
  );
}
