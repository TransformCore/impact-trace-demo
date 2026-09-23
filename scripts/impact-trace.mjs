// Thin wrapper around the ImpactTrace CLI.
//
// ImpactTrace is not published to npm yet, and its GitHub package ships only
// `dist` in `files` without a `prepare` script — so a plain git dependency
// installs nothing runnable. This script clones it into `.impact-trace/`,
// builds it once, and forwards every argument to `impact-trace run`.

import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = process.env.IMPACT_TRACE_REPO ?? 'https://github.com/TransformCore/impact-trace.git';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const checkout = process.env.IMPACT_TRACE_HOME ?? join(root, '.impact-trace');
const cli = join(checkout, 'dist', 'cli', 'index.js');

function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, stdio: 'inherit', shell: false });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

if (!existsSync(join(checkout, 'package.json'))) {
  console.log(`Cloning ImpactTrace into ${checkout}...`);
  mkdirSync(dirname(checkout), { recursive: true });
  run('git', ['clone', '--depth', '1', REPO, checkout], root);
}

if (!existsSync(cli)) {
  console.log('Building ImpactTrace...');
  run('npm', ['install'], checkout);
  run('npm', ['run', 'build'], checkout);
}

const args = process.argv.slice(2);

// The CLI writes --output without creating parent directories.
const outputIndex = args.indexOf('--output');
if (outputIndex !== -1 && args[outputIndex + 1]) {
  mkdirSync(dirname(join(root, args[outputIndex + 1])), { recursive: true });
}

const result = spawnSync(process.execPath, [cli, 'run', ...args], {
  cwd: root,
  stdio: 'inherit',
});
process.exit(result.status ?? 1);
