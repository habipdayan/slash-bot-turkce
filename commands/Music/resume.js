const Discord = require("discord.js")

module.exports = {
    name: "devam",
    description: "Şarkıya devam eder.",
    timeout: 5000,
    run: async (interaction, client) => {
        const queue = await client.distube.getQueue(interaction)
        const voiceChannel = interaction.member.voice.channel
        if (!voiceChannel) {
            return interaction.reply({ content: "Lütfen bir ses kanalına girin.", ephemeral: true })
        }
        if (!queue) {
            const queueError = new Discord.MessageEmbed()
                .setDescription("Oynayan bir şey yok.")
                .setColor("RANDOM")
            return interaction.reply({ embeds: [queueError] })
        }
        if (interaction.member.guild.me.voice.channelId !== interaction.member.voice.channelId) {
            return interaction.reply({ content: "Benimle aynı ses kanalında değilsiniz.", ephemeral: true })
        }
        try {
            await client.distube.resume(interaction)
            await interaction.reply("***Mevcut parçayı devam ettirdim***")
            const message = await interaction.fetchReply()
            await message.react("▶")
        } catch {
            interaction.reply({ content: "Sıra zaten oynuyor", ephemeral: true })
        }
    }
}
