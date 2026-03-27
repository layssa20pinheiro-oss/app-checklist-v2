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
  const { id } = router.query;
  
  const [roteiro, setRoteiro] = useState([]);
  const [loading, setLoading] = useState(true);
  const [abaAtiva, setAbaAtiva] = useState('cerimonia');
  
  const [showModal, setShowModal] = useState(false);
  const [modoModal, setModoModal] = useState('manual'); // 'manual', 'rapido' ou 'ia'
  const [novoItem, setNovoItem] = useState({ horario: '', atividade: '', detalhes: '' });
  const [textoRascunho, setTextoRascunho] = useState('');
  const [gerandoIA, setGerandoIA] = useState(false);

  useEffect(() => { if (id) carregarRoteiro(); }, [id]);

  async function carregarRoteiro() {
    setLoading(true);
    const { data } = await supabase.from('roteiros').select('*').eq('evento_id', id).order('horario', { ascending: true });
    if (data) setRoteiro(data);
    setLoading(false);
  }

  const salvarItem = async () => {
    if (!novoItem.horario || !novoItem.atividade) return alert("Preencha o horário e a atividade!");
    setLoading(true);
    await supabase.from('roteiros').insert([{ ...novoItem, categoria: abaAtiva, evento_id: id, concluido: false }]);
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
    setRoteiro(roteiro.map(r => r.id === item.id ? {...r, concluido: !r.concluido} : r));
    await supabase.from('roteiros').update({ concluido: !item.concluido }).eq('id', item.id);
  };

  // --- PLANO A: A MÁGICA DA IA (Google) ---
  const organizarComIA = async () => {
    if (!textoRascunho) return alert("Cole o rascunho primeiro!");
    setGerandoIA(true);
    try {
      const response = await fetch('/api/gerar-roteiro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ textoRascunho })
      });
      const data = await response.json();
      if (!response.ok) {
        alert("Erro na IA: " + data.error);
        setGerandoIA(false);
        return;
      }
      const itensParaSalvar = data.map(item => ({
        horario: item.horario || '00:00',
        atividade: item.atividade || 'Atividade',
        detalhes: item.detalhes || '',
        categoria: item.categoria || abaAtiva,
        evento_id: id,
        concluido: false
      }));
      await supabase.from('roteiros').insert(itensParaSalvar);
      setTextoRascunho('');
      setShowModal(false);
      carregarRoteiro();
      alert("✨ Mágica feita! Roteiro organizado com IA!");
    } catch (error) {
      alert("Erro no aplicativo: " + error.message);
    }
    setGerandoIA(false);
  };

  // --- PLANO B: ORGANIZADOR RÁPIDO (Nosso Código) ---
  const organizarRapido = async () => {
    if (!textoRascunho) return alert("Cole o rascunho primeiro!");
    setGerandoIA(true);
    try {
      // Divide o texto em linhas
      const linhas = textoRascunho.split('\n').filter(l => l.trim() !== '');
      
      const itensParaSalvar = linhas.map(linha => {
        // Tenta achar um horário no formato HH:MM ou HHhMM
        const matchHorario = linha.match(/\b\d{1,2}[:h]\d{2}\b/i);
        let horario = matchHorario ? matchHorario[0].replace('h', ':').replace('H', ':') : '00:00';
        
        // Remove o horário da linha para pegar o resto
        let resto = linha.replace(matchHorario ? matchHorario[0] : '', '').trim();
        resto = resto.replace(/^[-–:.\s]+/, ''); // Limpa traços no começo
        
        let atividade = resto;
        let detalhes = '';
        
        // Se tiver um traço no meio, separa a atividade do detalhe
        if (resto.includes('-')) {
           const partes = resto.split('-');
           atividade = partes[0].trim();
           detalhes = partes.slice(1).join('-').trim();
        }

        return {
          horario: horario,
          atividade: atividade || 'Atividade',
          detalhes: detalhes,
          categoria: abaAtiva,
          evento_id: id,
          concluido: false
        };
      });

      if (itensParaSalvar.length > 0) {
        await supabase.from('roteiros').insert(itensParaSalvar);
        setTextoRascunho('');
        setShowModal(false);
        carregarRoteiro();
        alert("⚡ Roteiro organizado com Sucesso!");
      }
    } catch (error) {
      alert("Erro ao organizar: " + error.message);
    }
    setGerandoIA(false);
  };

  const itensExibidos = roteiro.filter(item => item.categoria === abaAtiva);

  return (
    <div className="min-h-screen bg-[#7e7f7f] p-4 flex flex-col items-center font-sans pb-24 text-slate-800">
      <Head><title>Roteiro do Dia | Cerimonial Elite</title></Head>
      <div className="w-full max-w-md animate-in fade-in duration-500">
        
        <div className="flex items-center justify-between mb-6 pt-4">
          <Link href={`/menu-evento?id=${id}`} className="bg-white/20 p-2 rounded-full text-white hover:bg-white/30 transition-all"><ArrowLeft size={20}/></Link>
          <h1 className="text-white font-bold uppercase tracking-widest text-sm">Roteiro do Dia</h1>
          <button onClick={() => setShowModal(true)} className="bg-[#ded0b8] p-2 rounded-xl text-white shadow-lg active:scale-95 transition-all"><Plus size={20}/></button>
        </div>

        <div className="flex gap-6 border-b border-white/10 mb-6 px-2">
          <button onClick={() => setAbaAtiva('cerimonia')} className={`pb-3 text-[10px] font-bold uppercase tracking-[2px] transition-all duration-300 ${abaAtiva === 'cerimonia' ? 'text-[#ded0b8] border-b-2 border-[#ded0b8]' : 'text-white/40 hover:text-white/70'}`}>Cerimónia</button>
          <button onClick={() => setAbaAtiva('recepcao')} className={`pb-3 text-[10px] font-bold uppercase tracking-[2px] transition-all duration-300 ${abaAtiva === 'recepcao' ? 'text-[#ded0b8] border-b-2 border-[#ded0b8]' : 'text-white/40 hover:text-white/70'}`}>Recepção</button>
        </div>

        {loading ? (
           <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#ded0b8]" size={30} /></div>
        ) : (
          <div className="relative animate-in fade-in duration-500">
            {itensExibidos.length > 1 && <div className="absolute left-[20px] top-4 bottom-4 w-0.5 bg-white/10 z-0"></div>}
            {itensExibidos.length > 0 ? itensExibidos.map((item) => (
              <div key={item.id} className={`relative z-10 flex gap-3 items-start pb-2 mb-2 border-b border-white/5 transition-opacity duration-300 ${item.concluido ? 'opacity-40' : ''}`}>
                <div className="flex flex-col items-center pt-0.5">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ring-2 ${item.concluido ? 'bg-gray-400 text-gray-100 ring-[#7e7f7f]' : 'bg-[#ded0b8] text-white ring-white/20'}`}>
                    {item.horario}
                  </div>
                </div>
                <div className="flex-1 bg-white p-3 rounded-2xl shadow-md flex items-start gap-2 relative">
                  <button onClick={() => alternarConcluido(item)} className="mt-0.5 min-w-[16px]">
                      {item.concluido ? <CheckSquare size={16} className="text-[#8da38d]"/> : <Square size={16} className="text-gray-300 hover:text-gray-400"/>}
                  </button>
                  <div className="flex-1">
                      <h3 className={`font-bold text-gray-700 uppercase text-[11px] leading-tight pr-6 ${item.concluido ? 'line-through text-gray-400' : ''}`}>{item.atividade}</h3>
                      {item.detalhes && <p className={`text-[9px] mt-1 italic leading-tight ${item.concluido ? 'text-gray-300' : 'text-gray-400'}`}>• {item.detalhes}</p>}
                  </div>
                  <button onClick={() => deletarItem(item.id)} className="absolute top-3 right-3 text-gray-200 hover:text-red-200 transition-colors"><Trash2 size={12}/></button>
                </div>
              </div>
            )) : (
              <p className="text-white/40 italic text-[10px] font-bold uppercase tracking-widest py-10 text-center">Roteiro vazio.</p>
            )}
          </div>
        )}

        {/* MODAL COM AS 3 OPÇÕES */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white w-full max-w-sm rounded-[35px] p-6 shadow-2xl animate-in zoom-in duration-200">
              
              <div className="flex bg-gray-100 p-1 rounded-2xl mb-6">
                <button onClick={() => setModoModal('manual')} className={`flex-1 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all ${modoModal === 'manual' ? 'bg-white text-gray-700 shadow-sm' : 'text-gray-400'}`}>Manual</button>
                <button onClick={() => setModoModal('rapido')} className={`flex-1 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-1 ${modoModal === 'rapido' ? 'bg-[#7e7f7f] text-white shadow-sm' : 'text-gray-400'}`}><Zap size={12}/> Rápido</button>
                <button onClick={() => setModoModal('ia')} className={`flex-1 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-1 ${modoModal === 'ia' ? 'bg-gradient-to-r from-[#ded0b8] to-[#c4b59d] text-white shadow-sm' : 'text-gray-400'}`}><Sparkles size={12}/> IA Mágica</button>
              </div>

              {modoModal === 'manual' && (
                <div className="space-y-4 mb-6">
                  <div><label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Horário</label><input type="time" className="w-full border-b p-2 outline-none text-sm text-gray-700" value={novoItem.horario} onChange={e=>setNovoItem({...novoItem, horario: e.target.value})} /></div>
                  <div><label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Atividade</label><input type="text" className="w-full border-b p-2 outline-none text-sm text-gray-700" placeholder="Ex: Entrada dos Noivos" value={novoItem.atividade} onChange={e=>setNovoItem({...novoItem, atividade: e.target.value})} /></div>
                  <div><label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Detalhes</label><input type="text" className="w-full border-b p-2 outline-none text-xs text-gray-600" placeholder="Ex: Música X" value={novoItem.detalhes} onChange={e=>setNovoItem({...novoItem, detalhes: e.target.value})} /></div>
                  <div className="flex gap-2 pt-4">
                    <button onClick={()=>setShowModal(false)} className="flex-1 text-gray-400 font-bold text-[10px] uppercase">Sair</button>
                    <button onClick={salvarItem} className="flex-2 bg-[#8da38d] text-white px-6 py-4 rounded-2xl font-bold uppercase text-[10px] shadow-lg flex justify-center items-center gap-1"><CheckCircle2 size={14}/> Salvar</button>
                  </div>
                </div>
              )}

              {modoModal === 'rapido' && (
                <div className="space-y-4 mb-6">
                  <p className="text-[10px] text-gray-500 italic text-center leading-tight">Cole o roteiro com horários em cada linha e traços (Ex: 19:00 - Entrada - Música X). O app organizará na hora, sem depender de internet externa.</p>
                  <textarea className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 outline-none text-xs text-gray-600 h-32" placeholder="Ex:&#10;19:00 - Entrada Pais&#10;19:15 - Entrada Noivo - Musica Y" value={textoRascunho} onChange={e=>setTextoRascunho(e.target.value)}></textarea>
                  <div className="flex gap-2 pt-2">
                    <button onClick={()=>setShowModal(false)} disabled={gerandoIA} className="flex-1 text-gray-400 font-bold text-[10px] uppercase">Sair</button>
                    <button onClick={organizarRapido} disabled={gerandoIA} className="flex-2 bg-[#7e7f7f] text-white px-6 py-4 rounded-2xl font-bold uppercase text-[10px] shadow-lg flex justify-center items-center gap-2">
                      {gerandoIA ? <Loader2 className="animate-spin" size={16}/> : <Zap size={16}/>} Gerar Rápido
                    </button>
                  </div>
                </div>
              )}

              {modoModal === 'ia' && (
                <div className="space-y-4 mb-6">
                  <p className="text-[10px] text-gray-500 italic text-center leading-tight">Cole qualquer texto bagunçado. O Google usará a chave da API para organizar e classificar tudo.</p>
                  <textarea className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 outline-none text-xs text-gray-600 h-32" placeholder="Cole o texto desorganizado aqui..." value={textoRascunho} onChange={e=>setTextoRascunho(e.target.value)}></textarea>
                  <div className="flex gap-2 pt-2">
                    <button onClick={()=>setShowModal(false)} disabled={gerandoIA} className="flex-1 text-gray-400 font-bold text-[10px] uppercase">Sair</button>
                    <button onClick={organizarComIA} disabled={gerandoIA} className="flex-2 bg-gradient-to-r from-[#ded0b8] to-[#c4b59d] text-white px-6 py-4 rounded-2xl font-bold uppercase text-[10px] shadow-lg flex justify-center items-center gap-2">
                      {gerandoIA ? <Loader2 className="animate-spin" size={16}/> : <Sparkles size={16}/>} IA Mágica
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
