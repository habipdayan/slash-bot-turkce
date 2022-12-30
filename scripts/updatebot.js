/*
Update Bot
Heroku can't update
*/

const fs = require("fs")
const childProcess = require("child_process")

async function update () {
    if (fs.existsSync("./.git")) {
        const exec = require("child_process").exec
        await exec("git reset --hard")
        await exec("git pull")
        console.log("\x1b[34m%s\x1b[0m", "Yükleniyor......")
        console.log("\x1b[34m%s\x1b[0m", "Bağımlılıklar yükleniyor......")
        childProcess.exec("npm install", (err, stdout, stderr) => {
            if (err) {
                console.log("\x1b[31m%s\x1b[0m", "Error: " + err)
                return
            }
            console.log("" + stdout + "")
            console.log("\x1b[32m%s\x1b[0m", "Yükleme başarılı!")
        })
    } else {
        console.log("\x1b[31m%s\x1b[0m", "Git deposu değil!")
    }
}
update()
