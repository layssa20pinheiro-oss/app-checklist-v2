import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Clock, Users, Heart } from 'lucide-react';
import Head from 'next/head';
import Link from 'next/link';

const supabase = createClient(
  'https://rticfwqptlxkpgawpzwf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0aWNmd3FwdGx4a3BnYXdwendmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NDA2MTEsImV4cCI6MjA4OTQxNjYxMX0.vOmi-rKKxXuZ5SP7uZe81Cr0fKW_fWN4Hmuf90soijM'
);

export default function AcessoCliente() {
  const router = useRouter();
  const { id } = router.query;
  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Lógica da Contagem Regressiva
  const [timeLeft, setTimeLeft] = useState({ dias: 0, horas: 0, minutos: 0, segundos: 0 });

  useEffect(() => {
    if (id) {
      supabase.from('eventos').select('*').eq('id', id).single().then(({ data }) => {
        if (data) setEvento(data);
        setLoading(false);
      });
    }
  }, [id]);

  useEffect(() => {
    if (!evento?.data) return;

    const timer = setInterval(() => {
      const agora = new Date().getTime();
      const dataEvento = new Date(evento.data).getTime();
      const diferenca = dataEvento - agora;

      if (diferenca > 0) {
        setTimeLeft({
          dias: Math.floor(diferenca / (1000 * 60 * 60 * 24)),
          horas: Math.floor((diferenca % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutos: Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60)),
          segundos: Math.floor((diferenca % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [evento]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#7e7f7f]">
      <div className="text-white/50 font-sans animate-pulse uppercase tracking-widest text-xs">Acessando o painel...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#7e7f7f] font-sans pb-10">
      <Head><title>Meu Evento | {evento?.nome}</title></Head>

      <div className="pt-16 pb-10 px-6 text-white text-center flex flex-col items-center">
        <div className="max-w-md mx-auto w-full">
          <img 
            src="/logo_nc_transparente.png" 
            alt="NC Cerimonial" 
            className="max-w-[150px] mx-auto mb-8 h-auto object-contain"
          />
          <p className="text-[10px] uppercase tracking-[4px] text-white/50 font-bold mb-2">Contagem Regressiva</p>
          <h1 className="text-2xl font-bold tracking-tight uppercase">{evento?.nome}</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 space-y-6">
        
        {/* CONTAGEM REGRESSIVA ESTILO GLASSMORPHISM */}
        <div className="bg-white/5 backdrop-blur-md rounded-[30px] p-6 border border-white/10 flex justify-around items-center shadow-2xl">
           <div className="text-center">
              <p className="text-2xl font-bold text-white leading-none">{timeLeft.dias}</p>
              <p className="text-[8px] uppercase font-bold text-white/40 mt-2 tracking-widest">Dias</p>
           </div>
           <div className="text-white/20 text-xl font-light">:</div>
           <div className="text-center">
              <p className="text-2xl font-bold text-white leading-none">{timeLeft.horas}</p>
              <p className="text-[8px] uppercase font-bold text-white/40 mt-2 tracking-widest">Hrs</p>
           </div>
           <div className="text-white/20 text-xl font-light">:</div>
           <div className="text-center">
              <p className="text-2xl font-bold text-white leading-none">{timeLeft.minutos}</p>
              <p className="text-[8px] uppercase font-bold text-white/40 mt-2 tracking-widest">Min</p>
           </div>
           <div className="text-white/20 text-xl font-light">:</div>
           <div className="text-center">
              <p className="text-2xl font-bold text-[#ded0b8] leading-none animate-pulse">{timeLeft.segundos}</p>
              <p className="text-[8px] uppercase font-bold text-white/40 mt-2 tracking-widest">Seg</p>
           </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <Link href={`/cliente-lista?id=${id}`} className="w-full">
            <button className="flex items-center gap-4 p-5 bg-white rounded-[30px] shadow-xl hover:scale-[1.01] transition active:scale-95 text-left w-full border border-white/10">
              <div className="p-3 bg-[#ded0b8]/20 text-[#ded0b8] rounded-2xl"><Users size={24} /></div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-700 text-xs uppercase tracking-widest">Lista de Convidados</h3>
                <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">Acompanhar confirmações</p>
              </div>
            </button>
          </Link>

          <Link href={`/roteiro?id=${id}`} className="w-full">
            <button className="flex items-center gap-4 p-5 bg-white rounded-[30px] shadow-xl hover:scale-[1.01] transition active:scale-95 text-left w-full border border-white/10">
                <div className="p-3 bg-gray-50 text-gray-400 rounded-2xl"><Clock size={24} /></div>
                <div>
                <h3 className="font-bold text-gray-700 text-xs uppercase tracking-widest">Cronograma</h3>
                <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">Ver roteiro do evento</p>
                </div>
            </button>
          </Link>
        </div>

  {/* BOTÃO FORNECEDORES (VISÃO CLIENTE) */}
<Link href={`/fornecedores?id=${id}`} className="w-full">
  <button className="flex items-center gap-4 p-5 bg-white rounded-[30px] shadow-xl hover:scale-[1.01] transition active:scale-95 text-left w-full border border-white/10">
    <div className="p-3 bg-orange-50 text-orange-400 rounded-2xl"><Store size={24} /></div>
    <div>
      <h3 className="font-bold text-gray-700 text-xs uppercase tracking-widest">Fornecedores</h3>
      <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">Nossas indicações de confiança</p>
    </div>
  </button>
</Link>

        <div className="pt-10 text-center">
           <Heart className="text-[#ded0b8]/20 mx-auto mb-2" size={20} />
           <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest italic">Organizado por nossa equipe</p>
        </div>
      </div>
    </div>
  );
}
