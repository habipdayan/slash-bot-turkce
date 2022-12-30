const Discord = require("discord.js")

module.exports = {
    name: "avatar",
    description: "Kullanıcının avatarını verir.",
    options: [
        {
            name: "kullanıcı",
            description: "Kullanıcı",
            type: 6
        }
    ],
    timeout: 5000,
    run: async (interaction) => {
        const user = interaction.options.getUser("kullanıcı") || interaction.user
        const embed = new Discord.MessageEmbed()
            .setTitle(`${user.username}'nın avatarı`)
            .setColor("RANDOM")
            .setImage(user.avatarURL())
            .setColor("RANDOM")
            .setImage(user.displayAvatarURL({ dynamic: true, size: 2048 }))
            .setURL(user.avatarURL())
        interaction.reply({ embeds: [embed] })
    }
}
