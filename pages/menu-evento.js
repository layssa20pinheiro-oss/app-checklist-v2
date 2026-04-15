import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ArrowLeft, Clock, ClipboardCheck, Users, Settings, ScrollText } from 'lucide-react';
import Link from 'next/link';
import Head from 'next/head';

const supabase = createClient(
  'https://rticfwqptlxkpgawpzwf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0aWNmd3FwdGx4a3BnYXdwendmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NDA2MTEsImV4cCI6MjA4OTQxNjYxMX0.vOmi-rKKxXuZ5SP7uZe81Cr0fKW_fWN4Hmuf90soijM'
);

export default function MenuEvento() {
  const router = useRouter();
  const { id } = router.query;
  const [evento, setEvento] = useState(null);

  useEffect(() => {
    if (id) {
      supabase.from('eventos').select('*').eq('id', id).single().then(({ data }) => {
        if (data) setEvento(data);
      });
    }
  }, [id]);

  if (!evento) return (
    <div className="min-h-screen flex items-center justify-center bg-[#111111]">
      <div className="text-[#EAD8B1] font-sans animate-pulse uppercase tracking-widest text-xs">Carregando...</div>
    </div>
  );

  return (
    /* Fundo Escuro Profundo e Elegante */
    <div className="min-h-screen bg-[#111111] font-sans pb-10 text-zinc-100">
      <Head><title>{evento.nome} | Painel</title></Head>

      {/* [1] HEADER: DESIGN REFINADO EM CREME */}
      <div className="pt-12 pb-8 px-6 text-white">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push('/')} className="p-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full hover:bg-white/10 transition">
              <ArrowLeft size={20} className="text-[#EAD8B1]" />
            </button>
            <div>
              <p className="text-[9px] uppercase tracking-[4px] text-[#EAD8B1] font-bold mb-0.5 opacity-80">Painel do Evento</p>
              <h1 className="text-xl font-bold tracking-tight uppercase text-white">{evento.nome}</h1>
            </div>
          </div>
          
          <Link href={`/configuracoes?id=${id}`} className="p-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl hover:bg-white/10 transition">
            <Settings size={22} className="text-[#EAD8B1]" />
          </Link>
        </div>
      </div>

      {/* [2] MENU DE CARDS: EFEITO VIDRO COM BORDA CREME */}
      <div className="max-w-md mx-auto px-6 space-y-4">
        
        {/* CARD: ROTEIRO */}
        <Link href={`/roteiro?id=${id}&admin=true`} className="flex items-center gap-5 p-5 bg-white/[0.03] backdrop-blur-xl border border-[#EAD8B1]/20 rounded-2xl shadow-2xl hover:bg-white/[0.07] transition duration-500 group">
          <div className="p-3 bg-[#EAD8B1]/10 rounded-xl border border-[#EAD8B1]/20">
            <Clock size={24} className="text-[#EAD8B1]" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-white text-xs uppercase tracking-widest">Roteiro do Dia</h3>
            <p className="text-[10px] text-[#EAD8B1]/60 font-medium uppercase mt-1">Cronograma e IA</p>
          </div>
        </Link>

        {/* CARD: LISTA DE CONVIDADOS */}
        <Link href={`/lista?id=${id}`} className="flex items-center gap-5 p-5 bg-white/[0.03] backdrop-blur-xl border border-[#EAD8B1]/20 rounded-2xl shadow-2xl hover:bg-white/[0.07] transition duration-500 group">
          <div className="p-3 bg-[#EAD8B1]/10 rounded-xl border border-[#EAD8B1]/20">
            <Users size={24} className="text-[#EAD8B1]" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-white text-xs uppercase tracking-widest">Convidados</h3>
            <p className="text-[10px] text-[#EAD8B1]/60 font-medium uppercase mt-1">RSVP e Check-in</p>
          </div>
        </Link>

        {/* CARD: FICHA TÉCNICA */}
        <Link href={`/ficha-tecnica?id=${id}`} className="flex items-center gap-5 p-5 bg-white/[0.03] backdrop-blur-xl border border-[#EAD8B1]/20 rounded-2xl shadow-2xl hover:bg-white/[0.07] transition duration-500 group">
          <div className="p-3 bg-[#EAD8B1]/10 rounded-xl border border-[#EAD8B1]/20">
            <ScrollText size={24} className="text-[#EAD8B1]" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-white text-xs uppercase tracking-widest">Ficha Técnica</h3>
            <p className="text-[10px] text-[#EAD8B1]/60 font-medium uppercase mt-1">Detalhamento PDF</p>
          </div>
        </Link>

        {/* CARD: CHECKLIST DE SAÍDA */}
        <Link href={`/checklist?id=${id}`} className="flex items-center gap-5 p-5 bg-white/[0.03] backdrop-blur-xl border border-[#EAD8B1]/20 rounded-2xl shadow-2xl hover:bg-white/[0.07] transition duration-500 group">
          <div className="p-3 bg-[#EAD8B1]/10 rounded-xl border border-[#EAD8B1]/20">
            <ClipboardCheck size={24} className="text-[#EAD8B1]" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-white text-xs uppercase tracking-widest">Checklist de Saída</h3>
            <p className="text-[10px] text-[#EAD8B1]/60 font-medium uppercase mt-1">Relatórios Finais</p>
          </div>
        </Link>

      </div>
    </div>
  );
}
