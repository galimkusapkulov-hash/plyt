import { GoogleGenAI } from '@google/genai';
import { Keygram } from 'keygram';

// Инициализируем Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Инициализация бота
const bot = new Keygram(process.env.BOT_TOKEN);

bot.on('message', async (ctx) => {
  const userMessage = ctx.message.text;
  if (!userMessage) return;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: 'Ты — лис. Ты отвечаешь легко, мило, дружелюбно, используешь словечки вроде :р и помогаешь поддерживать беседу.',
      },
      contents: userMessage,
    });

    await ctx.reply(response.text);
  } catch (error) {
    console.error('Ошибка при обращении к Gemini:', error);
  }
});

bot.start();
