import { GoogleGenerativeAI } from '@google/generative-ai';
import * as keygramPkg from 'keygram';

console.log('Содержимое экспорта keygram:', keygramPkg);

// Пробуем получить конструктор бота из всех возможных вариантов
const BotClass = keygramPkg.Keygram || keygramPkg.Bot || keygramPkg.default || keygramPkg;

// Инициализация Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  systemInstruction: 'Ты — лис. Отвечай легко, мило, дружелюбно, используй :р и помогай поддерживать беседу.',
});

// Запуск бота
let bot;
if (typeof BotClass === 'function') {
  bot = new BotClass(process.env.BOT_TOKEN);
} else if (typeof keygramPkg.createBot === 'function') {
  bot = keygramPkg.createBot(process.env.BOT_TOKEN);
} else {
  console.error('Не удалось найти конструктор или функцию создания бота в keygram!');
}

if (bot) {
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
}
