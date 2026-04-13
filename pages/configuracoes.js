import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';
import { ArrowLeft, UserPlus, Trash2, Lock, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Head from 'next/head';

const supabase = createClient(
 'https://rticfwqptlxkpgawpzwf.supabase.co',
 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0aWNmd3FwdGx4a3BnYXdwendmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NDA2MTEsImV4cCI6MjA4OTQxNjYxMX0.vOmi-rKKxXuZ5SP7uZe81Cr0fKW_fWN4Hmuf90soijM'
);

export default function ConfiguracoesAcesso() {
  const router = useRouter();
  const { id } = router.query; // Pega o ID do evento da URL
  
  const [usuarios, setUsuarios] = useState([]);
  const [evento, setEvento] = useState(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (id) {
      carregarDados();
    }
  }, [id]);

  async function carregarDados() {
    setLoading(true);
    // 1. Busca nome do evento
    const { data: ev } = await supabase.from('eventos').select('nome').eq('id', id).single();
    if (ev) setEvento(ev);

    // 2. Busca apenas usuários deste evento (supondo que sua tabela chame 'acessos_clientes')
    // Se a tabela ainda não existir, você precisará criá-la no Supabase
    const { data: acc } = await supabase.from('acessos_clientes').select('*').eq('evento_id', id);
    if (acc) setUsuarios(acc);
    
    setLoading(false);
  }

  const liberarAcesso = async () => {
    if (!email || !id) return alert("Digite o e-mail");
    setEnviando(true);
    
    const { error } = await supabase.from('acessos_clientes').insert([
      { email, evento_id: id, status: 'pendente', permissao_lista: true, permissao_presentes: false }
    ]);

    if (!error) {
      setEmail('');
      carregarDados();
      alert("Convite enviado!");
    } else {
      alert("Erro: " + error.message);
    }
    setEnviando(false);
  };

  const deletarAcesso = async (acessoId) => {
    if (confirm("Revogar acesso deste usuário?")) {
      await supabase.from('acessos_clientes').delete().eq('id', acessoId);
      carregarDados();
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#7e7f7f]">
       <Loader2 className="animate-spin text-white/50" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      <Head><title>Acessos | {evento?.nome}</title></Head>

      {/* HEADER DINÂMICO */}
      <div className="bg-[#7e7f7f] pt-12 pb-8 px-6 text-white rounded-b-[40px] shadow-lg sticky top-0 z-20">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button onClick={() => router.push(`/menu-evento?id=${id}`)} className="p-2 bg-white/10 rounded-full text-[#ded0b8]">
            <ArrowLeft size={20}/>
          </button>
          <div className="text-center">
            <h1 className="text-xs font-bold uppercase tracking-[3px]">Configurações</h1>
            <p className="text-[9px] text-white/40 uppercase font-bold mt-1 tracking-widest">{evento?.nome}</p>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-6">
        
        {/* SEÇÃO: LIBERAR ACESSO (SEM SELECT) */}
        <div className="bg-white rounded-[30px] p-6 shadow-sm mb-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[#ded0b8]/20 text-[#ded0b8] rounded-xl"><UserPlus size={20}/></div>
            <h2 className="font-bold text-gray-700 uppercase text-xs tracking-widest">Liberar Novo Acesso</h2>
          </div>
          
          <div className="space-y-4">
            <input 
              className="w-full border-b p-2 outline-none text-sm placeholder:text-gray-300" 
              placeholder="E-mail do Cliente" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            
            {/* O SELECT FOI REMOVIDO DAQUI */}
            
            <button 
              onClick={liberarAcesso}
              disabled={enviando}
              className="w-full bg-[#ded0b8] text-white font-bold py-4 rounded-2xl text-[10px] uppercase tracking-[2px] shadow-md active:scale-95 transition-all disabled:opacity-50"
            >
              {enviando ? "Enviando..." : "Enviar Convite de Acesso"}
            </button>
          </div>
        </div>

        {/* SEÇÃO: USUÁRIOS ATIVOS (FILTRADOS) */}
        <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[3px] mb-4 ml-2">Acessos para este Evento</h2>
        
        <div className="space-y-3">
          {usuarios.map(user => (
            <div key={user.id} className="bg-white p-5 rounded-[25px] shadow-sm border border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-700 text-xs uppercase">{user.email}</h3>
                  <p className="text-[9px] text-gray-400 font-bold uppercase mt-1 tracking-wider">Acesso Cliente</p>
                </div>
                <span className={`text-[8px] px-2 py-1 rounded-full font-bold uppercase ${user.status === 'ativo' ? 'bg-green-50 text-green-500' : 'bg-amber-50 text-amber-500'}`}>
                  {user.status}
                </span>
              </div>

              {/* CHAVINHAS DE PERMISSÃO */}
              <div className="mt-6 pt-4 border-t border-gray-50 grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-gray-400 uppercase">Lista Convidados</span>
                  <div className={`w-8 h-4 rounded-full relative cursor-pointer shadow-inner ${user.permissao_lista ? 'bg-[#8da38d]' : 'bg-gray-200'}`}>
                    <div className={`absolute top-1 w-2 h-2 bg-white rounded-full transition-all ${user.permissao_lista ? 'right-1' : 'left-1'}`}></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-gray-400 uppercase">Presentes</span>
                  <div className={`w-8 h-4 rounded-full relative cursor-pointer shadow-inner ${user.permissao_presentes ? 'bg-[#8da38d]' : 'bg-gray-200'}`}>
                    <div className={`absolute top-1 w-2 h-2 bg-white rounded-full transition-all ${user.permissao_presentes ? 'right-1' : 'left-1'}`}></div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-50 text-gray-400 text-[9px] font-bold uppercase hover:bg-gray-100 transition-colors">
                  <Lock size={12}/> Revogar Tudo
                </button>
                <button onClick={() => deletarAcesso(user.id)} className="p-3 rounded-xl text-red-100 hover:text-red-300 transition-colors">
                  <Trash2 size={16}/>
                </button>
              </div>
            </div>
          ))}
          {usuarios.length === 0 && (
            <p className="text-center text-gray-300 text-[10px] uppercase font-bold py-10">Nenhum acesso liberado.</p>
          )}
        </div>
      </div>
    </div>
  );
}
