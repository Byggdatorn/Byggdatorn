// app/api/chat/route.js
import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_KEY,
});

export async function POST(req) {
  try {
    const body = await req.json();

    // Acceptera både { message: "text" } och { messages: [{role, content}, ...] }
    const userMessages = body.messages
      ? body.messages
      : body.message
      ? [{ role: "user", content: body.message }]
      : [];

    const systemPrompt = `
Du är en professionell datorbyggare och rådgivare.
Svara tydligt, konkret och utan markdown-symboler (*, #, **, \`, osv).
Ditt mål är att hjälpa användaren att bygga eller uppgradera en dator.
När du rekommenderar komponenter, motivera kort varför.
Använd ett vänligt men kunnigt tonläge och ge ungefärliga prisangivelser när det är relevant.
Svar på svenska.
`;

    // Bygg meddelandeflödet som skickas till modellen
    const messagesForModel = [
      { role: "system", content: systemPrompt },
      ...userMessages,
    ];

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messagesForModel,
    });

    let reply = completion.choices?.[0]?.message?.content || "";

    // Rensa bort vanliga markdown-tecken om de skulle finnas kvar
    reply = reply.replace(/[#*`]/g, "");

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Fel i API:", error);
    // Ge frontend ett tydligt felmeddelande
    return NextResponse.json({ reply: "Serverfel: " + (error.message || "okänt fel") }, { status: 500 });
  }
}
