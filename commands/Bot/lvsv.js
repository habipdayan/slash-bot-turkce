require("dotenv").config()
module.exports = {
    name: "terket",
    description: "Adminler için belirtilen serverdan çıkış yapar.",
    options: [
        {
            name: "id",
            description: "sunucu id",
            type: 3,
            required: true
        }
    ],
    run: async (interaction, client) => {
        const id = interaction.options.getString("id")
        const guild = client.guilds.cache.get(id)
        try {
            if (interaction.member.id !== process.env.Admin) {
                return interaction.reply({ content: "Sadece admin" })
            }
            if (!guild) {
                return interaction.reply({ content: "Sunucu kimliği hatalı. Lütfen doğru bir id girin." })
            }

            await guild.leave()
            interaction.reply({ content: `**${guild.name}** sunucusundan çıktım \`${guild.memberCount}\` üye.` })
        } catch (err) {
            interaction.reply({ content: `Sunucudan ayrılırken bir hata oluştu: \`${err.message}\`` })
        }
    }
}
