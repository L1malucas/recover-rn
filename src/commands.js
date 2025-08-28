
import path from "path";
import fs from "fs";
import chalk from "chalk";
import { runCommand } from "./utils.js";
import { DIR_SUFFIX, ASSET_FOLDERS } from "./constants.js";

export function executeUnzip(apkFile, apkBaseName, logFile) {
  const outputDir = `${apkBaseName}${DIR_SUFFIX.unzip}`;
  console.log(chalk.blue(`📦 Executando extração unzip em: ${outputDir}/`));

  fs.rmSync(outputDir, { recursive: true, force: true });
  fs.mkdirSync(outputDir, { recursive: true });

  const success = runCommand(
    `unzip -q "${apkFile}" -d "${outputDir}"`, 
    "Erro na extração unzip"
  );

  if (success) {
    console.log(chalk.green(`✅ Extração unzip concluída: ${outputDir}/
`));
  }

  return outputDir;
}

export function executeAPKTool(apkFile, apkBaseName, logFile) {
  const outputDir = `${apkBaseName}${DIR_SUFFIX.apktool}`;
  console.log(chalk.blue(`🔧 Executando APKTool em: ${outputDir}/`));

  const success = runCommand(
    `apktool d "${apkFile}" -o "${outputDir}" -f`,
    "Erro no APKTool"
  );

  if (success) {
    console.log(chalk.green(`✅ APKTool concluído: ${outputDir}/
`));
  }

  return outputDir;
}

export function executeBeautify(bundlePath, apkBaseName, logFile) {
  if (!bundlePath) {
    console.log(chalk.yellow("⚠️  Pulando beautify - bundle não encontrado\n"));
    return;
  }

  const beautifyDir = `${apkBaseName}${DIR_SUFFIX.beautified}`;
  const outputFile = path.join(beautifyDir, "index.pretty.js");

  console.log(chalk.blue(`✨ Executando beautify em: ${beautifyDir}/`));

  fs.mkdirSync(beautifyDir, { recursive: true });

  const success = runCommand(
    `npx js-beautify "${bundlePath}" -o "${outputFile}"`, 
    "Erro no beautify"
  );

  if (success) {
    console.log(chalk.green(`✅ Beautify concluído: ${outputFile}
`));
  }
}

export function executeAssets(outputDir, apkBaseName, logFile) {
  const assetsDir = `${apkBaseName}${DIR_SUFFIX.assets}`;
  console.log(chalk.blue(`🖼️  Executando extração de assets em: ${assetsDir}/`));

  fs.mkdirSync(assetsDir, { recursive: true });

  let copiedCount = 0;

  ASSET_FOLDERS.forEach((folder) => {
    const src = path.join(outputDir, folder);
    if (fs.existsSync(src)) {
      fs.cpSync(src, path.join(assetsDir, folder), { recursive: true });
      copiedCount++;
    }
  });

  console.log(chalk.green(`✅ ${copiedCount} tipos de assets copiados: ${assetsDir}/
`));
}

export function executeVisualizer(bundlePath, logFile) {
  if (!bundlePath) {
    console.log(chalk.yellow("⚠️  Pulando visualizer - bundle não encontrado\n"));
    return;
  }

  console.log(chalk.blue("📋 Executando Bundle Visualizer..."));

  const success = runCommand(
    `npx react-native-bundle-visualizer "${bundlePath}"`, 
    "Erro no Bundle Visualizer (pode não estar instalado)",
    true
  );

  if (success) {
    console.log(chalk.green("✅ Bundle Visualizer executado\n"));
  }
}
