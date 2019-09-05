require('dotenv').config()

const { MESSAGE, ROLE, CHANNEL, GUILD } = process.env

const Discord = require('discord.js')
const client = new Discord.Client()

client.on('ready', async ( ) => {
    console.log(`Logged in as ${client.user.tag}!`)
    client.user.setStatus('offline')

    await client.channels.get( CHANNEL ).fetchMessage( MESSAGE )

    client.on('messageReactionAdd', async ( Reaction, User ) => {
        try {
            const Member = await client.guilds.get( GUILD ).fetchMember(User)
            await Member.addRole( ROLE )
        } catch (error) {
            console.error(error, User.id)
        }
    })

    client.on('messageReactionRemove', async ( Reaction, User ) => {
        try {
            const Member = await client.guilds.get( GUILD ).fetchMember(User)
            await Member.removeRole( ROLE )
        } catch (error) {
            console.error(error, User.id)
        }
    })
})

client.login(process.env.TOKEN)