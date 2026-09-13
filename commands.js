const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder
} = require("discord.js");

const config = require("./config");
const database = require("./database");

const commands = [
  // ═══════════════════════════════════════
  // 🎫 TICKETS
  // ═══════════════════════════════════════

  new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Crear un ticket")
    .addStringOption(option =>
      option
        .setName("tipo")
        .setDescription("Tipo de ticket")
        .setRequired(true)
        .addChoices(
          { name: "Alianza", value: "alliance" },
          { name: "Soporte", value: "support" },
          { name: "Claim", value: "claim" },
          { name: "Staff", value: "staff" }
        )
    ),

  new SlashCommandBuilder()
    .setName("ticket-add")
    .setDescription("Añadir un usuario al ticket")
    .addUserOption(option =>
      option
        .setName("usuario")
        .setDescription("Usuario que quieres añadir")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("ticket-remove")
    .setDescription("Quitar un usuario del ticket")
    .addUserOption(option =>
      option
        .setName("usuario")
        .setDescription("Usuario que quieres quitar")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("ticket-claim")
    .setDescription("Reclamar el ticket"),

  new SlashCommandBuilder()
    .setName("ticket-release")
    .setDescription("Liberar el ticket"),

  new SlashCommandBuilder()
    .setName("ticket-close")
    .setDescription("Cerrar el ticket"),

  new SlashCommandBuilder()
    .setName("ticket-info")
    .setDescription("Ver información del ticket"),

  new SlashCommandBuilder()
    .setName("ticket-transcript")
    .setDescription("Crear el transcript del ticket"),

  // ═══════════════════════════════════════
  // 👑 POSTULACIONES
  // ═══════════════════════════════════════

  new SlashCommandBuilder()
    .setName("postulacion")
    .setDescription("Iniciar una postulación")
    .addStringOption(option =>
      option
        .setName("tipo")
        .setDescription("Área de la postulación")
        .setRequired(true)
        .addChoices(
          { name: "Staff", value: "staff" },
          { name: "Periodista", value: "journalist" },
          { name: "Economía", value: "economy" }
        )
    ),

  new SlashCommandBuilder()
    .setName("postulacion-info")
    .setDescription("Ver información de una postulación")
    .addUserOption(option =>
      option
        .setName("usuario")
        .setDescription("Usuario")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("postulaciones")
    .setDescription("Ver estadísticas de postulaciones"),

  new SlashCommandBuilder()
    .setName("aceptar")
    .setDescription("Aceptar una postulación")
    .addUserOption(option =>
      option
        .setName("usuario")
        .setDescription("Usuario")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("rechazar")
    .setDescription("Rechazar una postulación")
    .addUserOption(option =>
      option
        .setName("usuario")
        .setDescription("Usuario")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("cancelar-postulacion")
    .setDescription("Cancelar una postulación"),

  // ═══════════════════════════════════════
  // 🛡️ MODERACIÓN
  // ═══════════════════════════════════════

  new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Advertir a un usuario")
    .addUserOption(option =>
      option
        .setName("usuario")
        .setDescription("Usuario")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("razon")
        .setDescription("Razón")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  new SlashCommandBuilder()
    .setName("warnings")
    .setDescription("Ver advertencias")
    .addUserOption(option =>
      option
        .setName("usuario")
        .setDescription("Usuario")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Eliminar mensajes")
    .addIntegerOption(option =>
      option
        .setName("cantidad")
        .setDescription("Cantidad de mensajes")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Aplicar timeout")
    .addUserOption(option =>
      option
        .setName("usuario")
        .setDescription("Usuario")
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option
        .setName("minutos")
        .setDescription("Duración en minutos")
        .setRequired(true)
        .setMinValue(1)
    )
    .addStringOption(option =>
      option
        .setName("razon")
        .setDescription("Razón")
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  new SlashCommandBuilder()
    .setName("untimeout")
    .setDescription("Quitar timeout")
    .addUserOption(option =>
      option
        .setName("usuario")
        .setDescription("Usuario")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Expulsar usuario")
    .addUserOption(option =>
      option
        .setName("usuario")
        .setDescription("Usuario")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("razon")
        .setDescription("Razón")
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Banear usuario")
    .addUserOption(option =>
      option
        .setName("usuario")
        .setDescription("Usuario")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("razon")
        .setDescription("Razón")
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Quitar un ban")
    .addStringOption(option =>
      option
        .setName("usuario")
        .setDescription("ID del usuario")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  new SlashCommandBuilder()
    .setName("lock")
    .setDescription("Bloquear el canal")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  new SlashCommandBuilder()
    .setName("unlock")
    .setDescription("Desbloquear el canal")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  // ═══════════════════════════════════════
  // ⚙️ CONFIGURACIÓN
  // ═══════════════════════════════════════

  new SlashCommandBuilder()
    .setName("config")
    .setDescription("Ver configuración del bot"),

  new SlashCommandBuilder()
    .setName("config-tickets")
    .setDescription("Configurar tickets")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName("config-postulaciones")
    .setDescription("Configurar postulaciones")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName("config-logs")
    .setDescription("Configurar logs")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName("config-staff")
    .setDescription("Configurar Staff")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName("config-roles")
    .setDescription("Ver roles configurados")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName("config-canales")
    .setDescription("Ver canales configurados")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName("config-reset")
    .setDescription("Restablecer configuración")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  // ═══════════════════════════════════════
  // 📜 LOGS
  // ═══════════════════════════════════════

  new SlashCommandBuilder()
    .setName("logs")
    .setDescription("Ver configuración de logs"),

  new SlashCommandBuilder()
    .setName("log-user")
    .setDescription("Ver actividad de un usuario")
    .addUserOption(option =>
      option
        .setName("usuario")
        .setDescription("Usuario")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("log-ticket")
    .setDescription("Ver registro de un ticket")
    .addStringOption(option =>
      option
        .setName("canal")
        .setDescription("ID del canal")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("log-postulacion")
    .setDescription("Ver registro de una postulación")
    .addUserOption(option =>
      option
        .setName("usuario")
        .setDescription("Usuario")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("audit")
    .setDescription("Ver acciones recientes del servidor"),

  // ═══════════════════════════════════════
  // 🤖 BOT
  // ═══════════════════════════════════════

  new SlashCommandBuilder()
    .setName("status")
    .setDescription("Ver estado del bot"),

  new SlashCommandBuilder()
    .setName("reload")
    .setDescription("Recargar configuración")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName("maintenance")
    .setDescription("Activar o desactivar mantenimiento")
    .addBooleanOption(option =>
      option
        .setName("estado")
        .setDescription("Estado del mantenimiento")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName("stats")
    .setDescription("Ver estadísticas del bot"),

  // ═══════════════════════════════════════
  // 🔧 UTILIDAD
  // ═══════════════════════════════════════

  new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Ver avatar")
    .addUserOption(option =>
      option.setName("usuario").setDescription("Usuario")
    ),

  new SlashCommandBuilder()
    .setName("banner")
    .setDescription("Ver banner")
    .addUserOption(option =>
      option.setName("usuario").setDescription("Usuario")
    ),

  new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Información de usuario")
    .addUserOption(option =>
      option.setName("usuario").setDescription("Usuario")
    ),

  new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("Información del servidor"),

  new SlashCommandBuilder()
    .setName("servericon")
    .setDescription("Ver icono del servidor"),

  new SlashCommandBuilder()
    .setName("membercount")
    .setDescription("Ver cantidad de miembros"),

  new SlashCommandBuilder()
    .setName("roles")
    .setDescription("Ver roles del servidor"),

  new SlashCommandBuilder()
    .setName("roleinfo")
    .setDescription("Información de un rol")
    .addRoleOption(option =>
      option
        .setName("rol")
        .setDescription("Rol")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("canales")
    .setDescription("Ver canales"),

  new SlashCommandBuilder()
    .setName("channelinfo")
    .setDescription("Información del canal"),

  new SlashCommandBuilder()
    .setName("emoji")
    .setDescription("Ver información de un emoji")
    .addStringOption(option =>
      option
        .setName("emoji")
        .setDescription("Emoji")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("listemojis")
    .setDescription("Listar emojis"),

  new SlashCommandBuilder()
    .setName("permissions")
    .setDescription("Ver permisos de un usuario")
    .addUserOption(option =>
      option
        .setName("usuario")
        .setDescription("Usuario")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("botinfo")
    .setDescription("Información del bot"),

  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Ver latencia"),

  new SlashCommandBuilder()
    .setName("uptime")
    .setDescription("Ver tiempo activo"),

  new SlashCommandBuilder()
    .setName("invite")
    .setDescription("Crear invitación"),

  new SlashCommandBuilder()
    .setName("help")
    .setDescription("Ver todos los comandos"),

  new SlashCommandBuilder()
    .setName("embed")
    .setDescription("Crear un embed")
    .addStringOption(option =>
      option
        .setName("titulo")
        .setDescription("Título")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("descripcion")
        .setDescription("Descripción")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("say")
    .setDescription("Enviar un mensaje")
    .addStringOption(option =>
      option
        .setName("mensaje")
        .setDescription("Mensaje")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("poll")
    .setDescription("Crear una encuesta")
    .addStringOption(option =>
      option
        .setName("pregunta")
        .setDescription("Pregunta")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("reminder")
    .setDescription("Crear un recordatorio")
    .addIntegerOption(option =>
      option
        .setName("minutos")
        .setDescription("Minutos")
        .setRequired(true)
        .setMinValue(1)
    )
    .addStringOption(option =>
      option
        .setName("mensaje")
        .setDescription("Mensaje")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("afk")
    .setDescription("Establecer estado AFK")
    .addStringOption(option =>
      option
        .setName("razon")
        .setDescription("Razón")
    ),

  new SlashCommandBuilder()
    .setName("firstmessage")
    .setDescription("Ver el primer mensaje del canal"),

  new SlashCommandBuilder()
    .setName("timestamp")
    .setDescription("Generar timestamp")
    .addIntegerOption(option =>
      option
        .setName("unix")
        .setDescription("Timestamp Unix")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("snowflake")
    .setDescription("Información de un ID")
    .addStringOption(option =>
      option
        .setName("id")
        .setDescription("ID de Discord")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("color")
    .setDescription("Mostrar un color")
    .addStringOption(option =>
      option
        .setName("hex")
        .setDescription("Color hexadecimal")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("choose")
    .setDescription("Elegir entre opciones")
    .addStringOption(option =>
      option
        .setName("opciones")
        .setDescription("Opciones separadas por comas")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("8ball")
    .setDescription("Pregunta a la bola 8")
    .addStringOption(option =>
      option
        .setName("pregunta")
        .setDescription("Pregunta")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("calculate")
    .setDescription("Calcular una operación")
    .addStringOption(option =>
      option
        .setName("operacion")
        .setDescription("Operación matemática")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("translate")
    .setDescription("Traducir texto")
    .addStringOption(option =>
      option
        .setName("texto")
        .setDescription("Texto")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("idioma")
        .setDescription("Idioma destino")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("weather")
    .setDescription("Consultar clima")
    .addStringOption(option =>
      option
        .setName("ciudad")
        .setDescription("Ciudad")
        .setRequired(true)
    )
];

function getCommands() {
  return commands.map(command => command.toJSON());
}

async function handleCommand(interaction, handlers = {}) {
  const command = interaction.commandName;

  // 🎫 TICKETS
  if (command === "ticket") {
    const type = interaction.options.getString("tipo");

    if (handlers.tickets?.createTicket) {
      return handlers.tickets.createTicket(interaction, type);
    }

    return interaction.reply({
      content: "🎫 Sistema de tickets cargando...",
      ephemeral: true
    });
  }

  if (
    [
      "ticket-add",
      "ticket-remove",
      "ticket-claim",
      "ticket-release",
      "ticket-close",
      "ticket-info",
      "ticket-transcript"
    ].includes(command)
  ) {
    return interaction.reply({
      content: `🎫 El comando \`/${command}\` está disponible en el sistema de tickets.`,
      ephemeral: true
    });
  }

  // 👑 POSTULACIONES
  if (command === "postulacion") {
    const type = interaction.options.getString("tipo");

    if (handlers.postulaciones?.startApplication) {
      return handlers.postulaciones.startApplication(
        interaction,
        type
      );
    }

    return interaction.reply({
      content: "👑 Sistema de postulaciones cargando...",
      ephemeral: true
    });
  }

  if (
    [
      "postulacion-info",
      "postulaciones",
      "aceptar",
      "rechazar",
      "cancelar-postulacion"
    ].includes(command)
  ) {
    return interaction.reply({
      content: `👑 El comando \`/${command}\` está disponible.`,
      ephemeral: true
    });
  }

  // 🛡️ MODERACIÓN
  if (command === "warn") {
    const user = interaction.options.getUser("usuario");
    const reason = interaction.options.getString("razon");

    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("⚠️ Advertencia")
          .setDescription(
            `${user} ha recibido una advertencia.\n\n**Razón:** ${reason}`
          )
      ]
    });
  }

  if (command === "clear") {
    const amount = interaction.options.getInteger("cantidad");

    await interaction.channel.bulkDelete(amount, true);

    return interaction.reply({
      content: `🧹 Se eliminaron ${amount} mensajes.`,
      ephemeral: true
    });
  }

  if (command === "timeout") {
    const user = interaction.options.getUser("usuario");
    const minutes = interaction.options.getInteger("minutos");
    const reason =
      interaction.options.getString("razon") || "Sin razón";

    const member = await interaction.guild.members
      .fetch(user.id)
      .catch(() => null);

    if (!member) {
      return interaction.reply({
        content: "❌ Usuario no encontrado.",
        ephemeral: true
      });
    }

    await member.timeout(
      minutes * 60 * 1000,
      reason
    );

    return interaction.reply(
      `🔇 ${user} recibió timeout durante **${minutes} minutos**.`
    );
  }

  if (command === "untimeout") {
    const user = interaction.options.getUser("usuario");

    const member = await interaction.guild.members
      .fetch(user.id)
      .catch(() => null);

    if (!member) {
      return interaction.reply({
        content: "❌ Usuario no encontrado.",
        ephemeral: true
      });
    }

    await member.timeout(null);

    return interaction.reply(
      `🔊 Se retiró el timeout a ${user}.`
    );
  }

  if (command === "kick") {
    const user = interaction.options.getUser("usuario");
    const reason =
      interaction.options.getString("razon") || "Sin razón";

    const member = await interaction.guild.members
      .fetch(user.id)
      .catch(() => null);

    if (!member) {
      return interaction.reply({
        content: "❌ Usuario no encontrado.",
        ephemeral: true
      });
    }

    await member.kick(reason);

    return interaction.reply(
      `👢 ${user.tag} fue expulsado.`
    );
  }

  if (command === "ban") {
    const user = interaction.options.getUser("usuario");
    const reason =
      interaction.options.getString("razon") || "Sin razón";

    await interaction.guild.members.ban(user.id, {
      reason
    });

    return interaction.reply(
      `🔨 ${user.tag} fue baneado.`
    );
  }

  if (command === "unban") {
    const userId = interaction.options.getString("usuario");

    await interaction.guild.bans.remove(userId);

    return interaction.reply(
      `🔓 Se retiró el ban a \`${userId}\`.`
    );
  }

  if (command === "lock" || command === "unlock") {
    const locked = command === "lock";

    await interaction.channel.permissionOverwrites.edit(
      interaction.guild.roles.everyone,
      {
        SendMessages: !locked
      }
    );

    return interaction.reply(
      locked
        ? "🔒 Canal bloqueado."
        : "🔓 Canal desbloqueado."
    );
  }

  // 🔧 UTILIDAD
  if (command === "ping") {
    return interaction.reply(
      `🏓 Pong! **${interaction.client.ws.ping}ms**`
    );
  }

  if (command === "uptime") {
    const seconds = Math.floor(
      interaction.client.uptime / 1000
    );

    return interaction.reply(
      `⏱️ Uptime: **${seconds}s**`
    );
  }

  if (command === "membercount") {
    return interaction.reply(
      `👥 Miembros: **${interaction.guild.memberCount}**`
    );
  }

  if (command === "serverinfo") {
    const guild = interaction.guild;

    const embed = new EmbedBuilder()
      .setTitle(`🏰 ${guild.name}`)
      .addFields(
        {
          name: "👥 Miembros",
          value: `${guild.memberCount}`,
          inline: true
        },
        {
          name: "📁 Canales",
          value: `${guild.channels.cache.size}`,
          inline: true
        },
        {
          name: "🎭 Roles",
          value: `${guild.roles.cache.size}`,
          inline: true
        }
      );

    return interaction.reply({
      embeds: [embed]
    });
  }

  if (command === "avatar") {
    const user =
      interaction.options.getUser("usuario") ||
      interaction.user;

    return interaction.reply({
      content: user.displayAvatarURL({
        size: 1024,
        extension: "png"
      })
    });
  }

  if (command === "botinfo") {
    return interaction.reply(
      `🤖 **KING SUPPORT**\n` +
      `📡 Ping: ${interaction.client.ws.ping}ms\n` +
      `🏠 Servidores: ${interaction.client.guilds.cache.size}`
    );
  }

  if (command === "status") {
    return interaction.reply(
      "🟢 **KING SUPPORT está funcionando correctamente.**"
    );
  }

  if (command === "help") {
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("👑 KING SUPPORT — Comandos")
          .setDescription(
            `Hay **${commands.length} comandos** registrados.\n\n` +
            "🎫 Tickets\n" +
            "👑 Postulaciones\n" +
            "🛡️ Moderación\n" +
            "⚙️ Configuración\n" +
            "📜 Logs\n" +
            "🤖 Bot\n" +
            "🔧 Utilidad"
          )
      ],
      ephemeral: true
    });
  }

  // 🧮 CALCULADORA
  if (command === "calculate") {
    const expression =
      interaction.options.getString("operacion");

    if (!/^[0-9+\-*/().\s]+$/.test(expression)) {
      return interaction.reply({
        content: "❌ Operación no válida.",
        ephemeral: true
      });
    }

    try {
      const result = Function(
        `"use strict"; return (${expression})`
      )();

      return interaction.reply(
        `🧮 **Resultado:** \`${result}\``
      );
    } catch {
      return interaction.reply({
        content: "❌ No pude calcular esa operación.",
        ephemeral: true
      });
    }
  }

  // 🎲 CHOOSE
  if (command === "choose") {
    const options = interaction.options
      .getString("opciones")
      .split(",")
      .map(x => x.trim())
      .filter(Boolean);

    if (!options.length) {
      return interaction.reply({
        content: "❌ Debes proporcionar opciones.",
        ephemeral: true
      });
    }

    const selected =
      options[Math.floor(Math.random() * options.length)];

    return interaction.reply(
      `🎯 Elegí: **${selected}**`
    );
  }

  // 🎱 8BALL
  if (command === "8ball") {
    const answers = [
      "Sí.",
      "No.",
      "Probablemente.",
      "No estoy seguro.",
      "Definitivamente sí.",
      "Definitivamente no."
    ];

    const answer =
      answers[Math.floor(Math.random() * answers.length)];

    return interaction.reply(
      `🎱 **Respuesta:** ${answer}`
    );
  }

  // 📊 STATS
  if (command === "stats") {
    const db = database.load();

    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("📊 Estadísticas — KING SUPPORT")
          .addFields(
            {
              name: "🎫 Tickets",
              value: `${Object.keys(db.tickets).length}`,
              inline: true
            },
            {
              name: "👑 Postulaciones",
              value: `${Object.keys(db.applications).length}`,
              inline: true
            },
            {
              name: "⭐ Calificaciones",
              value: `${Object.keys(db.ratings).length}`,
              inline: true
            }
          )
      ],
      ephemeral: true
    });
  }

  return interaction.reply({
    content: `❌ El comando \`/${command}\` todavía no tiene un módulo conectado.`,
    ephemeral: true
  });
}

module.exports = {
  commands,
  getCommands,
  handleCommand
};
