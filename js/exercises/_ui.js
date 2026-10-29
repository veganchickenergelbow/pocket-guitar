// Shared tiny DOM helpers + styles for exercises.

export function h(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

export function button(label, cls, onClick) {
  const b = h('button', cls || 'btn', label);
  b.type = 'button';
  if (onClick) b.addEventListener('click', onClick);
  return b;
}

export function injectStyle() {
  if (typeof document === 'undefined' || document.getElementById('ex-style')) return;
  const s = document.createElement('style');
  s.id = 'ex-style';
  s.textContent = `
.ex-prompt{font-family:var(--font-display);font-size:1.2rem;line-height:1.3}
.ex-opt{min-height:44px;font-family:var(--font-body)}
.ex-opts{display:flex;flex-wrap:wrap;gap:var(--space-2)}
.ex-opt.right{border-color:var(--good);color:var(--good)}
.ex-opt.wrong{border-color:var(--bad);color:var(--bad)}
.ex-list{display:grid;gap:var(--space-2)}
.ex-list .ex-opt{text-align:left;justify-content:flex-start}
.ex-fb{min-height:1.4em}
.ex-fb.good{color:var(--good)} .ex-fb.bad{color:var(--bad)}
.ex-now{display:flex;gap:var(--space-4);align-items:flex-end;justify-content:center;flex-wrap:wrap}
.ex-now > div{text-align:center}
.ex-dots{display:flex;gap:var(--space-2);justify-content:center}
.ex-dot{width:12px;height:12px;border-radius:50%;background:var(--line)}
.ex-dot.on{background:var(--accent)}`;
  document.head.appendChild(s);
}
