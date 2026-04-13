import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ArrowLeft, Save, Loader2, Pencil, Check } from 'lucide-react';
import Head from 'next/head';

const supabase = createClient(
 'https://rticfwqptlxkpgawpzwf.supabase.co',
 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0aWNmd3FwdGx4a3BnYXdwendmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NDA2MTEsImV4cCI6MjA4OTQxNjYxMX0.vOmi-rKKxXuZ5SP7uZe81Cr0fKW_fWN4Hmuf90soijM'
);

// Componente Campo movido para fora para estabilidade do teclado
const Campo = ({ idCampo, defaultLabel, value, checked, onValueChange, onCheckChange, onLabelChange, customLabel }) => {
  const [editandoNome, setEditandoNome] = useState(false);
  const labelExibida = customLabel || defaultLabel;

  return (
    <div className="flex items-start gap-4 p-4 bg-white border border-gray-100 rounded-[20px] mb-3 shadow-sm group">
      <input 
        type="checkbox" 
        className="mt-1 w-5 h-5 accent-[#ded0b8] rounded-lg border-gray-200 cursor-pointer"
        checked={checked || false}
        onChange={(e) => onCheckChange(idCampo, e.target.checked)}
      />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          {editandoNome ? (
            <div className="flex items-center gap-2 w-full">
              <input 
                className="text-[10px] font-bold text-gray-700 uppercase tracking-widest border-b border-[#ded0b8] outline-none flex-1"
                value={labelExibida}
                onChange={(e) => onLabelChange(idCampo, e.target.value)}
                autoFocus
              />
              <button onClick={() => setEditandoNome(false)} className="text-green-500"><Check size={12}/></button>
            </div>
          ) : (
            <>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">{labelExibida}</label>
              <button 
                onClick={() => setEditandoNome(true)} 
                className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-[#ded0b8] transition-all"
              >
                <Pencil size={10} />
              </button>
            </>
          )}
        </div>
        <textarea 
          rows="1"
          placeholder="Preencher..."
          className="w-full border-none bg-transparent focus:ring-0 text-gray-700 p-0 text-sm font-medium resize-none overflow-hidden min-h-[20px]"
          value={value || ""}
          onChange={(e) => onValueChange(idCampo, e.target.value)}
          onInput={(e) => {
            e.target.style.height = 'auto';
            e.target.style.height = e.target.scrollHeight + 'px';
          }}
        />
      </div>
    </div>
  );
};

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

  const updateFicha = (campo, valor) => {
    setDadosFicha(prev => ({ ...prev, [campo]: valor }));
  };

  const salvarFicha = async () => {
    setSalvando(true);
    const { error } = await supabase.from('eventos').update({ ficha_tecnica: dadosFicha }).eq('id', id);
    setSalvando(false);
    if (!error) alert('Ficha Técnica sincronizada!');
  };

  if (!evento) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400 uppercase text-[10px] tracking-widest">Sincronizando PDF...</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-32">
      <Head><title>Ficha Técnica | {evento.nome}</title></Head>

      {/* BLOCO DE NAVEGAÇÃO FIXO (STICKY) */}
      <div className="bg-[#7e7f7f] pt-12 pb-4 px-6 text-white rounded-b-[40px] shadow-lg sticky top-0 z-20">
        <div className="max-w-md mx-auto">
          {/* Header Superior */}
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => router.back()} className="p-2 bg-white/10 rounded-full"><ArrowLeft size={20} className="text-[#ded0b8]" /></button>
            <div className="text-center">
               <h1 className="text-lg font-bold tracking-tight uppercase">Ficha Técnica</h1>
               <p className="text-[8px] uppercase tracking-[2px] text-white/50">{evento.nome}</p>
            </div>
            <button onClick={salvarFicha} disabled={salvando} className="bg-[#ded0b8] p-3 rounded-2xl shadow-lg active:scale-95 transition-all">
              {salvando ? <Loader2 size={20} className="animate-spin text-white" /> : <Save size={20} className="text-white" />}
            </button>
          </div>

          {/* Barra de Abas Fixa */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {[
              { id: "fornecedores", nome: "Fornecedores" },
              { id: "cerimonia", nome: "Cerimônia" },
              { id: "recepcao", nome: "Recepção" },
              { id: "decoracao", nome: "Decoração" },
              { id: "buffet", nome: "Buffet" },
              { id: "tecnico", nome: "Técnico" }
            ].map(aba => (
              <button 
                key={aba.id} 
                onClick={() => setAbaAtiva(aba.id)} 
                className={`px-5 py-2 rounded-xl font-bold text-[9px] uppercase tracking-widest transition-all whitespace-nowrap ${abaAtiva === aba.id ? "bg-white text-[#7e7f7f] shadow-md" : "bg-white/10 text-white/40"}`}
              >
                {aba.nome}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto mt-6 px-4">
        <div className="mt-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
          {abaAtiva === "fornecedores" && (
            <div className="space-y-1">
              {[
                {id: "f_cerimonia", label: "Cerimônia"}, {id: "f_recepcao", label: "Recepção"},
                {id: "f_convidados", label: "Quantidade de Convidados"}, {id: "f_buffet", label: "Buffet"},
                {id: "f_decor_ig", label: "Decoração Igreja"}, {id: "f_decor_rec", label: "Decoração Recepção"},
                {id: "f_ilum", label: "Iluminação Decorativa"}, {id: "f_dj", label: "DJ / Estrutura"},
                {id: "f_banda1", label: "Banda 1"}, {id: "f_banda2", label: "Banda 2"},
                {id: "f_musicos", label: "Músicos da Cerimônia"}, {id: "f_foto", label: "Fotografia"},
                {id: "f_filme", label: "Filmagem"}, {id: "f_story", label: "Storymaker"},
                {id: "f_vestido", label: "Vestido"}, {id: "f_terno", label: "Terno"},
                {id: "f_noiva", label: "Dia da Noiva"}, {id: "f_noivo", label: "Dia do Noivo"},
                {id: "f_convites", label: "Convites"}, {id: "f_bar", label: "Bartender"},
                {id: "f_doces", label: "Doces"}, {id: "f_bolo", label: "Bolo"},
                {id: "f_fake", label: "Bolo Fake"}, {id: "f_bemcasado", label: "Bem Casados"},
                {id: "f_carro", label: "Carro"}, {id: "f_loc", label: "Locação"},
                {id: "f_atr", label: "Atrações"}
              ].map(item => (
                <Campo 
                  key={item.id}
                  idCampo={item.id}
                  defaultLabel={item.label}
                  value={dadosFicha[item.id]}
                  checked={dadosFicha[`${item.id}_check`]}
                  customLabel={dadosFicha[`${item.id}_label`]}
                  onValueChange={(id, val) => updateFicha(id, val)}
                  onCheckChange={(id, check) => updateFicha(`${id}_check`, check)}
                  onLabelChange={(id, label) => updateFicha(`${id}_label`, label)}
                />
              ))}
            </div>
          )}
          {/* As outras abas serão preenchidas conforme avançarmos */}
        </div>
      </div>
    </div>
  );
}
