// stuffs for importing libs :D

require('dotenv').config();
const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');

// client instance... obviously.

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

// Slash command builder and stuffs, so Heifer is more useful!!

const commands = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription("Heifer isn't alive silly, but this will see if he works!")
].map(cmd => cmd.toJSON());


const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );
    console.log('Slash commands registered.');
  } catch (err) {
    console.error(err);
  }
})();


// log into console when the bot isnt too shy hehe

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// HEIFER SAYS HI FRIENDS (≧◡≦) ♡

client.on('guildMemberAdd', (member) => {
    const channel = member.guild.systemChannel;
  channel.send(`More friends! Hi ${member.user}!`);
});

//play ping pong with heifer!! (checks latency lol) 

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply(`🏓 Pong! Latency: **${client.ws.ping}ms**`);
  }
});



client.login(process.env.TOKEN);
