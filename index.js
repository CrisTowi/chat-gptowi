require("dotenv").config();

const { Configuration, OpenAIApi } = require("openai");
const TelegramBot = require("node-telegram-bot-api");

// replace the value below with the Telegram token you receive from @BotFather
const telegramToken = process.env.TELEGRAM_TOKEN;
// replace the value below with the OpenAI API token you receive from https://beta.openai.com/account/api-keys
const openaiToken = process.env.OPENAI_API_TOKEN;

const configuration = new Configuration({
  apiKey: openaiToken,
});

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(telegramToken, { polling: true });

// Listen for any kind of message. There are different kinds of
// messages.
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const openai = new OpenAIApi(configuration);

  console.log("Message received: ", msg.text);

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: msg.text,
        },
      ],
    });

    bot.sendMessage(chatId, response.data.choices[0].message?.content);
  } catch (error) {
    bot.sendMessage(chatId, "Sorry, I don't understand you.");
  }
});

console.log("Bot started successfully!");
