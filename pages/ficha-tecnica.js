import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
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
    <div className="flex items-center gap-4 p-4 bg-[#7e7f7f]/5 border border-[#7e7f7f]/10 rounded-[20px] mb-3">
      <input 
        type="checkbox" 
        className="w-5 h-5 accent-[#ded0b8] rounded-lg border-gray-300"
        checked={dadosFicha[`${idCampo}_check`] || false}
        onChange={() => handleCheck(`${idCampo}_check`)}
      />
      <div className="flex-1">
        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</label>
        <input 
          type="text" 
          placeholder="Nome da Empresa / Contato" 
          className="w-full border-none bg-transparent focus:ring-0 text-gray-700 p-0 text-sm placeholder:text-gray-300 font-medium font-sans"
          value={dadosFicha[idCampo] || ""}
          onChange={(e) => handleChange(idCampo, e.target.value)}
        />
      </div>
    </div>
  );

  if (!evento) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-gray-500 font-sans animate-pulse uppercase tracking-widest text-[10px]">Carregando Ficha...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans pb-24">
      <Head><title>Ficha Técnica | {evento.nome}</title></Head>

      {/* HEADER IDÊNTICO À IMAGEM, MAS CINZA */}
      <div className="bg-[#7e7f7f] pt-12 pb-10 px-6 text-white rounded-b-[30px] shadow-lg">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button onClick={() => router.back()} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition">
            <ArrowLeft size={24} className="text-[#ded0b8]" />
          </button>
          <h1 className="text-2xl font-bold tracking-tight text-white">Ficha Técnica</h1>
          <button 
            onClick={salvarFicha} 
            disabled={salvando}
            className="bg-[#ded0b8] p-3 rounded-full shadow-lg active:scale-95 transition-all disabled:opacity-50"
          >
            {salvando ? <Loader2 size={24} className="animate-spin text-white" /> : <Save size={24} className="text-white" />}
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 mt-8">
        
        {/* ABAS IDÊNTICAS À IMAGEM, MAS CINZA/NUDE */}
        <div className="flex bg-[#7e7f7f]/5 rounded-[20px] p-2 mb-8 border border-[#7e7f7f]/10 shadow-inner">
          <button 
            onClick={() => setAbaAtiva("fornecedores")} 
            className={`flex-1 py-4 rounded-[15px] font-bold text-xs uppercase tracking-widest transition-all ${abaAtiva === "fornecedores" ? "bg-[#7e7f7f] text-white shadow-md" : "text-gray-400 hover:text-gray-600"}`}
          >
            Fornecedores
          </button>
          <button 
            onClick={() => setAbaAtiva("cerimonia")} 
            className={`flex-1 py-4 rounded-[15px] font-bold text-xs uppercase tracking-widest transition-all ${abaAtiva === "cerimonia" ? "bg-[#7e7f7f] text-white shadow-md" : "text-gray-400 hover:text-gray-600"}`}
          >
            Cerimônia
          </button>
        </div>

        <div className="bg-gray-50 rounded-[35px] p-8 shadow-inner border border-gray-100 animate-in fade-in duration-500">
          {abaAtiva === "fornecedores" ? (
            <div className="space-y-1">
               <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-[3px] mb-6 text-center">Contatos do Evento</h2>
              <ItemFornecedor idCampo="f_local" label="LOCAL DO EVENTO" />
              <ItemFornecedor idCampo="f_buffet" label="BUFFET" />
              <ItemFornecedor idCampo="f_foto" label="FOTOGRAFIA" />
              <ItemFornecedor idCampo="f_video" label="FILMAGEM" />
              <ItemFornecedor idCampo="f_decor" label="DECORAÇÃO" />
              <ItemFornecedor idCampo="f_dj" label="DJ / BANDA" />
              <ItemFornecedor idCampo="f_bar" label="BARTENDER" />
            </div>
          ) : (
            <div className="space-y-8 py-4">
              <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-[3px] mb-4 text-center">Detalhes da Cerimônia</h2>
              <div className="border border-gray-200 bg-white p-6 rounded-[20px] shadow-sm">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Votos dos Noivos / Aniversariante</label>
                <input 
                  type="text" 
                  placeholder="Ex: Terão votos próprios"
                  className="w-full border-b border-gray-100 p-0 focus:ring-0 text-base text-gray-700 mt-2 font-medium font-sans placeholder:text-gray-300" 
                  value={dadosFicha.c_votos || ""} 
                  onChange={e => handleChange("c_votos", e.target.value)} 
                />
              </div>
              <div className="border border-gray-200 bg-white p-6 rounded-[20px] shadow-sm">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Quantidade de Cadeiras / Layout</label>
                <input 
                  type="text" 
                  placeholder="Ex: 150 cadeiras tiffany"
                  className="w-full border-b border-gray-100 p-0 focus:ring-0 text-base text-gray-700 mt-2 font-medium font-sans placeholder:text-gray-300" 
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
