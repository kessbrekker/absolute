import dotenv from 'dotenv';
dotenv.config();
import { Client, GatewayIntentBits, Collection, REST, Routes, MessageFlags } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';
import rules from './commands/rules.js';

const openai = new OpenAI({
    baseURL: "https://api.aimlapi.com/v1",
    apiKey: process.env.OPENAI_API_KEY,
});

// ES module için __dirname tanımlayın
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
    ],
    partials: ['CHANNEL'],
});

client.commands = new Collection();
const commands = [];

// Komutları yükle
async function loadCommands() {
    const commandsPath = path.join(__dirname, 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = await import(`file://${filePath}`);
        client.commands.set(command.default.name, command.default);

        // Slash komutları için
        if (!command.default.description) {
            console.error(`Komut dosyasında description eksik: ${file}`);
            continue;
        }

        commands.push({
            name: command.default.name,
            description: command.default.description,
            options: command.default.options || [],
        });
    }
}

// Slash komutlarını Discord API'ye kaydet
async function registerSlashCommands() {
    const rest = new REST({ version: '10' }).setToken(process.env.token);

    if (!process.env.CLIENT_ID) {
        console.error('CLIENT_ID tanımlanmamış. Lütfen .env dosyasını kontrol edin.');
        return;
    }

    try {
        console.log('Slash komutları kaydediliyor...');
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands }
        );
        console.log('Slash komutları başarıyla kaydedildi.');
    } catch (error) {
        console.error('Slash komutları kaydedilirken bir hata oluştu:', error);
    }
}

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    // Botun durumunu ayarla
    try {
        await client.user.setActivity('with the code', { type: 'PLAYING' });
        console.log('Bot activity set successfully.');
    } catch (error) {
        console.error('Failed to set bot activity:', error);
    }

    // rules komutunu çalıştır
    try {
        await rules.execute(client);
    } catch (error) {
        console.error('Rules komutu çalıştırılırken bir hata oluştu:', error);
    }

    // Komutları yükle ve kaydet
    await loadCommands();
    await registerSlashCommands();
});

// Slash komutlarını işleme
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Komut çalıştırılırken bir hata oluştu.', flags: MessageFlags.Ephemeral });
    }
});

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    if (!message.mentions.has(client.user)) return;

    message.content = message.content.replace(/<@\d+>/g, "");

    let he = await message.reply("Generating response...");

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", // Modelin doğru olduğundan emin olun
            messages: [{ role: "user", content: message.content }],
        });

        await he.edit(response.choices[0].message.content);
    } catch (error) {
        console.error("OpenAI API isteği başarısız oldu:", error);

        // Hata mesajını kullanıcıya daha açıklayıcı bir şekilde iletin
        const errorMessage = error?.error?.message || error.message || "Bilinmeyen hata.";
        await he.edit(`OpenAI API isteği başarısız oldu: ${errorMessage}`);

        // Hata durumunda bir olay yayarak loglama yapın
        client.emit('error', error);
    }
});

client.login(process.env.token);