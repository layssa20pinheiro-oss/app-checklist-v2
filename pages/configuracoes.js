// Função para gerar a mensagem e abrir o WhatsApp
const dispararWhatsapp = (user) => {
  const link = `${window.location.origin}/acesso-cliente?id=${id}`;
  const msg = `Olá! Sou da equipe de cerimonial. ✨\nSeu acesso ao painel do evento *${evento?.nome}* está pronto!\n\nClique aqui para acessar: ${link}`;
  window.open(`https://wa.me/${user.telefone || ''}?text=${encodeURIComponent(msg)}`, '_blank');
};

// Função para disparar e-mail (Exemplo simplificado via Mailto para agora)
const dispararEmail = (user) => {
  const link = `${window.location.origin}/acesso-cliente?id=${id}`;
  const assunto = `Acesso ao Painel: ${evento?.nome}`;
  const corpo = `Olá, aqui está o seu link de acesso exclusivo: ${link}`;
  window.location.href = `mailto:${user.email}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
};

// ... Dentro do seu usuarios.map, na parte dos botões de ação:

<div className="mt-6 flex flex-col gap-2">
  <button 
    onClick={() => dispararWhatsapp(user)}
    className="w-full bg-[#25D366] text-white py-3 rounded-2xl font-bold text-[10px] uppercase flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
  >
    <MessageCircle size={14}/> Enviar Acesso via WhatsApp
  </button>
  
  <button 
    onClick={() => dispararEmail(user)}
    className="w-full bg-gray-100 text-gray-500 py-3 rounded-2xl font-bold text-[10px] uppercase flex items-center justify-center gap-2 border border-gray-200 transition-all"
  >
    <Mail size={14}/> Enviar por E-mail (Backup)
  </button>
</div>
