// The entire world, as data.
//
// Each scene has a `map` (array of equal-length strings, one base-36 char per
// tile — see the legend below and js/world/tiles.js), plus optional `portals`,
// `objects`, and `npcs`, all placed in tile coordinates.
//
//   portals  — kind:"building" warps into an interior on E; kind:"door" warps
//              back ("@back") when stepped on.
//   objects  — furniture/decor. Give one `content` to make it readable on E.
//   npcs     — villagers; readable on E. These are King's real-life easter eggs.
//
// Tile legend (base-36): 0 grass · 1 grass_dark · 2 path · 3 water · 4 flower
//   5 sand · 6 stone · 7 bridge · 8 floor_wood · 9 floor_tile · a rug
//   b wall · c wall_dark · d hedge · e dirt
//
// ─────────────────────────────────────────────────────────────────────────
// CONTENT TODO (King): the five marquee assets below carry your real bio. Every
// other asset and every NPC is a placeholder — search "PLACEHOLDER" / "???" and
// fill in the `content` blocks (and NPC `name`) whenever you're ready.
// ─────────────────────────────────────────────────────────────────────────

// ---- helpers ---------------------------------------------------------------
const placeholder = (title) => ({
  title,
  blocks: [{ type: "text", text: "<em>Placeholder — King will write what's here later.</em>" }],
});
const mystery = (hint) => ({
  title: "??? — a familiar face",
  blocks: [{
    type: "text",
    text: `<em>Easter-egg villager. King will reveal who this is later.${hint ? " (" + hint + ")" : ""}</em>`,
  }],
});

// ---- real content migrated from the old building dialogues ------------------
const ABOUT = {
  title: "About King",
  blocks: [
    { type: "text", text: "I'm <strong>Oudomsak King Phomphakdy</strong>, based in Merced, CA. Laotian and Vietnamese heritage; I speak Thai, Lao, and English." },
    { type: "text", text: "By day I'm <strong>Secretary II to the Executive Director</strong> and <strong>Interim Staff Services Analyst</strong> at the Merced County Department of Workforce Investment — board administration, project coordination, data analysis, and the operational work that keeps workforce-development programs running." },
    { type: "text", text: "Education: BA in Psychology, CSU Stanislaus. The goal: MA in General Psychology (neurocognitive architecture), then a PhD in Quantitative Psychology at UC Merced." },
  ],
};
const PROJECTS = {
  title: "Projects",
  blocks: [
    { type: "list", items: [
      "<strong>Job Quality Index</strong> — Internal DWI tool that ranks local occupations using weighted metrics. Gives workforce decisions a data backbone.",
      "<strong>World Agri-Tech Tour</strong> — Coordinated logistics, partner outreach, and on-the-ground operations.",
      "<strong>MindMeld</strong> — Full-stack flashcard app using the Claude API, active-recall scheduling, and a gamified economy.",
      "<strong>Automated Options Trading Bot</strong> — Alpaca API, DCA Martingale strategy, with ChatGPT sentiment integration.",
    ] },
    { type: "link", href: "https://github.com/draquiem", text: "github.com/draquiem ↗" },
  ],
};
const GOALS = {
  title: "Background & Goals",
  blocks: [
    { type: "text", text: "<strong>Short-term:</strong> Transition fully into a Staff Services Analyst role at DWI." },
    { type: "text", text: "<strong>Long-term:</strong> MA in General Psychology (focus: neurocognitive architecture), then a PhD in Quantitative Psychology at UC Merced." },
    { type: "text", text: "<strong>End goal:</strong> Build data-backed workforce solutions in public service, grounded in quantitative psychology." },
    { type: "text", text: "<strong>Tech:</strong> Python · SQL · Full-stack web · LLM API integration · Microsoft Suite" },
    { type: "link", href: "#resume", text: "Open the plain résumé view ↗" },
  ],
};
const CONTACT = {
  title: "Contact",
  blocks: [
    { type: "text", text: "Fastest way to reach me is through GitHub. Happy to talk workforce data, public-service tech, MMORPGs, or quantitative psychology." },
    { type: "link", href: "https://github.com/draquiem", text: "github.com/draquiem ↗" },
  ],
};
const HOBBIES = {
  title: "Outside of work",
  blocks: [
    { type: "list", items: [
      "<strong>Gaming:</strong> Big MMORPG fan — currently in Elder Scrolls Online.",
      "<strong>Fitness:</strong> Weightlifting and tennis after work most weekdays.",
      "<strong>Creative:</strong> Drawing and music.",
      "<strong>Travel:</strong> Visited Laos in December 2025 to meet blood relatives with my mom for the first time.",
    ] },
  ],
};
const WELCOME = {
  title: "Welcome to King's Village",
  blocks: [
    { type: "text", text: "Walk with <strong>WASD</strong> or the <strong>arrow keys</strong> — tap to turn, hold to walk." },
    { type: "text", text: "Press <strong>E</strong> in front of a building to step inside. Inside, press <strong>E</strong> on objects and villagers to read about them. Walk onto the <strong>EXIT</strong> mat to leave." },
    { type: "text", text: "Five buildings to explore — and a few familiar faces hidden around town." },
  ],
};

// ---- a reusable interior shell (11×9, doorway at the bottom-center) ---------
const woodRoom = [
  "ccccccccccc",
  "b888888888b",
  "b888888888b",
  "b888888888b",
  "b888aaa888b",
  "b888aaa888b",
  "b888888888b",
  "b888888888b",
  "bbbbb8bbbbb",
];
const tileRoom = [
  "ccccccccccc",
  "b999999999b",
  "b999999999b",
  "b999999999b",
  "b999999999b",
  "b999999999b",
  "b999999999b",
  "b999999999b",
  "bbbbb9bbbbb",
];
const INTERIOR_SPAWN = { entry: { tx: 5, ty: 7, facing: "up" } };
const EXIT_DOOR = { kind: "door", tx: 5, ty: 8, to: "@back" };

export const SCENES = {
  // ════════════════════════ OVERWORLD ════════════════════════
  village: {
    id: "village",
    name: "King's Village",
    bg: "#3d7d2c",
    spawns: { default: { tx: 13, ty: 11, facing: "up" } },
    map: [
      "dddddddddddddddddddddddddddddd", //  0
      "d0000000000000000000000000000d", //  1
      "d0000000000000000000000000000d", //  2
      "d0000000000000000000000000000d", //  3  Home(4-6) · Workshop(23-25)
      "d0000000000000000000000000000d", //  4
      "d0000200000000220000000020000d", //  5  door tiles + center
      "d0000222222222222222222220000d", //  6  front walkway (Home/Workshop)
      "d0000000200000220000020000000d", //  7
      "d0000000200000000000020000000d", //  8  Garden(13-16)
      "d0000000200666666660020000000d", //  9  plaza
      "d0000000200666666660020000000d", // 10  Garden door (15,10)
      "d0000222222666666662222220000d", // 11  plaza approaches
      "d0000000200666666660020000000d", // 12
      "d0000000200000220000020000000d", // 13  Library(4-6) · Post(23-25)
      "d0000000200000220000020000000d", // 14
      "d0000222222222222222222220000d", // 15  front walkway (Library/Post)
      "d0333330000000220000000044400d", // 16  pond + flower bed
      "d0333330000000220000000000000d", // 17
      "d0333330000000000000000000000d", // 18
      "dddddddddddddddddddddddddddddd", // 19
    ],
    portals: [
      { kind: "building", id: "home",     spriteKey: "home",     label: "Home",        tx: 4,  ty: 3,  w: 3, h: 2, to: "home" },
      { kind: "building", id: "workshop", spriteKey: "workshop", label: "Workshop",    tx: 23, ty: 3,  w: 3, h: 2, to: "workshop" },
      { kind: "building", id: "library",  spriteKey: "library",  label: "Library",     tx: 4,  ty: 13, w: 3, h: 2, to: "library" },
      { kind: "building", id: "post",     spriteKey: "post",     label: "Post Office", tx: 23, ty: 13, w: 3, h: 2, to: "post" },
      { kind: "building", id: "garden",   spriteKey: "garden",   label: "Garden",      tx: 13, ty: 8,  w: 4, h: 2, to: "garden" },
    ],
    objects: [
      { type: "sign", tx: 12, ty: 7, name: "the village sign", content: WELCOME },
      { type: "fountain", tx: 14, ty: 11 },
      // framing trees
      { type: "tree", tx: 2, ty: 2 }, { type: "tree", tx: 3, ty: 3 },
      { type: "tree", tx: 27, ty: 2 }, { type: "tree", tx: 26, ty: 3 },
      { type: "tree", tx: 2, ty: 8 }, { type: "tree", tx: 27, ty: 8 },
      { type: "tree", tx: 2, ty: 12 }, { type: "tree", tx: 27, ty: 12 },
      // bushes
      { type: "bush", tx: 10, ty: 3 }, { type: "bush", tx: 19, ty: 3 },
      { type: "bush", tx: 10, ty: 7 }, { type: "bush", tx: 19, ty: 7 },
      // plaza lamps + benches
      { type: "lamp", tx: 11, ty: 9 }, { type: "lamp", tx: 18, ty: 9 },
      { type: "lamp", tx: 11, ty: 12 }, { type: "lamp", tx: 18, ty: 12 },
      { type: "bench", tx: 13, ty: 9 }, { type: "bench", tx: 16, ty: 9 },
      // flowerpots by the doors
      { type: "flowerpot", tx: 4, ty: 5 }, { type: "flowerpot", tx: 25, ty: 5 },
      { type: "flowerpot", tx: 4, ty: 15 }, { type: "flowerpot", tx: 25, ty: 15 },
    ],
    npcs: [
      { tx: 20, ty: 7, facing: "down", palette: { shirt: "#e53170" }, content: mystery("by the workshop") },
      { tx: 10, ty: 13, facing: "down", palette: { shirt: "#2cb67d" }, content: mystery("near the library") },
      { tx: 17, ty: 12, facing: "down", palette: { shirt: "#ffd23f", hair: "#3a2a1a" }, content: mystery("at the plaza") },
    ],
  },

  // ════════════════════════ INTERIORS ════════════════════════
  home: {
    id: "home", name: "Home", bg: "#1a1012",
    spawns: INTERIOR_SPAWN, map: woodRoom,
    portals: [EXIT_DOOR],
    objects: [
      { type: "painting", tx: 5, ty: 1, name: "the photo wall", content: ABOUT }, // ← real bio
      { type: "bed", tx: 2, ty: 1, name: "the bed", content: placeholder("The bed") },
      { type: "bookshelf", tx: 8, ty: 1, name: "the bookshelf", content: placeholder("Bookshelf") },
      { type: "plant", tx: 2, ty: 6 },
      { type: "desk", tx: 8, ty: 6, name: "the desk", content: placeholder("The desk") },
    ],
    npcs: [
      { tx: 8, ty: 4, facing: "left", palette: { shirt: "#f25f4c" }, content: mystery("at home") },
    ],
  },

  workshop: {
    id: "workshop", name: "Workshop", bg: "#15110a",
    spawns: INTERIOR_SPAWN, map: woodRoom,
    portals: [EXIT_DOOR],
    objects: [
      { type: "computer", tx: 5, ty: 1, name: "the workstation", content: PROJECTS }, // ← real bio
      { type: "desk", tx: 3, ty: 1, name: "the workbench", content: placeholder("Workbench") },
      { type: "crate", tx: 8, ty: 1, name: "the crate", content: placeholder("Crate") },
      { type: "trophy", tx: 2, ty: 6, name: "the trophy", content: placeholder("Trophy") },
      { type: "bookshelf", tx: 8, ty: 6, name: "the manuals", content: placeholder("Manuals") },
    ],
    npcs: [
      { tx: 8, ty: 4, facing: "left", palette: { shirt: "#ff8906" }, content: mystery("in the workshop") },
    ],
  },

  library: {
    id: "library", name: "Library", bg: "#0f0e17",
    spawns: INTERIOR_SPAWN, map: tileRoom,
    portals: [EXIT_DOOR],
    objects: [
      { type: "bookshelf", tx: 4, ty: 1, name: "the records", content: GOALS }, // ← real bio
      { type: "bookshelf", tx: 2, ty: 1, name: "a bookshelf", content: placeholder("Bookshelf") },
      { type: "bookshelf", tx: 6, ty: 1, name: "a bookshelf", content: placeholder("Bookshelf") },
      { type: "bookshelf", tx: 8, ty: 1, name: "a bookshelf", content: placeholder("Bookshelf") },
      { type: "table", tx: 4, ty: 4, name: "the reading table", content: placeholder("Reading table") },
      { type: "chair", tx: 4, ty: 5 },
      { type: "plant", tx: 2, ty: 6 },
      { type: "plant", tx: 8, ty: 6 },
    ],
    npcs: [
      { tx: 7, ty: 5, facing: "down", palette: { shirt: "#7f5af0" }, content: mystery("the librarian") },
    ],
  },

  post: {
    id: "post", name: "Post Office", bg: "#0d130f",
    spawns: INTERIOR_SPAWN, map: tileRoom,
    portals: [EXIT_DOOR],
    objects: [
      { type: "mailbox", tx: 8, ty: 1, name: "the mailbox", content: CONTACT }, // ← real bio
      { type: "counter", tx: 3, ty: 4, name: "the counter", content: placeholder("Counter") },
      { type: "counter", tx: 4, ty: 4 },
      { type: "counter", tx: 6, ty: 4 },
      { type: "counter", tx: 7, ty: 4 },
      { type: "crate", tx: 2, ty: 1, name: "a parcel", content: placeholder("Parcel") },
      { type: "crate", tx: 2, ty: 6 },
      { type: "crate", tx: 8, ty: 6 },
    ],
    npcs: [
      { tx: 5, ty: 2, facing: "down", palette: { shirt: "#2cb67d" }, content: mystery("the postmaster") },
    ],
  },

  garden: {
    id: "garden", name: "Garden", bg: "#274d18",
    spawns: INTERIOR_SPAWN,
    map: [
      "ddddddddddd",
      "d000000000d",
      "d040000040d",
      "d000000000d",
      "d000000000d",
      "d000000000d",
      "d040000040d",
      "d000000000d",
      "ddddd0ddddd",
    ],
    portals: [EXIT_DOOR],
    objects: [
      { type: "sign", tx: 5, ty: 1, name: "the notice board", content: HOBBIES }, // ← real bio
      { type: "fountain", tx: 5, ty: 4 },
      { type: "flowerpot", tx: 2, ty: 1 }, { type: "flowerpot", tx: 8, ty: 1 },
      { type: "flowerpot", tx: 2, ty: 6 }, { type: "flowerpot", tx: 8, ty: 6 },
      { type: "bench", tx: 3, ty: 4 }, { type: "bench", tx: 7, ty: 4 },
      { type: "bush", tx: 2, ty: 3 }, { type: "bush", tx: 8, ty: 3 },
    ],
    npcs: [
      { tx: 8, ty: 5, facing: "left", palette: { shirt: "#f25f4c", hair: "#1a1a1a" }, content: mystery("in the garden") },
    ],
  },
};
