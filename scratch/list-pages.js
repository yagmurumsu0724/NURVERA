const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else {
      results.push(path.relative(path.join(__dirname, '..'), fullPath));
    }
  });
  return results;
}

const pagesDir = path.join(__dirname, '..', 'src', 'pages');
console.log('Pages files:');
console.log(walk(pagesDir).join('\n'));
