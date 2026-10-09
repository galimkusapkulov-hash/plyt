import { GoogleGenerativeAI } from '@google/generative-ai';
import { TelegramBot } from 'keygram';

// Инициализируем Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  systemInstruction: 'Ты — лис. Отвечай легко, мило, дружелюбно, используй :р и помогай поддерживать беседу.',
});

// Инициализируем бота через TelegramBot
const bot = new TelegramBot(process.env.BOT_TOKEN);

bot.on('message', async (ctx) => {
  const userMessage = ctx.message?.text;
  if (!userMessage) return;

  try {
    const result = await model.generateContent(userMessage);
    const response = await result.response;
    await ctx.reply(response.text());
  } catch (error) {
    console.error('Ошибка при обращении к Gemini:', error);
  }
});

bot.start();
