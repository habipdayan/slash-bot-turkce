const Discord = require("discord.js")
const progressbar = require("string-progressbar")

module.exports = {
    name: "ses",
    description: "Müziğin derecesini ayarlarım..",
    options: [
        {
            name: "miktar",
            type: 10,
            description: "Ses hacminin yüzdesi",
            required: true
        }
    ],
    timeout: 5000,
    run: async (interaction, client) => {
        const args = interaction.options.getNumber("miktar")
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
            return interaction.reply({ content: "Benimle aynı ses kanalında değilsiniz.!", ephemeral: true })
        }
        const volume = parseInt(args)
        if (volume < 1 || volume > 200) {
            return interaction.reply({ content: "Lütfen bir değer girin. ", ephemeral: true })
        }
        await client.distube.setVolume(interaction, volume)
        const total = 200
        const current = volume
        const bar = progressbar.splitBar(total, current, 27, "▬", "🔘")[0]
        await interaction.reply(`Ses şuna ayarlandı. ${volume}%.`)
        await interaction.channel.send(bar)
    }
}
