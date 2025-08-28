#!/usr/bin/env node
/**
 * 🔧 Interactive React Native APK Recovery CLI
 * Autor: Lucas Lima (versão interativa melhorada)
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import chalk from "chalk";
import inquirer from "inquirer";

class InteractiveAPKRecovery {
  constructor() {
    this.apkFile = null;
    this.apkBaseName = null;
    this.logFile = null;
    this.selectedOptions = [];
  }

  async init() {
    this.showWelcome();
    await this.selectAPK();
    await this.showMenu();
  }

  showWelcome() {
    console.clear();
    console.log(chalk.cyan.bold("╔══════════════════════════════════════════════╗"));
    console.log(chalk.cyan.bold("║        🚀 React Native APK Recovery CLI      ║"));
    console.log(chalk.cyan.bold("║                 Versão 3.0                   ║"));
    console.log(chalk.cyan.bold("╚══════════════════════════════════════════════╝"));
    console.log("");
    console.log(chalk.white("📱 Recupere código fonte de APKs React Native"));
    console.log(chalk.white("🔧 Múltiplas ferramentas e métodos disponíveis"));
    console.log(chalk.white("📊 Análise completa e relatórios detalhados"));
    console.log("");
  }

  async selectAPK() {
    const { apkPath } = await inquirer.prompt([
      {
        type: 'input',
        name: 'apkPath',
        message: '📂 Digite o caminho para o arquivo APK:',
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

    this.apkFile = apkPath;
    this.apkBaseName = path.basename(apkPath, '.apk');
    this.logFile = `${this.apkBaseName}-recovery.log`;

    console.log("");
    console.log(chalk.green(`✅ APK válido encontrado: ${chalk.bold(this.apkBaseName)}.apk`));
    
    // Verificar se é um APK válido (básico)
    await this.validateAPK();
  }

  async validateAPK() {
    console.log(chalk.blue("🔍 Validando estrutura do APK..."));
    
    try {
      // Tentar listar conteúdo básico do APK
      const result = execSync(`unzip -l "${this.apkFile}" | head -10`, { 
        encoding: 'utf8',
        stdio: 'pipe' 
      });
      
      if (result.includes('AndroidManifest.xml')) {
        console.log(chalk.green("✅ APK válido - AndroidManifest.xml encontrado"));
      } else {
        console.log(chalk.yellow("⚠️  APK pode não ser válido - AndroidManifest.xml não encontrado"));
      }
      
      // Verificar se tem assets JS
      const hasJS = execSync(`unzip -l "${this.apkFile}" | grep -E "\\.(bundle|js)$" | head -3`, { 
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
      this.logError("Erro na validação do APK", error);
    }
    
    console.log("");
  }

  async showMenu() {
    const choices = [
      {
        name: '🚀 Análise Completa (Recomendado)',
        value: 'full',
        description: 'Executa todas as ferramentas disponíveis'
      },
      {
        name: '📦 Extração Básica (Unzip)',
        value: 'unzip',
        description: 'Extração rápida usando unzip'
      },
      {
        name: '🔧 Descompilação Avançada (APKTool)',
        value: 'apktool',
        description: 'Descompilação completa com APKTool'
      },
      {
        name: '✨ Beautify JavaScript',
        value: 'beautify',
        description: 'Formatar e embelezar código JS'
      },
      {
        name: '📊 Análise de Bundle',
        value: 'analyze',
        description: 'Análise detalhada do bundle React Native'
      },
      {
        name: '🖼️ Extrair Assets',
        value: 'assets',
        description: 'Copiar imagens, ícones e recursos'
      },
      {
        name: '📋 Bundle Visualizer',
        value: 'visualizer',
        description: 'Usar react-native-bundle-visualizer'
      },
      {
        name: '🎯 Seleção Personalizada',
        value: 'custom',
        description: 'Escolher múltiplas opções'
      }
    ];

    console.log(chalk.cyan.bold("🎯 Escolha uma opção de recuperação:\n"));

    const { selectedAction } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedAction',
        message: 'Selecione uma opção:',
        choices: choices,
        pageSize: 10
      }
    ]);

    if (selectedAction === 'custom') {
      await this.customSelection();
    } else if (selectedAction === 'full') {
      this.selectedOptions = ['unzip', 'apktool', 'beautify', 'analyze', 'assets'];
    } else {
      this.selectedOptions = [selectedAction];
    }

    await this.executeRecovery();
  }

  async customSelection() {
    const { customOptions } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'customOptions',
        message: 'Selecione as opções desejadas:',
        choices: [
          { name: '📦 Extração Unzip', value: 'unzip' },
          { name: '🔧 APKTool', value: 'apktool' },
          { name: '✨ Beautify JS', value: 'beautify' },
          { name: '📊 Análise Bundle', value: 'analyze' },
          { name: '🖼️ Assets', value: 'assets' },
          { name: '📋 Bundle Visualizer', value: 'visualizer' }
        ],
        validate: (answer) => {
          if (answer.length === 0) {
            return 'Selecione pelo menos uma opção';
          }
          return true;
        }
      }
    ]);

    this.selectedOptions = customOptions;
  }

  async executeRecovery() {
    console.log("");
    console.log(chalk.blue.bold("🚀 Iniciando processo de recuperação...\n"));
    console.log(chalk.gray(`📝 Logs serão salvos em: ${this.logFile}\n`));

    // Verificar dependências
    if (!this.checkDependencies()) {
      console.log(chalk.red("❌ Instale as dependências necessárias antes de continuar."));
      process.exit(1);
    }

    let outputDir = null;
    let bundlePath = null;

    // Executar opções selecionadas
    for (const option of this.selectedOptions) {
      switch (option) {
        case 'unzip':
          outputDir = await this.executeUnzip();
          break;
        case 'apktool':
          outputDir = await this.executeAPKTool();
          break;
        case 'beautify':
          if (!bundlePath) bundlePath = this.findJSBundle(outputDir);
          await this.executeBeautify(bundlePath, outputDir);
          break;
        case 'analyze':
          if (!bundlePath) bundlePath = this.findJSBundle(outputDir);
          await this.executeAnalysis(bundlePath, outputDir);
          break;
        case 'assets':
          if (!outputDir) outputDir = await this.executeUnzip();
          await this.executeAssets(outputDir);
          break;
        case 'visualizer':
          if (!bundlePath) bundlePath = this.findJSBundle(outputDir);
          await this.executeVisualizer(bundlePath);
          break;
      }
    }

    // Gerar relatório final
    if (outputDir) {
      this.generateFinalReport(outputDir);
    }

    this.showCompletionSummary(outputDir);
  }

  checkDependencies() {
    const deps = [
      { cmd: "unzip -v", name: "unzip" },
      { cmd: "npx --version", name: "npm/npx" }
    ];

    if (this.selectedOptions.includes('apktool')) {
      deps.push({ cmd: "apktool --version", name: "apktool" });
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

  async executeUnzip() {
    const outputDir = `${this.apkBaseName}-unzip`;
    console.log(chalk.blue(`📦 Executando extração unzip em: ${outputDir}/`));
    
    this.runCommand(`rm -rf "${outputDir}" && mkdir -p "${outputDir}"`);
    
    const success = this.runCommand(
      `unzip -q "${this.apkFile}" -d "${outputDir}"`,
      "Erro na extração unzip"
    );

    if (success) {
      console.log(chalk.green(`✅ Extração unzip concluída: ${outputDir}/\n`));
    }
    
    return outputDir;
  }

  async executeAPKTool() {
    const outputDir = `${this.apkBaseName}-apktool`;
    console.log(chalk.blue(`🔧 Executando APKTool em: ${outputDir}/`));
    
    const success = this.runCommand(
      `apktool d "${this.apkFile}" -o "${outputDir}" -f`,
      "Erro no APKTool"
    );

    if (success) {
      console.log(chalk.green(`✅ APKTool concluído: ${outputDir}/\n`));
    }
    
    return outputDir;
  }

  findJSBundle(outputDir) {
    if (!outputDir) return null;

    const possiblePaths = [
      path.join(outputDir, "assets", "index.android.bundle"),
      path.join(outputDir, "assets", "index.bundle"),
      path.join(outputDir, "assets", "main.jsbundle"),
      path.join(outputDir, "assets", "bundle.js")
    ];

    for (const bundlePath of possiblePaths) {
      if (fs.existsSync(bundlePath)) {
        console.log(chalk.green(`🎯 Bundle encontrado: ${path.basename(bundlePath)}`));
        return bundlePath;
      }
    }

    // Busca recursiva
    try {
      const result = execSync(
        `find "${outputDir}" -name "*.bundle" -o -name "*.js" | grep -E "(bundle|index)" | head -1`,
        { encoding: 'utf8', stdio: 'pipe' }
      );
      
      if (result.trim()) {
        console.log(chalk.green(`🎯 Bundle encontrado via busca: ${path.basename(result.trim())}`));
        return result.trim();
      }
    } catch {}

    console.log(chalk.yellow("⚠️  Bundle JavaScript não encontrado"));
    return null;
  }

  async executeBeautify(bundlePath, outputDir) {
    if (!bundlePath) {
      console.log(chalk.yellow("⚠️  Pulando beautify - bundle não encontrado\n"));
      return;
    }

    const beautifyDir = `${this.apkBaseName}-beautified`;
    const outputFile = path.join(beautifyDir, "index.pretty.js");
    
    console.log(chalk.blue(`✨ Executando beautify em: ${beautifyDir}/`));
    
    this.runCommand(`mkdir -p "${beautifyDir}"`);
    
    const success = this.runCommand(
      `npx js-beautify "${bundlePath}" -o "${outputFile}"`,
      "Erro no beautify"
    );

    if (success) {
      console.log(chalk.green(`✅ Beautify concluído: ${outputFile}\n`));
    }
  }

  async executeAnalysis(bundlePath, outputDir) {
    if (!bundlePath) {
      console.log(chalk.yellow("⚠️  Pulando análise - bundle não encontrado\n"));
      return;
    }

    const analysisDir = `${this.apkBaseName}-analysis`;
    console.log(chalk.blue(`📊 Executando análise em: ${analysisDir}/`));
    
    this.runCommand(`mkdir -p "${analysisDir}"`);

    try {
      const stats = fs.statSync(bundlePath);
      const content = fs.readFileSync(bundlePath, 'utf8');
      
      const analysis = this.generateBundleAnalysis(content, stats);
      const analysisFile = path.join(analysisDir, "bundle-analysis.md");
      
      fs.writeFileSync(analysisFile, analysis);
      console.log(chalk.green(`✅ Análise concluída: ${analysisFile}\n`));
    } catch (error) {
      this.logError("Erro na análise do bundle", error);
    }
  }

  async executeAssets(outputDir) {
    const assetsDir = `${this.apkBaseName}-assets`;
    console.log(chalk.blue(`🖼️  Executando extração de assets em: ${assetsDir}/`));
    
    this.runCommand(`mkdir -p "${assetsDir}"`);

    const folders = ["assets", "res", "drawable", "mipmap", "raw"];
    let copiedCount = 0;

    folders.forEach((folder) => {
      const src = path.join(outputDir, folder);
      if (fs.existsSync(src)) {
        this.runCommand(`cp -r "${src}" "${assetsDir}/"`, "", true);
        copiedCount++;
      }
    });

    console.log(chalk.green(`✅ ${copiedCount} tipos de assets copiados: ${assetsDir}/\n`));
  }

  async executeVisualizer(bundlePath) {
    if (!bundlePath) {
      console.log(chalk.yellow("⚠️  Pulando visualizer - bundle não encontrado\n"));
      return;
    }

    console.log(chalk.blue("📋 Executando Bundle Visualizer..."));
    
    const success = this.runCommand(
      `npx react-native-bundle-visualizer "${bundlePath}"`,
      "Erro no Bundle Visualizer (pode não estar instalado)",
      true
    );

    if (success) {
      console.log(chalk.green("✅ Bundle Visualizer executado\n"));
    }
  }

  generateBundleAnalysis(content, stats) {
    const libraries = this.detectLibraries(content);
    const moduleCount = (content.match(/__d\(function\(g,r,i,a,m,e,d\)/g) || []).length;
    
    return `
# 📊 Análise do Bundle - ${this.apkBaseName}

## 📈 Estatísticas Gerais
- **Tamanho**: ${(stats.size / 1024 / 1024).toFixed(2)} MB
- **Linhas**: ${content.split('\n').length.toLocaleString()}
- **Caracteres**: ${content.length.toLocaleString()}
- **Módulos detectados**: ${moduleCount}

## 📚 Bibliotecas Identificadas
${libraries.map(lib => `- ${lib}`).join('\n')}

## 🔍 Próximos Passos
1. Examine o código beautificado
2. Identifique componentes principais
3. Recrie estrutura do projeto
4. Reinstale dependências identificadas
5. Reimplemente funcionalidades

---
*Gerado em: ${new Date().toLocaleString()}*
    `.trim();
  }

  detectLibraries(content) {
    const commonLibs = [
      'react-native', 'react', 'redux', 'axios', 'lodash', 
      'moment', 'expo', 'navigation', '@react-native-community',
      'react-native-vector-icons', 'react-native-paper',
      'react-native-gesture-handler', 'react-native-screens'
    ];
    
    return commonLibs.filter(lib => 
      content.includes(`"${lib}"`) || 
      content.includes(`'${lib}'`) || 
      content.includes(lib.replace(/-/g, ''))
    );
  }

  generateFinalReport(outputDir) {
    const reportDir = `${this.apkBaseName}-report`;
    const reportFile = path.join(reportDir, "recovery-report.md");
    
    this.runCommand(`mkdir -p "${reportDir}"`);

    const report = `
# 🚀 Relatório de Recuperação - ${this.apkBaseName}

## 📱 Arquivo Original
- **APK**: \`${this.apkBaseName}.apk\`
- **Data**: ${new Date().toLocaleString()}
- **Opções executadas**: ${this.selectedOptions.join(', ')}

## 📁 Diretórios Gerados
${this.selectedOptions.map(opt => {
  switch(opt) {
    case 'unzip': return `- 📦 **Extração Unzip**: \`${this.apkBaseName}-unzip/\``;
    case 'apktool': return `- 🔧 **APKTool**: \`${this.apkBaseName}-apktool/\``;
    case 'beautify': return `- ✨ **Código Formatado**: \`${this.apkBaseName}-beautified/\``;
    case 'analyze': return `- 📊 **Análise**: \`${this.apkBaseName}-analysis/\``;
    case 'assets': return `- 🖼️ **Assets**: \`${this.apkBaseName}-assets/\``;
    default: return `- ${opt}`;
  }
}).join('\n')}

## 🛠️ Recomendações
1. **Comece pelo código beautificado** se disponível
2. **Examine a análise** para entender a estrutura
3. **Use os assets** extraídos no novo projeto
4. **Recrie o projeto** usando \`npx react-native init\`

## 📝 Logs
- Logs técnicos: \`${this.logFile}\`

---
*Recuperação realizada com sucesso! 🎉*
    `.trim();

    fs.writeFileSync(reportFile, report);
    console.log(chalk.blue(`📋 Relatório final gerado: ${reportFile}`));
  }

  showCompletionSummary(outputDir) {
    console.log("");
    console.log(chalk.green.bold("🎉 RECUPERAÇÃO CONCLUÍDA COM SUCESSO! 🎉\n"));
    
    console.log(chalk.cyan.bold("📁 Arquivos e diretórios criados:"));
    
    // Listar todos os diretórios criados
    const patterns = [
      `${this.apkBaseName}-unzip`,
      `${this.apkBaseName}-apktool`, 
      `${this.apkBaseName}-beautified`,
      `${this.apkBaseName}-analysis`,
      `${this.apkBaseName}-assets`,
      `${this.apkBaseName}-report`
    ];

    patterns.forEach(pattern => {
      if (fs.existsSync(pattern)) {
        console.log(chalk.green(`✅ ${pattern}/`));
      }
    });

    console.log("");
    console.log(chalk.yellow.bold("🚀 Próximos passos:"));
    console.log(chalk.white("1. Examine o relatório em") + chalk.cyan(` ${this.apkBaseName}-report/`));
    console.log(chalk.white("2. Veja o código formatado (se gerado)"));  
    console.log(chalk.white("3. Use os assets extraídos"));
    console.log(chalk.white("4. Recrie seu projeto React Native"));
    
    console.log("");
    console.log(chalk.gray(`📝 Logs salvos em: ${this.logFile}`));
    console.log("");
  }

  runCommand(cmd, errorMsg = "", silent = false) {
    try {
      const result = execSync(cmd, { 
        stdio: silent ? "pipe" : "inherit",
        encoding: "utf8"
      });
      return result;
    } catch (err) {
      if (errorMsg) {
        this.logError(errorMsg, err);
      }
      return null;
    }
  }

  logError(message, error) {
    const fullMessage = `[${new Date().toISOString()}] ${message}\n${error?.stack || error}\n\n`;
    fs.appendFileSync(this.logFile, fullMessage);
    console.error(chalk.red(`❌ ${message}`));
  }
}

// Inicializar CLI
const recovery = new InteractiveAPKRecovery();
recovery.init().catch(error => {
  console.error(chalk.red("Erro crítico:"), error);
  process.exit(1);
});