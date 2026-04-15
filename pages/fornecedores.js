import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ArrowLeft, MessageCircle, Instagram, Search, Star, Plus, Trash2, X, Loader2 } from 'lucide-react';
import Head from 'next/head';

const supabase = createClient(
  'https://rticfwqptlxkpgawpzwf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0aWNmd3FwdGx4a3BnYXdwendmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NDA2MTEsImV4cCI6MjA4OTQxNjYxMX0.vOmi-rKKxXuZ5SP7uZe81Cr0fKW_fWN4Hmuf90soijM'
);

export default function VitrineFornecedores() {
  const router = useRouter();
  const { id, admin } = router.query;
  const isAdmin = admin === 'true';

  const [fornecedores, setFornecedores] = useState([]);
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [salvando, setSalvando] = useState(false);
  
  // Estado do formulário
  const [novoForn, setNovoForn] = useState({ 
    nome: '', categoria: '', whatsapp: '', instagram: '', foto_url: '', destaque: false 
  });

  useEffect(() => { if (id) carregarFornecedores(); }, [id]);

  async function carregarFornecedores() {
    setLoading(true);
    const { data } = await supabase.from('fornecedores_indicados').select('*').eq('evento_id', id).order('categoria');
    if (data) setFornecedores(data);
    setLoading(false);
  }

  const salvarFornecedor = async () => {
    if (!novoForn.nome || !novoForn.categoria) return alert("Nome e Categoria são obrigatórios!");
    setSalvando(true);
    const { error } = await supabase.from('fornecedores_indicados').insert([{ ...novoForn, evento_id: id }]);
    if (!error) {
      setNovoForn({ nome: '', categoria: '', whatsapp: '', instagram: '', foto_url: '', destaque: false });
      setShowModal(false);
      carregarFornecedores();
    }
    setSalvando(false);
  };

  const deletarFornecedor = async (fornId) => {
    if (confirm("Remover este fornecedor?")) {
      await supabase.from('fornecedores_indicados').delete().eq('id', fornId);
      carregarFornecedores();
    }
  };

  const filtrados = fornecedores.filter(f => 
    f.nome.toLowerCase().includes(busca.toLowerCase()) || 
    f.categoria.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#7e7f7f] font-sans pb-10">
      <Head><title>Indicações | Cerimonial</title></Head>

      {/* HEADER */}
      <div className="pt-12 pb-6 px-6 text-white sticky top-0 bg-[#7e7f7f] z-20">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button onClick={() => router.back()} className="p-2 bg-white/10 rounded-full"><ArrowLeft size={20} /></button>
          <div className="text-center">
             <h1 className="text-xs font-bold uppercase tracking-[3px]">Indicações</h1>
             <p className="text-[9px] text-white/40 uppercase font-bold mt-1 tracking-widest">Fornecedores Elite</p>
          </div>
          {isAdmin ? (
            <button onClick={() => setShowModal(true)} className="bg-[#ded0b8] p-2 rounded-xl text-white shadow-lg"><Plus size={20}/></button>
          ) : <div className="w-10"></div>}
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 space-y-6">
        {/* BUSCA */}
        <div className="relative">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
           <input 
              type="text" placeholder="BUSCAR POR CATEGORIA OU NOME..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-[10px] text-white outline-none focus:border-[#ded0b8]/50 placeholder:text-white/20"
              value={busca} onChange={(e) => setBusca(e.target.value)}
           />
        </div>

        {/* VITRINE */}
        <div className="grid grid-cols-1 gap-4">
          {filtrados.map(forn => (
            <div key={forn.id} className="bg-white rounded-[30px] overflow-hidden shadow-xl border border-white/10 relative">
              <div className="h-32 bg-gray-100 flex items-center justify-center relative">
                {forn.foto_url ? <img src={forn.foto_url} className="w-full h-full object-cover" /> : <div className="text-[10px] uppercase font-bold text-gray-300 tracking-[4px]">{forn.categoria}</div>}
                {forn.destaque && <div className="absolute top-4 right-4 bg-[#ded0b8] text-white p-1.5 rounded-full shadow-lg"><Star size={12} fill="white"/></div>}
              </div>

              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-gray-700 text-sm uppercase leading-tight">{forn.nome}</h3>
                    <p className="text-[9px] text-[#ded0b8] font-bold uppercase mt-1 tracking-wider">{forn.categoria}</p>
                  </div>
                  {isAdmin && (
                    <button onClick={() => deletarFornecedor(forn.id)} className="text-gray-200 hover:text-red-400"><Trash2 size={16}/></button>
                  )}
                </div>

                <div className="flex gap-2">
                  <a href={`https://wa.me/${forn.whatsapp?.replace(/\D/g, '')}`} target="_blank" className="flex-1 bg-[#25D366] text-white py-3 rounded-xl font-bold text-[9px] uppercase flex items-center justify-center gap-2">
                    <MessageCircle size={14}/> Orçamento
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL DE CADASTRO (SÓ ADMIN) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-t-[40px] sm:rounded-[40px] p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">Novo Fornecedor</h2>
              <button onClick={() => setShowModal(false)} className="p-2 bg-gray-50 rounded-full text-gray-400"><X size={20}/></button>
            </div>
            
            <div className="space-y-4">
              <input className="w-full border-b p-3 outline-none text-sm" placeholder="Nome do Fornecedor" value={novoForn.nome} onChange={e => setNovoForn({...novoForn, nome: e.target.value})} />
              <input className="w-full border-b p-3 outline-none text-sm" placeholder="Categoria (Ex: Buffet)" value={novoForn.categoria} onChange={e => setNovoForn({...novoForn, categoria: e.target.value})} />
              <input className="w-full border-b p-3 outline-none text-sm" placeholder="WhatsApp (DDD + Número)" value={novoForn.whatsapp} onChange={e => setNovoForn({...novoForn, whatsapp: e.target.value})} />
              <input className="w-full border-b p-3 outline-none text-sm" placeholder="Link da Foto/Logo (URL)" value={novoForn.foto_url} onChange={e => setNovoForn({...novoForn, foto_url: e.target.value})} />
              
              <div className="flex items-center gap-2 py-2">
                <input type="checkbox" checked={novoForn.destaque} onChange={e => setNovoForn({...novoForn, destaque: e.target.checked})} className="w-4 h-4 accent-[#ded0b8]" />
                <label className="text-[10px] font-bold uppercase text-gray-400">Destacar este fornecedor</label>
              </div>

              <button 
                onClick={salvarFornecedor} 
                disabled={salvando}
                className="w-full bg-[#ded0b8] text-white font-bold py-4 rounded-2xl text-[10px] uppercase tracking-[2px] shadow-lg mt-4 flex items-center justify-center gap-2"
              >
                {salvando ? <Loader2 className="animate-spin" size={16}/> : 'Cadastrar Fornecedor'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
