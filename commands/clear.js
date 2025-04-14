export default {
    name: 'clear',
    description: 'Belirtilen sayıda mesajı siler.',
    options: [
        {
            name: 'amount',
            type: 4, // INTEGER
            description: 'Silinecek mesaj sayısı (1-100 arasında)',
            required: true,
        },
    ],
    execute: async (interaction) => {
        // DM kanallarında çalıştırılmasını engelle
        if (!interaction.guild) {
            return interaction.reply({ content: 'Bu komut yalnızca sunucularda kullanılabilir.', flags: 64 });
        }

        // Kullanıcının yetkisini kontrol et
        if (!interaction.member.permissions.has('ManageMessages')) {
            return interaction.reply({ content: 'Bu komutu kullanmak için yeterli yetkiniz yok.', flags: 64 });
        }

        const amount = interaction.options.getInteger('amount');

        if (amount < 1 || amount > 100) {
            return interaction.reply({ content: 'Lütfen 1 ile 100 arasında bir sayı girin.', flags: 64 });
        }

        try {
            const deletedMessages = await interaction.channel.bulkDelete(amount, true);
            await interaction.reply({ content: `${deletedMessages.size} mesaj başarıyla silindi.`, flags: 64 });
        } catch (error) {
            console.error('Mesajlar silinirken bir hata oluştu:', error);
            await interaction.reply({ content: 'Mesajları silerken bir hata oluştu.', flags: 64 });
        }
    },
};
