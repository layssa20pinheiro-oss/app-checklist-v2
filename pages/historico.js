import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ArrowLeft, Send, Trash2, Loader2, FileText, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const supabase = createClient(
  'https://rticfwqptlxkpgawpzwf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0aWNmd3FwdGx4a3BnYXdwendmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NDA2MTEsImV4cCI6MjA4OTQxNjYxMX0.vOmi-rKKxXuZ5SP7uZe81Cr0fKW_fWN4Hmuf90soijM'
);

export default function Historico() {
  const [relatorios, setRelatorios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { carregarRelatorios(); }, []);

  async function carregarRelatorios() {
    setLoading(true);
    const { data } = await supabase.from('checklists').select('*').order('created_at', { ascending: false });
    if (data) setRelatorios(data);
    setLoading(false);
  }

  const excluir = async (id) => {
    if (confirm("Apagar este relatório permanentemente?")) {
      await supabase.from('checklists').delete().eq('id', id);
      carregarRelatorios();
    }
  };

  return (
    <div className="min-h-screen bg-[#7e7f7f] p-6 font-sans">
      <div className="max-w-md mx-auto">
        <div className="flex items-center mb-8 pt-4">
          <Link href="/" className="bg-white/20 p-2 rounded-full text-white"><ArrowLeft size={20}/></Link>
          <h1 className="text-white font-bold ml-4 uppercase tracking-widest text-sm">Histórico do Evento</h1>
        </div>

        {loading ? <div className="flex justify-center py-20"><Loader2 className="animate-spin text-white/50" /></div> : (
          <div className="space-y-4 pb-10">
            {relatorios.map(r => (
              <div key={r.id} className="bg-white p-5 rounded-[25px] shadow-lg flex items-center justify-between">
                <div className="flex items-center gap-4 cursor-pointer" onClick={() => window.location.href=`/?id=${r.id}`}>
                   <div className="bg-gray-100 p-3 rounded-2xl text-[#ded0b8]"><FileText size={20}/></div>
                   <div>
                      <p className="font-bold text-gray-600 text-[10px] uppercase leading-tight pr-2">{r.evento || 'Relatório Sem Nome'}</p>
                      <p className="text-[9px] text-gray-400 font-bold mt-1 uppercase">{new Date(r.created_at).toLocaleDateString('pt-BR')}</p>
                   </div>
                </div>
                <div className="flex gap-2">
                   <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent('Seu Relatório Digital: ' + window.location.origin + '/?id=' + r.id)}`)} className="p-2 text-[#25D366]"><Send size={18}/></button>
                   <button onClick={() => excluir(r.id)} className="p-2 text-red-100"><Trash2 size={18}/></button>
                   <ChevronRight className="text-gray-200" size={16} />
                </div>
              </div>
            ))}
            {relatorios.length === 0 && <p className="text-center text-white/40 italic py-10 uppercase text-[10px] tracking-widest font-bold">Nenhum relatório encontrado.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
