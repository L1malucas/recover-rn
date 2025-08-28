#!/usr/bin/env node

import chalk from 'chalk';
import { InteractiveAPKRecovery } from '../src/recovery.js';

const recovery = new InteractiveAPKRecovery();
recovery.init().catch(error => {
  console.error(chalk.red("Erro crítico:"), error);
  process.exit(1);
});
