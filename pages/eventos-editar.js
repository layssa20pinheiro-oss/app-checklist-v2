import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';
import { ArrowLeft, Save, DollarSign } from 'lucide-react';
import Head from 'next/head';

const supabase = createClient(
  'https://rticfwqptlxkpgawpzwf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0aWNmd3FwdGx4a3BnYXdwendmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NDA2MTEsImV4cCI6MjA4OTQxNjYxMX0.vOmi-rKKxXuZ5SP7uZe81Cr0fKW_fWN4Hmuf90soijM'
);

export default function EditarEvento() {
  const router = useRouter();
  const { id } = router.query; // Pega o ID que veio do clique no lápis
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  
  const [form, setForm] = useState({
    nome: '',
    data: '',
    tipo: 'Casamento',
    valor_contrato: '',
    forma_pagamento: 'Pix',
    data_pagamento: ''
  });

  // [1] BUSCAR DADOS DO EVENTO AO CARREGAR A PÁGINA
  useEffect(() => {
    if (id) {
      supabase
        .from('eventos')
        .select('*')
        .eq('id', id)
        .single()
        .then(({ data, error }) => {
          if (data) {
            setForm({
              nome: data.nome || '',
              data: data.data || '',
              tipo: data.tipo || 'Casamento',
              valor_contrato: data.valor_contrato || '',
              forma_pagamento: data.forma_pagamento || 'Pix',
              data_pagamento: data.data_pagamento || ''
            });
          }
          setLoading(false);
        });
    }
  }, [id]);

  // [2] FUNÇÃO PARA SALVAR AS ALTERAÇÕES (UPDATE)
  async function atualizarEvento(e) {
    e.preventDefault();
    setSalvando(true);

    const { error } = await supabase
      .from('eventos')
      .update(form) // Envia os novos dados
      .eq('id', id); // Apenas para este ID específico

    if (error) {
      alert("Erro ao atualizar evento");
    } else {
      router.push('/eventos-lista');
    }
    setSalvando(false);
  }

  if (loading) return (
    <div className="min-h-screen bg-[#7e7f7f] flex items-center justify-center text-white/50 uppercase text-[10px] tracking-widest animate-pulse">
      Carregando dados do contrato...
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#5a5b5b] to-[#7e7f7f] font-sans pb-10">
      <Head><title>Editar Contrato | Studio NC</title></Head>

      {/* HEADER */}
      <div className="pt-12 pb-6 px-6 text-white max-w-md mx-auto flex items-center justify-between">
        <button onClick={() => router.back()} className="p-2 bg-white/10 rounded-full"><ArrowLeft size={20} /></button>
        <h1 className="text-xs font-bold uppercase tracking-[3px]">Editar Contrato</h1>
        <div className="w-10"></div>
      </div>

      <form onSubmit={atualizarEvento} className="max-w-md mx-auto px-6 space-y-4">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-[40px] space-y-5 shadow-2xl">
          
          {/* DADOS BÁSICOS */}
          <div className="space-y-4">
            <h2 className="text-[9px] font-bold uppercase tracking-widest text-[#ded0b8]">Informações do Evento</h2>
            <input 
              required className="w-full bg-white/5 border-b border-white/10 py-3 text-white text-sm outline-none focus:border-[#ded0b8] transition-colors" 
              placeholder="Nome do Evento" 
              value={form.nome}
              onChange={e => setForm({...form, nome: e.target.value})}
            />
            <div className="grid grid-cols-2 gap-4">
               <input 
                 required type="date" className="bg-transparent border-b border-white/10 py-3 text-white text-xs outline-none focus:border-[#ded0b8]" 
                 value={form.data}
                 onChange={e => setForm({...form, data: e.target.value})}
               />
               <select 
                 className="bg-transparent border-b border-white/10 py-3 text-white text-xs outline-none"
                 value={form.tipo}
                 onChange={e => setForm({...form, tipo: e.target.value})}
               >
                 <option value="Casamento" className="text-gray-800">Casamento</option>
                 <option value="15 Anos" className="text-gray-800">15 Anos</option>
                 <option value="Corporativo" className="text-gray-800">Corporativo</option>
               </select>
            </div>
          </div>

          <div className="h-px bg-white/10 my-4"></div>

          {/* DADOS FINANCEIROS */}
          <div className="space-y-4">
            <h2 className="text-[9px] font-bold uppercase tracking-widest text-[#ded0b8] flex items-center gap-2">
               <DollarSign size={14} /> Valores do Contrato
            </h2>
            <input 
              type="number" className="w-full bg-white/5 border-b border-white/10 py-3 text-white text-sm outline-none focus:border-[#ded0b8]" 
              placeholder="Valor Total (R$)" 
              value={form.valor_contrato}
              onChange={e => setForm({...form, valor_contrato: e.target.value})}
            />
            <select 
              className="w-full bg-transparent border-b border-white/10 py-3 text-white text-xs outline-none"
              value={form.forma_pagamento}
              onChange={e => setForm({...form, forma_pagamento: e.target.value})}
            >
              <option value="Pix" className="text-gray-800">Pagamento via Pix</option>
              <option value="Boleto" className="text-gray-800">Boleto Bancário</option>
              <option value="Cartão" className="text-gray-800">Cartão de Crédito</option>
              <option value="Parcelado" className="text-gray-800">Parcelamento Direto</option>
            </select>
            <div className="space-y-1">
              <label className="text-[8px] text-white/30 uppercase font-bold">Data Prevista para Recebimento</label>
              <input 
                type="date" className="w-full bg-transparent border-b border-white/10 py-2 text-white text-xs outline-none focus:border-[#ded0b8]" 
                value={form.data_pagamento}
                onChange={e => setForm({...form, data_pagamento: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit" disabled={salvando}
            className="w-full bg-[#ded0b8] text-white font-bold py-5 rounded-3xl text-[10px] uppercase tracking-[3px] shadow-lg hover:bg-[#c5b59a] transition-all flex items-center justify-center gap-2 mt-6"
          >
            {salvando ? "Atualizando..." : <><Save size={18}/> Salvar Alterações</>}
          </button>
        </div>
      </form>
    </div>
  );
}
