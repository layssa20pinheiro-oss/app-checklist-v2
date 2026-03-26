export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Apenas POST' });

  const { textoRascunho } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) return res.status(500).json({ error: 'Chave da IA não configurada no Vercel.' });

  // Instruções exatas para a IA
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
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    let respostaIA = data.candidates[0].content.parts[0].text;
    
    // Limpa a resposta para garantir que é um JSON puro
    respostaIA = respostaIA.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const roteiroOrganizado = JSON.parse(respostaIA);
    res.status(200).json(roteiroOrganizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Falha ao gerar o roteiro com IA.' });
  }
}
