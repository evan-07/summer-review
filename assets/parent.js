(function () {
  if (document.body.dataset.page !== "parent") return;
  const api = window.G2MathApp;
  const state = api.loadProgress();
  let editId = null;

  const form = document.querySelector("[data-score-form]");
  const historyBody = document.querySelector("[data-history-body]");
  const summaryWrap = document.querySelector("[data-parent-summary]");
  const formTitle = document.querySelector("[data-form-title]");
  const saveBtn = document.querySelector("[data-save-score]");
  const cancelBtn = document.querySelector("[data-cancel-edit]");

  const filters = {
    day: document.querySelector("[data-filter-day]"),
    session: document.querySelector("[data-filter-session]"),
    section: document.querySelector("[data-filter-section]")
  };

  function fmtDate(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString() + " " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function fillDaySelects() {
    const dayOptions = document.querySelector("[data-day-options]");
    if (!dayOptions || !filters.day) return;
    for (let i = 1; i <= api.TOTAL_DAYS; i++) {
      const option = document.createElement("option");
      option.value = i;
      option.textContent = `Day ${i}`;
      dayOptions.appendChild(option.cloneNode(true));
      filters.day.appendChild(option);
    }
  }

  function inferTimeSeconds(day, session, section) {
    const dp = api.getDayProgress(state, Number(day));
    if (!dp) return 0;
    if (section) return dp[session].sections[section]?.totalSeconds || 0;
    return dp[session]?.totalSeconds || 0;
  }

  function computePercentage(score, maxScore) {
    if (!maxScore) return 0;
    return Math.round((score / maxScore) * 100);
  }

  function getFilteredScores() {
    return state.parentScores.filter((entry) => {
      if (filters.day.value && String(entry.day) !== filters.day.value) return false;
      if (filters.session.value && entry.session !== filters.session.value) return false;
      if (filters.section.value && entry.section !== filters.section.value) return false;
      return true;
    });
  }

  function summaryItem(label, value) {
    return `<article class="summary-item"><strong>${label}</strong><p>${value}</p></article>`;
  }

  function getSectionAverages(rows) {
    const rollup = {};
    rows.forEach((r) => {
      if (!r.section) return;
      if (!rollup[r.section]) rollup[r.section] = { total: 0, count: 0 };
      rollup[r.section].total += r.percentage;
      rollup[r.section].count += 1;
    });
    return Object.entries(rollup).map(([section, data]) => ({ section, avg: Math.round(data.total / data.count) }));
  }

  function renderSummary(rows) {
    if (!summaryWrap) return;
    if (!rows.length) {
      summaryWrap.innerHTML = summaryItem("Total entries", "0") + summaryItem("Average score", "-") + summaryItem("Recent activity", "-");
      return;
    }
    const avgScore = Math.round(rows.reduce((sum, row) => sum + row.percentage, 0) / rows.length);
    const avgTime = Math.round(rows.reduce((sum, row) => sum + (row.timeSeconds || 0), 0) / rows.length);
    const recent = rows.slice().sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0];
    const sectionAverages = getSectionAverages(rows).sort((a, b) => b.avg - a.avg);
    const strongest = sectionAverages[0]?.section || "-";
    const weakest = sectionAverages[sectionAverages.length - 1]?.section || "-";

    summaryWrap.innerHTML = [
      summaryItem("Total entries", String(rows.length)),
      summaryItem("Average score", `${avgScore}%`),
      summaryItem("Average completion time", api.formatDuration(avgTime)),
      summaryItem("Strongest section", strongest),
      summaryItem("Weakest section", weakest),
      summaryItem("Most recent activity", fmtDate(recent.updatedAt))
    ].join("");
  }

  function renderLineTrend(selector, rows, valueAccessor, color) {
    const svg = document.querySelector(selector);
    if (!svg) return;
    if (!rows.length) {
      svg.innerHTML = "";
      return;
    }
    const sorted = rows.slice().sort((a, b) => new Date(a.recordedAt) - new Date(b.recordedAt));
    const values = sorted.map(valueAccessor);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    const points = values.map((v, idx) => {
      const x = values.length === 1 ? 50 : (idx / (values.length - 1)) * 100;
      const y = 36 - (((v - min) / range) * 30);
      return `${x},${y}`;
    }).join(" ");

    svg.innerHTML = `<polyline points="${points}" fill="none" stroke="${color}" stroke-width="2"/><line x1="0" y1="38" x2="100" y2="38" stroke="#c8d8ff" stroke-width=".7"/>`;
  }

  function renderSectionBars(rows) {
    const wrap = document.querySelector("[data-section-bars]");
    if (!wrap) return;
    const sections = getSectionAverages(rows).sort((a, b) => b.avg - a.avg);
    if (!sections.length) {
      wrap.innerHTML = "<p>No section data yet.</p>";
      return;
    }
    wrap.innerHTML = sections.map((item) => `<div class="bar-row"><span>${item.section}</span><div class="bar-track"><div class="bar-fill" style="width:${item.avg}%"></div></div><strong>${item.avg}%</strong></div>`).join("");
  }

  function renderHistory(rows) {
    if (!historyBody) return;
    historyBody.innerHTML = "";
    rows.slice().sort((a, b) => new Date(b.recordedAt) - new Date(a.recordedAt)).forEach((entry) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${fmtDate(entry.updatedAt)}</td><td>${entry.day}</td><td>${entry.session}</td><td>${entry.section || "Session"}</td><td>${entry.score}/${entry.maxScore}</td><td>${entry.percentage}%</td><td>${api.formatDuration(entry.timeSeconds || 0)}</td><td>${entry.notes || ""}</td><td><button class="btn" data-edit="${entry.id}" data-animate="button">Edit</button> <button class="btn" data-delete="${entry.id}" data-animate="button">Delete</button></td>`;
      historyBody.appendChild(tr);
    });
    api.bindAnimationTargets(document);
  }

  function resetForm() {
    editId = null;
    form.reset();
    formTitle.textContent = "Add score entry";
    saveBtn.textContent = "Save Score";
    cancelBtn.classList.add("hidden");
  }

  function rerender() {
    const rows = getFilteredScores();
    renderSummary(rows);
    renderHistory(rows);
    renderLineTrend("[data-score-trend]", rows, (r) => r.percentage, "#5b80ff");
    renderLineTrend("[data-time-trend]", rows, (r) => r.timeSeconds || 0, "#9c6ef7");
    renderSectionBars(rows);
  }

  fillDaySelects();
  rerender();

  if (!form || !historyBody) return;
  form.addEventListener("change", () => {
    const day = form.day.value;
    const session = form.session.value;
    const section = form.section.value;
    if (!form.timeSeconds.value && day && session) {
      form.timeSeconds.value = inferTimeSeconds(day, session, section);
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const now = new Date().toISOString();
    const score = Number(form.score.value);
    const maxScore = Number(form.maxScore.value);
    const entry = {
      id: editId || `score-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      day: Number(form.day.value),
      session: form.session.value,
      section: form.section.value,
      score,
      maxScore,
      percentage: computePercentage(score, maxScore),
      timeSeconds: Number(form.timeSeconds.value || inferTimeSeconds(form.day.value, form.session.value, form.section.value) || 0),
      notes: form.notes.value.trim(),
      recordedAt: now,
      updatedAt: now
    };

    if (editId) {
      state.parentScores = state.parentScores.map((row) => row.id === editId ? { ...row, ...entry, recordedAt: row.recordedAt, updatedAt: now } : row);
    } else {
      state.parentScores.push(entry);
    }

    api.saveProgress(state);
    resetForm();
    rerender();
  });

  cancelBtn.addEventListener("click", resetForm);

  Object.values(filters).forEach((el) => el.addEventListener("change", rerender));

  historyBody.addEventListener("click", (event) => {
    const edit = event.target.closest("[data-edit]");
    const del = event.target.closest("[data-delete]");

    if (edit) {
      const row = state.parentScores.find((item) => item.id === edit.dataset.edit);
      if (!row) return;
      editId = row.id;
      form.day.value = row.day;
      form.session.value = row.session;
      form.section.value = row.section || "";
      form.score.value = row.score;
      form.maxScore.value = row.maxScore;
      form.timeSeconds.value = row.timeSeconds || 0;
      form.notes.value = row.notes || "";
      formTitle.textContent = `Edit entry (${row.id.slice(-5)})`;
      saveBtn.textContent = "Update Score";
      cancelBtn.classList.remove("hidden");
      api.playInteractionAnimation(saveBtn, "button");
      return;
    }

    if (del) {
      const row = state.parentScores.find((item) => item.id === del.dataset.delete);
      if (!row) return;
      if (!window.confirm(`Delete score entry for Day ${row.day}, ${row.session}?`)) return;
      state.parentScores = state.parentScores.filter((item) => item.id !== row.id);
      api.saveProgress(state);
      rerender();
    }
  });
})();
