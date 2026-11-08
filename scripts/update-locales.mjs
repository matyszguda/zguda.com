import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, relative, posix } from 'node:path';
import { parse, serialize } from 'parse5';

const root = new URL('../', import.meta.url);
const pages = [
  { key: 'main', path: 'index.html', route: '' },
  { key: 'zero', path: 'historie/zero-camps/index.html', route: 'historie/zero-camps/' },
  { key: 'cieplo', path: 'historie/cieplo/index.html', route: 'historie/cieplo/' },
  { key: 'motto', path: 'historie/w-dzialaniu/index.html', route: 'historie/w-dzialaniu/' },
  { key: 'privacy', path: 'polityka-prywatnosci/index.html', route: 'polityka-prywatnosci/' },
  { key: 'backlog', path: 'nofollow/index.html', route: 'nofollow/' },
];
const bootstrap = (await readFile(new URL('src/language-bootstrap.js', root), 'utf8')).trim();
const headStart = '<!-- language-bootstrap:start -->';
const headEnd = '<!-- language-bootstrap:end -->';
const headPattern = /<!-- language-bootstrap:start -->[\s\S]*?<!-- language-bootstrap:end -->/g;
const togglePattern = /<a\b[^>]*class="language-toggle"[^>]*>[\s\S]*?<\/a>/g;
const attrsToTranslate = new Set(['alt', 'title', 'aria-label']);
const normalize = value => value.replace(/\s+/gu, ' ').trim();
const pageRoutes = new Map(pages.flatMap(page => [[`/${page.route}`, page], [`/${page.path}`, page]]));
const missing = new Set();
const check = process.argv.includes('--check');

function relativeTo(pagePath, destination) {
  const output = posix.relative(posix.dirname(pagePath), destination);
  return output ? (destination.endsWith('/') ? `${output}/` : output) : './';
}

function enhance(html, page, language) {
  const path = language === 'en' ? `en/${page.path}` : page.path;
  const siteRoot = `${relative(dirname(path), '.') || '.'}/`;
  const canonical = `https://zguda.com/${language === 'en' ? 'en/' : ''}${page.route}`;
  const head = `${headStart}<meta name="site-root" content="${siteRoot}"><link rel="canonical" href="${canonical}"><link rel="alternate" hreflang="pl" href="https://zguda.com/${page.route}"><link rel="alternate" hreflang="en" href="https://zguda.com/en/${page.route}"><link rel="alternate" hreflang="x-default" href="https://zguda.com/${page.route}"><script>${bootstrap}</script>${headEnd}`;
  let next = html.replace(headPattern, '');
  next = next.replace('</head>', `${head}</head>`);
  next = next.replace(togglePattern, '');
  const endHeader = next.indexOf('</header>');
  const endTools = next.lastIndexOf('</div>', endHeader);
  if (endHeader < 0 || endTools < next.indexOf('class="header-tools"')) throw new Error(`Header tools missing: ${path}`);
  const other = language === 'en' ? 'pl' : 'en';
  const target = relativeTo(path, `${other === 'en' ? 'en/' : ''}${page.route}`);
  const toggle = `<a class="language-toggle" href="${target}?lang=${other}" lang="${other}" hreflang="${other}" aria-label="${language === 'en' ? 'Switch to Polish' : 'Przełącz na angielski'}">${other.toUpperCase()}</a>`;
  next = next.slice(0, endTools) + toggle + next.slice(endTools);
  return next;
}

function translateNumeric(value) {
  if (/^\d{4}$/.test(value) && Number(value) >= 1900 && Number(value) <= 2100) return value;
  const match = value.match(/^([−-]?)(\d(?:[\d \u00a0\u202f]*\d)?)(?:,(\d+))?(\*)?$/u);
  if (!match) return null;
  const number = Number(`${match[1] === '−' ? '-' : match[1]}${match[2].replace(/\s/gu, '')}${match[3] ? `.${match[3]}` : ''}`);
  return new Intl.NumberFormat('en-GB', { minimumFractionDigits: match[3]?.length || 0, maximumFractionDigits: match[3]?.length || 0 }).format(number).replace('-', '−') + (match[4] || '');
}

function translated(value, dictionary, key) {
  const text = normalize(value);
  if (!text) return value;
  let output = dictionary[text];
  if (output === undefined) output = translateNumeric(text);
  if (output === null || output === undefined) {
    if (/^[\d\s,.−+*–—/:%]+$/u.test(text)) return value;
    missing.add(`${key}: ${JSON.stringify(text)}`);
    return value;
  }
  return value.match(/^\s*/u)[0] + output + value.match(/\s*$/u)[0];
}

function englishHtml(source, page, dictionary) {
  const tree = parse(source);
  const outputPath = `en/${page.path}`;
  const sourceURL = new URL(page.path, 'https://build.local/');
  function visit(node) {
    if (node.attrs?.some(attr => attr.name === 'class' && attr.value.split(' ').includes('language-toggle'))) return;
    if (node.nodeName === '#text') node.value = translated(node.value, dictionary, page.key);
    if (node.tagName === 'html') {
      const language = node.attrs.find(attr => attr.name === 'lang');
      if (language) language.value = 'en';
    }
    for (const attr of node.attrs || []) {
      if (attrsToTranslate.has(attr.name)) attr.value = translated(attr.value, dictionary, page.key);
      if (node.tagName === 'meta' && attr.name === 'content' && node.attrs.some(a => a.name === 'name' && a.value === 'description')) attr.value = translated(attr.value, dictionary, page.key);
      if (!['src', 'href'].includes(attr.name) || attr.value.startsWith('#') || node.tagName === 'link' && node.attrs.some(a => a.name === 'rel' && ['canonical', 'alternate'].includes(a.value))) continue;
      const destination = new URL(attr.value, sourceURL);
      if (destination.origin !== sourceURL.origin) continue;
      const targetPage = pageRoutes.get(destination.pathname);
      const target = targetPage ? `en/${targetPage.route}` : destination.pathname.slice(1);
      attr.value = relativeTo(outputPath, target) + destination.search + destination.hash;
    }
    if (node.tagName === 'script' || node.tagName === 'style') return;
    for (const child of node.childNodes || []) visit(child);
  }
  visit(tree);
  return enhance(serialize(tree), page, 'en');
}

const outputs = [];
for (const page of pages) {
  const original = await readFile(new URL(page.path, root), 'utf8');
  const polish = enhance(original, page, 'pl');
  const dictionary = JSON.parse(await readFile(new URL(`src/i18n/${page.key}.en.json`, root), 'utf8'));
  outputs.push([page.path, polish], [`en/${page.path}`, englishHtml(polish, page, dictionary)]);
}
if (missing.size) throw new Error(`Missing English translations:\n${[...missing].join('\n')}`);
for (const [path, next] of outputs) {
  let original = null;
  try { original = await readFile(new URL(path, root), 'utf8'); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  if (check) {
    if (original !== next) throw new Error(`${path}: language page is stale. Run npm run locales:generate.`);
  } else if (original !== next) {
    await mkdir(new URL(`${dirname(path)}/`, root), { recursive: true });
    await writeFile(new URL(path, root), next);
    console.log(`Updated ${path}`);
  }
}
if (check) console.log('Polish and English pages, links and language bootstrap are up to date.');
