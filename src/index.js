import { GoogleGenerativeAI } from '@google/generative-ai';
import { TelegramBot } from 'keygram';
import http from 'node:http';

// 1. Поднимаем мини-сервер, чтобы Render видел открытый порт и не вырубал бота
const port = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot is running!');
}).listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// 2. Инициализируем Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  systemInstruction: 'Ты помогаешь Тоду поддерживать легкий, милый и непринужденный диалог с его парнем. Отвечай тепло, дружелюбно, используй :р и помогай развивать мысль, чтобы беседа не затухала.',
});

// 3. Запускаем Telegram-бота
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

bot.startPolling();
