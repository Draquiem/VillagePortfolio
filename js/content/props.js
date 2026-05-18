// Decorative props scattered around the village. Tile coords (tx, ty)
// — the prop's solid base ends up at the bottom-center of that tile.
// Avoid placing on door zones (in front of each building's door).
export const PROPS = [
  // tree clusters across the top
  { type: "tree", tx: 2,  ty: 2 },
  { type: "tree", tx: 3,  ty: 1 },
  { type: "tree", tx: 13, ty: 2 },
  { type: "tree", tx: 14, ty: 1 },
  { type: "tree", tx: 15, ty: 2 },
  { type: "tree", tx: 22, ty: 2 },
  { type: "tree", tx: 23, ty: 1 },
  { type: "tree", tx: 28, ty: 1 },

  // bottom-corner tree clusters near the flower beds
  { type: "tree", tx: 1, ty: 18 },
  { type: "tree", tx: 3, ty: 19 },
  { type: "tree", tx: 27, ty: 19 },
  { type: "tree", tx: 28, ty: 18 },

  // plaza lighting + benches
  { type: "lamp",  tx: 10, ty: 11 },
  { type: "lamp",  tx: 20, ty: 11 },
  { type: "bench", tx: 11, ty: 11 },
  { type: "bench", tx: 18, ty: 11 },
];
