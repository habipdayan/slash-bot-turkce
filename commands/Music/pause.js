const Discord = require("discord.js")

module.exports = {
    name: "duraklat",
    description: "Çalan şarkıyı duraklatırım",
    timeout: 5000,
    run: async (interaction, client) => {
        const queue = await client.distube.getQueue(interaction)
        const voiceChannel = interaction.member.voice.channel
        if (!voiceChannel) {
            return interaction.reply({ content: "Lütfen bir ses kanalına girin.", ephemeral: true })
        }
        if (!queue) {
            const queueError = new Discord.MessageEmbed()
                .setDescription("Şu an çalmıyor.")
                .setColor("RANDOM")
            return interaction.reply({ embeds: [queueError] })
        }
        if (interaction.member.guild.me.voice.channelId !== interaction.member.voice.channelId) {
            return interaction.reply({ content: "Benimle aynı ses kanalında değilsiniz.", ephemeral: true })
        }
        try {
            await client.distube.pause(interaction)
            await interaction.reply("***Durdurdum***")
            const message = await interaction.fetchReply()
            await message.react("⏸")
        } catch {
            interaction.reply({ content: " Sıra zaten duraklatıldı", ephemeral: true })
        }
    }
}
