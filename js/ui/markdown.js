// Tiny safe markdown -> DOM. Input is only ever placed in text nodes (never innerHTML).
// Supports: paragraphs, **bold**, *italic*, `code`, "- " lists, "### " subheads.

const INLINE = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*\s][^*]*\*)/g;

function injectStyle() {
  if (typeof document === 'undefined' || document.getElementById('md-style')) return;
  const s = document.createElement('style');
  s.id = 'md-style';
  s.textContent = `
.md p{margin:0 0 var(--space-3);line-height:1.6}
.md h3{font-family:var(--font-display);font-size:1.05rem;margin:var(--space-4) 0 var(--space-2)}
.md ul{margin:0 0 var(--space-3);padding-left:1.25rem;line-height:1.6}
.md li{margin-bottom:var(--space-1)}
.md code{font-family:var(--font-mono);font-size:.9em;background:var(--surface-2);padding:1px 5px;border-radius:var(--r-sm)}
.md > :last-child{margin-bottom:0}`;
  document.head.appendChild(s);
}

function inline(parent, text) {
  let last = 0;
  let m;
  INLINE.lastIndex = 0;
  while ((m = INLINE.exec(text))) {
    if (m.index > last) parent.append(document.createTextNode(text.slice(last, m.index)));
    const tok = m[0];
    let node;
    if (tok[0] === '`') {
      node = document.createElement('code');
      node.textContent = tok.slice(1, -1);
    } else if (tok.startsWith('**')) {
      node = document.createElement('strong');
      inline(node, tok.slice(2, -2));
    } else {
      node = document.createElement('em');
      inline(node, tok.slice(1, -1));
    }
    parent.append(node);
    last = m.index + tok.length;
    INLINE.lastIndex = last;
  }
  if (last < text.length) parent.append(document.createTextNode(text.slice(last)));
}

/** Render markdown into a new <div class="md">. */
export function renderMarkdown(md) {
  injectStyle();
  const root = document.createElement('div');
  root.className = 'md';
  let para = [];
  let list = null;
  const flushPara = () => {
    if (!para.length) return;
    const p = document.createElement('p');
    inline(p, para.join(' '));
    root.append(p);
    para = [];
  };
  const flushList = () => { list = null; };
  for (const raw of String(md ?? '').split('\n')) {
    const line = raw.trim();
    if (!line) { flushPara(); flushList(); continue; }
    if (line.startsWith('### ')) {
      flushPara(); flushList();
      const h = document.createElement('h3');
      inline(h, line.slice(4));
      root.append(h);
    } else if (line.startsWith('- ')) {
      flushPara();
      if (!list) { list = document.createElement('ul'); root.append(list); }
      const li = document.createElement('li');
      inline(li, line.slice(2));
      list.append(li);
    } else {
      flushList();
      para.push(line);
    }
  }
  flushPara();
  return root;
}
