
import inquirer from "inquirer";
import chalk from "chalk";
import fs from "fs";
import {
  WELCOME_MESSAGE,
  APK_CHOICE_PROMPT,
  RECOVERY_CHOICES,
  CUSTOM_SELECTION_PROMPT,
  DIR_SUFFIX
} from "./constants.js";

export function showWelcome() {
  console.clear();
  console.log(WELCOME_MESSAGE);
}

export async function selectAPK() {
  const { apkPath } = await inquirer.prompt([
    {
      ...APK_CHOICE_PROMPT,
      validate: (input) => {
        if (!input.trim()) {
          return 'Por favor, digite um caminho válido';
        }
        if (!fs.existsSync(input)) {
          return `❌ Arquivo não encontrado: ${input}`;
        }
        if (!input.toLowerCase().endsWith('.apk')) {
          return '❌ O arquivo deve ter extensão .apk';
        }
        return true;
      }
    }
  ]);
  return apkPath;
}

export async function showMenu() {
  console.log(chalk.cyan.bold("🎯 Escolha uma opção de recuperação:\n"));

  const { selectedAction } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedAction',
      message: 'Selecione uma opção:',
      choices: RECOVERY_CHOICES,
      pageSize: 10
    }
  ]);

  if (selectedAction === 'custom') {
    return customSelection();
  } else if (selectedAction === 'full') {
    return ['unzip', 'apktool', 'beautify', 'analyze', 'assets'];
  } else {
    return [selectedAction];
  }
}

async function customSelection() {
  const { customOptions } = await inquirer.prompt([
    {
      ...CUSTOM_SELECTION_PROMPT,
      validate: (answer) => {
        if (answer.length === 0) {
          return 'Selecione pelo menos uma opção';
        }
        return true;
      }
    }
  ]);
  return customOptions;
}

export function showCompletionSummary(apkBaseName, logFile) {
  console.log("");
  console.log(chalk.green.bold("🎉 RECUPERAÇÃO CONCLUÍDA COM SUCESSO! 🎉\n"));
  console.log(chalk.cyan.bold("📁 Arquivos e diretórios criados:"));

  const patterns = Object.values(DIR_SUFFIX).map(suffix => `${apkBaseName}${suffix}`);

  patterns.forEach(pattern => {
    if (fs.existsSync(pattern)) {
      console.log(chalk.green(`✅ ${pattern}/`));
    }
  });

  console.log("");
  console.log(chalk.yellow.bold("🚀 Próximos passos:"));
  console.log(chalk.white("1. Examine o relatório em") + chalk.cyan(` ${apkBaseName}${DIR_SUFFIX.report}/`));
  console.log(chalk.white("2. Veja o código formatado (se gerado)"));
  console.log(chalk.white("3. Use os assets extraídos"));
  console.log(chalk.white("4. Recrie seu projeto React Native"));
  console.log("");
  console.log(chalk.gray(`📝 Logs salvos em: ${logFile}`));
  console.log("");
}
