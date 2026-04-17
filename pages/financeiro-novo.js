import { useState } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';
import { ArrowLeft, Save } from 'lucide-react';

const supabase = createClient('SUA_URL', 'SUA_CHAVE');

export default function NovoLancamento() {
  const router = useRouter();
  const [form, setForm] = useState({ descricao: '', valor: '', tipo: 'despesa', categoria: 'Marketing' });

  async function salvar(e) {
    e.preventDefault();
    await supabase.from('financeiro_negocio').insert([form]);
    router.push('/financeiro');
  }

  return (
    <div className="min-h-screen bg-[#7e7f7f] p-8 text-white">
      <button onClick={() => router.back()} className="mb-8 p-3 bg-white/10 rounded-full"><ArrowLeft /></button>
      <h1 className="text-xl font-bold uppercase tracking-widest mb-8">Novo Lançamento</h1>
      
      <form onSubmit={salvar} className="space-y-6 bg-white/5 p-8 rounded-[40px] border border-white/10">
        <input 
          placeholder="Descrição (ex: Aluguel Escritório)" 
          className="w-full bg-transparent border-b border-white/10 py-3 outline-none"
          onChange={e => setForm({...form, descricao: e.target.value})}
        />
        <input 
          type="number" placeholder="Valor (R$)" 
          className="w-full bg-transparent border-b border-white/10 py-3 outline-none"
          onChange={e => setForm({...form, valor: e.target.value})}
        />
        <select 
          className="w-full bg-transparent border-b border-white/10 py-3 outline-none"
          onChange={e => setForm({...form, tipo: e.target.value})}
        >
          <option value="despesa">Despesa (Saída)</option>
          <option value="receita">Receita (Entrada)</option>
        </select>
        <button className="w-full bg-[#ded0b8] py-4 rounded-2xl font-bold uppercase tracking-widest">Salvar Lançamento</button>
      </form>
    </div>
  );
}
