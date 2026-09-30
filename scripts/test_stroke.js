const fs = require('fs');
const path = require('path');

const svgDir = path.resolve(__dirname, '..', 'assets', 'kanjivg');
const sampleFile = path.join(svgDir, '05c71.svg'); // 山
const content = fs.readFileSync(sampleFile, 'utf-8');

const regex = /<path[^>]+id="kvg:[^"]+-s\d+"[^>]+d="([^"]+)"/g;
let match;
const strokes = [];
while ((match = regex.exec(content)) !== null) {
  strokes.push(match[1]);
}
console.log('Total strokes extracted for 山:', strokes.length);
console.log('Stroke 1:', strokes[0]);
