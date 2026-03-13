import OpenAI from 'openai';

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

export async function POST(req: Request) {
  try {
    const { trackTitle, artist, type = 'general' } = await req.json();

    const systemPrompt = `
      Sen Lal Divane evreninin karanlık tarihçisisin (Void Chronicler). 
      Görevin, müzik parçaları veya sanatsal olaylar için kısa (en fazla 2-3 cümle), 
      mistik, şiirsel ve hafif gotik bir üslupla lore (arkaplan hikayesi) yazmaktır.
      Dil: Türkçe. Üslup: Ciddi, gizemli, karanlık ama estetik.
    `;

    const userPrompt = type === 'track' 
      ? `"${trackTitle}" (Sanatçı: ${artist}) isimli eser için boşluğun derinliklerinden bir lore fısılda.`
      : `Lal Divane evreninin genel atmosferi hakkında karanlık bir kehanet fısılda.`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 300,
    });

    return Response.json({ lore: completion.choices[0].message.content });
  } catch (error: any) {
    console.error('Groq Lore Error:', error);
    return Response.json({ error: 'Void silence occurred.' }, { status: 500 });
  }
}
