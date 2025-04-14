export default {
    name: 'kick',
    description: 'Belirtilen kullanıcıyı sunucudan atar.',
    options: [
        {
            name: 'user',
            type: 6, // USER
            description: 'Atılacak kullanıcı',
            required: true,
        },
        {
            name: 'reason',
            type: 3, // STRING
            description: 'Atılma sebebi',
            required: false,
        },
    ],
    execute: async (interaction) => {
        if (!interaction.member.permissions.has('KickMembers')) {
            return interaction.reply({ content: 'Bu komutu kullanmak için yeterli yetkiniz yok.', ephemeral: true });
        }

        const user = interaction.options.getMember('user');
        const reason = interaction.options.getString('reason') || 'Sebep belirtilmedi.';

        if (!user) {
            return interaction.reply({ content: 'Belirtilen kullanıcı bulunamadı.', ephemeral: true });
        }

        if (!user.kickable) {
            return interaction.reply({ content: 'Bu kullanıcıyı atamıyorum.', ephemeral: true });
        }

        try {
            await user.kick(reason);
            await interaction.reply(`${user.user.tag} başarıyla atıldı. Sebep: ${reason}`);
        } catch (error) {
            console.error('Kick işlemi sırasında bir hata oluştu:', error);
            await interaction.reply({ content: 'Kullanıcıyı atarken bir hata oluştu.', ephemeral: true });
        }
    },
};
