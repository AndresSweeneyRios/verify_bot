require('dotenv').config()

const Discord = require('discord.js')
const client = new Discord.Client()

client.on('ready', ( ) => console.log(`Logged in as ${client.user.tag}!`))

client.on('messageReactionAdd', async ( { message: { channel } }, user ) => {
    if (/rules/.test(channel.name)) {
        await channel.guild
            .member(user)
            .removeRole(process.env.ROLE)
            .catch(console.error)
    }
})

client.on('messageReactionRemove', async ( { message: { channel } }, user ) => {
    if (/rules/.test(channel.name)) {
        await channel.guild
            .member(user)
            .addRole(process.env.ROLE)
            .catch(console.error)
    }
})

client.on('guildMemberAdd', async member => {
    await member
        .setRoles([ process.env.ROLE ])
        .catch(console.error)
});

client.on('raw', ({ d: data, t: event }) => {
    if (['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(event)) {
        const { channel_id, user_id, message_id, emoji } = data

        const channel = client.channels.get(channel_id)

        if (!channel.messages.has(message_id)) channel.fetchMessage(
            message_id
        ).then( message => {
            const reaction = message.reactions.get(
                emoji.id ? `${emoji.name}:${emoji.id}` : emoji.name 
            )

            const user = client.users.get(user_id)

            if (reaction) reaction.users.set(user_id, user)
            
            client.emit( 
                event === 'MESSAGE_REACTION_ADD' 
                    ? 'messageReactionAdd' 
                    : 'messageReactionRemove', 
                reaction, 
                user
            )
        })
    }
})

client.login(process.env.TOKEN)