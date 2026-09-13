module.exports = {
  guildId: process.env.GUILD_ID,

  channels: {
    // 🎫 Panel principal de tickets
    ticketPanel: "1538681130293923896",

    // 👑 Panel principal de postulaciones
    postulationPanel: "1538681130293923897",

    // 📋 Canal donde se envían los cierres/resúmenes de tickets
    ticketReviews: "1538681130293923898",

    // 📜 Canal de logs y transcripts
    logs: "1538681131543695403"
  },

  roles: {
    // 🛠️ Staff que atiende los tickets
    ticketStaff: "1541517711970934884",

    // 👮 Staff autorizado para revisar y aceptar/rechazar postulaciones
    postulationReview: "1538681128360214546"
  },

  tickets: {
    types: {
      alliance: "Alianza",
      support: "Soporte",
      claim: "Claim",
      staff: "Staff"
    },

    rating: {
      min: 1,
      max: 5
    }
  },

  applications: {
    types: {
      staff: "Staff",
      journalist: "Periodista",
      economy: "Economía"
    },

    // Los canales de formularios se crean automáticamente
    autoCreateChannels: true,

    minimumQuestions: 17
  },

  bot: {
    name: "KING SUPPORT",
    language: "es",
    timezone: "America/Bogota"
  }
};
