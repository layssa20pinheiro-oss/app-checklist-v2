import { useState } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';
import { ArrowLeft, Save, DollarSign, Calendar } from 'lucide-react';
import Head from 'next/head';

const supabase = createClient(
  'https://rticfwqptlxkpgawpzwf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0aWNmd3FwdGx4a3BnYXdwendmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NDA2MTEsImV4cCI6MjA4OTQxNjYxMX0.vOmi-rKKxXuZ5SP7uZe81Cr0fKW_fWN4Hmuf90soijM'
);

export default function NovoEvento() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nome: '',
    data: '',
    tipo: 'Casamento',
    valor_contrato: '',
    forma_pagamento: 'Pix',
    data_pagamento: ''
  });

  async function salvarEvento(e) {
    e.preventDefault();
    setLoading(true);

    // 1. Criar o Evento
    const { data: eventoCriado, error: errEvento } = await supabase
      .from('eventos')
      .insert([form])
      .select()
      .single();

    if (errEvento) {
      alert("Erro ao criar evento");
      setLoading(false);
      return;
    }

    // 2. Lançar automaticamente no Financeiro do Studio (Receita)
    if (form.valor_contrato > 0) {
      await supabase.from('financeiro_negocio').insert([{
        descricao: `Contrato: ${form.nome}`,
        valor: form.valor_contrato,
        tipo: 'receita',
        data_vencimento: form.data_pagamento || form.data,
        status: 'pendente',
        categoria: 'Honorários'
      }]);
    }

    router.push('/eventos-lista');
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#5a5b5b] to-[#7e7f7f] font-sans pb-10">
      <Head><title>Novo Contrato | Studio NC</title></Head>

      <div className="pt-12 pb-6 px-6 text-white max-w-md mx-auto flex items-center justify-between">
        <button onClick={() => router.back()} className="p-2 bg-white/10 rounded-full"><ArrowLeft size={20} /></button>
        <h1 className="text-xs font-bold uppercase tracking-[3px]">Novo Contrato</h1>
        <div className="w-10"></div>
      </div>

      <form onSubmit={salvarEvento} className="max-w-md mx-auto px-6 space-y-4">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-[40px] space-y-5 shadow-2xl">
          
          {/* DADOS BÁSICOS */}
          <div className="space-y-4">
            <h2 className="text-[9px] font-bold uppercase tracking-widest text-[#ded0b8]">Informações do Evento</h2>
            <input 
              required className="w-full bg-white/5 border-b border-white/10 py-3 text-white text-sm outline-none focus:border-[#ded0b8] transition-colors" 
              placeholder="Nome do Evento (ex: Julia & Rafa)" 
              onChange={e => setForm({...form, nome: e.target.value})}
            />
            <div className="grid grid-cols-2 gap-4">
               <input 
                 required type="date" className="bg-transparent border-b border-white/10 py-3 text-white text-xs outline-none focus:border-[#ded0b8]" 
                 onChange={e => setForm({...form, data: e.target.value})}
               />
               <select 
                 className="bg-transparent border-b border-white/10 py-3 text-white text-xs outline-none"
                 onChange={e => setForm({...form, tipo: e.target.value})}
               >
                 <option value="Casamento" className="text-gray-800">Casamento</option>
                 <option value="15 Anos" className="text-gray-800">15 Anos</option>
                 <option value="Corporativo" className="text-gray-800">Corporativo</option>
               </select>
            </div>
          </div>

          <div className="h-px bg-white/10 my-4"></div>

          {/* DADOS FINANCEIROS (A MÁGICA) */}
          <div className="space-y-4">
            <h2 className="text-[9px] font-bold uppercase tracking-widest text-[#ded0b8] flex items-center gap-2">
               <DollarSign size={14} /> Valores do Contrato
            </h2>
            <input 
              type="number" className="w-full bg-white/5 border-b border-white/10 py-3 text-white text-sm outline-none focus:border-[#ded0b8]" 
              placeholder="Valor Total (R$)" 
              onChange={e => setForm({...form, valor_contrato: e.target.value})}
            />
            <select 
              className="w-full bg-transparent border-b border-white/10 py-3 text-white text-xs outline-none"
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
                onChange={e => setForm({...form, data_pagamento: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit" disabled={loading}
            className="w-full bg-[#ded0b8] text-white font-bold py-5 rounded-3xl text-[10px] uppercase tracking-[3px] shadow-lg hover:bg-[#c5b59a] transition-all flex items-center justify-center gap-2 mt-6"
          >
            {loading ? "Processando..." : <><Save size={18}/> Finalizar e Gerar Financeiro</>}
          </button>
        </div>
      </form>
    </div>
  );
}
