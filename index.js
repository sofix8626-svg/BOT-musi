const { Client, GatewayIntentBits } = require("discord.js");
const { Player } = require("discord-player");
require("dotenv").config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Music player
const player = new Player(client);

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});

// Simple ping command
client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    if (message.content === "!ping") {
        return message.reply("Pong! 🏓");
    }

    // Play command
    if (message.content.startsWith("!play")) {
        const query = message.content.replace("!play ", "");
        if (!query) return message.reply("أكتب اسم الأغنية!");

        const channel = message.member.voice.channel;
        if (!channel) return message.reply("ادخل روم صوتي قبل!");

        const searchResult = await player.search(query);
        if (!searchResult.tracks.length) return message.reply("ما لقيت الأغنية 🥲");

        await player.play(channel, searchResult.tracks[0], {
            nodeOptions: {
                metadata: message
            }
        });

        return message.reply(`🎶 تم تشغيل: **${searchResult.tracks[0].title}**`);
    }

    // Stop command
    if (message.content === "!stop") {
        const queue = player.nodes.get(message.guild.id);
        if (!queue) return message.reply("مافي شي شغال");

        queue.delete();
        return message.reply("⛔ تم إيقاف الموسيقى");
    }
});

client.login(process.env.TOKEN);
