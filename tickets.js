const {
  ChannelType,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

const config = require("./config");

const ticketButtons = new ActionRowBuilder().addComponents(
  new ButtonBuilder()
    .setCustomId("ticket_add_user")
    .setEmoji("<a:GTALoading:1526788751563558965>")
    .setLabel("Añadir usuario")
    .setStyle(ButtonStyle.Secondary),

  new ButtonBuilder()
    .setCustomId("ticket_claim")
    .setEmoji("<a:4731verifiedred:1533478086333567087>")
    .setLabel("Reclamar")
    .setStyle(ButtonStyle.Success),

  new ButtonBuilder()
    .setCustomId("ticket_release")
    .setEmoji("<a:emoji_235:1538333225066307654>")
    .setLabel("Liberar")
    .setStyle(ButtonStyle.Secondary),

  new ButtonBuilder()
    .setCustomId("ticket_close")
    .setEmoji("<a:31white_x:1505680012177834235>")
    .setLabel("Cerrar")
    .setStyle(ButtonStyle.Danger)
);

async function createTicket(interaction, type) {
  const guild = interaction.guild;
  const user = interaction.user;

  const channel = await guild.channels.create({
    name: `ticket-${user.username}`.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
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

  const embed = new EmbedBuilder()
    .setTitle("♛ 𝑲𝒊𝒏𝒈 𝒕𝒉𝒆 𝑳𝒂𝒏𝒅 ♛")
    .setDescription(
      `🎫 **Ticket creado correctamente**\n\n` +
      `Bienvenido, ${user}.\n\n` +
      `Este ticket es privado. Un miembro del Staff te atenderá pronto.\n\n` +
      `📝 Explica detalladamente tu solicitud para poder ayudarte.`
    );

  await channel.send({
    content: `|| ${user} <@&${config.roles.ticketStaff}> ||`,
    embeds: [embed],
    components: [ticketButtons]
  });

  await interaction.reply({
    content: `✅ Tu ticket ha sido creado: ${channel}`,
    ephemeral: true
  });

  return channel;
}

async function handleTicketButton(interaction) {
  switch (interaction.customId) {
    case "ticket_add_user":
      return interaction.reply({
        content: "👤 Selecciona el usuario que deseas añadir.",
        ephemeral: true
      });

    case "ticket_claim":
      return interaction.reply({
        content: `🎯 Ticket reclamado por ${interaction.user}.`,
        ephemeral: false
      });

    case "ticket_release":
      return interaction.reply({
        content: `🔓 ${interaction.user} ha liberado el ticket.`,
        ephemeral: false
      });

    case "ticket_close":
      return interaction.reply({
        content: "⭐ Antes de cerrar el ticket, el usuario debe realizar la valoración.",
        ephemeral: false
      });
  }
}

module.exports = {
  createTicket,
  handleTicketButton
};
