module.exports = {
    name: "oynat",
    description: "Müzik çalarım.",
    options: [
        {
            name: "ara",
            type: 3,
            description: "Çalmak istediğiniz şarkı | Desteklenen platform: youtube,soundcloud,spotify",
            required: true
        }
    ],
    timeout: 5000,
    run: async (interaction, client) => {
        const voiceChannel = interaction.member.voice.channel
        const queue = await client.distube.getQueue(interaction)
        const query = interaction.options.get("ara").value
        if (!voiceChannel) {
            return interaction.reply({ content: "Lütfen bir ses kanalına girin.!", ephemeral: true })
        }
        if (queue) {
            if (interaction.member.guild.me.voice.channelId !== interaction.member.voice.channelId) {
                return interaction.reply({ content: "Benimle aynı ses kanalında değilsiniz.", ephemeral: true })
            }
        }
        await interaction.reply("🔍 **Arama yapılıyor....**")
        await interaction.editReply("Bulundu şarkı çalınıyor. :ok_hand: ")
        client.distube.play(voiceChannel, query, {
            textChannel: interaction.channel,
            member: interaction.member
        })
    }
}
