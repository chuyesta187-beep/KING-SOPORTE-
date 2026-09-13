const {
  EmbedBuilder,
  PermissionFlagsBits
} = require("discord.js");

const os = require("os");

module.exports = {
  async handleCommand(interaction) {
    const { commandName } = interaction;

    switch (commandName) {

      // ─────────────────────────────
      // INFORMACIÓN
      // ─────────────────────────────

      case "avatar": {
        const user = interaction.options.getUser("usuario") || interaction.user;

        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle(`🖼️ Avatar de ${user.username}`)
              .setImage(user.displayAvatarURL({ size: 1024 }))
              .setColor(0xD4AF37)
          ]
        });
      }

      case "banner": {
        const user = interaction.options.getUser("usuario") || interaction.user;

        const fetchedUser = await user.fetch();

        if (!fetchedUser.banner) {
          return interaction.reply({
            content: "❌ Este usuario no tiene banner.",
            ephemeral: true
          });
        }

        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle(`🎨 Banner de ${user.username}`)
              .setImage(fetchedUser.bannerURL({ size: 1024 }))
              .setColor(0xD4AF37)
          ]
        });
      }

      case "userinfo": {
        const user = interaction.options.getUser("usuario") || interaction.user;

        const member = await interaction.guild.members
          .fetch(user.id)
          .catch(() => null);

        const embed = new EmbedBuilder()
          .setTitle(`👤 Información de ${user.username}`)
          .setThumbnail(user.displayAvatarURL())
          .addFields(
            { name: "🆔 ID", value: user.id },
            {
              name: "📅 Cuenta creada",
              value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`
            },
            {
              name: "🤖 Bot",
              value: user.bot ? "Sí" : "No"
            }
          )
          .setColor(0xD4AF37);

        if (member) {
          embed.addFields({
            name: "📅 Entrada al servidor",
            value: member.joinedTimestamp
              ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`
              : "Desconocida"
          });
        }

        return interaction.reply({ embeds: [embed] });
      }

      case "serverinfo": {
        const guild = interaction.guild;

        const bots = guild.members.cache.filter(
          member => member.user.bot
        ).size;

        const embed = new EmbedBuilder()
          .setTitle(`♛ ${guild.name}`)
          .setThumbnail(guild.iconURL({ size: 1024 }))
          .addFields(
            { name: "🆔 ID", value: guild.id, inline: true },
            { name: "👑 Dueño", value: `<@${guild.ownerId}>`, inline: true },
            {
              name: "👥 Miembros",
              value: `${guild.memberCount}`,
              inline: true
            },
            {
              name: "🤖 Bots",
              value: `${bots}`,
              inline: true
            },
            {
              name: "💬 Canales",
              value: `${guild.channels.cache.size}`,
              inline: true
            },
            {
              name: "🎭 Roles",
              value: `${guild.roles.cache.size}`,
              inline: true
            },
            {
              name: "😀 Emojis",
              value: `${guild.emojis.cache.size}`,
              inline: true
            },
            {
              name: "🚀 Boosts",
              value: `${guild.premiumSubscriptionCount || 0}`,
              inline: true
            },
            {
              name: "🛡️ Verificación",
              value: `${guild.verificationLevel}`,
              inline: true
            },
            {
              name: "📅 Creado",
              value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`
            }
          )
          .setColor(0xD4AF37);

        return interaction.reply({ embeds: [embed] });
      }

      case "servericon": {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle(`🖼️ Icono de ${interaction.guild.name}`)
              .setImage(
                interaction.guild.iconURL({ size: 2048 })
              )
              .setColor(0xD4AF37)
          ]
        });
      }

      case "membercount": {
        const guild = interaction.guild;

        const bots = guild.members.cache.filter(
          member => member.user.bot
        ).size;

        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("👥 Miembros")
              .setDescription(
                `**Total:** ${guild.memberCount}\n` +
                `**Bots:** ${bots}\n` +
                `**Usuarios:** ${guild.memberCount - bots}`
              )
              .setColor(0xD4AF37)
          ]
        });
      }

      // ─────────────────────────────
      // ROLES
      // ─────────────────────────────

      case "roles": {
        const roles = interaction.guild.roles.cache
          .filter(role => role.id !== interaction.guild.id)
          .sort((a, b) => b.position - a.position)
          .map(role => `<@&${role.id}>`)
          .join("\n");

        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("🎭 Roles del servidor")
              .setDescription(roles || "No hay roles.")
              .setColor(0xD4AF37)
          ]
        });
      }

      case "roleinfo": {
        const role = interaction.options.getRole("rol");

        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle(`🎭 ${role.name}`)
              .addFields(
                { name: "🆔 ID", value: role.id },
                { name: "👥 Miembros", value: `${role.members.size}` },
                { name: "📍 Posición", value: `${role.position}` },
                {
                  name: "🔒 Mencionable",
                  value: role.mentionable ? "Sí" : "No"
                },
                {
                  name: "⚙️ Gestionable",
                  value: role.managed ? "Sí" : "No"
                }
              )
              .setColor(0xD4AF37)
          ]
        });
      }

      // ─────────────────────────────
      // CANALES
      // ─────────────────────────────

      case "canales": {
        const channels = interaction.guild.channels.cache;

        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("📚 Canales")
              .setDescription(
                `💬 Texto: ${channels.filter(c => c.isTextBased()).size}\n` +
                `🔊 Voz: ${channels.filter(c => c.isVoiceBased()).size}\n` +
                `📁 Categorías: ${channels.filter(c => c.type === 4).size}`
              )
              .setColor(0xD4AF37)
          ]
        });
      }

      case "channelinfo": {
        const channel =
          interaction.options.getChannel("canal") ||
          interaction.channel;

        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle(`📺 ${channel.name}`)
              .addFields(
                { name: "🆔 ID", value: channel.id },
                { name: "📁 Tipo", value: `${channel.type}` },
                {
                  name: "📅 Creado",
                  value: `<t:${Math.floor(channel.createdTimestamp / 1000)}:F>`
                }
              )
              .setColor(0xD4AF37)
          ]
        });
      }

      // ─────────────────────────────
      // EMOJIS
      // ─────────────────────────────

      case "emoji": {
        const emoji = interaction.options.getString("emoji");

        return interaction.reply({
          content: emoji || "❌ Debes indicar un emoji."
        });
      }

      case "listemojis": {
        const emojis = interaction.guild.emojis.cache
          .map(emoji => `${emoji} \`${emoji.name}\``)
          .join("\n");

        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("😀 Emojis del servidor")
              .setDescription(emojis || "No hay emojis.")
              .setColor(0xD4AF37)
          ]
        });
      }

      // ─────────────────────────────
      // PERMISOS
      // ─────────────────────────────

      case "permissions": {
        const member =
          interaction.options.getMember("usuario") ||
          interaction.member;

        const permissions = member.permissions.toArray();

        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle(`🔐 Permisos de ${member.user.username}`)
              .setDescription(
                permissions.length
                  ? permissions.map(p => `• ${p}`).join("\n")
                  : "Sin permisos especiales."
              )
              .setColor(0xD4AF37)
          ]
        });
      }

      // ─────────────────────────────
      // BOT
      // ─────────────────────────────

      case "botinfo": {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("♛ KING SUPPORT")
              .setDescription(
                "Bot oficial de soporte para **King the Land**."
              )
              .addFields(
                { name: "🟢 Estado", value: "Online", inline: true },
                {
                  name: "💻 Plataforma",
                  value: process.platform,
                  inline: true
                },
                {
                  name: "🧠 Memoria",
                  value: `${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB`,
                  inline: true
                }
              )
              .setColor(0xD4AF37)
          ]
        });
      }

      case "ping": {
        return interaction.reply({
          content: `🏓 Pong! **${interaction.client.ws.ping}ms**`
        });
      }

      case "uptime": {
        const seconds = Math.floor(process.uptime());

        return interaction.reply({
          content: `⏱️ KING SUPPORT lleva **${seconds} segundos** encendido.`
        });
      }

      case "invite": {
        return interaction.reply({
          content:
            "🔗 Usa el enlace de invitación configurado para KING SUPPORT."
        });
      }

      case "help": {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("📖 KING SUPPORT — Ayuda")
              .setDescription(
                "Usa `/` para ver todos los comandos disponibles.\n\n" +
                "🎫 Sistema de tickets\n" +
                "👑 Postulaciones\n" +
                "📩 Soporte por MD\n" +
                "🛠️ Utilidades"
              )
              .setColor(0xD4AF37)
          ]
        });
      }

      // ─────────────────────────────
      // UTILIDADES
      // ─────────────────────────────

      case "embed": {
        const texto = interaction.options.getString("texto");

        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(texto)
              .setColor(0xD4AF37)
          ]
        });
      }

      case "say": {
        const texto = interaction.options.getString("texto");

        return interaction.reply({
          content: texto
        });
      }

      case "poll": {
        const pregunta = interaction.options.getString("pregunta");

        return interaction.reply({
          content: `📊 **Encuesta:** ${pregunta}\n\n👍 Sí\n👎 No`
        });
      }

      case "reminder": {
        const tiempo = interaction.options.getInteger("minutos");
        const mensaje = interaction.options.getString("mensaje");

        await interaction.reply({
          content: `⏰ Recordatorio establecido para dentro de ${tiempo} minutos.`
        });

        setTimeout(() => {
          interaction.user.send(`⏰ **Recordatorio:** ${mensaje}`)
            .catch(() => {});
        }, tiempo * 60 * 1000);

        return;
      }

      case "afk": {
        const razon =
          interaction.options.getString("razon") ||
          "Sin razón especificada.";

        return interaction.reply({
          content: `💤 ${interaction.user}, ahora estás AFK.\n**Razón:** ${razon}`
        });
      }

      case "firstmessage": {
        const messages = await interaction.channel.messages.fetch({
          limit: 100
        });

        const first = messages.last();

        return interaction.reply({
          content: first
            ? `📜 Primer mensaje encontrado: ${first.url}`
            : "❌ No se encontró ningún mensaje."
        });
      }

      case "timestamp": {
        const fecha = interaction.options.getString("fecha");

        const time = Math.floor(
          new Date(fecha).getTime() / 1000
        );

        return interaction.reply({
          content: `<t:${time}:F>\n\`<t:${time}:F>\``
        });
      }

      case "snowflake": {
        const id = interaction.options.getString("id");

        return interaction.reply({
          content: `🆔 Snowflake: \`${id}\``
        });
      }

      case "color": {
        const codigo = interaction.options.getString("codigo");

        return interaction.reply({
          content: `🎨 Código de color: \`${codigo}\``
        });
      }

      case "choose": {
        const opciones = interaction.options.getString("opciones")
          .split("|")
          .map(x => x.trim())
          .filter(Boolean);

        if (!opciones.length) {
          return interaction.reply({
            content: "❌ No hay opciones.",
            ephemeral: true
          });
        }

        const elegido =
          opciones[Math.floor(Math.random() * opciones.length)];

        return interaction.reply({
          content: `🎯 Elegí: **${elegido}**`
        });
      }

      case "8ball": {
        const respuestas = [
          "🎱 Sí.",
          "🎱 No.",
          "🎱 Probablemente.",
          "🎱 No estoy seguro.",
          "🎱 Definitivamente.",
          "🎱 Pregunta nuevamente."
        ];

        return interaction.reply({
          content:
            respuestas[Math.floor(Math.random() * respuestas.length)]
        });
      }

      case "calculate": {
        const expresion = interaction.options.getString("expresion");

        try {
          if (!/^[0-9+\-*/(). %]+$/.test(expresion)) {
            throw new Error();
          }

          const resultado = Function(
            `"use strict"; return (${expresion})`
          )();

          return interaction.reply({
            content: `🧮 Resultado: **${resultado}**`
          });
        } catch {
          return interaction.reply({
            content: "❌ Operación no válida.",
            ephemeral: true
          });
        }
      }

      case "translate": {
        return interaction.reply({
          content:
            "🌐 El sistema de traducción se conectará posteriormente a un servicio de traducción."
        });
      }

      case "weather": {
        return interaction.reply({
          content:
            "🌤️ El sistema meteorológico se conectará posteriormente a una API del clima."
        });
      }

      default:
        return interaction.reply({
          content: "❌ Ese comando no está configurado.",
          ephemeral: true
        });
    }
  }
};
