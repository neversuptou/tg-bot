"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
const conversations_1 = require("@grammyjs/conversations");
// Logic
let nameTrigger = "";
let keyTrigger = "";
;
let textOn;
let triggers = [];
const bot = new grammy_1.Bot("7048104894:AAFRVsTKaaLJhpYqlIsPM8stJB0x7swrxr8");
// SESSION AND CONVERSATIONS
bot.use((0, grammy_1.session)({ initial: () => ({}) }));
bot.use((0, conversations_1.conversations)());
// CONVERSATIONS 
function addtrigger(conversation, ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const { message } = yield conversation.wait();
        if (message === null || message === void 0 ? void 0 : message.text) {
            keyTrigger = message.text;
            triggers.push({ name: nameTrigger, trigger: keyTrigger });
            yield ctx.reply(`Я запомнил, теперь триггер доступен вам по вводу слова ${nameTrigger}`);
        }
    });
}
bot.use((0, conversations_1.createConversation)(addtrigger));
// MENU
bot.api.setMyCommands([
    { command: 'start', description: 'Запуск бота' },
    { command: 'new', description: 'Создаение триггера' },
    { command: 'delete', description: 'Удаление триггера' },
    { command: 'triggers', description: 'все триггеры' },
]);
// Приветсвие
bot.command('start', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield ctx.reply('Привет! Я бот Trigger от разработчика neversuptou! Для того чтобы использовать бота напиши /new Триггер, а после текст который хочешь добавить, после в любое время ты можешь написать слово из тригера и бот выведет тебе информацию, так же ты можешь проверить все триггеры с помощью комманды /triggers');
}));
// COMANDS
bot.command('new', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const startTxt = ctx.msg.text.split(" ");
    if (startTxt.length > 1) {
        const txt = ctx.msg.text.split(" ").splice(1, 20).join(" ");
        nameTrigger = txt;
        yield ctx.reply(`Был добавлен новый триггер - ${txt}, теперь необходимо ввести текст для вложения`, {
            reply_parameters: { message_id: ctx.msg.message_id },
        });
        yield ctx.conversation.enter("addtrigger");
    }
    else {
        yield ctx.reply("После команды, необходимо ввести триггер, например: /new Число ПИ");
    }
}));
bot.command('triggers', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const key = [];
    if (triggers.length != 0) {
        for (let i = 0; i < triggers.length; i++) {
            key.push(triggers[i].name);
        }
        yield ctx.reply(`Все ваши триггеры: ${key}`), {
            parse_mode: "MarkdownV2"
        };
    }
    else {
        ctx.reply(`Триггеры не найдены`);
    }
}));
bot.command('delete', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const startTxt = ctx.msg.text.split(" ");
    if (startTxt.length > 1) {
        const txt = ctx.msg.text.split(" ").splice(1, 20).join(" ");
        for (let i = 0; i < triggers.length; i++) {
            if (triggers[i].name == txt) {
                triggers.splice(i, 1);
                yield ctx.reply(`Был удален триггер - ${txt}`, {
                    reply_parameters: { message_id: ctx.msg.message_id },
                });
            }
        }
    }
    else {
        yield ctx.reply("После команды, необходимо ввести триггер, например: /delete Число ПИ");
    }
}));
bot.on("message", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    for (let i = 0; i < triggers.length; i++) {
        if (triggers[i].name == ctx.msg.text) {
            yield ctx.reply(triggers[i].trigger.toString(), {
                reply_parameters: { message_id: ctx.msg.message_id },
            });
        }
    }
}));
bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const e = err.error;
    if (e instanceof grammy_1.GrammyError) {
        console.error("Error in request:", e.description);
    }
    else if (e instanceof grammy_1.HttpError) {
        console.error("Could not contact Telegram:", e);
    }
    else {
        console.error("Unknown error:", e);
    }
});
bot.start();
