export default {
    name: 'untimeout',
    description: 'Belirtilen kullanıcının zamanaşımını kaldırır.',
    options: [
        {
            name: 'user',
            type: 6, // USER
            description: 'Zamanaşımı kaldırılacak kullanıcı',
            required: true,
        },
    ],
    execute: async (interaction) => {
        if (!interaction.member.permissions.has('ModerateMembers')) {
            return interaction.reply({ content: 'Bu komutu kullanmak için yeterli yetkiniz yok.', ephemeral: true });
        }

        const user = interaction.options.getMember('user');

        if (!user) {
            return interaction.reply({ content: 'Belirtilen kullanıcı bulunamadı.', ephemeral: true });
        }

        try {
            await user.timeout(null);
            await interaction.reply(`${user.user.tag} için zamanaşımı başarıyla kaldırıldı.`);
        } catch (error) {
            console.error('Untimeout işlemi sırasında bir hata oluştu:', error);
            await interaction.reply({ content: 'Kullanıcının zamanaşımını kaldırırken bir hata oluştu.', ephemeral: true });
        }
    },
};
