import twitter from './twitter';
import Discord from 'discord.js'
import forever from 'async/forever'
import fs from 'fs'
import Twitter from 'twitter-lite'
require('dotenv').config()

const twitter = new Twitter({
    bearer_token: process.env.BEARER_TOKEN
})


const client = Discord.client()
var following = []

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`)
})

function create_embed(tweet_id) {
    const tweet = twitter.get('statuses/show', {id: tweet_id})
    const author = tweet["author"]

    let footer_string = `Tweeted by ${author["name"]} (@${author["screen_name"]})`
    if (tweet["in_reply_to_screen_name"] != null) { footer_string.concat(` replying to @${tweet["in_reply_to_string_name"]}`) }

    const embed = new Discord.MessageEmbed()
        .setColor('#00acee')
        .setAuthor(author["name"])
        .setThumbnail(author["profile_image_url"])
        .addField('Message', tweet["text"])
        .setFooter(footer_string)
        .setURL(`https://twiter.com/${author["name"]}/status/${tweet_id}`)

        return embed
}

forever(
    function(next) {
        fs.readdirSync('.').forEach(file => {
                let json_data = JSON.parse(fs.readFileSync(file))
                var following_list = json_data["following"]
                following_list.forEach(followee => {
                    followee = followee.replace(/@/g, "")
                    if (!following.includes(followee)) {
                        following.push(followee)
                    }
                })
            }
        )
    }
)

const stream
async.forever(
    function(next) {
    var stream;
    process.nextTick(() => stream.destroy())
    setTimeout(() => {
        stream = twitter.stream("statuses/filter", {follow: following.join()})
        .on('data', tweet => {
            let tweet_embed = create_embed(tweet.id)
            let following_json = require('./server_data/following.json')
            following_json[tweet.id_str].forEach((channel) => {
                client.channels.cache.get(channel).send(tweet_embed)
            })
        })
    }, 30000)
    .on('start')
    }
)




