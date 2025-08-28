
import fs from "fs";
import path from "path";
import chalk from "chalk";
import { COMMON_LIBS, DIR_SUFFIX } from "./constants.js";
import { runCommand } from "./utils.js";

function detectLibraries(content) {
  return COMMON_LIBS.filter(lib =>
    content.includes(`"${lib}"`) ||
    content.includes(`'${lib}'`) ||
    content.includes(lib.replace(/-/g, ''))
  );
}

function generateBundleAnalysis(apkBaseName, content, stats) {
  const libraries = detectLibraries(content);
  const moduleCount = (content.match(/__d\(function\(g,r,i,a,m,e,d\)/g) || []).length;

  return `
# 📊 Análise do Bundle - ${apkBaseName}

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

export function executeAnalysis(apkBaseName, bundlePath, logFile) {
  if (!bundlePath) {
    console.log(chalk.yellow("⚠️  Pulando análise - bundle não encontrado\n"));
    return;
  }

  const analysisDir = `${apkBaseName}${DIR_SUFFIX.analysis}`;
  console.log(chalk.blue(`📊 Executando análise em: ${analysisDir}/
`));

  fs.mkdirSync(analysisDir, { recursive: true });

  try {
    const stats = fs.statSync(bundlePath);
    const content = fs.readFileSync(bundlePath, 'utf8');

    const analysis = generateBundleAnalysis(apkBaseName, content, stats);
    const analysisFile = path.join(analysisDir, "bundle-analysis.md");

    fs.writeFileSync(analysisFile, analysis);
    console.log(chalk.green(`✅ Análise concluída: ${analysisFile}\n`));
  } catch (error) {
    logError(logFile, "Erro na análise do bundle", error);
  }
}

export function generateFinalReport(apkBaseName, selectedOptions, logFile) {
  const reportDir = `${apkBaseName}${DIR_SUFFIX.report}`;
  const reportFile = path.join(reportDir, "recovery-report.md");

  fs.mkdirSync(reportDir, { recursive: true });

  const report = `
# 🚀 Relatório de Recuperação - ${apkBaseName}

## 📱 Arquivo Original
- **APK**: 
${apkBaseName}.apk
- **Data**: ${new Date().toLocaleString()}
- **Opções executadas**: ${selectedOptions.join(', ')}

## 📁 Diretórios Gerados
${selectedOptions.map(opt => {
    switch (opt) {
      case 'unzip': return `- 📦 **Extração Unzip**: 
${apkBaseName}${DIR_SUFFIX.unzip}/
`;
      case 'apktool': return `- 🔧 **APKTool**: 
${apkBaseName}${DIR_SUFFIX.apktool}/
`;
      case 'beautify': return `- ✨ **Código Formatado**: 
${apkBaseName}${DIR_SUFFIX.beautified}/
`;
      case 'analyze': return `- 📊 **Análise**: 
${apkBaseName}${DIR_SUFFIX.analysis}/
`;
      case 'assets': return `- 🖼️ **Assets**: 
${apkBaseName}${DIR_SUFFIX.assets}/
`;
      default: return `- ${opt}`;
    }
  }).join('\n')}

## 🛠️ Recomendações
1. **Comece pelo código beautificado** se disponível
2. **Examine a análise** para entender a estrutura
3. **Use os assets** extraídos no novo projeto
4. **Recrie o projeto** usando 
px react-native init

## 📝 Logs
- Logs técnicos: 
${logFile}

---
*Recuperação realizada com sucesso! 🎉*
    `.trim();

  fs.writeFileSync(reportFile, report);
  console.log(chalk.blue(`📋 Relatório final gerado: ${reportFile}`));
}
