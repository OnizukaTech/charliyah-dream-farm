/* Charliyah's Dream Farm — game data & educational content
   Everything here is plain data: crops, animals, items, quests, facts…
   Game logic lives in state.js and the view files. */
(function () {
  'use strict';
  const DF = (window.DF = window.DF || {});

  DF.VERSION = 1;
  DF.DEFAULT_NAME = 'Charliyah';
  DF.PHASES = ['Morning', 'Afternoon', 'Evening', 'Night'];
  DF.SEASONS = ['Spring', 'Summer', 'Autumn', 'Winter'];
  DF.ACTIONS_PER_PHASE = 6;   // every 6 actions, time moves on a little
  DF.DAYS_PER_SEASON = 3;

  /* ---------------- CROPS ----------------
     water = how many waterings (each in a different part of the day) until ready */
  DF.CROPS = {
    carrot:     { name: 'Carrot',     kind: 'veg',    lvl: 1, seed: 2, sell: 5,  water: 2, xp: 4,  fact: 'p_carrot' },
    daisy:      { name: 'Daisy',      kind: 'flower', lvl: 1, seed: 2, sell: 5,  water: 2, xp: 4,  fact: 'p_daisy' },
    sunflower:  { name: 'Sunflower',  kind: 'flower', lvl: 1, seed: 4, sell: 9,  water: 3, xp: 6,  fact: 'p_sunflower' },
    strawberry: { name: 'Strawberry', kind: 'fruit',  lvl: 2, seed: 3, sell: 8,  water: 3, xp: 6,  fact: 'p_strawberry' },
    tomato:     { name: 'Tomato',     kind: 'veg',    lvl: 2, seed: 4, sell: 10, water: 3, xp: 7,  fact: 'p_tomato' },
    tulip:      { name: 'Tulip',      kind: 'flower', lvl: 3, seed: 5, sell: 12, water: 3, xp: 8,  fact: 'p_tulip' },
    pumpkin:    { name: 'Pumpkin',    kind: 'veg',    lvl: 3, seed: 8, sell: 22, water: 5, xp: 12, fact: 'p_pumpkin' },
    lavender:   { name: 'Lavender',   kind: 'flower', lvl: 4, seed: 6, sell: 14, water: 4, xp: 9,  fact: 'p_lavender' },
    blueberry:  { name: 'Blueberry',  kind: 'fruit',  lvl: 5, seed: 7, sell: 16, water: 4, xp: 10, fact: 'p_blueberry' }
  };
  DF.FLOWERS = ['daisy', 'sunflower', 'tulip', 'lavender'];

  /* ---------------- FRUIT TREES ---------------- */
  DF.TREES = {
    apple:  { name: 'Apple Tree',  fruit: 'apple',  fruitName: 'Apple',  lvl: 2, cost: 15, sell: 6, water: 3, regrow: 2, yield: 3, xp: 5, fact: 't_apple' },
    lemon:  { name: 'Lemon Tree',  fruit: 'lemon',  fruitName: 'Lemon',  lvl: 3, cost: 20, sell: 7, water: 3, regrow: 2, yield: 3, xp: 6, fact: 't_lemon' },
    cherry: { name: 'Cherry Tree', fruit: 'cherry', fruitName: 'Cherries', lvl: 4, cost: 25, sell: 8, water: 4, regrow: 2, yield: 3, xp: 7, fact: 't_cherry' },
    peach:  { name: 'Peach Tree',  fruit: 'peach',  fruitName: 'Peach',  lvl: 5, cost: 30, sell: 9, water: 4, regrow: 3, yield: 4, xp: 8, fact: 't_peach' }
  };

  /* ---------------- ANIMALS ---------------- */
  DF.ANIMALS = {
    lamb:    { name: 'Lamb',    defName: 'Biscuit',     lvl: 1, cost: 0,  food: 'fresh hay',  groom: 'Brush', product: 'wool',     treat: 'apple',     personality: 'Gentle and a little shy. Loves soft brushes.', facts: ['a_sheep', 'a_sheep_faces'],
               quiz: { q: 'What do sheep mostly eat?', a: ['Grass and hay', 'Chocolate', 'Fish'], c: 0, why: 'Sheep are grazers — grass and hay are their main food.' } },
    chicken: { name: 'Chicken', defName: 'Pepper',      lvl: 1, cost: 0,  food: 'grain mix',  groom: 'Pet',   product: 'egg',      treat: 'strawberry', personality: 'Curious and chatty. Always pecking at something!', facts: ['a_chicken', 'a_chicken_eggs'],
               quiz: { q: 'Why do chickens take dust baths?', a: ['To keep their feathers clean', 'Because they are bored', 'To get colder'], c: 0, why: 'Rolling in dust helps chickens clean their feathers and keep tiny pests away.' } },
    rabbit:  { name: 'Rabbit',  defName: 'Mochi',       lvl: 1, cost: 0,  food: 'fresh hay',  groom: 'Pet',   product: 'fluff',    treat: 'carrot',    personality: 'Bouncy and playful. Does happy jumps called binkies!', facts: ['a_rabbit', 'a_rabbit_social'],
               quiz: { q: 'What should make up most of a rabbit’s food?', a: ['Hay', 'Carrots', 'Cake'], c: 0, why: 'Hay! Carrots are sugary treats — only a little bit now and then.' } },
    duck:    { name: 'Duck',    defName: 'Puddle',      lvl: 2, cost: 30, food: 'grain & greens', groom: 'Pet', product: 'duck_egg', treat: 'tomato',  personality: 'Splashy and silly. Quacks a hello every morning.', facts: ['a_duck'],
               quiz: { q: 'How do ducks keep their feathers waterproof?', a: ['They spread oil from a special gland', 'They use an umbrella', 'They never get wet'], c: 0, why: 'Ducks preen with oil from a gland near their tail, so water rolls right off.' } },
    cow:     { name: 'Cow',     defName: 'Marshmallow', lvl: 3, cost: 60, food: 'fresh hay',  groom: 'Brush', product: 'milk',     treat: 'pumpkin',   personality: 'Calm and wise. Loves a good scratch behind the ears.', facts: ['a_cow'],
               quiz: { q: 'A cow’s stomach has how many compartments?', a: ['Four', 'One', 'Ten'], c: 0, why: 'Four compartments help cows digest tough grass, and they chew their cud for hours.' } },
    cat:     { name: 'Cat',     defName: 'Nutmeg',      lvl: 4, cost: 45, food: 'cat food',   groom: 'Pet',   product: null, xpGift: 12, treat: null,     personality: 'Independent and snuggly — on her own terms.', facts: ['a_cat'],
               quiz: { q: 'What is the best drink for a grown-up cat?', a: ['Fresh water', 'Cow’s milk', 'Lemonade'], c: 0, why: 'Many adult cats can’t digest cow’s milk well. Fresh water every day is best.' } },
    dog:     { name: 'Dog',     defName: 'Waffles',     lvl: 4, cost: 45, food: 'dog food',   groom: 'Walk',  product: 'seed_packet', treat: 'carrot', personality: 'Loyal and full of energy. Thinks every stick is treasure.', facts: ['a_dog'],
               quiz: { q: 'What does a dog need every day?', a: ['Walks, play and fresh water', 'Only sleep', 'A bath every hour'], c: 0, why: 'Daily exercise and play keep a dog’s body and mind happy.' } },
    pony:    { name: 'Pony',    defName: 'Stardust',    lvl: 5, cost: 90, food: 'fresh hay',  groom: 'Brush', product: 'horseshoe', treat: 'apple',    personality: 'Brave and gentle. Dreams of galloping through meadows.', facts: ['a_pony'],
               quiz: { q: 'Who trims a pony’s hooves?', a: ['A farrier', 'A baker', 'Nobody — hooves never grow'], c: 0, why: 'Hooves grow like fingernails, so a farrier trims them every few weeks.' } }
  };
  DF.ANIMAL_ORDER = ['lamb', 'chicken', 'rabbit', 'duck', 'cow', 'cat', 'dog', 'pony'];

  /* ---------------- FURNITURE & DECOR ----------------
     zone: 'wall' | 'floor' | 'yard'   w: width in cells */
  DF.THEMES = {
    cottage:  { name: 'Cottagecore',        lvl: 1, color: '#e9c9a1' },
    flower:   { name: 'Flower Garden',      lvl: 2, color: '#f6b8c8' },
    pastel:   { name: 'Pastel Dream',       lvl: 3, color: '#cdb9ef' },
    reading:  { name: 'Cozy Reading Room',  lvl: 4, color: '#c79a76' },
    explorer: { name: 'Nature Explorer',    lvl: 5, color: '#9cc59a' },
    fairy:    { name: 'Fairy Garden',       lvl: 6, color: '#a9d8e8' }
  };
  DF.FURNITURE = {
    // Cottagecore (some are free starters)
    bed_quilt:     { name: 'Patchwork Bed',     theme: 'cottage', zone: 'floor', w: 2, price: 30 },
    rug_round:     { name: 'Braided Rug',       theme: 'cottage', zone: 'floor', w: 1, price: 10 },
    lamp_cottage:  { name: 'Mushroom Lamp',     theme: 'cottage', zone: 'floor', w: 1, price: 12 },
    table_wood:    { name: 'Little Wood Table', theme: 'cottage', zone: 'floor', w: 1, price: 14 },
    window_lace:   { name: 'Lace Window',       theme: 'cottage', zone: 'wall',  w: 1, price: 12 },
    shelf_jars:    { name: 'Jar Shelf',         theme: 'cottage', zone: 'wall',  w: 1, price: 15 },
    plant_pot:     { name: 'Potted Fern',       theme: 'cottage', zone: 'floor', w: 1, price: 8 },
    // Flower Garden
    painting_flower:{ name: 'Flower Painting',  theme: 'flower',  zone: 'wall',  w: 1, price: 18 },
    pot_tulip:     { name: 'Tulip Pot',         theme: 'flower',  zone: 'floor', w: 1, price: 12 },
    flowerbox:     { name: 'Window Flowerbox',  theme: 'flower',  zone: 'wall',  w: 1, price: 16 },
    rose_arch:     { name: 'Rose Arch',         theme: 'flower',  zone: 'yard',  w: 1, price: 30 },
    bench_flower:  { name: 'Flower Bench',      theme: 'flower',  zone: 'yard',  w: 2, price: 28 },
    // Pastel Dream
    bed_cloud:     { name: 'Cloud Bed',         theme: 'pastel',  zone: 'floor', w: 2, price: 45 },
    beanbag:       { name: 'Pink Beanbag',      theme: 'pastel',  zone: 'floor', w: 1, price: 20 },
    lamp_star:     { name: 'Star Lamp',         theme: 'pastel',  zone: 'floor', w: 1, price: 18 },
    mirror_heart:  { name: 'Heart Mirror',      theme: 'pastel',  zone: 'wall',  w: 1, price: 20 },
    rug_rainbow:   { name: 'Rainbow Rug',       theme: 'pastel',  zone: 'floor', w: 2, price: 24 },
    // Cozy Reading Room
    bookshelf:     { name: 'Tall Bookshelf',    theme: 'reading', zone: 'floor', w: 1, price: 30 },
    armchair:      { name: 'Comfy Armchair',    theme: 'reading', zone: 'floor', w: 1, price: 28 },
    desk:          { name: 'Writing Desk',      theme: 'reading', zone: 'floor', w: 2, price: 32 },
    clock:         { name: 'Owl Clock',         theme: 'reading', zone: 'wall',  w: 1, price: 18 },
    books_pile:    { name: 'Pile of Books',     theme: 'reading', zone: 'floor', w: 1, price: 10 },
    // Nature Explorer
    telescope:     { name: 'Star Telescope',    theme: 'explorer',zone: 'floor', w: 1, price: 35 },
    monstera:      { name: 'Big Leafy Plant',   theme: 'explorer',zone: 'floor', w: 1, price: 20 },
    map_poster:    { name: 'World Map',         theme: 'explorer',zone: 'wall',  w: 1, price: 18 },
    terrarium:     { name: 'Terrarium',         theme: 'explorer',zone: 'floor', w: 1, price: 24 },
    bird_feeder:   { name: 'Bird Feeder',       theme: 'explorer',zone: 'yard',  w: 1, price: 16 },
    // Fairy Garden
    fairy_lights:  { name: 'Fairy Lights',      theme: 'fairy',   zone: 'wall',  w: 1, price: 20 },
    mushroom_stool:{ name: 'Toadstool Seat',    theme: 'fairy',   zone: 'floor', w: 1, price: 18 },
    fairy_house:   { name: 'Fairy House',       theme: 'fairy',   zone: 'yard',  w: 1, price: 40 },
    glow_lantern:  { name: 'Glow Lantern',      theme: 'fairy',   zone: 'yard',  w: 1, price: 16 },
    // Yard basics (cottage theme)
    fence:         { name: 'Picket Fence',      theme: 'cottage', zone: 'yard',  w: 1, price: 5 },
    path_stone:    { name: 'Stepping Stones',   theme: 'cottage', zone: 'yard',  w: 1, price: 4 },
    garden_light:  { name: 'Garden Light',      theme: 'cottage', zone: 'yard',  w: 1, price: 10 },
    flower_pot:    { name: 'Flower Pot',        theme: 'cottage', zone: 'yard',  w: 1, price: 6 },
    bird_bath:     { name: 'Bird Bath',         theme: 'cottage', zone: 'yard',  w: 1, price: 18 },
    mailbox:       { name: 'Mailbox',           theme: 'cottage', zone: 'yard',  w: 1, price: 12 },
    // Crafted-only decorations (price 0 = not sold in shop)
    knit_blanket:  { name: 'Knitted Blanket',   theme: 'cottage', zone: 'floor', w: 1, price: 0, crafted: true },
    fluffy_pillow: { name: 'Fluffy Pillow',     theme: 'pastel',  zone: 'floor', w: 1, price: 0, crafted: true },
    wood_stool:    { name: 'Wooden Stool',      theme: 'cottage', zone: 'floor', w: 1, price: 0, crafted: true },
    birdhouse:     { name: 'Birdhouse',         theme: 'explorer',zone: 'yard',  w: 1, price: 0, crafted: true },
    bee_hotel:     { name: 'Bee Hotel',         theme: 'explorer',zone: 'yard',  w: 1, price: 0, crafted: true },
    bottle_planter:{ name: 'Bottle Planter',    theme: 'flower',  zone: 'yard',  w: 1, price: 0, crafted: true },
    can_chime:     { name: 'Tin Can Wind Chime',theme: 'fairy',   zone: 'yard',  w: 1, price: 0, crafted: true },
    pumpkin_lantern:{ name: 'Pumpkin Lantern',  theme: 'fairy',   zone: 'yard',  w: 1, price: 0, crafted: true }
  };
  DF.STARTER_FURNITURE = { bed_quilt: 1, rug_round: 1, lamp_cottage: 1, table_wood: 1, window_lace: 1, plant_pot: 1, fence: 3, flower_pot: 2, path_stone: 3 };

  DF.WALLS = [
    { id: 'cream',    name: 'Warm Cream',   c: '#fbf0dc', theme: 'cottage' },
    { id: 'sage',     name: 'Sage',         c: '#d6e6cc', theme: 'cottage' },
    { id: 'rose',     name: 'Rose Petal',   c: '#f8d7df', theme: 'flower' },
    { id: 'butter',   name: 'Butter',       c: '#fbeab0', theme: 'flower' },
    { id: 'lilac',    name: 'Lilac',        c: '#e4d8f6', theme: 'pastel' },
    { id: 'sky',      name: 'Sky',          c: '#d5e9f7', theme: 'pastel' },
    { id: 'cocoa',    name: 'Cocoa',        c: '#e7cfb8', theme: 'reading' },
    { id: 'moss',     name: 'Moss',         c: '#c7dcb4', theme: 'explorer' },
    { id: 'twilight', name: 'Twilight',     c: '#cfd6f2', theme: 'fairy' }
  ];
  DF.FLOORS = [
    { id: 'oak',     name: 'Oak Boards',     c: '#d9a86c', c2: '#c99459', theme: 'cottage' },
    { id: 'birch',   name: 'Birch Boards',   c: '#ecd2a8', c2: '#dfc196', theme: 'cottage' },
    { id: 'tile',    name: 'Rose Tiles',     c: '#f3c7c7', c2: '#ebb5b8', theme: 'flower' },
    { id: 'mint',    name: 'Mint Carpet',    c: '#c8ebdc', c2: '#bde2d2', theme: 'pastel' },
    { id: 'walnut',  name: 'Walnut',         c: '#b3825c', c2: '#a47350', theme: 'reading' },
    { id: 'moss',    name: 'Mossy Stone',    c: '#b8cfa4', c2: '#a9c294', theme: 'explorer' },
    { id: 'starry',  name: 'Starry Night',   c: '#b9c0e6', c2: '#aab2dd', theme: 'fairy' }
  ];
  DF.GROUNDS = [
    { id: 'grass',  name: 'Meadow Grass', c: '#b9dc95', c2: '#acd387', theme: 'cottage' },
    { id: 'clover', name: 'Clover Field', c: '#a8d6a2', c2: '#9acb93', theme: 'flower' },
    { id: 'gravel', name: 'Garden Gravel',c: '#e3d6bf', c2: '#d8c9ae', theme: 'reading' },
    { id: 'blossom',name: 'Petal Lawn',   c: '#cfe3b3', c2: '#f1cfd7', theme: 'pastel' }
  ];

  /* ---------------- OTHER ITEMS ---------------- */
  DF.GOODS = {
    wool:       { name: 'Wool',            cat: 'animal', sell: 8,  desc: 'Soft wool, brushed gently from your lamb.' },
    egg:        { name: 'Egg',             cat: 'animal', sell: 4,  desc: 'A fresh egg from a happy hen.' },
    fluff:      { name: 'Bunny Fluff',     cat: 'animal', sell: 5,  desc: 'Rabbits shed soft fur naturally. Perfect for crafting!' },
    duck_egg:   { name: 'Duck Egg',        cat: 'animal', sell: 7,  desc: 'A big, pale duck egg.' },
    milk:       { name: 'Milk',            cat: 'animal', sell: 9,  desc: 'Fresh milk from your calm cow.' },
    horseshoe:  { name: 'Lucky Horseshoe', cat: 'animal', sell: 14, desc: 'An old shoe from the farrier’s visit. Said to bring luck!' },
    seed_packet:{ name: 'Mystery Seed Packet', cat: 'other', sell: 0, desc: 'Your dog dug this up! Open it from your bag to get seeds.' },
    scraps:     { name: 'Veggie Scraps',   cat: 'other',  sell: 1,  desc: 'Peels and leaves. Great for compost!' },
    wood:       { name: 'Fallen Twigs',    cat: 'other',  sell: 2,  desc: 'Collected from under your fruit trees — no chopping needed.' },
    bottle:     { name: 'Old Bottle',      cat: 'other',  sell: 0,  desc: 'Litter from the pond. Reuse it in a crafting recipe!' },
    can:        { name: 'Tin Can',         cat: 'other',  sell: 0,  desc: 'Litter from the pond. It can be reused!' },
    compost:    { name: 'Compost',         cat: 'crafted', sell: 6, desc: 'Rich, crumbly soil food. Add it to a garden plot for a bigger harvest.' },
    yarn:       { name: 'Yarn',            cat: 'crafted', sell: 18, desc: 'Wool spun into a long, soft thread.' },
    jam:        { name: 'Strawberry Jam',  cat: 'crafted', sell: 40, desc: 'Sweet and shiny. Made from 4 strawberries.' },
    apple_pie:  { name: 'Apple Pie',       cat: 'crafted', sell: 48, desc: 'Golden crust, warm apples. Smells amazing!' },
    flower_crown:{ name: 'Flower Crown',   cat: 'accessory', sell: 22, desc: 'A crown of daisies and lavender. Animals can wear it!' },
    lemonade:   { name: 'Lemonade',        cat: 'crafted', sell: 30, desc: 'Fresh and zingy, made from your own lemons.' },
    // bouquets
    bouquet_classic: { name: 'Classic Bouquet',       cat: 'bouquet', sell: 20, desc: 'Three flowers of the same kind — simple and elegant.' },
    bouquet_mix:     { name: 'Garden Mix Bouquet',    cat: 'bouquet', sell: 24, desc: 'A cheerful mix of garden flowers.' },
    bouquet_rainbow: { name: 'Rainbow Bouquet',       cat: 'bouquet', sell: 30, desc: 'Three different flowers, three different colours!' },
    bouquet_comp:    { name: 'Sunset Contrast Bouquet', cat: 'bouquet', sell: 34, desc: 'Purple and yellow — complementary colours that make each other pop.' },
    // animal accessories
    acc_bow:    { name: 'Pink Bow',        cat: 'accessory', price: 10, sell: 4, desc: 'A sweet bow for any animal friend.' },
    acc_bell:   { name: 'Little Bell',     cat: 'accessory', price: 12, sell: 5, desc: 'Jingles softly. (Not too loud — animals have sensitive ears!)' },
    acc_bandana:{ name: 'Blue Bandana',    cat: 'accessory', price: 12, sell: 5, desc: 'For the adventurous animal.' },
    acc_hat:    { name: 'Tiny Sun Hat',    cat: 'accessory', price: 15, sell: 6, desc: 'Shade for sunny days.' }
  };
  DF.ACCESSORIES = ['acc_bow', 'acc_bell', 'acc_bandana', 'acc_hat', 'flower_crown'];

  /* ---------------- TOOLS & UPGRADES ---------------- */
  DF.TOOLS = {
    big_can:  { name: 'Rainbow Watering Can', lvl: 2, price: 40, desc: 'Water every thirsty plant with one tap.', fact: 'w_saving' },
    gloves:   { name: 'Harvest Gloves',       lvl: 2, price: 35, desc: 'Harvest every ready crop at once.' },
    satchel:  { name: 'Seed Satchel',         lvl: 3, price: 30, desc: 'Plant one kind of seed in all empty plots at once.' },
    rain_barrel:{ name: 'Rain Barrel',        lvl: 3, price: 25, desc: 'Collects rainwater. Your plants get a free drink on rainy days!', fact: 'w_rainbarrel' }
  };
  DF.MAX_PLOTS = 12;
  DF.START_PLOTS = 6;
  DF.plotPrice = (n) => 15 + (n - DF.START_PLOTS) * 10;   // price of the next plot
  DF.MAX_TREES = 5;
  DF.START_TREES = 3;
  DF.treeSpotPrice = (n) => 30 + (n - DF.START_TREES) * 20;
  DF.HOUSE_UPGRADES = {
    room_big: { name: 'Bigger Bedroom', lvl: 3, price: 80,  desc: 'Knock through a wall: your bedroom grows from 6 to 8 tiles wide.' },
    yard_big: { name: 'Bigger Front Garden', lvl: 3, price: 60, desc: 'More room for fences, flowers and benches.' }
  };

  /* ---------------- RECIPES ---------------- */
  DF.RECIPES = {
    compost:   { name: 'Compost',          out: 'compost',        n: 1, needs: { scraps: 3 },                  xp: 4, known: true,  fact: 's_compost', why: 'Tiny living things break scraps down into rich soil.' },
    yarn:      { name: 'Yarn',             out: 'yarn',           n: 1, needs: { wool: 2 },                    xp: 4, known: true,  why: 'Spinning twists wool fibres into a strong thread.' },
    stool:     { name: 'Wooden Stool',     out: 'wood_stool',     n: 1, needs: { wood: 3 },                    xp: 5, known: true,  why: 'Only fallen twigs are used — no trees were harmed!' },
    jam:       { name: 'Strawberry Jam',   out: 'jam',            n: 1, needs: { strawberry: 4 },              xp: 6, lvl: 2, why: 'Jam is fruit cooked with sugar until it thickens.' },
    blanket:   { name: 'Knitted Blanket',  out: 'knit_blanket',   n: 1, needs: { yarn: 3 },                    xp: 8, why: 'Knitting loops yarn into rows to make fabric.' },
    pillow:    { name: 'Fluffy Pillow',    out: 'fluffy_pillow',  n: 1, needs: { fluff: 3 },                   xp: 6, why: 'Shed bunny fur makes a super-soft stuffing.' },
    birdhouse: { name: 'Birdhouse',        out: 'birdhouse',      n: 1, needs: { wood: 4 },                    xp: 7, why: 'Birdhouses give birds a safe place to nest.', fact: 'e_wildlife' },
    bee_hotel: { name: 'Bee Hotel',        out: 'bee_hotel',      n: 1, needs: { wood: 3, lavender: 1 },       xp: 8, why: 'Solitary bees lay eggs in hollow stems.', fact: 'b_hotel' },
    planter:   { name: 'Bottle Planter',   out: 'bottle_planter', n: 1, needs: { bottle: 2, compost: 1 },      xp: 7, why: 'Reusing litter gives it a second life!', fact: 'e_reuse' },
    chime:     { name: 'Tin Can Wind Chime', out: 'can_chime',    n: 1, needs: { can: 3 },                     xp: 7, why: 'Old cans become music in the breeze.', fact: 'e_recycle' },
    crown:     { name: 'Flower Crown',     out: 'flower_crown',   n: 1, needs: { daisy: 3, lavender: 1 },      xp: 6, why: 'Weave the stems together — then give it to an animal friend!' },
    lantern:   { name: 'Pumpkin Lantern',  out: 'pumpkin_lantern',n: 1, needs: { pumpkin: 1, scraps: 1 },     xp: 6, why: 'The scooped-out pumpkin insides go into compost.' },
    pie:       { name: 'Apple Pie',        out: 'apple_pie',      n: 1, needs: { apple: 3, egg: 1, milk: 1 },  xp: 9, why: 'Eggs and milk help make the pastry and filling.' },
    lemonade:  { name: 'Lemonade',         out: 'lemonade',       n: 1, needs: { lemon: 3 },                   xp: 6, why: 'Squeeze, mix with water, add a little sugar!' }
  };

  /* ---------------- AVATAR OPTIONS ---------------- */
  DF.AVATAR = {
    skin: ['#fde0c8', '#f5c9a3', '#e2a77c', '#c4885e', '#9b6440', '#6e4630'],
    hairColor: ['#3b2a20', '#6b4128', '#a8642e', '#e2b25a', '#1f1a1a', '#d77a5b', '#b78fd9', '#e98aa8'],
    hair: [
      { id: 'long', name: 'Long & Wavy' }, { id: 'bob', name: 'Bob' }, { id: 'pony', name: 'Ponytail' },
      { id: 'buns', name: 'Space Buns' }, { id: 'curly', name: 'Curly Cloud' }, { id: 'braids', name: 'Braids' }, { id: 'pixie', name: 'Pixie Cut' }
    ],
    outfit: [
      { id: 'overalls', name: 'Garden Overalls', lvl: 1 }, { id: 'dress', name: 'Sundress', lvl: 1 },
      { id: 'hoodie', name: 'Cozy Hoodie', lvl: 1 }, { id: 'raincoat', name: 'Raincoat', lvl: 2 },
      { id: 'explorer', name: 'Explorer Vest', lvl: 4 }, { id: 'fairy', name: 'Fairy Dress', lvl: 6 }
    ],
    outfitColor: ['#9fcf9a', '#f6b0a6', '#b5a4e8', '#8fc4ea', '#f6d36b', '#f1a5c6'],
    acc: [
      { id: 'none', name: 'None', lvl: 1 }, { id: 'flower', name: 'Flower Clip', lvl: 1 }, { id: 'hat', name: 'Straw Hat', lvl: 1 },
      { id: 'bow', name: 'Big Bow', lvl: 1 }, { id: 'glasses', name: 'Round Glasses', lvl: 1 }, { id: 'headband', name: 'Headband', lvl: 2 },
      { id: 'crown', name: 'Flower Crown', lvl: 3 }, { id: 'wings', name: 'Fairy Wings', lvl: 5 }
    ]
  };

  /* ---------------- QUESTS ----------------
     Progress = stats[stat] (lifetime counters) — simple and robust. */
  DF.QUESTS = [
    { id: 'q_first_plant', title: 'A Tiny Beginning',        desc: 'Plant your very first seed.',             stat: 'plant_any', goal: 1,  lvl: 1, reward: { coins: 10, xp: 10 } },
    { id: 'q_carrots',     title: 'Carrot Crew',             desc: 'Plant 5 carrots.',                        stat: 'plant_carrot', goal: 5, lvl: 1, reward: { coins: 15, xp: 15, items: { daisy_seed: 2 } } },
    { id: 'q_water',       title: 'Little Rain Cloud',       desc: 'Water your plants 10 times.',             stat: 'water', goal: 10, lvl: 1, reward: { coins: 12, xp: 12 } },
    { id: 'q_sunflowers',  title: 'Sunshine Collector',      desc: 'Grow and harvest 3 sunflowers.',          stat: 'harvest_sunflower', goal: 3, lvl: 1, reward: { coins: 20, xp: 20 } },
    { id: 'q_pet',         title: 'Gentle Hands',            desc: 'Pet or brush your animals 5 times.',      stat: 'groom', goal: 5, lvl: 1, reward: { coins: 10, xp: 12 } },
    { id: 'q_rabbit',      title: 'Bunny Best Friend',       desc: 'Raise your rabbit’s friendship to 3 hearts.', stat: 'friend_rabbit', goal: 60, lvl: 1, reward: { coins: 20, xp: 25, items: { acc_bow: 1 } }, unit: '%' },
    { id: 'q_eggs',        title: 'Egg-cellent!',            desc: 'Collect 3 eggs from your chicken.',       stat: 'collect_egg', goal: 3, lvl: 1, reward: { coins: 12, xp: 15 } },
    { id: 'q_market',      title: 'Little Merchant',         desc: 'Earn 20 coins at the market.',            stat: 'earned', goal: 20, lvl: 1, reward: { coins: 10, xp: 15 } },
    { id: 'q_bee',         title: 'Friend of the Bees',      desc: 'Complete Bee’s Flower Adventure.',   stat: 'mg_bee', goal: 1, lvl: 1, reward: { coins: 15, xp: 20 } },
    { id: 'q_decorate',    title: 'Home Sweet Home',         desc: 'Place 3 decorations in your bedroom.',    stat: 'place_inside', goal: 3, lvl: 1, reward: { coins: 15, xp: 15, items: { pot_tulip: 1 } } },
    { id: 'q_butterflies', title: 'Butterfly Spotter',       desc: 'Discover 3 facts about butterflies.',     stat: 'facts_butterflies', goal: 3, lvl: 1, reward: { coins: 15, xp: 20 }, hint: 'Tap the butterflies fluttering around your farm!' },
    { id: 'q_math',        title: 'Market Maths Whiz',       desc: 'Complete a Market Math Challenge.',       stat: 'mg_math', goal: 1, lvl: 2, reward: { coins: 15, xp: 20 } },
    { id: 'q_bouquet',     title: 'Flower Artist',           desc: 'Craft your first flower bouquet.',        stat: 'craft_bouquet', goal: 1, lvl: 2, reward: { coins: 20, xp: 20 } },
    { id: 'q_habitat',     title: 'Home Sweet Habitat',      desc: 'Complete the Animal Habitat Match.',      stat: 'mg_habitat', goal: 1, lvl: 2, reward: { coins: 15, xp: 20 } },
    { id: 'q_tree',        title: 'Plant a Tree',            desc: 'Plant a fruit tree in the orchard.',      stat: 'plant_tree', goal: 1, lvl: 2, reward: { coins: 15, xp: 15 } },
    { id: 'q_compost',     title: 'Soil Scientist',          desc: 'Make compost from veggie scraps.',        stat: 'craft_compost', goal: 1, lvl: 2, reward: { coins: 12, xp: 15 } },
    { id: 'q_pond',        title: 'Pond Protector',          desc: 'Pick up 5 pieces of litter at the pond.', stat: 'litter', goal: 5, lvl: 2, reward: { coins: 15, xp: 20 } },
    { id: 'q_genius',      title: 'Garden Genius',           desc: 'Complete a Garden Genius puzzle set.',    stat: 'mg_genius', goal: 1, lvl: 2, reward: { coins: 15, xp: 20 } },
    { id: 'q_story',       title: 'Bookworm',                desc: 'Read a story in the Story Nook.',         stat: 'story', goal: 1, lvl: 2, reward: { coins: 10, xp: 15 } },
    { id: 'q_adopt',       title: 'A New Friend',            desc: 'Adopt a new animal.',                     stat: 'adopt', goal: 1, lvl: 2, reward: { coins: 20, xp: 25 } },
    { id: 'q_harvest25',   title: 'Busy Harvest',            desc: 'Harvest 25 crops.',                       stat: 'harvest_any', goal: 25, lvl: 3, reward: { coins: 30, xp: 30 } },
    { id: 'q_words',       title: 'Word Gardener',           desc: 'Complete Word Sprouts.',                  stat: 'mg_words', goal: 1, lvl: 3, reward: { coins: 15, xp: 20 } },
    { id: 'q_fruit',       title: 'Fruit Picker',            desc: 'Pick 10 fruits from your orchard.',       stat: 'fruit', goal: 10, lvl: 3, reward: { coins: 20, xp: 25 } },
    { id: 'q_care',        title: 'Responsible Carer',       desc: 'Answer 3 animal care questions.',         stat: 'care_quiz', goal: 3, lvl: 3, reward: { coins: 20, xp: 25 } },
    { id: 'q_journal',     title: 'Curious Mind',            desc: 'Collect 20 discoveries in your journal.', stat: 'facts', goal: 20, lvl: 3, reward: { coins: 25, xp: 30 } },
    { id: 'q_place10',     title: 'Interior Designer',       desc: 'Place 10 decorations anywhere.',          stat: 'place_any', goal: 10, lvl: 3, reward: { coins: 25, xp: 25 } },
    { id: 'q_crafts',      title: 'Maker',                   desc: 'Craft 8 items in the workshop.',          stat: 'craft_any', goal: 8, lvl: 4, reward: { coins: 30, xp: 30 } },
    { id: 'q_level6',      title: 'Dream Farmer',            desc: 'Reach level 6.',                          stat: 'level', goal: 6, lvl: 4, reward: { coins: 50, xp: 0 } }
  ];

  /* ---------------- BADGES / ACHIEVEMENTS ---------------- */
  DF.BADGES = [
    { id: 'b_sprout',    name: 'First Sprout',      icon: '🌱', desc: 'Planted a first seed.',              stat: 'plant_any', goal: 1 },
    { id: 'b_green',     name: 'Green Thumb',       icon: '🥕', desc: 'Harvested 30 crops.',                stat: 'harvest_any', goal: 30 },
    { id: 'b_animal',    name: 'Animal Whisperer',  icon: '🐑', desc: 'Filled an animal’s friendship to 5 hearts.', stat: 'friend_max', goal: 100 },
    { id: 'b_carer',     name: 'Caring Keeper',     icon: '🩺', desc: 'Passed 3 animal care checks.', stat: 'care_quiz', goal: 3 },
    { id: 'b_bee',       name: 'Bee’s Best Friend', icon: '🐝', desc: 'Played Bee’s Flower Adventure 3 times.', stat: 'mg_bee', goal: 3 },
    { id: 'b_math',      name: 'Maths Star',        icon: '⭐', desc: 'Completed 3 Market Math Challenges.',   stat: 'mg_math', goal: 3 },
    { id: 'b_habitat',   name: 'Habitat Hero',      icon: '🌍', desc: 'Completed the Habitat Match twice.', stat: 'mg_habitat', goal: 2 },
    { id: 'b_genius',    name: 'Garden Genius',     icon: '🧠', desc: 'Completed Garden Genius twice.',     stat: 'mg_genius', goal: 2 },
    { id: 'b_words',     name: 'Word Wizard',       icon: '📚', desc: 'Completed Word Sprouts twice.',      stat: 'mg_words', goal: 2 },
    { id: 'b_reader',    name: 'Story Lover',       icon: '📖', desc: 'Read every story in the Story Nook.', stat: 'story_unique', goal: 4 },
    { id: 'b_eco',       name: 'Eco Hero',          icon: '♻️', desc: 'Picked up 15 pieces of pond litter.', stat: 'litter', goal: 15 },
    { id: 'b_designer',  name: 'Interior Designer', icon: '🛋️', desc: 'Placed 15 decorations.',     stat: 'place_any', goal: 15 },
    { id: 'b_curious',   name: 'Curious Explorer',  icon: '🔎', desc: 'Collected 30 discoveries.',         stat: 'facts', goal: 30 },
    { id: 'b_florist',   name: 'Florist',           icon: '💐', desc: 'Made 5 bouquets.',                   stat: 'craft_bouquet', goal: 5 },
    { id: 'b_maker',     name: 'Master Maker',      icon: '🔨', desc: 'Crafted 15 items.',                  stat: 'craft_any', goal: 15 },
    { id: 'b_merchant',  name: 'Smart Merchant',    icon: '🪙', desc: 'Earned 300 coins at the market.',    stat: 'earned', goal: 300 },
    { id: 'b_family',    name: 'Big Farm Family',   icon: '🏡', desc: 'Cared for 5 different animals.',     stat: 'animals_owned', goal: 5 },
    { id: 'b_level5',    name: 'Rising Farmer',     icon: '🌻', desc: 'Reached level 5.',                   stat: 'level', goal: 5 },
    { id: 'b_level10',   name: 'Dream Farmer',      icon: '🏆', desc: 'Reached level 10.',                  stat: 'level', goal: 10 }
  ];

  /* ---------------- LEVELS ---------------- */
  DF.xpToNext = (lvl) => 40 + (lvl - 1) * 30;      // 40, 70, 100, 130…

  /* ---------------- FACTS (Little Discoveries) ----------------
     topic → journal chapter. Keep each fact short, accurate & kind. */
  DF.TOPICS = {
    plants:      { name: 'Plants & Growing',  icon: '🌱', color: '#cfe8bf' },
    bees:        { name: 'Bees & Pollination',icon: '🐝', color: '#fbe7a6' },
    butterflies: { name: 'Butterflies',       icon: '🦋', color: '#e6dafa' },
    water:       { name: 'Water & Weather',   icon: '💧', color: '#cfe6f7' },
    soil:        { name: 'Soil & Compost',    icon: '🪱', color: '#ecd9c3' },
    animals:     { name: 'Animal Care',       icon: '🐾', color: '#f9d9cf' },
    nature:      { name: 'Habitats & Food Chains', icon: '🌍', color: '#d4ecd9' },
    pond:        { name: 'Pond Life',         icon: '🐸', color: '#cdeae4' },
    earth:       { name: 'Caring for Earth',  icon: '♻️', color: '#dcefc9' },
    trees:       { name: 'Fruit Trees',       icon: '🍎', color: '#fbd5cf' },
    money:       { name: 'Money & Maths',     icon: '🪙', color: '#fdeab8' }
  };

  const F = (topic, title, text) => ({ topic, title, text });
  DF.FACTS = {
    // Plants
    p_lifecycle:   F('plants', 'The Circle of a Plant', 'A plant’s life goes seed → sprout → young plant → flower → fruit with new seeds. Then the circle starts all over again!'),
    p_photosynth:  F('plants', 'Plants Make Their Own Food', 'Using sunlight, water and carbon dioxide from the air, leaves make sugar for the plant and give out oxygen. This is called photosynthesis.'),
    p_chlorophyll: F('plants', 'Why Leaves Are Green', 'Leaves contain chlorophyll, a green pigment that catches the energy in sunlight.'),
    p_roots:       F('plants', 'Busy Roots', 'Roots hold a plant firmly in the ground and soak up water and minerals from the soil.'),
    p_water_need:  F('plants', 'Just the Right Drink', 'Plants need the right amount of water. Too little and they wilt; too much and their roots can’t get the air they need.'),
    p_seeds_travel:F('plants', 'Seeds on a Journey', 'Seeds travel in clever ways: dandelion seeds fly on the wind, burrs hitch a ride on animal fur, and coconuts can float across the sea.'),
    p_carrot:      F('plants', 'Carrots Are Roots', 'The orange part of a carrot is its root, where the plant stores food. Its colour comes from beta-carotene.'),
    p_daisy:       F('plants', 'The Day’s Eye', 'The name “daisy” comes from “day’s eye” — many daisies open in the morning and close in the evening.'),
    p_sunflower:   F('plants', 'Sun Followers', 'Young sunflowers turn to follow the sun across the sky. Grown-up sunflowers usually stop and face east.'),
    p_sunflower2:  F('plants', 'A Thousand Tiny Flowers', 'A sunflower head is really hundreds or even thousands of tiny flowers called florets, packed together.'),
    p_strawberry:  F('plants', 'Seeds on the Outside', 'Strawberries wear their seeds on the outside — around 200 on each berry!'),
    p_tomato:      F('plants', 'Fruit or Vegetable?', 'Scientists call a tomato a fruit, because it grows from a flower and holds seeds. Cooks usually treat it like a vegetable.'),
    p_pumpkin:     F('plants', 'Vine Giants', 'Pumpkins are a kind of squash. They grow on long vines, and each pumpkin starts as a flower.'),
    p_tulip:       F('plants', 'Bulb Power', 'Tulips grow from bulbs — underground food stores that help them survive winter and bloom again in spring.'),
    p_lavender:    F('plants', 'Lovely Lavender', 'Lavender’s strong scent attracts bees and butterflies, while many garden pests dislike it.'),
    p_blueberry:   F('plants', 'Blue Pigments', 'Blueberries get their colour from pigments called anthocyanins — the same family of pigments that makes some flowers purple.'),
    // Bees
    b_pollination: F('bees', 'What Is Pollination?', 'Pollination happens when pollen moves to a flower of the same kind. That lets the plant make seeds and fruit.'),
    b_why:         F('bees', 'Nature’s Helpers', 'Almost 9 out of 10 kinds of flowering plants need animals — like bees, butterflies and birds — to help pollinate them.'),
    b_food:        F('bees', 'Bees & Our Food', 'About one in every three bites of food we eat depends on pollinators such as bees.'),
    b_dance:       F('bees', 'The Waggle Dance', 'Honeybees do a “waggle dance” to tell their hive-mates which direction to fly to find flowers.'),
    b_species:     F('bees', 'So Many Bees!', 'There are more than 20,000 kinds of bees. Most of them live alone, not in a hive.'),
    b_hotel:       F('bees', 'Bee Hotels', 'A bee hotel — a bundle of hollow stems or wood with holes — gives solitary bees a safe place to lay their eggs.'),
    b_pollen_same: F('bees', 'Same Kind Only', 'Pollen only works on a flower of the same kind. Sunflower pollen can’t help a tulip make seeds!'),
    // Butterflies
    bf_taste:      F('butterflies', 'Tasting With Feet', 'Butterflies taste with their feet! Sensors tell them if a leaf is good food for their caterpillars.'),
    bf_meta:       F('butterflies', 'Metamorphosis', 'A butterfly has four life stages: egg, caterpillar, chrysalis, and adult. This big change is called metamorphosis.'),
    bf_wings:      F('butterflies', 'Wings of Scales', 'Butterfly wings are covered in thousands of tiny scales, which make their beautiful colours and patterns.'),
    bf_sun:        F('butterflies', 'Sunbathers', 'Butterflies can’t fly well when they’re cold, so they bask in the sun to warm up their flight muscles.'),
    bf_proboscis:  F('butterflies', 'A Curly Straw', 'Butterflies sip nectar through a long tube called a proboscis, which curls up like a spring when not in use.'),
    // Water & weather
    w_cycle:       F('water', 'The Water Cycle', 'The sun warms water so it evaporates. The vapour cools into clouds (condensation), then falls back as rain (precipitation).'),
    w_saving:      F('water', 'Smart Watering', 'Watering plants in the morning or evening saves water, because less of it evaporates in the heat of the day.'),
    w_rainbarrel:  F('water', 'Rain Barrels', 'Collecting rainwater in a barrel is a great way to save water for the garden.'),
    w_earth:       F('water', 'A Blue Planet', 'About 71% of Earth’s surface is covered by water, but only a tiny part of it is fresh water we can use.'),
    w_rain:        F('water', 'How Rain Happens', 'Clouds are made of billions of tiny droplets. When droplets join into drops too heavy to float, it rains.'),
    w_seasons:     F('water', 'Why We Have Seasons', 'Earth is tilted. As it travels around the sun, each half of the planet takes turns leaning towards the sun.'),
    // Soil
    s_compost:     F('soil', 'Making Compost', 'Bacteria, fungi and worms break down food scraps and leaves into rich soil. This natural recycling is called decomposition.'),
    s_worms:       F('soil', 'Worm Heroes', 'Earthworm tunnels let air and water into the soil, and their droppings (called castings) feed the plants.'),
    s_life:        F('soil', 'A Spoonful of Life', 'A single teaspoon of healthy soil can hold more tiny living things than there are people on Earth!'),
    s_greens:      F('soil', 'Greens & Browns', 'Good compost mixes “greens” (fruit and veg scraps, grass) with “browns” (dry leaves, cardboard).'),
    // Animals
    a_sheep:       F('animals', 'Sheep Care', 'Sheep mostly eat grass and hay. Most sheep need shearing once a year so their wool doesn’t get too heavy and hot.'),
    a_sheep_faces: F('animals', 'Face Experts', 'Sheep can recognise the faces of other sheep — and even people they know!'),
    a_chicken:     F('animals', 'Happy Hens', 'Chickens love to scratch and peck, take dust baths to keep their feathers clean, and need a safe coop at night.'),
    a_chicken_eggs:F('animals', 'Eggs & Daylight', 'Hens lay eggs even without a rooster. They usually lay fewer eggs in winter, when days are shorter.'),
    a_rabbit:      F('animals', 'Hay Is the Way', 'Rabbits should eat mostly hay. Their teeth never stop growing, and chewing hay keeps them healthy. Carrots are only a small treat!'),
    a_rabbit_social:F('animals', 'Bunny Buddies', 'Rabbits are social animals and are usually happiest living with another rabbit friend.'),
    a_duck:        F('animals', 'Waterproof Ducks', 'Ducks spread oil from a gland near their tail over their feathers, so water rolls right off.'),
    a_cow:         F('animals', 'Four-Part Tummy', 'A cow’s stomach has four compartments to digest tough grass. Cows spend hours a day chewing their cud.'),
    a_cat:         F('animals', 'Cats Need Meat', 'Cats are carnivores and need meat-based food. Many adult cats can’t digest cow’s milk well, so fresh water is best.'),
    a_dog:         F('animals', 'Walkies!', 'Dogs need daily walks, playtime and fresh water. Exercise keeps their bodies and minds happy.'),
    a_pony:        F('animals', 'Hoof Care', 'Ponies are small horses. Their hooves grow like fingernails, so a farrier trims them every few weeks.'),
    a_responsible: F('animals', 'Every Day Care', 'Caring for an animal means food, fresh water, shelter, exercise and vet visits when needed — every day, not just when it’s fun.'),
    a_food_amount: F('animals', 'Not Too Much!', 'Animals need the right amount of food. Overfeeding can make them unwell, just like eating only sweets would for us.'),
    // Nature
    n_foodchain:   F('nature', 'Food Chains', 'A food chain shows who eats what: sun → grass → rabbit → fox. Plants are “producers” because they make their own food.'),
    n_biodiversity:F('nature', 'Biodiversity', 'Biodiversity means the variety of living things in a place. More variety makes nature stronger and better balanced.'),
    n_decomposers: F('nature', 'Nature’s Recyclers', 'Decomposers like fungi and worms turn dead plants and animals back into nutrients for new life.'),
    n_habitat:     F('nature', 'What Is a Habitat?', 'A habitat is the natural home of an animal or plant — where it finds food, water, shelter and space.'),
    n_herbivore:   F('nature', 'Herbivore, Carnivore, Omnivore', 'Herbivores eat plants, carnivores eat meat, and omnivores eat both. Chickens and people are omnivores!'),
    // Pond
    pd_frog:       F('pond', 'From Tadpole to Frog', 'Frogs start life as tadpoles that breathe with gills. As they grow legs and lose their tails, they develop lungs.'),
    pd_frog_skin:  F('pond', 'Breathing Skin', 'Frogs can take in water and some oxygen through their skin, so clean water is very important to them.'),
    pd_dragonfly:  F('pond', 'Super Fliers', 'Dragonflies can fly forwards, backwards, and even hover like tiny helicopters.'),
    pd_lily:       F('pond', 'Floating Leaves', 'Water lily pads have a waxy top that keeps water off, and their stems are full of tiny air channels.'),
    pd_fish:       F('pond', 'Gills', 'Fish breathe with gills, which take oxygen from the water. Pond plants help add oxygen to the water.'),
    pd_tiny:       F('pond', 'The Tiniest Flower', 'Watermeal, a pond plant related to duckweed, is the smallest flowering plant on Earth — about the size of a sprinkle!'),
    // Earth
    e_recycle:     F('earth', 'Recycling Saves Energy', 'Recycling turns old materials into new things. Making a can from recycled aluminium uses much less energy than making a brand-new one.'),
    e_plastic:     F('earth', 'Litter Lasts', 'Plastic litter can take hundreds of years to break down, and animals may mistake it for food.'),
    e_reuse:       F('earth', 'Reduce, Reuse, Recycle', 'Reduce, reuse, recycle — in that order! Using less and reusing things saves the most resources.'),
    e_wildlife:    F('earth', 'A Wild Corner', 'Leaving a wild corner in a garden — long grass, logs, wildflowers — gives insects, birds and hedgehogs a home.'),
    e_trees:       F('earth', 'Tree Power', 'Trees take in carbon dioxide and give out oxygen, and their roots help stop soil from washing away.'),
    e_pesticide:   F('earth', 'Bee-Friendly Gardening', 'Many gardeners avoid strong pesticides because they can harm bees and other helpful insects.'),
    // Trees
    t_apple:       F('trees', 'Apple Blossoms', 'Apple trees need bees to carry pollen between blossoms — often from a different apple variety!'),
    t_lemon:       F('trees', 'Busy Lemon Trees', 'A lemon tree can have flowers and fruit on it at the same time.'),
    t_cherry:      F('trees', 'Blossom Picnics', 'In Japan, people celebrate cherry blossom season with picnics under the trees. This is called hanami.'),
    t_peach:       F('trees', 'Fuzzy Cousins', 'Peaches and almonds are close relatives — an almond is the seed of a fruit that looks like a fuzzy green peach!'),
    // Money
    m_budget:      F('money', 'Budgeting', 'Budgeting means planning your money: what you need, what you want, and how much to save.'),
    m_save:        F('money', 'Saving Adds Up', 'Saving a little each time adds up! Saving 5 coins on each of 6 trips gives you 30 coins.'),
    m_profit:      F('money', 'Profit', 'Profit is what you earn minus what you spent. Seeds for 2 coins that sell for 5 make a profit of 3 coins.'),
    c_colorwheel:  F('plants', 'Complementary Colours', 'Colours opposite each other on the colour wheel, like purple and yellow, are “complementary” — they make each other pop!')
  };
  DF.BUTTERFLY_FACTS = ['bf_taste', 'bf_meta', 'bf_wings', 'bf_sun', 'bf_proboscis'];

  /* ---------------- CLOVER'S LINES ---------------- */
  DF.CLOVER = {
    first: 'Hiii, {name}! 🌸 I’ve been waiting for you! Welcome to your very own Dream Farm! There are flowers to grow, animals to meet, and a cozy little home waiting for your magic. Are you ready for our adventure?',
    back: '{name}! You’re back! 🐑 I’ve got so much to show you. Ready to see how your beautiful farm is doing?',
    cheers: [
      'You’re doing amazing, {name}! ✨',
      'This farm gets prettier every time you visit!',
      'I love farming with you. Baa-rilliant work!',
      'Every expert gardener started with one tiny seed. Look at you now!',
      'Take your time — there’s no rush on Dream Farm. 🌼',
      'Your animals are so lucky to have you!',
      'Did you know? You’re my favourite farmer in the whole wide world.'
    ],
    quest: [
      'Woohoo! Quest complete! You’re a superstar, {name}! 🌟',
      'You did it! I’m doing a happy little hop! 🐑',
      'Amazing! Another quest done. This farm is lucky to have you!',
      'Yay! I knew you could do it, {name}!'
    ],
    learn: [
      'Ooh, a new discovery! Your journal is getting so full!',
      'You’re so clever, {name}! Learning is like planting seeds in your brain. 🌱',
      'That was brilliant! You’re a real nature scientist.'
    ]
  };

  /* ---------------- STORIES (reading) ---------------- */
  DF.STORIES = [
    { id: 'st_bee', title: 'Bella and the Big Garden', icon: '🐝',
      text: ['Bella was the smallest bee in her hive, but she had the biggest job: visiting flowers.',
             'One morning she landed on a bright sunflower. Golden dust stuck to her fuzzy legs. “That’s pollen,” said an old bee. “Carry it to another sunflower, and it can make seeds.”',
             'Bella zoomed to a second sunflower and wiggled happily. A few weeks later, the flower’s face was full of striped seeds.',
             '“I helped make those!” she buzzed. From then on, Bella never felt small again.'],
      qs: [ { q: 'What stuck to Bella’s legs?', a: ['Pollen', 'Honey', 'Rain'], c: 0 },
            { q: 'Why did Bella stop feeling small?', a: ['She knew her job helped flowers make seeds', 'She grew very big', 'She left the hive'], c: 0 } ] },
    { id: 'st_bell', title: 'Clover’s Lost Bell', icon: '🔔',
      text: ['Clover the lamb loved her little silver bell. One windy afternoon, it was gone!',
             'She searched the meadow. A rabbit said, “I heard a jingle near the pond.” A duck said, “I saw something shiny by the old oak tree.”',
             'Clover followed the clues. Under the oak, a magpie was guarding a pile of shiny things — and her bell!',
             'Clover didn’t shout. She offered the magpie a shiny pebble instead. The magpie happily swapped, and Clover jingled all the way home.'],
      qs: [ { q: 'Where did Clover find her bell?', a: ['Under the old oak tree', 'In the pond', 'In the farmhouse'], c: 0 },
            { q: 'How did Clover get her bell back?', a: ['She kindly offered a swap', 'She shouted at the magpie', 'She gave up'], c: 0 } ] },
    { id: 'st_seed', title: 'The Seed That Waited', icon: '🌱',
      text: ['Deep in the cold winter soil, a tiny seed waited. “When will it be my turn?” it wondered.',
             'Spring rain soaked the ground. The sun warmed the earth. The seed felt itself swell, and — crack! — a little root pushed down and a green shoot pushed up.',
             'The shoot unfolded two leaves and drank in the sunshine. Day by day it grew taller, until one morning it opened into a bright red tulip.',
             'Being patient, the tulip realised, was its own kind of magic.'],
      qs: [ { q: 'What grew out of the seed first?', a: ['A root', 'A flower', 'A fruit'], c: 0 },
            { q: 'What two things helped the seed start growing?', a: ['Rain and warm sunshine', 'Snow and wind', 'Darkness and ice'], c: 0 } ] },
    { id: 'st_pond', title: 'The Great Pond Clean-Up', icon: '🐸',
      text: ['Freddie the frog was worried. Bottles and cans were floating in his pond, and the fish looked sad.',
             'He asked the farm animals for help. The ducks paddled the litter to the shore. The rabbits hopped it into a basket.',
             'Then the farmer turned the old bottles into flower planters and the cans into a tinkly wind chime.',
             'The pond sparkled again. “That’s the magic of reusing,” croaked Freddie. “Rubbish can become something beautiful!”'],
      qs: [ { q: 'Why was Freddie worried?', a: ['There was litter in his pond', 'He lost his lily pad', 'It was too sunny'], c: 0 },
            { q: 'What were the old bottles turned into?', a: ['Flower planters', 'Boats', 'Bird food'], c: 0 } ] }
  ];

  /* ---------------- MINI-GAME CONTENT ---------------- */
  DF.HABITAT_ROUNDS = [
    { title: 'Match each animal to its home', pairs: [
      { a: '🐧', an: 'Penguin',   b: '❄️', bn: 'Icy Antarctica', why: 'Penguins have thick fat and tightly packed feathers to stay warm on the ice.' },
      { a: '🐪', an: 'Camel',     b: '🏜️', bn: 'Desert',   why: 'Camels can go a long time without drinking, and wide feet stop them sinking in sand.' },
      { a: '🐸', an: 'Frog',      b: '💧', bn: 'Pond',           why: 'Frogs lay their eggs in water, and tadpoles grow up there.' },
      { a: '🐿️', an: 'Squirrel', b: '🌳', bn: 'Woodland', why: 'Squirrels nest in trees and bury nuts to eat later.' },
      { a: '🐠', an: 'Clownfish', b: '🌊', bn: 'Coral Reef',     why: 'Clownfish shelter among sea anemones on warm coral reefs.' },
      { a: '🦒', an: 'Giraffe',   b: '🌾', bn: 'Savanna',        why: 'Giraffes stretch their long necks to eat leaves from tall savanna trees.' },
      { a: '🐻‍❄️', an: 'Polar Bear', b: '🧊', bn: 'Arctic Sea Ice', why: 'Polar bears hunt seals from the Arctic sea ice.' }
    ]},
    { title: 'Match each animal to its food', pairs: [
      { a: '🐄', an: 'Cow',     b: '🌿', bn: 'Grass & hay',     why: 'Cows are herbivores — they eat plants.' },
      { a: '🐝', an: 'Bee',     b: '🌸', bn: 'Nectar & pollen', why: 'Bees drink nectar and collect pollen from flowers.' },
      { a: '🐈', an: 'Cat',     b: '🍖', bn: 'Meat-based food', why: 'Cats are carnivores and need meat to stay healthy.' },
      { a: '🐔', an: 'Chicken', b: '🌾', bn: 'Grain & bugs',    why: 'Chickens are omnivores — seeds, grain and the odd bug!' },
      { a: '🐼', an: 'Panda',   b: '🎋', bn: 'Bamboo',          why: 'Giant pandas eat bamboo for most of the day.' },
      { a: '🐇', an: 'Rabbit',  b: '🌾', bn: 'Mostly hay',      why: 'Hay keeps rabbit teeth and tummies healthy.' }
    ]},
    { title: 'Match each animal to what it needs', pairs: [
      { a: '🐑', an: 'Sheep',   b: '✂️', bn: 'Shearing once a year', why: 'Shearing stops a sheep’s wool from getting too heavy and hot.' },
      { a: '🦆', an: 'Duck',    b: '💦', bn: 'Water to splash in',   why: 'Ducks need water to swim, wash and keep their feathers healthy.' },
      { a: '🐴', an: 'Pony',    b: '🔨', bn: 'Hoof trims',           why: 'A farrier trims pony hooves every few weeks.' },
      { a: '🐕', an: 'Dog',     b: '🦮', bn: 'Daily walks',          why: 'Walks give dogs exercise and lots of interesting smells.' },
      { a: '🐔', an: 'Hen',     b: '🏠', bn: 'A safe coop at night', why: 'A locked coop keeps hens safe from foxes at night.' }
    ]}
  ];

  DF.RIDDLES = [
    { q: 'I have a face full of seeds, and when I’m young I follow the sun. What am I?', a: ['Sunflower', 'Carrot', 'Mushroom'], c: 0, why: 'Young sunflowers track the sun across the sky.' },
    { q: 'I start life in water with a tail, then grow legs and hop away. What am I?', a: ['Frog', 'Fish', 'Duck'], c: 0, why: 'Tadpoles grow legs, lose their tails, and become frogs.' },
    { q: 'I wiggle through soil and make it rich for plants. What am I?', a: ['Earthworm', 'Snail', 'Beetle'], c: 0, why: 'Earthworms tunnel and fertilise the soil.' },
    { q: 'Bees carry me from flower to flower. What am I?', a: ['Pollen', 'Nectar jars', 'Seeds'], c: 0, why: 'Pollen moves between flowers so plants can make seeds.' },
    { q: 'Plants breathe me out and you breathe me in. What am I?', a: ['Oxygen', 'Smoke', 'Carbon dioxide'], c: 0, why: 'During photosynthesis, plants release oxygen.' },
    { q: 'I’m made of billions of droplets and I float in the sky. What am I?', a: ['A cloud', 'A balloon', 'A kite'], c: 0, why: 'Clouds form when water vapour cools into tiny droplets.' },
    { q: 'As a baby I munch leaves; later I sleep in a case and wake with wings. What am I?', a: ['Butterfly', 'Bird', 'Bee'], c: 0, why: 'Caterpillar → chrysalis → butterfly: metamorphosis!' },
    { q: 'Scientists call me a fruit, but I often end up in a salad. I’m red and round. What am I?', a: ['Tomato', 'Radish', 'Beetroot'], c: 0, why: 'Tomatoes grow from flowers and hold seeds, so they’re fruits.' },
    { q: 'I’m made from old peels and leaves, and plants love me. What am I?', a: ['Compost', 'Plastic', 'Sand'], c: 0, why: 'Compost is decomposed plant material — food for soil!' },
    { q: 'I’m green, I live in leaves, and I catch sunlight. What am I?', a: ['Chlorophyll', 'Chocolate', 'Chalk'], c: 0, why: 'Chlorophyll captures light energy for photosynthesis.' }
  ];

  DF.LIFECYCLES = [
    { name: 'a sunflower', steps: ['🫘 Seed', '🌱 Sprout', '🌿 Young plant', '🌻 Flower'] },
    { name: 'a butterfly', steps: ['⚪ Egg', '🐛 Caterpillar', '🪹 Chrysalis', '🦋 Butterfly'] },
    { name: 'a frog',      steps: ['⚫ Frogspawn', '〰️ Tadpole', '🦵 Froglet', '🐸 Frog'] },
    { name: 'an apple',    steps: ['🌸 Blossom', '🐝 Pollination', '🟢 Tiny fruit', '🍎 Ripe apple'] },
    { name: 'rain',        steps: ['☀️ Sun warms water', '💨 Evaporation', '☁️ Clouds form', '🌧️ Rain falls'] }
  ];

  DF.WORDS = [
    { w: 'SEED',     d: 'A tiny package that can grow into a new plant.' },
    { w: 'ROOT',     d: 'The part of a plant that drinks water from the soil.' },
    { w: 'SOIL',     d: 'The earth that plants grow in.' },
    { w: 'PETAL',    d: 'One of the colourful parts of a flower.' },
    { w: 'POLLEN',   d: 'Yellow dust that bees carry between flowers.' },
    { w: 'NECTAR',   d: 'A sweet liquid inside flowers that bees and butterflies drink.' },
    { w: 'SPROUT',   d: 'A young plant that has just started to grow.' },
    { w: 'MEADOW',   d: 'A field full of grass and wildflowers.' },
    { w: 'HARVEST',  d: 'To gather crops when they are ready.' },
    { w: 'COMPOST',  d: 'Rotted plant scraps that make soil rich.' },
    { w: 'HABITAT',  d: 'The natural home of an animal or plant.' },
    { w: 'BLOSSOM',  d: 'A flower on a fruit tree.' },
    { w: 'ORCHARD',  d: 'A garden full of fruit trees.' },
    { w: 'TADPOLE',  d: 'A baby frog that lives in water.' },
    { w: 'CHRYSALIS',d: 'The case a caterpillar rests in while it becomes a butterfly.' },
    { w: 'POLLINATE',d: 'To move pollen so a plant can make seeds.' }
  ];

  DF.MINIGAMES = {
    bee:     { name: 'Bee’s Flower Adventure', icon: '🐝', color: '#fbe39a', desc: 'Help Bumble the bee pollinate the garden.', topic: 'Science' },
    math:    { name: 'Market Math Challenge',       icon: '🪙', color: '#f9d0b6', desc: 'Shop, sell and budget like a pro.',          topic: 'Maths' },
    habitat: { name: 'Animal Habitat Match',        icon: '🌍', color: '#c9e7c9', desc: 'Match animals to their homes, food and needs.', topic: 'Nature' },
    genius:  { name: 'Garden Genius',               icon: '🧠', color: '#dcd0f5', desc: 'Patterns, life cycles and nature riddles.',  topic: 'Logic' },
    words:   { name: 'Word Sprouts',                icon: '🔤', color: '#cfe4f6', desc: 'Grow nature words from scrambled letters.',  topic: 'Words' },
    story:   { name: 'Story Nook',                  icon: '📖', color: '#f6d7e2', desc: 'Cozy little stories to read.',               topic: 'Reading' }
  };
})();
