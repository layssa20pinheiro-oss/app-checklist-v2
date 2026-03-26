import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ArrowLeft, Clock, Plus, Trash2, Music, AlignLeft, CheckCircle2 } from 'lucide-react';
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
      evento_id: id 
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

  // Filtra os itens com base na aba selecionada
  const itensExibidos = roteiro.filter(item => item.categoria === abaAtiva);

  return (
    <div className="min-h-screen bg-[#7e7f7f] p-6 font-sans pb-24 text-slate-800">
      <Head><title>Roteiro do Dia | Cerimonial Elite</title></Head>
      
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-8 pt-4">
          <Link href={`/menu-evento?id=${id}`} className="bg-white/20 p-2 rounded-full text-white hover:bg-white/30 transition-all">
            <ArrowLeft size={20}/>
          </Link>
          <h1 className="text-white font-bold uppercase tracking-widest text-sm">Roteiro do Dia</h1>
          <button onClick={() => setShowModal(true)} className="bg-[#ded0b8] p-2 rounded-xl text-white shadow-lg hover:scale-105 transition-all">
            <Plus size={20}/>
          </button>
        </div>

        {/* --- ABINHAS SUTIS E ELEGANTES --- */}
        <div className="flex gap-6 border-b border-white/10 mb-8 px-2">
          <button 
            onClick={() => setAbaAtiva('cerimonia')}
            className={`pb-3 text-[10px] font-bold uppercase tracking-[2px] transition-all duration-300 ${
              abaAtiva === 'cerimonia' 
                ? 'text-[#ded0b8] border-b-2 border-[#ded0b8]' 
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            Cerimónia
          </button>
          <button 
            onClick={() => setAbaAtiva('recepcao')}
            className={`pb-3 text-[10px] font-bold uppercase tracking-[2px] transition-all duration-300 ${
              abaAtiva === 'recepcao' 
                ? 'text-[#ded0b8] border-b-2 border-[#ded0b8]' 
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            Recepção
          </button>
        </div>

        {/* --- LISTA DO ROTEIRO --- */}
        <div className="space-y-4 animate-in fade-in duration-500 relative">
          {/* Linha do tempo visual (decorativa) */}
          {itensExibidos.length > 0 && (
            <div className="absolute left-[23px] top-4 bottom-4 w-0.5 bg-white/20 z-0"></div>
          )}

          {itensExibidos.length > 0 ? itensExibidos.map((item) => (
            <div key={item.id} className="relative z-10 flex gap-4">
              {/* Círculo com o horário */}
              <div className="flex flex-col items-center">
                <div className="bg-[#ded0b8] text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xs shadow-lg ring-4 ring-[#7e7f7f]">
                  {item.horario}
                </div>
              </div>
              
              {/* Cartão de Conteúdo */}
              <div className="flex-1 bg-white p-5 rounded-[25px] shadow-xl relative group">
                <h3 className="font-bold text-gray-700 uppercase text-xs mb-2 pr-6 leading-tight">{item.atividade}</h3>
                
                {item.detalhes && (
                  <div className="text-[10px] text-gray-500 bg-gray-50 p-3 rounded-xl flex items-start gap-2 border border-gray-100">
                    {abaAtiva === 'cerimonia' ? <Music size={12} className="text-gray-400 mt-0.5 min-w-[12px]"/> : <AlignLeft size={12} className="text-gray-400 mt-0.5 min-w-[12px]"/>}
                    <p className="italic">{item.detalhes}</p>
                  </div>
                )}

                <button onClick={() => deletarItem(item.id)} className="absolute top-4 right-4 text-gray-200 hover:text-red-300 transition-colors">
                  <Trash2 size={14}/>
                </button>
              </div>
            </div>
          )) : (
            <p className="text-white/40 italic text-[10px] font-bold uppercase tracking-widest py-10 text-center">
              Nenhum item adicionado a este roteiro.
            </p>
          )}
        </div>

        {/* --- MODAL PARA ADICIONAR ITEM --- */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50">
            <div className="bg-white w-full max-w-xs rounded-[35px] p-8 shadow-2xl animate-in zoom-in duration-200">
              <h2 className="text-center font-bold text-gray-500 uppercase text-xs mb-6 tracking-widest">
                Novo Item - {abaAtiva === 'cerimonia' ? 'Cerimónia' : 'Recepção'}
              </h2>
              
              <div className="space-y-4 mb-8">
                <div>
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Horário</label>
                  <input type="time" className="w-full border-b p-2 outline-none text-sm text-gray-700" value={novoItem.horario} onChange={e=>setNovoItem({...novoItem, horario: e.target.value})} />
                </div>
                
                <div>
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Atividade (Ex: Entrada do Noivo)</label>
                  <input type="text" className="w-full border-b p-2 outline-none text-sm text-gray-700" placeholder="Nome da atividade" value={novoItem.atividade} onChange={e=>setNovoItem({...novoItem, atividade: e.target.value})} />
                </div>

                <div>
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                    {abaAtiva === 'cerimonia' ? 'Música / Detalhe' : 'Observações'}
                  </label>
                  <textarea className="w-full bg-gray-50 rounded-xl border-0 p-3 outline-none text-xs text-gray-600" rows={2} placeholder="Escreva os detalhes aqui..." value={novoItem.detalhes} onChange={e=>setNovoItem({...novoItem, detalhes: e.target.value})} />
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={()=>setShowModal(false)} className="flex-1 text-gray-400 font-bold text-[10px] uppercase">Cancelar</button>
                <button onClick={salvarItem} className="flex-2 bg-[#8da38d] text-white px-6 py-4 rounded-2xl font-bold uppercase text-[10px] shadow-lg active:scale-95 transition-all flex justify-center items-center gap-1">
                  <CheckCircle2 size={14}/> Salvar
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
