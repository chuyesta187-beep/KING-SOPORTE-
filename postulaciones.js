const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

const config = require("./config");

const applications = new Map();

const questions = {
  Staff: [
    "¿Cuál es tu nombre o cómo te gustaría que te llamemos?",
    "¿Cuántos años tienes?",
    "¿Cuánto tiempo llevas en el servidor?",
    "¿Has tenido experiencia como Staff anteriormente?",
    "¿Qué funciones de Staff conoces?",
    "¿Por qué quieres formar parte del Staff?",
    "¿Qué cualidades crees que tienes para este puesto?",
    "¿Cuánto tiempo puedes dedicar al servidor?",
    "¿Cómo actuarías ante una discusión entre usuarios?",
    "¿Qué harías si un usuario rompe las reglas?",
    "¿Qué harías si un amigo tuyo rompe las reglas?",
    "¿Cómo actuarías ante una situación que no sabes resolver?",
    "¿Sabes trabajar en equipo?",
    "¿Cómo recibirías una corrección de un superior?",
    "¿Qué aportarías al equipo Staff?",
    "¿Por qué deberíamos elegirte?",
    "¿Hay algo más que quieras añadir?"
  ],

  Periodista: [
    "¿Cuál es tu nombre o cómo te gustaría que te llamemos?",
    "¿Cuántos años tienes?",
    "¿Cuánto tiempo llevas en el servidor?",
    "¿Has creado noticias o contenido anteriormente?",
    "¿Por qué quieres ser Periodista?",
    "¿Qué tipo de noticias te gustaría publicar?",
    "¿Cómo comprobarías que una noticia es verdadera?",
    "¿Cómo organizarías una noticia?",
    "¿Cómo escribirías un título atractivo?",
    "¿Qué harías si recibes información dudosa?",
    "¿Sabes trabajar en equipo?",
    "¿Qué herramientas sabes utilizar para crear contenido?",
    "¿Con qué frecuencia podrías publicar?",
    "¿Cómo reaccionarías ante una corrección?",
    "¿Qué aportarías al equipo de Periodistas?",
    "¿Por qué deberíamos elegirte?",
    "¿Hay algo más que quieras añadir?"
  ],

  Economía: [
    "¿Cuál es tu nombre o cómo te gustaría que te llamemos?",
    "¿Cuántos años tienes?",
    "¿Cuánto tiempo llevas en el servidor?",
    "¿Has trabajado anteriormente con sistemas económicos?",
    "¿Por qué quieres formar parte de Economía?",
    "¿Qué entiendes por una economía equilibrada?",
    "¿Cómo evitarías abusos dentro del sistema económico?",
    "¿Cómo organizarías los recursos?",
    "¿Cómo detectarías una actividad económica sospechosa?",
    "¿Qué harías si encuentras un error económico?",
    "¿Sabes trabajar en equipo?",
    "¿Cómo actuarías ante una decisión con la que no estás de acuerdo?",
    "¿Cuánto tiempo podrías dedicar al área?",
    "¿Qué ideas aportarías para mejorar la economía?",
    "¿Cómo mantendrías organizada la información?",
    "¿Por qué deberíamos elegirte?",
    "¿Hay algo más que quieras añadir?"
  ]
};

async function startApplication(user, type) {
  const selectedQuestions = questions[type];

  if (!selectedQuestions) {
    throw new Error("Tipo de postulación inválido.");
  }

  applications.set(user.id, {
    userId: user.id,
    type,
    questionIndex: 0,
    answers: []
  });

  await user.send(
    `👑 **KING SUPPORT — POSTULACIÓN ${type.toUpperCase()}**\n\n` +
    `Tu formulario ha comenzado.\n` +
    `Responde cada pregunta con una sola respuesta.\n\n` +
    `📝 **Pregunta 1/${selectedQuestions.length}:**\n` +
    selectedQuestions[0]
  );
}

async function handleApplicationMessage(message) {
  if (message.author.bot) return;

  const application = applications.get(message.author.id);

  if (!application) return;

  const selectedQuestions = questions[application.type];

  application.answers.push(message.content);
  application.questionIndex++;

  if (application.questionIndex >= selectedQuestions.length) {
    await finishApplication(message.author);
    return;
  }

  const number = application.questionIndex + 1;

  await message.author.send(
    `📝 **Pregunta ${number}/${selectedQuestions.length}:**\n` +
    selectedQuestions[application.questionIndex]
  );
}

async function finishApplication(user) {
  const application = applications.get(user.id);

  if (!application) return;

  const embed = new EmbedBuilder()
    .setTitle(`👑 Postulación — ${application.type}`)
    .setDescription(
      `👤 **Usuario:** ${user}\n` +
      `📌 **Tipo:** ${application.type}\n\n` +
      `**Respuestas:**\n\n` +
      application.answers
        .map(
          (answer, index) =>
            `**${index + 1}.** ${answer}`
        )
        .join("\n\n")
    )
    .setTimestamp();

  const buttons = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`application_accept_${user.id}`)
      .setLabel("Aceptar")
      .setEmoji("✅")
      .setStyle(ButtonStyle.Success),

    new ButtonBuilder()
      .setCustomId(`application_reject_${user.id}`)
      .setLabel("Rechazar")
      .setEmoji("❌")
      .setStyle(ButtonStyle.Danger)
  );

  // El canal exacto de cada tipo se configurará en config.js
  const channelId = config.applicationChannels?.[application.type];

  if (channelId) {
    const channel = await user.client.channels.fetch(channelId);

    await channel.send({
      embeds: [embed],
      components: [buttons]
    });
  }

  await user.send(
    `✅ **Tu postulación de ${application.type} ha sido enviada correctamente.**\n\n` +
    `Ahora será revisada por el equipo correspondiente.`
  );

  applications.delete(user.id);
}

async function handleApplicationDecision(interaction) {
  const [action, type, userId] = interaction.customId.split("_");

  const member = interaction.member;

  if (!member.roles.cache.has(config.roles.postulationReview)) {
    return interaction.reply({
      content: "❌ No tienes permiso para revisar postulaciones.",
      ephemeral: true
    });
  }

  const user = await interaction.client.users.fetch(userId);

  if (action === "application") {
    return;
  }

  if (type === "accept") {
    await user.send(
      "✅ **Tu postulación ha sido aceptada.**\n\n" +
      "¡Bienvenido al equipo de King the Land!"
    );
  }

  if (type === "reject") {
    await user.send(
      "❌ **Tu postulación ha sido rechazada.**\n\n" +
      "Gracias por participar en el proceso."
    );
  }

  await interaction.reply({
    content:
      type === "accept"
        ? "✅ Postulación aceptada."
        : "❌ Postulación rechazada.",
    ephemeral: true
  });
}

module.exports = {
  startApplication,
  handleApplicationMessage,
  finishApplication,
  handleApplicationDecision,
  questions
};
