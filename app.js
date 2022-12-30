const Discord = require("discord.js")
require("dotenv").config()
const { Client, Intents, MessageEmbed } = require("discord.js")
const client = new Client({
    intents: [Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS],
})
const { readdirSync } = require("fs")
const moment = require("moment")
const humanizeDuration = require("humanize-duration")
const Timeout = new Set()
client.slash = new Discord.Collection()
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v9")
const path = require("path")
const { keepalive } = require("./keepalive")
const commands = []
readdirSync("./commands/").map(async dir => {
    readdirSync(`./commands/${dir}/`).map(async (cmd) => {
        commands.push(require(path.join(__dirname, `./commands/${dir}/${cmd}`)))
    })
})
const rest = new REST({ version: "9" }).setToken(process.env.token);

(async () => {
    try {
        await rest.put(
            Routes.applicationCommands(process.env.botID),
            { body: commands }
        )
        console.log("\x1b[34m%s\x1b[0m", "Uygulama (/) komutları başarıyla yeniden yüklendi.")
    } catch (error) {
        console.error(error)
    }
})();

["slash", "anticrash"].forEach(handler => {
    require(`./handlers/${handler}`)(client)
})
client.on("ready", () => {
    console.log("\x1b[34m%s\x1b[0m", `${client.user.tag} adıyla giriş yaptı.!`)
    const statuses = [ 
        "discord.gg/siberatay",
        "Sonsuzluk Felsefesini"
    ]
    let index = 0
    setInterval(() => {
        if (index === statuses.length) index = 0
        const status = statuses[index]
        client.user.setActivity(`${status}`, {
            type: "LISTENING",
        })
        index++
    }, 60000)
})
client.on("messageCreate", async (message) => {
    if (message.attachments.first() !== undefined && message.content !== "") {
        console.log("\x1b[32m%s\x1b[0m", `[${moment().format("YYYY-MM-DD HH:mm:ss")}] ${message.author.username} (${message.author.id}) mesaj atıldı ${message.channel.id}: ${message.content}`)
        console.log("\x1b[32m%s\x1b[0m", `[${moment().format("YYYY-MM-DD HH:mm:ss")}] ${message.author.username} (${message.author.id}) bir ek gönderdi ${message.channel.id}: ${message.attachments.first().url}`)
    } else if (message.attachments.first() !== undefined && message.content === "") {
        console.log("\x1b[32m%s\x1b[0m", `[${moment().format("YYYY-MM-DD HH:mm:ss")}] ${message.author.username} (${message.author.id}) bir ek gönderdi ${message.channel.id}: ${message.attachments.first().url}`)
    } else if (message.attachments.first() === undefined && message.content !== "") {
        console.log("\x1b[32m%s\x1b[0m", `[${moment().format("YYYY-MM-DD HH:mm:ss")}] ${message.author.username} (${message.author.id}) mesaj atıldı ${message.channel.id}: ${message.content}`)
    } else {
        if (message.embeds.length !== 0) {
            const a = message.embeds[0]
            const embed = {}
            for (const b in a) {
                if (a[b] != null && (a[b] !== [] && a[b].length !== 0) && a[b] !== {}) {
                    embed[b] = a[b]
                }
            }
            console.log("\x1b[32m%s\x1b[0m", `[${moment().format("YYYY-MM-DD HH:mm:ss")}] ${message.author.username} (${message.author.id}) yerleştirme gönderdi ${message.channel.id}: ${JSON.stringify(embed, null, 2)}`)
        }
    }
})
client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand() || interaction.isContextMenu()) {
        if (!client.slash.has(interaction.commandName)) return
        if (!interaction.guild) return
        const command = client.slash.get(interaction.commandName)
        try {
            if (command.timeout) {
                if (Timeout.has(`${interaction.user.id}${command.name}`)) {
                    return interaction.reply({ content: `Bu komutu yeniden kullanmak için **${humanizeDuration(command.timeout, { round: true })}** beklemelisiniz.`, ephemeral: true })
                }
            }
            if (command.permissions) {
                if (!interaction.member.permissions.has(command.permissions)) {
                    return interaction.reply({ content: `:x: Bu komutu kullanabilmek için \`${command.permissions}\`yetkisine ihtiyacınız var.`, ephemeral: true })
                }
            }
            command.run(interaction, client)
            Timeout.add(`${interaction.user.id}${command.name}`)
            setTimeout(() => {
                Timeout.delete(`${interaction.user.id}${command.name}`)
            }, command.timeout)
        } catch (error) {
            console.error(error)
            await interaction.reply({ content: ":x: Bu komut yürütülürken bir hata oluştu!", ephemeral: true })
        }
    }
})
client.on("guildCreate", guild => {
    const embed = new MessageEmbed()
        .setTitle("I'm added to a new server")
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription(`I'm added to ${guild.name} | ID ${guild.id}\n Server member: ${guild.memberCount}\nTotal server: ${client.guilds.cache.size}`)
        .setTimestamp()
    const logchannel = client.channels.cache.get(process.env.Channel_log)
    logchannel.send({ embeds: [embed] })
})
client.on("guildDelete", guild => {
    const embed = new MessageEmbed()
        .setTitle("I'm left a new server")
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription(`I'm left to ${guild.name} | ID ${guild.id}\n Server member: ${guild.memberCount}\nTotal server: ${client.guilds.cache.size}`)
        .setTimestamp()
    const logchannel = client.channels.cache.get(process.env.Channel_log)
    logchannel.send({ embeds: [embed] })
})
// Distube
const Distube = require("distube")
const { SoundCloudPlugin } = require("@distube/soundcloud")
const { SpotifyPlugin } = require("@distube/spotify")
const { YouTubeDLPlugin } = require("@distube/yt-dlp")
/* eslint new-cap: ["error", { "properties": false }] */
client.distube = new Distube.default(client, {
    youtubeDL: false,
    leaveOnEmpty: true,
    emptyCooldown: 30,
    leaveOnFinish: false,
    emitNewSongOnly: true,
    updateYouTubeDL: true,
    nsfw: true,
    youtubeCookie: process.env.ytcookie,
    plugins: [new SoundCloudPlugin(), new SpotifyPlugin(), new YouTubeDLPlugin()]
})
client.distube
    .on("playSong", (queue, song) => {
        const embed = new MessageEmbed()
            .setColor("RANDOM")
            .setAuthor({ name: "Şarkı çalmaya başladı", iconURL: "https://raw.githubusercontent.com/HELLSNAKES/Music-Slash-Bot/main/assets/music.gif" })
            .setThumbnail(song.thumbnail)
            .setDescription(`[${song.name}](${song.url})`)
            .addField("**Görüntülenme:**", song.views.toString(), true)
            .addField("**Beğenme:**", song.likes.toString(), true)
            .addField("**Süre:**", song.formattedDuration.toString(), true)
            .setFooter({ text: `${song.user.username} tarafından talep edildi.`, iconURL: song.user.avatarURL() })
            .setTimestamp()
        queue.textChannel.send({ embeds: [embed] })
    })
    .on("addSong", (queue, song) => {
        const embed = new MessageEmbed()
            .setTitle(":ballot_box_with_check: | Şarkı eklendi")
            .setDescription(`\`${song.name}\` - \`${song.formattedDuration}\` -  ${song.user} Tarafından istendi.`)
            .setColor("RANDOM")
            .setTimestamp()
        queue.textChannel.send({ embeds: [embed] })
    })
    .on("addList", (queue, playlist) => {
        const embed = new MessageEmbed()
            .setTitle(":ballot_box_with_check: | Oynatma Listesi")
            .setDescription(`\`${playlist.name}\` oynatma listesine  (${playlist.songs.length} şarkıları eklendi\n${status(queue)}`)
            .setColor("RANDOM")
            .setTimestamp()
        queue.textChannel.send({ embeds: [embed] })
    })
    .on("error", (textChannel, e) => {
        console.error(e)
        textChannel.send(`Karşılaşılan bir hata: ${e}`)
    })
    // .on("finish", queue => queue.textChannel.send("***No more song in queue. Leaving the channel***"))
    .on("finishSong", queue => {
        const embed = new MessageEmbed()
            .setDescription(`:white_check_mark: | Şarkı bitti \`${queue.songs[0].name}\``)
        queue.textChannel.send({ embeds: [embed] })
    })
    .on("disconnect", queue => {
        const embed = new MessageEmbed()
            .setDescription(":x: | Ses kanalından çıktım.")
        queue.textChannel.send({ embeds: [embed] })
    })
    .on("empty", queue => {
        const embed = new MessageEmbed()
            .setDescription(":x: | Kanal boş olduğu için kanaldan ayrıldım.!")
        queue.textChannel.send({ embeds: [embed] })
    })
    .on("initQueue", (queue) => {
        queue.autoplay = false
        queue.volume = 50
    })
keepalive()
if (!process.env.token) {
    console.error("[ERROR]", "Token not found please visit: https://discord.com/developers/application to get token")
    process.exit(0)
}
client.login(process.env.token)
process.on("SIGINT", () => {
    console.log("\x1b[36m%s\x1b[0m", "SIGINT algılandı, çıkılıyor...")
    process.exit(0)
})
// check update repo
const fetch = require("node-fetch")
const { version } = require("./version.json")
console.log("\x1b[33m%s\x1b[0m", `Current version : ${version}`)
fetch("https://raw.githubusercontent.com/HELLSNAKES/Music-Slash-Bot/main/version.json")
    .then((res) => res.json())
    .then((data) => {
        if (data.version !== version) {
            console.log("\x1b[32m%s\x1b[0m", "===============================Update Available===================================")
            console.log("Ver:", data.version)
            console.log("\x1b[36m%s\x1b[0m", "Check commit : https://github.com/HELLSNAKES/Music-Slash-Bot/commits/main")
            console.log("\x1b[31m%s\x1b[0m", "Use `npm run updatebot` to update")
            console.log("\x1b[32m%s\x1b[0m", "==================================================================================")
        } else {
            console.log("\x1b[32m%s\x1b[0m", "No Update Available")
        }
    })
    .catch((err) => {
        console.log("\x1b[31m%s\x1b[0m", err)
    })
