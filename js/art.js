/* Charliyah's Dream Farm — original inline SVG art.
   Every illustration is drawn in code, so nothing can break or go missing offline. */
(function () {
  'use strict';
  const DF = (window.DF = window.DF || {});
  const A = (DF.Art = {});

  const svg = (vb, inner, cls) =>
    `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" class="${cls || ''}" aria-hidden="true" focusable="false">${inner}</svg>`;
  A.svg = svg;

  const petals = (n, cx, cy, rx, ry, dist, fill, stroke) => {
    let s = '';
    for (let i = 0; i < n; i++) {
      const a = (360 / n) * i;
      s += `<ellipse cx="${cx}" cy="${cy - dist}" rx="${rx}" ry="${ry}" fill="${fill}" ${stroke ? `stroke="${stroke}" stroke-width="1.5"` : ''} transform="rotate(${a} ${cx} ${cy})"/>`;
    }
    return s;
  };
  A.petals = petals;

  /* ====================== PRODUCE (centered ~50,50) ====================== */
  const PRODUCE = {
    carrot: () => `
      <path d="M50 30 C44 18 36 14 32 16 C38 20 42 26 46 32Z" fill="#6cb85a"/>
      <path d="M50 30 C52 16 58 10 62 11 C58 18 55 25 53 32Z" fill="#7fc76a"/>
      <path d="M50 30 C50 20 47 12 44 10 C46 20 47 26 48 32Z" fill="#5aa94b"/>
      <path d="M36 34 Q50 26 64 34 L52 88 Q50 92 48 88Z" fill="#f2903a" stroke="#d97425" stroke-width="2" stroke-linejoin="round"/>
      <path d="M42 46 L50 47 M44 58 L52 59 M46 70 L51 71" stroke="#d97425" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M41 38 Q45 36 48 37" stroke="#ffc58a" stroke-width="3" stroke-linecap="round" fill="none"/>`,
    daisy: () => petals(12, 50, 50, 6, 15, 18, '#ffffff', '#e8e2ef') + `<circle cx="50" cy="50" r="11" fill="#ffd34d" stroke="#eab42c" stroke-width="2"/><circle cx="46" cy="47" r="3" fill="#ffe792"/>`,
    sunflower: () => petals(14, 50, 50, 7, 16, 22, '#ffcd3c', '#f0ad1c') + `<circle cx="50" cy="50" r="16" fill="#8a5a33" stroke="#6d4425" stroke-width="2"/>
      <g fill="#5e3a1f"><circle cx="44" cy="45" r="2"/><circle cx="52" cy="43" r="2"/><circle cx="57" cy="50" r="2"/><circle cx="49" cy="52" r="2"/><circle cx="43" cy="55" r="2"/><circle cx="53" cy="58" r="2"/></g>`,
    strawberry: () => `
      <path d="M50 88 C30 74 24 52 30 42 C36 32 64 32 70 42 C76 52 70 74 50 88Z" fill="#ef4a5b" stroke="#cf3345" stroke-width="2"/>
      <g fill="#ffe08a"><ellipse cx="40" cy="50" rx="1.6" ry="2.4"/><ellipse cx="52" cy="47" rx="1.6" ry="2.4"/><ellipse cx="62" cy="52" rx="1.6" ry="2.4"/><ellipse cx="45" cy="62" rx="1.6" ry="2.4"/><ellipse cx="57" cy="64" rx="1.6" ry="2.4"/><ellipse cx="50" cy="76" rx="1.6" ry="2.4"/><ellipse cx="38" cy="60" rx="1.4" ry="2.2"/><ellipse cx="62" cy="72" rx="1.4" ry="2.2"/></g>
      <path d="M50 38 L38 30 L46 36 L42 26 L50 34 L58 26 L54 36 L62 30Z" fill="#5fb455" stroke="#4a9a42" stroke-width="2" stroke-linejoin="round"/>
      <path d="M50 34 L50 22" stroke="#4a9a42" stroke-width="3" stroke-linecap="round"/>
      <ellipse cx="38" cy="44" rx="4" ry="6" fill="#ff8a96" opacity=".7"/>`,
    tomato: () => `
      <circle cx="50" cy="56" r="30" fill="#ee5040" stroke="#cf3a2c" stroke-width="2"/>
      <ellipse cx="38" cy="46" rx="7" ry="10" fill="#ff8a7c" opacity=".7"/>
      <path d="M50 30 L40 24 L46 32 L36 34 L48 35 L44 42 L52 36 L60 42 L56 34 L66 33 L55 31 L60 23Z" fill="#5fb455" stroke="#4a9a42" stroke-width="1.5" stroke-linejoin="round"/>
      <path d="M51 30 L53 20" stroke="#4a9a42" stroke-width="3" stroke-linecap="round"/>`,
    tulip: () => `
      <path d="M50 54 L50 92" stroke="#5aa94b" stroke-width="5" stroke-linecap="round"/>
      <path d="M50 80 C40 74 34 64 36 56 C44 62 48 70 50 78Z" fill="#6cb85a"/>
      <path d="M30 26 C30 46 38 58 50 58 C62 58 70 46 70 26 L60 36 L50 22 L40 36Z" fill="#f2577a" stroke="#d63d61" stroke-width="2" stroke-linejoin="round"/>
      <path d="M50 22 L50 56" stroke="#d63d61" stroke-width="1.5" opacity=".5"/>
      <path d="M36 32 Q37 44 43 50" stroke="#ff9db3" stroke-width="3" stroke-linecap="round" fill="none"/>`,
    pumpkin: () => `
      <path d="M50 30 Q49 20 56 14" stroke="#6d8a3a" stroke-width="5" stroke-linecap="round" fill="none"/>
      <path d="M56 22 C66 14 76 18 76 24 C68 26 62 26 56 24Z" fill="#79b85a"/>
      <ellipse cx="34" cy="58" rx="18" ry="26" fill="#f39a36" stroke="#d97b1f" stroke-width="2"/>
      <ellipse cx="66" cy="58" rx="18" ry="26" fill="#f39a36" stroke="#d97b1f" stroke-width="2"/>
      <ellipse cx="50" cy="58" rx="17" ry="28" fill="#f7a945" stroke="#d97b1f" stroke-width="2"/>
      <path d="M44 42 Q42 52 44 62" stroke="#ffd08a" stroke-width="3" stroke-linecap="round" fill="none"/>`,
    lavender: () => {
      let s = '';
      [[38, 22, -8], [50, 16, 0], [62, 22, 8]].forEach(([x, top, tilt]) => {
        s += `<g transform="rotate(${tilt} ${x} 90)"><path d="M${x} 90 L${x} ${top + 8}" stroke="#6aa85c" stroke-width="3" stroke-linecap="round"/>`;
        for (let i = 0; i < 6; i++) {
          const y = top + i * 7;
          s += `<ellipse cx="${x - 3}" cy="${y}" rx="3.5" ry="4.5" fill="#a07ad8"/><ellipse cx="${x + 3}" cy="${y + 2}" rx="3.5" ry="4.5" fill="#b693e6"/>`;
        }
        s += '</g>';
      });
      return s;
    },
    blueberry: () => `
      <path d="M50 24 C48 30 44 34 40 36 M50 24 C54 30 58 34 62 36" stroke="#5aa94b" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M50 24 C58 14 70 16 72 20 C64 24 56 24 50 24Z" fill="#6cb85a"/>
      ${[[38, 56], [62, 56], [50, 72]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="15" fill="#5b6fc9" stroke="#46559f" stroke-width="2"/><circle cx="${x - 5}" cy="${y - 5}" r="4" fill="#8a9be6" opacity=".8"/><path d="M${x - 4} ${y - 13} L${x} ${y - 9} L${x + 4} ${y - 13}" stroke="#2f3a73" stroke-width="2" fill="none" stroke-linecap="round"/>`).join('')}`,
    apple: () => `
      <path d="M50 30 C40 22 22 26 22 50 C22 74 40 88 50 82 C60 88 78 74 78 50 C78 26 60 22 50 30Z" fill="#ec5050" stroke="#cc3838" stroke-width="2"/>
      <path d="M50 30 Q50 20 54 14" stroke="#7a5230" stroke-width="4" stroke-linecap="round" fill="none"/>
      <path d="M54 20 C62 12 72 14 74 18 C66 22 60 22 54 20Z" fill="#6cb85a"/>
      <ellipse cx="34" cy="46" rx="6" ry="10" fill="#ff8e8e" opacity=".7"/>`,
    lemon: () => `
      <path d="M18 54 C22 34 40 26 54 28 C70 30 82 42 82 54 C78 72 60 80 46 78 C30 76 20 66 18 54Z" fill="#ffd94d" stroke="#e8ba22" stroke-width="2"/>
      <path d="M82 54 L88 52 M18 54 L12 56" stroke="#e8ba22" stroke-width="4" stroke-linecap="round"/>
      <path d="M50 28 C56 18 66 18 70 20 C64 26 58 28 50 28Z" fill="#6cb85a"/>
      <ellipse cx="38" cy="44" rx="10" ry="5" fill="#fff0a8" opacity=".8"/>`,
    cherry: () => `
      <path d="M36 62 Q44 30 60 18 M64 66 Q62 36 60 18" stroke="#6b8a3a" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <path d="M60 18 C70 10 80 14 82 18 C74 22 66 22 60 18Z" fill="#6cb85a"/>
      <circle cx="34" cy="68" r="15" fill="#d8344a" stroke="#b02236" stroke-width="2"/><circle cx="29" cy="63" r="4" fill="#ff7f8f" opacity=".8"/>
      <circle cx="64" cy="72" r="15" fill="#d8344a" stroke="#b02236" stroke-width="2"/><circle cx="59" cy="67" r="4" fill="#ff7f8f" opacity=".8"/>`,
    peach: () => `
      <circle cx="50" cy="56" r="30" fill="#ffb27f" stroke="#ef925c" stroke-width="2"/>
      <path d="M50 28 Q42 56 50 86" stroke="#ef925c" stroke-width="2.5" fill="none"/>
      <ellipse cx="66" cy="60" rx="12" ry="18" fill="#ff8f86" opacity=".55"/>
      <path d="M50 28 C58 16 70 16 74 20 C66 26 58 28 50 28Z" fill="#6cb85a"/>`
  };
  A.produce = (key, cls) => svg('0 0 100 100', (PRODUCE[key] || PRODUCE.apple)(), cls);
  A.PRODUCE = PRODUCE;

  /* ====================== PLANTS IN PLOTS ====================== */
  const leaf = (x, y, rot, s, c) =>
    `<path d="M0 0 C${6 * s} ${-8 * s} ${16 * s} ${-8 * s} ${20 * s} 0 C${16 * s} ${6 * s} ${6 * s} ${6 * s} 0 0Z" fill="${c || '#6cb85a'}" transform="translate(${x} ${y}) rotate(${rot})"/>`;

  A.plant = (cropKey, stage) => {
    const crop = DF.CROPS[cropKey];
    let s = '';
    if (stage === 0) {
      s = `<g><ellipse cx="50" cy="80" rx="18" ry="6" fill="#7b5236"/><circle cx="44" cy="78" r="2.5" fill="#f5deb0"/><circle cx="52" cy="80" r="2.5" fill="#f5deb0"/><circle cx="57" cy="77" r="2.5" fill="#f5deb0"/></g>`;
    } else if (stage === 1) {
      s = `<g class="plant-sway"><path d="M50 82 L50 62" stroke="#5aa94b" stroke-width="4" stroke-linecap="round"/>${leaf(50, 64, -150, 0.9)}${leaf(50, 64, -30, 0.9, '#7fc76a')}</g>`;
    } else if (stage === 2) {
      let top = '';
      if (crop.kind === 'flower') top = `<circle cx="50" cy="38" r="7" fill="#9bd18a" stroke="#5aa94b" stroke-width="2"/>`;
      if (cropKey === 'pumpkin') top = `<circle cx="64" cy="70" r="7" fill="#f7c76d"/>`;
      s = `<g class="plant-sway"><path d="M50 84 L50 42" stroke="#5aa94b" stroke-width="4.5" stroke-linecap="round"/>${leaf(50, 72, -155, 1.2)}${leaf(50, 66, -25, 1.2, '#7fc76a')}${leaf(50, 54, -150, 1)}${leaf(50, 50, -35, 1, '#7fc76a')}${top}</g>`;
    } else {
      // mature
      if (cropKey === 'carrot') {
        s = `<g class="plant-sway">${leaf(50, 66, -110, 1.5)}${leaf(50, 66, -70, 1.6, '#7fc76a')}${leaf(50, 66, -140, 1.3, '#5aa94b')}${leaf(50, 66, -40, 1.3)}</g>
             <path d="M37 84 Q37 66 50 66 Q63 66 63 84Z" fill="#f2903a" stroke="#d97425" stroke-width="2.5"/><path d="M43 74 L49 75 M45 80 L52 80" stroke="#d97425" stroke-width="2" stroke-linecap="round"/><path d="M43 70 Q46 68 49 68" stroke="#ffc58a" stroke-width="3" stroke-linecap="round" fill="none"/>`;
      } else if (crop.kind === 'flower') {
        const h = cropKey === 'sunflower' ? 18 : 30;
        s = `<g class="plant-sway"><path d="M50 86 L50 ${h + 16}" stroke="#5aa94b" stroke-width="5" stroke-linecap="round"/>${leaf(50, 74, -155, 1.3)}${leaf(50, 66, -25, 1.3, '#7fc76a')}
             <g transform="translate(${50 - (cropKey === 'sunflower' ? 24 : 20)} ${h - 12}) scale(${cropKey === 'sunflower' ? 0.48 : 0.4})">${PRODUCE[cropKey]()}</g></g>`;
      } else if (cropKey === 'pumpkin') {
        s = `<path d="M24 80 Q40 60 60 74 T86 70" stroke="#5aa94b" stroke-width="4" fill="none"/>${leaf(30, 70, -60, 1.3)}${leaf(72, 66, -130, 1.2, '#7fc76a')}
             <g transform="translate(28 46) scale(0.46)">${PRODUCE.pumpkin()}</g>`;
      } else {
        // bushy plant with fruit
        const f = PRODUCE[cropKey]();
        s = `<g class="plant-sway"><path d="M50 86 L50 40" stroke="#5aa94b" stroke-width="5" stroke-linecap="round"/>
          ${leaf(50, 76, -160, 1.4)}${leaf(50, 70, -20, 1.4, '#7fc76a')}${leaf(50, 58, -150, 1.2)}${leaf(50, 52, -30, 1.2, '#7fc76a')}${leaf(50, 42, -90, 1)}
          <g transform="translate(22 40) scale(0.26)">${f}</g><g transform="translate(52 48) scale(0.26)">${f}</g><g transform="translate(36 62) scale(0.22)">${f}</g></g>`;
      }
    }
    return svg('0 0 100 100', s, 'plant-svg');
  };

  /* ====================== TREES ====================== */
  const SEASON_LEAF = { Spring: ['#8fd07a', '#a8dc8c'], Summer: ['#6cbf5e', '#80cc6c'], Autumn: ['#efa24a', '#e4793d'], Winter: ['#a9c9b4', '#c3dccb'] };
  A.tree = (fruit, stage, season, hasFruit) => {
    const [c1, c2] = SEASON_LEAF[season] || SEASON_LEAF.Summer;
    if (!fruit) return svg('0 0 120 130', `<ellipse cx="60" cy="116" rx="34" ry="8" fill="#8d6040" opacity=".35"/><path d="M48 112 L72 112 L68 96 L52 96Z" fill="#c98b5a"/><text x="60" y="80" text-anchor="middle" font-size="30" opacity=".5">+</text>`, 'tree-svg');
    if (stage < 2) {
      const h = stage === 0 ? 30 : 50;
      return svg('0 0 120 130', `<ellipse cx="60" cy="116" rx="30" ry="7" fill="#6e4a30" opacity=".3"/><path d="M60 116 L60 ${116 - h}" stroke="#8a5a36" stroke-width="5" stroke-linecap="round"/>${leaf(60, 116 - h + 8, -150, 1.2, c1)}${leaf(60, 116 - h + 8, -30, 1.2, c2)}${stage ? leaf(60, 116 - h + 22, -160, 1.1, c1) + leaf(60, 116 - h + 22, -20, 1.1, c2) : ''}`, 'tree-svg plant-sway');
    }
    let fruits = '';
    if (hasFruit) {
      [[38, 52], [70, 44], [56, 66], [84, 64], [44, 34]].forEach(([x, y]) => (fruits += `<g transform="translate(${x - 9} ${y - 9}) scale(0.18)">${PRODUCE[fruit]()}</g>`));
    }
    const blossom = season === 'Spring' && !hasFruit ? [[40, 40], [72, 34], [58, 60], [86, 56], [30, 58]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="#ffd0dc"/><circle cx="${x}" cy="${y}" r="1.6" fill="#f58aa5"/>`).join('') : '';
    return svg('0 0 120 130', `<ellipse cx="60" cy="118" rx="38" ry="8" fill="#6e4a30" opacity=".3"/>
      <path d="M54 118 L56 76 Q52 66 42 62 M58 80 Q66 68 76 66 M56 118 L66 118 L62 76" stroke="#8a5a36" stroke-width="9" stroke-linecap="round" fill="#8a5a36"/>
      <g class="tree-sway"><circle cx="60" cy="44" r="32" fill="${c1}"/><circle cx="36" cy="56" r="22" fill="${c2}"/><circle cx="84" cy="56" r="22" fill="${c2}"/><circle cx="48" cy="30" r="18" fill="${c2}"/><circle cx="74" cy="30" r="18" fill="${c1}"/>
      <circle cx="44" cy="40" r="6" fill="#fff" opacity=".18"/>${blossom}${fruits}</g>`, 'tree-svg');
  };

  /* ====================== CLOVER THE LAMB ====================== */
  A.clover = (cls) => svg('0 0 140 140', `
    <ellipse cx="70" cy="128" rx="40" ry="7" fill="#000" opacity=".1"/>
    <g class="clover-legs"><rect x="46" y="100" width="9" height="22" rx="4.5" fill="#6d5a63"/><rect x="62" y="102" width="9" height="20" rx="4.5" fill="#6d5a63"/><rect x="78" y="102" width="9" height="20" rx="4.5" fill="#6d5a63"/><rect x="92" y="100" width="9" height="22" rx="4.5" fill="#6d5a63"/></g>
    <g class="clover-body">
      ${[[50, 80, 20], [70, 74, 22], [92, 80, 20], [60, 96, 18], [84, 96, 18], [104, 88, 13], [40, 92, 14]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fffaf3" stroke="#ecdfd0" stroke-width="2"/>`).join('')}
      <circle cx="112" cy="80" r="8" fill="#fffaf3" stroke="#ecdfd0" stroke-width="2" class="clover-tail"/>
    </g>
    <g class="clover-head">
      <ellipse cx="22" cy="58" rx="14" ry="7" fill="#f2cdbd" transform="rotate(-20 22 58)"/>
      <ellipse cx="22" cy="58" rx="9" ry="4" fill="#f7a8b4" transform="rotate(-20 22 58)"/>
      <ellipse cx="90" cy="58" rx="14" ry="7" fill="#f2cdbd" transform="rotate(20 90 58)"/>
      <ellipse cx="90" cy="58" rx="9" ry="4" fill="#f7a8b4" transform="rotate(20 90 58)"/>
      <ellipse cx="56" cy="62" rx="30" ry="28" fill="#f8e1d3"/>
      ${[[38, 36, 11], [52, 30, 12], [66, 31, 12], [78, 38, 10], [46, 40, 9], [60, 40, 9]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fffaf3" stroke="#ecdfd0" stroke-width="1.5"/>`).join('')}
      <g class="blink"><ellipse cx="45" cy="62" rx="5.5" ry="7" fill="#3a2a35"/><ellipse cx="67" cy="62" rx="5.5" ry="7" fill="#3a2a35"/>
      <circle cx="47" cy="59" r="2.2" fill="#fff"/><circle cx="69" cy="59" r="2.2" fill="#fff"/><circle cx="43.5" cy="65" r="1" fill="#fff"/><circle cx="65.5" cy="65" r="1" fill="#fff"/></g>
      <ellipse cx="38" cy="74" rx="6" ry="3.5" fill="#f8a5b3" opacity=".8"/><ellipse cx="74" cy="74" rx="6" ry="3.5" fill="#f8a5b3" opacity=".8"/>
      <path d="M52 76 Q56 80 60 76" stroke="#3a2a35" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <ellipse cx="56" cy="72" rx="3" ry="2" fill="#d98a9a"/>
      <g transform="translate(76 22)">${petals(5, 0, 0, 5, 7, 7, '#ff9fbe', '#f07ea3')}<circle r="4.5" fill="#ffe27a"/></g>
    </g>`, 'clover ' + (cls || ''));

  /* ====================== FARM ANIMALS ======================
     viewBox 0 0 120 110; each type returns body; accessory overlays use HEAD anchors */
  const eyes = (x1, x2, y, r) => `<g class="blink"><ellipse cx="${x1}" cy="${y}" rx="${r}" ry="${r * 1.2}" fill="#2f2630"/><ellipse cx="${x2}" cy="${y}" rx="${r}" ry="${r * 1.2}" fill="#2f2630"/><circle cx="${x1 + r * 0.35}" cy="${y - r * 0.45}" r="${r * 0.4}" fill="#fff"/><circle cx="${x2 + r * 0.35}" cy="${y - r * 0.45}" r="${r * 0.4}" fill="#fff"/></g>`;
  const blush = (x1, x2, y) => `<ellipse cx="${x1}" cy="${y}" rx="4.5" ry="2.6" fill="#f7a1b0" opacity=".75"/><ellipse cx="${x2}" cy="${y}" rx="4.5" ry="2.6" fill="#f7a1b0" opacity=".75"/>`;
  const shadow = `<ellipse cx="60" cy="104" rx="38" ry="5" fill="#000" opacity=".1"/>`;

  const ANIMAL_ART = {
    lamb: () => `${shadow}
      <rect x="40" y="80" width="7" height="22" rx="3.5" fill="#5e4a52"/><rect x="52" y="82" width="7" height="20" rx="3.5" fill="#5e4a52"/><rect x="70" y="82" width="7" height="20" rx="3.5" fill="#5e4a52"/><rect x="82" y="80" width="7" height="22" rx="3.5" fill="#5e4a52"/>
      ${[[48, 66, 16], [66, 60, 18], [84, 66, 16], [56, 80, 14], [76, 80, 14], [96, 72, 10], [38, 76, 11]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fffaf3" stroke="#e6d9ca" stroke-width="2"/>`).join('')}
      <ellipse cx="18" cy="46" rx="10" ry="5" fill="#e9c7b6" transform="rotate(-20 18 46)"/><ellipse cx="60" cy="46" rx="10" ry="5" fill="#e9c7b6" transform="rotate(20 60 46)"/>
      <ellipse cx="39" cy="50" rx="21" ry="19" fill="#f2d6c6"/>
      ${[[28, 32, 8], [39, 28, 9], [50, 32, 8]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fffaf3" stroke="#e6d9ca" stroke-width="1.5"/>`).join('')}
      ${eyes(32, 46, 50, 3.6)}${blush(26, 52, 58)}<path d="M36 60 Q39 63 42 60" stroke="#2f2630" stroke-width="2" fill="none" stroke-linecap="round"/>`,
    chicken: () => `${shadow}
      <path d="M52 92 L50 102 M46 102 L54 102 M68 92 L70 102 M66 102 L74 102" stroke="#f0a43a" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M90 52 C104 40 108 58 100 66 C106 62 108 74 96 76Z" fill="#fff" stroke="#e9e1dd" stroke-width="2"/>
      <ellipse cx="62" cy="68" rx="32" ry="26" fill="#fffdf9" stroke="#ece3dd" stroke-width="2"/>
      <path d="M58 64 C70 58 84 64 82 76 C74 82 62 78 58 64Z" fill="#f4ece6"/>
      <circle cx="42" cy="44" r="18" fill="#fffdf9" stroke="#ece3dd" stroke-width="2"/>
      <path d="M34 28 C34 20 40 20 41 26 C42 18 49 18 48 27 C52 22 56 26 50 32Z" fill="#ef5a5a"/>
      <path d="M24 44 L16 47 L24 50Z" fill="#f6b33c" stroke="#e39b22" stroke-width="1.5" stroke-linejoin="round"/>
      <path d="M26 52 C24 58 28 60 30 56Z" fill="#ef5a5a"/>
      ${eyes(36, 48, 42, 3)}${blush(32, 52, 50)}`,
    rabbit: () => `${shadow}
      <ellipse cx="66" cy="74" rx="30" ry="24" fill="#ead2b8" stroke="#d9bc9f" stroke-width="2"/>
      <circle cx="96" cy="78" r="9" fill="#fffaf2" stroke="#e8dccb" stroke-width="2"/>
      <ellipse cx="52" cy="98" rx="10" ry="5" fill="#ead2b8" stroke="#d9bc9f" stroke-width="2"/><ellipse cx="80" cy="98" rx="10" ry="5" fill="#ead2b8" stroke="#d9bc9f" stroke-width="2"/>
      <g class="ears"><ellipse cx="30" cy="20" rx="7" ry="20" fill="#ead2b8" stroke="#d9bc9f" stroke-width="2" transform="rotate(-12 30 20)"/><ellipse cx="30" cy="22" rx="3.5" ry="13" fill="#f7b1bd" transform="rotate(-12 30 22)"/>
      <ellipse cx="50" cy="18" rx="7" ry="20" fill="#ead2b8" stroke="#d9bc9f" stroke-width="2" transform="rotate(10 50 18)"/><ellipse cx="50" cy="20" rx="3.5" ry="13" fill="#f7b1bd" transform="rotate(10 50 20)"/></g>
      <ellipse cx="40" cy="54" rx="22" ry="19" fill="#f0dcc4" stroke="#d9bc9f" stroke-width="2"/>
      ${eyes(32, 48, 52, 3.4)}${blush(27, 53, 60)}
      <path d="M38 59 L42 59 L40 62Z" fill="#e98a9c"/><path d="M40 62 Q37 66 35 64 M40 62 Q43 66 45 64" stroke="#7a5a50" stroke-width="1.5" fill="none" stroke-linecap="round"/>`,
    duck: () => `${shadow}
      <path d="M56 96 L54 102 L62 102 M74 96 L72 102 L80 102" stroke="#f39a33" stroke-width="3.5" stroke-linecap="round" fill="none"/>
      <path d="M30 70 C30 52 56 50 74 56 C88 50 104 50 106 60 C108 76 96 96 66 96 C44 96 30 86 30 70Z" fill="#fffef8" stroke="#e8e4d6" stroke-width="2"/>
      <path d="M62 66 C76 60 92 64 94 74 C84 82 70 80 62 66Z" fill="#f2efe4"/>
      <circle cx="40" cy="42" r="18" fill="#fffef8" stroke="#e8e4d6" stroke-width="2"/>
      <path d="M22 44 C12 44 10 50 14 52 C18 54 24 52 28 50Z" fill="#f6a23a" stroke="#e18a1f" stroke-width="1.5"/>
      ${eyes(36, 48, 38, 3)}${blush(32, 52, 47)}`,
    cow: () => `${shadow}
      <rect x="38" y="78" width="9" height="24" rx="4" fill="#fff" stroke="#d9d2cc" stroke-width="1.5"/><rect x="52" y="80" width="9" height="22" rx="4" fill="#fff" stroke="#d9d2cc" stroke-width="1.5"/><rect x="76" y="80" width="9" height="22" rx="4" fill="#fff" stroke="#d9d2cc" stroke-width="1.5"/><rect x="90" y="78" width="9" height="24" rx="4" fill="#fff" stroke="#d9d2cc" stroke-width="1.5"/>
      <rect x="36" y="98" width="11" height="5" rx="2" fill="#6b5050"/><rect x="88" y="98" width="11" height="5" rx="2" fill="#6b5050"/>
      <path d="M106 62 Q114 76 108 84" stroke="#d9d2cc" stroke-width="3" fill="none"/><circle cx="108" cy="86" r="4" fill="#6b5050"/>
      <rect x="34" y="52" width="74" height="36" rx="18" fill="#fffdfa" stroke="#e1dad3" stroke-width="2"/>
      <path d="M60 52 C66 60 80 62 84 52Z M88 70 C96 66 104 74 100 84 C92 86 86 78 88 70Z M44 74 C50 70 56 76 52 84 C46 86 42 80 44 74Z" fill="#7a5c58"/>
      <path d="M22 26 Q16 18 20 14 M54 26 Q60 18 56 14" stroke="#f3e2c2" stroke-width="5" stroke-linecap="round" fill="none"/>
      <ellipse cx="14" cy="38" rx="10" ry="5" fill="#fffdfa" stroke="#e1dad3" stroke-width="1.5" transform="rotate(-15 14 38)"/><ellipse cx="62" cy="38" rx="10" ry="5" fill="#fffdfa" stroke="#e1dad3" stroke-width="1.5" transform="rotate(15 62 38)"/>
      <ellipse cx="38" cy="44" rx="22" ry="22" fill="#fffdfa" stroke="#e1dad3" stroke-width="2"/>
      <path d="M26 30 C32 26 40 30 38 38 C32 40 26 36 26 30Z" fill="#7a5c58"/>
      <ellipse cx="38" cy="60" rx="16" ry="10" fill="#f6bcc4"/><ellipse cx="32" cy="60" rx="2.4" ry="3" fill="#c97c8a"/><ellipse cx="44" cy="60" rx="2.4" ry="3" fill="#c97c8a"/>
      ${eyes(30, 46, 44, 3.2)}`,
    cat: () => `${shadow}
      <path d="M86 92 C108 92 110 68 98 60 C106 72 100 86 86 86Z" fill="#f0a868" stroke="#d98a48" stroke-width="2"/>
      <path d="M40 98 C36 76 42 60 60 58 C78 60 86 76 82 98Z" fill="#f4b679" stroke="#d98a48" stroke-width="2"/>
      <path d="M52 66 L56 72 M64 64 L64 72 M74 68 L70 74" stroke="#d98a48" stroke-width="3" stroke-linecap="round"/>
      <ellipse cx="50" cy="98" rx="8" ry="5" fill="#fff4e6" stroke="#d98a48" stroke-width="1.5"/><ellipse cx="72" cy="98" rx="8" ry="5" fill="#fff4e6" stroke="#d98a48" stroke-width="1.5"/>
      <path d="M36 32 L34 10 L52 24Z M84 32 L86 10 L68 24Z" fill="#f4b679" stroke="#d98a48" stroke-width="2" stroke-linejoin="round"/>
      <path d="M38 26 L37 15 L46 22Z M82 26 L83 15 L74 22Z" fill="#f7b1bd"/>
      <ellipse cx="60" cy="40" rx="26" ry="22" fill="#f4b679" stroke="#d98a48" stroke-width="2"/>
      <path d="M54 20 L56 28 M60 19 L60 28 M66 20 L64 28" stroke="#d98a48" stroke-width="2.5" stroke-linecap="round"/>
      <ellipse cx="60" cy="50" rx="11" ry="7" fill="#fff4e6"/>
      ${eyes(50, 70, 40, 3.4)}${blush(44, 76, 48)}
      <path d="M58 46 L62 46 L60 49Z" fill="#e98a9c"/><path d="M60 49 Q57 53 54 51 M60 49 Q63 53 66 51" stroke="#7a5040" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      <path d="M40 48 L28 46 M40 51 L28 53 M80 48 L92 46 M80 51 L92 53" stroke="#b78058" stroke-width="1.2" stroke-linecap="round"/>`,
    dog: () => `${shadow}
      <path d="M84 84 C98 80 104 66 100 60" stroke="#d29a5c" stroke-width="7" stroke-linecap="round" fill="none" class="wag"/>
      <path d="M40 98 C36 76 44 62 60 60 C76 62 84 76 80 98Z" fill="#e3b072" stroke="#c48a4c" stroke-width="2"/>
      <ellipse cx="60" cy="82" rx="10" ry="14" fill="#fff1dc"/>
      <ellipse cx="50" cy="98" rx="8" ry="5" fill="#fff1dc" stroke="#c48a4c" stroke-width="1.5"/><ellipse cx="70" cy="98" rx="8" ry="5" fill="#fff1dc" stroke="#c48a4c" stroke-width="1.5"/>
      <ellipse cx="60" cy="40" rx="25" ry="23" fill="#e3b072" stroke="#c48a4c" stroke-width="2"/>
      <path d="M38 26 C26 26 24 52 32 58 C38 54 40 40 40 30Z M82 26 C94 26 96 52 88 58 C82 54 80 40 80 30Z" fill="#a8703e"/>
      <ellipse cx="60" cy="52" rx="13" ry="9" fill="#fff1dc"/>
      ${eyes(50, 70, 38, 3.4)}${blush(43, 77, 47)}
      <ellipse cx="60" cy="47" rx="4.5" ry="3.2" fill="#3a2a2a"/>
      <path d="M60 50 L60 54 Q56 58 53 55 M60 54 Q64 58 67 55" stroke="#3a2a2a" stroke-width="1.6" fill="none" stroke-linecap="round"/>
      <path d="M57 56 Q60 64 63 56Z" fill="#f28a9a"/>`,
    pony: () => `${shadow}
      <rect x="38" y="70" width="8" height="30" rx="4" fill="#f3dfc8" stroke="#d6bc9c" stroke-width="1.5"/><rect x="50" y="72" width="8" height="28" rx="4" fill="#f3dfc8" stroke="#d6bc9c" stroke-width="1.5"/><rect x="78" y="72" width="8" height="28" rx="4" fill="#f3dfc8" stroke="#d6bc9c" stroke-width="1.5"/><rect x="90" y="70" width="8" height="30" rx="4" fill="#f3dfc8" stroke="#d6bc9c" stroke-width="1.5"/>
      <rect x="37" y="96" width="10" height="6" rx="2" fill="#8a6a8a"/><rect x="89" y="96" width="10" height="6" rx="2" fill="#8a6a8a"/>
      <path d="M100 56 C116 58 116 82 108 90 C110 76 106 66 98 64Z" fill="#c9a6ea"/>
      <ellipse cx="68" cy="62" rx="34" ry="18" fill="#f8e7d2" stroke="#d6bc9c" stroke-width="2"/>
      <path d="M40 60 L30 30 L46 30 L54 58Z" fill="#f8e7d2" stroke="#d6bc9c" stroke-width="2" stroke-linejoin="round"/>
      <ellipse cx="30" cy="30" rx="16" ry="14" fill="#f8e7d2" stroke="#d6bc9c" stroke-width="2"/>
      <ellipse cx="18" cy="36" rx="10" ry="8" fill="#f2d0c0"/><circle cx="14" cy="35" r="1.6" fill="#8a6a6a"/>
      <path d="M34 18 L38 8 L42 20Z" fill="#f8e7d2" stroke="#d6bc9c" stroke-width="1.5"/>
      <path d="M40 16 C50 18 52 30 50 42 C48 54 50 60 56 64 C46 62 42 50 44 40 C40 30 36 24 40 16Z" fill="#b48fe0"/>
      <path d="M30 18 C34 12 42 14 42 20 C36 22 32 24 30 18Z" fill="#c9a6ea"/>
      <g class="blink"><ellipse cx="30" cy="28" rx="3.4" ry="4.2" fill="#2f2630"/><circle cx="31.2" cy="26.4" r="1.4" fill="#fff"/></g><ellipse cx="26" cy="36" rx="4.5" ry="2.6" fill="#f7a1b0" opacity=".75"/>`
  };
  // Head anchors for accessories: [x, y, size]
  const HEAD = { lamb: [39, 30, 1], chicken: [44, 26, 0.9], rabbit: [40, 36, 1], duck: [40, 26, 0.9], cow: [38, 24, 1], cat: [60, 20, 1], dog: [60, 18, 1], pony: [32, 18, 0.9] };
  const NECK = { lamb: [39, 68], chicken: [44, 60], rabbit: [40, 72], duck: [42, 58], cow: [38, 66], cat: [60, 60], dog: [60, 62], pony: [36, 46] };

  const ACC_ART = {
    acc_bow: (x, y, s) => `<g transform="translate(${x + 12 * s} ${y - 2}) scale(${s})"><path d="M0 0 L-12 -8 L-12 8Z M0 0 L12 -8 L12 8Z" fill="#f47fa5" stroke="#d85f88" stroke-width="1.5" stroke-linejoin="round"/><circle r="3.5" fill="#ff9fc0" stroke="#d85f88" stroke-width="1.5"/></g>`,
    acc_hat: (x, y, s) => `<g transform="translate(${x} ${y - 6}) scale(${s})"><ellipse cx="0" cy="4" rx="22" ry="5" fill="#f3d48a" stroke="#d8b25c" stroke-width="1.5"/><path d="M-12 4 C-12 -12 12 -12 12 4Z" fill="#f6dc96" stroke="#d8b25c" stroke-width="1.5"/><rect x="-12" y="-2" width="24" height="4" fill="#f58aa5"/></g>`,
    flower_crown: (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">${[-14, -5, 5, 14].map((dx, i) => `<g transform="translate(${dx} ${-Math.abs(dx) * 0.2})">${petals(5, 0, 0, 3, 4.5, 4.5, i % 2 ? '#fff' : '#c9a6ea')}<circle r="2.4" fill="#ffd34d"/></g>`).join('')}</g>`,
    acc_bell: (x, y) => `<g transform="translate(${x} ${y})"><path d="M-14 -3 Q0 4 14 -3" stroke="#e86a8a" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M-5 1 C-5 -4 5 -4 5 1 L6 7 L-6 7Z" fill="#ffd34d" stroke="#d9a923" stroke-width="1.5"/><circle cx="0" cy="8" r="1.8" fill="#b88a12"/></g>`,
    acc_bandana: (x, y) => `<g transform="translate(${x} ${y})"><path d="M-16 -4 Q0 4 16 -4 L0 12Z" fill="#7fb6ea" stroke="#5b95cd" stroke-width="1.5" stroke-linejoin="round"/><circle cx="-4" cy="2" r="1.2" fill="#fff"/><circle cx="4" cy="3" r="1.2" fill="#fff"/><circle cx="0" cy="7" r="1.2" fill="#fff"/></g>`
  };

  A.animal = (type, accessory, cls) => {
    let body = (ANIMAL_ART[type] || ANIMAL_ART.lamb)();
    let acc = '';
    if (accessory && ACC_ART[accessory]) {
      if (accessory === 'acc_bell' || accessory === 'acc_bandana') { const [x, y] = NECK[type] || [50, 60]; acc = ACC_ART[accessory](x, y); }
      else { const [x, y, s] = HEAD[type] || [40, 30, 1]; acc = ACC_ART[accessory](x, y, s); }
    }
    return svg('0 0 120 110', `<g class="animal-body">${body}${acc}</g>`, 'animal-svg animal-' + type + ' ' + (cls || ''));
  };

  /* ====================== AVATAR ====================== */
  A.avatar = (av, cls) => {
    av = av || {};
    const skin = av.skin || '#f5c9a3', hc = av.hairColor || '#6b4128', oc = av.outfitColor || '#9fcf9a';
    const hair = av.hair || 'long', outfit = av.outfit || 'overalls', acc = av.acc || 'none';
    const dark = (c) => c; // simple
    let back = '', front = '', body = '', extra = '', accS = '', wings = '';
    // ---- hair back layer
    if (hair === 'long') back = `<path d="M32 46 C28 74 30 96 40 104 L80 104 C90 96 92 74 88 46Z" fill="${hc}"/>`;
    if (hair === 'braids') back = `<g fill="${hc}">${[0, 1, 2, 3].map(i => `<ellipse cx="34" cy="${70 + i * 9}" rx="6" ry="6"/><ellipse cx="86" cy="${70 + i * 9}" rx="6" ry="6"/>`).join('')}</g><circle cx="34" cy="108" r="3.5" fill="#f58aa5"/><circle cx="86" cy="108" r="3.5" fill="#f58aa5"/>`;
    if (hair === 'pony') back = `<path d="M84 34 C104 36 104 70 92 84 C96 64 92 48 82 44Z" fill="${hc}"/>`;
    if (hair === 'curly') back = `<g fill="${hc}">${[[30, 40, 14], [26, 58, 12], [30, 74, 11], [90, 40, 14], [94, 58, 12], [90, 74, 11], [60, 20, 16], [42, 24, 14], [78, 24, 14]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}</g>`;
    if (hair === 'buns') back = `<circle cx="34" cy="22" r="13" fill="${hc}"/><circle cx="86" cy="22" r="13" fill="${hc}"/>`;
    if (hair === 'bob') back = `<path d="M30 44 C28 64 30 74 38 78 L82 78 C90 74 92 64 90 44Z" fill="${hc}"/>`;
    if (acc === 'wings') wings = `<g opacity=".85"><path d="M40 92 C14 70 8 96 20 108 C28 114 38 104 42 98Z" fill="#d6ecfb" stroke="#a8cfee" stroke-width="2"/><path d="M80 92 C106 70 112 96 100 108 C92 114 82 104 78 98Z" fill="#d6ecfb" stroke="#a8cfee" stroke-width="2"/></g>`;
    // ---- body & outfit
    const legs = `<rect x="48" y="122" width="9" height="18" rx="4" fill="${skin}"/><rect x="63" y="122" width="9" height="18" rx="4" fill="${skin}"/><ellipse cx="51" cy="141" rx="8" ry="4.5" fill="#6d4e57"/><ellipse cx="69" cy="141" rx="8" ry="4.5" fill="#6d4e57"/>`;
    const arms = (sleeve) => `<path d="M40 92 Q30 106 34 118" stroke="${sleeve || skin}" stroke-width="9" stroke-linecap="round" fill="none"/><path d="M80 92 Q90 106 86 118" stroke="${sleeve || skin}" stroke-width="9" stroke-linecap="round" fill="none"/><circle cx="34" cy="119" r="5" fill="${skin}"/><circle cx="86" cy="119" r="5" fill="${skin}"/>`;
    if (outfit === 'overalls') body = `${arms('#fff6e8')}<path d="M42 88 Q60 82 78 88 L82 126 L38 126Z" fill="#fff6e8"/><path d="M44 100 L76 100 L80 128 L40 128Z" fill="${oc}"/><path d="M46 88 L48 102 M74 88 L72 102" stroke="${oc}" stroke-width="5"/><rect x="54" y="106" width="12" height="9" rx="2" fill="#fff" opacity=".45"/><circle cx="48" cy="101" r="2" fill="#ffe08a"/><circle cx="72" cy="101" r="2" fill="#ffe08a"/>`;
    if (outfit === 'dress') body = `${arms()}<path d="M44 86 Q60 80 76 86 L76 100 L88 128 L32 128 L44 100Z" fill="${oc}"/><path d="M36 122 L84 122" stroke="#fff" stroke-width="2" stroke-dasharray="4 4" opacity=".7"/>${[[50, 108], [62, 114], [70, 104], [46, 120]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.2" fill="#fff" opacity=".8"/>`).join('')}`;
    if (outfit === 'hoodie') body = `${arms(oc)}<path d="M40 88 Q60 80 80 88 L82 128 L38 128Z" fill="${oc}"/><path d="M48 86 Q60 96 72 86" stroke="#fff" stroke-width="2" fill="none" opacity=".6"/><path d="M54 92 L54 104 M66 92 L66 104" stroke="#fff" stroke-width="2" opacity=".7"/><rect x="48" y="110" width="24" height="10" rx="4" fill="#000" opacity=".08"/>`;
    if (outfit === 'raincoat') body = `${arms('#ffd84d')}<path d="M40 86 Q60 80 80 86 L84 130 L36 130Z" fill="#ffd84d"/><path d="M60 86 L60 130" stroke="#e3b82a" stroke-width="2"/>${[96, 106, 116].map(y => `<circle cx="64" cy="${y}" r="2" fill="#e3b82a"/>`).join('')}<rect x="44" y="110" width="10" height="8" rx="2" fill="#e3b82a" opacity=".6"/>`;
    if (outfit === 'explorer') body = `${arms('#e9dcc0')}<path d="M40 88 Q60 82 80 88 L82 128 L38 128Z" fill="#e9dcc0"/><path d="M44 88 L48 126 L56 126 L56 92Z M76 88 L72 126 L64 126 L64 92Z" fill="#8bab6a"/><rect x="45" y="104" width="9" height="8" rx="1.5" fill="#6f8f52"/><rect x="66" y="104" width="9" height="8" rx="1.5" fill="#6f8f52"/><circle cx="60" cy="100" r="3" fill="#e9b04a"/>`;
    if (outfit === 'fairy') body = `${arms()}<path d="M46 86 Q60 80 74 86 L74 98 L92 130 Q60 122 28 130 L46 98Z" fill="${oc}" opacity=".95"/><path d="M28 130 Q40 120 50 130 Q60 120 70 130 Q80 120 92 130" fill="#fff" opacity=".35"/>${[[48, 112], [66, 106], [74, 118], [56, 122]].map(([x, y]) => `<path d="M${x} ${y - 3} L${x + 1} ${y} L${x} ${y + 3} L${x - 1} ${y}Z" fill="#fff"/>`).join('')}`;
    // ---- head
    const head = `<rect x="54" y="74" width="12" height="12" rx="3" fill="${skin}"/><ellipse cx="60" cy="50" rx="28" ry="27" fill="${skin}"/>
      <ellipse cx="32" cy="54" rx="5" ry="7" fill="${skin}"/><ellipse cx="88" cy="54" rx="5" ry="7" fill="${skin}"/>
      <g class="blink"><ellipse cx="49" cy="56" rx="4" ry="5.2" fill="#3a2a2e"/><ellipse cx="71" cy="56" rx="4" ry="5.2" fill="#3a2a2e"/><circle cx="50.5" cy="54" r="1.6" fill="#fff"/><circle cx="72.5" cy="54" r="1.6" fill="#fff"/></g>
      <ellipse cx="41" cy="64" rx="5" ry="3" fill="#f39aa8" opacity=".55"/><ellipse cx="79" cy="64" rx="5" ry="3" fill="#f39aa8" opacity=".55"/>
      <path d="M55 66 Q60 71 65 66" stroke="#9a4a52" stroke-width="2.3" fill="none" stroke-linecap="round"/>`;
    // ---- hair front
    const fringe = `<path d="M32 50 C30 26 46 18 60 18 C76 18 92 26 88 50 C82 38 74 34 66 33 C64 38 58 40 52 38 C46 42 38 44 32 50Z" fill="${hc}"/>`;
    if (hair === 'pixie') front = `<path d="M32 52 C26 26 46 16 62 18 C80 18 94 30 88 52 C84 40 78 34 70 34 C64 40 52 40 44 36 C40 42 36 46 32 52Z" fill="${hc}"/>`;
    else if (hair === 'curly') front = `<g fill="${hc}">${[[38, 34, 10], [50, 28, 11], [62, 27, 11], [74, 30, 10], [84, 38, 9], [34, 44, 8]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}</g>`;
    else front = fringe;
    if (hair === 'pony') extra = `<circle cx="84" cy="36" r="4" fill="#f58aa5"/>`;
    // ---- accessory
    if (acc === 'flower') accS = `<g transform="translate(80 30)">${petals(5, 0, 0, 4, 6, 6, '#ff9fbe', '#f07ea3')}<circle r="3.5" fill="#ffe27a"/></g>`;
    if (acc === 'hat') accS = `<ellipse cx="60" cy="28" rx="40" ry="9" fill="#f3d48a" stroke="#d8b25c" stroke-width="2"/><path d="M38 28 C38 4 82 4 82 28Z" fill="#f6dc96" stroke="#d8b25c" stroke-width="2"/><rect x="38" y="20" width="44" height="7" fill="#f58aa5"/><g transform="translate(78 22)">${petals(5, 0, 0, 3, 4.5, 4.5, '#fff')}<circle r="2.5" fill="#ffd34d"/></g>`;
    if (acc === 'bow') accS = `<g transform="translate(60 18)"><path d="M0 0 L-16 -10 L-16 10Z M0 0 L16 -10 L16 10Z" fill="#f47fa5" stroke="#d85f88" stroke-width="2" stroke-linejoin="round"/><circle r="4.5" fill="#ff9fc0" stroke="#d85f88" stroke-width="2"/></g>`;
    if (acc === 'glasses') accS = `<g fill="none" stroke="#6b4a5a" stroke-width="2.4"><circle cx="49" cy="56" r="8.5"/><circle cx="71" cy="56" r="8.5"/><path d="M57.5 56 L62.5 56"/></g>`;
    if (acc === 'headband') accS = `<path d="M33 40 C38 22 82 22 87 40" stroke="#8fc4ea" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="72" cy="26" r="5" fill="#ffd34d"/>`;
    if (acc === 'crown') accS = `<g>${[-22, -11, 0, 11, 22].map((dx, i) => `<g transform="translate(${60 + dx} ${26 + Math.abs(dx) * 0.25})">${petals(5, 0, 0, 3.4, 5, 5, ['#fff', '#c9a6ea', '#ff9fbe', '#fff', '#c9a6ea'][i])}<circle r="2.6" fill="#ffd34d"/></g>`).join('')}</g>`;
    return svg('0 0 120 150', `${wings}${back}${legs}${body}${head}${front}${extra}${accS}`, 'avatar-svg ' + (cls || ''));
  };

  /* ====================== ITEM ICONS ====================== */
  const packet = (crop) => `<rect x="18" y="12" width="64" height="80" rx="8" fill="#f6ead2" stroke="#d9c39a" stroke-width="2.5"/><path d="M18 26 L82 26" stroke="#d9c39a" stroke-width="2.5"/><path d="M30 19 L70 19" stroke="#e8d6b2" stroke-width="3" stroke-dasharray="3 4"/><g transform="translate(26 32) scale(0.48)">${PRODUCE[crop]()}</g><rect x="28" y="80" width="44" height="7" rx="3.5" fill="#9fcf9a"/>`;
  const sapling = (fruit) => `<path d="M30 70 L70 70 L64 92 L36 92Z" fill="#d48c5a" stroke="#b56f40" stroke-width="2"/><rect x="26" y="64" width="48" height="9" rx="3" fill="#e09b67" stroke="#b56f40" stroke-width="2"/><path d="M50 64 L50 30" stroke="#8a5a36" stroke-width="4" stroke-linecap="round"/>${leaf(50, 40, -150, 1.2)}${leaf(50, 40, -30, 1.2, '#7fc76a')}${leaf(50, 54, -160, 1)}<g transform="translate(54 16) scale(0.24)">${PRODUCE[fruit]()}</g>`;
  const GOODS_ART = {
    wool: () => [[38, 48, 18], [60, 42, 20], [70, 60, 17], [44, 64, 16], [56, 62, 14]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fffaf3" stroke="#e6d9ca" stroke-width="2.5"/>`).join(''),
    fluff: () => [[40, 50, 16], [58, 44, 18], [66, 60, 15], [46, 64, 13]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#f0dcc4" stroke="#d9bc9f" stroke-width="2.5"/>`).join('') + '<path d="M48 50 Q54 46 60 50" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>',
    egg: () => `<ellipse cx="50" cy="54" rx="24" ry="30" fill="#fff8ec" stroke="#e8d8bd" stroke-width="2.5"/><ellipse cx="42" cy="42" rx="5" ry="9" fill="#fff" />`,
    duck_egg: () => `<ellipse cx="50" cy="54" rx="26" ry="32" fill="#e6f3ee" stroke="#bcd8cd" stroke-width="2.5"/><ellipse cx="42" cy="42" rx="5" ry="9" fill="#fff"/>`,
    milk: () => `<path d="M34 34 L40 22 L60 22 L66 34 L66 88 Q66 92 62 92 L38 92 Q34 92 34 88Z" fill="#fff" stroke="#cfd8e3" stroke-width="2.5"/><rect x="38" y="14" width="24" height="9" rx="3" fill="#8fc4ea"/><rect x="34" y="50" width="32" height="22" fill="#8fc4ea" opacity=".6"/><path d="M42 61 Q50 54 58 61" stroke="#fff" stroke-width="3" fill="none"/>`,
    horseshoe: () => `<path d="M30 30 C26 70 40 86 50 86 C60 86 74 70 70 30" stroke="#b9b2c4" stroke-width="13" fill="none" stroke-linecap="round"/><path d="M30 30 C26 70 40 86 50 86 C60 86 74 70 70 30" stroke="#e5e0ec" stroke-width="5" fill="none" stroke-linecap="round"/>${[[30, 46], [34, 64], [70, 46], [66, 64]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.2" fill="#8d8698"/>`).join('')}`,
    seed_packet: () => `<rect x="18" y="12" width="64" height="80" rx="8" fill="#e4d8f6" stroke="#b9a3e0" stroke-width="2.5"/><text x="50" y="66" text-anchor="middle" font-size="40" font-weight="700" fill="#8a6cc8" font-family="Fredoka, sans-serif">?</text>`,
    scraps: () => `<path d="M24 70 C30 56 44 58 48 66 C44 74 30 78 24 70Z" fill="#f2903a"/><path d="M50 72 C56 54 72 52 78 62 C72 72 60 76 50 72Z" fill="#7fc76a"/><path d="M36 58 C38 42 54 38 60 48 C54 58 44 60 36 58Z" fill="#ef5a4a" opacity=".85"/><ellipse cx="50" cy="80" rx="30" ry="6" fill="#8d6040" opacity=".25"/>`,
    wood: () => `<g stroke="#7a4f2e" stroke-width="2"><rect x="18" y="56" width="64" height="14" rx="7" fill="#b9814f" transform="rotate(-12 50 63)"/><rect x="20" y="42" width="58" height="12" rx="6" fill="#c99260" transform="rotate(10 50 48)"/></g><circle cx="76" cy="54" r="4" fill="#e3b989"/><path d="M30 36 L24 28 M30 36 L36 28" stroke="#7fc76a" stroke-width="3" stroke-linecap="round"/>`,
    bottle: () => `<path d="M42 14 L58 14 L58 30 Q70 38 70 52 L70 86 Q70 92 64 92 L36 92 Q30 92 30 86 L30 52 Q30 38 42 30Z" fill="#a8dcc8" stroke="#6fb59b" stroke-width="2.5" opacity=".95"/><rect x="40" y="8" width="20" height="8" rx="2" fill="#5aa0d8"/><path d="M38 50 L38 80" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".6"/>`,
    can: () => `<rect x="30" y="20" width="40" height="66" rx="5" fill="#d9dde6" stroke="#9aa1b2" stroke-width="2.5"/><ellipse cx="50" cy="22" rx="20" ry="5" fill="#eef1f6" stroke="#9aa1b2" stroke-width="2"/><rect x="30" y="40" width="40" height="24" fill="#f58aa5" opacity=".7"/><path d="M38 30 L38 78" stroke="#fff" stroke-width="3" opacity=".6"/>`,
    compost: () => `<path d="M24 40 Q50 30 76 40 L72 88 Q50 94 28 88Z" fill="#b8865a" stroke="#8d6040" stroke-width="2.5"/><ellipse cx="50" cy="40" rx="26" ry="8" fill="#6b4a32"/><circle cx="42" cy="38" r="3" fill="#8f6646"/><circle cx="56" cy="40" r="3" fill="#8f6646"/><path d="M48 34 Q50 22 58 18" stroke="#6cb85a" stroke-width="3" fill="none" stroke-linecap="round"/>${leaf(58, 20, -40, 0.8)}<path d="M40 60 Q50 68 60 60" stroke="#f6d08a" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    yarn: () => `<circle cx="50" cy="52" r="30" fill="#f6a8c4" stroke="#e080a5" stroke-width="2.5"/><path d="M26 40 Q50 56 74 38 M24 56 Q50 72 76 54 M34 76 Q50 40 64 26 M40 80 Q66 56 72 32" stroke="#e080a5" stroke-width="2.5" fill="none"/><path d="M78 70 Q90 80 84 90" stroke="#e080a5" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    jam: () => `<rect x="28" y="34" width="44" height="54" rx="9" fill="#ef4a5b" stroke="#c9374a" stroke-width="2.5"/><rect x="26" y="22" width="48" height="14" rx="4" fill="#fbe2a8" stroke="#d8b878" stroke-width="2"/><path d="M26 30 L74 30" stroke="#f58aa5" stroke-width="3" stroke-dasharray="4 4"/><rect x="36" y="50" width="28" height="20" rx="4" fill="#fff6e8"/><g transform="translate(40 50) scale(0.2)">${PRODUCE.strawberry()}</g><path d="M34 40 L34 78" stroke="#ff9aa6" stroke-width="3" stroke-linecap="round"/>`,
    apple_pie: () => `<ellipse cx="50" cy="66" rx="40" ry="16" fill="#e4a95e" stroke="#c48a40" stroke-width="2.5"/><ellipse cx="50" cy="58" rx="38" ry="14" fill="#f2c27a" stroke="#c48a40" stroke-width="2"/><path d="M24 58 L76 58 M36 48 L64 68 M64 48 L36 68" stroke="#d9a050" stroke-width="3"/><path d="M42 36 Q40 28 44 22 M54 34 Q52 26 56 20" stroke="#ddd" stroke-width="2" fill="none" opacity=".8"/>`,
    lemonade: () => `<path d="M30 28 L70 28 L64 88 Q63 92 58 92 L42 92 Q37 92 36 88Z" fill="#fff6b0" stroke="#e8c84a" stroke-width="2.5"/><path d="M33 44 L67 44 L63 86 L37 86Z" fill="#ffe36a" opacity=".85"/><circle cx="68" cy="28" r="12" fill="#ffd94d" stroke="#e8ba22" stroke-width="2"/><path d="M60 28 L76 28 M68 20 L68 36" stroke="#e8ba22" stroke-width="1.5"/><path d="M52 18 L46 70" stroke="#f58aa5" stroke-width="4" stroke-linecap="round"/>`,
    flower_crown: () => `<ellipse cx="50" cy="56" rx="32" ry="20" fill="none" stroke="#6cb85a" stroke-width="5"/>${[[20, 54], [34, 38], [50, 34], [66, 38], [80, 54], [66, 72], [34, 72], [50, 76]].map(([x, y], i) => `<g transform="translate(${x} ${y})">${petals(5, 0, 0, 3.5, 5, 5, i % 2 ? '#fff' : '#c9a6ea')}<circle r="2.6" fill="#ffd34d"/></g>`).join('')}`,
    acc_bow: () => `<g transform="translate(50 50) scale(2.2)"><path d="M0 0 L-14 -9 L-14 9Z M0 0 L14 -9 L14 9Z" fill="#f47fa5" stroke="#d85f88" stroke-width="1.5" stroke-linejoin="round"/><circle r="4" fill="#ff9fc0" stroke="#d85f88" stroke-width="1.5"/></g>`,
    acc_bell: () => `<g transform="translate(50 46) scale(2.6)"><path d="M-7 2 C-7 -6 7 -6 7 2 L8 10 L-8 10Z" fill="#ffd34d" stroke="#d9a923" stroke-width="1.2"/><circle cx="0" cy="11" r="2.2" fill="#b88a12"/><circle cx="0" cy="-7" r="2" fill="none" stroke="#d9a923" stroke-width="1.2"/></g>`,
    acc_bandana: () => `<path d="M14 34 Q50 46 86 34 L50 84Z" fill="#7fb6ea" stroke="#5b95cd" stroke-width="2.5" stroke-linejoin="round"/>${[[36, 44], [50, 52], [64, 44], [50, 66], [42, 58], [58, 58]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.5" fill="#fff"/>`).join('')}`,
    acc_hat: () => `<ellipse cx="50" cy="62" rx="42" ry="12" fill="#f3d48a" stroke="#d8b25c" stroke-width="2.5"/><path d="M26 62 C26 22 74 22 74 62Z" fill="#f6dc96" stroke="#d8b25c" stroke-width="2.5"/><rect x="26" y="50" width="48" height="9" fill="#f58aa5"/>`
  };
  const bouquetArt = (cols) => `<path d="M30 52 L50 94 L70 52Z" fill="#fbe7c4" stroke="#e1c48f" stroke-width="2.5" stroke-linejoin="round"/><path d="M40 72 L60 72" stroke="#f58aa5" stroke-width="5" stroke-linecap="round"/>
    ${[[34, 38], [50, 28], [66, 38], [42, 50], [58, 50]].map(([x, y], i) => `<g transform="translate(${x} ${y})">${petals(6, 0, 0, 4.5, 7, 7, cols[i % cols.length])}<circle r="4" fill="#ffd34d"/></g>`).join('')}`;
  const BOUQ = { bouquet_classic: ['#fff', '#fff'], bouquet_mix: ['#ffcd3c', '#fff', '#f2577a'], bouquet_rainbow: ['#f2577a', '#ffcd3c', '#a07ad8', '#fff'], bouquet_comp: ['#a07ad8', '#ffcd3c'] };
  const TOOL_ART = {
    big_can: () => `<path d="M26 44 L66 44 L62 86 L30 86Z" fill="#8fc4ea" stroke="#5b95cd" stroke-width="2.5"/><path d="M28 56 L64 56 M29 66 L63 66 M30 76 L62 76" stroke="#f58aa5" stroke-width="4" opacity=".7"/><path d="M66 54 L88 36" stroke="#5b95cd" stroke-width="6" stroke-linecap="round"/><path d="M34 44 Q46 26 58 44" stroke="#5b95cd" stroke-width="4" fill="none"/><circle cx="90" cy="34" r="5" fill="#5b95cd"/>`,
    gloves: () => `<path d="M30 86 L30 50 Q30 40 36 40 L36 28 Q36 22 42 22 Q48 22 48 28 L48 24 Q48 18 54 18 Q60 18 60 24 L60 30 Q60 26 66 26 Q72 28 70 40 L70 86Z" fill="#f6b0a6" stroke="#d98a7e" stroke-width="2.5"/><rect x="28" y="76" width="44" height="12" rx="3" fill="#9fcf9a"/>`,
    satchel: () => `<path d="M22 44 Q50 36 78 44 L74 86 Q50 92 26 86Z" fill="#c99260" stroke="#8d6040" stroke-width="2.5"/><path d="M30 44 Q50 10 70 44" stroke="#8d6040" stroke-width="4" fill="none"/><path d="M22 44 Q50 60 78 44 L74 56 Q50 70 26 56Z" fill="#b8804e" stroke="#8d6040" stroke-width="2"/><circle cx="50" cy="60" r="5" fill="#ffd34d"/>`,
    rain_barrel: () => `<rect x="24" y="26" width="52" height="64" rx="10" fill="#9b6a42" stroke="#6e4a2c" stroke-width="2.5"/><path d="M24 40 L76 40 M24 76 L76 76" stroke="#6e4a2c" stroke-width="4"/><ellipse cx="50" cy="28" rx="26" ry="6" fill="#8fc4ea" stroke="#5b95cd" stroke-width="2"/><path d="M50 4 Q44 14 50 18 Q56 14 50 4Z" fill="#8fc4ea"/>`,
    plot: () => `<rect x="14" y="40" width="72" height="46" rx="10" fill="#9b6a42" stroke="#7a5233" stroke-width="2.5"/><path d="M24 54 L76 54 M24 70 L76 70" stroke="#7a5233" stroke-width="3" stroke-dasharray="6 6"/><path d="M50 40 L50 24" stroke="#5aa94b" stroke-width="4" stroke-linecap="round"/>${leaf(50, 28, -150, 1)}${leaf(50, 28, -30, 1, '#7fc76a')}<circle cx="80" cy="30" r="12" fill="#ffd34d"/><path d="M80 24 L80 36 M74 30 L86 30" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/>`,
    tree_spot: () => `<ellipse cx="50" cy="80" rx="32" ry="9" fill="#8d6040" opacity=".4"/>${sapling('apple').replace(/<g transform="translate\(54 16\)[\s\S]*<\/g>$/, '')}<circle cx="80" cy="30" r="12" fill="#ffd34d"/><path d="M80 24 L80 36 M74 30 L86 30" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/>`,
    room_big: () => `<path d="M14 50 L50 22 L86 50 L86 88 L14 88Z" fill="#fbf0dc" stroke="#c99260" stroke-width="3"/><rect x="40" y="62" width="20" height="26" rx="2" fill="#c99260"/><path d="M6 70 L16 62 L16 78Z M94 70 L84 62 L84 78Z" fill="#f58aa5"/>`,
    yard_big: () => `<rect x="10" y="46" width="80" height="42" rx="6" fill="#b9dc95"/>${[18, 32, 46, 60, 74].map(x => `<path d="M${x} 58 L${x} 40 L${x + 4} 34 L${x + 8} 40 L${x + 8} 58Z" fill="#fff" stroke="#d9cfc0" stroke-width="1.5"/>`).join('')}<path d="M4 70 L14 62 L14 78Z M96 70 L86 62 L86 78Z" fill="#f58aa5"/>`
  };

  /* ====================== FURNITURE ====================== */
  const F1 = (inner) => svg('0 0 100 100', inner, 'furn-svg');
  const F2 = (inner) => svg('0 0 200 100', inner, 'furn-svg');
  const FURN_ART = {
    bed_quilt: () => F2(`<rect x="10" y="20" width="26" height="70" rx="6" fill="#b9814f" stroke="#8d6040" stroke-width="2.5"/><rect x="164" y="40" width="26" height="50" rx="6" fill="#b9814f" stroke="#8d6040" stroke-width="2.5"/><rect x="30" y="46" width="140" height="34" rx="8" fill="#fff6e8" stroke="#d9c39a" stroke-width="2"/><rect x="38" y="36" width="34" height="18" rx="8" fill="#fff" stroke="#e1d8c8" stroke-width="2"/>${[0, 1, 2, 3].map(i => `<rect x="${80 + i * 22}" y="44" width="22" height="20" fill="${['#f6b0a6', '#9fcf9a', '#f6d36b', '#b5a4e8'][i]}"/><rect x="${80 + i * 22}" y="64" width="22" height="18" fill="${['#9fcf9a', '#f6d36b', '#b5a4e8', '#f6b0a6'][i]}"/>`).join('')}<rect x="80" y="44" width="88" height="38" fill="none" stroke="#fff" stroke-width="1.5" stroke-dasharray="3 3"/>`),
    rug_round: () => F1(`<ellipse cx="50" cy="60" rx="44" ry="28" fill="#f6b0a6"/><ellipse cx="50" cy="60" rx="34" ry="21" fill="#fbe2a8"/><ellipse cx="50" cy="60" rx="23" ry="14" fill="#9fcf9a"/><ellipse cx="50" cy="60" rx="12" ry="7" fill="#fff6e8"/>`),
    lamp_cottage: () => F1(`<rect x="44" y="50" width="12" height="36" rx="4" fill="#fff6e8" stroke="#d9c39a" stroke-width="2"/><ellipse cx="50" cy="88" rx="18" ry="5" fill="#b9814f"/><path d="M20 52 C20 22 80 22 80 52Z" fill="#ef6b6b" stroke="#cf4d4d" stroke-width="2"/><circle cx="36" cy="40" r="4" fill="#fff"/><circle cx="56" cy="34" r="5" fill="#fff"/><circle cx="68" cy="44" r="3.5" fill="#fff"/><ellipse cx="50" cy="56" rx="22" ry="5" fill="#fff3b0" opacity=".7" class="glow"/>`),
    table_wood: () => F1(`<ellipse cx="50" cy="44" rx="40" ry="14" fill="#c99260" stroke="#8d6040" stroke-width="2.5"/><path d="M22 50 L20 90 M78 50 L80 90 M50 58 L50 92" stroke="#8d6040" stroke-width="6" stroke-linecap="round"/><rect x="40" y="24" width="12" height="16" rx="3" fill="#8fc4ea"/><g transform="translate(38 6) scale(0.18)">${PRODUCE.daisy()}</g>`),
    window_lace: () => F1(`<rect x="16" y="12" width="68" height="70" rx="6" fill="#d5e9f7" stroke="#b9814f" stroke-width="5"/><path d="M50 12 L50 82 M16 46 L84 46" stroke="#b9814f" stroke-width="4"/><path d="M18 14 Q30 50 18 80 L30 80 Q36 46 40 14Z M82 14 Q70 50 82 80 L70 80 Q64 46 60 14Z" fill="#fff" opacity=".9"/><circle cx="64" cy="28" r="6" fill="#fff8c4"/><rect x="12" y="82" width="76" height="8" rx="3" fill="#c99260"/>`),
    shelf_jars: () => F1(`<rect x="10" y="62" width="80" height="8" rx="3" fill="#b9814f"/><path d="M20 70 L24 80 M80 70 L76 80" stroke="#8d6040" stroke-width="4"/><rect x="16" y="36" width="20" height="26" rx="5" fill="#f6b0a6" opacity=".9" stroke="#d98a7e" stroke-width="2"/><rect x="40" y="30" width="22" height="32" rx="5" fill="#fbe2a8" stroke="#d8b878" stroke-width="2"/><rect x="66" y="40" width="18" height="22" rx="5" fill="#b8dfb0" stroke="#86b97c" stroke-width="2"/><rect x="16" y="32" width="20" height="6" rx="2" fill="#f58aa5"/><rect x="40" y="26" width="22" height="6" rx="2" fill="#9fcf9a"/><rect x="66" y="36" width="18" height="6" rx="2" fill="#f6d36b"/>`),
    plant_pot: () => F1(`<path d="M30 60 L70 60 L64 92 L36 92Z" fill="#e09b67" stroke="#b56f40" stroke-width="2.5"/>${leaf(50, 60, -100, 2.2)}${leaf(50, 60, -60, 2, '#7fc76a')}${leaf(50, 60, -140, 2, '#5aa94b')}${leaf(50, 62, -30, 1.6)}${leaf(50, 62, -170, 1.6, '#7fc76a')}`),
    painting_flower: () => F1(`<rect x="12" y="16" width="76" height="62" rx="4" fill="#fff6e8" stroke="#d8b25c" stroke-width="6"/><rect x="20" y="24" width="60" height="46" fill="#d5e9f7"/><path d="M20 70 Q40 52 60 62 T80 56 L80 70Z" fill="#9fcf9a"/><g transform="translate(26 30) scale(0.24)">${PRODUCE.tulip()}</g><g transform="translate(48 36) scale(0.22)">${PRODUCE.daisy()}</g><g transform="translate(60 26) scale(0.2)">${PRODUCE.sunflower()}</g>`),
    pot_tulip: () => F1(`<path d="M32 64 L68 64 L62 92 L38 92Z" fill="#f6b8c8" stroke="#e08aa3" stroke-width="2.5"/><g transform="translate(14 6) scale(0.42)">${PRODUCE.tulip()}</g><g transform="translate(44 2) scale(0.42)">${PRODUCE.tulip().replace(/#f2577a/g, '#ffcd3c').replace(/#d63d61/g, '#e8a51c').replace(/#ff9db3/g, '#ffe792')}</g>`),
    flowerbox: () => F1(`<rect x="14" y="56" width="72" height="22" rx="4" fill="#b9814f" stroke="#8d6040" stroke-width="2.5"/>${[22, 38, 54, 70].map((x, i) => `<g transform="translate(${x - 9} ${32 - (i % 2) * 6}) scale(0.24)">${(i % 2 ? PRODUCE.daisy : PRODUCE.tulip)()}</g>`).join('')}<path d="M14 66 L86 66" stroke="#8d6040" stroke-width="2"/>`),
    rose_arch: () => F1(`<path d="M18 94 L18 40 Q18 8 50 8 Q82 8 82 40 L82 94" stroke="#fff" stroke-width="8" fill="none"/><path d="M18 94 L18 40 Q18 8 50 8 Q82 8 82 40 L82 94" stroke="#d9cfc0" stroke-width="2" fill="none" stroke-dasharray="1 9"/>${[[18, 60], [18, 38], [26, 18], [44, 10], [62, 12], [76, 22], [82, 44], [82, 66], [18, 80], [82, 84]].map(([x, y], i) => `${leaf(x, y, i * 40, 0.6)}<circle cx="${x}" cy="${y}" r="5" fill="${i % 2 ? '#f58aa5' : '#ef5a6a'}"/>`).join('')}`),
    bench_flower: () => F2(`<rect x="20" y="30" width="160" height="12" rx="4" fill="#fff" stroke="#d9cfc0" stroke-width="2"/><rect x="20" y="48" width="160" height="12" rx="4" fill="#fff" stroke="#d9cfc0" stroke-width="2"/><rect x="14" y="62" width="172" height="12" rx="4" fill="#f6b8c8" stroke="#e08aa3" stroke-width="2"/><path d="M30 74 L28 94 M170 74 L172 94 M30 30 L30 74 M170 30 L170 74" stroke="#b9a99a" stroke-width="6" stroke-linecap="round"/>${[60, 100, 140].map(x => `<g transform="translate(${x - 8} 16) scale(0.18)">${PRODUCE.daisy()}</g>`).join('')}`),
    bed_cloud: () => F2(`${[[40, 50, 26], [72, 40, 30], [110, 40, 30], [146, 48, 28], [170, 60, 20], [28, 64, 18]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="#e1d8f2" stroke-width="2"/>`).join('')}<rect x="20" y="54" width="164" height="30" rx="14" fill="#cdb9ef" stroke="#a991d9" stroke-width="2"/><rect x="32" y="46" width="36" height="18" rx="9" fill="#fff" stroke="#e1d8f2" stroke-width="2"/>${[[90, 66], [120, 72], [150, 64]].map(([x, y]) => `<path d="M${x} ${y - 5} L${x + 1.5} ${y} L${x} ${y + 5} L${x - 1.5} ${y}Z M${x - 5} ${y} L${x + 5} ${y}" stroke="#fff" stroke-width="2"/>`).join('')}<rect x="24" y="84" width="10" height="10" rx="3" fill="#a991d9"/><rect x="170" y="84" width="10" height="10" rx="3" fill="#a991d9"/>`),
    beanbag: () => F1(`<path d="M14 84 C10 50 30 28 50 28 C72 28 92 50 86 84 Q50 96 14 84Z" fill="#f6a8c4" stroke="#e080a5" stroke-width="2.5"/><path d="M30 60 Q50 50 70 60" stroke="#e080a5" stroke-width="2.5" fill="none"/><ellipse cx="38" cy="44" rx="8" ry="5" fill="#fff" opacity=".4"/>`),
    lamp_star: () => F1(`<rect x="46" y="54" width="8" height="32" rx="3" fill="#cdb9ef"/><ellipse cx="50" cy="88" rx="16" ry="5" fill="#a991d9"/><path d="M50 10 L59 32 L82 34 L64 48 L70 70 L50 58 L30 70 L36 48 L18 34 L41 32Z" fill="#ffe27a" stroke="#f0c43a" stroke-width="2.5" stroke-linejoin="round" class="glow"/>`),
    mirror_heart: () => F1(`<path d="M50 88 C20 66 8 50 14 32 C20 16 40 14 50 30 C60 14 80 16 86 32 C92 50 80 66 50 88Z" fill="#f6b8c8" stroke="#e08aa3" stroke-width="3"/><path d="M50 76 C28 60 20 48 24 36 C28 26 42 26 50 38 C58 26 72 26 76 36 C80 48 72 60 50 76Z" fill="#e3f1fb"/><path d="M34 40 L44 50" stroke="#fff" stroke-width="4" stroke-linecap="round"/>`),
    rug_rainbow: () => F2(`<rect x="10" y="30" width="180" height="56" rx="28" fill="#f6b0a6"/><rect x="22" y="38" width="156" height="40" rx="20" fill="#fbe2a8"/><rect x="34" y="46" width="132" height="24" rx="12" fill="#b8dfb0"/><rect x="46" y="52" width="108" height="12" rx="6" fill="#cdb9ef"/>`),
    bookshelf: () => F1(`<rect x="18" y="6" width="64" height="88" rx="4" fill="#b9814f" stroke="#8d6040" stroke-width="2.5"/>${[30, 56, 82].map(y => `<rect x="22" y="${y - 2}" width="56" height="4" fill="#8d6040"/>`).join('')}${[[24, 12, '#f6b0a6'], [32, 14, '#8fc4ea'], [40, 10, '#9fcf9a'], [50, 12, '#f6d36b'], [60, 15, '#b5a4e8'], [24, 38, '#9fcf9a'], [34, 36, '#ef6b6b'], [44, 40, '#8fc4ea'], [56, 36, '#f6b0a6'], [66, 38, '#fbe2a8'], [26, 64, '#b5a4e8'], [36, 62, '#f6d36b'], [48, 64, '#9fcf9a']].map(([x, y, c]) => `<rect x="${x}" y="${y}" width="${c === '#f6d36b' ? 9 : 7}" height="${(y < 30 ? 28 : y < 56 ? 54 : 80) - y}" rx="1.5" fill="${c}"/>`).join('')}`),
    armchair: () => F1(`<rect x="22" y="18" width="56" height="50" rx="16" fill="#e9a67a" stroke="#c97e52" stroke-width="2.5"/><rect x="12" y="44" width="20" height="40" rx="9" fill="#e9a67a" stroke="#c97e52" stroke-width="2.5"/><rect x="68" y="44" width="20" height="40" rx="9" fill="#e9a67a" stroke="#c97e52" stroke-width="2.5"/><rect x="28" y="54" width="44" height="26" rx="8" fill="#f2bc95"/><path d="M22 86 L22 94 M78 86 L78 94" stroke="#8d6040" stroke-width="5" stroke-linecap="round"/><rect x="36" y="30" width="28" height="16" rx="6" fill="#fbe2a8"/>`),
    desk: () => F2(`<rect x="14" y="40" width="172" height="12" rx="4" fill="#b9814f" stroke="#8d6040" stroke-width="2.5"/><rect x="128" y="52" width="50" height="40" rx="3" fill="#c99260" stroke="#8d6040" stroke-width="2"/><path d="M134 66 L172 66 M134 80 L172 80" stroke="#8d6040" stroke-width="2"/><circle cx="153" cy="60" r="2" fill="#ffd34d"/><circle cx="153" cy="74" r="2" fill="#ffd34d"/><path d="M24 52 L24 92" stroke="#8d6040" stroke-width="6" stroke-linecap="round"/><rect x="40" y="14" width="34" height="26" rx="2" fill="#fff6e8" stroke="#d9c39a" stroke-width="2"/><path d="M46 22 L68 22 M46 28 L64 28 M46 34 L66 34" stroke="#c9b48a" stroke-width="2"/><path d="M96 40 L104 10" stroke="#f58aa5" stroke-width="4" stroke-linecap="round"/><rect x="108" y="22" width="12" height="18" rx="3" fill="#8fc4ea"/>`),
    clock: () => F1(`<circle cx="50" cy="52" r="34" fill="#c99260" stroke="#8d6040" stroke-width="3"/><circle cx="50" cy="56" r="22" fill="#fff6e8"/><path d="M26 26 L32 10 L40 22Z M74 26 L68 10 L60 22Z" fill="#c99260" stroke="#8d6040" stroke-width="2"/><circle cx="38" cy="34" r="7" fill="#fff"/><circle cx="62" cy="34" r="7" fill="#fff"/><circle cx="38" cy="34" r="3.5" fill="#3a2a2e"/><circle cx="62" cy="34" r="3.5" fill="#3a2a2e"/><path d="M50 56 L50 42 M50 56 L60 60" stroke="#3a2a2e" stroke-width="3" stroke-linecap="round"/><path d="M46 42 L50 46 L54 42" fill="#f6b33c"/>`),
    books_pile: () => F1(`<rect x="18" y="72" width="64" height="14" rx="3" fill="#8fc4ea" stroke="#5b95cd" stroke-width="2"/><rect x="24" y="58" width="54" height="14" rx="3" fill="#f6b0a6" stroke="#d98a7e" stroke-width="2"/><rect x="20" y="44" width="58" height="14" rx="3" fill="#9fcf9a" stroke="#6fae69" stroke-width="2"/><rect x="28" y="30" width="46" height="14" rx="3" fill="#f6d36b" stroke="#d8b25c" stroke-width="2"/><path d="M60 30 L64 18 L70 30" fill="#f58aa5"/>`),
    telescope: () => F1(`<path d="M50 56 L32 92 M50 56 L68 92 M50 56 L50 92" stroke="#8d6040" stroke-width="5" stroke-linecap="round"/><rect x="16" y="32" width="70" height="18" rx="8" fill="#5b6fc9" stroke="#3f4f9a" stroke-width="2.5" transform="rotate(-24 50 41)"/><rect x="74" y="16" width="14" height="24" rx="4" fill="#ffd34d" transform="rotate(-24 81 28)"/>${[[20, 14], [36, 8], [12, 30]].map(([x, y]) => `<path d="M${x} ${y - 4} L${x + 1} ${y} L${x} ${y + 4} L${x - 1} ${y}Z M${x - 4} ${y} L${x + 4} ${y}" stroke="#f0c43a" stroke-width="1.5"/>`).join('')}`),
    monstera: () => F1(`<path d="M34 68 L66 68 L62 94 L38 94Z" fill="#f6ead2" stroke="#d9c39a" stroke-width="2.5"/>${[[-120, 2.4], [-70, 2.5], [-160, 2], [-30, 2], [-95, 2.6]].map(([r, s], i) => leaf(50, 68, r, s, i % 2 ? '#4fa45a' : '#3f9150')).join('')}<path d="M30 38 L38 44 M64 30 L60 40 M70 52 L62 54" stroke="#cfe8bf" stroke-width="2.5" stroke-linecap="round"/>`),
    map_poster: () => F1(`<rect x="10" y="16" width="80" height="62" rx="3" fill="#cfe6f7" stroke="#8d6040" stroke-width="4"/><path d="M18 34 Q24 26 34 30 Q38 40 30 46 Q22 48 18 34Z M44 28 Q56 22 62 30 Q60 40 52 42 Q46 50 50 60 Q42 62 40 52 Q42 40 44 28Z M66 44 Q78 38 84 46 Q80 58 70 56Z" fill="#9fcf9a"/><path d="M28 60 L34 54 L40 62" stroke="#ef6b6b" stroke-width="2.5" fill="none" stroke-dasharray="3 3"/><circle cx="40" cy="62" r="3" fill="#ef6b6b"/>`),
    terrarium: () => F1(`<path d="M24 46 Q24 22 50 18 Q76 22 76 46 L76 80 Q76 90 66 90 L34 90 Q24 90 24 80Z" fill="#e3f4f0" stroke="#9cc9bd" stroke-width="2.5" opacity=".95"/><rect x="26" y="72" width="48" height="16" rx="4" fill="#9b6a42"/><path d="M50 72 L50 50" stroke="#5aa94b" stroke-width="3"/>${leaf(50, 56, -150, 1)}${leaf(50, 56, -30, 1, '#7fc76a')}<path d="M36 72 Q34 62 38 58 Q42 62 40 72Z" fill="#ef6b6b"/><circle cx="64" cy="70" r="5" fill="#b9b2c4"/><path d="M34 32 L40 26" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`),
    bird_feeder: () => F1(`<path d="M50 92 L50 50" stroke="#8d6040" stroke-width="5"/><path d="M22 42 L50 20 L78 42Z" fill="#ef6b6b" stroke="#cf4d4d" stroke-width="2"/><rect x="28" y="42" width="44" height="22" fill="#fbe2a8" stroke="#d8b878" stroke-width="2"/><rect x="24" y="62" width="52" height="5" rx="2" fill="#b9814f"/><circle cx="36" cy="56" r="2" fill="#c99260"/><circle cx="46" cy="58" r="2" fill="#c99260"/><circle cx="60" cy="56" r="2" fill="#c99260"/><g transform="translate(66 50)"><ellipse rx="9" ry="7" fill="#8fc4ea"/><circle cx="-6" cy="-5" r="5" fill="#8fc4ea"/><circle cx="-7" cy="-6" r="1.2" fill="#2f2630"/><path d="M-11 -5 L-14 -4 L-11 -3Z" fill="#f6b33c"/></g>`),
    fairy_lights: () => F1(`<path d="M6 30 Q28 50 50 30 Q72 50 94 30" stroke="#6b8a5a" stroke-width="2" fill="none"/>${[[14, 37, '#ffe27a'], [28, 44, '#f6a8c4'], [42, 38, '#a9d8e8'], [58, 38, '#ffe27a'], [72, 44, '#cdb9ef'], [86, 37, '#f6a8c4']].map(([x, y, c]) => `<circle cx="${x}" cy="${y + 5}" r="6" fill="${c}" class="glow"/><rect x="${x - 2}" y="${y - 2}" width="4" height="4" fill="#6b8a5a"/>`).join('')}`),
    mushroom_stool: () => F1(`<path d="M38 52 L36 88 L64 88 L62 52Z" fill="#fff6e8" stroke="#d9c39a" stroke-width="2.5"/><path d="M12 54 C12 22 88 22 88 54 Q50 62 12 54Z" fill="#ef6b6b" stroke="#cf4d4d" stroke-width="2.5"/><circle cx="34" cy="38" r="6" fill="#fff"/><circle cx="56" cy="30" r="7" fill="#fff"/><circle cx="72" cy="44" r="5" fill="#fff"/>`),
    fairy_house: () => F1(`<path d="M28 92 L28 54 L72 54 L72 92Z" fill="#fff6e8" stroke="#d9c39a" stroke-width="2.5"/><path d="M18 58 C18 20 82 20 82 58 Q50 64 18 58Z" fill="#b48fe0" stroke="#8f6cc4" stroke-width="2.5"/><circle cx="36" cy="40" r="5" fill="#fff"/><circle cx="60" cy="34" r="6" fill="#fff"/><path d="M42 92 L42 74 Q50 64 58 74 L58 92Z" fill="#c99260" stroke="#8d6040" stroke-width="2"/><circle cx="55" cy="82" r="1.8" fill="#ffd34d"/><circle cx="64" cy="66" r="5" fill="#fff3b0" stroke="#d8b25c" stroke-width="2" class="glow"/>`),
    glow_lantern: () => F1(`<path d="M50 6 L50 18" stroke="#6b5a6b" stroke-width="3"/><path d="M36 20 L64 20 L60 26 L40 26Z" fill="#6b5a6b"/><rect x="34" y="26" width="32" height="44" rx="8" fill="#fff3b0" stroke="#b39a5a" stroke-width="2.5" class="glow"/><path d="M50 40 Q44 50 50 58 Q56 50 50 40Z" fill="#ffb84d"/><path d="M36 70 L64 70 L60 78 L40 78Z" fill="#6b5a6b"/><path d="M50 78 L50 94" stroke="#6b5a6b" stroke-width="4"/>`),
    fence: () => F1(`<rect x="6" y="46" width="88" height="8" rx="2" fill="#fff" stroke="#d9cfc0" stroke-width="1.5"/><rect x="6" y="68" width="88" height="8" rx="2" fill="#fff" stroke="#d9cfc0" stroke-width="1.5"/>${[14, 38, 62, 86].map(x => `<path d="M${x - 7} 92 L${x - 7} 30 L${x} 20 L${x + 7} 30 L${x + 7} 92Z" fill="#fff" stroke="#d9cfc0" stroke-width="2"/>`).join('')}`),
    path_stone: () => F1(`<ellipse cx="34" cy="34" rx="20" ry="13" fill="#d8d0c4" stroke="#b9ae9e" stroke-width="2"/><ellipse cx="66" cy="62" rx="22" ry="14" fill="#e3dccf" stroke="#b9ae9e" stroke-width="2"/><ellipse cx="30" cy="80" rx="16" ry="10" fill="#d8d0c4" stroke="#b9ae9e" stroke-width="2"/><path d="M16 50 L20 46 M80 32 L84 28 M54 88 L58 84" stroke="#7fc76a" stroke-width="3" stroke-linecap="round"/>`),
    garden_light: () => F1(`<rect x="46" y="44" width="8" height="46" fill="#6b5a6b"/><ellipse cx="50" cy="90" rx="14" ry="4" fill="#6b5a6b"/><path d="M34 28 L66 28 L60 46 L40 46Z" fill="#fff3b0" stroke="#6b5a6b" stroke-width="3" class="glow"/><path d="M30 28 L50 14 L70 28Z" fill="#6b5a6b"/>`),
    flower_pot: () => F1(`<path d="M30 58 L70 58 L64 92 L36 92Z" fill="#e09b67" stroke="#b56f40" stroke-width="2.5"/><rect x="26" y="52" width="48" height="9" rx="3" fill="#e9a879" stroke="#b56f40" stroke-width="2"/>${[[34, 32], [50, 22], [66, 32]].map(([x, y], i) => `<path d="M${x} 54 L${x} ${y}" stroke="#5aa94b" stroke-width="3"/><g transform="translate(${x} ${y})">${petals(5, 0, 0, 4, 6, 6, ['#f58aa5', '#ffcd3c', '#cdb9ef'][i])}<circle r="3.5" fill="#fff6c4"/></g>`).join('')}`),
    bird_bath: () => F1(`<path d="M42 92 L44 52 L56 52 L58 92Z" fill="#e3dccf" stroke="#b9ae9e" stroke-width="2"/><ellipse cx="50" cy="92" rx="18" ry="5" fill="#d8d0c4"/><path d="M14 44 Q50 70 86 44Z" fill="#e3dccf" stroke="#b9ae9e" stroke-width="2"/><ellipse cx="50" cy="44" rx="36" ry="7" fill="#9fd2ee" stroke="#b9ae9e" stroke-width="2"/><g transform="translate(68 34)"><ellipse rx="8" ry="6" fill="#f6a8a0"/><circle cx="-6" cy="-4" r="4.5" fill="#f6a8a0"/><circle cx="-7" cy="-5" r="1.1" fill="#2f2630"/><path d="M-11 -4 L-14 -3 L-11 -2Z" fill="#f6b33c"/></g>`),
    mailbox: () => F1(`<rect x="46" y="54" width="8" height="40" fill="#b9814f"/><path d="M22 30 Q22 18 36 18 L66 18 Q80 18 80 30 L80 56 L22 56Z" fill="#8fc4ea" stroke="#5b95cd" stroke-width="2.5"/><path d="M80 28 L90 28 L90 40 L80 40" fill="#ef6b6b" stroke="#cf4d4d" stroke-width="2"/><rect x="34" y="34" width="24" height="12" rx="2" fill="#fff" opacity=".8"/><path d="M34 34 L46 42 L58 34" stroke="#f58aa5" stroke-width="2" fill="none"/>`),
    knit_blanket: () => F1(`<rect x="14" y="26" width="72" height="56" rx="6" fill="#f6a8c4" stroke="#e080a5" stroke-width="2.5"/>${[36, 48, 60, 72].map(y => `<path d="M16 ${y} Q24 ${y - 5} 32 ${y} T48 ${y} T64 ${y} T84 ${y}" stroke="#fff" stroke-width="2" fill="none" opacity=".7"/>`).join('')}${[18, 30, 42, 54, 66, 78].map(x => `<path d="M${x} 82 L${x} 92" stroke="#e080a5" stroke-width="3" stroke-linecap="round"/>`).join('')}`),
    fluffy_pillow: () => F1(`<path d="M14 40 Q50 24 86 40 Q92 60 86 80 Q50 94 14 80 Q8 60 14 40Z" fill="#f0dcc4" stroke="#d9bc9f" stroke-width="2.5"/>${[[30, 50], [52, 46], [70, 56], [40, 68], [62, 72]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="#fffaf2" opacity=".7"/>`).join('')}`),
    wood_stool: () => F1(`<ellipse cx="50" cy="40" rx="30" ry="10" fill="#c99260" stroke="#8d6040" stroke-width="2.5"/><path d="M30 46 L24 92 M70 46 L76 92 M50 50 L50 92" stroke="#8d6040" stroke-width="6" stroke-linecap="round"/><path d="M28 72 L72 72" stroke="#8d6040" stroke-width="4"/><path d="M36 38 Q50 34 64 38" stroke="#e3b989" stroke-width="2" fill="none"/>`),
    birdhouse: () => F1(`<path d="M50 94 L50 70" stroke="#8d6040" stroke-width="6"/><rect x="28" y="36" width="44" height="36" rx="3" fill="#c99260" stroke="#8d6040" stroke-width="2.5"/><path d="M20 40 L50 12 L80 40Z" fill="#9fcf9a" stroke="#6fae69" stroke-width="2.5" stroke-linejoin="round"/><circle cx="50" cy="50" r="7" fill="#5a3a22"/><rect x="46" y="60" width="8" height="3" rx="1.5" fill="#8d6040"/>`),
    bee_hotel: () => F1(`<path d="M50 94 L50 76" stroke="#8d6040" stroke-width="6"/><path d="M16 40 L50 12 L84 40Z" fill="#c99260" stroke="#8d6040" stroke-width="2.5" stroke-linejoin="round"/><rect x="22" y="40" width="56" height="38" fill="#e3b989" stroke="#8d6040" stroke-width="2.5"/>${[[30, 48], [42, 48], [54, 48], [66, 48], [36, 60], [48, 60], [60, 60], [30, 70], [42, 70], [54, 70], [66, 70]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4.5" fill="#6e4a2c"/>`).join('')}<g transform="translate(76 22)"><ellipse rx="6" ry="4.5" fill="#ffcd3c"/><path d="M-2 -4 L-2 4 M2 -4 L2 4" stroke="#3a2a2e" stroke-width="1.6"/><ellipse cx="-1" cy="-6" rx="4" ry="2.5" fill="#fff" opacity=".8"/></g>`),
    bottle_planter: () => F1(`<path d="M28 44 L72 44 L72 86 Q72 92 66 92 L34 92 Q28 92 28 86Z" fill="#a8dcc8" stroke="#6fb59b" stroke-width="2.5" opacity=".95"/><rect x="28" y="62" width="44" height="30" fill="#8d6040" opacity=".55"/>${leaf(50, 46, -110, 1.6)}${leaf(50, 46, -60, 1.5, '#7fc76a')}<g transform="translate(36 12) scale(0.28)">${PRODUCE.daisy()}</g><path d="M34 50 L34 84" stroke="#fff" stroke-width="3" opacity=".6"/>`),
    can_chime: () => F1(`<path d="M20 14 L80 14" stroke="#8d6040" stroke-width="5" stroke-linecap="round"/>${[[28, 46], [44, 56], [60, 44], [74, 52]].map(([x, y], i) => `<path d="M${x} 14 L${x} ${y - 14}" stroke="#9aa1b2" stroke-width="1.5"/><rect x="${x - 7}" y="${y - 14}" width="14" height="28" rx="2" fill="${['#f6b0a6', '#8fc4ea', '#f6d36b', '#b5a4e8'][i]}" stroke="#9aa1b2" stroke-width="1.5"/>`).join('')}<circle cx="50" cy="80" r="5" fill="#ffd34d"/><path d="M50 14 L50 75" stroke="#9aa1b2" stroke-width="1.5"/>`),
    pumpkin_lantern: () => F1(`<g transform="translate(0 6)">${PRODUCE.pumpkin()}</g><path d="M38 56 L44 50 L46 58Z M62 56 L56 50 L54 58Z" fill="#fff3b0" class="glow"/><path d="M40 70 Q50 78 60 70" stroke="#fff3b0" stroke-width="4" fill="none" class="glow"/>`)
  };
  A.furniture = (key) => (FURN_ART[key] ? FURN_ART[key]() : F1('<rect x="20" y="20" width="60" height="60" rx="10" fill="#ddd"/>'));

  /* ====================== ICON DISPATCHER ====================== */
  A.icon = (key, cls) => {
    if (!key) return '';
    if (DF.CROPS[key]) return A.produce(key, cls);
    if (key.endsWith('_seed')) { const c = key.slice(0, -5); if (DF.CROPS[c]) return svg('0 0 100 100', packet(c), cls); }
    if (key.endsWith('_sapling')) { const t = key.slice(0, -8); if (DF.TREES[t]) return svg('0 0 100 100', sapling(DF.TREES[t].fruit), cls); }
    if (PRODUCE[key]) return A.produce(key, cls);
    if (BOUQ[key]) return svg('0 0 100 100', bouquetArt(BOUQ[key]), cls);
    if (GOODS_ART[key]) return svg('0 0 100 100', GOODS_ART[key](), cls);
    if (TOOL_ART[key]) return svg('0 0 100 100', TOOL_ART[key](), cls);
    if (FURN_ART[key]) return FURN_ART[key]();
    return svg('0 0 100 100', '<circle cx="50" cy="50" r="30" fill="#e8dff2"/>', cls);
  };

  /* ====================== UI ICONS (nav etc.) ====================== */
  const UI = {
    farm: '<path d="M10 46 L50 14 L90 46" stroke="#c9574f" stroke-width="8" fill="none" stroke-linejoin="round" stroke-linecap="round"/><path d="M20 42 L20 86 L80 86 L80 42 L50 20Z" fill="#f6b0a6"/><rect x="40" y="58" width="20" height="28" rx="3" fill="#b9814f"/><rect x="26" y="50" width="12" height="12" rx="2" fill="#d5e9f7"/><rect x="62" y="50" width="12" height="12" rx="2" fill="#d5e9f7"/>',
    garden: '<rect x="10" y="62" width="80" height="26" rx="10" fill="#9b6a42"/><path d="M30 64 L30 40 M50 64 L50 30 M70 64 L70 40" stroke="#5aa94b" stroke-width="5" stroke-linecap="round"/><circle cx="30" cy="36" r="9" fill="#ffcd3c"/><circle cx="50" cy="24" r="10" fill="#f58aa5"/><circle cx="70" cy="36" r="9" fill="#cdb9ef"/>',
    animals: '<circle cx="50" cy="52" r="44" fill="#c6e6a8"/><circle cx="50" cy="56" r="26" fill="#fffaf3" stroke="#c9b8a6" stroke-width="4"/><circle cx="32" cy="40" r="10" fill="#fffaf3" stroke="#c9b8a6" stroke-width="3"/><circle cx="68" cy="40" r="10" fill="#fffaf3" stroke="#c9b8a6" stroke-width="3"/><ellipse cx="50" cy="60" rx="14" ry="13" fill="#f2d6c6"/><circle cx="45" cy="58" r="2.5" fill="#2f2630"/><circle cx="55" cy="58" r="2.5" fill="#2f2630"/><path d="M47 65 Q50 68 53 65" stroke="#2f2630" stroke-width="2" fill="none"/>',
    house: '<rect x="14" y="20" width="72" height="66" rx="8" fill="#e4d8f6"/><rect x="14" y="56" width="72" height="30" rx="4" fill="#d9a86c"/><rect x="24" y="44" width="34" height="20" rx="5" fill="#f6b0a6"/><rect x="24" y="38" width="12" height="10" rx="4" fill="#fff"/><rect x="66" y="30" width="12" height="14" rx="2" fill="#d5e9f7"/>',
    market: '<path d="M12 40 L20 16 L80 16 L88 40Z" fill="#f6b0a6"/><path d="M12 40 L88 40 L88 46 Q78 54 70 46 Q60 54 50 46 Q40 54 30 46 Q20 54 12 46Z" fill="#fff"/><path d="M26 16 L22 40 M42 16 L40 40 M58 16 L60 40 M74 16 L78 40" stroke="#fff" stroke-width="5"/><rect x="18" y="52" width="64" height="34" rx="4" fill="#d9a86c"/><circle cx="36" cy="66" r="7" fill="#ef5a4a"/><circle cx="52" cy="66" r="7" fill="#f2903a"/><circle cx="66" cy="66" r="7" fill="#9fcf9a"/>',
    craft: '<rect x="18" y="56" width="64" height="12" rx="4" fill="#b9814f"/><path d="M26 68 L22 90 M74 68 L78 90" stroke="#8d6040" stroke-width="6" stroke-linecap="round"/><path d="M36 54 L60 20" stroke="#8d6040" stroke-width="7" stroke-linecap="round"/><rect x="52" y="10" width="26" height="16" rx="4" fill="#9aa1b2" transform="rotate(35 65 18)"/><circle cx="74" cy="46" r="8" fill="#f6a8c4"/>',
    learn: '<path d="M50 90 L50 54" stroke="#8a5a36" stroke-width="10"/><circle cx="50" cy="38" r="30" fill="#80cc6c"/><rect x="34" y="40" width="32" height="24" rx="3" fill="#c99260" stroke="#8d6040" stroke-width="2.5"/><path d="M30 42 L50 26 L70 42Z" fill="#f6b0a6"/><rect x="45" y="50" width="10" height="14" rx="2" fill="#6e4a2c"/>',
    journal: '<rect x="18" y="12" width="62" height="78" rx="6" fill="#b5a4e8" stroke="#8f7ed0" stroke-width="3"/><rect x="26" y="12" width="6" height="78" fill="#8f7ed0"/><rect x="40" y="26" width="32" height="20" rx="4" fill="#fff6e8"/><path d="M56 30 L58 36 L64 36 L59 40 L61 46 L56 42 L51 46 L53 40 L48 36 L54 36Z" fill="#ffcd3c"/>',
    quests: '<rect x="14" y="16" width="72" height="64" rx="6" fill="#d9a86c" stroke="#b9814f" stroke-width="3"/><rect x="22" y="24" width="26" height="22" fill="#fff6e8" transform="rotate(-4 35 35)"/><rect x="54" y="28" width="24" height="18" fill="#fbe2a8" transform="rotate(5 66 37)"/><rect x="30" y="52" width="40" height="20" fill="#e4d8f6" transform="rotate(2 50 62)"/><circle cx="35" cy="26" r="3" fill="#ef5a4a"/><circle cx="66" cy="30" r="3" fill="#5b95cd"/><circle cx="50" cy="54" r="3" fill="#5aa94b"/><path d="M30 88 L30 80 M70 88 L70 80" stroke="#8d6040" stroke-width="5"/>',
    bag: '<path d="M30 30 Q30 12 50 12 Q70 12 70 30" stroke="#8d6040" stroke-width="6" fill="none"/><path d="M18 34 Q50 26 82 34 L78 86 Q50 94 22 86Z" fill="#c99260" stroke="#8d6040" stroke-width="3"/><path d="M18 34 Q50 52 82 34 L80 46 Q50 62 20 46Z" fill="#b8804e"/><circle cx="50" cy="52" r="6" fill="#ffd34d"/>',
    settings: '<circle cx="50" cy="50" r="18" fill="none" stroke="#8a7a96" stroke-width="10"/>' + [0, 45, 90, 135, 180, 225, 270, 315].map(a => `<rect x="44" y="12" width="12" height="16" rx="3" fill="#8a7a96" transform="rotate(${a} 50 50)"/>`).join(''),
    coin: '<circle cx="50" cy="50" r="38" fill="#ffd34d" stroke="#e8a91c" stroke-width="6"/><circle cx="50" cy="50" r="24" fill="none" stroke="#f3b929" stroke-width="4"/><path d="M50 34 L54 46 L66 46 L56 54 L60 66 L50 58 L40 66 L44 54 L34 46 L46 46Z" fill="#fff3b0"/>',
    star: '<path d="M50 8 L62 36 L92 38 L69 58 L77 88 L50 72 L23 88 L31 58 L8 38 L38 36Z" fill="#ffcd3c" stroke="#e8a91c" stroke-width="4" stroke-linejoin="round"/>',
    heart: '<path d="M50 86 C20 64 8 48 14 30 C20 14 40 12 50 28 C60 12 80 14 86 30 C92 48 80 64 50 86Z" fill="#f47fa5"/>',
    heartEmpty: '<path d="M50 86 C20 64 8 48 14 30 C20 14 40 12 50 28 C60 12 80 14 86 30 C92 48 80 64 50 86Z" fill="#f2e3ea" stroke="#e8c4d3" stroke-width="5"/>',
    water: '<path d="M50 10 Q22 50 26 66 Q30 90 50 90 Q70 90 74 66 Q78 50 50 10Z" fill="#8fc4ea" stroke="#5b95cd" stroke-width="4"/><path d="M38 60 Q38 74 48 78" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>',
    sun: '<circle cx="50" cy="50" r="20" fill="#ffd34d"/>' + [0, 45, 90, 135, 180, 225, 270, 315].map(a => `<rect x="47" y="8" width="6" height="16" rx="3" fill="#ffd34d" transform="rotate(${a} 50 50)"/>`).join(''),
    moon: '<path d="M62 14 C36 18 24 44 32 66 C40 86 66 92 84 78 C60 80 44 62 48 40 C50 28 56 20 62 14Z" fill="#fff3b0" stroke="#e8d27a" stroke-width="3"/>',
    sound: '<path d="M16 40 L32 40 L54 20 L54 80 L32 60 L16 60Z" fill="#8a7a96"/><path d="M64 36 Q74 50 64 64 M72 26 Q90 50 72 74" stroke="#8a7a96" stroke-width="6" fill="none" stroke-linecap="round"/>',
    mute: '<path d="M16 40 L32 40 L54 20 L54 80 L32 60 L16 60Z" fill="#b8adc2"/><path d="M66 38 L88 62 M88 38 L66 62" stroke="#b8adc2" stroke-width="7" stroke-linecap="round"/>',
    home: '<path d="M14 48 L50 18 L86 48" stroke="#8a7a96" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 46 L24 84 L42 84 L42 62 L58 62 L58 84 L76 84 L76 46" fill="#8a7a96"/>',
    pond: '<ellipse cx="50" cy="60" rx="42" ry="26" fill="#8fc4ea"/><ellipse cx="34" cy="56" rx="12" ry="5" fill="#7fc76a"/><circle cx="62" cy="62" r="7" fill="#f6a8a0"/><path d="M58 62 L52 58 L52 66Z" fill="#f6a8a0"/>',
    orchard: '<path d="M50 90 L50 56" stroke="#8a5a36" stroke-width="9"/><circle cx="50" cy="40" r="30" fill="#80cc6c"/><circle cx="38" cy="36" r="6" fill="#ec5050"/><circle cx="60" cy="30" r="6" fill="#ec5050"/><circle cx="56" cy="50" r="6" fill="#ec5050"/>',
    check: '<circle cx="50" cy="50" r="40" fill="#9fcf9a"/><path d="M30 52 L44 66 L72 36" stroke="#fff" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
  };
  A.ui = (name, cls) => svg('0 0 100 100', UI[name] || '', 'ui-icon ' + (cls || ''));

  /* ====================== BEE (mini-game) ====================== */
  A.bee = (pollen) => svg('0 0 100 80', `
    <ellipse cx="44" cy="20" rx="16" ry="11" fill="#e8f5fd" stroke="#a8cfee" stroke-width="2" class="wing" opacity=".9"/>
    <ellipse cx="62" cy="18" rx="14" ry="10" fill="#e8f5fd" stroke="#a8cfee" stroke-width="2" class="wing" opacity=".9"/>
    <ellipse cx="50" cy="46" rx="28" ry="22" fill="#ffcd3c" stroke="#e0a91c" stroke-width="2.5"/>
    <path d="M42 26 Q36 46 42 66 M58 26 Q64 46 58 66" stroke="#3a2a2e" stroke-width="7" fill="none"/>
    <path d="M78 46 L88 46" stroke="#3a2a2e" stroke-width="3" stroke-linecap="round"/>
    <circle cx="26" cy="44" r="15" fill="#ffd95c" stroke="#e0a91c" stroke-width="2.5"/>
    <circle cx="21" cy="42" r="3.2" fill="#3a2a2e"/><circle cx="22" cy="41" r="1.2" fill="#fff"/>
    <ellipse cx="18" cy="49" rx="3.5" ry="2" fill="#f7a1b0"/>
    <path d="M22 30 Q18 18 12 16 M30 30 Q32 18 38 14" stroke="#3a2a2e" stroke-width="2" fill="none"/><circle cx="12" cy="16" r="2.4" fill="#3a2a2e"/><circle cx="38" cy="14" r="2.4" fill="#3a2a2e"/>
    ${pollen ? `<g fill="${pollen}"><circle cx="44" cy="70" r="5"/><circle cx="58" cy="70" r="5"/><circle cx="51" cy="74" r="4"/></g>` : ''}`, 'bee-svg');
})();
