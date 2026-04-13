// ============================================================
// COSTUME DATA — pure, testable in Node
// ============================================================

const COSTUMES = [
  // Day 1 – Nature Forest: leaf crown
  `<path d="M34,20 Q50,5 66,20" stroke="#4CAF50" stroke-width="3" fill="none" stroke-linecap="round"/>
   <ellipse cx="50" cy="14" rx="7" ry="10" fill="#4CAF50"/>
   <ellipse cx="38" cy="17" rx="6" ry="9" fill="#66BB6A" transform="rotate(-20 38 17)"/>
   <ellipse cx="62" cy="17" rx="6" ry="9" fill="#66BB6A" transform="rotate(20 62 17)"/>`,

  // Day 2 – Safari Animals: safari hat
  `<ellipse cx="50" cy="16" rx="28" ry="5" fill="#8B6914"/>
   <ellipse cx="50" cy="13" rx="18" ry="9" fill="#A0792A"/>
   <ellipse cx="50" cy="8" rx="12" ry="5" fill="#C49A3C"/>`,

  // Day 3 – Ocean Friends: snorkel mask
  `<rect x="30" y="35" width="40" height="18" rx="8" fill="#1e90ff" opacity="0.7"/>
   <rect x="30" y="35" width="40" height="18" rx="8" fill="none" stroke="#0060b0" stroke-width="2"/>
   <circle cx="65" cy="10" r="4" fill="#1e90ff" stroke="#0060b0" stroke-width="1.5"/>
   <line x1="65" y1="14" x2="65" y2="28" stroke="#0060b0" stroke-width="2"/>`,

  // Day 4 – Dinosaur Land: dino spikes
  `<polygon points="35,18 38,5 41,18" fill="#4CAF50"/>
   <polygon points="44,16 48,2 52,16" fill="#66BB6A"/>
   <polygon points="55,18 58,5 61,18" fill="#4CAF50"/>
   <polygon points="64,18 67,8 70,18" fill="#66BB6A"/>`,

  // Day 5 – Splash Coast: sun hat
  `<ellipse cx="50" cy="16" rx="32" ry="6" fill="#FFD700"/>
   <ellipse cx="50" cy="12" rx="20" ry="10" fill="#FFC200"/>
   <ellipse cx="50" cy="6" rx="14" ry="6" fill="#FFB700"/>`,

  // Day 6 – Sky Aircraft: pilot goggles
  `<rect x="28" y="36" width="44" height="14" rx="6" fill="#6B3A1F"/>
   <circle cx="40" cy="43" r="8" fill="#87CEEB" stroke="#4A2810" stroke-width="2"/>
   <circle cx="60" cy="43" r="8" fill="#87CEEB" stroke="#4A2810" stroke-width="2"/>
   <line x1="48" y1="43" x2="52" y2="43" stroke="#4A2810" stroke-width="2"/>`,

  // Day 7 – Jungle Adventure: banana leaf
  `<path d="M22,24 Q50,2 78,18 Q60,12 50,15 Q40,12 22,24Z" fill="#90EE90"/>
   <path d="M50,15 L50,30" stroke="#228B22" stroke-width="1.5"/>`,

  // Day 8 – Farm Day: straw hat
  `<ellipse cx="50" cy="16" rx="30" ry="6" fill="#D4A44C"/>
   <ellipse cx="50" cy="12" rx="20" ry="10" fill="#C49030"/>
   <ellipse cx="50" cy="7" rx="13" ry="6" fill="#E0B870"/>`,

  // Day 9 – Arctic Animals: earmuffs
  `<circle cx="18" cy="46" r="10" fill="#4DC8E8"/>
   <circle cx="82" cy="46" r="10" fill="#4DC8E8"/>
   <path d="M18,40 Q50,30 82,40" stroke="#4DC8E8" stroke-width="5" fill="none"/>
   <circle cx="18" cy="46" r="6" fill="#87E0F5"/>
   <circle cx="82" cy="46" r="6" fill="#87E0F5"/>`,

  // Day 10 – Puzzle Planet: puzzle-piece hat
  `<rect x="36" y="6" width="28" height="20" rx="3" fill="#FF8C42"/>
   <circle cx="50" cy="6" r="5" fill="#FF8C42"/>
   <rect x="56" y="13" width="8" height="8" rx="2" fill="#FFB347"/>
   <rect x="44" y="24" width="12" height="4" rx="1" fill="#E67320"/>`,

  // Day 11 – Castle Quest: crown
  `<polygon points="30,24 30,8 38,16 50,4 62,16 70,8 70,24" fill="#FFD700" stroke="#DAA520" stroke-width="1.5"/>
   <circle cx="50" cy="10" r="4" fill="#FF4040"/>
   <circle cx="38" cy="17" r="3" fill="#4169E1"/>
   <circle cx="62" cy="17" r="3" fill="#4169E1"/>`,

  // Day 12 – Robot Lab: antenna
  `<line x1="50" y1="14" x2="50" y2="4" stroke="#888" stroke-width="3"/>
   <circle cx="50" cy="2" r="4" fill="#FF4040"/>
   <rect x="30" y="12" width="40" height="10" rx="3" fill="#9EA7B0" stroke="#666" stroke-width="1"/>`,

  // Day 13 – Pirate Bay: pirate hat
  `<ellipse cx="50" cy="19" rx="30" ry="6" fill="#1a1a1a"/>
   <path d="M30,19 L36,4 L50,10 L64,4 L70,19 Z" fill="#1a1a1a"/>
   <circle cx="50" cy="13" r="5" fill="white"/>
   <path d="M46,11 L54,15 M54,11 L46,15" stroke="#1a1a1a" stroke-width="1.5"/>`,

  // Day 14 – Superhero City: eye mask
  `<rect x="26" y="36" width="48" height="13" rx="6" fill="#CC0000"/>
   <ellipse cx="40" cy="42" r="7" fill="#CC0000"/>
   <ellipse cx="60" cy="42" r="7" fill="#CC0000"/>
   <ellipse cx="40" cy="42" r="4" fill="white"/>
   <ellipse cx="60" cy="42" r="4" fill="white"/>`,

  // Day 15 – Math Champions: trophy hat
  `<ellipse cx="50" cy="18" rx="22" ry="5" fill="#FFD700"/>
   <path d="M30,10 L32,20 Q50,26 68,20 L70,10 Q60,16 50,14 Q40,16 30,10Z" fill="#FFD700" stroke="#DAA520" stroke-width="1"/>
   <text x="50" y="17" text-anchor="middle" font-size="9" fill="#7B4A00" font-weight="bold">★</text>`,
];

export const getCostumeSVG = (day) => COSTUMES[day - 1] ?? COSTUMES[0];

// ============================================================
// DOM API — implemented in Task 6
// ============================================================
export const createMascot = (_day) => ({ react: () => {}, celebrate: () => {} });
