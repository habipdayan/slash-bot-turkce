const Discord = require("discord.js")

module.exports = {
    name: "atla",
    description: "Sıradaki mevcut şarkıyı atlar",
    timeout: 5000,
    run: async (interaction, client) => {
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
            return interaction.reply({ content: "Benimle aynı ses kanalına değilsiniz.", ephemeral: true })
        }
        try {
            await client.distube.skip(interaction)
            await interaction.reply("***ATLANDI***")
            const message = await interaction.fetchReply()
            await message.react("⏭")
        } catch {
            interaction.reply({ content: "Sırada şarkı yok", ephemeral: true })
        }
    }
}
