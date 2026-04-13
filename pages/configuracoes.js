import { useState } from 'react';
import { ArrowLeft, UserPlus, ShieldCheck, ShieldAlert, Trash2, Settings, Lock, Eye } from 'lucide-react';
import Link from 'next/link';

export default function ConfiguracoesAcesso() {
  const [usuarios, setUsuarios] = useState([
    { id: 1, nome: "João e Maria", email: "noivos@email.com", evento: "Casamento Real", status: "ativo", role: "Cliente" },
    { id: 2, nome: "Ana (Mãe)", email: "ana@email.com", evento: "15 Anos Julia", status: "pendente", role: "Cliente" }
  ]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      {/* HEADER FIXO */}
      <div className="bg-[#7e7f7f] pt-12 pb-8 px-6 text-white rounded-b-[40px] shadow-lg sticky top-0 z-20">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Link href="/" className="p-2 bg-white/10 rounded-full text-[#ded0b8]"><ArrowLeft size={20}/></Link>
          <h1 className="text-lg font-bold uppercase tracking-widest">Configurações</h1>
          <div className="w-10"></div> {/* Espaçador */}
        </div>
      </div>

      <div className="max-w-md mx-auto p-6">
        
        {/* SEÇÃO: CONVIDAR NOVO USUÁRIO */}
        <div className="bg-white rounded-[30px] p-6 shadow-sm mb-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[#ded0b8]/20 text-[#ded0b8] rounded-xl"><UserPlus size={20}/></div>
            <h2 className="font-bold text-gray-700 uppercase text-xs tracking-widest">Liberar Novo Acesso</h2>
          </div>
          
          <div className="space-y-4">
            <input className="w-full border-b p-2 outline-none text-sm placeholder:text-gray-300" placeholder="E-mail do Cliente" />
            <select className="w-full border-b p-2 outline-none text-sm text-gray-500 bg-transparent">
              <option>Selecionar Evento...</option>
              <option>Casamento João e Maria</option>
              <option>15 Anos Julia</option>
            </select>
            <button className="w-full bg-[#ded0b8] text-white font-bold py-4 rounded-2xl text-[10px] uppercase tracking-[2px] shadow-md active:scale-95 transition-all">
              Enviar Convite de Acesso
            </button>
          </div>
        </div>

        {/* SEÇÃO: GESTÃO DE QUEM JÁ TEM ACESSO */}
        <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[3px] mb-4 ml-2">Usuários Ativos</h2>
        
        <div className="space-y-3">
          {usuarios.map(user => (
            <div key={user.id} className="bg-white p-5 rounded-[25px] shadow-sm border border-gray-100 group">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-700 text-xs uppercase">{user.nome}</h3>
                  <p className="text-[9px] text-gray-400 font-bold uppercase mt-1 tracking-wider">{user.evento}</p>
                </div>
                <span className={`text-[8px] px-2 py-1 rounded-full font-bold uppercase ${user.status === 'ativo' ? 'bg-green-50 text-green-500' : 'bg-amber-50 text-amber-500'}`}>
                  {user.status}
                </span>
              </div>

              {/* CONTROLES DE ACESSO (CHAVINHAS) */}
              <div className="mt-6 pt-4 border-t border-gray-50 grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-gray-400 uppercase">Lista Convidados</span>
                  <div className="w-8 h-4 bg-[#8da38d] rounded-full relative cursor-pointer shadow-inner">
                    <div className="absolute right-1 top-1 w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-gray-400 uppercase">Presentes</span>
                  <div className="w-8 h-4 bg-gray-200 rounded-full relative cursor-pointer shadow-inner">
                    <div className="absolute left-1 top-1 w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-50 text-gray-400 text-[9px] font-bold uppercase hover:bg-gray-100 transition-colors">
                  <Lock size={12}/> Revogar Tudo
                </button>
                <button className="p-3 rounded-xl text-red-100 hover:text-red-300 transition-colors">
                  <Trash2 size={16}/>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
