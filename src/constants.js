import chalk from "chalk";
import figlet from "figlet";
import gradient from "gradient-string";

export const WELCOME_MESSAGE = [
  gradient.pastel.multiline(
    figlet.textSync("React Native", { font: "Standard" })
  ),
  chalk.cyan.bold("╔══════════════════════════════════════════════╗"),
  chalk.cyan.bold("║        🚀 React Native APK Recovery CLI      ║"),
  chalk.cyan.bold("║                 Versão 3.0                   ║"),
  chalk.cyan.bold("╚══════════════════════════════════════════════╝"),
  "",
  chalk.white("📱  Recupere código fonte de APKs React Native"),
  chalk.white("🔧  Utilize múltiplas ferramentas e métodos"),
  chalk.white("📊  Análise completa com relatórios detalhados"),
  "",
  chalk.green("💡 Dicas de uso:"),
  chalk.yellow("  •") + " Execute " + chalk.cyan("recover-apk <file.apk>"),
  chalk.yellow("  •") + " Use " + chalk.cyan("--help") + " para ver comandos",
  chalk.yellow("  •") + " Relatórios salvos em " + chalk.cyan("./reports"),
  ""
].join("\n");


export const APK_CHOICE_PROMPT = {
  type: 'input',
  name: 'apkPath',
  message: '📂 Digite o caminho para o arquivo APK:',
};

export const RECOVERY_CHOICES = [
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

export const CUSTOM_SELECTION_PROMPT = {
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
};

export const DEPENDENCIES = [
  { cmd: "unzip -v", name: "unzip" },
  { cmd: "npx --version", name: "npm/npx" }
];

export const APKTOOL_DEPENDENCY = { cmd: "apktool --version", name: "apktool" };

export const BUNDLE_SEARCH_PATHS = [
  "assets/index.android.bundle",
  "assets/index.bundle",
  "assets/main.jsbundle",
  "assets/bundle.js"
];

export const ASSET_FOLDERS = ["assets", "res", "drawable", "mipmap", "raw"];

export const COMMON_LIBS = [
  'react-native', 'react', 'redux', 'axios', 'lodash', 
  'moment', 'expo', 'navigation', '@react-native-community',
  'react-native-vector-icons', 'react-native-paper',
  'react-native-gesture-handler', 'react-native-screens'
];

export const DIR_SUFFIX = {
  unzip: '-unzip',
  apktool: '-apktool',
  beautified: '-beautified',
  analysis: '-analysis',
  assets: '-assets',
  report: '-report',
};
