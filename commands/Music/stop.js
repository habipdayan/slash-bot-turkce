const Discord = require("discord.js")

module.exports = {
    name: "dur",
    description: "Şarkıyı durdurur ve bitiririm.",
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
            return interaction.reply({ content: "Benimle aynı ses kanalında değilsiniz.", ephemeral: true })
        }
        await client.distube.stop(interaction)
        await interaction.reply("***Music Bitirildi.***")
        const message = await interaction.fetchReply()
        await message.react("⏹")
    }
}
