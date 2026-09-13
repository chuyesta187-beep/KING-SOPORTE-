const {
  ChannelType,
  PermissionFlagsBits,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle
} = require("discord.js");

const config = require("./config");
const database = require("./database");
const transcripts = require("./transcripts");

const TICKET_TYPES = {
  alliance: {
    name: "Alianza",
    emoji: "<a:93619jumpingstar:1533480218411401296>",
    description: "Solicita alianzas, colaboraciones o asociaciones."
  },
  support: {
    name: "Soporte",
    emoji: "<:verified:710970919736311942>",
    description: "Obtén ayuda con cualquier problema, duda o consulta."
  },
  claim: {
    name: "Claim",
    emoji: "<a:warning:1334727653969756170>",
    description: "Realiza una solicitud relacionada con claims."
  },
  staff: {
    name: "Staff",
    emoji: "<a:Crown_pink:1264023212673466379>",
    description: "Comunícate con el equipo Staff para asuntos relacionados con el servidor."
  }
};

const BUTTONS = {
  add: "<a:GTALoading:1526788751563558965>",
  claim: "<a:4731verifiedred:1533478086333567087>",
  release: "<a:emoji_235:1538333225066307654>",
  close: "<a:31white_x:1505680012177834235>"
};

function ticketButtons() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("ticket_add_user")
      .setEmoji(BUTTONS.add)
      .setLabel("Añadir usuario")
      .setStyle(ButtonStyle.Secondary),

    new ButtonBuilder()
      .setCustomId("ticket_claim")
      .setEmoji(BUTTONS.claim)
      .setLabel("Reclamar")
      .setStyle(ButtonStyle.Primary),

    new ButtonBuilder()
      .setCustomId("ticket_release")
      .setEmoji(BUTTONS.release)
      .setLabel("Liberar")
      .setStyle(ButtonStyle.Secondary),

    new ButtonBuilder()
      .setCustomId("ticket_close")
      .setEmoji(BUTTONS.close)
      .setLabel("Cerrar")
      .setStyle(ButtonStyle.Danger)
  );
}

function ticketPanelComponents() {
  const menu = new StringSelectMenuBuilder()
    .setCustomId("ticket_type_select")
    .setPlaceholder("Selecciona el tipo de ticket")
    .addOptions(
      Object.entries(TICKET_TYPES).map(([value, ticket]) => ({
        label: ticket.name,
        description: ticket.description,
        value,
        emoji: ticket.emoji
      }))
    );

  return [
    new ActionRowBuilder().addComponents(menu)
  ];
}

async function setupTicketPanel(client) {
  const channel = await client.channels.fetch(config.channels.ticketPanel);

  if (!channel || !channel.isTextBased()) {
    console.error("❌ No se encontró el canal del panel de tickets.");
    return;
  }

  const messages = await channel.messages.fetch({ limit: 50 });

  const oldPanel = messages.find(
    message =>
      message.author.id === client.user.id &&
      message.embeds.some(embed =>
        embed.title?.includes("Centro de Atención")
      )
  );

  const embed = new EmbedBuilder()
    .setTitle("♛ 𝑲𝒊𝒏𝒈 𝒕𝒉𝒆 𝑳𝒂𝒏𝒅 ♛")
    .setDescription(
      [
        "🎫 **Centro de Atención**",
        "",
        "Bienvenido al sistema de tickets de **King the Land**.",
        "",
        "🤝 **Alianza**",
        "Solicita alianzas, colaboraciones o asociaciones.",
        "",
        "🛠️ **Soporte**",
        "Obtén ayuda con cualquier problema, duda o consulta.",
        "",
        "🎯 **Claim**",
        "Realiza una solicitud relacionada con claims.",
        "",
        "👥 **Staff**",
        "Comunícate con el equipo Staff para asuntos relacionados con el servidor.",
        "",
        "✨ Gracias por confiar en King the Land."
      ].join("\n")
    );

  if (oldPanel) {
    await oldPanel.edit({
      embeds: [embed],
      components: ticketPanelComponents()
    });
  } else {
    await channel.send({
      embeds: [embed],
      components: ticketPanelComponents()
    });
  }

  console.log("✅ Panel principal de tickets configurado.");
}

async function createTicket(interaction, type) {
  const guild = interaction.guild;
  const user = interaction.user;
  const ticketType = TICKET_TYPES[type];

  if (!ticketType) {
    return interaction.reply({
      content: "❌ Tipo de ticket inválido.",
      ephemeral: true
    });
  }

  const existing = guild.channels.cache.find(
    channel =>
      channel.topic?.includes(`ticketUser:${user.id}`) &&
      channel.topic?.includes("ticketStatus:open")
  );

  if (existing) {
    return interaction.reply({
      content: `❌ Ya tienes un ticket abierto: ${existing}`,
      ephemeral: true
    });
  }

  const channel = await guild.channels.create({
    name: `${type}-${user.username}`.toLowerCase().slice(0, 100),
    type: ChannelType.GuildText,
    topic: `ticketUser:${user.id} | ticketType:${type} | ticketStatus:open`,
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
          PermissionFlagsBits.ReadMessageHistory,
          PermissionFlagsBits.AttachFiles
        ]
      },
      {
        id: config.roles.ticketStaff,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ReadMessageHistory,
          PermissionFlagsBits.ManageMessages,
          PermissionFlagsBits.AttachFiles
        ]
      }
    ]
  });

  database.createTicket(channel.id, {
    channelId: channel.id,
    userId: user.id,
    username: user.tag,
    type,
    claimedBy: null,
    status: "open",
    rating: null,
    review: null
  });

  const embed = new EmbedBuilder()
    .setTitle("🎫 Ticket creado")
    .setDescription(
      [
        `Hola ${user}, tu ticket de **${ticketType.name}** ha sido creado correctamente.`,
        "",
        "🔒 Este canal es privado.",
        "🛠️ Un miembro del Staff te atenderá pronto.",
        "",
        "📝 Explica detalladamente tu solicitud para que podamos ayudarte."
      ].join("\n")
    );

  await channel.send({
    content: `|| ${user} <@&${config.roles.ticketStaff}> ||`,
    embeds: [embed],
    components: [ticketButtons()]
  });

  await interaction.reply({
    content: `✅ Tu ticket ha sido creado: ${channel}`,
    ephemeral: true
  });
}

async function handleTicketSelect(interaction) {
  if (interaction.customId !== "ticket_type_select") return;

  const type = interaction.values[0];
  await createTicket(interaction, type);
}

async function handleTicketButton(interaction) {
  if (!interaction.customId.startsWith("ticket_")) return;

  const ticket = database.getTicket(interaction.channel.id);

  if (!ticket) {
    return interaction.reply({
      content: "❌ Este canal no está registrado como ticket.",
      ephemeral: true
    });
  }

  const member = interaction.member;
  const isStaff = member.roles.cache.has(config.roles.ticketStaff);

  if (
    interaction.customId !== "ticket_close" &&
    !isStaff &&
    interaction.customId !== "ticket_add_user"
  ) {
    return interaction.reply({
      content: "❌ No tienes permisos para realizar esta acción.",
      ephemeral: true
    });
  }

  if (interaction.customId === "ticket_add_user") {
    const modal = new ModalBuilder()
      .setCustomId(`ticket_add_modal_${interaction.channel.id}`)
      .setTitle("Añadir usuario");

    const input = new TextInputBuilder()
      .setCustomId("user_id")
      .setLabel("ID del usuario")
      .setPlaceholder("Ejemplo: 123456789012345678")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    modal.addComponents(
      new ActionRowBuilder().addComponents(input)
    );

    return interaction.showModal(modal);
  }

  if (interaction.customId === "ticket_claim") {
    if (!isStaff) {
      return interaction.reply({
        content: "❌ Solo el Staff puede reclamar tickets.",
        ephemeral: true
      });
    }

    if (ticket.claimedBy) {
      return interaction.reply({
        content: `❌ Este ticket ya fue reclamado por <@${ticket.claimedBy}>.`,
        ephemeral: true
      });
    }

    database.updateTicket(interaction.channel.id, {
      claimedBy: interaction.user.id
    });

    return interaction.reply({
      content: `🛠️ Ticket reclamado por ${interaction.user}.`,
      ephemeral: false
    });
  }

  if (interaction.customId === "ticket_release") {
    if (!isStaff) {
      return interaction.reply({
        content: "❌ Solo el Staff puede liberar tickets.",
        ephemeral: true
      });
    }

    database.updateTicket(interaction.channel.id, {
      claimedBy: null
    });

    return interaction.reply({
      content: "🔓 El ticket ha sido liberado.",
      ephemeral: false
    });
  }

  if (interaction.customId === "ticket_close") {
    if (!isStaff) {
      return interaction.reply({
        content: "❌ Solo el Staff puede cerrar tickets.",
        ephemeral: true
      });
    }

    const modal = new ModalBuilder()
      .setCustomId(`ticket_rating_${interaction.channel.id}`)
      .setTitle("Calificar atención");

    const stars = new TextInputBuilder()
      .setCustomId("rating")
      .setLabel("Calificación de 1 a 5 estrellas")
      .setPlaceholder("Ejemplo: 5")
      .setStyle(TextInputStyle.Short)
      .setMinLength(1)
      .setMaxLength(1)
      .setRequired(true);

    const review = new TextInputBuilder()
      .setCustomId("review")
      .setLabel("Escribe tu reseña")
      .setPlaceholder("Cuéntanos cómo fue la atención.")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    modal.addComponents(
      new ActionRowBuilder().addComponents(stars),
      new ActionRowBuilder().addComponents(review)
    );

    return interaction.showModal(modal);
  }
}

async function handleTicketModal(interaction) {
  if (!interaction.customId.startsWith("ticket_")) return;

  if (interaction.customId.startsWith("ticket_add_modal_")) {
    const userId = interaction.fields.getTextInputValue("user_id");

    let member;

    try {
      member = await interaction.guild.members.fetch(userId);
    } catch {
      return interaction.reply({
        content: "❌ No encontré a ese usuario en el servidor.",
        ephemeral: true
      });
    }

    await interaction.channel.permissionOverwrites.create(member.id, {
      ViewChannel: true,
      SendMessages: true,
      ReadMessageHistory: true,
      AttachFiles: true
    });

    return interaction.reply({
      content: `✅ ${member} ha sido añadido al ticket.`,
      ephemeral: false
    });
  }

  if (interaction.customId.startsWith("ticket_rating_")) {
    const ticketId = interaction.channel.id;
    const ticket = database.getTicket(ticketId);

    if (!ticket) {
      return interaction.reply({
        content: "❌ No se encontró la información del ticket.",
        ephemeral: true
      });
    }

    const rating = Number(
      interaction.fields.getTextInputValue("rating")
    );

    const review = interaction.fields.getTextInputValue("review");

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return interaction.reply({
        content: "❌ La calificación debe ser un número del 1 al 5.",
        ephemeral: true
      });
    }

    database.saveRating(ticketId, {
      userId: ticket.userId,
      rating,
      review
    });

    database.updateTicket(ticketId, {
      rating,
      review,
      status: "closed"
    });

    await interaction.reply({
      content: "⭐ Calificación recibida. Cerrando el ticket...",
      ephemeral: false
    });

    await closeTicket(interaction.channel, ticket);
  }
}

async function closeTicket(channel, ticket) {
  const rating = database.getRating(channel.id);

  const transcriptPath = await transcripts.createTranscript(channel, {
    ...ticket,
    rating: rating?.rating,
    review: rating?.review
  });

  database.saveClosure(channel.id, {
    userId: ticket.userId,
    username: ticket.username,
    type: ticket.type,
    claimedBy: ticket.claimedBy,
    rating: rating?.rating || null,
    review: rating?.review || null,
    transcript: transcriptPath
  });

  const user = await channel.client.users.fetch(ticket.userId).catch(() => null);

  if (user) {
    await user.send({
      content: "📜 Tu ticket ha sido cerrado. Aquí tienes el transcript.",
      files: [transcriptPath]
    }).catch(() => {});
  }

  const logsChannel = await channel.client.channels
    .fetch(config.channels.logs)
    .catch(() => null);

  if (logsChannel) {
    await logsChannel.send({
      content: `📜 Transcript del ticket **${channel.name}**`,
      files: [transcriptPath]
    }).catch(() => {});
  }

  const reviewChannel = await channel.client.channels
    .fetch(config.channels.ticketReviews)
    .catch(() => null);

  if (reviewChannel) {
    const embed = new EmbedBuilder()
      .setTitle("📋 Ticket cerrado")
      .setDescription(
        [
          `👤 **Usuario:** <@${ticket.userId}>`,
          `🎫 **Tipo:** ${ticket.type}`,
          `🛠️ **Staff:** ${
            ticket.claimedBy ? `<@${ticket.claimedBy}>` : "No reclamado"
          }`,
          `⭐ **Calificación:** ${rating?.rating || "Sin calificación"}/5`,
          `📝 **Reseña:** ${rating?.review || "Sin reseña"}`,
          `🕒 **Fecha:** <t:${Math.floor(Date.now() / 1000)}:F>`
        ].join("\n")
      );

    await reviewChannel.send({ embeds: [embed] }).catch(() => {});
  }

  await channel.delete("Ticket cerrado").catch(() => {});
}

module.exports = {
  setupTicketPanel,
  createTicket,
  handleTicketSelect,
  handleTicketButton,
  handleTicketModal,
  closeTicket,
  ticketButtons
};
