import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ArrowLeft, Save, Loader2, ChevronRight, CheckCircle2 } from 'lucide-react';
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

  // Categorias baseadas no seu PDF
  const abas = [
    { id: "fornecedores", nome: "Fornecedores" },
    { id: "cerimonia", nome: "Cerimônia" },
    { id: "logistica", nome: "Logística/Salão" },
    { id: "buffet", nome: "Buffet/Doces" },
    { id: "decoracao", nome: "Decoração" },
    { id: "tecnico", nome: "Som/Luz" },
    { id: "outros", nome: "Extras" }
  ];

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
    const { error } = await supabase.from('eventos').update({ ficha_tecnica: dadosFicha }).eq('id', id);
    setSalvando(false);
    if (!error) alert('Ficha Técnica sincronizada!');
  };

  // Componente de Input elegante com Checkbox integrado
  const Campo = ({ idCampo, label, placeholder = "Preencher..." }) => (
    <div className="flex items-start gap-4 p-4 bg-white border border-gray-100 rounded-[20px] mb-3 shadow-sm">
      <input 
        type="checkbox" 
        className="mt-1 w-5 h-5 accent-[#ded0b8] rounded-lg border-gray-200"
        checked={dadosFicha[`${idCampo}_check`] || false}
        onChange={() => handleCheck(`${idCampo}_check`)}
      />
      <div className="flex-1">
        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</label>
        <textarea 
          rows="1"
          placeholder={placeholder}
          className="w-full border-none bg-transparent focus:ring-0 text-gray-700 p-0 text-sm font-medium resize-none"
          value={dadosFicha[idCampo] || ""}
          onChange={(e) => handleChange(idCampo, e.target.value)}
        />
      </div>
    </div>
  );

  if (!evento) return <div className="min-h-screen bg-gray-50 flex items-center justify-center animate-pulse text-gray-400 uppercase text-[10px] tracking-widest">Carregando dados do PDF...</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-32">
      <Head><title>Ficha Técnica Digital | {evento.nome}</title></Head>

      {/* HEADER FIXO */}
      <div className="bg-[#7e7f7f] pt-12 pb-8 px-6 text-white rounded-b-[40px] shadow-lg sticky top-0 z-20">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button onClick={() => router.back()} className="p-2 bg-white/10 rounded-full"><ArrowLeft size={20} className="text-[#ded0b8]" /></button>
          <div className="text-center">
             <h1 className="text-xl font-bold tracking-tight">Ficha Técnica</h1>
             <p className="text-[9px] uppercase tracking-[2px] text-white/50">{evento.nome}</p>
          </div>
          <button onClick={salvarFicha} disabled={salvando} className="bg-[#ded0b8] p-3 rounded-2xl shadow-lg active:scale-95 transition-all">
            {salvando ? <Loader2 size={20} className="animate-spin text-white" /> : <Save size={20} className="text-white" />}
          </button>
        </div>
      </div>

      {/* MENU DE ABAS DESLIZANTE (Scroll Horizontal) */}
      <div className="max-w-md mx-auto mt-6 px-4">
        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
          {abas.map(aba => (
            <button 
              key={aba.id}
              onClick={() => setAbaAtiva(aba.id)}
              className={`whitespace-nowrap px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border ${abaAtiva === aba.id ? "bg-[#7e7f7f] text-white border-[#7e7f7f] shadow-md" : "bg-white text-gray-400 border-gray-100"}`}
            >
              {aba.nome}
            </button>
          ))}
        </div>

        {/* CONTEÚDO DINÂMICO POR ABA */}
        <div className="mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {abaAtiva === "fornecedores" && (
            <div className="space-y-1">
              <Campo idCampo="f_local" label="Local Cerimônia/Recepção" />
              <Campo idCampo="f_buffet" label="Buffet" />
              <Campo idCampo="f_foto" label="Fotografia/Filmagem" />
              <Campo idCampo="f_musica" label="DJ/Banda/Músicos" />
              <Campo idCampo="f_visual" label="Vestido/Terno/Dia da Noiva" />
              <Campo idCampo="f_outros" label="Bartender/Convites/Carro" />
            </div>
          )}

          {abaAtiva === "cerimonia" && (
            <div className="space-y-1">
              <Campo idCampo="c_cadeiras" label="Cadeiras/Bancos (Qtd)" />
              <Campo idCampo="c_itens" label="Lágrimas/Leques/Água" />
              <Campo idCampo="c_altar" label="Aparador/Passarela/Votos" />
              <Campo idCampo="c_cortejo" label="Bouquets/Pétalas/Placas" />
              <Campo idCampo="c_saida" label="Sparkles/Bolhas de Sabão" />
              <Campo idCampo="c_decor" label="Tapete/Flores Altar" />
            </div>
          )}

          {abaAtiva === "logistica" && (
            <div className="space-y-1">
              <Campo idCampo="l_adultos" label="Qtd Adultos / Crianças" />
              <Campo idCampo="l_mesas" label="Qtd Mesas / Lugares Total" />
              <Campo idCampo="l_mapeamento" label="Mesa Família / Mapeamento" />
              <Campo idCampo="l_enxoval" label="Sousplat/Toalhas/Guardanapos" />
              <Campo idCampo="l_impressos" label="Menus/Numeração de Mesa" />
              <Campo idCampo="l_banheiro" label="Kit Banheiro/Limpeza" />
            </div>
          )}

          {abaAtiva === "buffet" && (
            <div className="space-y-1">
              <Campo idCampo="b_bebidas" label="Cerveja/Carrinho/Gelo" />
              <Campo idCampo="b_servico" label="Horário Início/Jantar/Saideira" />
              <Campo idCampo="b_doces" label="Doces (Qtd/Tipos/Forminhas)" />
              <Campo idCampo="b_bolo" label="Bolo Real/Fake (Kg/Sabor)" />
              <Campo idCampo="b_bemcasado" label="Bem Casados (Qtd/Embalagem)" />
            </div>
          )}

          {abaAtiva === "decoracao" && (
            <div className="space-y-1">
              <Campo idCampo="d_estilo" label="Estilo / Tons Decoração" />
              <Campo idCampo="d_bolo" label="Mesa do Bolo / Suportes" />
              <Campo idCampo="d_aereo" label="Arranjos Aéreos / Emparedamento" />
              <Campo idCampo="d_extras" label="Árvore/Lounge/Bistrôs" />
              <Campo idCampo="d_iluminacao" label="Iluminação Mesa Bolo" />
            </div>
          )}

          {abaAtiva === "tecnico" && (
            <div className="space-y-1">
              <Campo idCampo="t_dj" label="DJ (Estrutura/Painel LED)" />
              <Campo idCampo="t_banda" label="Banda (Palco/Backline/Técnico)" />
              <Campo idCampo="t_luz" label="Luz Decorativa (Pimbim/Canhões)" />
              <Campo idCampo="t_energia" label="Ligação de Energia/Voltagem" />
            </div>
          )}

          {abaAtiva === "outros" && (
            <div className="space-y-1">
              <Campo idCampo="o_drinks" label="Bartender (Balcão/Menu/Qtd)" />
              <Campo idCampo="o_lembrancas" label="Chinelos/Aromatizadores/Copos" />
              <Campo idCampo="o_entretenimento" label="Kids/Cabine/Personagens" />
              <Campo idCampo="o_obs" label="Observações Gerais do Evento" />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
