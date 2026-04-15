import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ArrowLeft, MessageCircle, Instagram, Search, Star, Plus, Trash2 } from 'lucide-react';
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

  useEffect(() => { if (id) carregarFornecedores(); }, [id]);

  async function carregarFornecedores() {
    const { data } = await supabase.from('fornecedores_indicados').select('*').eq('evento_id', id).order('categoria');
    if (data) setFornecedores(data);
    setLoading(false);
  }

  const filtrados = fornecedores.filter(f => 
    f.nome.toLowerCase().includes(busca.toLowerCase()) || 
    f.categoria.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#7e7f7f] font-sans pb-10">
      <Head><title>Fornecedores Indicados</title></Head>

      {/* [1] HEADER */}
      <div className="pt-12 pb-6 px-6 text-white sticky top-0 bg-[#7e7f7f] z-20">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button onClick={() => router.back()} className="p-2 bg-white/10 rounded-full"><ArrowLeft size={20} /></button>
          <div className="text-center">
             <h1 className="text-xs font-bold uppercase tracking-[3px]">Indicações</h1>
             <p className="text-[9px] text-white/40 uppercase font-bold mt-1 tracking-widest">Profissionais de Confiança</p>
          </div>
          {isAdmin ? <button className="bg-[#ded0b8] p-2 rounded-xl text-white"><Plus size={20}/></button> : <div className="w-10"></div>}
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 space-y-6">
        
        {/* [2] BUSCA */}
        <div className="relative">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
           <input 
              type="text"
              placeholder="BUSCAR POR CATEGORIA OU NOME..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-xs text-white outline-none focus:border-[#ded0b8]/50 placeholder:text-white/20"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
           />
        </div>

        {/* [3] VITRINE DE CARDS */}
        <div className="grid grid-cols-1 gap-4">
          {filtrados.map(forn => (
            <div key={forn.id} className="bg-white rounded-[30px] overflow-hidden shadow-xl border border-white/10">
              {/* Foto do Fornecedor ou Placeholder com Categoria */}
              <div className="h-32 bg-[#ded0b8]/10 flex items-center justify-center relative text-[#ded0b8]/30 italic text-[10px] uppercase font-bold tracking-widest">
                {forn.foto_url ? <img src={forn.foto_url} className="w-full h-full object-cover" /> : forn.categoria}
                {forn.destaque && <div className="absolute top-4 right-4 bg-[#ded0b8] text-white p-1.5 rounded-full shadow-lg"><Star size={12} fill="white"/></div>}
              </div>

              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-gray-700 text-sm uppercase leading-tight">{forn.nome}</h3>
                    <p className="text-[9px] text-[#ded0b8] font-bold uppercase mt-1 tracking-wider">{forn.categoria}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <a 
                    href={`https://wa.me/${forn.whatsapp?.replace(/\D/g, '')}`} 
                    target="_blank" 
                    className="flex-1 bg-[#25D366] text-white py-3 rounded-xl font-bold text-[9px] uppercase flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={14}/> Orçamento
                  </a>
                  {forn.instagram && (
                    <a 
                      href={`https://instagram.com/${forn.instagram.replace('@', '')}`} 
                      target="_blank" 
                      className="p-3 bg-gray-50 text-gray-400 rounded-xl border border-gray-100"
                    >
                      <Instagram size={16}/>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
