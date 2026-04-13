import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ArrowLeft, Save, CheckCircle, ClipboardList } from 'lucide-react';
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
    if (!error) alert('Ficha Técnica salva!');
    else alert('Erro: ' + error.message);
  };

  const ItemFornecedor = ({ idCampo, label }) => (
    <div className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-100 rounded-lg mb-2">
      <input 
        type="checkbox" 
        className="w-6 h-6 text-teal-600 rounded border-gray-300"
        checked={dadosFicha[`${idCampo}_check`] || false}
        onChange={() => handleCheck(`${idCampo}_check`)}
      />
      <div className="flex-1">
        <label className="block text-xs font-bold text-gray-500 uppercase">{label}</label>
        <input 
          type="text" 
          placeholder="Empresa / Contato" 
          className="w-full border-none bg-transparent focus:ring-0 text-gray-800 p-0 text-base"
          value={dadosFicha[idCampo] || ""}
          onChange={(e) => handleChange(idCampo, e.target.value)}
        />
      </div>
    </div>
  );

  if (!evento) return <div className="p-10 text-center text-gray-500 font-serif">Carregando...</div>;

  return (
    <div className="min-h-screen bg-[#fdfbf7] font-serif pb-20">
      <Head><title>Ficha Técnica | {evento.nome}</title></Head>

      <div className="bg-[#2c7a7b] pt-12 pb-6 px-6 text-white rounded-b-3xl shadow-md sticky top-0 z-10">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button onClick={() => router.back()} className="p-2 bg-white/20 rounded-full"><ArrowLeft size={24} /></button>
          <h1 className="text-xl font-bold">Ficha Técnica</h1>
          <button onClick={salvarFicha} className="bg-yellow-500 p-2 rounded-full shadow-lg active:scale-95 transition">
            <Save size={24} />
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto mt-6 px-4">
        <div className="flex bg-white rounded-xl shadow-sm mb-6 p-1 border border-gray-100">
          <button onClick={() => setAbaAtiva("fornecedores")} className={`flex-1 py-3 rounded-lg font-bold text-sm ${abaAtiva === "fornecedores" ? "bg-[#2c7a7b] text-white" : "text-gray-400"}`}>FORNECEDORES</button>
          <button onClick={() => setAbaAtiva("cerimonia")} className={`flex-1 py-3 rounded-lg font-bold text-sm ${abaAtiva === "cerimonia" ? "bg-[#2c7a7b] text-white" : "text-gray-400"}`}>CERIMÔNIA</button>
        </div>

        {abaAtiva === "fornecedores" ? (
          <div className="bg-white p-4 rounded-2xl shadow-sm">
            <ItemFornecedor idCampo="f_local" label="LOCAL CERIMÔNIA/RECEPÇÃO" />
            <ItemFornecedor idCampo="f_buffet" label="BUFFET" />
            <ItemFornecedor idCampo="f_foto" label="FOTOGRAFIA" />
            <ItemFornecedor idCampo="f_video" label="FILMAGEM" />
            <ItemFornecedor idCampo="f_decor" label="DECORAÇÃO" />
            <ItemFornecedor idCampo="f_dj" label="DJ / BANDA" />
            <ItemFornecedor idCampo="f_bar" label="BARTENDER" />
          </div>
        ) : (
          <div className="bg-white p-4 rounded-2xl shadow-sm">
            <div className="space-y-4">
              <div className="border-b pb-2">
                <label className="text-xs font-bold text-gray-400">VOTOS DOS NOIVOS</label>
                <input type="text" className="w-full border-none p-0 focus:ring-0" value={dadosFicha.c_votos || ""} onChange={e => handleChange("c_votos", e.target.value)} />
              </div>
              <div className="border-b pb-2">
                <label className="text-xs font-bold text-gray-400">QUANTIDADE CADEIRAS</label>
                <input type="text" className="w-full border-none p-0 focus:ring-0" value={dadosFicha.c_cadeiras || ""} onChange={e => handleChange("c_cadeiras", e.target.value)} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
