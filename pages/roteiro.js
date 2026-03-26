import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ArrowLeft, Clock, Plus, Trash2, Music, AlignLeft, CheckSquare, Square, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import Head from 'next/head';

const supabase = createClient(
  'https://rticfwqptlxkpgawpzwf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0aWNmd3FwdGx4a3BnYXdwendmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NDA2MTEsImV4cCI6MjA4OTQxNjYxMX0.vOmi-rKKxXuZ5SP7uZe81Cr0fKW_fWN4Hmuf90soijM'
);

export default function Roteiro() {
  const router = useRouter();
  const { id } = router.query;
  
  const [roteiro, setRoteiro] = useState([]);
  const [loading, setLoading] = useState(true);
  const [abaAtiva, setAbaAtiva] = useState('cerimonia'); // 'cerimonia' ou 'recepcao'
  
  // Modal e Formulário
  const [showModal, setShowModal] = useState(false);
  const [novoItem, setNovoItem] = useState({ horario: '', atividade: '', detalhes: '' });

  useEffect(() => {
    if (id) carregarRoteiro();
  }, [id]);

  async function carregarRoteiro() {
    setLoading(true);
    const { data } = await supabase
      .from('roteiros')
      .select('*')
      .eq('evento_id', id)
      .order('horario', { ascending: true });
    
    if (data) setRoteiro(data);
    setLoading(false);
  }

  const salvarItem = async () => {
    if (!novoItem.horario || !novoItem.atividade) return alert("Preencha o horário e a atividade!");
    setLoading(true);
    await supabase.from('roteiros').insert([{ 
      ...novoItem, 
      categoria: abaAtiva, 
      evento_id: id,
      concluido: false // Garante que começa desmarcado
    }]);
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

  // --- FUNÇÃO PARA TICAR O ITEM (Alternar concluído) ---
  const alternarConcluido = async (item) => {
    // Atualiza na tela instantaneamente (Lógica Otimista)
    setRoteiro(roteiro.map(r => r.id === item.id ? {...r, concluido: !r.concluido} : r));
    
    // Salva no banco de dados
    await supabase.from('roteiros').update({ concluido: !item.concluido }).eq('id', item.id);
  };

  const itensExibidos = roteiro.filter(item => item.categoria === abaAtiva);

  return (
    <div className="min-h-screen bg-[#7e7f7f] p-4 flex flex-col items-center font-sans pb-24 text-slate-800">
      <Head><title>Roteiro do Dia | Cerimonial Elite</title></Head>
      
      <div className="w-full max-w-md animate-in fade-in duration-500">
        <div className="flex items-center justify-between mb-6 pt-4">
          <Link href={`/menu-evento?id=${id}`} className="bg-white/20 p-2 rounded-full text-white hover:bg-white/30 transition-all">
            <ArrowLeft size={20}/>
          </Link>
          <h1 className="text-white font-bold uppercase tracking-widest text-sm">Roteiro do Dia</h1>
          <button onClick={() => setShowModal(true)} className="bg-[#ded0b8] p-2 rounded-xl text-white shadow-lg active:scale-95 transition-all">
            <Plus size={20}/>
          </button>
        </div>

        {/* --- ABINHAS SUTIS E ELEGANTES --- */}
        <div className="flex gap-6 border-b border-white/10 mb-6 px-2">
          <button onClick={() => setAbaAtiva('cerimonia')} className={`pb-3 text-[10px] font-bold uppercase tracking-[2px] transition-all duration-300 ${abaAtiva === 'cerimonia' ? 'text-[#ded0b8] border-b-2 border-[#ded0b8]' : 'text-white/40 hover:text-white/70'}`}>Cerimónia</button>
          <button onClick={() => setAbaAtiva('recepcao')} className={`pb-3 text-[10px] font-bold uppercase tracking-[2px] transition-all duration-300 ${abaAtiva === 'recepcao' ? 'text-[#ded0b8] border-b-2 border-[#ded0b8]' : 'text-white/40 hover:text-white/70'}`}>Recepção</button>
        </div>

        {/* --- LISTA DO ROTEIRO MINIMALISTA --- */}
        <div className="relative animate-in fade-in duration-500">
          {/* Linha do tempo visual de fundo */}
          {itensExibidos.length > 1 && (
            <div className="absolute left-[20px] top-4 bottom-4 w-0.5 bg-white/10 z-0"></div>
          )}

          {itensExibidos.length > 0 ? itensExibidos.map((item) => (
            <div key={item.id} className={`relative z-10 flex gap-3 items-start pb-2 mb-2 border-b border-white/5 transition-opacity duration-300 ${item.concluido ? 'opacity-40' : ''}`}>
              
              {/* Círculo com o horário (Menor e mais discreto) */}
              <div className="flex flex-col items-center pt-0.5">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ring-2 ${item.concluido ? 'bg-gray-400 text-gray-100 ring-[#7e7f7f]' : 'bg-[#ded0b8] text-white ring-white/20'}`}>
                  {item.horario}
                </div>
              </div>
              
              {/* --- CONTEÚDO ENXUTO E TICÁVEL --- */}
              <div className="flex-1 bg-white p-3 rounded-2xl shadow-md flex items-start gap-2 relative">
                
                {/* O CHECKBOX (Botão de ticar) */}
                <button onClick={() => alternarConcluido(item)} className="mt-0.5 min-w-[16px]">
                    {item.concluido ? 
                        <CheckSquare size={16} className="text-[#8da38d]"/> : 
                        <Square size={16} className="text-gray-300 hover:text-gray-400"/>
                    }
                </button>

                <div className="flex-1">
                    {/* Título (Riscado se concluído) */}
                    <h3 className={`font-bold text-gray-700 uppercase text-[11px] leading-tight pr-6 ${item.concluido ? 'line-through text-gray-400' : ''}`}>
                        {item.atividade}
                    </h3>
                    
                    {/* Detalhes (Pequenos e discretos, logo abaixo) */}
                    {item.detalhes && (
                      <p className={`text-[9px] mt-1 italic leading-tight ${item.concluido ? 'text-gray-300' : 'text-gray-400'}`}>
                        • {item.detalhes}
                      </p>
                    )}
                </div>

                {/* Botão deletar (Pequenino no canto) */}
                <button onClick={() => deletarItem(item.id)} className="absolute top-3 right-3 text-gray-200 hover:text-red-200 transition-colors">
                  <Trash2 size={12}/>
                </button>
              </div>
            </div>
          )) : (
            <p className="text-white/40 italic text-[10px] font-bold uppercase tracking-widest py-10 text-center">Roteiro vazio.</p>
          )}
        </div>

        {/* --- MODAL PARA ADICIONAR ITEM --- */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50">
            <div className="bg-white w-full max-w-xs rounded-[35px] p-8 shadow-2xl animate-in zoom-in duration-200">
              <h2 className="text-center font-bold text-gray-500 uppercase text-xs mb-6 tracking-widest">Novo Item - {abaAtiva === 'cerimonia' ? 'Cerimónia' : 'Recepção'}</h2>
              <div className="space-y-4 mb-8">
                <div>
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Horário</label>
                  <input type="time" className="w-full border-b p-2 outline-none text-sm text-gray-700" value={novoItem.horario} onChange={e=>setNovoItem({...novoItem, horario: e.target.value})} />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Atividade</label>
                  <input type="text" className="w-full border-b p-2 outline-none text-sm text-gray-700" placeholder="Ex: Entrada dos Noivos" value={novoItem.atividade} onChange={e=>setNovoItem({...novoItem, atividade: e.target.value})} />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">{abaAtiva === 'cerimonia' ? 'Música / Detalhe' : 'Observações'}</label>
                  <input type="text" className="w-full border-b p-2 outline-none text-xs text-gray-600" placeholder="Ex: Música X" value={novoItem.detalhes} onChange={e=>setNovoItem({...novoItem, detalhes: e.target.value})} />
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={()=>setShowModal(false)} className="flex-1 text-gray-400 font-bold text-[10px] uppercase">Sair</button>
                <button onClick={salvarItem} className="flex-2 bg-[#8da38d] text-white px-6 py-4 rounded-2xl font-bold uppercase text-[10px] active:scale-95 transition-all flex justify-center items-center gap-1"><CheckCircle2 size={14}/> Salvar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
