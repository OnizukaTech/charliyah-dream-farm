/* Charliyah's Dream Farm — the farm hub (illustrated map), Clover's chatter, and the Pond */
(function () {
  'use strict';
  const DF = window.DF, UI = DF.UI, S = DF.S, A = DF.Art;

  const nest = (svgStr, x, y, w, h) => svgStr.replace('<svg ', `<svg x="${x}" y="${y}" width="${w}" height="${h}" `);
  const label = (x, y, text, w) => `<g class="map-label" transform="translate(${x} ${y})"><rect x="${-w / 2}" y="-22" width="${w}" height="40" rx="20"/><text y="6" text-anchor="middle">${text}</text></g>`;
  const SKY = [['#ffe3c9', '#cfe9f7'], ['#a9dcf5', '#e2f4fb'], ['#f7b9a6', '#f9dfc0'], ['#28305e', '#4b4f8a']];

  /* ---------------- Clover's helpful chatter ---------------- */
  DF.cloverHint = () => {
    const s = DF.state;
    const ready = s.plots.filter(S.plotReady).length;
    if (S.readyQuestCount()) return 'You finished a quest! Tap the Quest Board at the top to collect your reward. 📋';
    if (ready) return `${ready} of your crops ${ready > 1 ? 'are' : 'is'} ready to harvest! Let's go to the Garden! 🧺`;
    const thirsty = s.plots.filter(S.plotThirsty).length;
    if (thirsty) return `${thirsty} little plant${thirsty > 1 ? 's look' : ' looks'} thirsty. A splash of water would help them grow! 💧`;
    const hungry = s.animals.find(a => a.fedP !== s.time.P);
    if (hungry) return `${hungry.name} the ${DF.ANIMALS[hungry.type].name.toLowerCase()} would love some ${DF.ANIMALS[hungry.type].food}. 🐾`;
    const empty = s.plots.filter(p => !p.crop).length;
    const seeds = Object.keys(s.inv).some(k => k.endsWith('_seed'));
    if (empty && seeds) return `There ${empty > 1 ? 'are' : 'is'} ${empty} empty garden plot${empty > 1 ? 's' : ''}. Shall we plant something? 🌱`;
    if (empty && !seeds) return 'We’re out of seeds! The Market sells more — sell some harvest first if you need coins. 🪙';
    const ch = S.challenge();
    if (!ch.done) return `Today's Treehouse challenge is ${DF.MINIGAMES[ch.game].name}. Bonus coins if you play it! 🌳`;
    const q = S.questsAvailable().filter(x => S.questState(x) === 'active').sort((a, b) => (b.goal ? S.questProgress(b) / b.goal : 0) - (a.goal ? S.questProgress(a) / a.goal : 0))[0];
    if (q) return `Next idea: "${q.title}" — ${q.desc}`;
    return 'Everything is growing beautifully. Maybe decorate your house, or rest until the next part of the day? 🌤';
  };
  DF.cloverTalk = () => {
    const r = Math.random();
    if (r < 0.45) { UI.clover(DF.cloverHint(), { anim: 'bounce' }); return; }
    if (r < 0.75) {
      const f = S.randomUnknownFact();
      if (f) { S.learn(f, true); S.commit(); UI.clover(`Fun fact! ${DF.FACTS[f].text} (I added it to your journal!) 📖`, { anim: 'hop', ms: 9000 }); return; }
    }
    UI.clover(UI.pick(DF.CLOVER.cheers), { hearts: true, anim: 'hop' });
  };

  /* ---------------- map pieces ---------------- */
  function farmhouse(night) {
    const win = night ? '#ffe9a0' : '#d5e9f7';
    return `<g class="farmhouse">
      <ellipse cx="600" cy="400" rx="150" ry="18" fill="#000" opacity=".08"/>
      <rect x="690" y="140" width="26" height="60" fill="#c98a6a"/><rect x="686" y="134" width="34" height="10" rx="3" fill="#b0735a"/>
      <path d="M470 250 L600 150 L730 250Z" fill="#ef8f86" stroke="#d4716a" stroke-width="4" stroke-linejoin="round"/>
      ${[0, 1, 2, 3].map(i => `<path d="M${490 + i * 0} ${236 - i * 0} " />`).join('')}
      <path d="M500 230 L600 158 L700 230" stroke="#f6aca4" stroke-width="5" fill="none" stroke-dasharray="14 10"/>
      <rect x="490" y="246" width="220" height="150" rx="6" fill="#fff4e1" stroke="#e8d3b0" stroke-width="4"/>
      <rect x="570" y="310" width="60" height="86" rx="30" ry="30" fill="#b9814f" stroke="#8d6040" stroke-width="4"/>
      <circle cx="616" cy="356" r="4" fill="#ffd34d"/>
      <rect x="510" y="280" width="46" height="42" rx="6" fill="${win}" stroke="#b9814f" stroke-width="5"/><path d="M533 280 L533 322 M510 301 L556 301" stroke="#b9814f" stroke-width="3"/>
      <rect x="644" y="280" width="46" height="42" rx="6" fill="${win}" stroke="#b9814f" stroke-width="5"/><path d="M667 280 L667 322 M644 301 L690 301" stroke="#b9814f" stroke-width="3"/>
      <rect x="506" y="322" width="54" height="14" rx="3" fill="#b9814f"/><rect x="640" y="322" width="54" height="14" rx="3" fill="#b9814f"/>
      ${[514, 528, 542, 648, 662, 676].map((x, i) => `<circle cx="${x + 4}" cy="320" r="6" fill="${['#f58aa5', '#ffcd3c', '#cdb9ef'][i % 3]}"/>`).join('')}
      <circle cx="600" cy="210" r="16" fill="${win}" stroke="#b9814f" stroke-width="4"/>
      ${[[480, 392], [500, 398], [700, 392], [718, 398], [470, 398]].map(([x, y], i) => `<g class="sway-flower" style="--d:${i * 0.4}s"><path d="M${x} ${y} L${x} ${y - 22}" stroke="#5aa94b" stroke-width="3"/><circle cx="${x}" cy="${y - 24}" r="7" fill="${['#f58aa5', '#ffcd3c', '#fff', '#cdb9ef', '#f6b0a6'][i]}"/><circle cx="${x}" cy="${y - 24}" r="2.5" fill="#ffe792"/></g>`).join('')}
    </g>`;
  }
  function treehouse() {
    const season = S.season();
    const leaf = { Spring: ['#8fd07a', '#a8dc8c'], Summer: ['#6cbf5e', '#80cc6c'], Autumn: ['#efa24a', '#e4793d'], Winter: ['#a9c9b4', '#c3dccb'] }[season];
    return `<g class="treehouse">
      <ellipse cx="180" cy="440" rx="110" ry="16" fill="#000" opacity=".08"/>
      <path d="M156 440 L164 250 Q130 230 110 238 M176 300 Q210 270 240 270 M172 440 L206 440 L196 250" stroke="#8a5a36" stroke-width="26" fill="#8a5a36" stroke-linecap="round"/>
      <g class="tree-sway"><circle cx="180" cy="190" r="100" fill="${leaf[0]}"/><circle cx="100" cy="220" r="62" fill="${leaf[1]}"/><circle cx="260" cy="220" r="62" fill="${leaf[1]}"/><circle cx="140" cy="130" r="56" fill="${leaf[1]}"/><circle cx="226" cy="132" r="54" fill="${leaf[0]}"/></g>
      <rect x="120" y="262" width="122" height="14" rx="4" fill="#b9814f"/>
      <rect x="132" y="190" width="98" height="74" rx="6" fill="#e3b989" stroke="#8d6040" stroke-width="4"/>
      <path d="M122 196 L181 150 L240 196Z" fill="#b5a4e8" stroke="#8f7ed0" stroke-width="4" stroke-linejoin="round"/>
      <rect x="166" y="216" width="30" height="48" rx="14" fill="#8d6040"/>
      <circle cx="150" cy="220" r="11" fill="#d5e9f7" stroke="#8d6040" stroke-width="3"/><circle cx="214" cy="220" r="11" fill="#d5e9f7" stroke="#8d6040" stroke-width="3"/>
      <path d="M236 276 L236 440 M258 276 L258 440" stroke="#c99260" stroke-width="5"/>${[300, 330, 360, 390, 420].map(y => `<path d="M236 ${y} L258 ${y}" stroke="#c99260" stroke-width="5"/>`).join('')}
      <path d="M130 276 Q150 300 170 276 Q190 300 210 276 Q226 296 240 276" stroke="#ffe27a" stroke-width="3" fill="none"/>
      ${[[146, 288], [178, 290], [212, 288]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="5" fill="${['#f6a8c4', '#a9d8e8', '#ffe27a'][i]}" class="glow"/>`).join('')}
      <g transform="translate(150 120)"><rect x="-6" y="-4" width="46" height="28" rx="4" fill="#fff6e8" stroke="#8d6040" stroke-width="2.5" transform="rotate(-6)"/><text x="17" y="16" text-anchor="middle" font-size="16" fill="#8d6040" transform="rotate(-6)" class="hand">ABC</text></g>
    </g>`;
  }
  function market() {
    return `<g class="market">
      <ellipse cx="1030" cy="420" rx="120" ry="14" fill="#000" opacity=".08"/>
      <path d="M930 260 L940 220 L1120 220 L1130 260Z" fill="#f6b0a6"/>
      ${[0, 1, 2, 3, 4, 5].map(i => `<path d="M${950 + i * 32} 220 L${944 + i * 32} 260 L${972 + i * 32} 260 L${976 + i * 32} 220Z" fill="#fff" opacity="${i % 2 ? 0 : 1}"/>`).join('')}
      <path d="M930 260 Q946 282 962 260 Q978 282 994 260 Q1010 282 1026 260 Q1042 282 1058 260 Q1074 282 1090 260 Q1106 282 1122 260 L1130 260" fill="#f6b0a6" stroke="#e08a80" stroke-width="2"/>
      <path d="M944 260 L944 410 M1116 260 L1116 410" stroke="#b9814f" stroke-width="10"/>
      <rect x="930" y="330" width="200" height="80" rx="6" fill="#d9a86c" stroke="#b9814f" stroke-width="4"/>
      <path d="M930 360 L1130 360" stroke="#b9814f" stroke-width="3"/>
      ${nest(A.produce('carrot'), 950, 286, 50, 50)}${nest(A.produce('apple'), 1000, 292, 44, 44)}${nest(A.produce('tomato'), 1040, 292, 44, 44)}${nest(A.produce('sunflower'), 1076, 280, 50, 50)}
      <rect x="980" y="370" width="100" height="30" rx="6" fill="#fff6e8"/><text x="1030" y="392" text-anchor="middle" font-size="20" fill="#b9814f" class="hand">Fresh!</text>
    </g>`;
  }
  function workshop() {
    return `<g class="workshop">
      <ellipse cx="160" cy="790" rx="110" ry="12" fill="#000" opacity=".08"/>
      <path d="M70 700 L160 640 L250 700Z" fill="#9fcf9a" stroke="#6fae69" stroke-width="4" stroke-linejoin="round"/>
      <rect x="82" y="698" width="156" height="90" rx="4" fill="#c99260" stroke="#8d6040" stroke-width="4"/>
      ${[100, 124, 148, 172, 196, 220].map(x => `<path d="M${x} 700 L${x} 786" stroke="#b07a4a" stroke-width="2"/>`).join('')}
      <rect x="140" y="730" width="44" height="58" rx="4" fill="#8d6040"/>
      <rect x="96" y="716" width="32" height="28" rx="3" fill="#d5e9f7" stroke="#8d6040" stroke-width="3"/>
      <g transform="translate(206 732) rotate(30)"><rect x="-3" y="-20" width="6" height="34" rx="2" fill="#8d6040"/><rect x="-10" y="-26" width="20" height="10" rx="3" fill="#9aa1b2"/></g>
      <circle cx="252" cy="772" r="13" fill="#f6a8c4" stroke="#e080a5" stroke-width="2"/><path d="M244 766 Q252 774 260 764" stroke="#e080a5" stroke-width="2" fill="none"/>
    </g>`;
  }
  function gardenPatch() {
    const s = DF.state;
    const tiles = s.plots.slice(0, 6).map((p, i) => {
      const x = 290 + (i % 3) * 78, y = 470 + Math.floor(i / 3) * 70;
      const st = S.plotStage(p);
      return `<rect x="${x}" y="${y}" width="68" height="58" rx="10" fill="#9b6a42" stroke="#7a5233" stroke-width="3"/>${p.crop ? nest(A.plant(p.crop, st), x + 4, y - 18, 60, 66) : ''}${S.plotReady(p) ? `<circle cx="${x + 60}" cy="${y + 6}" r="9" fill="#ffd34d" class="pulse"/>` : ''}`;
    }).join('');
    return `<g class="garden-patch"><rect x="276" y="456" width="252" height="156" rx="16" fill="#c8e2a8" stroke="#fff" stroke-width="5" stroke-dasharray="10 8"/>${tiles}</g>`;
  }
  function orchard() {
    const s = DF.state;
    return `<g class="orchard-patch">${s.trees.slice(0, 3).map((t, i) => {
      const mature = S.treeMature(t);
      return nest(A.tree(t.type ? DF.TREES[t.type].fruit : null, t.type ? (mature ? 2 : t.g > 0 ? 1 : 0) : 0, S.season(), S.treeHasFruit(t)), 20 + i * 76, 470 + (i % 2) * 40, 110, 120);
    }).join('')}</g>`;
  }
  function meadow() {
    const s = DF.state;
    const animals = s.animals.slice(0, 5);
    const spots = [[790, 486], [880, 520], [970, 478], [1040, 540], [840, 560]];
    return `<g class="meadow">
      <path d="M760 460 L1140 460 L1150 640 L750 640Z" fill="#bfe39c"/>
      ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => `<path d="M${770 + i * 40} 640 L${770 + i * 40} 600 L${776 + i * 40} 592 L${782 + i * 40} 600 L${782 + i * 40} 640Z" fill="#fff" stroke="#e1d8c8" stroke-width="2"/>`).join('')}
      <rect x="760" y="606" width="390" height="8" rx="3" fill="#fff" stroke="#e1d8c8" stroke-width="1.5"/>
      ${animals.map((a, i) => `<g class="map-animal" style="--d:${i * 0.7}s">${nest(A.animal(a.type, a.acc), spots[i][0], spots[i][1], 92, 84)}</g>`).join('')}
    </g>`;
  }
  function pond() {
    return `<g class="pond">
      <ellipse cx="800" cy="738" rx="170" ry="62" fill="#9fd2ee" stroke="#d7eef8" stroke-width="8"/>
      <ellipse cx="800" cy="744" rx="140" ry="44" fill="#86c6e8"/>
      <path d="M720 730 Q740 724 760 730 M830 760 Q852 754 874 760" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" class="ripple" opacity=".8"/>
      <ellipse cx="740" cy="752" rx="26" ry="10" fill="#7fc76a"/><ellipse cx="868" cy="728" rx="22" ry="9" fill="#6cb85a"/>
      <circle cx="868" cy="724" r="7" fill="#f6b8c8"/>
      <g class="frog-map"><ellipse cx="740" cy="744" rx="12" ry="9" fill="#7ac36a"/><circle cx="734" cy="736" r="4.5" fill="#7ac36a"/><circle cx="746" cy="736" r="4.5" fill="#7ac36a"/><circle cx="734" cy="735" r="2" fill="#2f2630"/><circle cx="746" cy="735" r="2" fill="#2f2630"/></g>
      ${[[660, 700], [940, 704], [652, 760]].map(([x, y]) => `<path d="M${x} ${y + 30} L${x} ${y - 10}" stroke="#6b8a3a" stroke-width="4"/><rect x="${x - 5}" y="${y - 26}" width="10" height="24" rx="5" fill="#8d6040"/>`).join('')}
      <circle cx="900" cy="760" r="3" fill="#fff" class="sparkle"/><circle cx="790" cy="718" r="3" fill="#fff" class="sparkle" style="animation-delay:1s"/>
    </g>`;
  }
  function sign() {
    const nm = UI.esc(DF.state.name);
    const fs = nm.length > 10 ? 22 : 28;
    return `<g class="farm-sign">
      <path d="M548 800 L548 712 M652 800 L652 712" stroke="#8d6040" stroke-width="12" stroke-linecap="round"/>
      ${[[536, 800], [560, 802], [640, 800], [664, 802]].map(([x, y], i) => `<path d="M${x} ${y} L${x} ${y - 16}" stroke="#5aa94b" stroke-width="3"/><circle cx="${x}" cy="${y - 18}" r="6" fill="${['#f58aa5', '#ffcd3c', '#cdb9ef', '#fff'][i]}"/>`).join('')}
      <rect x="506" y="672" width="188" height="88" rx="14" fill="#f3d9ae" stroke="#8d6040" stroke-width="5"/>
      <rect x="516" y="682" width="168" height="68" rx="9" fill="none" stroke="#e0bf8c" stroke-width="2.5" stroke-dasharray="6 5"/>
      <text x="600" y="${fs === 22 ? 708 : 710}" text-anchor="middle" font-size="${fs + 2}" fill="#7a4526" class="hand sign-text" font-weight="700">${nm}'s</text>
      <text x="600" y="744" text-anchor="middle" font-size="30" fill="#c45f86" class="hand sign-text">Farm ✿</text>
      <g transform="translate(688 676)" class="resting-bf"><path d="M0 0 C-14 -14 -18 6 -2 4 C-16 14 -4 20 0 6Z" fill="#f6a8c4" stroke="#e080a5" stroke-width="1.5"/><path d="M0 0 C14 -14 18 6 2 4 C16 14 4 20 0 6Z" fill="#cdb9ef" stroke="#a991d9" stroke-width="1.5"/><path d="M0 -4 L0 10" stroke="#5a3a4a" stroke-width="2.4" stroke-linecap="round"/></g>
    </g>`;
  }
  function butterflies() {
    const cols = [['#f6a8c4', '#ffd0e0'], ['#a9d8e8', '#d4eef7'], ['#ffd34d', '#ffeaa0']];
    return cols.map((c, i) => `<g class="bf bf${i}" role="button" tabindex="0" aria-label="A fluttering butterfly — tap to learn about it" data-act="butterfly">
        <circle r="34" fill="transparent"/>
        <g class="bf-wings"><path d="M0 0 C-20 -22 -26 8 -3 6 C-22 22 -6 28 0 8Z" fill="${c[0]}" stroke="#fff" stroke-width="2"/><path d="M0 0 C20 -22 26 8 3 6 C22 22 6 28 0 8Z" fill="${c[1]}" stroke="#fff" stroke-width="2"/></g>
        <path d="M0 -6 L0 12" stroke="#5a3a4a" stroke-width="3" stroke-linecap="round"/></g>`).join('');
  }
  function weather() {
    const season = S.season();
    let s = '';
    if (S.isRainy()) s += `<g class="rain">${Array.from({ length: 26 }, (_, i) => `<path d="M${(i * 47) % 1200} ${(i * 83) % 400} l-8 22" stroke="#cfe6f7" stroke-width="3" stroke-linecap="round" style="animation-delay:${(i % 7) * 0.2}s"/>`).join('')}</g>`;
    const bits = { Spring: '🌸', Autumn: '🍂', Winter: '❄', Summer: '' }[season];
    if (bits) s += `<g class="drift">${Array.from({ length: 7 }, (_, i) => `<text x="${80 + i * 160}" y="0" font-size="22" style="animation-delay:${i * 1.3}s;animation-duration:${9 + (i % 3) * 2}s">${bits}</text>`).join('')}</g>`;
    return s;
  }

  function mapSVG() {
    const s = DF.state;
    const ph = s.time.phase, night = ph === 3;
    const [top, bottom] = SKY[ph];
    const hot = (view, labelText, x, y, w, inner, aria) => `<g class="hot" role="button" tabindex="0" data-go="${view}" aria-label="${aria || labelText}">${inner}${label(x, y, labelText, w)}</g>`;
    return `<svg class="farm-map-svg" viewBox="0 0 1200 820" xmlns="http://www.w3.org/2000/svg" role="group" aria-label="${UI.name()}'s farm map">
      <defs><linearGradient id="skyG" gradientUnits="userSpaceOnUse" x1="0" y1="-200" x2="0" y2="420"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient></defs>
      <rect x="-1500" y="-1200" width="4200" height="3200" fill="url(#skyG)"/>
      ${night ? Array.from({ length: 50 }, (_, i) => `<circle cx="${(i * 137) % 2400 - 600}" cy="${(i * 53) % 400 - 140}" r="${i % 3 ? 1.6 : 2.6}" fill="#fff" class="twinkle" style="animation-delay:${i % 5}s"/>`).join('') : ''}
      <g transform="translate(1080 90)">${night ? '<path d="M18 -40 C-16 -34 -30 2 -16 28 C-2 52 34 54 52 34 C22 38 0 16 4 -10 C6 -26 12 -34 18 -40Z" fill="#fff3b0"/>' : `<circle r="${ph === 2 ? 44 : 40}" fill="${ph === 2 ? '#ffb27f' : '#ffd34d'}"/><circle r="56" fill="#ffd34d" opacity=".2" class="sun-glow"/>`}</g>
      <g class="clouds">${[[160, 70, 1], [520, 50, 1.3], [860, 110, 0.9]].map(([x, y, sc], i) => `<g class="cloud" style="--d:${i * 6}s"><g transform="translate(${x} ${y}) scale(${sc})"><ellipse cx="0" cy="0" rx="50" ry="22" fill="#fff" opacity="${night ? 0.25 : 0.95}"/><ellipse cx="-30" cy="6" rx="30" ry="16" fill="#fff" opacity="${night ? 0.25 : 0.95}"/><ellipse cx="34" cy="6" rx="32" ry="16" fill="#fff" opacity="${night ? 0.25 : 0.95}"/></g></g>`).join('')}</g>
      <path d="M-1500 330 L0 320 Q150 250 320 300 T640 290 T960 280 T1200 300 Q1500 260 2700 320 L2700 2000 L-1500 2000Z" fill="#cfe7b2"/>
      <path d="M-1500 400 Q-700 340 0 380 Q200 320 420 370 T820 350 T1200 370 Q1800 330 2700 380 L2700 2000 L-1500 2000Z" fill="#b7dc95"/>
      <path d="M-1500 440 L0 440 Q300 400 600 430 T1200 420 L2700 440 L2700 2000 L-1500 2000Z" fill="#a9d48a"/>
      <path d="M600 820 C590 760 560 700 600 640 C640 580 590 480 600 400" stroke="#efdcb4" stroke-width="56" fill="none" stroke-linecap="round"/>
      <path d="M600 560 C700 560 780 600 840 660 M600 520 C500 520 420 540 360 600" stroke="#efdcb4" stroke-width="30" fill="none" stroke-linecap="round"/>
      ${[[340, 430], [450, 640], [720, 420], [980, 640], [60, 420], [1140, 700]].map(([x, y]) => `<g class="sway-flower"><path d="M${x} ${y} l0 -16" stroke="#5aa94b" stroke-width="3"/><circle cx="${x}" cy="${y - 18}" r="6" fill="#fff"/><circle cx="${x}" cy="${y - 18}" r="2.4" fill="#ffd34d"/></g>`).join('')}
      ${hot('learn', 'Learning Treehouse', 180, 470, 270, treehouse())}
      ${hot('house', 'Farmhouse', 600, 132, 170, farmhouse(night || ph === 2))}
      ${hot('market', 'Market', 1030, 200, 130, market())}
      ${hot('orchard', 'Orchard', 150, 640, 130, orchard())}
      ${hot('garden', 'Garden', 402, 636, 120, gardenPatch())}
      ${hot('animals', 'Animal Meadow', 950, 440, 210, meadow())}
      ${hot('craft', 'Crafting Corner', 160, 798, 220, workshop())}
      ${hot('pond', 'Pond', 800, 668, 100, pond())}
      <g class="hot" role="button" tabindex="0" data-act="sign" aria-label="Sign: ${UI.name()}'s Farm">${sign()}</g>
      <g class="hot map-clover" role="button" tabindex="0" data-act="clover" aria-label="Clover the lamb — tap to chat">${nest(A.clover(), 400, 670, 120, 120)}</g>
      ${butterflies()}
      ${weather()}
      ${ph === 3 ? '<rect x="-1500" y="-1200" width="4200" height="3200" fill="#1d2550" opacity=".28" pointer-events="none"/>' : ph === 2 ? '<rect x="-1500" y="-1200" width="4200" height="3200" fill="#ff9a6a" opacity=".1" pointer-events="none"/>' : ph === 0 ? '<rect x="-1500" y="-1200" width="4200" height="3200" fill="#ffd9a8" opacity=".08" pointer-events="none"/>' : ''}
    </svg>`;
  }

  /* ---------------- FARM VIEW ---------------- */
  let bfIndex = 0;
  DF.Views.farm = {
    render(host) {
      const s = DF.state;
      const readyCrops = s.plots.filter(S.plotReady).length;
      const thirsty = s.plots.filter(S.plotThirsty).length;
      const animalsWaiting = s.animals.filter(a => a.fedP !== s.time.P || a.groomP !== s.time.P || S.animalReady(a)).length;
      const quests = S.readyQuestCount();
      host.innerHTML = `
        <div class="farm-wrap">
          <div class="farm-map" id="farmMap">${mapSVG()}</div>
          <div class="farm-strip">
            <button class="strip-card" data-go="garden"><span class="sc-ic">🧺</span><b>${readyCrops}</b><span>ready to harvest</span></button>
            <button class="strip-card" data-go="garden"><span class="sc-ic">💧</span><b>${thirsty}</b><span>thirsty plants</span></button>
            <button class="strip-card" data-go="animals"><span class="sc-ic">🐾</span><b>${animalsWaiting}</b><span>animals to visit</span></button>
            <button class="strip-card" data-act="quests"><span class="sc-ic">📋</span><b>${quests}</b><span>quests to claim</span></button>
            <button class="strip-card clover-card" data-act="clover">${A.clover()}<span>Ask Clover</span></button>
          </div>
        </div>`;
      const map = host.querySelector('#farmMap');
      // Centre the map on narrow screens (it scrolls sideways there)
      requestAnimationFrame(() => { if (map.scrollWidth > map.clientWidth) map.scrollLeft = (map.scrollWidth - map.clientWidth) / 2; });
      host.onclick = (e) => {
        const a = e.target.closest('[data-act]'); if (!a) return;
        const act = a.dataset.act;
        if (act === 'clover') { DF.cloverTalk(); }
        else if (act === 'quests') DF.Panels.quests();
        else if (act === 'sign') { DF.Audio.play('tap'); UI.clover(`This is ${DF.state.name}'s Farm — a little world made just for you, ${DF.state.name}. Everything here grows because of you! 🌸`, { hearts: true }); }
        else if (act === 'butterfly') {
          const id = DF.BUTTERFLY_FACTS.find(f => !DF.state.facts.includes(f)) || DF.BUTTERFLY_FACTS[bfIndex++ % DF.BUTTERFLY_FACTS.length];
          const isNew = S.learn(id, true);
          DF.Audio.play('pet');
          UI.floatAt(a, '🦋');
          S.commit();
          UI.clover(`${isNew ? 'A butterfly discovery! ' : ''}${DF.FACTS[id].text}`, { anim: 'hop', ms: 8000, sound: false });
        }
      };
    }
  };

  /* ---------------- POND VIEW ---------------- */
  const LITTER_SPOTS = [[180, 520, 'bottle'], [520, 610, 'can'], [860, 500, 'bottle'], [700, 380, 'can'], [330, 360, 'bottle']];
  const POND_THINGS = [
    { id: 'frog', fact: ['pd_frog', 'pd_frog_skin'], label: 'Freddie the frog' },
    { id: 'fish', fact: ['pd_fish'], label: 'Goldfish' },
    { id: 'dragonfly', fact: ['pd_dragonfly'], label: 'Dragonfly' },
    { id: 'lily', fact: ['pd_lily', 'pd_tiny'], label: 'Water lily' },
    { id: 'cloud', fact: ['w_cycle', 'w_rain'], label: 'Cloud' },
    { id: 'reeds', fact: ['n_habitat', 'n_biodiversity', 'e_wildlife'], label: 'Reeds and wildflowers' },
    { id: 'log', fact: ['n_decomposers', 's_worms'], label: 'Old log' }
  ];
  function ensureLitter() {
    const s = DF.state;
    if (s.pond.litterDay !== s.time.day) {
      s.pond.litterDay = s.time.day;
      const start = s.time.day % LITTER_SPOTS.length;
      s.pond.litter = [0, 1, 2].map(i => (start + i * 2) % LITTER_SPOTS.length);
    }
  }
  function pondSVG() {
    const s = DF.state;
    const ph = s.time.phase;
    const [top, bottom] = SKY[ph];
    const thing = (id, inner, label) => `<g class="pond-thing hot" role="button" tabindex="0" data-thing="${id}" aria-label="${label} — tap to discover">${inner}</g>`;
    const litter = s.pond.litter.map(i => { const [x, y, t] = LITTER_SPOTS[i]; return `<g class="litter hot" role="button" tabindex="0" data-litter="${i}" aria-label="Litter: ${t === 'can' ? 'tin can' : 'old bottle'} — tap to pick it up"><circle cx="${x}" cy="${y}" r="38" fill="transparent"/>${nest(A.icon(t), x - 26, y - 26, 52, 52).replace('class="', 'class="bob ')}</g>`; }).join('');
    return `<svg class="pond-svg" viewBox="0 0 1000 700" xmlns="http://www.w3.org/2000/svg" role="group" aria-label="The pond">
      <defs><linearGradient id="pSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient>
      <linearGradient id="pWater" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a6dbf2"/><stop offset="1" stop-color="#6db7df"/></linearGradient></defs>
      <rect width="1000" height="700" fill="url(#pSky)"/>
      ${thing('cloud', `<g class="cloud" style="--d:0s"><g transform="translate(260 90)"><ellipse rx="70" ry="30" fill="#fff"/><ellipse cx="-44" cy="8" rx="40" ry="22" fill="#fff"/><ellipse cx="48" cy="8" rx="44" ry="22" fill="#fff"/></g></g>`, 'A fluffy cloud')}
      <circle cx="840" cy="90" r="44" fill="${ph === 3 ? '#fff3b0' : '#ffd34d'}"/>
      <path d="M0 260 Q250 220 500 250 T1000 240 L1000 700 L0 700Z" fill="#b7dc95"/>
      <ellipse cx="500" cy="500" rx="440" ry="170" fill="#d7eef8"/>
      <ellipse cx="500" cy="506" rx="410" ry="150" fill="url(#pWater)"/>
      ${[[300, 470], [640, 540], [460, 600], [760, 450]].map(([x, y], i) => `<ellipse cx="${x}" cy="${y}" rx="40" ry="8" fill="none" stroke="#fff" stroke-width="3" opacity=".5" class="ripple" style="animation-delay:${i * 0.8}s"/>`).join('')}
      ${thing('lily', `<g><ellipse cx="640" cy="470" rx="56" ry="20" fill="#7fc76a"/><path d="M640 470 L690 462" stroke="#a9d48a" stroke-width="4"/><ellipse cx="560" cy="560" rx="44" ry="16" fill="#6cb85a"/><g transform="translate(640 452)">${A.petals(8, 0, 0, 7, 14, 12, '#ffd0dc', '#f2a6bc')}<circle r="7" fill="#ffe27a"/></g></g>`, 'Water lily')}
      ${thing('frog', `<g class="frog"><ellipse cx="560" cy="548" rx="34" ry="24" fill="#7ac36a"/><ellipse cx="560" cy="558" rx="22" ry="12" fill="#c6eab0"/><circle cx="544" cy="526" r="12" fill="#7ac36a"/><circle cx="576" cy="526" r="12" fill="#7ac36a"/><circle cx="544" cy="524" r="6" fill="#2f2630"/><circle cx="576" cy="524" r="6" fill="#2f2630"/><circle cx="546" cy="522" r="2" fill="#fff"/><circle cx="578" cy="522" r="2" fill="#fff"/><path d="M548 548 Q560 556 572 548" stroke="#2f2630" stroke-width="3" fill="none"/><ellipse cx="538" cy="544" rx="5" ry="3" fill="#f7a1b0"/><ellipse cx="582" cy="544" rx="5" ry="3" fill="#f7a1b0"/></g>`, 'Freddie the frog')}
      ${thing('fish', `<g class="fish"><g transform="translate(330 540)"><ellipse rx="30" ry="16" fill="#ffa64d"/><path d="M26 0 L48 -14 L48 14Z" fill="#ff8a3d"/><circle cx="-14" cy="-4" r="4" fill="#2f2630"/><path d="M-4 -14 Q6 -24 14 -14" fill="#ff8a3d"/></g></g><g class="fish fish2"><g transform="translate(720 600) scale(-0.8 0.8)"><ellipse rx="30" ry="16" fill="#f6e3a0"/><path d="M26 0 L48 -14 L48 14Z" fill="#f0cf6a"/><circle cx="-14" cy="-4" r="4" fill="#2f2630"/></g></g>`, 'Fish swimming')}
      ${thing('dragonfly', `<g class="dragonfly"><g transform="translate(780 340)"><circle r="34" fill="transparent"/><ellipse cx="-16" cy="-8" rx="20" ry="6" fill="#d6ecfb" stroke="#8fc4ea" stroke-width="2" transform="rotate(-15)"/><ellipse cx="16" cy="-8" rx="20" ry="6" fill="#d6ecfb" stroke="#8fc4ea" stroke-width="2" transform="rotate(15)"/><rect x="-3" y="-12" width="6" height="44" rx="3" fill="#5b6fc9"/><circle cy="-14" r="6" fill="#5b6fc9"/></g></g>`, 'Dragonfly')}
      ${thing('reeds', `<g>${[[120, 420], [150, 440], [880, 420], [910, 446], [94, 450]].map(([x, y]) => `<path d="M${x} ${y + 60} Q${x - 6} ${y} ${x + 4} ${y - 40}" stroke="#6b8a3a" stroke-width="5" fill="none"/><rect x="${x - 4}" y="${y - 40}" width="12" height="34" rx="6" fill="#8d6040"/>`).join('')}${[[200, 330], [240, 350], [800, 330]].map(([x, y]) => `<path d="M${x} ${y + 26} l0 -24" stroke="#5aa94b" stroke-width="3"/><circle cx="${x}" cy="${y}" r="8" fill="#cdb9ef"/>`).join('')}</g>`, 'Reeds and wildflowers')}
      ${thing('log', `<g><rect x="60" y="600" width="170" height="44" rx="22" fill="#a8703e" stroke="#7a4f2e" stroke-width="4"/><ellipse cx="226" cy="622" rx="16" ry="22" fill="#d9a86c" stroke="#7a4f2e" stroke-width="3"/><circle cx="226" cy="622" r="7" fill="none" stroke="#a8703e" stroke-width="2"/><path d="M100 600 Q96 586 104 580 M140 600 Q142 584 150 582" stroke="#7fc76a" stroke-width="4" fill="none"/><ellipse cx="160" cy="598" rx="8" ry="5" fill="#ef6b6b"/><ellipse cx="160" cy="596" rx="4" ry="2" fill="#fff"/></g>`, 'Old mossy log')}
      ${litter}
      ${ph === 3 ? '<rect width="1000" height="700" fill="#1d2550" opacity=".28" pointer-events="none"/>' : ''}
    </svg>`;
  }
  DF.Views.pond = {
    render(host) {
      ensureLitter();
      const s = DF.state;
      const found = POND_THINGS.filter(t => t.fact.every(f => s.facts.includes(f))).length;
      host.innerHTML = `<div class="page">
        <div class="page-head"><button class="back-btn" data-go="farm" aria-label="Back to the farm">← Farm</button><h1>The Sparkly Pond</h1></div>
        <p class="lead">A peaceful place to explore. Tap the creatures and plants to make discoveries${s.pond.litter.length ? ', and help keep the pond clean by picking up litter' : ''}.</p>
        <div class="pond-scene">${pondSVG()}</div>
        <div class="pond-info">
          <div class="mini-card"><b>${found}/${POND_THINGS.length}</b><span>pond secrets found</span></div>
          <div class="mini-card"><b>${S.statValue('litter')}</b><span>litter picked up</span></div>
          <div class="mini-card"><b>${s.pond.litter.length ? s.pond.litter.length + ' left' : 'Sparkling! ✨'}</b><span>${s.pond.litter.length ? 'litter today' : 'New litter may wash up tomorrow'}</span></div>
        </div></div>`;
      host.onclick = (e) => {
        const l = e.target.closest('[data-litter]');
        if (l) {
          const idx = +l.dataset.litter;
          const t = LITTER_SPOTS[idx][2];
          s.pond.litter = s.pond.litter.filter(i => i !== idx);
          S.add(t, 1); S.stat('litter'); S.addXP(3);
          DF.Audio.play('harvest');
          UI.floatAt(l, `+1 ${t === 'can' ? 'tin can' : 'bottle'} ♻️`);
          const first = S.learn('e_plastic', true);
          S.commit(1);
          UI.refresh();
          UI.clover(first ? `Thank you! ${DF.FACTS.e_plastic.text} Let’s reuse it in the Crafting Corner!` : UI.pick(['The frogs say thank you! 🐸', 'One less piece of litter. You’re an Eco Hero!', 'The fish are doing happy swirls! 🐟']), { anim: 'hop', sound: false });
          return;
        }
        const t = e.target.closest('[data-thing]');
        if (t) {
          const th = POND_THINGS.find(x => x.id === t.dataset.thing);
          const next = th.fact.find(f => !s.facts.includes(f));
          const fid = next || UI.pick(th.fact);
          if (next) { S.learn(next, true); S.addXP(2); S.stat('pond_discover'); }
          DF.Audio.play('pet');
          UI.pop(t);
          S.commit(1);
          UI.refresh();
          UI.clover(`${next ? '✨ New discovery! ' : ''}${DF.FACTS[fid].text}`, { anim: 'hop', ms: 9000, sound: false });
        }
      };
    }
  };
})();
