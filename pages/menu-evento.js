import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ArrowLeft, Clock, ClipboardCheck, Users, Calendar, FileText, ScrollText } from 'lucide-react';
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
    <div className="min-h-screen flex items-center justify-center bg-[#7e7f7f]">
      <div className="text-white/50 font-sans animate-pulse uppercase tracking-widest text-xs">Carregando...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#7e7f7f] font-sans pb-10">
      <Head><title>{evento.nome} | Cerimonial</title></Head>

      {/* HEADER SOFISTICADO */}
      <div className="pt-12 pb-8 px-6 text-white">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <button onClick={() => router.push('/')} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition">
            <ArrowLeft size={20} />
          </button>
          <div>
            <p className="text-[10px] uppercase tracking-[3px] text-white/50 font-bold mb-1">Gerenciar Evento</p>
            <h1 className="text-xl font-bold tracking-tight uppercase">{evento.nome}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 space-y-4">
        
        {/* CARD: ROTEIRO (Adicionado para não faltar) */}
        <Link href={`/roteiro?id=${id}`} className="flex items-center gap-4 p-4 bg-white rounded-[30px] shadow-xl hover:scale-[1.02] transition active:scale-95">
          <div className="p-3 bg-[#ded0b8]/20 text-[#ded0b8] rounded-2xl">
            <Clock size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-700 text-xs uppercase tracking-widest">Roteiro do Dia</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Cronograma e IA</p>
          </div>
        </Link>

        {/* CARD: LISTA */}
        <Link href={`/lista?id=${id}`} className="flex items-center gap-4 p-4 bg-white rounded-[30px] shadow-xl hover:scale-[1.02] transition active:scale-95">
          <div className="p-3 bg-[#8da38d]/20 text-[#8da38d] rounded-2xl">
            <Users size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-700 text-xs uppercase tracking-widest">Convidados</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">RSVP e Check-in</p>
          </div>
        </Link>

        {/* CARD: FICHA TÉCNICA */}
        <Link href={`/ficha-tecnica?id=${id}`} className="flex items-center gap-4 p-4 bg-white rounded-[30px] shadow-xl hover:scale-[1.02] transition active:scale-95">
          <div className="p-3 bg-blue-50 text-blue-400 rounded-2xl">
            <ScrollText size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-700 text-xs uppercase tracking-widest">Ficha Técnica</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Fornecedores</p>
          </div>
        </Link>

        {/* CARD: CHECKLIST DE PERTENCES */}
        <Link href={`/checklist?id=${id}`} className="flex items-center gap-4 p-4 bg-white rounded-[30px] shadow-xl hover:scale-[1.02] transition active:scale-95">
          <div className="p-3 bg-purple-50 text-purple-400 rounded-2xl">
            <ClipboardCheck size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-700 text-xs uppercase tracking-widest">Checklist de Saída</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Relatórios e Fotos</p>
          </div>
        </Link>

      </div>
    </div>
  );
}
