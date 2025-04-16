export default {
    name: 'timeout',
    description: 'Belirtilen kullanıcıya zamanaşımı uygular.',
    options: [
        {
            name: 'user',
            type: 6, // USER
            description: 'Zamanaşımı uygulanacak kullanıcı',
            required: true,
        },
        {
            name: 'duration',
            type: 4, // INTEGER
            description: 'Zamanaşımı süresi (saniye cinsinden)',
            required: true,
        },
        {
            name: 'reason',
            type: 3, // STRING
            description: 'Zamanaşımı sebebi',
            required: false,
        },
    ],
    execute: async (interaction) => {
        if (!interaction.member.permissions.has('ModerateMembers')) {
            return interaction.reply({ content: 'Bu komutu kullanmak için yeterli yetkiniz yok.', ephemeral: true });
        }

        const user = interaction.options.getMember('user');
        const duration = interaction.options.getInteger('duration');
        const reason = interaction.options.getString('reason') || 'Sebep belirtilmedi.';

        if (!user) {
            return interaction.reply({ content: 'Belirtilen kullanıcı bulunamadı.', ephemeral: true });
        }

        try {
            await user.timeout(duration * 1000, reason);
            await interaction.reply(`${user.user.tag} başarıyla ${duration} saniye boyunca zamanaşımına alındı. Sebep: ${reason}`);
        } catch (error) {
            console.error('Timeout işlemi sırasında bir hata oluştu:', error);
            await interaction.reply({ content: 'Kullanıcıya zamanaşımı uygularken bir hata oluştu.', ephemeral: true });
        }
    },
};
