import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ArrowLeft, Clock, ClipboardCheck, Users, FileText, ShieldCheck } from 'lucide-react';
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
    <div className="min-h-screen bg-[#7e7f7f] font-sans pb-20">
      <Head><title>{evento.nome} | Cerimonial</title></Head>

      <div className="pt-12 pb-8 px-6 text-white">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <button onClick={() => router.push('/')} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition">
            <ArrowLeft size={20} />
          </button>
          <div>
            <p className="text-[10px] uppercase tracking-[3px] text-white/50 font-bold mb-1">Painel do Evento</p>
            <h1 className="text-xl font-bold tracking-tight uppercase">{evento.nome}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 space-y-4">
        
        {/* ROTEIRO */}
        <Link href={`/roteiro?id=${id}`} className="flex items-center gap-4 p-4 bg-white rounded-[30px] shadow-xl hover:scale-[1.02] transition active:scale-95">
          <div className="p-3 bg-[#ded0b8]/20 text-[#ded0b8] rounded-2xl"><Clock size={24} /></div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-700 text-xs uppercase tracking-widest">Roteiro do Dia</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 italic">Cronograma e IA</p>
          </div>
        </Link>

        {/* LISTA DE CONVIDADOS */}
        <Link href={`/lista?id=${id}`} className="flex items-center gap-4 p-4 bg-white rounded-[30px] shadow-xl hover:scale-[1.02] transition active:scale-95">
          <div className="p-3 bg-[#8da38d]/20 text-[#8da38d] rounded-2xl"><Users size={24} /></div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-700 text-xs uppercase tracking-widest">Convidados</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 italic">RSVP e Check-in</p>
          </div>
        </Link>

        {/* FICHA TÉCNICA */}
        <Link href={`/ficha-tecnica?id=${id}`} className="flex items-center gap-4 p-4 bg-white rounded-[30px] shadow-xl hover:scale-[1.02] transition active:scale-95">
          <div className="p-3 bg-blue-50 text-blue-400 rounded-2xl"><FileText size={24} /></div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-700 text-xs uppercase tracking-widest">Ficha Técnica</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 italic">Detalhamento PDF</p>
          </div>
        </Link>

        {/* CHECKLIST DE PERTENCES */}
        <Link href={`/checklist?id=${id}`} className="flex items-center gap-4 p-4 bg-white rounded-[30px] shadow-xl hover:scale-[1.02] transition active:scale-95">
          <div className="p-3 bg-purple-50 text-purple-400 rounded-2xl"><ClipboardCheck size={24} /></div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-700 text-xs uppercase tracking-widest">Checklist de Saída</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 italic">Relatórios Finais</p>
          </div>
        </Link>

        {/* GESTÃO DE ACESSOS - O NOVO BOTÃO AQUI */}
        <Link href={`/configuracoes?id=${id}`} className="flex items-center gap-4 p-4 bg-white/10 border border-white/20 rounded-[30px] shadow-sm hover:bg-white/20 transition active:scale-95">
          <div className="p-3 bg-[#ded0b8] text-white rounded-2xl shadow-lg"><ShieldCheck size={24} /></div>
          <div className="flex-1">
            <h3 className="font-bold text-white text-xs uppercase tracking-widest">Controle de Acessos</h3>
            <p className="text-[10px] text-white/50 font-bold uppercase mt-1">Liberar Login para Cliente</p>
          </div>
        </Link>

      </div>
    </div>
  );
}
