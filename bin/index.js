#!/usr/bin/env node
/**
 * 🔧 React Native APK Recovery CLI
 * Autor: Lucas Lima (adaptado por ChatGPT)
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import chalk from "chalk";

function logError(message, error) {
  const logFile = "recover.log";
  const fullMessage = `[${new Date().toISOString()}] ${message}\n${error?.stack || error}\n\n`;
  fs.appendFileSync(logFile, fullMessage);
  console.error(chalk.red(`❌ ${message}`));
  console.log(chalk.yellow(`🔍 Veja detalhes em ${logFile}`));
}

function runCommand(cmd, errorMsg) {
  try {
    return execSync(cmd, { stdio: "pipe" }).toString();
  } catch (err) {
    logError(errorMsg, err);
    process.exit(1);
  }
}

// --- Welcome ---
console.log(chalk.cyan.bold("========================================"));
console.log(chalk.green.bold(" 🚀 React Native APK Recovery CLI"));
console.log(chalk.cyan.bold("========================================\n"));
console.log(chalk.white("Uso:"));
console.log(chalk.yellow("   recover-rn app.apk\n"));
console.log(chalk.white("Funções:"));
console.log(chalk.green("   • Extrai index.android.bundle"));
console.log(chalk.green("   • Beautify do JavaScript"));
console.log(chalk.green("   • Copia assets e manifest"));
console.log(chalk.green("   • Salva erros em recover.log\n"));

const apkFile = process.argv[2];
if (!apkFile) {
  console.error(chalk.red("❌ Nenhum arquivo APK fornecido."));
  console.log(chalk.yellow("👉 Exemplo: recover-rn app.apk"));
  process.exit(1);
}

if (!fs.existsSync(apkFile)) {
  console.error(chalk.red(`❌ Arquivo não encontrado: ${apkFile}`));
  process.exit(1);
}

const outputDir = "recovered_app";
const bundleFile = "index.android.bundle";
const beautifiedFile = "index.pretty.js";

console.log(chalk.blue(`📦 Descompilando APK: ${apkFile} ...`));
runCommand(`apktool d "${apkFile}" -o "${outputDir}" -f`, "Erro ao descompilar APK com apktool");

const bundlePath = path.join(outputDir, "assets", bundleFile);
if (!fs.existsSync(bundlePath)) {
  logError("Bundle JS não encontrado no APK.", new Error("index.android.bundle ausente"));
  process.exit(1);
}

console.log(chalk.blue("✨ Formatando código JS..."));
runCommand(`npx js-beautify "${bundlePath}" -o "${path.join(outputDir, beautifiedFile)}"`, "Erro ao beautify JS");

console.log(chalk.blue("🖼️ Copiando assets..."));
const extractedAssets = path.join(outputDir, "extracted_assets");
fs.mkdirSync(extractedAssets, { recursive: true });

["assets", "res"].forEach((folder) => {
  const src = path.join(outputDir, folder);
  if (fs.existsSync(src)) {
    runCommand(`cp -r "${src}" "${extractedAssets}"`, `Erro ao copiar ${folder}`);
  }
});

console.log(chalk.green.bold("\n✅ Recuperação concluída com sucesso!\n"));
console.log(chalk.white("Arquivos gerados:"));
console.log(chalk.green(`👉 Código JS legível: ${path.join(outputDir, beautifiedFile)}`));
console.log(chalk.green(`👉 Assets: ${extractedAssets}`));
console.log(chalk.green(`👉 Manifesto: ${path.join(outputDir, "AndroidManifest.xml")}`));
console.log(chalk.gray(`(Se ocorreram erros, consulte recover.log)`));
