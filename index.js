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


client.login(process.env.TOKEN);
