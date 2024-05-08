import { Bot, Context, session, GrammyError, HttpError } from "grammy";
import {
  type Conversation,
  type ConversationFlavor,
  conversations,
  createConversation,
} from "@grammyjs/conversations";

type MyContext = Context & ConversationFlavor;
type MyConversation = Conversation<MyContext>;

// Logic

let nameTrigger: string | number = "";
let keyTrigger: string | number = "";;
let textOn: string | undefined;
let triggers: { name: string | number; trigger: string | number }[] = [];

const bot = new Bot<MyContext>("7048104894:AAFRVsTKaaLJhpYqlIsPM8stJB0x7swrxr8");

// SESSION AND CONVERSATIONS
bot.use(session({ initial: () => ({}) }));
bot.use(conversations());

// CONVERSATIONS 

async function addtrigger(conversation: MyConversation, ctx: MyContext) {
  const { message } = await conversation.wait();
  if (message?.text) {
    keyTrigger = message.text;
    triggers.push({ name: nameTrigger, trigger: keyTrigger });
    await ctx.reply(`Я запомнил, теперь триггер доступен вам по вводу слова ${nameTrigger}`);
  }
}
bot.use(createConversation(addtrigger));
// MENU

bot.api.setMyCommands([
  { command: 'start', description: 'Запуск бота' },
  { command: 'new', description: 'Создаение триггера' },
  { command: 'delete', description: 'Удаление триггера' },
  { command: 'triggers', description: 'все триггеры' },
]);


// Приветсвие
bot.command('start', async (ctx) => {
  await ctx.reply('Привет! Я бот Trigger от разработчика neversuptou! Для того чтобы использовать бота напиши /new Триггер, а после текст который хочешь добавить, после в любое время ты можешь написать слово из тригера и бот выведет тебе информацию, так же ты можешь проверить все триггеры с помощью комманды /triggers')
})

// COMANDS
bot.command('new', async (ctx) => {
  const startTxt = ctx.msg.text.split(" ")
  if (startTxt.length > 1) {
    const txt = ctx.msg.text.split(" ").splice(1, 20).join(" ");
    nameTrigger = txt;
    await ctx.reply(`Был добавлен новый триггер - ${txt}, теперь необходимо ввести текст для вложения`, {
      reply_parameters: { message_id: ctx.msg.message_id },
    });

    await ctx.conversation.enter("addtrigger");
  } else {
    await ctx.reply("После команды, необходимо ввести триггер, например: /new Число ПИ");
  }
})


bot.command('triggers', async (ctx) => {
  const key = [];
  if (triggers.length != 0) {
    for (let i = 0; i < triggers.length; i++) {
      key.push(triggers[i].name);
    }
    await ctx.reply(`Все ваши триггеры: ${key}`), { 
      parse_mode: "MarkdownV2" 
    };
  } else {
    ctx.reply(`Триггеры не найдены`);
  }
});

bot.command('delete', async (ctx) => {
  const startTxt = ctx.msg.text.split(" ")
  if (startTxt.length > 1) {
    const txt = ctx.msg.text.split(" ").splice(1, 20).join(" ");
    for (let i = 0; i < triggers.length; i++) {
      if (triggers[i].name == txt) {
        triggers.splice(i, 1);
        await ctx.reply(`Был удален триггер - ${txt}`, {
          reply_parameters: { message_id: ctx.msg.message_id },
        });
      }
    }
  } else {
    await ctx.reply("После команды, необходимо ввести триггер, например: /delete Число ПИ");
  }
});

bot.on("message", async (ctx) => {
  for (let i = 0; i < triggers.length; i++) {
    if (triggers[i].name == ctx.msg.text) {
      await ctx.reply(triggers[i].trigger.toString(), {
        reply_parameters: { message_id: ctx.msg.message_id },
      })
    }
  }
});

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;
  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description);
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram:", e);
  } else {
    console.error("Unknown error:", e);
  }
});

bot.start();