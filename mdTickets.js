const {
  ChannelType,
  PermissionFlagsBits,
  EmbedBuilder
} = require("discord.js");

const config = require("./config");
const database = require("./database");
const tickets = require("./tickets");

const activeMDTickets = new Map();

async function findOpenMDTicket(guild, userId) {
  const existing = guild.channels.cache.find(
    channel =>
      channel.topic?.includes(`mdUser:${userId}`) &&
      channel.topic?.includes("mdStatus:open")
  );

  if (existing) {
    activeMDTickets.set(userId, existing.id);
    return existing;
  }

  return null;
}

async function createMDTicket(client, user, firstMessage) {
  const guild = await client.guilds.fetch(config.guildId);

  const existing = await findOpenMDTicket(guild, user.id);

  if (existing) {
    await existing.send(`📩 **${user.tag}:**\n${firstMessage}`);
    return existing;
  }

  const channel = await guild.channels.create({
    name: `md-${user.username}`.toLowerCase().slice(0, 100),
    type: ChannelType.GuildText,
    topic: `mdUser:${user.id} | mdStatus:open | ticketType:MD`,
    permissionOverwrites: [
      {
        id: guild.roles.everyone.id,
        deny: [PermissionFlagsBits.ViewChannel]
      },
      {
        id: user.id,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ReadMessageHistory
        ]
      },
      {
        id: config.roles.ticketStaff,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ReadMessageHistory,
          PermissionFlagsBits.ManageMessages
        ]
      }
    ]
  });

  activeMDTickets.set(user.id, channel.id);

  database.createTicket(channel.id, {
    channelId: channel.id,
    userId: user.id,
    username: user.tag,
    type: "MD",
    claimedBy: null,
    status: "open",
    rating: null,
    review: null
  });

  const embed = new EmbedBuilder()
    .setTitle("📩 Soporte por MD")
    .setDescription(
      [
        `👤 **Usuario:** ${user}`,
        "",
        "Este canal está conectado directamente con los mensajes privados del usuario.",
        "",
        "📨 Los mensajes del usuario llegarán aquí.",
        "💬 Las respuestas del Staff serán enviadas por MD.",
        "",
        "🛠️ Un miembro del Staff te atenderá pronto."
      ].join("\n")
    );

  await channel.send({
    content: `|| ${user} <@&${config.roles.ticketStaff}> ||`,
    embeds: [embed],
    components: [
      tickets.ticketButtons()
    ]
  });

  await channel.send({
    content: `📩 **${user.tag}:**\n${firstMessage}`
  });

  return channel;
}

async function handleUserMessage(message) {
  if (message.author.bot) return;

  const client = message.client;

  const guild = await client.guilds.fetch(config.guildId).catch(() => null);

  if (!guild) {
    await message.reply(
      "❌ No pude encontrar el servidor de soporte."
    ).catch(() => {});
    return;
  }

  const channel = await createMDTicket(
    client,
    message.author,
    message.content || "[Archivo adjunto]"
  );

  await message.react("✅").catch(() => {});

  if (activeMDTickets.get(message.author.id) === channel.id) {
    const existing = await channel.messages.fetch({ limit: 5 });

    const alreadySent = existing.some(
      msg =>
        msg.author.id === client.user.id &&
        msg.content.includes(message.content || "[Archivo adjunto]")
    );

    if (!alreadySent) {
      await channel.send({
        content: `📩 **${message.author.tag}:**\n${message.content || "[Archivo adjunto]"}`
      });
    }
  }
}

async function handleStaffMessage(message) {
  if (message.author.bot) return;
  if (!message.guild) return;

  const ticket = database.getTicket(message.channel.id);

  if (!ticket || ticket.type !== "MD") return;

  const isStaff = message.member.roles.cache.has(
    config.roles.ticketStaff
  );

  if (!isStaff) return;

  const user = await message.client.users
    .fetch(ticket.userId)
    .catch(() => null);

  if (!user) return;

  const content = message.content || "[Archivo adjunto]";

  const sent = await user.send({
    content: `🛠️ **${message.author.tag}:**\n${content}`,
    files: message.attachments.map(attachment => attachment.url)
  }).catch(() => null);

  if (sent) {
    await sent.react("✅").catch(() => {});
  }
}

async function handleMDButton(interaction) {
  if (!interaction.customId.startsWith("ticket_")) return;

  const ticket = database.getTicket(interaction.channel.id);

  if (!ticket || ticket.type !== "MD") return;

  await tickets.handleTicketButton(interaction);
}

async function handleMDModal(interaction) {
  if (!interaction.customId.startsWith("ticket_")) return;

  const ticket = database.getTicket(interaction.channel.id);

  if (!ticket || ticket.type !== "MD") return;

  await tickets.handleTicketModal(interaction);
}

function getActiveMDTicket(userId) {
  return activeMDTickets.get(userId) || null;
}

function removeActiveMDTicket(userId) {
  activeMDTickets.delete(userId);
}

module.exports = {
  activeMDTickets,
  createMDTicket,
  handleUserMessage,
  handleStaffMessage,
  handleMDButton,
  handleMDModal,
  getActiveMDTicket,
  removeActiveMDTicket
};
