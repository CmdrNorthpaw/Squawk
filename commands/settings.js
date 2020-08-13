const fs = require('fs')

function settings_command(msg, args) {
    const server_json = require(`../server_data/${msg.guild.id}`)
    switch(args[0]) {
        case "channel":
            server_json.channel = parseInt(args[1])
        case "publish":
            server_json.publish = args[1]
    }
    fs.writeFile(`../server_data/${msg.guild.id}.json`)

}

module.exports = {
    name: 'settings',
    description: 'Allows you to configure the bot settings to your needs',
    execute(message, args) {
        settings_command(message, args)
    }
}
