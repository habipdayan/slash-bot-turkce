const Discord = require("discord.js")

module.exports = {
    name: "otooynat",
    description: "Otomatik oynatmayı açar.",
    timeout: 5000,
    run: async (interaction, client) => {
        const queue = await client.distube.getQueue(interaction)
        const voiceChannel = interaction.member.voice.channel
        if (!voiceChannel) {
            return interaction.reply({ content: "Lütfen bir ses kanalına girin.", ephemeral: true })
        }
        if (!queue) {
            const queueError = new Discord.MessageEmbed()
                .setDescription("Şu anda bir şarkı çalımıyor.")
                .setColor("RANDOM")
            return interaction.reply({ embeds: [queueError] })
        }
        if (interaction.member.guild.me.voice.channelId !== interaction.member.voice.channelId) {
            return interaction.reply({ content: "Benimle aynı ses kanalında değilsiniz.", ephemeral: true })
        }
        const mode = client.distube.toggleAutoplay(interaction)
        return interaction.reply("Otomatik oynatma modu:`" + (mode ? "Açık" : "Kapalu") + "`")
    }
}
