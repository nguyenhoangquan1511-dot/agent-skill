#!/usr/bin/env node
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { promptToolSelection, promptScope } from '../lib/prompts.js';
import { resolveTargetPaths } from '../lib/tool-paths.js';
import { installSkills } from '../lib/install.js';

async function main() {
  const selectedTools = await promptToolSelection();
  if (selectedTools.length === 0) {
    console.error('Bạn chưa chọn agent tool nào.');
    process.exit(1);
  }

  const scope = await promptScope();
  if (!scope) {
    process.exit(1);
  }

  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const skillsSourceDir = path.join(scriptDir, '..', 'skills');

  const targetPaths = resolveTargetPaths(selectedTools, scope, process.cwd(), os.homedir());
  const results = installSkills(targetPaths, skillsSourceDir);

  let successCount = 0;
  for (const result of results) {
    if (result.ok) {
      successCount += 1;
      console.log(`✔ ${result.targetPath}: ${result.installedSkills.join(', ')}`);
    } else {
      console.error(`✘ ${result.targetPath}: ${result.error}`);
    }
  }

  console.log(`\n${successCount}/${results.length} thư mục đích đã cài thành công.`);
  process.exit(successCount > 0 ? 0 : 1);
}

main();
