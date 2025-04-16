export default {
    name: 'ban',
    description: 'Belirtilen kullanıcıyı sunucudan yasaklar.',
    options: [
        {
            name: 'user',
            type: 6, // USER
            description: 'Yasaklanacak kullanıcı',
            required: true,
        },
        {
            name: 'reason',
            type: 3, // STRING
            description: 'Yasaklama sebebi',
            required: false,
        },
    ],
    execute: async (interaction) => {
        if (!interaction.member.permissions.has('BanMembers')) {
            return interaction.reply({ content: 'Bu komutu kullanmak için yeterli yetkiniz yok.', ephemeral: true });
        }

        const user = interaction.options.getMember('user');
        const reason = interaction.options.getString('reason') || 'Sebep belirtilmedi.';

        if (!user) {
            return interaction.reply({ content: 'Belirtilen kullanıcı bulunamadı.', ephemeral: true });
        }

        if (!user.bannable) {
            return interaction.reply({ content: 'Bu kullanıcıyı yasaklayamıyorum.', ephemeral: true });
        }

        try {
            await user.ban({ reason });
            await interaction.reply(`${user.user.tag} başarıyla yasaklandı. Sebep: ${reason}`);
        } catch (error) {
            console.error('Ban işlemi sırasında bir hata oluştu:', error);
            await interaction.reply({ content: 'Kullanıcıyı yasaklarken bir hata oluştu.', ephemeral: true });
        }
    },
};
