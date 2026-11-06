/* Charliyah's Dream Farm — UI shell: HUD, navigation, modals, toasts, Clover bubble, effects */
(function () {
  'use strict';
  const DF = (window.DF = window.DF || {});
  const UI = (DF.UI = {});
  const A = () => DF.Art;
  DF.Views = DF.Views || {};

  /* ---------------- small helpers ---------------- */
  UI.esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  UI.$ = (sel, root) => (root || document).querySelector(sel);
  UI.$$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  UI.name = () => UI.esc(DF.state ? DF.state.name : DF.DEFAULT_NAME);
  UI.fill = (txt) => String(txt).replace(/\{name\}/g, DF.state ? DF.state.name : DF.DEFAULT_NAME);
  UI.pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  UI.shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  UI.reducedMotion = () => {
    const s = DF.state && DF.state.settings;
    if (s && s.motion === 'reduced') return true;
    if (s && s.motion === 'full') return false;
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };
  UI.applyMotion = () => document.documentElement.classList.toggle('reduce-motion', UI.reducedMotion());
  UI.itemName = (k) => {
    if (DF.CROPS[k]) return DF.CROPS[k].name;
    if (k.endsWith('_seed') && DF.CROPS[k.slice(0, -5)]) return DF.CROPS[k.slice(0, -5)].name + ' Seeds';
    if (k.endsWith('_sapling') && DF.TREES[k.slice(0, -8)]) return DF.TREES[k.slice(0, -8)].name + ' Sapling';
    const fr = Object.values(DF.TREES).find(t => t.fruit === k); if (fr) return fr.fruitName;
    if (DF.GOODS[k]) return DF.GOODS[k].name;
    if (DF.FURNITURE[k]) return DF.FURNITURE[k].name;
    if (DF.TOOLS[k]) return DF.TOOLS[k].name;
    return k;
  };
  UI.sellPrice = (k) => {
    if (DF.CROPS[k]) return DF.CROPS[k].sell;
    const fr = Object.values(DF.TREES).find(t => t.fruit === k); if (fr) return fr.sell;
    if (DF.GOODS[k]) return DF.GOODS[k].sell || 0;
    if (DF.FURNITURE[k]) return Math.max(2, Math.floor((DF.FURNITURE[k].price || 20) / 2));
    return 0;
  };
  UI.itemCategory = (k) => {
    if (k.endsWith('_seed') || k.endsWith('_sapling')) return 'seeds';
    if (DF.CROPS[k] || Object.values(DF.TREES).some(t => t.fruit === k)) return 'harvest';
    if (DF.FURNITURE[k]) return 'decor';
    if (DF.GOODS[k]) { const c = DF.GOODS[k].cat; return c === 'animal' ? 'animal' : c === 'other' ? 'other' : 'crafted'; }
    return 'other';
  };
  UI.coin = (n, cls) => `<span class="coin-amt ${cls || ''}">${A().ui('coin', 'coin-ic')}<b>${n}</b></span>`;

  /* ---------------- screen switching ---------------- */
  UI.showScreen = (id) => {
    UI.$$('.screen').forEach(s => s.classList.toggle('active', s.id === id));
  };

  /* ---------------- routing between game views ---------------- */
  UI.current = 'farm';
  UI.go = (view, opts) => {
    if (!DF.Views[view]) view = 'farm';
    const prev = UI.current;
    if (prev && prev !== view && DF.Views[prev] && DF.Views[prev].leave) DF.Views[prev].leave();
    if (prev !== view) UI.hideClover && UI.hideClover();
    UI.current = view;
    UI.viewOpts = opts || {};
    if (location.hash !== '#' + view) { try { history.replaceState(null, '', '#' + view); } catch (e) { /* file:// */ } }
    UI.$$('.nav-btn').forEach(b => {
      const on = b.dataset.view === view || (b.dataset.alt || '').split(',').includes(view);
      b.classList.toggle('active', on);
      if (on) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
    });
    UI.render(true);
    DF.emit('view', view);
  };
  UI.render = (scrollTop) => {
    const host = UI.$('#view');
    if (!host || !DF.state) return;
    const v = DF.Views[UI.current];
    const keepScroll = host.scrollTop;
    host.className = 'view view-' + UI.current;
    try { v.render(host, UI.viewOpts || {}); }
    catch (e) { console.error(e); host.innerHTML = `<div class="panel center"><h2>Oops!</h2><p>Something went a little wonky here. Clover is fixing it!</p><button class="btn" data-go="farm">Back to the farm</button></div>`; }
    host.scrollTop = scrollTop ? 0 : keepScroll;
    UI.renderHUD();
  };
  UI.refresh = () => UI.render(false);

  /* ---------------- HUD ---------------- */
  UI.renderHUD = () => {
    const s = DF.state; if (!s) return;
    const need = DF.xpToNext(s.level);
    const pct = Math.min(100, Math.round((s.xp / need) * 100));
    const phaseIcon = s.time.phase === 3 ? 'moon' : 'sun';
    const ready = DF.S.readyQuestCount();
    UI.$('#hud').innerHTML = `
      <button class="hud-me" data-act="wardrobe" aria-label="${UI.name()}, level ${s.level}. Change your look">
        <span class="hud-avatar">${A().avatar(s.avatar)}</span>
        <span class="hud-me-text"><span class="hud-name">${UI.name()}</span>
          <span class="hud-level"><span class="lvl-badge">Lv ${s.level}</span><span class="xpbar" role="progressbar" aria-valuemin="0" aria-valuemax="${need}" aria-valuenow="${s.xp}" aria-label="Experience"><span style="width:${pct}%"></span></span><span class="xp-num">${s.xp}/${need}</span></span></span>
      </button>
      <div class="hud-coins" aria-label="${s.coins} coins">${A().ui('coin')}<b>${s.coins}</b></div>
      <button class="hud-time" data-act="time" aria-label="${DF.S.phaseName()}, day ${s.time.day}, ${DF.S.season()}. Tap to rest">${A().ui(phaseIcon)}<span><b>${DF.S.phaseName()}</b><small>Day ${s.time.day} · ${DF.S.season()}${DF.S.isRainy() ? ' · 🌧' : ''}</small></span></button>
      <div class="hud-actions">
        <button class="hud-btn" data-act="quests" aria-label="Quest board${ready ? ', ' + ready + ' ready to claim' : ''}" title="Quest board">${A().ui('quests')}<span class="lbl">Quests</span>${ready ? `<span class="dot">${ready}</span>` : ''}</button>
        <button class="hud-btn" data-act="bag" aria-label="Inventory bag" title="My bag">${A().ui('bag')}<span class="lbl">Bag</span></button>
        <button class="hud-btn" data-go="journal" aria-label="Little Discoveries journal" title="Journal">${A().ui('journal')}<span class="lbl">Journal</span></button>
        <button class="hud-btn" data-act="sound" aria-label="Sound ${s.settings.sound ? 'on' : 'off'}" aria-pressed="${s.settings.sound}" title="Sound on/off">${A().ui(s.settings.sound ? 'sound' : 'mute')}<span class="lbl">${s.settings.sound ? 'Sound' : 'Muted'}</span></button>
        <button class="hud-btn" data-act="settings" aria-label="Settings" title="Settings">${A().ui('settings')}<span class="lbl">Settings</span></button>
      </div>
      <span class="save-ind" id="saveInd" aria-live="polite"></span>`;
  };
  let saveTimer;
  DF.on('saved', (ok) => {
    const el = UI.$('#saveInd'); if (!el) return;
    el.textContent = ok ? '✓ Saved' : '⚠ Not saved';
    el.classList.toggle('bad', !ok);
    el.classList.add('show');
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => el.classList.remove('show'), ok ? 1200 : 4000);
  });

  UI.renderNav = () => {
    const items = [
      ['farm', 'Farm', 'farm', 'pond'], ['garden', 'Garden', 'garden', 'orchard'], ['animals', 'Animals', 'animals'], ['house', 'House', 'house'],
      ['market', 'Market', 'market'], ['craft', 'Craft', 'craft'], ['learn', 'Learn', 'learn']
    ];
    UI.$('#nav').innerHTML = items.map(([v, label, icon, alt]) =>
      `<button class="nav-btn" data-view="${v}" data-go="${v}" ${alt ? `data-alt="${alt}"` : ''}>${A().ui(icon)}<span>${label}</span></button>`).join('');
  };

  /* ---------------- modal ---------------- */
  let modalStack = [];
  UI.modal = (o) => {
    const wrap = document.createElement('div');
    wrap.className = 'modal-wrap ' + (o.wrapClass || '');
    const id = 'm' + Math.random().toString(36).slice(2, 8);
    wrap.innerHTML = `<div class="modal ${o.cls || ''}" role="dialog" aria-modal="true" aria-labelledby="${id}">
        ${o.noClose ? '' : '<button class="modal-x" data-close aria-label="Close">✕</button>'}
        ${o.title ? `<h2 id="${id}" class="modal-title">${o.title}</h2>` : `<h2 id="${id}" class="sr-only">Dialog</h2>`}
        <div class="modal-body">${o.body || ''}</div>
        ${o.buttons ? `<div class="modal-btns">${o.buttons.map((b, i) => `<button class="btn ${b.cls || ''}" data-mbtn="${i}">${b.label}</button>`).join('')}</div>` : ''}
      </div>`;
    const prevFocus = document.activeElement;
    const close = (val) => {
      if (!wrap.isConnected) return;
      wrap.classList.add('closing');
      setTimeout(() => wrap.remove(), UI.reducedMotion() ? 0 : 160);
      modalStack = modalStack.filter(m => m !== api);
      if (prevFocus && prevFocus.focus && document.contains(prevFocus)) { try { prevFocus.focus({ preventScroll: true }); } catch (e) { /* ignore */ } }
      if (o.onClose) o.onClose(val);
    };
    const api = { el: wrap, close, o };
    wrap.addEventListener('click', (e) => {
      if (e.target === wrap && !o.noClose && !o.sticky) close();
      const x = e.target.closest('[data-close]'); if (x) { close(); return; }
      const b = e.target.closest('[data-mbtn]');
      if (b) { const btn = o.buttons[+b.dataset.mbtn]; const r = btn.onClick ? btn.onClick(api) : undefined; if (r !== false) close(btn.value); }
    });
    document.body.appendChild(wrap);
    modalStack.push(api);
    if (o.onMount) o.onMount(wrap.querySelector('.modal'), api);
    setTimeout(() => { const f = wrap.querySelector('[autofocus]') || wrap.querySelector('.modal-btns .btn') || wrap.querySelector('button'); if (f) try { f.focus({ preventScroll: true }); } catch (e) { /* ignore */ } }, 30);
    return api;
  };
  UI.closeAllModals = () => modalStack.slice().forEach(m => m.close());
  UI.topModal = () => modalStack[modalStack.length - 1];
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { const m = UI.topModal(); if (m && !m.o.noClose) m.close(); }
    if (e.key === 'Tab') {   // keep focus inside an open dialog
      const m = UI.topModal(); if (!m) return;
      const f = UI.$$('button:not([disabled]), input, select, [tabindex="0"]', m.el).filter(x => x.offsetParent !== null);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });
  UI.confirm = (title, text, yesLabel, onYes, opts) => UI.modal({
    title, cls: 'small', body: `<p>${text}</p>`,
    buttons: [{ label: 'Cancel', cls: 'ghost' }, { label: yesLabel || 'Yes', cls: (opts && opts.danger) ? 'danger' : 'primary', onClick: () => { onYes(); } }]
  });
  UI.ask = (title, label, value, onOk, maxLen) => UI.modal({
    title, cls: 'small',
    body: `<label class="field"><span>${label}</span><input type="text" id="askInput" maxlength="${maxLen || 14}" value="${UI.esc(value)}" autocomplete="off" autofocus></label>`,
    buttons: [{ label: 'Cancel', cls: 'ghost' }, { label: 'Save', cls: 'primary', onClick: (m) => { const v = m.el.querySelector('#askInput').value.replace(/[<>]/g, '').trim(); if (!v) return false; onOk(v); } }],
    onMount: (el, m) => { const i = el.querySelector('#askInput'); i.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); const b = el.querySelector('[data-mbtn="1"]'); b && b.click(); } }); }
  });

  /* ---------------- toasts ---------------- */
  UI.toast = (html, kind, ms) => {
    const host = UI.$('#toasts'); if (!host) return;
    const t = document.createElement('div');
    t.className = 'toast ' + (kind || '');
    t.setAttribute('role', 'status');
    t.innerHTML = html;
    host.appendChild(t);
    while (host.children.length > 2) host.firstChild.remove();
    setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 300); }, ms || 2600);
  };

  /* ---------------- Clover speech bubble ---------------- */
  let cloverTimer;
  UI.clover = (text, opts) => {
    opts = opts || {};
    const host = UI.$('#cloverPop'); if (!host) return;
    host.innerHTML = `<button class="clover-pop-btn" aria-label="Clover says: ${UI.esc(UI.fill(text))}. Tap to close">
        <span class="clover-pop-art ${opts.anim || 'bounce'}">${A().clover()}</span>
        <span class="bubble">${UI.esc(UI.fill(text))}${opts.extra || ''}<small>tap to close</small></span>
      </button>${opts.hearts ? UI.heartsBurst() : ''}`;
    host.classList.add('show');
    host.querySelector('.clover-pop-btn').onclick = () => UI.hideClover();
    clearTimeout(cloverTimer);
    if (!opts.sticky) cloverTimer = setTimeout(UI.hideClover, opts.ms || Math.max(4500, text.length * 55));
    if (opts.sound !== false) DF.Audio.play('baa');
  };
  UI.hideClover = () => { const h = UI.$('#cloverPop'); if (h) h.classList.remove('show'); };
  UI.heartsBurst = () => `<span class="hearts-burst" aria-hidden="true">${[0, 1, 2, 3, 4].map(i => `<i style="--i:${i}">${['💗', '✨', '💖', '🌸', '✨'][i]}</i>`).join('')}</span>`;

  /* ---------------- effects ---------------- */
  UI.floatText = (text, x, y, cls) => {
    const el = document.createElement('div');
    el.className = 'float-text ' + (cls || '');
    el.innerHTML = text;
    el.style.left = x + 'px'; el.style.top = y + 'px';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1200);
  };
  UI.floatAt = (target, text, cls) => {
    if (!target) return;
    const r = target.getBoundingClientRect();
    UI.floatText(text, r.left + r.width / 2, r.top + r.height * 0.3, cls);
  };
  UI.pop = (sel) => {
    const el = typeof sel === 'string' ? UI.$(sel) : sel; if (!el) return;
    el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop');
  };
  UI.confetti = () => {
    if (UI.reducedMotion()) return;
    const host = document.createElement('div');
    host.className = 'confetti'; host.setAttribute('aria-hidden', 'true');
    const bits = ['🌸', '✨', '🌼', '💖', '🍃', '⭐'];
    for (let i = 0; i < 22; i++) {
      const s = document.createElement('i');
      s.textContent = bits[i % bits.length];
      s.style.left = Math.random() * 100 + 'vw';
      s.style.animationDelay = Math.random() * 0.6 + 's';
      s.style.animationDuration = 1.8 + Math.random() * 1.4 + 's';
      s.style.fontSize = 14 + Math.random() * 14 + 'px';
      host.appendChild(s);
    }
    document.body.appendChild(host);
    setTimeout(() => host.remove(), 3600);
  };

  /* ---------------- global click delegation for common actions ---------------- */
  document.addEventListener('click', (e) => {
    const go = e.target.closest('[data-go]');
    if (go && DF.state && UI.$('#game').classList.contains('active')) {
      e.preventDefault();
      DF.Audio.play('tap');
      UI.closeAllModals();
      UI.go(go.dataset.go, go.dataset.opts ? JSON.parse(go.dataset.opts) : null);
      return;
    }
    const act = e.target.closest('#hud [data-act]');
    if (act) { DF.Audio.play('tap'); DF.Panels[act.dataset.act] && DF.Panels[act.dataset.act](); }
  });
  // Keyboard support for SVG hotspots & custom buttons
  document.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('[role="button"]:not(button)')) {
      e.preventDefault(); e.target.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }
  });
  window.addEventListener('hashchange', () => {
    if (!DF.state || !UI.$('#game').classList.contains('active')) return;
    const v = location.hash.replace('#', '');
    if (DF.Views[v] && v !== UI.current) UI.go(v);
  });

  DF.Panels = DF.Panels || {};
})();
