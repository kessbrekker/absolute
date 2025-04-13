import dotenv from 'dotenv';    
dotenv.config();
import { 
    Client,
    GatewayIntentBits,
    ButtonBuilder,
    ButtonStyle,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
} from 'discord.js';
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity('with the code', { type: 'PLAYING' });
});
client.login(process.env.TOKEN);


//----------------------Komutlar----------------------//

const btn = new ButtonBuilder()
    .setCustomId('jensonbtn')
    .setLabel('Click me!')
    .setStyle(ButtonStyle.Primary);



client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (message.content === '!ping') {
        await message.reply({
            content: 'Pong!',
            components: [{
                type: 1,
                components: [btn]
            }]
        });
    }
});

client.on('interactionCreate', async (interaction) => {
    if (interaction.customId === 'jensonbtn') {
        await interaction.reply({
            content: 'You clicked the button!',
            ephemeral: true
        });
    }
});