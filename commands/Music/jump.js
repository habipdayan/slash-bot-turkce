const Discord = require("discord.js")

module.exports = {
    name: "geç",
    description: "Şu an çalan şarkıyı geçerim..",
    options: [
        {
            name: "id",
            type: 10,
            description: "Sıradaki müziğin idsi",
            required: true
        }
    ],
    timeout: 5000,
    run: async (interaction, client) => {
        const musicid = interaction.options.getNumber("id")
        const queue = await client.distube.getQueue(interaction)
        const voiceChannel = interaction.member.voice.channel
        if (!voiceChannel) {
            return interaction.reply({ content: "Lütfen bir ses kanalına girin.", ephemeral: true })
        }
        if (!queue) {
            const queueError = new Discord.MessageEmbed()
                .setDescription("Şu an bir şey çalmıyor.")
                .setColor("RANDOM")
            return interaction.reply({ embeds: [queueError] })
        }
        if (interaction.member.guild.me.voice.channelId !== interaction.member.voice.channelId) {
            return interaction.reply({ content: "Benimle aynı ses kanalında değilsiniz.", ephemeral: true })
        }
        try {
            await client.distube.jump(interaction, parseInt(musicid))
            await interaction.reply({ content: "Şarkı geçildi. " + musicid })
        } catch {
            return interaction.reply({ content: "Hatalı şarkı idsi.", ephemeral: true })
        }
    }
}
