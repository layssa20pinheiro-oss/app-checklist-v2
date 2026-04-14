import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ArrowLeft, Plus, Trash2, CheckSquare, Square, CheckCircle2, Sparkles, Loader2, Zap } from 'lucide-react';
import Link from 'next/link';
import Head from 'next/head';

const supabase = createClient(
  'https://rticfwqptlxkpgawpzwf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0aWNmd3FwdGx4a3BnYXdwendmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NDA2MTEsImV4cCI6MjA4OTQxNjYxMX0.vOmi-rKKxXuZ5SP7uZe81Cr0fKW_fWN4Hmuf90soijM'
);

export default function Roteiro() {
  const router = useRouter();
  const { id, admin } = router.query; // Pega o ID e o modo Admin da URL
  
  // Verifica se é você (cerimonialista) ou o cliente
  const isAdmin = admin === 'true';

  const [roteiro, setRoteiro] = useState([]);
  const [eventoTipo, setEventoTipo] = useState('Casamento');
  const [loading, setLoading] = useState(true);
  const [abaAtiva, setAbaAtiva] = useState('cerimonia');
  const [showModal, setShowModal] = useState(false);
  const [modoModal, setModoModal] = useState('manual');
  const [novoItem, setNovoItem] = useState({ horario: '', atividade: '', detalhes: '' });
  const [textoRascunho, setTextoRascunho] = useState('');
  const [gerandoIA, setGerandoIA] = useState(false);

  useEffect(() => { if (id) carregarRoteiro(); }, [id]);

  async function carregarRoteiro() {
    setLoading(true);
    const { data: eventoData } = await supabase.from('eventos').select('tipo').eq('id', id).single();
    if (eventoData) setEventoTipo(eventoData.tipo);

    const { data } = await supabase.from('roteiros').select('*').eq('evento_id', id);
    if (data) {
      const dadosOrdenados = data.sort((a, b) => {
        const valorTempo = (horario) => {
          if (!horario) return 0;
          let [h, m] = horario.split(':').map(Number);
          if (h >= 0 && h <= 5) h += 24;
          return (h * 60) + (m || 0);
        };
        return valorTempo(a.horario) - valorTempo(b.horario);
      });
      setRoteiro(dadosOrdenados);
    }
    setLoading(false);
  }

  const salvarItem = async () => {
    if (!novoItem.horario || !novoItem.atividade) return alert("Preencha o horário e a atividade!");
    setLoading(true);
    const categoriaSalvar = eventoTipo === 'Casamento' ? abaAtiva : 'geral';
    await supabase.from('roteiros').insert([{ ...novoItem, categoria: categoriaSalvar, evento_id: id, concluido: false }]);
    setNovoItem({ horario: '', atividade: '', detalhes: '' });
    setShowModal(false);
    carregarRoteiro();
  };

  const deletarItem = async (itemId) => {
    if (confirm("Remover este item do roteiro?")) {
      await supabase.from('roteiros').delete().eq('id', itemId);
      carregarRoteiro();
    }
  };

  const alternarConcluido = async (item) => {
    if (!isAdmin) return; // Cliente não pode marcar como concluído
    setRoteiro(roteiro.map(r => r.id === item.id ? {...r, concluido: !r.concluido} : r));
    await supabase.from('roteiros').update({ concluido: !item.concluido }).eq('id', item.id);
  };

  const itensExibidos = eventoTipo === 'Casamento' ? roteiro.filter(item => item.categoria === abaAtiva) : roteiro;

  return (
    <div className="min-h-screen bg-[#7e7f7f] p-4 flex flex-col items-center font-sans pb-24 text-slate-800">
      <Head><title>Roteiro | Cerimonial Elite</title></Head>
      
      <div className="w-full max-w-md">
        
        {/* ============================================================ */}
        {/* [1] CABEÇALHO (SETINHA DE VOLTAR E TÍTULO) */}
        {/* ============================================================ */}
        <div className="flex items-center justify-between mb-6 pt-4">
          <button 
            onClick={() => router.back()} // <--- AQUI: VOLTA PARA ONDE VOCÊ ESTAVA
            className="bg-white/20 p-2 rounded-full text-white hover:bg-white/30 transition-all"
          >
            <ArrowLeft size={20}/>
          </button>
          
          <h1 className="text-white font-bold uppercase tracking-widest text-sm">
             {eventoTipo === 'Casamento' ? 'Roteiro' : eventoTipo}
          </h1>

          {/* SÓ MOSTRA O BOTÃO "+" SE VOCÊ FOR ADMIN */}
          {isAdmin ? (
            <button onClick={() => setShowModal(true)} className="bg-[#ded0b8] p-2 rounded-xl text-white shadow-lg active:scale-95 transition-all">
              <Plus size={20}/>
            </button>
          ) : <div className="w-10"></div>}
        </div>


        {/* ============================================================ */}
        {/* [2] ABAS (CERIMÔNIA / RECEPÇÃO) */}
        {/* ============================================================ */}
        {eventoTipo === 'Casamento' && (
          <div className="flex gap-6 border-b border-white/10 mb-6 px-2">
            <button onClick={() => setAbaAtiva('cerimonia')} className={`pb-3 text-[10px] font-bold uppercase tracking-[2px] ${abaAtiva === 'cerimonia' ? 'text-[#ded0b8] border-b-2 border-[#ded0b8]' : 'text-white/40'}`}>Cerimônia</button>
            <button onClick={() => setAbaAtiva('recepcao')} className={`pb-3 text-[10px] font-bold uppercase tracking-[2px] ${abaAtiva === 'recepcao' ? 'text-[#ded0b8] border-b-2 border-[#ded0b8]' : 'text-white/40'}`}>Recepção</button>
          </div>
        )}


        {/* ============================================================ */}
        {/* [3] LISTA DE ITENS DO ROTEIRO */}
        {/* ============================================================ */}
        <div className="relative">
          {loading ? (
             <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#ded0b8]" size={30} /></div>
          ) : (
            <>
              {itensExibidos.length > 0 ? itensExibidos.map((item) => (
                <div key={item.id} className={`relative z-10 flex gap-3 items-start mb-4 ${item.concluido ? 'opacity-40' : ''}`}>
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[10px] ring-2 ${item.concluido ? 'bg-gray-400 text-gray-100 ring-transparent' : 'bg-[#ded0b8] text-white ring-white/10'}`}>
                      {item.horario}
                    </div>
                  </div>

                  <div className="flex-1 bg-white p-4 rounded-2xl shadow-md flex items-start gap-3 relative">
                    {/* SÓ VOCÊ PODE CLICAR NO CHECKBOX */}
                    <button onClick={() => alternarConcluido(item)} className="mt-0.5">
                        {item.concluido ? <CheckSquare size={16} className="text-[#8da38d]"/> : <Square size={16} className="text-gray-300"/>}
                    </button>
                    
                    <div className="flex-1">
                        <h3 className={`font-bold text-gray-700 uppercase text-[11px] leading-tight ${item.concluido ? 'line-through text-gray-400' : ''}`}>{item.atividade}</h3>
                        {item.detalhes && <p className="text-[9px] mt-1 italic text-gray-400 leading-tight">• {item.detalhes}</p>}
                    </div>

                    {/* SÓ VOCÊ VÊ O BOTÃO DE LIXEIRA */}
                    {isAdmin && (
                      <button onClick={() => deletarItem(item.id)} className="text-gray-200 hover:text-red-300"><Trash2 size={14}/></button>
                    )}
                  </div>
                </div>
              )) : (
                <p className="text-white/40 italic text-[10px] font-bold uppercase tracking-widest py-10 text-center">Nenhum item cadastrado.</p>
              )}
            </>
          )}
        </div>

        {/* [AQUI ENTRARIA O MODAL, MANTENHA O CÓDIGO DO MODAL QUE VOCÊ JÁ TINHA ABAIXO] */}

      </div>
    </div>
  );
}
