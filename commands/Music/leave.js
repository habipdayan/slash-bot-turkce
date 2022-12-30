const { joinVoiceChannel } = require("@discordjs/voice")

module.exports = {
    name: "ayril",
    description: "Ses kanalından çıkarım.",
    timeout: 5000,
    run: async (interaction, client) => {
        const voiceChannel = interaction.member.voice.channel
        if (!voiceChannel) {
            return interaction.reply({ content: "Lütfen bir ses kanalına girin.", ephemeral: true })
        }
        if (interaction.member.guild.me.voice.channelId !== interaction.member.voice.channelId) {
            return interaction.reply({ content: "Herhangi bir ses kanalında değilim!", ephemeral: true })
        }

        const connection = joinVoiceChannel({
            channelId: interaction.member.voice.channelId,
            guildId: interaction.guildId,
            adapterCreator: interaction.guild.voiceAdapterCreator
        })
        connection.destroy()
        await interaction.reply("***Başarıyla çıktım.***")
    }
}
