import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ArrowLeft, Clock, ClipboardCheck, Users, History, Calendar } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-[#7e7f7f] p-6 font-sans flex flex-col items-center pb-20">
      <Head><title>Menu do Evento | Cerimonial Elite</title></Head>
      <div className="w-full max-w-md animate-in fade-in duration-500">
        
        {/* CABEÇALHO */}
        <div className="flex items-center mb-8 pt-4">
          <Link href="/" className="bg-white/20 p-3 rounded-full text-white hover:bg-white/30 transition-all shadow-sm">
            <ArrowLeft size={20}/>
          </Link>
        </div>

        {/* TÍTULO DO EVENTO */}
        <div className="text-center mb-10">
          <h1 className="text-white font-bold uppercase tracking-[4px] text-xl mb-2">
            {evento ? evento.nome : 'Carregando...'}
          </h1>
          {evento?.data && (
            <div className="flex items-center justify-center gap-2 text-[#ded0b8] text-xs font-bold tracking-widest uppercase">
              <Calendar size={14} />
              {new Date(evento.data).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}
            </div>
          )}
        </div>

        {/* MENU DE CARTÕES PADRONIZADOS */}
        <div className="space-y-5">
          
          {/* 1. Roteiro */}
          <Link href={`/roteiro?id=${id}`} className="bg-white rounded-[35px] p-5 flex items-center gap-5 shadow-xl hover:scale-[1.02] transition-all">
            <div className="bg-[#ded0b8] p-4 rounded-2xl text-white shadow-inner"><Clock size={28} /></div>
            <div>
              <h2 className="text-slate-700 font-bold uppercase tracking-widest text-[13px] mb-1">Roteiro do Dia</h2>
              <p className="text-gray-400 italic text-[10px] uppercase tracking-wider">Cronograma e Festa</p>
            </div>
          </Link>

          {/* 2. Novo Relatório */}
          <Link href={`/checklist?id=${id}`} className="bg-white rounded-[35px] p-5 flex items-center gap-5 shadow-xl hover:scale-[1.02] transition-all">
            <div className="bg-[#ded0b8] p-4 rounded-2xl text-white shadow-inner"><ClipboardCheck size={28} /></div>
            <div>
              <h2 className="text-slate-700 font-bold uppercase tracking-widest text-[13px] mb-1">Novo Relatório</h2>
              <p className="text-gray-400 italic text-[10px] uppercase tracking-wider">Checklist de Saída</p>
            </div>
          </Link>

          {/* 3. Histórico (Agora em um cartão igual aos outros!) */}
          <Link href={`/historico?id=${id}`} className="bg-white rounded-[35px] p-5 flex items-center gap-5 shadow-xl hover:scale-[1.02] transition-all">
            <div className="bg-[#ded0b8] p-4 rounded-2xl text-white shadow-inner"><History size={28} /></div>
            <div>
              <h2 className="text-slate-700 font-bold uppercase tracking-widest text-[13px] mb-1">Acessar Histórico</h2>
              <p className="text-gray-400 italic text-[10px] uppercase tracking-wider">Relatórios Anteriores</p>
            </div>
          </Link>

          {/* 4. Gestão de Convidados */}
          <Link href={`/lista?id=${id}`} className="bg-white rounded-[35px] p-5 flex items-center gap-5 shadow-xl hover:scale-[1.02] transition-all">
            <div className="bg-[#ded0b8] p-4 rounded-2xl text-white shadow-inner"><Users size={28} /></div>
            <div>
              <h2 className="text-slate-700 font-bold uppercase tracking-widest text-[13px] mb-1">Convidados</h2>
              <p className="text-gray-400 italic text-[10px] uppercase tracking-wider">Gestão e Portaria</p>
            </div>
          </Link>

        </div>
      </div>
    </div>
  );
}
