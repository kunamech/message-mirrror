const Discord = require('discord.js');
const client = new Discord.Client();
const dotenv = require('dotenv').config();
const hardConfig = require('./config.json');
const util = require('./src/util.js');

let log = util.log;
let extract = util.extract;
let filter = util.filter;
let logEmbed = util.logEmbed;

const config = {
    token: process.env.TOKEN,
    maintainer: hardConfig.maintainers,
    admin: ['771787429035376701'],
    feed: hardConfig.feed, //Feed chan
    follow: hardConfig.follower,
    log: hardConfig.logChannel,
    prefix: '?',
    diagnostics: '', //Channel for error logs
    activityText: '',
    activityStatus: '', //LISTENING WATCHING STREAMING PLAYING
    webhook: {
        name: 'Bot diagnostics',
        profile: 'https://media.discordapp.net/attachments/821434612055408691/850329671312867368/i.png',
        id: '', //https://discord.com/api/webhooks/<ID>/<TOKEN>
        token: ''
    }
}

let prefix = config.prefix
client.login(config.token)


const eventLog = {
    followAdded: function(key, id, user) {
        const embed = logEmbed('GREEN', 'A follower channel has been added.', `Channel ${key} (${id}) is recently added to the followers database.`, `By ${client.users.cache.get(user).tag} (${id})`)
        log(`New follower: ${id}`)
        config.log.send(embed)
    },
    feedChanged: function(id, user) {
        const embed = logEmbed('GREEN', 'Feed channel has been added.', `Channel ${id} is the new feed channel.`, `By ${client.users.cache.get(user).tag} (${user})`)
        log(`New feed: ${id}`)
        return config.log.send(embed)
    },
    followRemoved: function(key, id, user) {
        const embed = logEmbed('RED', 'A follower channel has been removed.', `Channel ${key} (${id}) is recently removed from the followers database.`, `By ${client.users.cache.get(user).tag} (${user})`)
        log(`Removed follower: ${id}`)
        return config.log.send(embed)
    },
    maintainerAdded: function(id, user) {
         const embed = logEmbed('GREEN', 'A new maintainer has been.', `Maintainer ${client.users.cache.get(id).tag} (${id}) has recently removed from the maintainers.`, `By ${client.users.cache.get(user).tag} (${user})`)
        log(`New maintainer: ${id}`)
        return config.log.send(embed)
    },
    maintainerRemoved: function(id, user) {
        const embed = logEmbed('RED', 'A maintainer has been removed.', `Maintainer ${client.users.cache.get(id).tag} (${id}) has recently removed from the maintainers.`, `By ${client.users.cache.get(user).tag} (${user})`)
        log(`Removed follower: ${id}`)
        return config.log.send(embed)
    },
    statusChanged: function(id, user) {
        const embed = logEmbed('GREEN', 'Status has been changed', `Status has been changed to ${id} manually.`, `By ${client.users.cache.get(user).tag} (${user})`)
        log(`Custom status: ${id}`)
        return client.channels.cache.get(config.log).send(embed)
    }
};

client.on('ready', () => {
    log(`Succesfully logined as ${client.user.tag} (${client.user.id})`);
    client.user.setActivity(config.activityText , { type: config.activityStatus })
})

client.on('message', msg => {
    if(msg.author.bot) return;

    if(msg.content.toLowerCase().startsWith(prefix + 'addfollow')) {//DONE
        if(!config.maintainer.includes(msg.author.id) && !config.admin === msg.author.id) return msg.reply('You are not authorizated to do that!')
        const arg = msg.content.split(" ")
        if(!arg[1] || !arg[2]) return msg.reply(`There are missing arguments. Usage: ${prefix + 'addfollow (Channel name) (id)'}`)
        let key = arg[1].toString();
        let value = arg[2].toString();
        if(filter(value) || filter(key)) return msg.reply('Key or value includes an illegal chracter.')
        if(!client.channels.cache.get(value)) return msg.reply(`${id} is not a valid ID or bot is not in the server`)
        hardConfig.follower[key] = value
        msg.reply('Follower has been succesfully added to the database.')
        eventLog.followAdded(key, value, msg.author.id)
    }

    if(msg.content.toLowerCase().startsWith(prefix + 'setfeed')) {//DONE
        let id;
        if(!config.maintainer.includes(msg.author.id) && !config.admin === msg.author.id) return msg.reply('You are not authorizated to do that!')
        if(!msg.mentions.channels.first){
        const arg = msg.content.split(" ")
        if(!arg[1]) return msg.reply('You have to mention a channel or enter a channel Id!')
        id = arg[1].toString();
        if(filter(id)) return msg.reply('Value includes an illegal chracter.')
        }else{id = msg.mentions.channels.first.id}

        if(!client.channels.cache.get(id)) return msg.reply(`${id} is not a valid ID or bot is not in the server`)
        hardConfig.feed = id
        eventLog.feedChanged(id, msg.author.id)
        msg.reply(`Feed has been changed to <#${id}> ($${id})`)
    }

    if(msg.content.toLowerCase().startsWith(prefix + 'removefollower')) {//DONE
        let c;

        if(!config.maintainer.includes(msg.author.id) && !config.admin === msg.author.id) return msg.reply('You are not authorizated to do that!')
        if(!msg.mentions.channels.first()){
            const arg = msg.content.split(" ");
             c = arg[1];
        }else{c = msg.mentions.channels.first().id}
        let datastore = config.follow[c]
        if(!datastore) return msg.reply('This channel is not existing.')
        let id = config.follow[c]
        delete datastore

        log(`Removed follower: ${c} [By: ${msg.author.tag} (${msg.author.id})]`)
        eventLog.followRemoved(c, id, msg.author.id)
    }

    if(msg.content.toLowerCase().startsWith(prefix + 'addmaintainer')) {
        if(!config.admin.includes(msg.author.id) ) return msg.reply('You are not authorizated to do that!')
        if(msg.mentions.users.first()) {
            let id = msg.mentions.users.first().id;
            hardConfig.maintainers.push(id)
            msg.reply(`<@${id}> Has been succesfully added to the maintainers.`)
            eventLog.maintainerAdded(id, msg.author.id)
        }
    }

    if(msg.content.toLowerCase().startsWith(prefix + 'removemaintainer')) { //DONE
        let id;
        if(!config.admin.includes(msg.author.id)) return msg.reply('You are not authorizated to do that!')
        if(msg.mentions.users.first()) {
             id = msg.mentions.users.first().id;
        } else {
            let args = msg.content.slice(' ')
            id = args[1]
        }
        if(!hardConfig.maintainers.includes(id)) return msg.reply(`${id} Is not in database`)
        let index = hardConfig.maintainers.indexOf(id)
        if (index > -1) {
            hardConfig.maintainers.splice(index, 1);
          }
            msg.reply(`<@${id}> (${id}) Has been succesfully removed from the maintainers.`)
            eventLog.maintainerRemoved(id, msg.author.id)
    };

    if(msg.content.toLowerCase().startsWith(prefix + 'changestatus')) { //DONE
        if(!config.maintainer.includes(msg.author.id) && !config.admin === msg.author.id) return msg.reply('You are not authorizated to do that!');
        const arg = msg.content.split(" ", 1)
        let status = arg[1]
        if(!status) return msg.reply('No string has been given.')
        client.user.setActivity(status , { type: config.activityStatus || 'PLAYING'})
        msg.reply(`Activity has been succesfully changed to **${status}**.`)
        eventLog.statusChanged(status, msg.author.id)
    }


    if(msg.channel.id === config.feed) {
        let attachments = [] 
        if(msg.attachments) {
            msg.attachments.forEach(media => {let url = media.url; attachments.push(url)})
        }
        const channels = extract(config.follow)
        channels.forEach(ch => {
        let channel = client.channels.cache.get(ch)
        if(!channel) return console.log(`${ch} is not a valid channel!`);
        setTimeout(function(){
            if(attachments.length > 0) {
                let list = attachments.join('\n')
               return channel.send(`${format} \n ${list}`)
            }
            channel.send(format)  
        },500);
    })
}
})

client.on('error', err => {
    log(err)
    const webhookClient = new Discord.WebhookClient(config.webhook.id, config.webhook.token);
    const errEmbed = new Discord.MessageEmbed()
    .setColor('RED')
    .setTitle('An error occurred')
    .addField('', `${"```"} ${err} ${"```"}` )
    .setTimestamp()
    
webhookClient.send(config.diagnostics, {
	username: config.webhook.name,
	avatarURL: config.webhook.profile,
	embeds: [errEmbed],
});
})