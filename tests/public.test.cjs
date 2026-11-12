const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const site = path.join(root, 'site');
const read = file => fs.readFileSync(path.join(site, file), 'utf8');
const files = directory => fs.readdirSync(directory, { withFileTypes:true }).flatMap(entry => entry.isDirectory() ? files(path.join(directory, entry.name)) : [path.join(directory, entry.name)]);

test('deployment folder contains only intentionally public files', () => {
  const allowed = ['.nojekyll','index.html','locker.css','portfolio.css','app.js','scenarios.js','assets/sample-cover.svg','assets/study-board.svg'];
  const actual = files(site).map(file => path.relative(site,file).replaceAll('\\','/')).sort();
  assert.deepEqual(actual, allowed.sort());
});
test('no private documents, embedded raster files, local user paths or credential-like values', () => {
  for (const file of files(site)) {
    const text = fs.readFileSync(file,'utf8');
    assert.doesNotMatch(text, /data:image\/(?:png|jpe?g);base64/i, path.basename(file));
    assert.doesNotMatch(text, /[A-Z]:[\\/]Users[\\/]/i, path.basename(file));
    assert.doesNotMatch(text, /https?:\/\/(?:\d{1,3}\.){3}\d{1,3}/, path.basename(file));
    assert.doesNotMatch(text, /(?:gh[pousr]_[A-Za-z0-9]{24,}|github_pat_[A-Za-z0-9_]{30,}|sk-[A-Za-z0-9]{25,})/, path.basename(file));
    assert.doesNotMatch(text, /https?:\/\/[^\s'"<>]*(?:\.feishu\.cn|\.larksuite\.com|figma\.com)/i, path.basename(file));
    assert.doesNotMatch(text, /\b(?:fetch\(|XMLHttpRequest|WebSocket\(|sendBeacon\()/, path.basename(file));
  }
});
test('all deployed links are relative, fragments, or the owner project on GitHub', () => {
  const text = files(site).map(file => fs.readFileSync(file,'utf8')).join('\n');
  const urls = text.match(/https?:\/\/[^\s"'`<>]+/g) || [];
  for (const url of urls) {
    // The SVG XML namespace is an identifier, not a requested asset.
    if (url === 'http://www.w3.org/2000/svg') continue;
    assert.ok(url.startsWith('https://github.com/Miya-xia/ai-work-portfolio'), url);
  }
});
test('all static HTML file references exist and use subpath-safe paths', () => {
  for (const match of read('index.html').matchAll(/(?:src|href)="([^"#]+)"/g)) {
    const value = match[1];
    if (/^(https:|data:)/.test(value)) continue;
    assert.ok(!value.startsWith('/'), 'Absolute URL path would break a project site: ' + value);
    assert.ok(fs.existsSync(path.join(site,value.split('?')[0])), value);
  }
});
test('three fictional scenarios have explicit risk and review boundaries', () => {
  const context = { window:{} };
  vm.runInNewContext(read('scenarios.js'), context);
  const scenarios = context.window.PORTFOLIO_SCENARIOS;
  assert.equal(scenarios.length,3);
  assert.deepEqual(Array.from(scenarios, item => item.id), ['low','medium','high']);
  for (const item of scenarios) {
    assert.ok(item.messages.length > 0);
    assert.equal(item.signals.length,3);
    assert.ok(item.reply && item.checks && item.decision);
  }
  assert.match(scenarios[2].decision,/人工/);
  assert.match(read('app.js'),/不是模型实时推理/);
  assert.match(read('app.js'),/没有模型接口/);
});
test('seven objects point to seven implemented chapters', () => {
  const chapters = [...read('index.html').matchAll(/class="scene-object [^"]+" data-chapter="([^"]+)"/g)].map(match => match[1]);
  assert.equal(chapters.length,7);
  assert.equal(new Set(chapters).size,7);
  for (const id of chapters) assert.match(read('app.js'),new RegExp("id: '" + id + "'"));
});
test('keyboard support, reduced motion and local-only review controls exist', () => {
  assert.match(read('app.js'),/ArrowRight/);
  assert.match(read('app.js'),/prefers-reduced-motion/);
  assert.match(read('app.js'),/localStorage\.removeItem/);
  assert.match(read('app.js'),/URL\.createObjectURL/);
  assert.match(read('portfolio.css'),/prefers-reduced-motion/);
  assert.match(read('index.html'),/跳过开场/);
});
