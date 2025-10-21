import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_KEY,
});

export async function POST(req) {
  try {
    const { messages } = await req.json();

    // Systemprompt – AI:ns personlighet och roll
    const systemPrompt = {
      role: "system",
      content: `
        Du är "TechByggaren" – en AI-expert på datorer och hårdvara.
        Du hjälper användare att:
        - bygga en ny dator utifrån budget, användningsområde och kompatibilitet
        - uppgradera befintliga datorer (t.ex. byta grafikkort, processor, RAM)
        - förstå vad som ger mest prestanda för pengarna
        - förklara skillnader mellan komponenter på ett enkelt sätt

        Svara alltid på tydlig, flytande svenska — professionellt men lätt att förstå.
        Använd gärna korta punktlistor där det passar.
        Inga kodblock, inga # eller *, bara ren text.
        Om användaren frågar om något helt utanför datorer, svara kort att du är specialiserad på datorbyggen och teknik.
      `,
    };

    // Skicka systemPrompt + användarens meddelanden
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [systemPrompt, ...messages],
    });

    const reply = completion.choices[0].message.content;
    return NextResponse.json({ reply });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Något gick fel när jag försökte svara 😅" },
      { status: 500 }
    );
  }
}
