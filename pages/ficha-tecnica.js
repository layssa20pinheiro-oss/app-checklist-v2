import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ArrowLeft, Save, CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Head from 'next/head';

const supabase = createClient(
 'https://rticfwqptlxkpgawpzwf.supabase.co',
 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0aWNmd3FwdGx4a3BnYXdwendmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NDA2MTEsImV4cCI6MjA4OTQxNjYxMX0.vOmi-rKKxXuZ5SP7uZe81Cr0fKW_fWN4Hmuf90soijM'
);

export default function FichaTecnica() {
  const router = useRouter();
  const { id } = router.query;
  const [evento, setEvento] = useState(null);
  const [abaAtiva, setAbaAtiva] = useState("fornecedores");
  const [dadosFicha, setDadosFicha] = useState({});
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (id) {
      supabase.from('eventos').select('*').eq('id', id).single().then(({ data }) => {
        if (data) {
          setEvento(data);
          if (data.ficha_tecnica) setDadosFicha(data.ficha_tecnica);
        }
      });
    }
  }, [id]);

  const handleChange = (campo, valor) => {
    setDadosFicha(prev => ({ ...prev, [campo]: valor }));
  };

  const handleCheck = (campo) => {
    setDadosFicha(prev => ({ ...prev, [campo]: !prev[campo] }));
  };

  const salvarFicha = async () => {
    setSalvando(true);
    const { error } = await supabase
      .from('eventos')
      .update({ ficha_tecnica: dadosFicha })
      .eq('id', id);

    setSalvando(false);
    if (!error) {
       alert('Ficha Técnica atualizada com sucesso!');
    } else {
       alert('Erro ao salvar: ' + error.message);
    }
  };

  const ItemFornecedor = ({ idCampo, label }) => (
    <div className="flex items-center gap-4 p-4 bg-gray-50/50 border border-gray-100 rounded-2xl mb-3">
      <input 
        type="checkbox" 
        className="w-5 h-5 accent-[#8da38d] rounded-lg border-gray-300"
        checked={dadosFicha[`${idCampo}_check`] || false}
        onChange={() => handleCheck(`${idCampo}_check`)}
      />
      <div className="flex-1">
        <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</label>
        <input 
          type="text" 
          placeholder="Nome da Empresa ou Contato" 
          className="w-full border-none bg-transparent focus:ring-0 text-gray-700 p-0 text-xs placeholder:text-gray-300 font-medium"
          value={dadosFicha[idCampo] || ""}
          onChange={(e) => handleChange(idCampo, e.target.value)}
        />
      </div>
    </div>
  );

  if (!evento) return (
    <div className="min-h-screen flex items-center justify-center bg-[#7e7f7f]">
      <div className="text-white/50 font-sans animate-pulse uppercase tracking-widest text-[10px]">Carregando Ficha...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#7e7f7f] font-sans pb-24">
      <Head><title>Ficha Técnica | {evento.nome}</title></Head>

      {
