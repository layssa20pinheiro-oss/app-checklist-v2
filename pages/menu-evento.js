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
    <div className="min-h-screen flex items-center justify-center bg-zinc-900">
      <div className="text-[#D4AF37] font-sans animate-pulse uppercase tracking-widest text-xs">Carregando...</div>
    </div>
  );

  return (
    /* Fundo Gradiente Escuro Sofisticado */
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 font-sans pb-10 text-zinc-100">
      <Head><title>{evento.nome} | Painel</title></Head>

      {/* ============================================================ */}
      {/* [1] HEADER: SETA VOLTAR, NOME E ENGRENAGEM */}
      {/* ============================================================ */}
      <div className="pt-12 pb-8 px-6">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push('/')} className="p-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full hover:bg-white/10 transition">
              <ArrowLeft size={20} className="text-zinc-300" />
            </button>
            <div>
              <p className="text-[9px] uppercase tracking-[3px] text-[#D4AF37]/80 font-bold mb-0.5">Painel do Evento</p>
              <h1 className="text-xl font-bold tracking-tight uppercase text-zinc-100">{evento.nome}</h1>
            </div>
          </div>
          
          <Link href={`/configuracoes?id=${id}`} className="p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 transition">
            <Settings size={22} className="text-zinc-300" />
          </Link>
        </div>
      </div>

      {/* ============================================================ */}
      {/* [2] MENU DE CARDS: BOTÕES PRINCIPAIS (GLASSMORPHISM) */}
      {/* ============================================================ */}
      <div className="max-w-md mx-auto px-6 space-y-4">
        
        {/* CARD: ROTEIRO (COM ACESSO ADMIN) */}
        <Link href={`/roteiro?id=${id}&admin=true`} className="flex items-center gap-5 p-5 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg shadow-black/20 hover:bg-white/10 transition duration-300 active:scale-95 group">
          <div className="p-3 bg-white/5 rounded-xl border border-white/5 group-hover:scale-110 transition-transform">
            <Clock size={24} className="text-[#D4AF37]" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-zinc-100 text-xs uppercase tracking-widest">Roteiro do Dia</h3>
            <p className="text-[10px] text-zinc-400 font-medium uppercase mt-1">Cronograma e IA</p>
          </div>
        </Link>

        {/* CARD: LISTA DE CONVIDADOS */}
        <Link href={`/lista?id=${id}`} className="flex items-center gap-5 p-5 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg shadow-black/20 hover:bg-white/10 transition duration-300 active:scale-95 group">
          <div className="p-3 bg-white/5 rounded-xl border border-white/5 group-hover:scale-110 transition-transform">
            <Users size={24} className="text-[#D4AF37]" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-zinc-100 text-xs uppercase tracking-widest">Convidados</h3>
            <p className="text-[10px] text-zinc-400 font-medium uppercase mt-1">RSVP e Check-in</p>
          </div>
        </Link>

        {/* CARD: FICHA TÉCNICA */}
        <Link href={`/ficha-tecnica?id=${id}`} className="flex items-center gap-5 p-5 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg shadow-black/20 hover:bg-white/10 transition duration-300 active:scale-95 group">
          <div className="p-3 bg-white/5 rounded-xl border border-white/5 group-hover:scale-110 transition-transform">
            <ScrollText size={24} className="text-[#D4AF37]" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-zinc-100 text-xs uppercase tracking-widest">Ficha Técnica</h3>
            <p className="text-[10px] text-zinc-400 font-medium uppercase mt-1">Detalhamento PDF</p>
          </div>
        </Link>

        {/* CARD: CHECKLIST DE SAÍDA */}
        <Link href={`/checklist?id=${id}`} className="flex items-center gap-5 p-5 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg shadow-black/20 hover:bg-white/10 transition duration-300 active:scale-95 group">
          <div className="p-3 bg-white/5 rounded-xl border border-white/5 group-hover:scale-110 transition-transform">
            <ClipboardCheck size={24} className="text-[#D4AF37]" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-zinc-100 text-xs uppercase tracking-widest">Checklist de Saída</h3>
            <p className="text-[10px] text-zinc-400 font-medium uppercase mt-1">Relatórios Finais</p>
          </div>
        </Link>

      </div>
    </div>
  );
}
