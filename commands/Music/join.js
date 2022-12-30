const { joinVoiceChannel } = require("@discordjs/voice")

module.exports = {
    name: "gir",
    description: "Bir ses kanalına girer.",
    timeout: 5000,
    run: async (interaction, client) => {
        const voiceChannel = interaction.member.voice.channel
        if (!voiceChannel) {
            return interaction.reply({ content: "Lütfen bir ses kanalına girin.", ephemeral: true })
        }
        try {
            joinVoiceChannel({
                channelId: interaction.member.voice.channelId,
                guildId: interaction.guildId,
                adapterCreator: interaction.guild.voiceAdapterCreator
            })
            await interaction.reply("***Başarıyla giriş yaptım.***")
        } catch (error) {
            return interaction.reply({ content: `Ses kanalına girerken bir hata oluştu. ${error}`, ephemeral: true })
        }
    }
}
