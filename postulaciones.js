const {
  ChannelType,
  PermissionFlagsBits,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder
} = require("discord.js");

const config = require("./config");
const database = require("./database");

const applications = new Map();
const applicationChannels = new Map();

const APPLICATION_TYPES = {
  staff: {
    name: "Staff",
    emoji: "👮",
    channelName: "👮・formularios-staff"
  },
  journalist: {
    name: "Periodista",
    emoji: "📰",
    channelName: "📰・formularios-periodista"
  },
  economy: {
    name: "Economía",
    emoji: "💰",
    channelName: "💰・formularios-economia"
  }
};

const QUESTIONS = {
  staff: [
    "¿Cuál es tu nombre o apodo?",
    "¿Cuántos años tienes?",
    "¿Cuál es tu zona horaria?",
    "¿Cuánto tiempo llevas en King the Land?",
    "¿Has pertenecido anteriormente a un equipo Staff?",
    "¿Qué experiencia tienes como Staff?",
    "¿Qué funciones de moderación conoces?",
    "¿Cómo actuarías ante una discusión entre dos miembros?",
    "¿Qué harías ante una infracción de las normas?",
    "¿Cómo manejarías una situación en la que un amigo incumple las normas?",
    "¿Qué harías si un usuario insiste en provocar al Staff?",
    "¿Cómo actuarías ante una denuncia falsa?",
    "¿Qué significa para ti trabajar en equipo?",
    "¿Cuánto tiempo podrías dedicar al servidor?",
    "¿Por qué quieres formar parte del Staff?",
    "¿Qué aportarías al equipo Staff?",
    "¿Por qué deberíamos seleccionarte?"
  ],

  journalist: [
    "¿Cuál es tu nombre o apodo?",
    "¿Cuántos años tienes?",
    "¿Cuál es tu zona horaria?",
    "¿Cuánto tiempo llevas en King the Land?",
    "¿Tienes experiencia redactando noticias?",
    "¿Has trabajado anteriormente como periodista o reportero?",
    "¿Qué tipo de noticias te gustaría publicar?",
    "¿Cómo comprobarías que una noticia es verdadera?",
    "¿Qué harías si recibes información que no puedes verificar?",
    "¿Cómo evitarías difundir rumores?",
    "¿Cómo organizarías una noticia para que sea fácil de entender?",
    "¿Qué importancia tiene la neutralidad al informar?",
    "¿Cómo reaccionarías ante una crítica sobre una publicación?",
    "¿Cuánto tiempo podrías dedicar a crear contenido?",
    "¿Qué aportarías al área de Periodismo?",
    "¿Qué tipo de contenido te gustaría cubrir en el servidor?",
    "¿Por qué deberíamos seleccionarte?"
  ],

  economy: [
    "¿Cuál es tu nombre o apodo?",
    "¿Cuántos años tienes?",
    "¿Cuál es tu zona horaria?",
    "¿Cuánto tiempo llevas en King the Land?",
    "¿Qué experiencia tienes con sistemas económicos?",
    "¿Has administrado anteriormente una economía de servidor?",
    "¿Cómo controlarías una economía para evitar abusos?",
    "¿Cómo detectarías una actividad económica sospechosa?",
    "¿Qué harías ante un error en una transacción?",
    "¿Cómo organizarías los registros económicos?",
    "¿Cómo equilibrarías ingresos y gastos dentro del sistema?",
    "¿Qué medidas tomarías para evitar duplicaciones o exploits?",
    "¿Cómo trabajarías junto al resto del Staff?",
    "¿Cuánto tiempo podrías dedicar al área?",
    "¿Qué ideas tienes para mejorar la economía?",
    "¿Qué aportarías al equipo de Economía?",
    "¿Por qué deberíamos seleccionarte?"
  ]
};

function createPostulationPanelComponents() {
  const menu = new StringSelectMenuBuilder()
    .setCustomId("postulation_type_select")
    .setPlaceholder("Selecciona el tipo de postulación")
    .addOptions(
      Object.entries(APPLICATION_TYPES).map(([value, type]) => ({
        label: type.name,
        description: `Postulación para ${type.name}`,
        value,
        emoji: type.emoji
      }))
    );

  return [
    new ActionRowBuilder().addComponents(menu)
  ];
}

async function setupPostulationPanel(client) {
  const channel = await client.channels
    .fetch(config.channels.postulationPanel)
    .catch(() => null);

  if (!channel || !channel.isTextBased()) {
    console.error("❌ No se encontró el canal de postulaciones.");
    return;
  }

  const messages = await channel.messages.fetch({ limit: 50 });

  const oldPanel = messages.find(
    message =>
      message.author.id === client.user.id &&
      message.embeds.some(embed =>
        embed.title?.includes("Postulaciones")
      )
  );

  const embed = new EmbedBuilder()
    .setTitle("👑 King the Land — Postulaciones")
    .setDescription(
      [
        "Bienvenido al sistema oficial de postulaciones.",
        "",
        "Selecciona el área a la que deseas postularte:",
        "",
        "👮 **Staff**",
        "Forma parte del equipo encargado de la moderación y atención del servidor.",
        "",
        "📰 **Periodista**",
        "Participa en la creación y publicación de noticias y contenido.",
        "",
        "💰 **Economía**",
        "Ayuda a administrar y desarrollar el sistema económico.",
        "",
        "📩 El formulario se realizará por MD.",
        "✨ Responde todas las preguntas con sinceridad."
      ].join("\n")
    );

  if (oldPanel) {
    await oldPanel.edit({
      embeds: [embed],
      components: createPostulationPanelComponents()
    });
  } else {
    await channel.send({
      embeds: [embed],
      components: createPostulationPanelComponents()
    });
  }

  console.log("✅ Panel de postulaciones configurado.");
}

async function setupApplicationChannels(client) {
  const guild = await client.guilds.fetch(config.guildId);

  for (const [type, data] of Object.entries(APPLICATION_TYPES)) {
    let channel = guild.channels.cache.find(
      c => c.name === data.channelName
    );

    if (!channel) {
      channel = await guild.channels.create({
        name: data.channelName,
        type: ChannelType.GuildText,
        permissionOverwrites: [
          {
            id: guild.roles.everyone.id,
            deny: [PermissionFlagsBits.ViewChannel]
          },
          {
            id: config.roles.postulationReview,
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.SendMessages,
              PermissionFlagsBits.ReadMessageHistory
            ]
          }
        ]
      });

      await channel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle(`${data.emoji} Formularios — ${data.name}`)
            .setDescription(
              `Aquí se enviarán automáticamente las postulaciones de **${data.name}**.`
            )
        ]
      });
    }

    applicationChannels.set(type, channel.id);
  }

  console.log("✅ Canales de postulaciones configurados.");
}

async function startApplication(interaction, type) {
  const applicationType = APPLICATION_TYPES[type];

  if (!applicationType) {
    return interaction.reply({
      content: "❌ Tipo de postulación inválido.",
      ephemeral: true
    });
  }

  if (applications.has(interaction.user.id)) {
    return interaction.reply({
      content: "❌ Ya tienes una postulación en proceso.",
      ephemeral: true
    });
  }

  const questions = QUESTIONS[type];

  applications.set(interaction.user.id, {
    id: `${interaction.user.id}-${Date.now()}`,
    userId: interaction.user.id,
    username: interaction.user.tag,
    type,
    questionIndex: 0,
    questions,
    answers: [],
    status: "in_progress",
    startedAt: new Date().toISOString()
  });

  await interaction.reply({
    content:
      `📩 Te enviaré el formulario de **${applicationType.name}** por MD. ` +
      "Revisa tus mensajes privados.",
    ephemeral: true
  });

  const user = interaction.user;

  try {
    await user.send(
      `👑 **Postulación — ${applicationType.name}**\n\n` +
      `Responderás **${questions.length} preguntas**, una por una.\n\n` +
      `**Pregunta 1/${questions.length}**\n${questions[0]}`
    );
  } catch {
    applications.delete(interaction.user.id);

    await interaction.followUp({
      content:
        "❌ No pude enviarte MD. Activa los mensajes privados del servidor e inténtalo nuevamente.",
      ephemeral: true
    });
  }
}

async function handleApplicationMessage(message) {
  if (message.author.bot || message.guild) return;

  const application = applications.get(message.author.id);

  if (!application) return;

  const answer = message.content?.trim();

  if (!answer) {
    await message.reply("❌ Debes escribir una respuesta.");
    return;
  }

  application.answers.push({
    question: application.questions[application.questionIndex],
    answer
  });

  application.questionIndex++;

  if (application.questionIndex >= application.questions.length) {
    await finishApplication(message, application);
    return;
  }

  const number = application.questionIndex + 1;
  const total = application.questions.length;

  await message.reply(
    `**Pregunta ${number}/${total}**\n${application.questions[application.questionIndex]}`
  );
}

async function finishApplication(message, application) {
  application.status = "pending";
  application.finishedAt = new Date().toISOString();

  database.createApplication(application.id, application);

  applications.delete(message.author.id);

  const channelId = applicationChannels.get(application.type);

  const channel = channelId
    ? await message.client.channels.fetch(channelId).catch(() => null)
    : null;

  if (!channel) {
    await message.reply(
      "⚠️ Tu postulación fue guardada, pero no se encontró el canal de revisión."
    );
    return;
  }

  const type = APPLICATION_TYPES[application.type];

  const embed = new EmbedBuilder()
    .setTitle(
      `${type.emoji} Nueva postulación — ${type.name}`
    )
    .setDescription(
      [
        `👤 **Usuario:** <@${application.userId}>`,
        `🆔 **ID:** ${application.userId}`,
        `📅 **Enviada:** <t:${Math.floor(Date.now() / 1000)}:F>`,
        "",
        ...application.answers.map(
          (item, index) =>
            `**${index + 1}. ${item.question}**\n${item.answer}`
        )
      ].join("\n\n")
    );

  const buttons = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`application_accept_${application.userId}`)
      .setLabel("Aceptar")
      .setEmoji("✅")
      .setStyle(ButtonStyle.Success),

    new ButtonBuilder()
      .setCustomId(`application_reject_${application.userId}`)
      .setLabel("Rechazar")
      .setEmoji("❌")
      .setStyle(ButtonStyle.Danger)
  );

  await channel.send({
    embeds: [embed],
    components: [buttons]
  });

  await message.reply(
    "✅ **Tu postulación fue enviada correctamente.**\n" +
    "El equipo encargado la revisará y recibirás el resultado por MD."
  );
}

async function handleApplicationDecision(interaction) {
  if (!interaction.customId.startsWith("application_")) return;

  const member = interaction.member;

  if (!member.roles.cache.has(config.roles.postulationReview)) {
    return interaction.reply({
      content: "❌ No tienes permiso para revisar postulaciones.",
      ephemeral: true
    });
  }

  const [, action, userId] = interaction.customId.split("_");

  if (!["accept", "reject"].includes(action) || !userId) {
    return interaction.reply({
      content: "❌ Acción de postulación inválida.",
      ephemeral: true
    });
  }

  const application = Object.values(database.load().applications)
    .find(app => app.userId === userId);

  if (!application) {
    return interaction.reply({
      content: "❌ No se encontró la postulación.",
      ephemeral: true
    });
  }

  const newStatus = action === "accept"
    ? "accepted"
    : "rejected";

  database.updateApplication(application.id, {
    status: newStatus,
    reviewedBy: interaction.user.id,
    reviewedAt: new Date().toISOString()
  });

  const user = await interaction.client.users
    .fetch(userId)
    .catch(() => null);

  if (user) {
    await user.send(
      action === "accept"
        ? "🎉 **¡Tu postulación ha sido aceptada!**\n\nBienvenido/a al equipo de King the Land."
        : "❌ **Tu postulación ha sido rechazada.**\n\nGracias por participar en el proceso."
    ).catch(() => {});
  }

  const disabledRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`application_accept_${userId}`)
      .setLabel("Aceptar")
      .setEmoji("✅")
      .setStyle(ButtonStyle.Success)
      .setDisabled(true),

    new ButtonBuilder()
      .setCustomId(`application_reject_${userId}`)
      .setLabel("Rechazar")
      .setEmoji("❌")
      .setStyle(ButtonStyle.Danger)
      .setDisabled(true)
  );

  await interaction.message.edit({
    components: [disabledRow]
  });

  await interaction.reply({
    content:
      action === "accept"
        ? "✅ Postulación aceptada."
        : "❌ Postulación rechazada.",
    ephemeral: true
  });
}

async function handlePostulationSelect(interaction) {
  if (interaction.customId !== "postulation_type_select") return;

  await startApplication(
    interaction,
    interaction.values[0]
  );
}

module.exports = {
  setupPostulationPanel,
  setupApplicationChannels,
  startApplication,
  handleApplicationMessage,
  handleApplicationDecision,
  handlePostulationSelect,
  applications,
  applicationChannels,
  QUESTIONS
};
