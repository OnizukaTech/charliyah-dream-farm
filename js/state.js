/* Charliyah's Dream Farm — game state, saving/loading and core rules.
   One plain object (DF.state) is saved to localStorage after every meaningful action. */
(function () {
  'use strict';
  const DF = (window.DF = window.DF || {});
  const S = (DF.S = {});
  const KEY = 'charliyahDreamFarm.save.v1';
  let storageOK = true;

  /* ---------------- tiny event bus ---------------- */
  const listeners = {};
  DF.on = (evt, fn) => { (listeners[evt] = listeners[evt] || []).push(fn); };
  DF.emit = (evt, data) => { (listeners[evt] || []).forEach(fn => { try { fn(data); } catch (e) { console.error(e); } }); };

  /* ---------------- defaults ---------------- */
  const emptyRoom = (zone) => zone === 'yard' ? { ground: 'grass', items: [] } : { wall: 'cream', floor: 'oak', items: [] };
  S.defaultState = () => ({
    v: DF.VERSION,
    name: DF.DEFAULT_NAME,
    avatar: { skin: DF.AVATAR.skin[1], hair: 'long', hairColor: DF.AVATAR.hairColor[1], outfit: 'overalls', outfitColor: DF.AVATAR.outfitColor[0], acc: 'flower' },
    coins: 25,
    xp: 0,
    level: 1,
    inv: Object.assign({ carrot_seed: 5, daisy_seed: 3, sunflower_seed: 2 }, DF.STARTER_FURNITURE),
    tools: {},
    plots: Array.from({ length: DF.START_PLOTS }, () => ({ crop: null, g: 0, wP: -1, compost: false })),
    trees: Array.from({ length: DF.START_TREES }, () => ({ type: null, g: 0, wP: -1, fruitP: null, woodP: -1 })),
    animals: [
      { id: 'a1', type: 'lamb', name: DF.ANIMALS.lamb.defName, friend: 10, fedP: -1, groomP: -1, treatP: -1, collectP: -1, acc: null, quiz: false },
      { id: 'a2', type: 'chicken', name: DF.ANIMALS.chicken.defName, friend: 10, fedP: -1, groomP: -1, treatP: -1, collectP: -1, acc: null, quiz: false },
      { id: 'a3', type: 'rabbit', name: DF.ANIMALS.rabbit.defName, friend: 10, fedP: -1, groomP: -1, treatP: -1, collectP: -1, acc: null, quiz: false }
    ],
    nextAnimalId: 4,
    house: { inside: emptyRoom('inside'), yard: emptyRoom('yard'), upgrades: {} },
    dream: { inside: emptyRoom('inside'), yard: emptyRoom('yard') },
    time: { actions: 0, phase: 0, day: 1, P: 0 },
    pond: { litterDay: 0, litter: [] },
    stats: {},
    quests: {},          // id -> 'claimed'
    questsSeen: {},      // id -> true when "ready" was announced
    badges: {},          // id -> day earned
    facts: [],           // discovered fact ids, in order
    recipes: {},         // id -> true when discovered
    mg: { math: { level: 1 } },
    storiesRead: {},
    challenge: { day: 0, done: false },
    settings: { sound: false, ambient: false, motion: 'auto' },
    flags: { introSeen: false, tutorialDone: false, tutStep: 0, visits: 0, created: Date.now() }
  });

  /* ---------------- save / load ---------------- */
  const isObj = (o) => o && typeof o === 'object' && !Array.isArray(o);
  // Deep-merge a loaded save onto fresh defaults: keeps valid values, repairs missing/broken ones.
  function merge(def, got) {
    if (def === null) return (got === undefined || (typeof got === 'object' && got !== null)) ? null : got;   // nullable slots (crop, tree type, accessory…)
    if (Array.isArray(def)) return Array.isArray(got) ? got : def;
    if (isObj(def)) {
      if (!isObj(got)) return def;
      const out = {};
      Object.keys(def).forEach(k => { out[k] = merge(def[k], got[k]); });
      Object.keys(got).forEach(k => { if (!(k in def)) out[k] = got[k]; });  // keep dynamic keys (inv, stats…)
      return out;
    }
    if (typeof def === typeof got && !(typeof got === 'number' && !isFinite(got))) return got;
    return def;
  }
  function repair(s) {
    const d = S.defaultState();
    s.coins = Math.max(0, Math.floor(s.coins));
    s.level = Math.max(1, Math.floor(s.level));
    s.xp = Math.max(0, Math.floor(s.xp));
    Object.keys(s.inv).forEach(k => { const n = Math.floor(Number(s.inv[k])); if (!isFinite(n) || n <= 0) delete s.inv[k]; else s.inv[k] = n; });
    s.plots = s.plots.filter(isObj).slice(0, DF.MAX_PLOTS).map(p => merge(d.plots[0], p));
    while (s.plots.length < DF.START_PLOTS) s.plots.push(Object.assign({}, d.plots[0]));
    s.plots.forEach(p => { if (p.crop && !DF.CROPS[p.crop]) p.crop = null; });
    s.trees = s.trees.filter(isObj).slice(0, DF.MAX_TREES).map(t => merge(d.trees[0], t));
    while (s.trees.length < DF.START_TREES) s.trees.push(Object.assign({}, d.trees[0]));
    s.trees.forEach(t => { if (t.type && !DF.TREES[t.type]) t.type = null; });
    s.animals = s.animals.filter(a => isObj(a) && DF.ANIMALS[a.type]).map(a => merge(d.animals[0], a));
    s.animals.forEach(a => { a.friend = Math.max(0, Math.min(100, Number(a.friend) || 0)); a.name = String(a.name || DF.ANIMALS[a.type].defName).slice(0, 16); });
    ['inside', 'yard'].forEach(r => {
      [s.house, s.dream].forEach(h => {
        h[r] = merge(emptyRoom(r), h[r]);
        h[r].items = h[r].items.filter(it => isObj(it) && DF.FURNITURE[it.k] && isFinite(it.x) && isFinite(it.y));
      });
    });
    if (!DF.AVATAR.skin.includes(s.avatar.skin)) s.avatar.skin = d.avatar.skin;
    s.name = String(s.name || DF.DEFAULT_NAME).replace(/[<>]/g, '').slice(0, 16) || DF.DEFAULT_NAME;
    s.facts = s.facts.filter(f => DF.FACTS[f]);
    return s;
  }
  S.load = () => {
    let raw = null;
    try { raw = localStorage.getItem(KEY); } catch (e) { storageOK = false; return null; }
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      if (!isObj(parsed)) throw new Error('bad save');
      const m = merge(S.defaultState(), parsed);
      // Free-form dictionaries must not be refilled with defaults (e.g. used-up seeds)
      ['inv', 'tools', 'stats', 'quests', 'questsSeen', 'badges', 'recipes', 'storiesRead'].forEach(k => { if (isObj(parsed[k])) m[k] = Object.assign({}, parsed[k]); });
      if (isObj(parsed.house) && isObj(parsed.house.upgrades)) m.house.upgrades = Object.assign({}, parsed.house.upgrades);
      return repair(m);
    } catch (e) {
      console.warn('Save was damaged — keeping a backup and starting fresh.', e);
      try { localStorage.setItem(KEY + '.damaged', raw); } catch (_) { /* ignore */ }
      DF._damagedSave = true;
      return null;
    }
  };
  S.hasSave = () => { try { return !!localStorage.getItem(KEY); } catch (e) { return false; } };
  S.save = () => {
    if (!DF.state) return false;
    try {
      localStorage.setItem(KEY, JSON.stringify(DF.state));
      storageOK = true;
      DF.emit('saved', true);
      return true;
    } catch (e) {
      storageOK = false;
      DF.emit('saved', false);
      return false;
    }
  };
  S.storageOK = () => storageOK;
  S.reset = () => { try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ } DF.state = null; };
  S.newGame = () => { DF.state = S.defaultState(); S.save(); return DF.state; };

  /* ---------------- helpers ---------------- */
  const st = () => DF.state;
  S.count = (k) => st().inv[k] || 0;
  S.has = (k, n) => S.count(k) >= (n || 1);
  S.add = (k, n) => {
    n = n == null ? 1 : n;
    if (n <= 0) return;
    st().inv[k] = S.count(k) + n;
    S.stat('got_' + k, n);
    S.discoverRecipes();
  };
  S.take = (k, n) => {
    n = n == null ? 1 : n;
    if (!S.has(k, n)) return false;
    st().inv[k] -= n;
    if (st().inv[k] <= 0) delete st().inv[k];
    return true;
  };
  S.addCoins = (n, fromMarket) => {
    st().coins += n;
    if (fromMarket) S.stat('earned', n);
    DF.emit('coins', n);
  };
  S.spend = (n) => { if (st().coins < n) return false; st().coins -= n; DF.emit('coins', -n); return true; };

  S.stat = (k, n) => { const s = st().stats; s[k] = (s[k] || 0) + (n == null ? 1 : n); };
  S.statValue = (k) => {
    const s = st();
    if (k === 'level') return s.level;
    if (k === 'facts') return s.facts.length;
    if (k.startsWith('facts_')) { const t = k.slice(6); return s.facts.filter(f => DF.FACTS[f].topic === t).length; }
    if (k.startsWith('friend_')) {
      const t = k.slice(7);
      const list = t === 'max' ? s.animals : s.animals.filter(a => a.type === t);
      return list.reduce((m, a) => Math.max(m, a.friend), 0);
    }
    if (k === 'animals_owned') return new Set(s.animals.map(a => a.type)).size;
    if (k === 'story_unique') return Object.keys(s.storiesRead).length;
    return s.stats[k] || 0;
  };

  /* ---------------- XP & levels ---------------- */
  S.addXP = (n) => {
    const s = st();
    s.xp += n;
    DF.emit('xp', n);
    let leveled = false;
    while (s.xp >= DF.xpToNext(s.level)) {
      s.xp -= DF.xpToNext(s.level);
      s.level += 1;
      leveled = true;
      DF.emit('levelup', s.level);
    }
    return leveled;
  };
  // What becomes available at a given level (for the level-up celebration)
  S.unlocksAt = (lvl) => {
    const out = [];
    Object.entries(DF.CROPS).forEach(([k, c]) => c.lvl === lvl && out.push({ icon: k, text: c.name + ' seeds' }));
    Object.entries(DF.TREES).forEach(([k, t]) => t.lvl === lvl && out.push({ icon: k + '_sapling', text: t.name }));
    Object.entries(DF.ANIMALS).forEach(([k, a]) => a.lvl === lvl && a.cost && out.push({ animal: k, text: a.name + ' for adoption' }));
    Object.entries(DF.THEMES).forEach(([k, t]) => t.lvl === lvl && lvl > 1 && out.push({ theme: k, text: t.name + ' collection' }));
    Object.entries(DF.TOOLS).forEach(([k, t]) => t.lvl === lvl && out.push({ icon: k, text: t.name }));
    DF.AVATAR.outfit.concat(DF.AVATAR.acc).forEach(o => o.lvl === lvl && lvl > 1 && out.push({ text: o.name + ' (wardrobe)' }));
    return out;
  };

  /* ---------------- time ---------------- */
  S.phaseName = () => DF.PHASES[st().time.phase];
  S.season = () => DF.SEASONS[Math.floor((st().time.day - 1) / DF.DAYS_PER_SEASON) % 4];
  S.isRainy = () => { const d = st().time.day; return d % 4 === 3; };
  S.tick = (n) => {
    const t = st().time;
    t.actions += n == null ? 1 : n;
    if (t.actions >= DF.ACTIONS_PER_PHASE) { t.actions = 0; S.nextPhase(true); }
  };
  S.nextPhase = (auto) => {
    const t = st().time;
    t.P += 1;
    t.actions = 0;
    t.phase = (t.phase + 1) % 4;
    let newDay = false;
    if (t.phase === 0) { t.day += 1; newDay = true; }
    if (S.isRainy() && st().tools.rain_barrel) {
      // Rainwater gives every growing plant a free drink
      st().plots.forEach(p => { if (p.crop && p.g < S.waterNeed(p) && p.wP !== t.P) { p.g += 1; p.wP = t.P; } });
    }
    DF.emit('phase', { auto: !!auto, newDay });
  };

  /* ---------------- facts / discoveries ---------------- */
  S.learn = (id, quiet) => {
    if (!DF.FACTS[id]) return false;
    const s = st();
    if (s.facts.includes(id)) return false;
    s.facts.push(id);
    if (!quiet) DF.emit('fact', id);
    return true;
  };
  S.randomUnknownFact = (topicFilter) => {
    const s = st();
    const pool = Object.keys(DF.FACTS).filter(f => !s.facts.includes(f) && (!topicFilter || topicFilter.includes(DF.FACTS[f].topic)));
    return pool.length ? pool[Math.floor(Math.random() * pool.length)] : null;
  };

  /* ---------------- recipes ---------------- */
  S.recipeKnown = (id) => DF.RECIPES[id].known || !!st().recipes[id];
  S.discoverRecipes = () => {
    const s = st();
    Object.entries(DF.RECIPES).forEach(([id, r]) => {
      if (S.recipeKnown(id)) return;
      if (r.lvl && s.level < r.lvl) return;
      // Discovered once you've ever collected every kind of ingredient
      const ok = Object.keys(r.needs).every(k => (s.stats['got_' + k] || 0) > 0);
      if (ok) { s.recipes[id] = true; DF.emit('recipe', id); }
    });
  };

  /* ---------------- garden rules ---------------- */
  S.waterNeed = (plot) => Math.max(1, DF.CROPS[plot.crop].water - (plot.compost ? 1 : 0));
  S.plotStage = (plot) => {
    if (!plot.crop) return -1;
    const need = S.waterNeed(plot);
    if (plot.g >= need) return 3;
    if (plot.g === 0) return 0;
    return plot.g / need < 0.5 ? 1 : 2;
  };
  S.plotReady = (p) => p.crop && p.g >= S.waterNeed(p);
  S.plotThirsty = (p) => p.crop && !S.plotReady(p) && p.wP !== st().time.P;

  S.treeMature = (t) => t.type && t.g >= DF.TREES[t.type].water;
  S.treeHasFruit = (t) => S.treeMature(t) && t.fruitP != null && st().time.P >= t.fruitP;
  S.treeThirsty = (t) => t.type && !S.treeMature(t) && t.wP !== st().time.P;
  S.treeWood = (t) => S.treeMature(t) && t.woodP !== st().time.P;

  /* ---------------- animal rules ---------------- */
  S.animalReady = (a) => {
    const P = st().time.P;
    return a.fedP === P && a.groomP === P && a.collectP !== P && a.friend >= 10;
  };
  S.friendAdd = (a, n) => { a.friend = Math.min(100, a.friend + n); };
  S.hearts = (a) => Math.floor(a.friend / 20);

  /* ---------------- quests & badges ---------------- */
  S.questsAvailable = () => DF.QUESTS.filter(q => q.lvl <= st().level);
  S.questProgress = (q) => Math.min(q.goal, S.statValue(q.stat));
  S.questState = (q) => st().quests[q.id] === 'claimed' ? 'claimed' : S.questProgress(q) >= q.goal ? 'ready' : 'active';
  S.claimQuest = (q) => {
    if (S.questState(q) !== 'ready') return false;
    st().quests[q.id] = 'claimed';
    const r = q.reward || {};
    if (r.coins) S.addCoins(r.coins);
    if (r.items) Object.entries(r.items).forEach(([k, n]) => S.add(k, n));
    S.stat('quests_done');
    if (r.xp) S.addXP(r.xp);
    return true;
  };
  // Called after every action: announce newly-completed quests & award badges
  S.checkProgress = () => {
    const s = st();
    S.questsAvailable().forEach(q => {
      if (S.questState(q) === 'ready' && !s.questsSeen[q.id]) { s.questsSeen[q.id] = true; DF.emit('questReady', q); }
    });
    DF.BADGES.forEach(b => {
      if (!s.badges[b.id] && S.statValue(b.stat) >= b.goal) { s.badges[b.id] = s.time.day; DF.emit('badge', b); }
    });
  };
  S.readyQuestCount = () => S.questsAvailable().filter(q => S.questState(q) === 'ready').length;

  /* ---------------- daily-style challenge (no real-world dates!) ---------------- */
  const CH_ORDER = ['bee', 'math', 'habitat', 'genius', 'words'];
  S.challenge = () => {
    const s = st();
    if (s.challenge.day !== s.time.day) s.challenge = { day: s.time.day, done: false };
    return { game: CH_ORDER[(s.time.day - 1) % CH_ORDER.length], done: s.challenge.done };
  };

  /* ---------------- one call after each meaningful action ---------------- */
  S.commit = (ticks) => {
    if (ticks) S.tick(ticks);
    S.checkProgress();
    S.save();
    DF.emit('changed');
  };
})();
