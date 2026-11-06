/* Charliyah's Dream Farm — boot, title screen, avatar creation, welcome & tutorial */
(function () {
  'use strict';
  const DF = window.DF, UI = DF.UI, S = DF.S, A = DF.Art;

  /* ---------------- TITLE SCREEN ---------------- */
  function titleScene() {
    return `<svg class="title-scene" viewBox="0 0 1000 560" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMax slice">
      <defs><linearGradient id="tSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe3f7"/><stop offset="1" stop-color="#fdf1dc"/></linearGradient></defs>
      <rect width="1000" height="560" fill="url(#tSky)"/>
      <circle cx="880" cy="96" r="40" fill="#ffd34d"/><circle cx="880" cy="96" r="58" fill="#ffd34d" opacity=".18" class="sun-glow"/>
      <g class="clouds">${[[150, 90, 1], [470, 60, 1.2]].map(([x, y, s], i) => `<g class="cloud" style="--d:${i * 5}s"><g transform="translate(${x} ${y}) scale(${s})"><ellipse rx="56" ry="22" fill="#fff"/><ellipse cx="-34" cy="8" rx="34" ry="16" fill="#fff"/><ellipse cx="38" cy="8" rx="36" ry="16" fill="#fff"/></g></g>`).join('')}</g>
      <path d="M0 330 Q200 260 420 310 T820 290 T1000 300 L1000 560 L0 560Z" fill="#cfe7b2"/>
      <path d="M0 400 Q260 350 520 390 T1000 380 L1000 560 L0 560Z" fill="#a9d48a"/>
      <g transform="translate(500 400)">
        <ellipse cx="0" cy="8" rx="170" ry="16" fill="#000" opacity=".08"/>
        <rect x="70" y="-230" width="26" height="56" fill="#c98a6a"/>
        <path d="M-150 -130 L0 -240 L150 -130Z" fill="#ef8f86" stroke="#d4716a" stroke-width="5" stroke-linejoin="round"/>
        <path d="M-120 -140 L0 -226 L120 -140" stroke="#f6aca4" stroke-width="6" fill="none" stroke-dasharray="16 12"/>
        <rect x="-128" y="-134" width="256" height="140" rx="8" fill="#fff4e1" stroke="#e8d3b0" stroke-width="5"/>
        <rect x="-32" y="-74" width="64" height="80" rx="32" fill="#b9814f" stroke="#8d6040" stroke-width="5"/>
        ${[-96, 50].map(x => `<rect x="${x}" y="-110" width="46" height="42" rx="6" fill="#d5e9f7" stroke="#b9814f" stroke-width="5"/><path d="M${x + 23} -110 L${x + 23} -68 M${x} -89 L${x + 46} -89" stroke="#b9814f" stroke-width="3"/>`).join('')}
        <circle cx="0" cy="-170" r="18" fill="#d5e9f7" stroke="#b9814f" stroke-width="4"/>
        <path d="M-118 -98 Q-110 -112 -102 -98 M66 -98 Q74 -112 82 -98" stroke="#5aa94b" stroke-width="3" fill="none"/>
      </g>
      ${Array.from({ length: 16 }, (_, i) => { const x = 40 + i * 62, y = 470 + (i % 3) * 22; return `<g class="sway-flower" style="--d:${(i % 5) * 0.3}s"><path d="M${x} ${y + 30} L${x} ${y}" stroke="#5aa94b" stroke-width="4"/><g transform="translate(${x} ${y})">${A.petals(6, 0, 0, 6, 10, 9, ['#f58aa5', '#ffcd3c', '#fff', '#cdb9ef', '#f6b0a6'][i % 5])}<circle r="5" fill="#ffe792"/></g></g>`; }).join('')}
      <g class="title-animal ta1">${A.animal('chicken').replace('<svg ', '<svg x="200" y="380" width="120" height="110" ')}</g>
      <g class="title-animal ta2">${A.animal('rabbit').replace('<svg ', '<svg x="690" y="390" width="120" height="110" ')}</g>
      <g class="title-animal ta3">${A.animal('lamb').replace('<svg ', '<svg x="790" y="370" width="140" height="128" ')}</g>
      <g class="bf bf0"><g class="bf-wings"><path d="M0 0 C-20 -22 -26 8 -3 6 C-22 22 -6 28 0 8Z" fill="#f6a8c4"/><path d="M0 0 C20 -22 26 8 3 6 C22 22 6 28 0 8Z" fill="#ffd0e0"/></g></g>
      <g class="bf bf1"><g class="bf-wings"><path d="M0 0 C-20 -22 -26 8 -3 6 C-22 22 -6 28 0 8Z" fill="#a9d8e8"/><path d="M0 0 C20 -22 26 8 3 6 C22 22 6 28 0 8Z" fill="#d4eef7"/></g></g>
    </svg>`;
  }
  DF.showTitle = () => {
    UI.closeAllModals();
    DF.Games && DF.Games.close();
    UI.hideClover();
    const has = S.hasSave() && (DF.state || S.load());
    const name = has ? UI.esc(has.name || DF.DEFAULT_NAME) : DF.DEFAULT_NAME;
    const msg = has ? DF.CLOVER.back : DF.CLOVER.first;
    const host = UI.$('#title');
    host.innerHTML = `${titleScene()}
      <div class="title-content">
        <h1 class="game-title"><span class="t-small">Welcome to</span><span class="t-big">${DF.DEFAULT_NAME}'s Dream Farm!</span></h1>
        <p class="t-sub">A little world of your own, where dreams grow.</p>
        <p class="t-sub2">Your own little world is waiting for you.</p>
        <div class="title-btns">
          <button class="btn primary big" id="btnStart">🌱 Start My Adventure</button>
          ${has ? '<button class="btn big continue" id="btnContinue">🏡 Continue My Farm</button>' : ''}
        </div>
      </div>
      <div class="title-clover"><button class="tc-btn" id="titleClover" aria-label="Clover the lamb">${A.clover('bounce')}</button><div class="bubble">${UI.esc(msg.replace(/\{name\}/g, has ? has.name : DF.DEFAULT_NAME))}</div>${UI.heartsBurst()}</div>
      <button class="title-settings btn round" id="btnTitleSettings" aria-label="Settings">${A.ui('settings')}</button>`;
    UI.showScreen('title');
    try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { /* ignore */ }
    host.querySelector('#btnStart').onclick = () => {
      DF.Audio.play('tap');
      if (has) {
        UI.modal({
          title: 'Start a brand-new farm?', cls: 'small',
          body: `<p>You already have a farm, ${name}! Starting a new adventure will <b>replace</b> it, and everything on it will be gone.</p>`,
          buttons: [{ label: 'Continue my farm 🏡', cls: 'primary', onClick: () => continueGame() }, { label: 'Start over', cls: 'danger', onClick: () => { S.reset(); startCreate(); } }]
        });
      } else startCreate();
    };
    const c = host.querySelector('#btnContinue'); if (c) c.onclick = () => { DF.Audio.play('tap'); continueGame(); };
    host.querySelector('#titleClover').onclick = () => {
      const tc = host.querySelector('.title-clover');
      tc.classList.remove('cheer'); void tc.offsetWidth; tc.classList.add('cheer');
      host.querySelector('.title-clover .bubble').textContent = UI.pick(['Baa! Tap “Start My Adventure” and let’s go! 🌸', 'I can’t wait to show you the animals! 🐣', 'Did you know lambs love to jump and play? Just like me! 🐑']);
    };
    host.querySelector('#btnTitleSettings').onclick = titleSettings;
    if (DF._damagedSave) { DF._damagedSave = false; UI.toast('Your old save file was damaged, so a fresh farm is ready. (A backup was kept.)', '', 6000); }
  };
  function titleSettings() {
    const s = (DF.state && DF.state.settings) || { sound: false, motion: 'auto' };
    const m = UI.modal({
      title: '⚙️ Settings', cls: 'small',
      body: `<div class="settings"><label class="toggle"><input type="checkbox" id="tSound" ${s.sound ? 'checked' : ''} ${DF.state ? '' : 'disabled'}><span>Sound effects ${DF.state ? '' : '(available once your farm starts)'}</span></label>
        <label class="field"><span>Animations</span><select id="tMotion" ${DF.state ? '' : 'disabled'}><option value="auto" ${s.motion === 'auto' ? 'selected' : ''}>Follow my device</option><option value="full" ${s.motion === 'full' ? 'selected' : ''}>All animations</option><option value="reduced" ${s.motion === 'reduced' ? 'selected' : ''}>Calm (less movement)</option></select></label>
        ${DF.state ? '<button class="btn danger" id="tReset">Reset my farm</button>' : '<p class="muted">Start your adventure to unlock more settings.</p>'}</div>`
    });
    if (!DF.state) return;
    m.el.querySelector('#tSound').onchange = (e) => { DF.state.settings.sound = e.target.checked; S.save(); DF.Audio.play('pet'); };
    m.el.querySelector('#tMotion').onchange = (e) => { DF.state.settings.motion = e.target.value; UI.applyMotion(); S.save(); };
    m.el.querySelector('#tReset').onclick = () => { m.close(); UI.confirm('Reset your farm?', 'This erases everything on this farm. It can’t be undone.', 'Erase farm', () => { S.reset(); DF.showTitle(); }, { danger: true }); };
  }

  /* ---------------- AVATAR CREATION ---------------- */
  function startCreate() {
    const st = S.defaultState();
    const av = Object.assign({}, st.avatar);
    const host = UI.$('#create');
    host.innerHTML = `<div class="create-wrap">
      <div class="create-head">${A.clover('bounce')}<div class="bubble static">First, let’s make you! Choose your hairstyle, colours, outfit and a cute accessory. ✨</div></div>
      <div id="avHost"></div>
      <label class="field inline name-field"><span>What should Clover call you?</span><input id="nameIn" type="text" maxlength="14" value="${DF.DEFAULT_NAME}" autocomplete="off"></label>
      <div class="create-btns"><button class="btn ghost" id="cBack">← Back</button><button class="btn primary big" id="cDone">This is me! ✨</button></div>
    </div>`;
    UI.showScreen('create');
    DF.AvatarEditor(host.querySelector('#avHost'), av);
    host.querySelector('#cBack').onclick = () => DF.showTitle();
    host.querySelector('#cDone').onclick = () => {
      const nm = host.querySelector('#nameIn').value.replace(/[<>]/g, '').trim().slice(0, 14) || DF.DEFAULT_NAME;
      DF.state = S.defaultState();
      DF.state.avatar = av;
      DF.state.name = nm;
      DF.state.flags.visits = 1;
      S.save();
      enterGame(true);
    };
  }

  /* ---------------- ENTER GAME ---------------- */
  function continueGame() {
    DF.state = DF.state || S.load();
    if (!DF.state) { startCreate(); return; }
    DF.state.flags.visits += 1;
    S.save();
    enterGame(false);
  }
  function enterGame(isNew) {
    UI.closeAllModals();
    UI.applyMotion();
    UI.renderNav();
    UI.showScreen('game');
    const hv = location.hash.replace('#', '');
    UI.go(DF.Views[hv] ? hv : 'farm');
    DF.Audio.setAmbient(DF.state.settings.sound && DF.state.settings.ambient);
    S.discoverRecipes();
    if (isNew || !DF.state.flags.introSeen) {
      const m = UI.modal({
        title: '', cls: 'welcome', noClose: true,
        body: `<div class="welcome-in"><div class="wl-clover">${A.clover('wave')}${UI.heartsBurst()}</div>
          <p class="wl-msg">${UI.esc(UI.fill(DF.CLOVER.first))}</p></div>`,
        buttons: [{ label: 'Skip the tour', cls: 'ghost', onClick: () => { DF.state.flags.introSeen = true; DF.state.flags.tutorialDone = true; S.save(); } },
          { label: 'Yes! Let’s go! 🌸', cls: 'primary', onClick: () => { DF.state.flags.introSeen = true; S.save(); DF.Tutorial.start(); } }]
      });
      DF.Audio.play('baa');
      return m;
    }
    setTimeout(() => UI.clover(`Welcome back, ${DF.state.name}! ${DF.cloverHint()}`, { hearts: true, anim: 'wave', ms: 7000 }), 500);
    if (!DF.state.flags.tutorialDone) DF.Tutorial.start();
  }

  /* ---------------- TUTORIAL (short, interactive, skippable) ---------------- */
  const T = (DF.Tutorial = {});
  let base = {};
  const snap = () => ({ plant: S.statValue('plant_any'), water: S.statValue('water'), P: DF.state.time.P, harvest: S.statValue('harvest_any'), feed: S.statValue('feed') });
  const STEPS = [
    { text: 'This is your farm! Tap <b>Garden</b> at the bottom to visit your veggie patch.', target: '.nav-btn[data-view="garden"]', done: () => UI.current === 'garden' },
    { text: 'Tap an <b>empty plot</b>, then choose <b>Carrot</b> seeds. 🥕', target: '.plot.empty', done: () => S.statValue('plant_any') > base.plant, view: 'garden' },
    { text: 'Lovely! Now tap your seedling to give it a drink. 💧', target: '.plot.thirsty', done: () => S.statValue('water') > base.water, view: 'garden' },
    { text: 'Plants drink once in each part of the day. Tap the <b>sun</b> at the top to rest until later. ☀️', target: '.hud-time', done: () => DF.state.time.P > base.P },
    { text: 'Time passed! Water your carrot once more. 💧', target: '.plot.thirsty', done: () => DF.state.plots.some(S.plotReady), view: 'garden' },
    { text: 'It’s sparkling — that means it’s ready! Tap to <b>harvest</b>. 🧺', target: '.plot.ready', done: () => S.statValue('harvest_any') > base.harvest, view: 'garden' },
    { text: 'Yay, your first harvest! Now let’s meet the animals. Tap <b>Animals</b>.', target: '.nav-btn[data-view="animals"]', done: () => UI.current === 'animals' },
    { text: 'Tap <b>Feed</b> to give one of your friends their dinner. 🍽', target: '.care-btns [data-act="feed"]', done: () => S.statValue('feed') > base.feed, view: 'animals' },
    { text: 'You’re a natural! Sell harvests at the <b>Market</b>, play games in the <b>Treehouse</b>, and decorate your <b>House</b>. Quests are on the 📋 board. Tap me anytime for tips!', target: null, final: true }
  ];
  T.start = (restart) => {
    const f = DF.state.flags;
    if (restart) { f.tutorialDone = false; f.tutStep = 0; }
    base = snap();
    // make sure the first steps are always possible (seeds to plant)
    if (!S.has('carrot_seed') && f.tutStep <= 1) S.add('carrot_seed', 1);
    T.update();
  };
  T.skip = () => { DF.state.flags.tutorialDone = true; S.save(); T.hide(); UI.toast('Tutorial skipped. Tap Clover anytime for tips! 🐑'); };
  T.hide = () => { const b = UI.$('#tutBar'); b.classList.remove('show'); b.innerHTML = ''; UI.$$('.tut-glow').forEach(x => x.classList.remove('tut-glow')); };
  T.update = () => {
    const s = DF.state;
    if (!s || s.flags.tutorialDone || !s.flags.introSeen || !UI.$('#game').classList.contains('active')) { if (UI.$('#tutBar')) T.hide(); return; }
    let step = STEPS[s.flags.tutStep];
    let guard = 0;
    while (step && !step.final && step.done() && guard++ < 10) { s.flags.tutStep++; base = snap(); step = STEPS[s.flags.tutStep]; S.save(); }
    if (!step) { s.flags.tutorialDone = true; S.save(); T.hide(); return; }
    const bar = UI.$('#tutBar');
    bar.innerHTML = `<div class="tut-in"><span class="tut-clover">${A.clover()}</span><p>${step.text}</p>
      <div class="tut-btns">${step.final ? '<button class="btn primary" data-tut="finish">Let’s farm! 🌸</button>' : `<span class="tut-count">${s.flags.tutStep + 1}/${STEPS.length - 1}</span><button class="btn ghost small" data-tut="skip">Skip tutorial</button>`}</div></div>`;
    bar.classList.add('show');
    UI.$$('.tut-glow').forEach(x => x.classList.remove('tut-glow'));
    if (step.target) { const t = UI.$(step.target); if (t) t.classList.add('tut-glow'); }
    if (step.view && UI.current !== step.view && !UI.topModal()) { /* gently guide back */ const nb = UI.$(`.nav-btn[data-view="${step.view}"]`); nb && nb.classList.add('tut-glow'); }
  };
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-tut]'); if (!b) return;
    if (b.dataset.tut === 'skip') T.skip();
    if (b.dataset.tut === 'finish') {
      DF.state.flags.tutorialDone = true;
      S.addCoins(10); S.addXP(10); S.commit();
      T.hide(); UI.confetti(); DF.Audio.play('quest');
      UI.clover('Tutorial complete! Here are 10 coins to start you off. Have fun, and remember — there’s no rush on Dream Farm. 💖', { hearts: true });
    }
  });
  const origRender = UI.render;
  UI.render = function () { origRender.apply(UI, arguments); T.update(); };
  DF.on('changed', () => T.update());

  /* ---------------- BOOT ---------------- */
  function boot() {
    DF.state = S.load();
    UI.applyMotion();
    if (window.matchMedia) { try { window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', UI.applyMotion); } catch (e) { /* old Safari */ } }
    DF.showTitle();
    document.addEventListener('pointerdown', () => DF.Audio.unlock(), { once: true });
    document.addEventListener('visibilitychange', () => { if (document.hidden && DF.state) S.save(); });
    // Optional offline support — never allowed to break the game
    if ('serviceWorker' in navigator && /^https?:/.test(location.protocol)) {
      window.addEventListener('load', () => { navigator.serviceWorker.register('./sw.js').catch(() => { /* offline mode just won't be available */ }); });
    }
  }
  window.addEventListener('error', (e) => { console.error('Dream Farm error:', e.message); });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
