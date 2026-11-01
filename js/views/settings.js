// Settings block, shown in Tools > Settings. Returns an element.
import { h } from '../dom.js';

const clampA4 = (n) => Math.min(450, Math.max(430, Math.round(Number(n) || 440)));

export function renderSettings(ctx) {
  const { store, navigate } = ctx;
  const s = () => store.get().settings;

  const a4 = h('input', { type: 'number', min: 430, max: 450, inputmode: 'numeric', value: String(s().a4), 'aria-label': 'A4 frequency in Hz' });
  const setA4 = (n) => { const v = clampA4(n); a4.value = String(v); store.update((st) => { st.settings.a4 = v; }); };
  a4.addEventListener('change', () => setA4(a4.value));

  const themeBtns = ['system', 'dark', 'light'].map((t) => h('button', {
    type: 'button', 'aria-pressed': String((s().theme || 'system') === t),
    onClick: () => { store.update((st) => { st.settings.theme = t; }); themeBtns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.t === (s().theme || 'system')))); },
    'data-t': t,
  }, t[0].toUpperCase() + t.slice(1)));

  const lefty = h('input', { type: 'checkbox', checked: !!s().leftHanded });
  lefty.addEventListener('change', () => store.update((st) => { st.settings.leftHanded = lefty.checked; }));

  // Backup
  const status = h('p', { class: 'small', role: 'status' });
  const box = h('textarea', { 'aria-label': 'Progress backup JSON', spellcheck: 'false', placeholder: 'Backup JSON appears here. To restore, paste a backup and tap Import.' });
  const say = (msg, bad) => { status.textContent = msg; status.style.color = bad ? 'var(--bad)' : 'var(--good)'; };

  const lastLine = () => `Last backup: ${store.get().lastBackup || 'never'}`;
  const backupInfo = h('p', { class: 'mono small muted' }, lastLine());
  const doExport = () => {
    box.value = store.exportJson(); box.select();
    store.markBackedUp(); backupInfo.textContent = lastLine();
    say('Backup ready. Copy it somewhere safe (Notes, email to yourself).');
  };
  const doCopy = async () => {
    if (!box.value) doExport();
    try { await navigator.clipboard.writeText(box.value); say('Copied to clipboard.'); }
    catch { box.select(); try { document.execCommand('copy'); say('Copied to clipboard.'); } catch { say('Select the text and copy it by hand.', true); } }
  };
  const doImport = () => {
    try {
      store.importJson(box.value.trim());
      say('Imported. Your progress is restored.');
      a4.value = String(s().a4); lefty.checked = !!s().leftHanded;
    } catch (e) { say(e.message, true); }
  };

  return h('section', { class: 'stack', 'aria-label': 'Settings' },
    h('h2', { class: 'h2' }, 'Settings'),
    h('div', { class: 'card stack' },
      h('label', { class: 'field' }, 'A4 reference pitch (Hz, 430–450)',
        h('div', { class: 'row' },
          h('button', { class: 'btn', type: 'button', 'aria-label': 'Lower A4', onClick: () => setA4(Number(a4.value) - 1) }, '−'),
          h('div', { style: { width: '96px' } }, a4),
          h('button', { class: 'btn', type: 'button', 'aria-label': 'Raise A4', onClick: () => setA4(Number(a4.value) + 1) }, '+'),
          h('button', { class: 'btn-ghost', type: 'button', onClick: () => setA4(440) }, 'Reset'))),
      h('div', { class: 'field' }, 'Theme', h('div', { class: 'seg' }, ...themeBtns)),
      h('label', { class: 'toggle-row' }, h('span', null, 'Left-handed diagrams'), lefty)),
    h('div', { class: 'card stack' },
      h('h3', { class: 'h2' }, 'Back up your progress'),
      h('p', { class: 'muted small' }, 'Your progress lives only on this device. iOS can clear a web app’s data if it goes unused for a while, so export a backup now and then.'),
      backupInfo,
      box,
      h('div', { class: 'row' },
        h('button', { class: 'btn', type: 'button', onClick: doExport }, 'Export'),
        h('button', { class: 'btn', type: 'button', onClick: doCopy }, 'Copy'),
        h('button', { class: 'btn', type: 'button', onClick: doImport }, 'Import')),
      status),
    h('div', null, h('button', { class: 'btn-ghost', type: 'button', onClick: () => navigate('placement') }, 'Redo placement check')));
}
