module.exports = {
  async onReady(client) {
    console.log(`✅ KING SUPPORT conectado como ${client.user.tag}`);
  },

  async onInteraction(interaction, handlers) {
    if (
      interaction.isChatInputCommand() ||
      interaction.isButton() ||
      interaction.isStringSelectMenu()
    ) {
      await handlers.handleInteraction(interaction);
    }
  },

  async onMessage(message, handlers) {
    // Ignorar mensajes enviados por bots
    if (message.author.bot) return;

    // Mensajes recibidos por MD
    if (!message.guild) {
      await handlers.handleDirectMessage(message);
      return;
    }

    // Mensajes dentro de servidores
    await handlers.handleGuildMessage(message);
  }
};
