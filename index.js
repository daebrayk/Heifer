// stuffs for importing libs :D

require('dotenv').config();
const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
const badWords = require('./badwords.json');


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
    .setDescription("Heifer should be alive, try!"),

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
          .setRequired(true)),

  new SlashCommandBuilder()
  .setName('mute')
  .setDescription("Heifer, silence this sinner!")
  .addUserOption(opt =>
    opt.setName('target')
      .setDescription("The sinner: ")
      .setRequired(true))
  .addStringOption(opt =>
    opt.setName('duration')
    .setDescription("Duration of the mute in seconds, minutes, hours or days.")
    .setRequired(true))
  .addStringOption(opt =>
    opt.setName('reason')
    .setDescription("Reason of the mute.")
    .setRequired(true)),

  new SlashCommandBuilder()
  .setName('unmute')
  .setDescription("Heifer, forgive this sinner!")
  .addUserOption(opt =>
    opt.setName('target')
      .setDescription("The sinner: ")
      .setRequired(true))
  .addStringOption(opt =>
    opt.setName('reason')
      .setDescription("Reason of the unmute.")
      .setRequired(false))

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

//helper function to parse duration for the mute command, so Heifer can decide how long to silence the sinner for!!


function parseDuration(str) {
  const units = { s: 1000, m: 60000, h: 3600000, d: 86400000, y: 31556952000 };
  const match = str.match(/^(\d+)(s|m|h|d|y)$/);
  if (!match) return null;
  return parseInt(match[1]) * units[match[2]];
}


// log into console when the bot isnt too shy hehe

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// HEIFER SAYS HI FRIENDS (≧◡≦) ♡

client.on('guildMemberAdd', async (member) => {
  const systemChannel = member.guild.systemChannel;
  const logChannel = client.channels.cache.get(process.env.LOG_CHANNEL_ID);

  if (systemChannel) {
    await systemChannel.send(`More Friends! Hi ${member.user}!`);
  }

  if (logChannel) {
    await logChannel.send(
      `**Member Joined**\n` +
      `**User:** ${member.user.tag}\n` +
      `**ID:** ${member.user.id}\n` +
      `**Account Created:** ${member.user.createdAt.toDateString()}`
    );
  }
});


//Heifer says bye fren (╥﹏╥)

client.on('guildMemberRemove', async (member) => {
  const systemChannel = member.guild.systemChannel;
  const logChannel = client.channels.cache.get(process.env.LOG_CHANNEL_ID);

  if (systemChannel) {
    await systemChannel.send(`Goodbye ${member.user} (╥﹏╥)`);
  }

  if (logChannel) {
    await logChannel.send(
      `**Member Left**\n` +
      `**User:** ${member.user.tag}\n` +
      `**ID:** ${member.user.id}`
    );
  }
});

// HEIFER SEES WHAT YOURE SAYING AND HE DOESNT LIKE IT!!! (automated)

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const foundWord = badWords.words.find(word => 
    message.content.toLowerCase().includes(word.toLowerCase())
  );

  if (foundWord) {
    await message.delete();
    
    const logChannel = client.channels.cache.get(process.env.LOG_CHANNEL_ID);
    
    await message.channel.send(
      ` ${message.author} noooo don't say that!11!11.`
    );

    if (logChannel) {
      await logChannel.send(
        `**Auto Warn**\n` +
        `**User:** ${message.author.tag}\n` +
        `**Channel:** ${message.channel}\n` +
        `**Stopped from saying:** ${foundWord}\n` +
        `**Full message:** ${message.content}`
      );
    }
  }
});

client.on('messageDelete', async (message) => {
  if (message.author.bot) return;

    const logChannel = client.channels.cache.get(process.env.LOG_CHANNEL_ID);
  
    if (logChannel) {
      await logChannel.send(
        `**Deleted Message**\n` +
        `**User:** ${message.author.tag}\n` +
        `**Channel:** ${message.channel}\n` +
        `**Content:** ${message.content}`
      );
    }

});

  client.on('messageUpdate', async (oldMessage, newMessage) => {
    if (oldMessage.author.bot) return;
    if (oldMessage.content === newMessage.content) return;


    const logChannel = client.channels.cache.get(process.env.LOG_CHANNEL_ID);

    if (logChannel) {
      await logChannel.send(
        `**Edited Message**\n` +
        `**User:** ${oldMessage.author.tag}\n` + 
        `**Channel:** ${oldMessage.channel}\n` +
        `**Before:** ${oldMessage.content}\n` +
        `**After:** ${newMessage.content}`
      );
    }
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
        `**Manual Warn**\n` +
        `**User:** ${target.user.tag}\n` +
        `**Reason:** ${reason}\n` +
        `**Warned by:** ${interaction.user.tag}\n` +
        (offendingMessage ? `**Message:** ${offendingMessage.content}` : `**No message provided**`)
      );
    }
    
  }


if (interaction.commandName === 'mute') {
  const target = interaction.options.getMember('target');
  const reason = interaction.options.getString('reason') ?? 'No reason provided';
  const durationStr = interaction.options.getString('duration');
  const duration = parseDuration(durationStr);
  const maxDuration = 28 * 24 * 60 * 60 * 1000; // 28 days in ms

  if (!duration) {
    return interaction.reply("Invalid duration format. Use something like `10s`, `5m`, `1h`, or `2d`.");
  }

  if (duration > maxDuration) {
    return interaction.reply("Maximum mute duration is 28 days. Use `28d` for the longest mute.");
  }

  if (!target.moderatable) {
    return interaction.reply("GAHHHHH HEIFER CANT DO THAT!");
  }

  await target.timeout(duration, reason);


  const logChannel = client.channels.cache.get(process.env.LOG_CHANNEL_ID);

  await interaction.reply(
    `🔇 ${target} has been muted for **${durationStr}** — reason: **${reason}**`
  );

  if (logChannel) {
    await logChannel.send(
      `**Mute**\n` +
      `**User:** ${target.user.tag}\n` +
      `**Duration:** ${durationStr}\n` +
      `**Reason:** ${reason}\n` +
      `**Muted by:** ${interaction.user.tag}`
    );
  }
}


if (interaction.commandName === 'unmute') {
  const target = interaction.options.getMember('target');
  const reason = interaction.options.getString('reason') ?? 'No reason provided';

  if (!target.moderatable) {
    return interaction.reply("GAHHHHH HEIFER CANT DO THAT!");
  }

  await target.timeout(null, reason);


  const logChannel = client.channels.cache.get(process.env.LOG_CHANNEL_ID);

  await interaction.reply(
    `🔈 ${target} has been unmuted — reason: **${reason}**`
  );

  if (logChannel) {
    await logChannel.send(
      `**Unmute**\n` +
      `**User:** ${target.user.tag}\n` +
      `**Reason:** ${reason}\n` +
      `**Unmuted by:** ${interaction.user.tag}`
    );
  }

}
});




client.login(process.env.TOKEN);
