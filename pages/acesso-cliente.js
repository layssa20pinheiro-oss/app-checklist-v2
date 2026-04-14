import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Clock, Users, Heart } from 'lucide-react';
import Head from 'next/head';

const supabase = createClient(
 'https://rticfwqptlxkpgawpzwf.supabase.co',
 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0aWNmd3FwdGx4a3BnYXdwendmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NDA2MTEsImV4cCI6MjA4OTQxNjYxMX0.vOmi-rKKxXuZ5SP7uZe81Cr0fKW_fWN4Hmuf90soijM'
);

export default function AcessoCliente() {
  const router = useRouter();
  const { id } = router.query;
  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      supabase.from('eventos').select('*, convidados(id, rsvp)').eq('id', id).single().then(({ data }) => {
        if (data) setEvento(data);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#7e7f7f]">
      <div className="text-white/50 font-sans animate-pulse uppercase tracking-widest text-xs">Acedendo ao painel...</div>
    </div>
  );

  const confirmados = evento?.convidados?.filter(c => c.rsvp === 'confirmado').length || 0;
  const totalConvidados = evento?.convidados?.length || 0;

  return (
    <div className="min-h-screen bg-[#7e7f7f] font-sans pb-10">
      <Head><title>Meu Evento | {evento?.nome}</title></Head>

      {/* HEADER COM O LOGOTIPO NC */}
      <div className="pt-16 pb-10 px-6 text-white text-center flex flex-col items-center">
        <div className="max-w-md mx-auto w-full">
          
          {/* CHAMADA DO LOGO SALVO NA PASTA PUBLIC */}
          <img 
            src="/icon.png" 
            alt="NC Cerimonial" 
            className="max-w-[150px] mx-auto mb-8 h-auto object-contain"
          />

          <p className="text-[10px] uppercase tracking-[4px] text-white/50 font-bold mb-2">Bem-vinda ao seu painel</p>
          <h1 className="text-2xl font-bold tracking-tight uppercase">{evento?.nome}</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 space-y-6">
        
        {/* CARD DE RESUMO RÁPIDO */}
        <div className="bg-white rounded-[35px] p-6 shadow-2xl flex justify-around text-center border border-white/10">
           <div>
              <p className="text-[8px] uppercase font-bold text-gray-400 mb-1">Confirmados</p>
              <p className="text-xl font-bold text-gray-700">{confirmados}</p>
           </div>
           <div className="w-px bg-gray-100 h-10 my-auto"></div>
           <div>
              <p className="text-[8px] uppercase font-bold text-gray-400 mb-1">Total na Lista</p>
              <p className="text-xl font-bold text-gray-700">{totalConvidados}</p>
           </div>
        </div>

        {/* BOTÕES DE ACESSO DO CLIENTE */}
        <div className="grid grid-cols-1 gap-4">
          
          <button className="flex items-center gap-4 p-5 bg-white rounded-[30px] shadow-xl hover:scale-[1.01] transition active:scale-95 text-left w-full border border-white/10">
            <div className="p-3 bg-[#ded0b8]/20 text-[#ded0b8] rounded-2xl"><Users size={24} /></div>
            <div>
              <h3 className="font-bold text-gray-700 text-xs uppercase tracking-widest">Lista de Convidados</h3>
              <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">Acompanhar confirmações</p>
            </div>
          </button>

          <button className="flex items-center gap-4 p-5 bg-white rounded-[30px] shadow-xl hover:scale-[1.01] transition active:scale-95 text-left w-full border border-white/10">
            <div className="p-3 bg-gray-50 text-gray-400 rounded-2xl"><Clock size={24} /></div>
            <div>
              <h3 className="font-bold text-gray-700 text-xs uppercase tracking-widest">Cronograma</h3>
              <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">Ver roteiro do evento</p>
            </div>
          </button>

        </div>

        {/* MENSAGEM FINAL */}
        <div className="pt-10 text-center">
           <Heart className="text-white/10 mx-auto mb-2" size={20} />
           <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest italic">Organizado por nossa equipa</p>
        </div>

      </div>
    </div>
  );
}
