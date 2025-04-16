export default {
    name: 'unban',
    description: 'Belirtilen kullanıcıyı yasaktan kaldırır.',
    options: [
        {
            name: 'user_id',
            type: 3, // STRING
            description: 'Yasaktan kaldırılacak kullanıcının ID\'si',
            required: true,
        },
        {
            name: 'reason',
            type: 3, // STRING
            description: 'Yasaktan kaldırma sebebi',
            required: false,
        },
    ],
    execute: async (interaction) => {
        if (!interaction.member.permissions.has('BanMembers')) {
            return interaction.reply({ content: 'Bu komutu kullanmak için yeterli yetkiniz yok.', ephemeral: true });
        }

        const userId = interaction.options.getString('user_id');
        const reason = interaction.options.getString('reason') || 'Sebep belirtilmedi.';

        try {
            await interaction.guild.members.unban(userId, reason);
            await interaction.reply(`Kullanıcı başarıyla yasaktan kaldırıldı. Sebep: ${reason}`);
        } catch (error) {
            console.error('Unban işlemi sırasında bir hata oluştu:', error);
            await interaction.reply({ content: 'Kullanıcıyı yasaktan kaldırırken bir hata oluştu.', ephemeral: true });
        }
    },
};
