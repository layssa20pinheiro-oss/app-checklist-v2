import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';
import { ArrowLeft, UserPlus, Trash2, Lock, Loader2, MessageCircle, Mail } from 'lucide-react';
import Link from 'next/link';
import Head from 'next/head';

const supabase = createClient(
 'https://rticfwqptlxkpgawpzwf.supabase.co',
 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0aWNmd3FwdGx4a3BnYXdwendmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NDA2MTEsImV4cCI6MjA4OTQxNjYxMX0.vOmi-rKKxXuZ5SP7uZe81Cr0fKW_fWN4Hmuf90soijM'
);

export default function ConfiguracoesAcesso() {
  const router = useRouter();
  const { id } = router.query;
  
  const [usuarios, setUsuarios] = useState([]);
  const [evento, setEvento] = useState(null);
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState(''); // Novo campo
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (id) carregarDados();
  }, [id]);

  async function carregarDados() {
    setLoading(true);
    const { data: ev } = await supabase.from('eventos').select('nome').eq('id', id).single();
    if (ev) setEvento(ev);

    const { data: acc } = await supabase.from('acessos_clientes').select('*').eq('evento_id', id);
    if (acc) setUsuarios(acc);
    setLoading(false);
  }

  const liberarAcesso = async () => {
    if (!email || !id) return alert("Preencha o e-mail!");
    setEnviando(true);
    const { error } = await supabase.from('acessos_clientes').insert([
      { email, telefone, evento_id: id, status: 'pendente', permissao_lista: true, permissao_presentes: false }
    ]);
    if (!error) {
      setEmail(''); setTelefone(''); carregarDados();
      alert("Acesso salvo no sistema!");
    }
    setEnviando(false);
  };

  const dispararWhatsapp = (user) => {
    const link = `${window.location.origin}/acesso-cliente?id=${id}`;
    const msg = `Olá! ✨ Seu acesso ao painel do evento *${evento?.nome}* está liberado!\n\nClique aqui: ${link}`;
    window.open(`https://wa.me/${user.telefone?.replace(/\D/g, '') || ''}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const dispararEmail = (user) => {
    const link = `${window.location.origin}/acesso-cliente?id=${id}`;
    const assunto = `Painel do Evento: ${evento?.nome}`;
    const corpo = `Olá! Seu link de acesso exclusivo é: ${link}`;
    window.location.href = `mailto:${user.email}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#7e7f7f]"><Loader2 className="animate-spin text-white/50" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      <Head><title>Acessos | {evento?.nome}</title></Head>

      <div className="bg-[#7e7f7f] pt-12 pb-8 px-6 text-white rounded-b-[40px] shadow-lg sticky top-0 z-20">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button onClick={() => router.push(`/menu-evento?id=${id}`)} className="p-2 bg-white/10 rounded-full text-[#ded0b8]"><ArrowLeft size={20}/></button>
          <div className="text-center">
            <h1 className="text-xs font-bold uppercase tracking-[3px]">Configurações</h1>
            <p className="text-[9px] text-white/40 uppercase font-bold mt-1 tracking-widest">{evento?.nome}</p>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-6">
        <div className="bg-white rounded-[30px] p-6 shadow-sm mb-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[#ded0b8]/20 text-[#ded0b8] rounded-xl"><UserPlus size={20}/></div>
            <h2 className="font-bold text-gray-700 uppercase text-xs tracking-widest">Liberar Novo Acesso</h2>
          </div>
          <div className="space-y-4">
            <input className="w-full border-b p-2 outline-none text-sm placeholder:text-gray-300" placeholder="E-mail do Cliente" value={email} onChange={e => setEmail(e.target.value)} />
            <input className="w-full border-b p-2 outline-none text-sm placeholder:text-gray-300" placeholder="WhatsApp (DDD + Número)" value={telefone} onChange={e => setTelefone(e.target.value)} />
            <button onClick={liberarAcesso} disabled={enviando} className="w-full bg-[#ded0b8] text-white font-bold py-4 rounded-2xl text-[10px] uppercase tracking-[2px] shadow-md active:scale-95">
              {enviando ? "Salvando..." : "Salvar e Liberar"}
            </button>
          </div>
        </div>

        <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[3px] mb-4 ml-2">Usuários com Acesso</h2>
        <div className="space-y-4">
          {usuarios.map(user => (
            <div key={user.id} className="bg-white p-5 rounded-[25px] shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-gray-700 text-xs uppercase">{user.email}</h3>
                  <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">Acesso Cliente</p>
                </div>
                <span className="text-[8px] px-2 py-1 rounded-full font-bold uppercase bg-green-50 text-green-500">Ativo</span>
              </div>

              <div className="grid grid-cols-1 gap-2 mt-4">
                <button onClick={() => dispararWhatsapp(user)} className="w-full bg-[#25D366] text-white py-3 rounded-xl font-bold text-[9px] uppercase flex items-center justify-center gap-2 shadow-sm">
                  <MessageCircle size={14}/> Enviar via WhatsApp
                </button>
                <button onClick={() => dispararEmail(user)} className="w-full bg-gray-50 text-gray-500 py-3 rounded-xl font-bold text-[9px] uppercase flex items-center justify-center gap-2 border border-gray-100">
                  <Mail size={14}/> Enviar por E-mail
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
