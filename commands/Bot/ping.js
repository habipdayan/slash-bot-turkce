const Discord = require("discord.js")

module.exports = {
    name: "ping",
    description: "Botun ping değerlerini öğrenirsiniz.",
    run: async (interaction, client) => {
        const embed = new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle("PONG! :ping_pong:")
            .setThumbnail(interaction.user.displayAvatarURL())
            .addFields(
                { name: "Gecikme", value: `\`${Date.now() - interaction.createdTimestamp}ms\`` },
                { name: "Api Gecikmesi", value: `\`${Math.round(client.ws.ping)}ms\`` }
            )
        interaction.reply({ embeds: [embed] })
    }
}
