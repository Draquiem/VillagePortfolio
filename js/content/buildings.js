// Village inhabitants. Each entry seeds one interactable building.
// Edit text here to change what each building reveals.
import { TILE } from "../world/tiles.js";

const T = TILE;

export const BUILDINGS = [
  {
    id: "home",
    label: "Home",
    x: 4 * T, y: 3 * T, w: 3 * T, h: 2 * T,
    doorSide: "down",
    content: {
      title: "Home — About King",
      blocks: [
        { type: "text", text: "I'm <strong>Oudomsak King Phomphakdy</strong>, based in Merced, CA. Laotian and Vietnamese heritage; I speak Thai, Lao, and English." },
        { type: "text", text: "By day I'm <strong>Secretary II to the Executive Director</strong> and <strong>Interim Staff Services Analyst</strong> at the Merced County Department of Workforce Investment. I handle board administration, project coordination, data analysis, and the operational stuff that keeps workforce-development programs running." },
        { type: "text", text: "My education is a BA in Psychology from CSU Stanislaus. The goal: MA in General Psychology (neurocognitive architecture) and a PhD in Quantitative Psychology at UC Merced." },
      ],
    },
  },
  {
    id: "workshop",
    label: "Workshop",
    x: 22 * T, y: 3 * T, w: 3 * T, h: 2 * T,
    doorSide: "down",
    content: {
      title: "Workshop — Projects",
      blocks: [
        { type: "list", items: [
          "<strong>Job Quality Index</strong> — Internal DWI tool that ranks local occupations using weighted metrics. Built to give workforce decisions a data backbone.",
          "<strong>World Agri-Tech Tour</strong> — Coordinated logistics, partner outreach, and on-the-ground operations.",
          "<strong>MindMeld</strong> — Full-stack flashcard app using the Claude API, active-recall scheduling, and a gamified economy.",
          "<strong>Automated Options Trading Bot</strong> — Alpaca API, DCA Martingale strategy, with ChatGPT sentiment integration.",
        ]},
        { type: "link", href: "https://github.com/draquiem", text: "github.com/draquiem ↗" },
      ],
    },
  },
  {
    id: "library",
    label: "Library",
    x: 4 * T, y: 13 * T, w: 3 * T, h: 2 * T,
    doorSide: "down",
    content: {
      title: "Library — Background & Goals",
      blocks: [
        { type: "text", text: "<strong>Short-term:</strong> Transition fully into a Staff Services Analyst role at DWI." },
        { type: "text", text: "<strong>Long-term:</strong> MA in General Psychology (focus: neurocognitive architecture), then a PhD in Quantitative Psychology at UC Merced." },
        { type: "text", text: "<strong>End goal:</strong> Build data-backed workforce solutions in public service, grounded in quantitative psychology." },
        { type: "text", text: "<strong>Tech:</strong> Python · SQL · Full-stack web · LLM API integration · Microsoft Suite" },
        { type: "link", href: "#resume", text: "Open the plain résumé view ↗" },
      ],
    },
  },
  {
    id: "post",
    label: "Post Office",
    x: 22 * T, y: 13 * T, w: 3 * T, h: 2 * T,
    doorSide: "down",
    content: {
      title: "Post Office — Contact",
      blocks: [
        { type: "text", text: "The fastest way to reach me is through GitHub. I'm happy to talk about workforce data, public-service tech, MMORPGs, or quantitative psychology." },
        { type: "link", href: "https://github.com/draquiem", text: "github.com/draquiem ↗" },
      ],
    },
  },
  {
    id: "garden",
    label: "Garden",
    x: 13 * T, y: 8 * T, w: 4 * T, h: 2 * T,
    doorSide: "down",
    content: {
      title: "Garden — Outside of work",
      blocks: [
        { type: "list", items: [
          "<strong>Gaming:</strong> Big MMORPG fan — currently in Elder Scrolls Online.",
          "<strong>Fitness:</strong> Weightlifting and tennis after work most weekdays.",
          "<strong>Creative:</strong> Drawing and music.",
          "<strong>Travel:</strong> Visited Laos in December 2025 to meet blood relatives with my mom for the first time.",
        ]},
      ],
    },
  },
];
