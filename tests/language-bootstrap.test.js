import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../src/language-bootstrap.js', import.meta.url), 'utf8');
function run({ language = 'en-US', languages = [language], href = 'https://zguda.com/', root = './', saved = null, blocked = false } = {}) {
  let redirect = null;
  const values = new Map(saved ? [['zguda-language', saved]] : []);
  const document = {
    querySelector: () => ({ content: root }),
    documentElement: { dataset: {}, style: {} },
  };
  vm.runInNewContext(source, {
    URL, Set, document,
    window: {
      location: { href, replace: value => { redirect = value; } },
      navigator: { language, languages },
      localStorage: {
        getItem: key => { if (blocked) throw new Error('Blocked'); return values.get(key) || null; },
        setItem: (key, value) => { if (blocked) throw new Error('Blocked'); values.set(key, value); },
      },
    },
  });
  return { redirect, document, saved: values.get('zguda-language') };
}

test('Slavic primary browser languages keep the Polish page', () => {
  for (const language of ['pl-PL','cs-CZ','sk-SK','sl-SI','hr-HR','bs-BA','sr-Latn-RS','mk-MK','bg-BG','ru-RU','uk-UA','be-BY','hsb-DE','dsb-DE','csb','szl','rue','cnr','sh','cu','pol','ces','slk']) {
    assert.equal(run({ language }).redirect, null, language);
  }
});

test('other primary languages select English, preserving the page and hash', () => {
  for (const language of ['en-GB','de-DE','fr-FR','hu-HU','lt-LT','lv-LV','et-EE','es-ES','ja-JP','sq-AL']) {
    assert.equal(run({ language, href: 'https://zguda.com/historie/cieplo/#start', root: '../../' }).redirect, 'https://zguda.com/en/historie/cieplo/#start', language);
  }
  assert.equal(run({ languages: ['en-US','pl-PL'] }).redirect, 'https://zguda.com/en/');
});

test('manual choice overrides automatic selection and is saved', () => {
  assert.equal(run({ saved: 'pl' }).redirect, null);
  assert.equal(run({ language: 'pl-PL', saved: 'en' }).redirect, 'https://zguda.com/en/');
  const explicit = run({ href: 'https://zguda.com/?lang=pl', saved: 'en' });
  assert.equal(explicit.redirect, null);
  assert.equal(explicit.saved, 'pl');
});

test('direct English URLs stay English and deployment subdirectories work', () => {
  assert.equal(run({ language: 'pl-PL', href: 'https://zguda.com/en/', root: '../' }).redirect, null);
  assert.equal(run({ href: 'https://matyszguda.github.io/zguda.com/nofollow/?x=1#note', root: '../' }).redirect, 'https://matyszguda.github.io/zguda.com/en/nofollow/?x=1#note');
});

test('explicit Polish still works when browser storage is unavailable', () => {
  const result = run({ href: 'https://zguda.com/?lang=pl', blocked: true });
  assert.equal(result.redirect, null);
  assert.equal(result.document.documentElement.dataset.languageStorage, 'unavailable');
  assert.equal(run({ blocked: true }).redirect, 'https://zguda.com/en/');
});
