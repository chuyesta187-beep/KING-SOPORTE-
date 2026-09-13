const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "data");
const DB_FILE = path.join(DATA_DIR, "database.json");

// Crear carpeta data si no existe
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Crear base de datos si no existe
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(
    DB_FILE,
    JSON.stringify(
      {
        tickets: {},
        applications: {},
        staff: {},
        ratings: {},
        closures: {}
      },
      null,
      2
    )
  );
}

function load() {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
  } catch (error) {
    console.error("❌ Error leyendo la base de datos:", error);

    return {
      tickets: {},
      applications: {},
      staff: {},
      ratings: {},
      closures: {}
    };
  }
}

function save(data) {
  fs.writeFileSync(
    DB_FILE,
    JSON.stringify(data, null, 2)
  );
}

// ─────────────────────────────
// TICKETS
// ─────────────────────────────

function createTicket(ticketId, data) {
  const db = load();

  db.tickets[ticketId] = {
    ...data,
    createdAt: new Date().toISOString()
  };

  save(db);
}

function getTicket(ticketId) {
  const db = load();
  return db.tickets[ticketId] || null;
}

function updateTicket(ticketId, data) {
  const db = load();

  if (!db.tickets[ticketId]) return false;

  db.tickets[ticketId] = {
    ...db.tickets[ticketId],
    ...data
  };

  save(db);
  return true;
}

function deleteTicket(ticketId) {
  const db = load();

  delete db.tickets[ticketId];

  save(db);
}

// ─────────────────────────────
// POSTULACIONES
// ─────────────────────────────

function createApplication(applicationId, data) {
  const db = load();

  db.applications[applicationId] = {
    ...data,
    createdAt: new Date().toISOString()
  };

  save(db);
}

function getApplication(applicationId) {
  const db = load();

  return db.applications[applicationId] || null;
}

function updateApplication(applicationId, data) {
  const db = load();

  if (!db.applications[applicationId]) return false;

  db.applications[applicationId] = {
    ...db.applications[applicationId],
    ...data
  };

  save(db);
  return true;
}

function deleteApplication(applicationId) {
  const db = load();

  delete db.applications[applicationId];

  save(db);
}

// ─────────────────────────────
// STAFF
// ─────────────────────────────

function setStaff(staffId, data) {
  const db = load();

  db.staff[staffId] = {
    ...db.staff[staffId],
    ...data,
    updatedAt: new Date().toISOString()
  };

  save(db);
}

function getStaff(staffId) {
  const db = load();

  return db.staff[staffId] || null;
}

// ─────────────────────────────
// CALIFICACIONES
// ─────────────────────────────

function saveRating(ticketId, data) {
  const db = load();

  db.ratings[ticketId] = {
    ...data,
    createdAt: new Date().toISOString()
  };

  save(db);
}

function getRating(ticketId) {
  const db = load();

  return db.ratings[ticketId] || null;
}

// ─────────────────────────────
// CIERRES
// ─────────────────────────────

function saveClosure(ticketId, data) {
  const db = load();

  db.closures[ticketId] = {
    ...data,
    closedAt: new Date().toISOString()
  };

  save(db);
}

function getClosure(ticketId) {
  const db = load();

  return db.closures[ticketId] || null;
}

// ─────────────────────────────
// EXPORTAR
// ─────────────────────────────

module.exports = {
  load,
  save,

  createTicket,
  getTicket,
  updateTicket,
  deleteTicket,

  createApplication,
  getApplication,
  updateApplication,
  deleteApplication,

  setStaff,
  getStaff,

  saveRating,
  getRating,

  saveClosure,
  getClosure
};
