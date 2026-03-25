import { useState, useRef, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import html2canvas from 'html2canvas';
import { Camera, Plus, Trash2, Send, Image as ImageIcon, Loader2, ClipboardList, Users, History, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Head from 'next/head';

const supabase = createClient(
  'https://rticfwqptlxkpgawpzwf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0aWNmd3FwdGx4a3BnYXdwendmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NDA2MTEsImV4cCI6MjA4OTQxNjYxMX0.vOmi-rKKxXuZ5SP7uZe81Cr0fKW_fWN4Hmuf90soijM'
);

export default function ChecklistApp() {
  const [etapa, setEtapa] = useState('menu'); // menu, form, resumo, sucesso, view
  const [loading, setLoading] = useState(false);
  const [itens, setItens] = useState([]);
  const [novoItem, setNovoItem] = useState('');
  const [fotoPreview, setFotoPreview] = useState(null);
  const [imgGeradaUrl, setImgGeradaUrl] = useState('');
  const [reportId, setReportId] = useState('');
  const [form, setForm] = useState({ evento: '', local: '', presentes: '', convidados: '', obs: '', responsavel: '' });
  const areaCapturaRef = useRef();

  // Efeito para quando o cliente abre o link com ?id=...
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idRel = params.get('id');
    if (idRel) {
      setLoading(true);
      supabase.from('checklists').select('*').eq('id', idRel).single().then(({ data }) => {
        if (data) {
          setForm(data);
          setItens(data.itens || []);
          setFotoPreview(data.pdf_url); // Usa a imagem gerada
          setEtapa('view');
        }
        setLoading(false);
      });
    }
  }, []);

  const salvarRelatorio = async () => {
    if (!form.evento || !form.responsavel) return alert("Preencha o nome do evento e o responsável.");
    setLoading(true);
    try {
      // 1. Gerar imagem do relatório (A aba de gerenciamento que você conferiu)
      const canvas = await html2canvas(areaCapturaRef.current, { scale: 2, backgroundColor: "#7e7f7f" });
      const imagemBlob = await new Promise(res => canvas.toBlob(res, 'image/png'));
      const nomeImg = `rel_${Date.now()}.png`;
      await supabase.storage.from('fotos').upload(nomeImg, imagemBlob);
      const urlImg = supabase.storage.from('fotos').getPublicUrl(nomeImg).data.publicUrl;

      // 2. Salvar no Banco de Dados
      const { data, error } = await supabase.from('checklists').insert([{ ...form, itens, pdf_url: urlImg }]).select();
      
      if (error) throw error;
      
      if (data) {
        setReportId(data[0].id);
        setImgGeradaUrl(urlImg);
        setEtapa('sucesso');
      }
    } catch (e) { alert("Erro ao salvar: " + e.message); }
    setLoading(false);
  };

  const shareWhatsApp = () => {
    const link = `${window.location.origin}/?id=${reportId}`;
    const texto = `Olá! Finalizamos a organização e conferência dos seus pertences. Tudo foi recolhido com muito cuidado por nossa equipe.\n\n✨ *Seu Relatório Digital:* ${link}\n\nFoi um prazer fazer parte desse sonho.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_top');
  };

  return (
    <div className="min-h-screen bg-[#7e7f7f] p-4 flex flex-col items-center font-sans text-slate-800 pb-10">
      <Head>
        <title>Cerimonial Elite</title>
        <link rel="icon" href="/icon.png" />
      </Head>
      
      <img src="https://rticfwqptlxkpgawpzwf.supabase.co/storage/v1/object/public/fotos/logo.png" className="max-w-[140px] mb-10 mt-6" alt="Logo" />

      {/* --- MENU INICIAL --- */}
      {etapa === 'menu' && (
        <div className="w-full max-w-md space-y-4 animate-in fade-in duration-500">
          <button onClick={() => { setForm({ evento: '', local: '', presentes: '', convidados: '', obs: '', responsavel: '' }); setItens([]); setEtapa('form'); }} className="w-full bg-white p-6 rounded-[30px] shadow-xl flex items-center gap-4 group active:scale-95 transition-all">
            <div className="bg-[#ded0b8] p-4 rounded-2xl text-white shadow-sm"><ClipboardList /></div>
            <div className="text-left"><h3 className="font-bold text-gray-700 uppercase text-sm tracking-widest">Novo Relatório</h3><p className="text-[10px] text-gray-400 uppercase italic">Checklist de Saída</p></div>
          </button>
          
          <Link href="/lista" className="w-full bg-white p-6 rounded-[30px] shadow-xl flex items-center gap-4 group active:scale-95 transition-all">
            <div className="bg-[#ded0b8] p-4 rounded-2xl text-white shadow-sm"><Users /></div>
            <div className="text-left"><h3 className="font-bold text-gray-700 uppercase text-sm tracking-widest">Convidados</h3><p className="text-[10px] text-gray-400 uppercase italic">Lista e RSVP</p></div>
          </Link>

          <Link href="/historico" className="w-full bg-white/10 p-4 rounded-2xl border border-white/20 text-white flex items-center justify-center gap-2 mt-4 hover:bg-white/20 transition-all">
            <History size={16} /> <span className="text-[10px] font-bold uppercase tracking-[2px]">Histórico Geral</span>
          </Link>
        </div>
      )}

      {/* --- FORMULÁRIO COMPLETO --- */}
      {etapa === 'form' && (
        <div className="w-full max-w-md animate-in slide-in-from-bottom-4 duration-500">
           <button onClick={() => setEtapa('menu')} className="text-white/50 mb-4 flex items-center gap-2 text-xs uppercase font-bold tracking-widest"><ArrowLeft size={16}/> Voltar</button>
           <div className="bg-white rounded-[35px] p-8 shadow-2xl">
            <h2 className="text-center font-bold text-gray-400 mb-8 uppercase text-xs tracking-[3px] border-b pb-4">Checklist de Saída</h2>
            <div className="space-y-4">
              <input className="w-full border-b p-2 outline-none text-sm bg-transparent" placeholder="Evento" value={form.evento} onChange={e=>setForm({...form, evento: e.target.value})} />
              <input className="w-full border-b p-2 outline-none text-sm bg-transparent" placeholder="Local" value={form.local} onChange={e=>setForm({...form, local: e.target.value})} />
              
              <div className="flex gap-4">
                <input type="text" className="w-full border-b p-2 outline-none text-xs" placeholder="Presentes" value={form.presentes} onChange={e=>setForm({...form, presentes: e.target.value})} />
                <input type="number" className="w-full border-b p-2 outline-none text-xs" placeholder="Qtd. Convidados" value={form.convidados} onChange={e=>setForm({...form, convidados: e.target.value})} />
              </div>

              <div className="flex gap-2 pt-2">
                <input className="flex-1 bg-gray-50 rounded-xl px-4 text-xs outline-none" placeholder="Adicionar item..." value={novoItem} onChange={e=>setNovoItem(e.target.value)} />
                <button onClick={() => { if(novoItem.trim()){ setItens([...itens, novoItem.trim()]); setNovoItem(''); } }} className="bg-[#ded0b8] p-2 rounded-lg text-white shadow-sm"><Plus size={18}/></button>
              </div>
              <ul className="text-xs space-y-2 max-h-40 overflow-y-auto pt-2">
                {itens.map((it, i) => <li key={i} className="bg-gray-50 p-3 rounded-xl flex justify-between italic text-gray-500">• {it} <Trash2 size={14} onClick={()=>setItens(itens.filter((_,idx)=>idx!==i))} className="text-red-200 cursor-pointer"/></li>)}
              </ul>

              <textarea className="w-full border rounded-2xl p-3 text-xs outline-none bg-gray-50/30" placeholder="Observações..." value={form.obs} onChange={e=>setForm({...form, obs: e.target.value})} rows={3}></textarea>
              <input className="w-full border-b p-2 outline-none text-sm font-bold" placeholder="Sua Assinatura" value={form.responsavel} onChange={e=>setForm({...form, responsavel: e.target.value})} />
              
              <button onClick={() => setEtapa('resumo')} className="w-full bg-[#ded0b8] text-white font-bold py-5 rounded-[20px] mt-6 uppercase text-xs tracking-widest shadow-lg active:scale-95 transition-all">Visualizar Esboço</button>
            </div>
          </div>
        </div>
      )}

      {/* --- ABA DE GERENCIAMENTO / PREVIEW --- */}
      {(etapa === 'resumo' || etapa === 'view') && (
        <div className="w-full flex flex-col items-center pb-24 animate-in fade-in duration-500">
          <div ref={areaCapturaRef} className="w-[380px] bg-[#7e7f7f] p-8 flex flex-col items-center">
            <img src="https://rticfwqptlxkpgawpzwf.supabase.co/storage/v1/object/public/fotos/logo.png" className="max-w-[130px] mb-8" />
            <div className="w-full bg-white rounded-[30px] p-10 text-gray-700 text-xs shadow-sm leading-relaxed">
                <h2 className="text-center font-bold text-lg mb-8 uppercase tracking-[8px] text-[#7e7f7f] border-b pb-4">Relatório</h2>
                <div className="space-y-4">
                    <p><strong>EVENTO:</strong> <span className="uppercase">{form.evento}</span></p>
                    <p><strong>LOCAL:</strong> <span className="uppercase">{form.local}</span></p>
                    <div className="border-t pt-3 flex justify-between">
                       <p><strong>PRESENTES:</strong> {form.presentes || '-'}</p>
                       <p><strong>CONVIDADOS:</strong> {form.convidados || '-'}</p>
                    </div>
                    <div className="border-t pt-3 font-bold">ITENS RECOLHIDOS:
                      <ul className="mt-2 italic text-gray-400 pl-2 space-y-1">{itens.map((it, i) => <li key={i}>• {it}</li>)}</ul>
                    </div>
                    <p className="border-t pt-3"><strong>OBS:</strong> <span className="italic">{form.obs || 'Nenhuma.'}</span></p>
                    <p className="border-t pt-6 italic mt-4"><strong>ASSINATURA:</strong> <span className="uppercase">{form.responsavel}</span></p>
                </div>
            </div>
          </div>
          {etapa === 'resumo' && (
            <div className="fixed bottom-0 bg-white/90 backdrop-blur-md p-5 flex gap-3 w-full max-w-md rounded-t-[40px] shadow-2xl border-t z-50">
              <button onClick={() => setEtapa('form')} className="flex-1 bg-gray-50 py-5 rounded-2xl text-xs font-bold uppercase text-gray-400 tracking-widest">Ajustar</button>
              <button onClick={salvarRelatorio} className="flex-2 bg-[#8da38d] text-white py-5 px-10 rounded-2xl text-xs font-bold uppercase shadow-lg active:scale-95 transition-all">
                {loading ? <Loader2 className="animate-spin mx-auto"/> : "Confirmar e Enviar"}
              </button>
            </div>
          )}
          {etapa === 'view' && <button onClick={() => window.location.href='/'} className="mt-10 bg-white/10 text-white px-10 py-4 rounded-2xl text-[10px] uppercase font-bold tracking-widest border border-white/20">Acessar Meu Painel</button>}
        </div>
      )}

      {/* --- SUCESSO --- */}
      {etapa === 'sucesso' && (
        <div className="bg-white rounded-[45px] p-12 text-center shadow-2xl max-w-xs mt-20 animate-in zoom-in">
          <div className="text-6xl mb-6">✨</div>
          <h2 className="text-gray-500 font-bold uppercase text-sm tracking-[3px] mb-10 leading-tight">Relatório Digital Gerado!</h2>
          <button onClick={shareWhatsApp} className="w-full bg-[#25D366] text-white py-5 rounded-2xl font-bold text-xs uppercase flex items-center justify-center gap-3 mb-4 shadow-xl active:scale-95 transition-all">
            <Send size={18}/> Enviar no WhatsApp
          </button>
          <button onClick={() => setEtapa('menu')} className="w-full text-gray-400 py-4 text-[10px] font-bold uppercase tracking-widest">Voltar ao Menu</button>
        </div>
      )}
    </div>
  );
}
