(function () {
  const TOTAL_DAYS = 15;
  const STORAGE_KEY = "g2-math-progress-v2";
  const ENCOURAGEMENTS = [
    "Great job! Keep going!",
    "You're getting stronger!",
    "Math power activated!",
    "You're doing amazing!",
    "Super focus! Nice work!",
    "Every step makes you smarter!"
  ];

  const categoryOrder = ["Easy", "Intermediate", "Pattern Recognition", "Hard", "Problem Solving"];
  const themes = [
    { name: "Nature Forest", icon: "🌤️", className: "theme-day-01" },
    { name: "Safari Animals", icon: "🦁", className: "theme-day-02" },
    { name: "Ocean Friends", icon: "🐠", className: "theme-day-03" },
    { name: "Dinosaur Land", icon: "🦕", className: "theme-day-04" },
    { name: "Splash Coast", icon: "🌊", className: "theme-day-05" },
    { name: "Sky Aircraft", icon: "✈️", className: "theme-day-06" },
    { name: "Jungle Adventure", icon: "🐒", className: "theme-day-07" },
    { name: "Farm Day", icon: "🚜", className: "theme-day-08" },
    { name: "Arctic Animals", icon: "🐧", className: "theme-day-09" },
    { name: "Puzzle Planet", icon: "🧩", className: "theme-day-10" },
    { name: "Castle Quest", icon: "🏰", className: "theme-day-11" },
    { name: "Robot Lab", icon: "🤖", className: "theme-day-12" },
    { name: "Pirate Bay", icon: "🏴‍☠️", className: "theme-day-13" },
    { name: "Superhero City", icon: "🦸", className: "theme-day-14" },
    { name: "Math Champions", icon: "🏆", className: "theme-day-15" }
  ];

  const inspiration = [
    "Tiny steps every day build giant math powers.",
    "Milo solved one puzzle before breakfast and said, 'My brain did a happy jump!'",
    "Mistakes are clues that help us find smarter answers.",
    "A dinosaur counted 3 leaves, then 3 more, and roared, 'I can multiply!'",
    "Curious kids become clever problem solvers.",
    "A pilot practiced numbers daily and could map every cloud route.",
    "When learning feels hard, your brain is growing strong.",
    "On the farm, Mia grouped eggs in rows and found patterns everywhere.",
    "Be brave enough to try, and smart enough to try again.",
    "Kai solved a puzzle and shouted, 'Math mission complete!'",
    "Practice turns 'I can't yet' into 'I can now.'",
    "A robot kept testing ideas until the right answer beeped.",
    "Think, test, and explore—math is an adventure.",
    "A superhero used place value to save the day.",
    "Your effort is your superpower."
  ];

  function loadProgress() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"doneDays":[],"soundOn":false}') || { doneDays: [], soundOn: false };
    } catch (_) {
      return { doneDays: [], soundOn: false };
    }
  }
  function saveProgress(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function seq(start, step, len) {
    return Array.from({ length: len }, (_, i) => start + step * i).join(", ") + ", ...";
  }
  function phase(day) {
    if (day <= 3) return 1;
    if (day <= 6) return 2;
    if (day <= 9) return 3;
    if (day <= 12) return 4;
    return 5;
  }
  function easy(day, session) {
    const n = day * 2 + session;
    if (phase(day) === 1) return [`${8+n} + ${5+session}`,`${17+n} - ${6+session}`,`${9+session} + ${9+day}`,`${20+n} - ${7+session}`,`${2+session} × ${3+(day%3)}`];
    if (phase(day) === 2) return [`${23+n} + ${14+session}`,`${56+n} - ${18+session}`,`${4+(day%4)} × ${6+session}`,`${31+n} + ${27+session}`,`${72+n} - ${26+session}`];
    if (phase(day) === 3) return [`${12+n} × ${3+session}`,`${145+n} - ${18+session}`,`${36+n} + ${27+session}`,`Write the value of the digit 6 in ${160+day*7}`,`${220+n} - ${90+session}`];
    if (phase(day) === 4) return [`${14+n} × ${11+session}`,`${32+n} × ${4+session}`,`Use partial products: (${20+n} + ${3+session}) × ${5+session}`,`${240+n} - ${85+session}`,`What is 9 groups of ${12+n}?`];
    return [`${120+n} × ${12+session}`,`${230+n} × ${11+session}`,`${340+n} - ${170+session}`,`Round ${670+n} to the nearest hundred.`,`${70+n} × ${13+session}`];
  }
  function intermediate(day, session) {
    const n = day + session;
    if (phase(day) === 1) return [`${14+n} + ${18+day}`,`${37+n} - ${19+session}`,`${5+session} × ${4+(day%2)}`,`${22+n} + ${29+day}`,`${60+n} - ${24+session}`];
    if (phase(day) === 2) return [`${46+n} + ${37+day}`,`${95+n} - ${48+session}`,`${7+session} × ${8+(day%2)}`,`${58+n} + ${26+day}`,`${84+n} - ${39+session}`];
    if (phase(day) === 3) return [`${23+n} × ${4+session}`,`${132+n} × ${3+session}`,`Break apart ${48+n} × ${5+session} into tens and ones.`,`What number is 300 more than ${245+n}?`,`${407+n} - ${129+session}`];
    if (phase(day) === 4) return [`${24+n} × ${13+session}`,`${35+n} × ${12+session}`,`Use distributive property: (${30+n} + 6) × ${7+session}`,`${620+n} - ${287+session}`,`Find the missing factor: ${144+n*2} = ${12+session} × ?`];
    return [`${214+n} × ${23+session}`,`${305+n} × ${14+session}`,`${432+n} + ${289+day}`,`Estimate ${398+n} × ${21+session} by rounding both numbers.`,`${705+n} - ${268+session}`];
  }
  function pattern(day, session) {
    const n = day + session;
    const stage = phase(day);
    if (stage === 1) return [
      `Number pattern: ${seq(2+n,2,4)} What comes next?`,
      `Shape pattern: ▲ ■ ▲ ■ ${day%2===0?"▲":"■"} __`,
      `Skip count by 5: ${seq(5+5*session,5,4)} What is next?`,
      `Odd or even pattern: ${3+n}, ${4+n}, ${5+n}, ${6+n}, ${7+n}, __. Is the next number odd or even?`,
      `Object groups: ${"🍎".repeat(2+session)} | ${"🍎".repeat(3+session)} | ${"🍎".repeat(4+session)} | __`
    ];
    if (stage === 2) return [
      `Doubling pattern: ${3+n}, ${6+n*2}, ${12+n*4}, __`,
      `Direction pattern: up, down, up, down, ${day%2===0?"__":"up, __"}`,
      `Shape logic: ● ● ▲ | ● ● ▲ | ● ● ${day%2===0?"__":"▲"}`,
      `Even numbers only: ${seq(10+n,2,4)} What comes next?`,
      `Size pattern: small, medium, large, small, medium, ${session===0?"__":"large"}`
    ];
    if (stage === 3) return [
      `Array pattern: ${2+session}×3, ${3+session}×3, ${4+session}×3, ${5+session}×3, __`,
      `Place-value pattern: ${120+n}, ${130+n}, ${140+n}, ${150+n}, __`,
      `Missing number pattern: __, ${24+n}, ${36+n}, ${48+n}, ${60+n}`,
      `Mirror pattern: ${session===0?"◀ ▶ ◀ ▶ ◀ __":"▲ ▼ ▲ ▼ ▲ __"}`,
      `Grouped objects: (●●) (●●●●) (●●●●●●) __`
    ];
    if (stage === 4) return [
      `Scaling pattern: ${6+n}, ${12+n*2}, ${24+n*4}, ${48+n*8}, __`,
      `Rotation pattern: ↑, →, ↓, ←, ↑, __`,
      `Symmetry check: Which has a line of symmetry? (A) ${session===0?"▲":"◆"} (B) ▶ (C) ${session===0?"■":"L-shape"}`,
      `Multiplication pattern: ${15+n}, ${30+n*2}, ${45+n*3}, ${60+n*4}, __`,
      `Place-value jump: ${205+n}, ${305+n}, ${405+n}, ${505+n}, __`
    ];
    return [
      `Advanced number pattern: ${7+n}, ${(7+n)*2}, ${(7+n)*4}, ${(7+n)*8}, __`,
      `Shape progression: ▲, ▲▲, ▲▲▲, ▲▲▲▲, __`,
      `Logic sequence: 2×3, 3×4, 4×5, 5×6, __`,
      `Multiplication scaling: ${25+n}, ${(25+n)*2}, ${(25+n)*4}, ${(25+n)*8}, __`,
      `Place-value + multiplication pattern: 111, 222, 444, 888, __`
    ];
  }
  function hard(day, session) {
    const n = day + session;
    if (phase(day) === 1) return [`${29+n} + ${34+day}`,`${81+n} - ${46+session}`,`${6+session} × ${7+(day%2)}`,`${43+n} + ${38+day}`,`${90+n} - ${37+session}`];
    if (phase(day) === 2) return [`${68+n} + ${47+day}`,`${122+n} - ${59+session}`,`${9+session} × ${7+(day%3)}`,`${85+n} - ${46+session}`,`${57+n} + ${58+day}`];
    if (phase(day) === 3) return [`${47+n} × ${6+session}`,`${238+n} × ${3+session}`,`${315+n} - ${147+session}`,`Find 4 × (${30+n} + ${8+session})`,`Write ${604+n} in expanded form.`];
    if (phase(day) === 4) return [`${46+n} × ${17+session}`,`${58+n} × ${16+session}`,`Use partial products for ${39+n} × ${14+session}`,`${804+n} - ${397+session}`,`If ${27+n} × ? = ${(27+n)*(9+session)}, what is ?`];
    if (day === 13) return [`124 × 23 (stretch)`,`${318+session} × 24`,`${452+session} × 31`,`${607+session} - 289`,`${215+session} × 42 (stretch)`];
    if (day === 14) return [`${426+session} × 35`,`${539+session} × 27`,`215 × 42 (stretch)`,`${782+session} - 468`,`${643+session} × 18`];
    return [`547 × 918 (stretch)`,`${732+session} × 46`,`${689+session} × 32`,`${950+session} - 487`,`${804+session} × 25`];
  }
  function problemSolving(day, session) {
    const n = day + session;
    if (phase(day) === 1) return [
      `Mia has ${8+n} apples. She gets ${6+day} more. How many apples now?`,
      `A shelf has ${19+n} books. ${7+session} are borrowed. How many are left?`,
      `There are ${3+session} bags with ${4+day} marbles in each bag. How many marbles?`,
      `Sam had ${15+n} stickers and gave away ${5+session}. How many stickers remain?`,
      `A class makes ${2+session} rows with ${5+day} chairs in each row. How many chairs?`
    ];
    if (phase(day) === 2) return [
      `There are ${6+session} boxes. Each box has ${7+day} crayons. How many crayons total?`,
      `Liam buys ${4+session} packs of balloons with ${8+day} balloons each. How many balloons?`,
      `A toy store had ${84+n} toys. It sold ${29+session}. How many toys are left?`,
      `Nora puts ${5+session} pencils in each of ${9+day} cups. How many pencils?`,
      `A library gets ${37+n} new books in the morning and ${26+day} in the afternoon. How many new books?`
    ];
    if (phase(day) === 3) return [
      `A farmer packs ${24+n} oranges in each crate. He fills ${3+session} crates. How many oranges?`,
      `There are ${132+n} stickers. ${4+session} children share them equally. How many per child?`,
      `A school buys ${16+n} boxes of pencils. Each box has ${9+session} pencils. How many pencils?`,
      `Ben reads ${28+n} pages each day for ${3+session} days. How many pages in all?`,
      `A bus has ${245+n} seats. ${127+session} are filled. How many empty seats?`
    ];
    if (phase(day) === 4) return [
      `A shop has ${18+n} shelves. Each shelf has ${14+session} books. How many books total?`,
      `Each table has ${12+session} chairs. There are ${23+n} tables. How many chairs?`,
      `A school ordered ${34+n} packs of paper. Each pack has ${25+session} sheets. How many sheets?`,
      `Tia had ${640+n} stickers. She gave ${285+session} away and then got 120 more. How many now?`,
      `A game store sold ${27+n} toy cars each day for ${6+session} days. How many toy cars?`
    ];
    if (day === 13) return [
      `A factory packs 124 pencils in each box and makes 23 boxes. How many pencils?`,
      `A reading club has 215 students. Each gets 42 stickers. How many stickers are needed?`,
      `A truck carries ${326+session} boxes. Each box has 28 books. How many books?`,
      `A shop had 980 balloons. It sold 365 in the morning and 214 in the afternoon. How many left?`,
      `A garden has 36 rows with 27 plants in each row. How many plants total?`
    ];
    if (day === 14) return [
      `A school buys ${248+session} notebooks for each of 32 classes. How many notebooks?`,
      `A farmer packs 215 apples in each crate and sends 42 crates. How many apples?`,
      `A toy company made ${407+session} robots each week for 24 weeks. How many robots?`,
      `A hall has 1,200 chairs. 468 are used in one event and 327 in another. How many chairs stay empty?`,
      `A bakery uses 38 trays with 26 cookies on each tray. How many cookies?`
    ];
    return [
      `A giant warehouse ships 547 boxes each day for 918 days (stretch). How many boxes?`,
      `A school has ${352+session} students. Each needs 24 pencils. How many pencils?`,
      `A library stacks ${418+session} books on each of 36 shelves. How many books?`,
      `A theater sold 2,000 tickets. 785 were sold on Friday and 649 on Saturday. How many are left?`,
      `A toy fair has 125 booths. Each booth sells 43 toys. How many toys in all?`
    ];
  }

  function dayData(day) {
    return {
      day,
      theme: themes[day - 1],
      note: day <= 3 ? "Addition/Subtraction review + first multiplication ideas" :
            day <= 6 ? "2-digit operations + stronger multiplication facts" :
            day <= 9 ? "2-digit and 3-digit by 1-digit + place value" :
            day <= 12 ? "2-digit by 2-digit with distributive thinking" :
                        "3-digit by 2-digit and stretch 3-digit by 3-digit",
      sessions: {
        morning: {
          name: "Morning Session",
          categories: {
            "Easy": easy(day, 0),
            "Intermediate": intermediate(day, 0),
            "Pattern Recognition": pattern(day, 0),
            "Hard": hard(day, 0),
            "Problem Solving": problemSolving(day, 0)
          }
        },
        afternoon: {
          name: "Afternoon Session",
          categories: {
            "Easy": easy(day, 1),
            "Intermediate": intermediate(day, 1),
            "Pattern Recognition": pattern(day, 1),
            "Hard": hard(day, 1),
            "Problem Solving": problemSolving(day, 1)
          }
        }
      }
    };
  }

  function dayLink(day) {
    return `days/day-${String(day).padStart(2, "0")}.html`;
  }

  function playBeep(state, type) {
    if (!state.soundOn) return;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = type === "celebrate" ? 660 : 440;
    gain.gain.value = 0.05;
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + (type === "celebrate" ? 0.2 : 0.08));
  }

  function emojiBurst(target) {
    const burst = document.createElement("div");
    burst.className = "emoji-burst";
    burst.textContent = "🎉 ✨ ⭐";
    target.appendChild(burst);
    setTimeout(() => burst.remove(), 900);
  }

  function buildTracker(currentDay, doneDays) {
    const container = document.querySelector("[data-progress-tracker]");
    if (!container) return;
    container.innerHTML = "";
    for (let d = 1; d <= TOTAL_DAYS; d += 1) {
      const a = document.createElement("a");
      a.href = dayLink(d);
      a.className = "day-dot";
      a.textContent = d;
      if (d === currentDay) a.classList.add("current");
      if (doneDays.includes(d)) a.classList.add("done");
      container.appendChild(a);
    }
  }

  function renderIndex() {
    const state = loadProgress();
    buildTracker(0, state.doneDays);
    const grid = document.querySelector("[data-day-grid]");
    if (!grid) return;
    grid.innerHTML = "";
    for (let day = 1; day <= TOTAL_DAYS; day += 1) {
      const data = dayData(day);
      const card = document.createElement("a");
      card.href = dayLink(day);
      card.className = `day-card ${data.theme.className}`;
      card.innerHTML = `
        <h3>Day ${day} ${data.theme.icon}</h3>
        <p>${data.note}</p>
        <span class="chip">${data.theme.name}</span>
      `;
      grid.appendChild(card);
    }
    const doneCount = document.querySelector("[data-done-count]");
    if (doneCount) doneCount.textContent = `${state.doneDays.length} / ${TOTAL_DAYS}`;
  }

  function formatPattern(q) {
    return q
      .replace(/\bsmall\b/g, '<span class="pattern-small">small</span>')
      .replace(/\blarge\b/g, '<span class="pattern-large">large</span>')
      .replace(/▲|■|●|◆|↑|↓|←|→|◀|▶/g, '<span class="pattern-symbol">$&</span>');
  }

  function renderSession(dayObj, sessionKey, sectionIndex, state) {
    const session = dayObj.sessions[sessionKey];
    const wrap = document.querySelector("[data-session-content]");
    wrap.innerHTML = "";

    categoryOrder.forEach((cat, idx) => {
      const section = document.createElement("section");
      section.className = "q-section card";
      if (idx !== sectionIndex) section.classList.add("collapsed");
      const questions = session.categories[cat];
      const listItems = questions.map((q) => `<li>${cat === "Pattern Recognition" ? formatPattern(q) : q}</li>`).join("");
      section.innerHTML = `
        <button class="section-head" data-open="${idx}">
          <span>${cat} ${cat === "Pattern Recognition" ? "🧩" : ""}</span>
          <span>${idx === sectionIndex ? "−" : "+"}</span>
        </button>
        <div class="section-body">
          <ol>${listItems}</ol>
          <div class="section-actions">
            <button class="btn next-btn" data-next="${idx}">${idx < 4 ? "Next Section" : "Finish Session"}</button>
          </div>
        </div>
      `;
      wrap.appendChild(section);
    });

    document.querySelectorAll("[data-open]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.section = Number(btn.dataset.open);
        renderSession(dayObj, sessionKey, state.section, state);
      });
    });

    document.querySelectorAll("[data-next]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const msg = document.querySelector("[data-encouragement]");
        msg.textContent = ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
        emojiBurst(msg.parentElement);
        playBeep(state, "click");
        if (state.section < 4) {
          state.section += 1;
          renderSession(dayObj, sessionKey, state.section, state);
        } else {
          document.querySelector("[data-finish-day]").classList.remove("hidden");
          playBeep(state, "celebrate");
        }
      });
    });
  }

  function renderDayPage(day) {
    const state = loadProgress();
    const dayObj = dayData(day);

    document.body.classList.add(dayObj.theme.className);
    buildTracker(day, state.doneDays);

    const title = document.querySelector("[data-day-title]");
    title.textContent = `Day ${day} ${dayObj.theme.icon} — ${dayObj.theme.name}`;
    document.querySelector("[data-day-note]").textContent = dayObj.note;
    document.querySelector("[data-day-inspiration]").textContent = inspiration[day - 1];

    const jump = document.querySelector("[data-day-jump]");
    for (let d = 1; d <= TOTAL_DAYS; d += 1) {
      const opt = document.createElement("option");
      opt.value = dayLink(d);
      opt.textContent = `Day ${d}`;
      if (d === day) opt.selected = true;
      jump.appendChild(opt);
    }
    jump.addEventListener("change", () => { window.location.href = jump.value; });

    const prev = document.querySelector("[data-prev-day]");
    const next = document.querySelector("[data-next-day]");
    prev.href = day > 1 ? dayLink(day - 1) : dayLink(1);
    next.href = day < 15 ? dayLink(day + 1) : dayLink(15);

    const startDayBtn = document.querySelector("[data-start-day]");
    const sessionPanel = document.querySelector("[data-session-panel]");
    const sessionState = { soundOn: state.soundOn, section: 0 };

    startDayBtn.addEventListener("click", () => {
      sessionPanel.classList.remove("hidden");
      startDayBtn.classList.add("hidden");
      playBeep(sessionState, "click");
      emojiBurst(sessionPanel);
    });

    document.querySelectorAll("[data-start-session]").forEach((btn) => {
      btn.addEventListener("click", () => {
        sessionState.section = 0;
        renderSession(dayObj, btn.dataset.startSession, 0, sessionState);
        document.querySelector("[data-session-title]").textContent = btn.textContent;
        playBeep(sessionState, "click");
        emojiBurst(document.querySelector("[data-session-content]"));
      });
    });

    const finishBtn = document.querySelector("[data-mark-done]");
    finishBtn.addEventListener("click", () => {
      if (!state.doneDays.includes(day)) {
        state.doneDays.push(day);
        state.doneDays.sort((a, b) => a - b);
      }
      saveProgress(state);
      buildTracker(day, state.doneDays);
      document.querySelector("[data-done-message]").textContent = "You're done! Amazing effort today!";
      playBeep(sessionState, "celebrate");
      emojiBurst(document.querySelector("[data-finish-day]"));
    });

    const soundToggle = document.querySelector("[data-sound-toggle]");
    soundToggle.checked = !!state.soundOn;
    soundToggle.addEventListener("change", () => {
      state.soundOn = soundToggle.checked;
      sessionState.soundOn = state.soundOn;
      saveProgress(state);
      playBeep(sessionState, "click");
    });

    const parentToggle = document.querySelector("[data-parent-toggle]");
    const parentTips = document.querySelector("[data-parent-tips]");
    parentToggle.addEventListener("change", () => {
      parentTips.classList.toggle("hidden", !parentToggle.checked);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    const type = document.body.dataset.page;
    if (type === "index") renderIndex();
    if (type === "day") renderDayPage(Number(document.body.dataset.day));
  });
})();
