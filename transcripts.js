const fs = require("fs");
const path = require("path");

const TRANSCRIPTS_DIR = path.join(__dirname, "transcripts");

// Crear carpeta si no existe
if (!fs.existsSync(TRANSCRIPTS_DIR)) {
  fs.mkdirSync(TRANSCRIPTS_DIR, { recursive: true });
}

// ─────────────────────────────
// OBTENER TODOS LOS MENSAJES
// ─────────────────────────────

async function getAllMessages(channel) {
  let messages = [];
  let lastId;

  while (true) {
    const options = {
      limit: 100
    };

    if (lastId) {
      options.before = lastId;
    }

    const batch = await channel.messages.fetch(options);

    if (!batch.size) break;

    messages.push(...batch.values());

    lastId = batch.last().id;

    if (batch.size < 100) break;
  }

  return messages.reverse();
}

// ─────────────────────────────
// CREAR TRANSCRIPT
// ─────────────────────────────

async function createTranscript(channel, ticketData = {}) {
  const messages = await getAllMessages(channel);

  const lines = [];

  lines.push("========================================");
  lines.push("          KING SUPPORT");
  lines.push("          TICKET TRANSCRIPT");
  lines.push("========================================");
  lines.push("");

  lines.push(`Canal: ${channel.name}`);
  lines.push(`ID del canal: ${channel.id}`);

  if (ticketData.userId) {
    lines.push(`Usuario: ${ticketData.userId}`);
  }

  if (ticketData.username) {
    lines.push(`Nombre: ${ticketData.username}`);
  }

  if (ticketData.type) {
    lines.push(`Tipo: ${ticketData.type}`);
  }

  if (ticketData.claimedBy) {
    lines.push(`Staff: ${ticketData.claimedBy}`);
  } else {
    lines.push("Staff: No reclamado");
  }

  if (ticketData.rating) {
    lines.push(`Calificación: ${ticketData.rating}/5`);
  }

  if (ticketData.review) {
    lines.push(`Reseña: ${ticketData.review}`);
  }

  lines.push(
    `Fecha de creación: ${
      ticketData.createdAt || "Desconocida"
    }`
  );

  lines.push(`Fecha de cierre: ${new Date().toISOString()}`);

  lines.push("");
  lines.push("----------------------------------------");
  lines.push("CONVERSACIÓN");
  lines.push("----------------------------------------");
  lines.push("");

  for (const message of messages) {
    const date = message.createdAt
      ? message.createdAt.toISOString()
      : "Fecha desconocida";

    const author = message.author
      ? `${message.author.tag} (${message.author.id})`
      : "Usuario desconocido";

    let content = message.content || "";

    if (!content && message.attachments.size) {
      content = "[Archivo adjunto]";
    }

    if (!content) {
      content = "[Sin contenido]";
    }

    lines.push(`[${date}] ${author}:`);
    lines.push(content);

    if (message.attachments.size) {
      for (const attachment of message.attachments.values()) {
        lines.push(`Adjunto: ${attachment.url}`);
      }
    }

    lines.push("");
  }

  lines.push("----------------------------------------");
  lines.push("FIN DEL TRANSCRIPT");
  lines.push("----------------------------------------");

  const fileName =
    `ticket-${channel.id}-${Date.now()}.txt`;

  const filePath = path.join(
    TRANSCRIPTS_DIR,
    fileName
  );

  fs.writeFileSync(
    filePath,
    lines.join("\n"),
    "utf8"
  );

  return filePath;
}

// ─────────────────────────────
// EXPORTAR
// ─────────────────────────────

module.exports = {
  createTranscript,
  getAllMessages
};
