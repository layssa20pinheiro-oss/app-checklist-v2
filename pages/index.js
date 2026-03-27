import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Plus, Calendar, Trash2, Users, Edit2, Bookmark } from 'lucide-react';
import Link from 'next/link';
import Head from 'next/head';

const supabase = createClient(
  'https://rticfwqptlxkpgawpzwf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0aWNmd3FwdGx4a3BnYXdwendmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NDA2MTEsImV4cCI6MjA4OTQxNjYxMX0.vOmi-rKKxXuZ5SP7uZe81Cr0fKW_fWN4Hmuf90soijM'
);

export default function Home() {
  const [reportPublico, setReportPublico] = useState(null);
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  // Agora o evento já nasce sabendo que o padrão é Casamento
  const [novoEvento, setNovoEvento] = useState({ nome: '', data: '', tipo: 'Casamento' });
  const [isEditing, setIsEditing] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);
  
  const [abaAtiva, setAbaAtiva] = useState('proximos');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reportId = params.get('id');
    if (reportId) {
      supabase.from('checklists').select('*').eq('id', reportId).single().then(({ data }) => {
        setReportPublico(data);
        setLoading(false);
      });
    } else {
      carregarEventos();
    }
  }, []);

  async function carregarEventos() {
    setLoading(true);
    const { data } = await supabase.from('eventos').select('*, convidados(id)').order('data', { ascending: true });
    if (data) setEventos(data);
    setLoading(false);
  }

  const salvarEvento = async () => {
    if (!novoEvento.nome) return;
    if (isEditing) {
      await supabase.from('eventos').update(novoEvento).eq('id', eventToEdit.id);
    } else {
      await supabase.from('eventos').insert([novoEvento]);
    }
    setNovoEvento({ nome: '', data: '', tipo: 'Casamento' });
    setShowModal(false);
    setIsEditing(false);
    carregarEventos();
  };

  const deletarEvento = async (id, e) => {
    e.preventDefault();
    if (confirm("Excluir este evento e TUDO o que há nele?")) {
      await supabase.from('eventos').delete().eq('id', id);
      carregarEventos();
    }
  };

  if (reportPublico) {
    return (
      <div className="min-h-screen bg-[#7e7f7f] p-6 flex flex-col items-center font-sans">
        <Head><title>Relatório | Cerimonial Elite</title><link rel="icon" href="/icon.png" /></Head>
        <img src="https://rticfwqptlxkpgawpzwf.supabase.co/storage/v1/object/public/fotos/logo.png" className="max-w-[150px] mb-8 mt-10" />
        <div className="w-full max-w-md bg-white rounded-[35px] p-8 shadow-2xl text-gray-700">
           <h2 className="text-[#7e7f7f] text-center font-bold text-xl mb-8 uppercase tracking-[5px]">Relatório Digital</h2>
           <div className="space-y-4 text-sm border-t pt-6">
             <p><strong>EVENTO:</strong> {reportPublico.evento}</p>
             <p><strong>LOCAL:</strong> {reportPublico.local}</p>
             <div className="border-t pt-4 font-bold uppercase text-[10px] text-gray-400">Itens Recolhidos:</div>
             <ul className="space-y-1 italic text-gray-500">{reportPublico.itens?.map((it, i) => <li key={i}>• {it}</li>)}</ul>
             <p className="border-t pt-4 italic"><strong>RESPONSÁVEL:</strong> {reportPublico.responsavel}</p>
          </div>
        </div>
      </div>
    );
  }

  const hoje = new Date().toISOString().split('T')[0];
  const eventosFuturos = eventos.filter(ev => !ev.data || ev.data >= hoje);
  const eventosPassados = eventos.filter(ev => ev.data && ev.data < hoje);

  return (
    <div className="min-h-screen bg-[#7e7f7f] p-6 font-sans pb-20">
      <Head><title>Cerimonial Elite</title><link rel="icon" href="/icon.png" /></Head>
      <div className="max-w-md mx-auto">
        
        <img src="https://rticfwqptlxkpgawpzwf.supabase.co/storage/v1/object/public/fotos/logo.png" className="max-w-[140px] mx-auto mb-10 mt-6" />
        
        <div className="flex justify-between items-center mb-8 text-white font-bold uppercase tracking-[3px] text-sm">
          <h1>Meus Eventos</h1>
          <button onClick={() => { setIsEditing(false); setNovoEvento({nome:'', data:'', tipo: 'Casamento'}); setShowModal(true); }} className="bg-[#ded0b8] p-2 rounded-xl shadow-lg hover:scale-105 transition-all">
             <Plus size={20}/>
          </button>
        </div>

        <div className="flex gap-6 border-b border-white/10 mb-8 px-2">
          <button onClick={() => setAbaAtiva('proximos')} className={`pb-3 text-[10px] font-bold uppercase tracking-[2px] transition-all duration-300 ${abaAtiva === 'proximos' ? 'text-[#ded0b8] border-b-2 border-[#ded0b8]' : 'text-white/40 hover:text-white/70'}`}>Próximos</button>
          <button onClick={() => setAbaAtiva('concluidos')} className={`pb-3 text-[10px] font-bold uppercase tracking-[2px] transition-all duration-300 ${abaAtiva === 'concluidos' ? 'text-[#ded0b8] border-b-2 border-[#ded0b8]' : 'text-white/40 hover:text-white/70'}`}>Concluídos</button>
        </div>

        {/* --- LISTA DE EVENTOS --- */}
        <div className="space-y-4 animate-in fade-in duration-500">
          {(abaAtiva === 'proximos' ? eventosFuturos : eventosPassados).length > 0 ? (
            (abaAtiva === 'proximos' ? eventosFuturos : eventosPassados).map(ev => (
              <div key={ev.id} className={`relative group ${abaAtiva === 'concluidos' ? 'opacity-90 hover:opacity-100' : ''}`}>
                <Link href={`/menu-evento?id=${ev.id}`} className={`block p-5 rounded-[30px] shadow-xl hover:scale-[1.01] transition-all ${abaAtiva === 'concluidos' ? 'bg-gray-100' : 'bg-white'}`}>
                  <h3 className={`font-bold uppercase text-xs pr-20 ${abaAtiva === 'concluidos' ? 'text-gray-500' : 'text-gray-700'}`}>{ev.nome}</h3>
                  <div className="flex flex-wrap gap-3 mt-3 text-[9px] text-gray-400 font-bold uppercase">
                     <span className="flex items-center gap-1"><Calendar size={10} className={abaAtiva === 'concluidos' ? 'text-gray-400' : 'text-[#ded0b8]'}/>{ev.data ? new Date(ev.data).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : 'Sem Data'}</span>
                     <span className="flex items-center gap-1"><Users size={10} className={abaAtiva === 'concluidos' ? 'text-gray-400' : 'text-[#8da38d]'} />{ev.convidados?.length || 0} Convidados</span>
                     {/* Nova etiqueta com o TIPO DO EVENTO */}
                     <span className="flex items-center gap-1 text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full"><Bookmark size={10} /> {ev.tipo || 'Casamento'}</span>
                  </div>
                </Link>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
                  <button onClick={() => { setEventToEdit(ev); setNovoEvento({nome: ev.nome, data: ev.data, tipo: ev.tipo || 'Casamento'}); setIsEditing(true); setShowModal(true); }} className={`p-2 transition-colors ${abaAtiva === 'concluidos' ? 'text-gray-300 hover:text-[#ded0b8]' : 'text-gray-200 hover:text-[#ded0b8]'}`}><Edit2 size={16}/></button>
                  <button onClick={(e) => deletarEvento(ev.id, e)} className={`p-2 transition-colors ${abaAtiva === 'concluidos' ? 'text-gray-300 hover:text-red-300' : 'text-gray-200 hover:text-red-300'}`}><Trash2 size={16}/></button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-white/40 italic text-[10px] font-bold uppercase tracking-widest py-10 text-center">Nenhum evento {abaAtiva === 'proximos' ? 'agendado' : 'concluído'}.</p>
          )}
        </div>

        {/* --- MODAL COM ESCOLHA DO TIPO --- */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50">
            <div className="bg-white w-full max-w-sm rounded-[35px] p-8 shadow-2xl animate-in zoom-in duration-200">
              <h2 className="text-center font-bold text-gray-500 uppercase text-xs mb-6 tracking-widest">{isEditing ? "Editar Evento" : "Novo Evento"}</h2>
              
              <div className="space-y-4 mb-8">
                <div>
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Categoria do Evento</label>
                  <div className="flex gap-2 bg-gray-100 p-1 rounded-2xl">
                    {['Casamento', '15 Anos', 'Corporativo'].map(tipoOpcao => (
                      <button 
                        key={tipoOpcao}
                        onClick={() => setNovoEvento({...novoEvento, tipo: tipoOpcao})}
                        className={`flex-1 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all ${novoEvento.tipo === tipoOpcao ? 'bg-white text-gray-700 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        {tipoOpcao}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1 mt-2">Nome do Evento</label>
                  <input className="w-full border-b p-2 outline-none text-sm text-gray-700" placeholder="Ex: Casamento João e Maria" value={novoEvento.nome} onChange={e=>setNovoEvento({...novoEvento, nome: e.target.value})} />
                </div>
                
                <div>
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Data</label>
                  <input type="date" className="w-full border-b p-2 outline-none text-sm text-gray-500" value={novoEvento.data} onChange={e=>setNovoEvento({...novoEvento, data: e.target.value})} />
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={()=>setShowModal(false)} className="flex-1 text-gray-400 font-bold text-[10px] uppercase">Cancelar</button>
                <button onClick={salvarEvento} className="flex-2 bg-[#8da38d] text-white px-6 py-4 rounded-2xl font-bold uppercase text-[10px] active:scale-95 transition-all shadow-md">Salvar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
