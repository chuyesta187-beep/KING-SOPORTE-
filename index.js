require("dotenv").config();

const express = require("express");
const {
  Client,
  GatewayIntentBits,
  Partials,
  REST,
  Routes,
  SlashCommandBuilder
} = require("discord.js");

const config = require("./config");
const events = require("./events");
const tickets = require("./tickets");
const mdTickets = require("./mdTickets");
const postulaciones = require("./postulaciones");
const commands = require("./commands");

// ═════════════════════════════════════
// EXPRESS — RAILWAY
// ═════════════════════════════════════

const app = express();

app.get("/", (req, res) => {
  res.status(200).send("👑 KING SUPPORT está online.");
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "online",
    bot: client.isReady(),
    name: "KING SUPPORT"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🌐 Servidor Express iniciado en el puerto ${PORT}`);
});

// ═════════════════════════════════════
// CLIENTE DISCORD
// ═════════════════════════════════════

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages
  ],

  partials: [
    Partials.Channel,
    Partials.Message,
    Partials.User
  ]
});

// ═════════════════════════════════════
// COMANDOS
// ═════════════════════════════════════

const slashCommands = [
  new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Muestra el avatar de un usuario")
    .addUserOption(o =>
      o.setName("usuario")
        .setDescription("Usuario")
        .setRequired(false)
    ),

  new SlashCommandBuilder()
    .setName("banner")
    .setDescription("Muestra el banner de un usuario")
    .addUserOption(o =>
      o.setName("usuario")
        .setDescription("Usuario")
        .setRequired(false)
    ),

  new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Muestra información de un usuario")
    .addUserOption(o =>
      o.setName("usuario")
        .setDescription("Usuario")
        .setRequired(false)
    ),

  new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("Muestra información del servidor"),

  new SlashCommandBuilder()
    .setName("servericon")
    .setDescription("Muestra el icono del servidor"),

  new SlashCommandBuilder()
    .setName("membercount")
    .setDescription("Muestra la cantidad de miembros"),

  new SlashCommandBuilder()
    .setName("roles")
    .setDescription("Muestra los roles"),

  new SlashCommandBuilder()
    .setName("roleinfo")
    .setDescription("Información de un rol")
    .addRoleOption(o =>
      o.setName("rol")
        .setDescription("Rol")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("canales")
    .setDescription("Muestra los canales"),

  new SlashCommandBuilder()
    .setName("channelinfo")
    .setDescription("Información de un canal")
    .addChannelOption(o =>
      o.setName("canal")
        .setDescription("Canal")
        .setRequired(false)
    ),

  new SlashCommandBuilder()
    .setName("emoji")
    .setDescription("Muestra un emoji")
    .addStringOption(o =>
      o.setName("emoji")
        .setDescription("Emoji")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("listemojis")
    .setDescription("Lista los emojis"),

  new SlashCommandBuilder()
    .setName("permissions")
    .setDescription("Muestra permisos de un usuario")
    .addUserOption(o =>
      o.setName("usuario")
        .setDescription("Usuario")
        .setRequired(false)
    ),

  new SlashCommandBuilder()
    .setName("botinfo")
    .setDescription("Información de KING SUPPORT"),

  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Muestra el ping"),

  new SlashCommandBuilder()
    .setName("uptime")
    .setDescription("Muestra el tiempo activo"),

  new SlashCommandBuilder()
    .setName("invite")
    .setDescription("Invitación del bot"),

  new SlashCommandBuilder()
    .setName("help")
    .setDescription("Muestra la ayuda"),

  new SlashCommandBuilder()
    .setName("embed")
    .setDescription("Crea un embed")
    .addStringOption(o =>
      o.setName("texto")
        .setDescription("Texto")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("say")
    .setDescription("Envía un mensaje")
    .addStringOption(o =>
      o.setName("texto")
        .setDescription("Mensaje")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("poll")
    .setDescription("Crea una encuesta")
    .addStringOption(o =>
      o.setName("pregunta")
        .setDescription("Pregunta")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("reminder")
    .setDescription("Crea un recordatorio")
    .addIntegerOption(o =>
      o.setName("minutos")
        .setDescription("Minutos")
        .setRequired(true)
        .setMinValue(1)
    )
    .addStringOption(o =>
      o.setName("mensaje")
        .setDescription("Mensaje")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("afk")
    .setDescription("Activa AFK")
    .addStringOption(o =>
      o.setName("razon")
        .setDescription("Razón")
        .setRequired(false)
    ),

  new SlashCommandBuilder()
    .setName("firstmessage")
    .setDescription("Busca el primer mensaje"),

  new SlashCommandBuilder()
    .setName("timestamp")
    .setDescription("Convierte una fecha a timestamp")
    .addStringOption(o =>
      o.setName("fecha")
        .setDescription("Fecha")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("snowflake")
    .setDescription("Muestra un Snowflake")
    .addStringOption(o =>
      o.setName("id")
        .setDescription("ID")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("color")
    .setDescription("Muestra un código de color")
    .addStringOption(o =>
      o.setName("codigo")
        .setDescription("Código HEX")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("choose")
    .setDescription("Elige una opción")
    .addStringOption(o =>
      o.setName("opciones")
        .setDescription("Opciones separadas por |")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("8ball")
    .setDescription("Pregunta a la bola 8"),

  new SlashCommandBuilder()
    .setName("calculate")
    .setDescription("Calculadora")
    .addStringOption(o =>
      o.setName("expresion")
        .setDescription("Operación")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("translate")
    .setDescription("Traducción"),

  new SlashCommandBuilder()
    .setName("weather")
    .setDescription("Consulta el clima")
];

// ═════════════════════════════════════
// REGISTRAR COMANDOS
// ═════════════════════════════════════

async function registerCommands() {
  const rest = new REST({
    version: "10"
  }).setToken(process.env.DISCORD_TOKEN);

  try {
    console.log("🔄 Registrando comandos...");

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      {
        body: slashCommands.map(command =>
          command.toJSON()
        )
      }
    );

    console.log("✅ Comandos registrados.");
  } catch (error) {
    console.error(
      "❌ Error registrando comandos:",
      error
    );
  }
}

// ═════════════════════════════════════
// INTERACCIONES
// ═════════════════════════════════════

async function handleInteraction(interaction) {

  // Comandos /
  if (interaction.isChatInputCommand()) {
    return commands.handleCommand(interaction);
  }

  // Menús
  if (interaction.isStringSelectMenu()) {

    if (
      interaction.customId ===
      "ticket_type"
    ) {
      return tickets.createTicket(
        interaction,
        interaction.values[0]
      );
    }

    if (
      interaction.customId ===
      "postulation_type"
    ) {
      return postulaciones.startApplication(
        interaction,
        interaction.values[0]
      );
    }
  }

  // Botones
  if (interaction.isButton()) {

    if (
      interaction.customId.startsWith(
        "ticket_"
      )
    ) {
      return tickets.handleTicketButton(
        interaction
      );
    }

    if (
      interaction.customId.startsWith(
        "md_ticket_"
      )
    ) {
      return mdTickets.handleTicketButton(
        interaction
      );
    }

    if (
      interaction.customId.startsWith(
        "application_"
      )
    ) {
      return postulaciones.handleApplicationDecision(
        interaction
      );
    }
  }
}

// ═════════════════════════════════════
// MENSAJES
// ═════════════════════════════════════

async function handleGuildMessage(message) {

  // Mensajes dentro del servidor
  await mdTickets.handleStaffMessage(message);
}

async function handleDirectMessage(message) {

  // Mensajes recibidos por MD
  await mdTickets.handleUserMessage(message);
}

// ═════════════════════════════════════
// EVENTO READY
// ═════════════════════════════════════

client.once("ready", async () => {

  await events.onReady(client);

  console.log(
    `👑 KING SUPPORT conectado como ${client.user.tag}`
  );

  await registerCommands();

  // Panel de tickets
  if (
    typeof tickets.setupTicketPanel ===
    "function"
  ) {
    await tickets.setupTicketPanel(client);
  }

  // Panel de postulaciones
  if (
    typeof postulaciones.setupPostulationPanel ===
    "function"
  ) {
    await postulaciones.setupPostulationPanel(
      client
    );
  }

  // Canales de postulaciones
  if (
    typeof postulaciones.setupApplicationChannels ===
    "function"
  ) {
    await postulaciones.setupApplicationChannels(
      client
    );
  }

  console.log("✅ KING SUPPORT completamente iniciado.");
});

// ═════════════════════════════════════
// INTERACTION CREATE
// ═════════════════════════════════════

client.on("interactionCreate", async interaction => {

  try {

    await events.onInteraction(
      interaction,
      {
        handleInteraction
      }
    );

  } catch (error) {

    console.error(
      "❌ Error en interacción:",
      error
    );

    if (
      !interaction.replied &&
      !interaction.deferred
    ) {
      await interaction.reply({
        content:
          "❌ Ocurrió un error al procesar esta acción.",
        ephemeral: true
      }).catch(() => {});
    }
  }
});

// ═════════════════════════════════════
// MENSAJES
// ═════════════════════════════════════

client.on("messageCreate", async message => {

  try {

    if (message.author.bot) return;

    if (message.guild) {
      await handleGuildMessage(message);
    } else {
      await handleDirectMessage(message);
    }

  } catch (error) {

    console.error(
      "❌ Error procesando mensaje:",
      error
    );
  }
});

// ═════════════════════════════════════
// LOGIN
// ═════════════════════════════════════

if (!process.env.DISCORD_TOKEN) {
  console.error(
    "❌ Falta DISCORD_TOKEN en el archivo .env"
  );

  process.exit(1);
}

client.login(
  process.env.DISCORD_TOKEN
);
