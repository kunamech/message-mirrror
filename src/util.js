const moment = require('moment');
const Discord = require('discord.js')

module.exports = {
    extract: ((json) => {
        Object.entries(json).forEach(([key, value]) => {
            return {key: key, value: value}
        })
    }),
    log: ((message) =>  {
        return console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`)
        }),
    filter: ((string) => {
        let safefilter = [':', `"`, '{', '}', ','];
        if(!string instanceof String) return true

        if(string.includes(safefilter)) {
            return true
        } else {
            return false
        }
    }),

    /**
     * 
     * Create a log embed
     * 
     * @param {String} color 
     * @param {String} title 
     * @param {String} description 
     * @param {String} footer 
     * @returns 
     */
    logEmbed: ((color, title, description, footer) => {
        const embed = new Discord.MessageEmbed()
        .setColor(color.toUpperCase())
        .setTitle(title)
        .setDescription(description)
        .setTimestamp()
        .setFooter(footer)
        return embed
    })
}