import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ArrowLeft, Plus, Calendar, Users, Trash2, Edit2 } from 'lucide-react';
import Head from 'next/head';

const supabase = createClient(
  'https://rticfwqptlxkpgawpzwf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0aWNmd3FwdGx4a3BnYXdwendmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NDA2MTEsImV4cCI6MjA4OTQxNjYxMX0.vOmi-rKKxXuZ5SP7uZe81Cr0fKW_fWN4Hmuf90soijM'
);

export default function EventosLista() {
  const router = useRouter();
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [abaAtiva, setAbaAtiva] = useState('proximos');

  useEffect(() => {
    carregarEventos();
  }, []);

  async function carregarEventos() {
    const { data } = await supabase.from('eventos').select('*, convidados(id)');
    if (data) setEventos(data);
    setLoading(false);
  }

  // ============================================================
  // FUNÇÕES DE AÇÃO (EDITAR E DELETAR)
  // ============================================================
  async function deletarEvento(e, eventoId, nomeEvento) {
    e.stopPropagation(); // IMPEDE de abrir o evento ao clicar na lixeira
    
    const confirmar = confirm(`Tem certeza que deseja excluir o evento "${nomeEvento}"?`);
    if (!confirmar) return;

    const { error } = await supabase.from('eventos').delete().eq('id', eventoId);
    
    if (error) {
      alert("Erro ao deletar");
    } else {
      carregarEventos(); // Recarrega a lista
    }
  }

  function editarEvento(e, eventoId) {
    e.stopPropagation(); // IMPEDE de abrir o evento ao clicar no lápis
    router.push(`/eventos-editar?id=${eventoId}`);
  }
  // ============================================================

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const proximosEventos = eventos.filter(e => new Date(e.data) >= hoje);
  const concluidosEventos = eventos.filter(e => new Date(e.data) < hoje);
  
  const listaExibida = abaAtiva === 'proximos' ? proximosEventos : concluidosEventos;

  return (
    <div className="min-h-screen bg-[#7e7f7f] font-sans pb-10">
      <Head><title>Meus Eventos | NC Cerimonial</title></Head>

      {/* CABEÇALHO */}
      <div className="pt-12 pb-4 px-6">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button 
            onClick={() => router.push('/')} 
            className="p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition"
          >
            <ArrowLeft size={20} />
          </button>
          
          <h1 className="text-xs font-bold uppercase tracking-[4px] text-white">Meus Eventos</h1>
          
          <button 
            onClick={() => router.push('/eventos-novo')}
            className="p-3 bg-[#ded0b8] rounded-2xl text-white shadow-xl active:scale-95 transition"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* ABAS */}
      <div className="max-w-md mx-auto px-6 mb-8">
        <div className="flex gap-8 border-b border-white/10 px-2">
          <button 
            onClick={() => setAbaAtiva('proximos')}
            className={`pb-4 text-[10px] font-bold uppercase tracking-[2px] transition-all ${abaAtiva === 'proximos' ? 'text-[#ded0b8] border-b-2 border-[#ded0b8]' : 'text-white/30'}`}
          >
            Próximos
          </button>
          <button 
            onClick={() => setAbaAtiva('concluidos')}
            className={`pb-4 text-[10px] font-bold uppercase tracking-[2px] transition-all ${abaAtiva === 'concluidos' ? 'text-[#ded0b8] border-b-2 border-[#ded0b8]' : 'text-white/30'}`}
          >
            Concluídos
          </button>
        </div>
      </div>

      {/* LISTAGEM */}
      <div className="max-w-md mx-auto px-6 space-y-4">
        {loading ? (
          <p className="text-center text-white/30 uppercase text-[9px] tracking-[4px] py-20 animate-pulse">Sincronizando eventos...</p>
        ) : (
          <>
            {listaExibida.map(evento => (
              <div 
                key={evento.id} 
                onClick={() => router.push(`/menu-evento?id=${evento.id}`)}
                className="bg-white p-6 rounded-[35px] shadow-xl border border-white/10 hover:scale-[1.01] transition cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-gray-700 text-sm uppercase tracking-tight group-hover:text-[#b0966a] transition-colors">
                    {evento.nome}
                  </h3>
                  
                  {/* BOTÕES DE AÇÃO INTEGRADOS */}
                  <div className="flex gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => editarEvento(e, evento.id)}
                      className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-blue-500 transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={(e) => deletarEvento(e, evento.id, evento.nome)}
                      className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center gap-1.5 text-[8px] font-bold text-gray-400 uppercase bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                    <Calendar size={12} /> {new Date(evento.data).toLocaleDateString('pt-BR')}
                  </div>
                  <div className="flex items-center gap-1.5 text-[8px] font-bold text-gray-400 uppercase bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                    <Users size={12} /> {evento.convidados?.length || 0} Convidados
                  </div>
                  <div className="flex items-center gap-1.5 text-[8px] font-bold text-[#ded0b8] uppercase bg-[#ded0b8]/10 px-3 py-1.5 rounded-full">
                    {evento.tipo}
                  </div>
                </div>
              </div>
            ))}

            {listaExibida.length === 0 && (
              <div className="text-center py-20 bg-white/5 rounded-[40px] border border-dashed border-white/10">
                <p className="text-white/20 text-[9px] font-bold uppercase tracking-widest">Nenhum evento nesta categoria</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
