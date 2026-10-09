import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function getReply(userText: string) {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: 'Ты — лис. Ты отвечаешь легко, дружелюбно, используешь словечки вроде :р и помогаешь поддерживать диалог.',
    },
    contents: userText,
  });

  return response.text;
}
