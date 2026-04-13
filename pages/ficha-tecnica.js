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

      {/* HEADER */}
      <div className="pt-12 pb-6 px-6 text-white">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button onClick={() => router.back()} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-sm font-bold uppercase tracking-[3px]">Ficha Técnica</h1>
          <button 
            onClick={salvarFicha} 
            disabled={salvando}
            className="bg-[#ded0b8] p-2 rounded-xl shadow-lg active:scale-95 transition-all disabled:opacity-50"
          >
            {salvando ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6">
        {/* ABAS ESTILO PÍLULA */}
        <div className="flex bg-white/10 rounded-2xl p-1 mb-6 border border-white/5">
          <button 
            onClick={() => setAbaAtiva("fornecedores")} 
            className={`flex-1 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${abaAtiva === "fornecedores" ? "bg-white text-gray-700 shadow-sm" : "text-white/40"}`}
          >
            Fornecedores
          </button>
          <button 
            onClick={() => setAbaAtiva("cerimonia")} 
            className={`flex-1 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${abaAtiva === "cerimonia" ? "bg-white text-gray-700 shadow-sm" : "text-white/40"}`}
          >
            Cerimônia
          </button>
        </div>

        <div className="bg-white rounded-[35px] p-6 shadow-2xl animate-in fade-in duration-500">
          {abaAtiva === "fornecedores" ? (
            <div className="space-y-1">
               <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[2px] mb-4 text-center">Checklist de Contatos</h2>
              <ItemFornecedor idCampo="f_local" label="LOCAL DO EVENTO" />
              <ItemFornecedor idCampo="f_buffet" label="BUFFET" />
              <ItemFornecedor idCampo="f_foto" label="FOTOGRAFIA" />
              <ItemFornecedor idCampo="f_video" label="FILMAGEM" />
              <ItemFornecedor idCampo="f_decor" label="DECORAÇÃO" />
              <ItemFornecedor idCampo="f_dj" label="DJ / BANDA" />
              <ItemFornecedor idCampo="f_bar" label="BARTENDER" />
            </div>
          ) : (
            <div className="space-y-6 py-4">
              <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[2px] mb-2 text-center">Detalhes do Rito</h2>
              <div className="border-b border-gray-100 pb-2">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Votos dos Noivos / Aniversariante</label>
                <input 
                  type="text" 
                  placeholder="Ex: Terão votos próprios"
                  className="w-full border-none p-0 focus:ring-0 text-sm text-gray-700 mt-1" 
                  value={dadosFicha.c_votos || ""} 
                  onChange={e => handleChange("c_votos", e.target.value)} 
                />
              </div>
              <div className="border-b border-gray-100 pb-2">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Quantidade de Cadeiras / Layout</label>
                <input 
                  type="text" 
                  placeholder="Ex: 150 cadeiras tiffany"
                  className="w-full border-none p-0 focus:ring-0 text-sm text-gray-700 mt-1" 
                  value={dadosFicha.c_cadeiras || ""} 
                  onChange={e => handleChange("c_cadeiras", e.target.value)} 
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
