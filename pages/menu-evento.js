import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ArrowLeft, Clock, ClipboardCheck, Users, Calendar, FileText } from 'lucide-react';
import Link from 'next/link';
import Head from 'next/head';

// --- CONFIGURAÇÃO DO SUPABASE ---
const supabase = createClient(
  'https://rticfwqptlxkpgawpzwf.supabase.co',
  'COLE_AQUI_A_SUA_CHAVE_ANON_QUE_ESTAVA_NO_GITHUB' // <--- COPIE A CHAVE LONGA DO SEU GITHUB E COLE AQUI
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
    <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7]">
      <div className="text-gray-500 font-serif animate-pulse">Carregando menu do evento...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fdfbf7] font-serif pb-10">
      <Head>
        <title>Menu do Evento | {evento.nome}</title>
      </Head>

      {/* HEADER */}
      <div className="bg-[#2c7a7b] pt-12 pb-6 px-6 text-white rounded-b-3xl shadow-lg">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <button onClick={() => router.push('/')} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold tracking-tight">{evento.nome}</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto mt-8 px-6 grid grid-cols-1 gap-4">
        
        {/* BOTÃO DA FICHA TÉCNICA - CORRIGIDO PARA /ficha-tecnica */}
        <Link href={`/ficha-tecnica?id=${id}`} className="flex items-center gap-4 p-5 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition active:scale-95">
          <div className="p-3 bg-teal-100 text-teal-600 rounded-xl">
            <FileText size={28} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">Ficha Técnica</h3>
            <p className="text-sm text-gray-500">Fornecedores e Cerimônia</p>
          </div>
        </Link>

        {/* BOTÃO DA LISTA DE CONVIDADOS */}
        <Link href={`/lista?id=${id}`} className="flex items-center gap-4 p-5 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition active:scale-95">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
            <Users size={28} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">Lista de Convidados</h3>
            <p className="text-sm text-gray-500">Gestão e confirmações</p>
          </div>
        </Link>

        {/* BOTÃO DO CHECKLIST DO DIA */}
        <Link href={`/checklist?id=${id}`} className="flex items-center gap-4 p-5 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition active:scale-95">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
            <ClipboardCheck size={28} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">Checklist do Dia</h3>
            <p className="text-sm text-gray-500">Acompanhamento em tempo real</p>
          </div>
        </Link>

      </div>
    </div>
  );
}
