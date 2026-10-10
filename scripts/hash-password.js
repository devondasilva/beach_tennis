#!/usr/bin/env node
/**
 * Génère les variables d'environnement d'un compte admin pour Vercel.
 * Usage : node scripts/hash-password.js <identifiant> <mot-de-passe> ["Nom affiché"]
 * (sans chevrons : node scripts/hash-password.js Devon MonMotDePasse "Devon")
 */
const crypto = require("crypto");
const [, , username, password, name] = process.argv;
if (!username || !password) {
  console.error('Usage : node scripts/hash-password.js Identifiant MotDePasse "Nom affiché"');
  process.exit(1);
}
const salt = crypto.randomBytes(16).toString("hex");
const hash = crypto.scryptSync(password, salt, 64).toString("hex");
console.log("\nÀ ajouter dans Vercel → Settings → Environment Variables :\n");
console.log(`ADMIN_USERNAME=${username}`);
console.log(`ADMIN_NAME=${name || username}`);
console.log(`ADMIN_PASSWORD_HASH=${hash}`);
console.log(`ADMIN_PASSWORD_SALT=${salt}`);
console.log("\nAUTH_SECRET doit aussi être défini (48+ caractères aléatoires). Puis redéployez.\n");
