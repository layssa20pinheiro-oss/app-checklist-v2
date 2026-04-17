import { useState } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';
import { ArrowLeft, Save, DollarSign, ListOrdered } from 'lucide-react';
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
    parcelas: 1,
    data_pagamento: ''
  });

  async function salvarEvento(e) {
    e.preventDefault();
    setLoading(true);

    const { data: eventoCriado, error: errEvento } = await supabase
      .from('eventos')
      .insert([form])
      .select()
      .single();

    if (errEvento) {
      alert("Erro ao criar evento.");
      setLoading(false);
      return;
    }

    // Lógica das Parcelas no Financeiro
    if (form.valor_contrato > 0) {
      const qtdParc = parseInt(form.parcelas) || 1;
      const valorUnico = (parseFloat(form.valor_contrato) / qtdParc).toFixed(2);
      const lancamentos = [];

      for (let i = 0; i < qtdParc; i++) {
        const dataVenc = new Date(form.data_pagamento || form.data);
        dataVenc.setMonth(dataVenc.getMonth() + i);

        lancamentos.push({
          descricao: `Honorários: ${form.nome} (${i + 1}/${qtdParc})`,
          valor: valorUnico,
          tipo: 'receita',
          data_vencimento: dataVenc.toISOString().split('T')[0],
          status: i === 0 ? 'concluido' : 'pendente',
          categoria: 'Honorários'
        });
      }
      await supabase.from('financeiro_negocio').insert(lancamentos);
    }

    router.push('/eventos-lista');
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#5a5b5b] to-[#7e7f7f] font-sans pb-10">
      <Head><title>Novo Contrato | Studio NC</title></Head>
      <div className="pt-12 pb-6 px-6 text-white max-w-md mx-auto flex items-center justify-between">
        <button onClick={() => router.back()} className="p-2 bg-white/10 rounded-full"><ArrowLeft size={20} /></button>
        <h1 className="text-xs font-bold uppercase tracking-[3px]">Novo Contrato de Evento</h1>
        <div className="w-10"></div>
      </div>
      <form onSubmit={salvarEvento} className="max-w-md mx-auto px-6 space-y-4">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-[40px] space-y-5">
           {/* CAMPOS DO EVENTO (Nome, Data, Valor...) */}
           <input 
              required className="w-full bg-white/5 border-b border-white/10 py-3 text-white text-sm outline-none" 
              placeholder="Nome do Evento" 
              onChange={e => setForm({...form, nome: e.target.value})}
           />
           {/* ... Restante do formulário que já tínhamos ... */}
           <button type="submit" className="w-full bg-[#ded0b8] py-5 rounded-3xl font-bold uppercase text-[10px] tracking-[3px]">
             {loading ? "Cadastrando..." : "Salvar Evento e Gerar Parcelas"}
           </button>
        </div>
      </form>
    </div>
  );
}
