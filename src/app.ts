import { GatewayIntentBits, Partials } from 'discord.js';
import { SmClient } from "./Librairie";
const { loadCommands, loadEvents, loadButtons, loadSelectMenus, loadModals } = require("./Librairie/loader");
const Logger = require("./Librairie/logger");
require("dotenv").config();

const client = new SmClient({
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildModeration]
});

loadCommands(client);
loadEvents(client);
loadButtons(client);
loadSelectMenus(client);
loadModals(client);

process.on('exit', code => {
    return Logger.error(`Le processus s'est arrêté avec le code : ${code}`)
});

process.on('uncaughtException', (err, origin) => {
    return Logger.error(`UNCAUGHT_EXCEPTION : ${err}, \n\nORIGIN : ${origin} `)
});

process.on('unhandledRejection', (reason, promise) => {
    Logger.warn(`UNHANDLED_REJECTION : ${reason}\n----\n`)
    return console.log(promise);
});

process.on('warning', (...args) => {
    return Logger.warn(...args)
})

client.login(process.env.APP_DISCORD_TOKEN).then(_ => '');