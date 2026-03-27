export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Apenas POST' });

  const { textoRascunho } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'A chave da IA não foi encontrada no Vercel.' });
  }

  const prompt = `
    Você é um assistente de luxo para cerimonialistas de casamento.
    Leia o texto bagunçado abaixo e extraia o roteiro do evento.
    
    Regras:
    1. Retorne APENAS um array JSON válido, sem nenhum texto adicional, sem formatação markdown (sem \`\`\`json).
    2. Cada item deve ter:
       - "horario": formato HH:MM (ex: 19:00). Se não tiver, tente deduzir a ordem ou deixe vazio.
       - "atividade": Título curto e elegante (ex: "Entrada do Noivo").
       - "detalhes": Informações extras (ex: música, quem acompanha). Se não tiver, deixe vazio "".
       - "categoria": classifique estritamente como "cerimonia" ou "recepcao".
       
    Texto do cliente:
    "${textoRascunho}"
  `;

  try {
    // --- O CÉREBRO NOVO E ATIVO DO GOOGLE: gemini-2.0-flash ---
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: `Erro do Google: ${data.error?.message || 'Desconhecido'}` });
    }

    let respostaIA = data.candidates[0].content.parts[0].text;
    respostaIA = respostaIA.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const roteiroOrganizado = JSON.parse(respostaIA);
    res.status(200).json(roteiroOrganizado);

  } catch (error) {
    console.error("Erro interno:", error);
    res.status(500).json({ error: `A IA se confundiu ao ler o texto. Tente novamente.` });
  }
}
