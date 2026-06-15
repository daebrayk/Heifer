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
    .setDescription("Heifer isn't alive silly, but this will see if he works!"),

  new SlashCommandBuilder()
    .setName('kick')
    .setDescription("Heifer! Banish this heathen!")
    .addUserOption(opt =>
      opt.setName('target')
        .setDescription("The banished: ")
        .setRequired(true))
    .addStringOption(opt =>
      opt.setName('reason')
        .setDescription("Reason of banishment: ")
        .setRequired(false)),

  new SlashCommandBuilder()
    .setName('ban')
    .setDescription("Heifer! Execute him.")
    .addUserOption(opt =>
      opt.setName('target')
        .setDescription("The sinner: ")
        .setRequired(true))
    .addStringOption(opt =>
      opt.setName('reason')
        .setDescription("Reason of execution: ")
        .setRequired(false)),


  new SlashCommandBuilder()
      .setName('warn')
      .setDescription("Heifer, scold him!")
      .addUserOption(opt =>
        opt.setName('target')
          .setDescription("The sinner: ")
          .setRequired(true))
      .addStringOption(opt =>
        opt.setName('message_id')
          .setDescription("ID of message")
          .setRequired(true))
      .addStringOption(opt =>
        opt.setName('reason')
          .setDescription("Reason of warning: ")
          .setRequired(true))

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



client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  //play ping pong with heifer!! (checks latency lol) 

  if (interaction.commandName === 'ping') {
    await interaction.reply(`🏓 Pong! Latency: **${client.ws.ping}ms**`); 
  }

  //HEIFER BANISHES THE HEATHENS (kicks the user from the server, with an optional reason) 

  if (interaction.commandName === 'kick') {
  const target = interaction.options.getMember('target');
  const reason = interaction.options.getString('reason') ?? 'kicked cause i felt like it ';

  if (!target.kickable) {
    return interaction.reply({ content: "Heifer...is too weak to fight that user... (×﹏×)"});
  }

  await target.kick(reason);
  await interaction.reply(`Banished **${target.user.tag}** — reason: ${reason}`);
}
  // Heifer... They don't deserve life... take it.

  if (interaction.commandName === 'ban') {
  const target = interaction.options.getMember('target');
  const reason = interaction.options.getString('reason') ?? 'death was the only option. ';



  await target.ban({ reason: reason });
  await interaction.reply(`Executed **${target.user.tag}** — reason: ${reason}`);

}

  if (interaction.commandName === 'warn'){
  const target = interaction.options.getMember('target');


  }

  //warn interaction, HEIFER SEES WHAT YOURE SAYING AND HE DOESNT LIKE IT!!!

  if (interaction.commandName === 'warn') {
    const target = interaction.options.getMember('target');
    const reason = interaction.options.getString('reason') ?? 'No reason provided';
    const messageId = interaction.options.getString('message_id');

    let offendingMessage = null;

    if (messageId) {
      try {
        offendingMessage = await interaction.channel.messages.fetch(messageId);
      } catch {
        return interaction.reply("I couldn't find that message. Double check the ID.");
      }
    }

    const logChannel = client.channels.cache.get(process.env.LOG_CHANNEL_ID);

    const warnMessage = offendingMessage
      ? `⚠️ ${target} you have been warned for: **${reason}**\n> ${offendingMessage.content}`
      : `⚠️ ${target} you have been warned for: **${reason}**`;

    await interaction.reply(warnMessage);

    if (logChannel) {
      await logChannel.send(
        `📋 **Manual Warn**\n` +
        `**User:** ${target.user.tag}\n` +
        `**Reason:** ${reason}\n` +
        `**Warned by:** ${interaction.user.tag}\n` +
        (offendingMessage ? `**Message:** ${offendingMessage.content}` : `**No message provided**`)
      );
    }
    
  }


});




client.login(process.env.TOKEN);
