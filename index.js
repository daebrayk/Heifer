// stuffs for importing libs :D

require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

// client instance... obviously.

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

// log into console when the bot isnt too shy hehe

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// HEIFER SAYS HI FRIENDS (≧◡≦) ♡

client.on('guildMemberAdd', (member) => {
    const channel = member.guild.systemChannel;
  channel.send(`More friends! Hi ${member.user}!`);
});



client.login(process.env.TOKEN);
