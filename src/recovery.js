
import path from "path";
import chalk from "chalk";
import { showWelcome, selectAPK, showMenu, showCompletionSummary } from "./ui.js";
import { checkDependencies, validateAPK, findJSBundle, logError } from "./utils.js";
import { executeUnzip, executeAPKTool, executeBeautify, executeAssets, executeVisualizer } from "./commands.js";
import { executeAnalysis, generateFinalReport } from "./reports.js";

export class InteractiveAPKRecovery {
  constructor() {
    this.apkFile = null;
    this.apkBaseName = null;
    this.logFile = null;
    this.selectedOptions = [];
  }

  async init() {
    showWelcome();
    this.apkFile = await selectAPK();
    this.apkBaseName = path.basename(this.apkFile, '.apk');
    this.logFile = `${this.apkBaseName}-recovery.log`;

    console.log("");
    console.log(chalk.green(`✅ APK válido encontrado: ${chalk.bold(this.apkBaseName)}.apk`));

    await validateAPK(this.apkFile);

    this.selectedOptions = await showMenu();
    await this.executeRecovery();
  }

  async executeRecovery() {
    console.log("");
    console.log(chalk.blue.bold("🚀 Iniciando processo de recuperação...\n"));
    console.log(chalk.gray(`📝 Logs serão salvos em: ${this.logFile}\n`));

    if (!checkDependencies(this.selectedOptions)) {
      console.log(chalk.red("❌ Instale as dependências necessárias antes de continuar."));
      process.exit(1);
    }

    let outputDir = null;
    let bundlePath = null;

    for (const option of this.selectedOptions) {
      switch (option) {
        case 'unzip':
          outputDir = executeUnzip(this.apkFile, this.apkBaseName, this.logFile);
          break;
        case 'apktool':
          outputDir = executeAPKTool(this.apkFile, this.apkBaseName, this.logFile);
          break;
        case 'beautify':
          if (!bundlePath) bundlePath = findJSBundle(outputDir);
          executeBeautify(bundlePath, this.apkBaseName, this.logFile);
          break;
        case 'analyze':
          if (!bundlePath) bundlePath = findJSBundle(outputDir);
          executeAnalysis(this.apkBaseName, bundlePath, this.logFile);
          break;
        case 'assets':
          if (!outputDir) outputDir = executeUnzip(this.apkFile, this.apkBaseName, this.logFile);
          executeAssets(outputDir, this.apkBaseName, this.logFile);
          break;
        case 'visualizer':
          if (!bundlePath) bundlePath = findJSBundle(outputDir);
          executeVisualizer(bundlePath, this.logFile);
          break;
      }
    }

    if (outputDir) {
      generateFinalReport(this.apkBaseName, this.selectedOptions, this.logFile);
    }

    showCompletionSummary(this.apkBaseName, this.logFile);
  }
}
