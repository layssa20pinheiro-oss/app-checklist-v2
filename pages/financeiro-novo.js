import { useState } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';
import { ArrowLeft, Save, DollarSign, Tag } from 'lucide-react';
import Head from 'next/head';

// Credenciais que já estamos usando no seu projeto
const supabase = createClient(
  'https://rticfwqptlxkpgawpzwf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0aWNmd3FwdGx4a3BnYXdwendmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NDA2MTEsImV4cCI6MjA4OTQxNjYxMX0.vOmi-rKKxXuZ5SP7uZe81Cr0fKW_fWN4Hmuf90soijM'
);

export default function NovoLancamento() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    descricao: '',
    valor: '',
    tipo: 'despesa',
    categoria: 'Marketing',
    data_vencimento: new Date().toISOString().split('T')[0],
    status: 'concluido'
  });

  async function salvarLancamento(e) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('financeiro_negocio')
      .insert([form]);

    if (error) {
      alert("Erro ao registrar lançamento");
    } else {
      router.push('/financeiro');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#5a5b5b] to-[#7e7f7f] font-sans pb-10">
      <Head><title>Novo Lançamento | Studio NC</title></Head>

      {/* HEADER */}
      <div className="pt-12 pb-6 px-6 text-white max-w-md mx-auto flex items-center justify-between">
        <button onClick={() => router.back()} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xs font-bold uppercase tracking-[3px]">Novo Lançamento</h1>
        <div className="w-10"></div>
      </div>

      <form onSubmit={salvarLancamento} className="max-w-md mx-auto px-6 space-y-4">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-[40px] space-y-6 shadow-2xl">
          
          <div className="space-y-4">
            <h2 className="text-[9px] font-bold uppercase tracking-widest text-[#ded0b8] flex items-center gap-2">
              <Tag size={14} /> Detalhes do Registro
            </h2>
            
            <input 
              required 
              className="w-full bg-white/5 border-b border-white/10 py-3 text-white text-sm outline-none focus:border-[#ded0b8] transition-colors" 
              placeholder="Descrição (ex: Aluguel do Studio)" 
              onChange={e => setForm({...form, descricao: e.target.value})}
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[8px] text-white/30 uppercase font-bold tracking-widest">Valor (R$)</label>
                <input 
                  required 
                  type="number" 
                  step="0.01"
                  className="w-full bg-transparent border-b border-white/10 py-2 text-white text-sm outline-none focus:border-[#ded0b8]" 
                  onChange={e => setForm({...form, valor: e.target.value})}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[8px] text-white/30 uppercase font-bold tracking-widest">Data</label>
                <input 
                  required 
                  type="date" 
                  value={form.data_vencimento}
                  className="w-full bg-transparent border-b border-white/10 py-2 text-white text-xs outline-none focus:border-[#ded0b8]" 
                  onChange={e => setForm({...form, data_vencimento: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <select 
                className="bg-transparent border-b border-white/10 py-3 text-white text-xs outline-none"
                onChange={e => setForm({...form, tipo: e.target.value})}
              >
                <option value="despesa" className="text-gray-800">Despesa (Saída)</option>
                <option value="receita" className="text-gray-800">Receita (Entrada)</option>
              </select>

              <select 
                className="bg-transparent border-b border-white/10 py-3 text-white text-xs outline-none"
                onChange={e => setForm({...form, categoria: e.target.value})}
              >
                <option value="Honorários" className="text-gray-800">Honorários</option>
                <option value="Marketing" className="text-gray-800">Marketing</option>
                <option value="Aluguel" className="text-gray-800">Aluguel</option>
                <option value="Impostos" className="text-gray-800">Impostos</option>
                <option value="Equipe" className="text-gray-800">Equipe</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#ded0b8] text-white font-bold py-5 rounded-3xl text-[10px] uppercase tracking-[3px] shadow-lg hover:bg-[#c5b59a] transition-all flex items-center justify-center gap-2 mt-4"
          >
            {loading ? "Salvando..." : <><Save size={18}/> Confirmar Lançamento</>}
          </button>
        </div>
      </form>
    </div>
  );
}
