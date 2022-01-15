import dotenv from 'dotenv';
import { Client, Intents } from 'discord.js';
import { TwitterSpace } from './modules/space/space';
import { GetWeatherData } from './usecase/getWeatherData.usecase';

const prefix = '>>';
dotenv.config();

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
});
const discordToken = process.env.TOKEN;
if (discordToken === undefined) {
    throw new Error('Failed get discordToken');
}

client.on('ready', async () => {
    if (client.user === null) {
        throw new Error('Failed get client');
    }
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (m) => {
    if (!m.content.startsWith(prefix) || m.author.bot) return;

    if (m.content.length === 0) return;

    const args = m.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift()?.toLowerCase();

    if (command === 'supervise_spaces') {
        const res = await startGetTwitterSpace(args);
        if (res === undefined) return;
        m.channel.send(res);
    }

    if (command === 'weather') {
        const getweatherData = new GetWeatherData(process.env.WEATHER_TOKEN);
        const res = await getweatherData.getWeatherInfo(args);
        if (res === undefined) return;
        m.channel.send(res);
    }
});

const startGetTwitterSpace = async (args: string[]) => {
    const twitterSpace = new TwitterSpace(process.env.TWITTER_API_BEARER);
    // ユーザー名を指定して、スペースの検索を行う
    const res = await twitterSpace.search(args[0]);

    if (res === undefined) return;

    const ctxText = `スペースが現在開催中です。
        
    タイトル：${res.title}
    https://twitter.com/i/spaces/${res.spaceId}
    
    開始時間： ${res.createdAt}
    現在${String(res.participantCount)}人が参加中です
    スピーカー
    \`\`\`
    ${res.speakerUsers.join('\n')}
    \`\`\`
        `;

    return ctxText;
};

client.login(discordToken);