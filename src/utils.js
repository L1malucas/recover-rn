
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import chalk from "chalk";
import { DEPENDENCIES, APKTOOL_DEPENDENCY, BUNDLE_SEARCH_PATHS } from "./constants.js";

export function runCommand(cmd, errorMsg = "", silent = false) {
  try {
    const result = execSync(cmd, {
      stdio: silent ? "pipe" : "inherit",
      encoding: "utf8"
    });
    return result;
  } catch (err) {
    if (errorMsg) {
      logError(errorMsg, err);
    }
    return null;
  }
}

export function logError(logFile, message, error) {
  const fullMessage = `[${new Date().toISOString()}] ${message}\n${error?.stack || error}\n\n`;
  fs.appendFileSync(logFile, fullMessage);
  console.error(chalk.red(`❌ ${message}`));
}

export function checkDependencies(selectedOptions) {
  const deps = [...DEPENDENCIES];
  if (selectedOptions.includes('apktool')) {
    deps.push(APKTOOL_DEPENDENCY);
  }

  console.log(chalk.cyan("🔍 Verificando dependências...\n"));

  for (const dep of deps) {
    try {
      execSync(dep.cmd, { stdio: 'pipe' });
      console.log(chalk.green(`✅ ${dep.name}`));
    } catch {
      console.log(chalk.red(`❌ ${dep.name} - FALTANDO`));
      return false;
    }
  }
  console.log("");
  return true;
}

export async function validateAPK(apkFile) {
  console.log(chalk.blue("🔍 Validando estrutura do APK..."));

  try {
    const result = execSync(`unzip -l "${apkFile}" | head -10`, {
      encoding: 'utf8',
      stdio: 'pipe'
    });

    if (result.includes('AndroidManifest.xml')) {
      console.log(chalk.green("✅ APK válido - AndroidManifest.xml encontrado"));
    } else {
      console.log(chalk.yellow("⚠️  APK pode não ser válido - AndroidManifest.xml não encontrado"));
    }

    const hasJS = execSync(`unzip -l "${apkFile}" | grep -E "\\.(bundle|js)$" | head -3`, {
      encoding: 'utf8',
      stdio: 'pipe'
    });

    if (hasJS.trim()) {
      console.log(chalk.green("✅ Possíveis bundles JavaScript detectados"));
    } else {
      console.log(chalk.yellow("⚠️  Nenhum bundle JavaScript óbvio encontrado"));
    }

  } catch (error) {
    console.log(chalk.yellow("⚠️  Não foi possível validar completamente o APK"));
    logError("Erro na validação do APK", error);
  }

  console.log("");
}

export function findJSBundle(outputDir) {
  if (!outputDir) return null;

  const possiblePaths = BUNDLE_SEARCH_PATHS.map(p => path.join(outputDir, p));

  for (const bundlePath of possiblePaths) {
    if (fs.existsSync(bundlePath)) {
      console.log(chalk.green(`🎯 Bundle encontrado: ${path.basename(bundlePath)}`));
      return bundlePath;
    }
  }

  try {
    const result = execSync(
      `find "${outputDir}" -name "*.bundle" -o -name "*.js" | grep -E "(bundle|index)" | head -1`,
      { encoding: 'utf8', stdio: 'pipe' }
    );

    if (result.trim()) {
      console.log(chalk.green(`🎯 Bundle encontrado via busca: ${path.basename(result.trim())}`));
      return result.trim();
    }
  } catch { } 

  console.log(chalk.yellow("⚠️  Bundle JavaScript não encontrado"));
  return null;
}
