import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
// Ícone FileText adicionado para a Ficha Técnica
import { ArrowLeft, Clock, ClipboardCheck, Users, Calendar, FileText } from 'lucide-react';
import Link from 'next/link';
import Head from 'next/head';

const supabase = createClient(
  'https://rticfwqptlxkpgawpzwf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0aWNmd3FwdGx4a3BnYXdwendmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTExNjY1OTMsImV4cCI6MjAyNjc0MjU5M30.YOUR_ANON_KEY'
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

  if (!evento) return <div className="p-10 text-center text-gray-500">Carregando menu...</div>;

  return (
    <div className="min-h-screen bg-[#fdfbf7] font-serif pb-10">
      <Head>
        <title>Menu do Evento | {evento.nome}</title>
      </Head>

      <div className="bg-[#2c7a7b] pt-12 pb-6 px-6 text-white rounded-b-3xl shadow-lg">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <button onClick={() => router.push('/')} className="p-2 bg-white/20 rounded-full">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold tracking-tight">{evento.nome}</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto mt-8 px-6 grid grid-cols-1 gap-4">
        
        {/* BOTÃO DA FICHA TÉCNICA - AJUSTADO PARA O NOME CERTO DO ARQUIVO */}
        <Link href={`/ficha-tecnica?id=${id}`} className="flex items-center gap-4 p-5 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition active:scale-95">
          <div className="p-3 bg-teal-100 text-teal-600 rounded-xl">
            <FileText size={28} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">Ficha Técnica</h3>
            <p className="text-sm text-gray-500">Fornecedores e Cerimônia</p>
          </div>
        </Link>

        {/* Outros botões do seu menu... */}
        <Link href={`/lista?id=${id}`} className="flex items-center gap-4 p-5 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
            <Users size={28} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">Lista de Convidados</h3>
            <p className="text-sm text-gray-500">Gestão e confirmações</p>
          </div>
        </Link>

      </div>
    </div>
  );
}
