const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, '..', '..', 'backend', 'target', 'backend.jar');
const destDir = path.join(__dirname, '..', '..', 'data', 'jar');
const dest = path.join(destDir, 'backend.jar');

if (!fs.existsSync(source)) {
  console.error(`Backend jar not found: ${source}`);
  process.exit(1);
}

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

fs.copyFileSync(source, dest);
console.log(`Copied backend.jar to ${dest}`);
