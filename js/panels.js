/* Charliyah's Dream Farm — pop-up panels: quests, bag, settings, wardrobe, rest, celebrations */
(function () {
  'use strict';
  const DF = window.DF, UI = DF.UI, S = DF.S, A = DF.Art;
  const P = (DF.Panels = DF.Panels || {});

  /* ---------------- Avatar editor (used by creation screen & wardrobe) ---------------- */
  DF.AvatarEditor = function (host, avatar, onChange, opts) {
    opts = opts || {};
    const lvl = DF.state ? DF.state.level : 1;
    let tab = 'hair';
    const tabs = [['hair', 'Hairstyle'], ['hairColor', 'Hair colour'], ['skin', 'Skin tone'], ['outfit', 'Outfit'], ['outfitColor', 'Colour'], ['acc', 'Accessory']];
    function draw() {
      let opts2 = '';
      if (tab === 'hair') opts2 = DF.AVATAR.hair.map(h => optBtn('hair', h.id, A.avatar(Object.assign({}, avatar, { hair: h.id, acc: 'none' })), h.name)).join('');
      if (tab === 'hairColor') opts2 = DF.AVATAR.hairColor.map(c => swatch('hairColor', c)).join('');
      if (tab === 'skin') opts2 = DF.AVATAR.skin.map(c => swatch('skin', c)).join('');
      if (tab === 'outfitColor') opts2 = DF.AVATAR.outfitColor.map(c => swatch('outfitColor', c)).join('');
      if (tab === 'outfit') opts2 = DF.AVATAR.outfit.map(o => optBtn('outfit', o.id, A.avatar(Object.assign({}, avatar, { outfit: o.id })), o.name, o.lvl)).join('');
      if (tab === 'acc') opts2 = DF.AVATAR.acc.map(o => optBtn('acc', o.id, A.avatar(Object.assign({}, avatar, { acc: o.id })), o.name, o.lvl)).join('');
      host.innerHTML = `<div class="av-editor">
        <div class="av-preview">${A.avatar(avatar, 'bob')}</div>
        <div class="av-controls">
          <div class="chip-tabs" role="tablist">${tabs.map(([k, l]) => `<button role="tab" aria-selected="${tab === k}" class="chip ${tab === k ? 'on' : ''}" data-tab="${k}">${l}</button>`).join('')}</div>
          <div class="av-options ${['hairColor', 'skin', 'outfitColor'].includes(tab) ? 'swatches' : ''}">${opts2}</div>
        </div></div>`;
    }
    function optBtn(field, id, art, label, needLvl) {
      const locked = needLvl && needLvl > lvl;
      return `<button class="av-opt ${avatar[field] === id ? 'on' : ''} ${locked ? 'locked' : ''}" data-f="${field}" data-v="${id}" ${locked ? `data-lock="${needLvl}"` : ''} aria-pressed="${avatar[field] === id}" aria-label="${label}${locked ? ', unlocks at level ' + needLvl : ''}">
        <span class="av-opt-art">${art}</span><span class="av-opt-l">${label}${locked ? `<em>🔒 Lv ${needLvl}</em>` : ''}</span></button>`;
    }
    function swatch(field, c) {
      return `<button class="swatch ${avatar[field] === c ? 'on' : ''}" style="--c:${c}" data-f="${field}" data-v="${c}" aria-pressed="${avatar[field] === c}" aria-label="Colour ${c}"></button>`;
    }
    host.addEventListener('click', (e) => {
      const t = e.target.closest('[data-tab]'); if (t) { tab = t.dataset.tab; DF.Audio.play('tap'); draw(); return; }
      const o = e.target.closest('[data-f]'); if (!o) return;
      if (o.dataset.lock) { UI.toast(`🔒 This unlocks at level ${o.dataset.lock}. Keep farming!`); return; }
      avatar[o.dataset.f] = o.dataset.v;
      DF.Audio.play('pet');
      draw();
      onChange && onChange(avatar);
    });
    draw();
  };

  /* ---------------- Wardrobe ---------------- */
  P.wardrobe = () => {
    const av = Object.assign({}, DF.state.avatar);
    UI.modal({
      title: 'My Wardrobe', cls: 'wide',
      body: `<div id="wardHost"></div>
        <label class="field inline"><span>What should Clover call you?</span><input id="nickIn" type="text" maxlength="14" value="${UI.esc(DF.state.name)}"></label>`,
      onMount: (el) => DF.AvatarEditor(el.querySelector('#wardHost'), av),
      buttons: [{ label: 'Cancel', cls: 'ghost' }, {
        label: 'Save my look ✨', cls: 'primary', onClick: (m) => {
          DF.state.avatar = av;
          const n = m.el.querySelector('#nickIn').value.replace(/[<>]/g, '').trim();
          if (n) DF.state.name = n.slice(0, 14);
          S.commit(); UI.refresh(); UI.toast('Looking wonderful! ✨');
        }
      }]
    });
  };

  /* ---------------- Quest board ---------------- */
  P.quests = () => {
    const m = UI.modal({ title: '📋 Quest Board', cls: 'wide', body: '<div id="qList"></div>' });
    const draw = () => {
      const list = S.questsAvailable();
      const order = { ready: 0, active: 1, claimed: 2 };
      list.sort((a, b) => order[S.questState(a)] - order[S.questState(b)]);
      const locked = DF.QUESTS.filter(q => q.lvl > DF.state.level).length;
      m.el.querySelector('#qList').innerHTML = `<div class="quest-list">${list.map(q => {
        const stt = S.questState(q), prog = S.questProgress(q);
        const pct = Math.round((prog / q.goal) * 100);
        const r = q.reward;
        const rewards = [r.coins ? UI.coin(r.coins) : '', r.xp ? `<span class="xp-pill">+${r.xp} XP</span>` : '', r.items ? Object.entries(r.items).map(([k, n]) => `<span class="item-pill">${A.icon(k)}${n}×</span>`).join('') : ''].join('');
        const progText = q.unit === '%' ? `${S.hearts({ friend: prog })} / ${Math.floor(q.goal / 20)} hearts` : `${prog} / ${q.goal}`;
        return `<div class="quest-card ${stt}">
          <div class="quest-main"><h3>${stt === 'claimed' ? '✅ ' : ''}${q.title}</h3><p>${q.desc}${q.hint && stt === 'active' ? ` <em>${q.hint}</em>` : ''}</p>
            <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="${q.goal}" aria-valuenow="${prog}" aria-label="${q.title} progress"><span style="width:${pct}%"></span></div>
            <div class="quest-meta"><span class="prog-txt">${progText}</span><span class="rewards">${rewards}</span></div></div>
          ${stt === 'ready' ? `<button class="btn primary claim" data-claim="${q.id}">Claim!</button>` : ''}
        </div>`;
      }).join('')}</div>${locked ? `<p class="muted center">🔒 ${locked} more quest${locked > 1 ? 's' : ''} appear as you level up.</p>` : ''}`;
    };
    m.el.addEventListener('click', (e) => {
      const b = e.target.closest('[data-claim]'); if (!b) return;
      const q = DF.QUESTS.find(x => x.id === b.dataset.claim);
      if (S.claimQuest(q)) {
        DF.Audio.play('quest');
        UI.confetti();
        S.commit();
        UI.renderHUD();
        draw();
        UI.clover(UI.pick(DF.CLOVER.quest), { hearts: true, anim: 'hop' });
      }
    });
    draw();
  };

  /* ---------------- Bag / inventory ---------------- */
  P.bag = (startCat) => {
    let cat = startCat || 'all';
    const cats = [['all', 'All'], ['seeds', 'Seeds'], ['harvest', 'Harvest'], ['animal', 'Animal goods'], ['crafted', 'Crafted'], ['decor', 'Decor'], ['other', 'Bits & bobs']];
    const m = UI.modal({ title: '🎒 My Bag', cls: 'wide', body: '<div id="bagHost"></div>' });
    const draw = () => {
      const inv = DF.state.inv;
      const keys = Object.keys(inv).filter(k => inv[k] > 0 && (cat === 'all' || UI.itemCategory(k) === cat)).sort((a, b) => UI.itemCategory(a).localeCompare(UI.itemCategory(b)) || UI.itemName(a).localeCompare(UI.itemName(b)));
      const tools = Object.keys(DF.state.tools).filter(t => DF.state.tools[t]);
      m.el.querySelector('#bagHost').innerHTML = `
        <div class="chip-tabs">${cats.map(([k, l]) => `<button class="chip ${cat === k ? 'on' : ''}" data-cat="${k}">${l}</button>`).join('')}</div>
        ${keys.length ? `<div class="item-grid">${keys.map(k => `<button class="item-tile" data-item="${k}" aria-label="${UI.itemName(k)}, ${inv[k]}">${A.icon(k)}<span class="cnt">${inv[k]}</span><span class="nm">${UI.itemName(k)}</span></button>`).join('')}</div>`
          : `<p class="empty-note">Nothing here yet! ${cat === 'seeds' ? 'Buy seeds at the Market.' : 'Keep exploring your farm.'}</p>`}
        ${tools.length && cat === 'all' ? `<h3 class="sub">My tools</h3><div class="item-grid">${tools.map(k => `<div class="item-tile tool">${A.icon(k)}<span class="nm">${DF.TOOLS[k].name}</span></div>`).join('')}</div>` : ''}`;
    };
    m.el.addEventListener('click', (e) => {
      const c = e.target.closest('[data-cat]'); if (c) { cat = c.dataset.cat; draw(); return; }
      const it = e.target.closest('[data-item]'); if (it) P.itemInfo(it.dataset.item, draw);
    });
    draw();
  };
  P.itemInfo = (k, after) => {
    const g = DF.GOODS[k];
    let desc = g ? g.desc : '';
    let extra = '';
    if (DF.CROPS[k]) desc = `A fresh ${DF.CROPS[k].name.toLowerCase()} from your garden. Sells for ${DF.CROPS[k].sell} coins.`;
    if (k.endsWith('_seed')) { const c = DF.CROPS[k.slice(0, -5)]; if (c) desc = `Plant in the Garden. Needs ${c.water} waterings, each in a different part of the day.`; }
    if (k.endsWith('_sapling')) desc = 'Plant it in the Orchard. Once grown, it gives fruit again and again!';
    if (DF.FURNITURE[k]) desc = `${DF.THEMES[DF.FURNITURE[k].theme].name} collection · goes on the ${DF.FURNITURE[k].zone === 'yard' ? 'front garden' : DF.FURNITURE[k].zone}. Place it from the House.`;
    const fact = DF.CROPS[k] ? DF.CROPS[k].fact : null;
    if (fact && DF.state.facts.includes(fact)) extra = `<div class="fact-mini">💡 ${DF.FACTS[fact].text}</div>`;
    const buttons = [{ label: 'Close', cls: 'ghost' }];
    if (k === 'seed_packet') buttons.push({ label: 'Open packet 🎁', cls: 'primary', onClick: () => { P.openPacket(); after && after(); } });
    if (DF.FURNITURE[k]) buttons.push({ label: 'Go decorate', cls: 'primary', onClick: () => { UI.closeAllModals(); UI.go('house', { zone: DF.FURNITURE[k].zone === 'yard' ? 'yard' : 'inside', select: k }); } });
    UI.modal({ title: UI.itemName(k), cls: 'small', body: `<div class="item-info"><div class="big-icon">${A.icon(k)}</div><p>${desc}</p><p class="muted">You have <b>${S.count(k)}</b>.</p>${extra}</div>`, buttons });
  };
  P.openPacket = () => {
    if (!S.take('seed_packet')) return;
    const avail = Object.keys(DF.CROPS).filter(c => DF.CROPS[c].lvl <= DF.state.level);
    const c = avail[(S.statValue('packets') || 0) % avail.length];   // rotates fairly, no randomness
    S.stat('packets');
    S.add(c + '_seed', 3);
    S.commit();
    DF.Audio.play('harvest');
    UI.toast(`🎁 3 × ${DF.CROPS[c].name} seeds!`);
  };

  /* ---------------- Time / rest ---------------- */
  P.time = () => {
    const s = DF.state;
    const nextName = DF.PHASES[(s.time.phase + 1) % 4];
    const thirsty = s.plots.filter(S.plotThirsty).length;
    UI.modal({
      title: `${s.time.phase === 3 ? '🌙' : '☀️'} ${S.phaseName()} · Day ${s.time.day}`, cls: 'small',
      body: `<p>It's <b>${S.season()}</b> on ${UI.name()}'s farm${S.isRainy() ? ', and gentle rain is falling 🌧' : ''}.</p>
        <p>Time passes a little each time you do something. Plants can drink once in each part of the day, and animals are ready for care again too.</p>
        ${thirsty ? `<p class="hint">💧 ${thirsty} plant${thirsty > 1 ? 's are' : ' is'} still thirsty right now.</p>` : ''}
        <p>Want to rest under a tree until <b>${nextName}</b>?</p>`,
      buttons: [{ label: 'Not yet', cls: 'ghost' }, { label: `Rest until ${nextName} 🌤`, cls: 'primary', onClick: () => { S.nextPhase(false); S.commit(); UI.refresh(); } }]
    });
  };
  DF.on('phase', (d) => {
    if (!DF.state) return;
    const msg = d.newDay ? `🌅 Good morning! Day ${DF.state.time.day} has begun.` : `${DF.state.time.phase === 3 ? '🌙' : '🌤'} It's now ${S.phaseName()}.`;
    UI.toast(msg + (S.isRainy() && DF.state.tools.rain_barrel ? ' The rain watered your plants!' : ''), 'time');
    if (d.newDay && DF.state.time.day % DF.DAYS_PER_SEASON === 1 && DF.state.time.day > 1) {
      setTimeout(() => UI.clover(`It's ${S.season()} now! ${{ Spring: 'Blossoms everywhere! 🌸', Summer: 'Sunshine and long days! ☀️', Autumn: 'Look at the golden leaves! 🍂', Winter: 'Cozy season! Let’s keep the animals warm. ❄️' }[S.season()]}`), 800);
      S.learn('w_seasons');
    }
  });

  /* ---------------- Settings ---------------- */
  P.settings = () => {
    const s = DF.state.settings;
    const m = UI.modal({
      title: '⚙️ Settings', cls: 'small',
      body: `<div class="settings">
        <label class="toggle"><input type="checkbox" id="setSound" ${s.sound ? 'checked' : ''}><span>Sound effects</span></label>
        <label class="toggle"><input type="checkbox" id="setAmb" ${s.ambient ? 'checked' : ''}><span>Gentle background sounds</span></label>
        <label class="field"><span>Animations</span><select id="setMotion">
          <option value="auto" ${s.motion === 'auto' ? 'selected' : ''}>Follow my device</option>
          <option value="full" ${s.motion === 'full' ? 'selected' : ''}>All animations</option>
          <option value="reduced" ${s.motion === 'reduced' ? 'selected' : ''}>Calm (less movement)</option></select></label>
        <button class="btn" id="setTut">Replay the tutorial</button>
        <button class="btn" id="setTitle">Back to title screen</button>
        <hr><p class="muted small-t">Your farm saves automatically on this device${S.storageOK() ? '' : ' — <b>but saving is blocked in this browser mode</b>'}.</p>
        <button class="btn danger" id="setReset">Start over (reset farm)</button>
      </div>`
    });
    const el = m.el;
    el.querySelector('#setSound').onchange = (e) => { s.sound = e.target.checked; if (s.sound) DF.Audio.unlock(); DF.Audio.setAmbient(s.sound && s.ambient); S.save(); UI.renderHUD(); DF.Audio.play('pet'); };
    el.querySelector('#setAmb').onchange = (e) => { s.ambient = e.target.checked; if (s.ambient && !s.sound) { s.sound = true; el.querySelector('#setSound').checked = true; } DF.Audio.setAmbient(s.sound && s.ambient); S.save(); UI.renderHUD(); };
    el.querySelector('#setMotion').onchange = (e) => { s.motion = e.target.value; UI.applyMotion(); S.save(); };
    el.querySelector('#setTut').onclick = () => { m.close(); DF.Tutorial && DF.Tutorial.start(true); };
    el.querySelector('#setTitle').onclick = () => { m.close(); DF.showTitle(); };
    el.querySelector('#setReset').onclick = () => {
      UI.modal({
        title: 'Start a brand-new farm?', cls: 'small',
        body: `<p>This will erase <b>everything</b> on this farm — crops, animals, decorations and journal pages. It can't be undone.</p><p>Type <b>NEW FARM</b> to confirm:</p><input id="resetIn" type="text" autocomplete="off" aria-label="Type NEW FARM to confirm">`,
        buttons: [{ label: 'Keep my farm', cls: 'primary' }, {
          label: 'Erase & start over', cls: 'danger', onClick: (mm) => {
            if (mm.el.querySelector('#resetIn').value.trim().toUpperCase() !== 'NEW FARM') { UI.toast('Type NEW FARM to confirm.'); return false; }
            UI.closeAllModals(); S.reset(); DF.showTitle(); UI.toast('Your farm has been reset.');
          }
        }]
      });
    };
  };
  P.sound = () => {
    const s = DF.state.settings;
    s.sound = !s.sound;
    if (s.sound) DF.Audio.unlock();
    DF.Audio.setAmbient(s.sound && s.ambient);
    S.save(); UI.renderHUD();
    DF.Audio.play('pet');
    UI.toast(s.sound ? '🔊 Sound on' : '🔇 Sound off');
  };

  /* ---------------- Celebrations & notifications ---------------- */
  let levelQueue = [];
  DF.on('levelup', (lvl) => { levelQueue.push(lvl); setTimeout(showLevelUps, 350); });
  function showLevelUps() {
    if (!levelQueue.length) return;
    const lvl = levelQueue.shift();
    const unlocks = S.unlocksAt(lvl);
    DF.Audio.play('level');
    UI.confetti();
    UI.modal({
      title: `🎉 Level ${lvl}!`, cls: 'small celebrate',
      body: `<div class="center"><div class="lvl-big">${lvl}</div><p>Hooray, ${UI.name()}! Your farm is growing — and so are you!</p>
        ${unlocks.length ? `<h3 class="sub">New things unlocked</h3><ul class="unlock-list">${unlocks.map(u => `<li>${u.icon ? A.icon(u.icon) : u.animal ? A.animal(u.animal) : '<span class="ul-dot">✨</span>'}<span>${u.text}</span></li>`).join('')}</ul>` : ''}</div>`,
      buttons: [{ label: 'Yay! 🌟', cls: 'primary' }],
      onClose: () => { if (levelQueue.length) setTimeout(showLevelUps, 200); }
    });
    S.discoverRecipes();
    UI.renderHUD();
  }
  // Bundle bursts of notifications so they never pile up
  let qBuf = [], qTimer, fBuf = [], fTimer;
  DF.on('questReady', (q) => {
    qBuf.push(q); clearTimeout(qTimer);
    qTimer = setTimeout(() => {
      const list = qBuf; qBuf = [];
      UI.toast(list.length === 1 ? `📋 Quest complete: <b>${list[0].title}</b> — claim it on the Quest Board!` : `📋 <b>${list.length} quests complete!</b> Claim your rewards on the Quest Board.`, 'quest', 3400);
      DF.Audio.play('right');
    }, 500);
  });
  DF.on('badge', (b) => {
    setTimeout(() => {
      DF.Audio.play('quest');
      UI.toast(`🏅 New badge: <b>${b.name}</b>! A certificate is waiting in your journal.`, 'quest', 4200);
    }, 600);
  });
  DF.on('fact', (id) => {
    fBuf.push(id); clearTimeout(fTimer);
    fTimer = setTimeout(() => {
      const list = fBuf; fBuf = [];
      UI.toast(list.length === 1 ? `📖 New discovery! <b>${DF.FACTS[list[0]].title}</b> <button class="link-btn" data-fact="${list[0]}">Read</button>` : `📖 <b>${list.length} new discoveries</b> in your journal! <button class="link-btn" data-fact="${list[0]}">Read one</button>`, 'fact', 4000);
      DF.Audio.play('page');
    }, 400);
  });
  DF.on('recipe', (id) => { UI.toast(`🔨 New recipe discovered: <b>${DF.RECIPES[id].name}</b>!`, 'quest', 3200); });
  document.addEventListener('click', (e) => { const b = e.target.closest('[data-fact]'); if (b) P.fact(b.dataset.fact); });

  P.fact = (id) => {
    const f = DF.FACTS[id]; if (!f) return;
    const t = DF.TOPICS[f.topic];
    UI.modal({
      title: '', cls: 'small fact-modal',
      body: `<div class="journal-page" style="--tc:${t.color}"><div class="jp-icon">${t.icon}</div><div class="jp-topic">${t.name}</div><h3>${f.title}</h3><p>${f.text}</p><div class="jp-sign">— from ${UI.name()}'s Little Discoveries</div></div>`,
      buttons: [{ label: 'Lovely!', cls: 'primary' }]
    });
  };
})();
