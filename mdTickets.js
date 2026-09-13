const {
  ChannelType,
  PermissionFlagsBits,
  EmbedBuilder
} = require("discord.js");

const config = require("./config");

// Guarda los tickets activos iniciados por MD
const activeMDTickets = new Map();

// Crear un ticket cuando un usuario escribe por MD
async function createMDTicket(message, guild) {
  const user = message.author;

  const channel = await guild.channels.create({
    name: `md-${user.username}`
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-"),
    type: ChannelType.GuildText,

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
          PermissionFlagsBits.ReadMessageHistory
        ]
      }
    ]
  });

  activeMDTickets.set(user.id, {
    channelId: channel.id,
    userId: user.id,
    claimedBy: null
  });

  const embed = new EmbedBuilder()
    .setTitle("♛ 𝑲𝒊𝒏𝒈 𝒕𝒉𝒆 𝑳𝒂𝒏𝒅 ♛")
    .setDescription(
      `📩 **Ticket iniciado por MD**\n\n` +
      `👤 **Usuario:** ${user}\n` +
      `📝 El usuario ha iniciado una conversación mediante MD.\n\n` +
      `👮 Un miembro del Staff puede reclamar este ticket.`
    );

  await channel.send({
    content: `|| ${user} <@&${config.roles.ticketStaff}> ||`,
    embeds: [embed]
  });

  // Enviar el primer mensaje del usuario al canal
  await channel.send(`📩 **${user.username}:** ${message.content}`);

  // Confirmación al usuario
  await message.react("✅");

  return channel;
}

// Mensaje recibido por MD
async function handleDirectMessage(message, guild) {
  if (message.author.bot) return;

  let ticket = activeMDTickets.get(message.author.id);

  // Si no existe, crear ticket
  if (!ticket) {
    await createMDTicket(message, guild);
    return;
  }

  const channel = guild.channels.cache.get(ticket.channelId);

  if (!channel) {
    activeMDTickets.delete(message.author.id);
    await createMDTicket(message, guild);
    return;
  }

  // Mandar mensaje del usuario al canal
  await channel.send(
    `📩 **${message.author.username}:** ${message.content}`
  );

  // Confirmar recepción
  await message.react("✅");
}

// Mensaje del Staff dentro del ticket → MD del usuario
async function handleStaffMessage(message, client) {
  if (message.author.bot) return;

  const ticket = [...activeMDTickets.values()].find(
    t => t.channelId === message.channel.id
  );

  if (!ticket) return;

  const user = await client.users.fetch(ticket.userId);

  await user.send(
    `👮 **Staff:** ${message.content}`
  );
}

// Registrar quién reclamó el ticket
function claimMDTicket(channelId, staffId) {
  const ticket = [...activeMDTickets.values()].find(
    t => t.channelId === channelId
  );

  if (!ticket) return false;

  ticket.claimedBy = staffId;
  return true;
}

// Eliminar ticket de MD cuando se cierra
function closeMDTicket(channelId) {
  for (const [userId, ticket] of activeMDTickets.entries()) {
    if (ticket.channelId === channelId) {
      activeMDTickets.delete(userId);
      return true;
    }
  }

  return false;
}

module.exports = {
  createMDTicket,
  handleDirectMessage,
  handleStaffMessage,
  claimMDTicket,
  closeMDTicket
};
