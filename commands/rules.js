import { ButtonBuilder, ActionRowBuilder, ButtonStyle } from 'discord.js';

export default {
    name: 'rules',
    description: 'Görevli kurallarını gönderir.',
    execute: async (client) => {
        const channelId = '1360978496507084951'; // Hedef kanal ID'si
        const rulesText = `
\`\`\`ansi
1-) [2;31mReligion[0m, [2;31mlanguage[0m, [2;31mrace[0m, or [2;31mgender[0m discrimination in statements
2-) [2;34mPolitical[0m and [2;34mreligious[0m discussions exceeding the level of respect with [2;31minsults[0m or [2;31mdegrading[0m remarks
3-) [2;31mInsulting[0m any individual directly
4-) Any kind of [2;33msales[0m and [2;33madvertising[0m content (including [2;35mInstagram[0m, [2;34mTwitter[0m, [2;31mYouTube[0m, personal [2;32mSpotify[0m, and private [2;34mDiscord[0m invites)
5-) [2;36mFlooding[0m, [2;36mSpamming[0m, etc.
6-) Bringing personal disputes into Discord chat channels
7-) Sharing [2;31m+18[0m content
8-) Using text and voice channels for purposes other than intended
9-) Sharing [2;36mspoilers[0m outside of designated rooms
10-) Using special characters other than Latin letters and numbers in usernames ([2;35m[2;37mSpecial Roles[0m[2;35m[0m)
11-) [2;31mBegging[0m for games, subscriptions, etc.
12-) Using Discord status messages containing potential [2;31mscamming[0m elements or [2;33msales[0m content
13-) [2;36mLynching[0m attempt targeting any person or group for any reason
14-) Arguing with individuals violating the rules
15-) Returning to the server with another account or rejoining after being penalized
17-) Using the server as if it were a [2;35mdating[0m application

[2;37m[2;47m[2;40m[2;41m[2;47m[2;31mNOTE: Please don't overdo it just because swearing is allowed![0m[2;37m[2;47m[0m[2;37m[2;41m[0m[2;37m[2;40m[0m[2;37m[2;47m[0m[2;37m[0m
\`\`\`
\`\`\`ansi
- Engaging in any of the above actions is [2;31mSTRICTLY PROHIBITED[0m.
- You can convey your concerns to the Moderators.
- Authorities may use their initiative in imposing punishment.
- Please avoid tagging authorities unnecessarily.
- Other than these, we are here to have fun. [2;37mRelax and enjoy[0m.
\`\`\`
`;

        const button = new ButtonBuilder()
            .setCustomId('switch_to_turkish')
            .setLabel('Switch to Turkish')
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder().addComponents(button);

        const channel = await client.channels.fetch(channelId);
        if (!channel || !channel.isTextBased()) {
            console.error('Channel not found or is not text-based.');
            return;
        }

        // Eski bot mesajlarını sil
        const messages = await channel.messages.fetch({ limit: 100 });
        const botMessages = messages.filter(msg => msg.author.id === client.user.id);
        for (const msg of botMessages.values()) {
            await msg.delete();
        }

        // Yeni mesaj gönder
        const sentMessage = await channel.send({
            content: rulesText,
            components: [row],
        });

        const filter = (interaction) => interaction.customId === 'switch_to_turkish' && interaction.isButton();
        const collector = sentMessage.createMessageComponentCollector({ filter });

        collector.on('collect', async (interaction) => {
            let rules;
            switch (interaction.customId) {
                case 'switch_to_turkish':
                    rules = `
\`\`\`ansi
1-) [2;31mDin[0m, [2;31mdil[0m, [2;31mırk[0m veya [2;31mcinsiyet[0m ayrımı içeren söylemler
2-) [2;34mSiyasi[0m ve [2;34mdini[0m konular tartışılırken [2;31mhakaret[0m, [2;31maşağılama[0m gibi saygı düzeyini aşan söylemler
3-) Herhangi bir kimseyi hedef alan [2;31mhakaretlerde[0m bulunmak
4-) Her türlü [2;33msatış[0m ve [2;33mreklam[0m içerikli paylaşımlar ([2;35mInstagram[0m, [2;34mTwitter[0m, [2;31mYoutube[0m, kişisel [2;32mSpotify[0m ve özelden yapılan [2;34mDiscord[0m davetleri dahil)
5-) [2;36mFlood[0m, [2;36mSpam[0m, vb. yapmak
6-) Kişisel kavgaları Discord sohbet kanallarına taşımak
7-) [2;31m+18[0m içerikli paylaşımlar yapmak
8-) Yazılı ve sesli kanalları amacı dışında kullanmak
9-) Kendi odası dışında [2;36mspoiler[0m içerikli paylaşımlar yapmak
10-) Kullanıcı isimlerinde Latin harfleri, sayılar harici özel karakter kullanmak ([2;35m[2;37mÖzel Roller[0m[2;35m[0m)
11-) Oyun, abonelik, vb. [2;31mdilenmek[0m
12-) Olası [2;31mdolandırıcı[0m unsur barındıran ve [2;33msatış[0m içerikli Discord durum mesajlarını kullanmak
13-) Herhangi bir sebepten dolayı herhangi bir kişiyi ya da topluluğu hedefleyen [2;36mlinç[0m girişimi
14-) Kural ihlali yapan kişi ya da kişiler ile tartışmaya girmek
15-) Ceza alan kullanıcının başka hesap ile gelmesi ya da sunucuya çık gir yapması
17-) Sunucuyu [2;35mçöpçatanlık[0m uygulamasıymışçasına kullanmak

[2;37m[2;47m[2;40m[2;41m[2;47m[2;31mNOT: Küfür serbest diye suyunu çıkarmayın lütfen![0m[2;37m[2;47m[0m[2;37m[2;41m[0m[2;37m[2;40m[0m[2;37m[2;47m[0m[2;37m[0m
\`\`\`
\`\`\`ansi
- Bu maddelerdekileri gerçekleştirmek [2;31mKESİNLİKLE YASAKTIR[0m.
- Herhangi bir konuda iletmek istediklerinizi Moderatörlere ulaştırarak iletebilirsiniz.
- Yetkililer inisiyatif kullanarak cezalandırma işlemi yapabilir.
- Lütfen yetkilileri gereksiz yere etiketlemeyin.
- Bunların dışında eğlenmek için buradayız. [2;37mRahatınıza bakın[0m.
\`\`\``;
                    break;
                default:
                    rules = 'Invalid action.';
            }

            try {
                await interaction.reply({
                    content: rules,
                    ephemeral: true,
                });
            } catch (error) {
                console.error('Button interaction failed:', error);
            }
        });
    },
};
