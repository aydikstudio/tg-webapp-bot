const TelegramBot = require("node-telegram-bot-api");
const express = require('express');
const cors = require('cors');

const token = "";
const webAppUrl = "https://master--helpful-queijadas-873d54.netlify.app";

const bot = new TelegramBot(token, {polling: true});
const app = express();

app.use(express.json());
app.use(cors());

bot.on('message', async  (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if(text == '/start') {
        await bot.sendMessage(chatId, 'Bellow show button, full form', {
            reply_markup: {
                keyboard: [
                    [{
                        text: 'Full form',
                        web_app: {url: webAppUrl+"/form"}
                    }]
                ]
            }
        })


        await bot.sendMessage(chatId, 'Go to shop', {
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: 'Create order',
                        web_app: {url: webAppUrl}
                    }]
                ]
            }
        })
    }

    if(msg?.web_app_data?.data) {
         try {
            const data = JSON.parse(msg?.web_app_data?.data);

           await bot.sendMessage(chatId, "Thank you");
           await bot.sendMessage(chatId, "Yours country: " +data?.country);
           await bot.sendMessage(chatId, "Yours city: " +data?.city);

           setTimeout(async () => {
            await bot.sendMessage(chatId, "Vsu info you get data");
           }, 3000)
         } catch(e) {
            console.log(e)
         }
    }
})

app.post('/web-data', async (req, res) => {
    const {queryId, products, totalPrice} = req.body;

    try {
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Success buy',
            input_message_content: {
                message_text: 'Good buying ' + totalPrice
            }
        });

        return res.status(200).json({});;
    } catch(e) {
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Error buy',
            input_message_content: {
                message_text: 'Error buying '
            }
        });

        return res.status(500).json({});
    }
})

const PORT = 8000;


app.listen(PORT, () => console.log('server started' + PORT))