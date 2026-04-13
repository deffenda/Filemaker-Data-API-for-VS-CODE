import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const extensionDir = path.resolve(import.meta.dirname, '..');
const designerDir = path.resolve(extensionDir, '..', 'designer-ui');
const requireFromDesigner = createRequire(path.join(designerDir, 'package.json'));

const requiredModules = ['react', 'react-dom/client', '@fmweb/shared/package.json'];
const hasDesignerDependencies = requiredModules.every((specifier) => {
  try {
    requireFromDesigner.resolve(specifier);
    return true;
  } catch {
    return false;
  }
});

if (!existsSync(designerDir)) {
  process.exit(0);
}

if (!hasDesignerDependencies) {
  console.warn(
    '[extension build] Skipping designer-ui bundle build; using fallback layout mode UI.'
  );
  process.exit(0);
}

execFileSync('npm', ['run', 'build'], {
  cwd: designerDir,
  stdio: 'inherit',
});
