import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ArrowLeft, Save, CheckCircle, ClipboardList } from 'lucide-react';
import Link from 'next/link';
import Head from 'next/head';

const supabase = createClient(
  'https://rticfwqptlxkpgawpzwf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0aWNmd3FwdGx4a3BnYXdwendmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTExNjY1OTMsImV4cCI6MjAyNjc0MjU5M30.YOUR_ANON_KEY_HERE' 
  // Nota: Substitua 'YOUR_ANON_KEY_HERE' pela sua chave real do Supabase se eu tiver cortado!
);

export default function FichaTecnica() {
  const router = useRouter();
  const { id } = router.query;
  const [evento, setEvento] = useState(null);
  const [abaAtiva, setAbaAtiva] = useState("fornecedores");
  const [dadosFicha, setDadosFicha] = useState({});
  const [salvando, setSalvando] = useState(false);

  // Busca os dados do evento ao carregar a página
  useEffect(() => {
    if (id) {
      supabase.from('eventos').select('*').eq('id', id).single().then(({ data }) => {
        if (data) {
          setEvento(data);
          // Tenta carregar a ficha técnica se já existir no banco (coluna 'ficha_tecnica' do tipo JSONB)
          if (data.ficha_tecnica) {
            setDadosFicha(data.ficha_tecnica);
          }
        }
      });
    }
  }, [id]);

  // Função para atualizar o estado local (quando você digita)
  const handleChange = (campo, valor) => {
    setDadosFicha(prev => ({ ...prev, [campo]: valor }));
  };

  // Função para atualizar os Checkboxes
  const handleCheck = (campo) => {
    setDadosFicha(prev => ({ ...prev, [campo]: !prev[campo] }));
  };

  // Função para salvar tudo no Supabase
  const salvarFicha = async () => {
    setSalvando(true);
    const { error } = await supabase
      .from('eventos')
      .update({ ficha_tecnica: dadosFicha })
      .eq('id', id);

    setSalvando(false);
    if (!error) {
      alert('Ficha Técnica salva com sucesso!');
    } else {
      alert('Erro ao salvar: ' + error.message);
    }
  };

  // Componente Reutilizável para a Lista de Fornecedores
  const ItemFornecedor = ({ idCampo, label }) => (
    <div className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-100 rounded-lg">
      <input 
        type="checkbox" 
        className="w-6 h-6 text-teal-600 rounded focus:ring-teal-500"
        checked={dadosFicha[`${idCampo}_check`] || false}
        onChange={() => handleCheck(`${idCampo}_check`)}
      />
      <div className="flex-1">
        <label className="block text-sm font-bold text-gray-700">{label}</label>
        <input 
          type="text" 
          placeholder="Nome da empresa / Profissional..." 
          className="mt-1 w-full border-none bg-transparent focus:ring-0 text-gray-600 p-0 text-sm"
          value={dadosFicha[idCampo] || ""}
          onChange={(e) => handleChange(idCampo, e.target.value)}
        />
      </div>
    </div>
  );

  // Componente Reutilizável para a Lista da Cerimônia
  const ItemCerimonia = ({ idCampo, label, tipo = "texto" }) => (
    <div className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-100 rounded-lg">
      <div className="flex-1 flex items-center justify-between">
        <label className="text-sm font-bold text-gray-700">{label}</label>
        {tipo === "checkbox" ? (
           <input 
            type="checkbox" 
            className="w-6 h-6 text-teal-600 rounded focus:ring-teal-500"
            checked={dadosFicha[idCampo] || false}
            onChange={() => handleCheck(idCampo)}
          />
        ) : (
          <input 
            type="text" 
            placeholder="Quant/Obs..." 
            className="w-1/2 border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 text-sm"
            value={dadosFicha[idCampo] || ""}
            onChange={(e) => handleChange(idCampo, e.target.value)}
          />
        )}
      </div>
    </div>
  );

  if (!evento) return <div className="p-10 text-center text-gray-500 font-serif">Carregando Ficha Técnica...</div>;

  return (
    <div className="min-h-screen bg-[#fdfbf7] font-serif pb-20">
      <Head>
        <title>Ficha Técnica | {evento.nome}</title>
      </Head>

      {/* HEADER ELEGANTE */}
      <div className="bg-[#2c7a7b] pt-12 pb-6 px-6 text-white rounded-b-3xl shadow-md sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button onClick={() => router.back()} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition">
            <ArrowLeft size={24} />
          </button>
          <div className="text-center">
            <h1 className="text-xl font-bold tracking-wide">Ficha Técnica</h1>
            <p className="text-sm opacity-80">{evento.nome}</p>
          </div>
          <button 
            onClick={salvarFicha}
            disabled={salvando}
            className="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-400 transition shadow flex items-center gap-2"
          >
            <Save size={20} />
            <span className="hidden md:inline font-sans text-sm font-bold mr-2">{salvando ? "..." : "Salvar"}</span>
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto mt-6 px-4">
        
        {/* NAVEGAÇÃO DAS ABAS */}
        <div className="flex bg-white rounded-xl shadow-sm border border-gray-100 p-1 mb-6 font-sans">
          <button 
            onClick={() => setAbaAtiva("fornecedores")}
            className={`flex-1 py-3 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${abaAtiva === "fornecedores" ? "bg-[#2c7a7b] text-white shadow" : "text-gray-500 hover:bg-gray-50"}`}
          >
            <ClipboardList size={18} /> Fornecedores
          </button>
          <button 
            onClick={() => setAbaAtiva("cerimonia")}
            className={`flex-1 py-3 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${abaAtiva === "cerimonia" ? "bg-[#2c7a7b] text-white shadow" : "text-gray-500 hover:bg-gray-50"}`}
          >
            <CheckCircle size={18} /> Cerimônia
          </button>
        </div>

        {/* CONTEÚDO DA ABA FORNECEDORES */}
        {abaAtiva === "fornecedores" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-4">
              <span className="text-teal-600">📋</span> Check List de Fornecedores
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans">
              <ItemFornecedor idCampo="f_cerimonia" label="CERIMÔNIA:" />
              <ItemFornecedor idCampo="f_recepcao" label="RECEPÇÃO:" />
              <ItemFornecedor idCampo="f_buffet" label="BUFFET:" />
              <ItemFornecedor idCampo="f_decor_igreja" label="DECORAÇÃO IGREJA:" />
              <ItemFornecedor idCampo="f_decor_recepcao" label="DECORAÇÃO RECEPÇÃO:" />
              <ItemFornecedor idCampo="f_iluminacao" label="ILUMINAÇÃO DECORATIVA:" />
              <ItemFornecedor idCampo="f_dj" label="DJ/ ESTRUTURA:" />
              <ItemFornecedor idCampo="f_banda1" label="BANDA 1:" />
              <ItemFornecedor idCampo="f_banda2" label="BANDA 2:" />
              <ItemFornecedor idCampo="f_musicos" label="MÚSICOS DA CERIMÔNIA:" />
              <ItemFornecedor idCampo="f_fotografia" label="FOTOGRAFIA:" />
              <ItemFornecedor idCampo="f_filmagem" label="FILMAGEM:" />
              <ItemFornecedor idCampo="f_storymaker" label="STORYMAKER:" />
              <ItemFornecedor idCampo="f_vestido" label="VESTIDO:" />
              <ItemFornecedor idCampo="f_terno" label="TERNO:" />
              <ItemFornecedor idCampo="f_dia_noiva" label="DIA DA NOIVA:" />
              <ItemFornecedor idCampo="f_dia_noivo" label="DIA DO NOIVO:" />
              <ItemFornecedor idCampo="f_convites" label="CONVITES:" />
              <ItemFornecedor idCampo="f_bartender" label="BARTENDER:" />
            </div>
          </div>
        )}

        {/* CONTEÚDO DA ABA CERIMÔNIA */}
        {abaAtiva === "cerimonia" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-4">
              <span className="text-teal-600">⛪</span> Detalhes da Cerimônia
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans">
              <ItemCerimonia idCampo="c_cadeiras" label="Quantidade de cadeiras/bancos:" />
              <ItemCerimonia idCampo="c_lagrimas" label="Lágrimas de alegria:" />
              <ItemCerimonia idCampo="c_leques" label="Leques:" />
              <ItemCerimonia idCampo="c_agua" label="Água aromatizada e normal:" />
              <ItemCerimonia idCampo="c_mesa_agua" label="Mesa para água:" />
              <ItemCerimonia idCampo="c_aparador" label="Aparador do celebrante:" />
              <ItemCerimonia idCampo="c_tapete" label="Tapete ou passarela:" />
              <ItemCerimonia idCampo="c_votos" label="Votos dos noivos:" />
              <ItemCerimonia idCampo="c_placas" label="Placas:" />
              <ItemCerimonia idCampo="c_corsages" label="Corsages - Quantos:" />
              <ItemCerimonia idCampo="c_bouquet_noiva" label="Bouquet Noiva:" />
              <ItemCerimonia idCampo="c_bouquet_jogar" label="Bouquet de jogar:" />
              <ItemCerimonia idCampo="c_bouquet_dama" label="Bouquet Dama / Quantos:" />
              <ItemCerimonia idCampo="c_cestinha" label="Cestinha / Pétalas:" />
              <ItemCerimonia idCampo="c_bracada" label="Braçada Botões:" />
              <ItemCerimonia idCampo="c_imagens" label="Imagens / Santas:" />
              <ItemCerimonia idCampo="c_sparkles" label="Sparkles:" />
              <ItemCerimonia idCampo="c_bolhas" label="Bolhas de sabão:" />
              <ItemCerimonia idCampo="c_welcome" label="Welcome drinks (Horário / Mesa):" />
              <ItemCerimonia idCampo="c_cadeiras_pais" label="Cadeiras para Pais / Padrinhos:" />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
