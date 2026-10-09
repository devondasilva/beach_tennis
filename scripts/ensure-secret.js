#!/usr/bin/env node
/** Crée .env.local avec un AUTH_SECRET aléatoire s'il n'existe pas déjà (exécuté par `npm install`). */
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const file = path.join(__dirname, "..", ".env.local");
const current = fs.existsSync(file) ? fs.readFileSync(file, "utf-8") : "";
if (/^AUTH_SECRET=.{16,}/m.test(current)) process.exit(0);
const line = `AUTH_SECRET=${crypto.randomBytes(48).toString("hex")}\n`;
fs.writeFileSync(file, current + (current && !current.endsWith("\n") ? "\n" : "") + line, { mode: 0o600 });
console.log("AUTH_SECRET généré dans .env.local");
