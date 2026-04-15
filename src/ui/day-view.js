import { CATEGORY_ORDER, SESSION_KEYS, STATUS, TOTAL_DAYS } from '../content/config.ts';
import { getDayUrl } from '../content/generators.ts';
import { formatDuration, renderTracker } from './components.js';

export const getDayElements = () => ({
  dayTitle: document.querySelector('[data-day-title]'),
  headerDayTitle: document.querySelector('[data-header-day-title]'),
  dayNote: document.querySelector('[data-day-note]'),
  dayInspiration: document.querySelector('[data-day-inspiration]'),
  dayMissionBoard: document.querySelector('[data-day-mission-board]'),
  progressTracker: document.querySelector('[data-progress-tracker]'),
  dayProgressStrip: document.querySelector('[data-day-progress-strip]'),
  dayJump: document.querySelector('[data-day-jump]'),
  prevDay: document.querySelector('[data-prev-day]'),
  nextDay: document.querySelector('[data-next-day]'),
  sessionTitle: document.querySelector('[data-session-title]'),
  sessionTimer: document.querySelector('[data-session-timer]'),
  currentSessionBadge: document.querySelector('[data-current-session-badge]'),
  currentSectionBadge: document.querySelector('[data-current-section-badge]'),
  sectionPills: document.querySelector('[data-section-pills]'),
  rewardFlash: document.querySelector('[data-reward-flash]'),
  sessionContent: document.querySelector('[data-session-content]'),
  sessionCelebration: document.querySelector('[data-session-celebration]'),
  finishDay: document.querySelector('[data-finish-day]'),
  finishDayMsg: document.querySelector('[data-finish-day-msg]'),
  finishDayBtn: document.querySelector('[data-finish-day-btn]'),
  parentLink: document.querySelector('[data-parent-link]'),
  startSessionButtons: Array.from(document.querySelectorAll('[data-start-session]'))
});

export const applyDayTheme = (cfg) => {
  document.body.classList.add(cfg.theme.className);
};

export const renderDayHeader = (elements, { day, cfg, doneDays }) => {
  elements.dayTitle.textContent = `Day ${day} ${cfg.theme.icon} - ${cfg.theme.name}`;
  elements.headerDayTitle.textContent = `Day ${day} - ${cfg.theme.name}`;
  elements.dayNote.textContent = cfg.note;
  elements.dayInspiration.textContent = cfg.inspiration;
  renderTracker(elements.progressTracker, day, doneDays);
};

export const renderDayMissionBoard = (wrap, { dayProgress, activeSession }) => {
  const completedStars = SESSION_KEYS.reduce((sum, sessionKey) => {
    return sum + countCompletedSections(dayProgress[sessionKey]);
  }, 0);
  const totalStars = CATEGORY_ORDER.length * SESSION_KEYS.length;
  const sessionLabel = activeSession === SESSION_KEYS[0] ? 'Morning mission' : 'Afternoon mission';
  const readyLabel = dayProgress.dayCompleted ? 'Ready to finish day' : `${sessionLabel} is selected`;

  wrap.innerHTML = `<p class="eyebrow">Mission board</p>
    <div class="mission-mini-board__stars">${completedStars} / ${totalStars} stars</div>
    <div class="mission-mini-board__grid">
      <article class="mission-mini-board__item">
        <strong>Morning</strong>
        <span>${countCompletedSections(dayProgress.morning)} / ${CATEGORY_ORDER.length}</span>
      </article>
      <article class="mission-mini-board__item">
        <strong>Afternoon</strong>
        <span>${countCompletedSections(dayProgress.afternoon)} / ${CATEGORY_ORDER.length}</span>
      </article>
    </div>
    <p class="muted">${readyLabel}</p>`;
};

export const renderDayJump = (select, day) => {
  select.innerHTML = Array.from({ length: TOTAL_DAYS }, (_, index) => {
    const optionDay = index + 1;
    return `<option value="${optionDay}" ${optionDay === day ? 'selected' : ''}>Day ${optionDay}</option>`;
  }).join('');
};

const setNavButtonState = (link, targetDay) => {
  if (targetDay >= 1 && targetDay <= TOTAL_DAYS) {
    link.href = getDayUrl(targetDay);
    link.removeAttribute('aria-disabled');
    link.classList.remove('btn--disabled');
    return;
  }

  link.removeAttribute('href');
  link.setAttribute('aria-disabled', 'true');
  link.classList.add('btn--disabled');
};

export const renderDayNavigation = (elements, day) => {
  setNavButtonState(elements.prevDay, day - 1);
  setNavButtonState(elements.nextDay, day + 1);
};

export const renderSessionTitle = (titleEl, text) => {
  titleEl.textContent = text;
};

export const renderSessionTimer = (timerEl, totalSeconds) => {
  timerEl.textContent = `Session timer: ${formatDuration(totalSeconds)}`;
};

const getCategoryStatusVariant = (status) => {
  if (status === STATUS.COMPLETED) return 'completed';
  if (status === STATUS.IN_PROGRESS) return 'in_progress';
  return 'not_started';
};

export const renderSessionFocus = (elements, { session, section, dayProgress }) => {
  const sessionLabel = session === SESSION_KEYS[0] ? 'Morning mission' : 'Afternoon mission';
  const sectionStatus = dayProgress[session].sections[section].status;
  elements.currentSessionBadge.textContent = sessionLabel;
  elements.currentSectionBadge.textContent = section;
  elements.currentSectionBadge.className = `status-badge status-badge--${getCategoryStatusVariant(sectionStatus)}`;
};

const countCompletedSections = (sessionProgress) =>
  CATEGORY_ORDER.filter((category) => sessionProgress.sections[category].status === STATUS.COMPLETED).length;

const getSessionStatusLabel = (completedSections) => {
  if (completedSections === CATEGORY_ORDER.length) return 'Complete';
  if (completedSections > 0) return `${completedSections}/${CATEGORY_ORDER.length} done`;
  return 'Ready to begin';
};

export const renderDayProgressStrip = (wrap, { dayProgress, session, section }) => {
  const totalStars = CATEGORY_ORDER.length * SESSION_KEYS.length;
  const completedStars = SESSION_KEYS.reduce((sum, sessionKey) => {
    return sum + countCompletedSections(dayProgress[sessionKey]);
  }, 0);

  const sessionCards = SESSION_KEYS.map((sessionKey) => {
    const completedSections = countCompletedSections(dayProgress[sessionKey]);
    const label = sessionKey === SESSION_KEYS[0] ? 'Morning mission' : 'Afternoon mission';
    return `<article class="progress-session ${sessionKey === session ? 'progress-session--active' : ''}">
      <p class="progress-session__label">${label}</p>
      <strong>${getSessionStatusLabel(completedSections)}</strong>
      <span>${'&#9733;'.repeat(completedSections)}${'&#9734;'.repeat(CATEGORY_ORDER.length - completedSections)}</span>
    </article>`;
  }).join('');

  wrap.innerHTML = `<div class="sticky-progress__summary">
      <div>
        <p class="eyebrow">Star tracker</p>
        <h2>${completedStars} of ${totalStars} stars earned</h2>
        <p class="muted">Current focus: <strong class="inline-category" data-category="${section}">${section}</strong></p>
      </div>
      <div class="sticky-progress__spark" aria-hidden="true">${'&#9733;'.repeat(Math.max(completedStars, 1))}</div>
    </div>
    <div class="sticky-progress__sessions">${sessionCards}</div>`;
};

const getSectionBadge = (status) => {
  if (status === STATUS.COMPLETED) return 'Star earned';
  if (status === STATUS.IN_PROGRESS) return 'Keep going';
  return 'Ready';
};

export const renderSectionPills = (wrap, dayProgress, session) => {
  wrap.innerHTML = CATEGORY_ORDER.map((category) => {
    const status = dayProgress[session].sections[category].status;
    const icon = status === STATUS.COMPLETED ? '&#9733;' : status === STATUS.IN_PROGRESS ? '&#10140;' : '&#9675;';
    return `<button class="pill ${status}" data-section="${category}" data-category="${category}" data-status="${status}">
      <strong>${icon} ${category}</strong>
      <span>${getSectionBadge(status)}</span>
    </button>`;
  }).join('');
};

const renderQuestionList = (questions) => `<ol>${questions.map((question) => `<li>${question}</li>`).join('')}</ol>`;

const renderBonusPanels = (attempts) => {
  return attempts.map((attempt) => {
    return `<article class="bonus-panel"><h4>Bonus Round ${attempt.attempt}</h4>${renderQuestionList(attempt.questions)}</article>`;
  }).join('');
};

const getCategoryBoostCopy = (section) => {
  if (section === 'Easy') return 'Warm up with steady wins and clean number sentences.';
  if (section === 'Intermediate') return 'Level up by spotting the quickest path to the answer.';
  if (section === 'Pattern Recognition') return 'Look for what changes, what repeats, and what stays the same.';
  if (section === 'Hard') return 'Slow, careful thinking beats rushing here.';
  return 'Explain your thinking like a math coach solving the puzzle out loud.';
};

const getHintTitle = (section) => {
  if (section === 'Pattern Recognition') return 'Pattern clue';
  if (section === 'Problem Solving') return 'Word-problem helper';
  if (section === 'Hard') return 'Slow-down hint';
  return 'Math coach hint';
};

const getHintCopy = (section) => {
  if (section === 'Pattern Recognition') return 'Circle what stays the same, then look for the one thing that changes each step.';
  if (section === 'Problem Solving') return 'Underline the important numbers, decide if you are joining, taking away, or grouping, then solve one step at a time.';
  if (section === 'Hard') return 'Break the question into smaller parts and solve one piece before putting the answer back together.';
  if (section === 'Intermediate') return 'Look for a fast move like making a ten or using a fact you already know.';
  return 'Say the problem out loud and solve it in the order that feels simplest.';
};

const getVisualAidMarkup = (section) => {
  if (section === 'Pattern Recognition') {
    return `<div class="visual-aid visual-aid--pattern" data-visual-aid>
        <p class="eyebrow">Visual clue</p>
        <div class="pattern-steps" aria-hidden="true">
          <span class="pattern-steps__tile">2</span>
          <span class="pattern-steps__tile">4</span>
          <span class="pattern-steps__tile">6</span>
          <span class="pattern-steps__tile pattern-steps__tile--blank">?</span>
        </div>
        <p class="muted">Ask: what changed each time?</p>
      </div>`;
  }

  if (section === 'Problem Solving') {
    return `<div class="visual-aid visual-aid--problem" data-visual-aid>
        <p class="eyebrow">Solve in steps</p>
        <ol class="problem-steps">
          <li>Find the numbers.</li>
          <li>Choose the action.</li>
          <li>Write the number sentence.</li>
        </ol>
      </div>`;
  }

  if (section === 'Hard') {
    return `<div class="visual-aid visual-aid--hard" data-visual-aid>
        <p class="eyebrow">Break it apart</p>
        <div class="math-chunks" aria-hidden="true">
          <span>Hundreds</span>
          <span>Tens</span>
          <span>Ones</span>
        </div>
      </div>`;
  }

  return '';
};

export const renderSessionSection = (wrap, { section, requiredQuestions, attempts, isLastSection }) => {
  wrap.innerHTML = `<section class="card session-stage">
      <div class="session-stage__header">
        <div>
          <p class="eyebrow">Section mission</p>
          <h3>${section}</h3>
        </div>
        <span class="category-badge" data-category="${section}">${section}</span>
      </div>
      <p class="coach-copy">${getCategoryBoostCopy(section)}</p>
      <div class="support-strip">
        <button class="btn" type="button" data-toggle-hint aria-expanded="false">Show Hint</button>
        <button class="btn" type="button" data-toggle-scratchpad aria-expanded="false">Open Scratchpad</button>
      </div>
      <section class="hint-panel hidden" data-hint-panel>
        <p class="eyebrow">${getHintTitle(section)}</p>
        <p>${getHintCopy(section)}</p>
        ${getVisualAidMarkup(section)}
      </section>
      <section class="scratchpad hidden" data-scratchpad>
        <div class="scratchpad__top">
          <p class="eyebrow">Scratchpad</p>
          <span class="muted">Use this space to jot ideas before solving.</span>
        </div>
        <textarea data-scratchpad-input placeholder="Write numbers, draw steps, or explain your thinking..."></textarea>
      </section>
      ${renderQuestionList(requiredQuestions)}
      <button class="btn btn-secondary" data-get-bonus>Get 5 More</button>
      <p class="muted">Optional extra practice for extra confidence.</p>
      <div class="bonus-area">${renderBonusPanels(attempts)}</div>
      <div class="button-row"><button class="btn btn-primary" data-next>${isLastSection ? 'Finish Session' : 'Next Section'}</button></div>
    </section>`;
};

export const renderRewardFlash = (wrap, { title, body, tokens }) => {
  wrap.classList.remove('hidden');
  wrap.innerHTML = `<div class="reward-flash__burst" aria-hidden="true">&#9733;&#9733;&#9733;</div>
    <div class="reward-flash__copy">
      <p class="eyebrow">Reward unlocked</p>
      <h3>${title}</h3>
      <p>${body}</p>
      <div class="celebration-card__tokens">${tokens.map((token) => `<span class="reward-pill">${token}</span>`).join('')}</div>
    </div>`;
};

export const hideRewardFlash = (wrap) => {
  wrap.classList.add('hidden');
  wrap.innerHTML = '';
};

export const renderSessionComplete = (wrap, { sessionLabel, nextSessionLabel, dayCompleted }) => {
  const nextPrompt = dayCompleted
    ? 'Both sessions are complete. You are ready for the full day celebration.'
    : `${nextSessionLabel} is ready when you are.`;

  wrap.innerHTML = `<section class="card celebration-card">
    <p class="eyebrow">Session complete</p>
    <h3>${sessionLabel} wrapped up.</h3>
    <p>${nextPrompt}</p>
    <div class="celebration-card__tokens">
      <span class="reward-pill">Mission cleared</span>
      <span class="reward-pill">Stars saved</span>
    </div>
  </section>`;
};

export const renderSessionCelebration = (wrap, { sessionLabel, completedStars, totalStars, dayCompleted }) => {
  wrap.classList.remove('hidden');
  wrap.innerHTML = `<div class="celebration-panel__content">
      <div>
        <p class="eyebrow">${dayCompleted ? 'Day-level win' : 'Nice work'}</p>
        <h3>${sessionLabel} complete</h3>
        <p>${dayCompleted ? 'You finished both sessions today. Every section star is lit and the finish-day reward is ready.' : 'Take a breath, celebrate the win, and come back for the next mission.'}</p>
      </div>
      <div class="celebration-panel__stars" aria-hidden="true">${'&#9733;'.repeat(Math.max(completedStars, 1))}</div>
    </div>
    <p class="muted">Stars earned so far: ${completedStars} / ${totalStars}</p>`;
};

export const hideSessionCelebration = (wrap) => {
  wrap.classList.add('hidden');
  wrap.innerHTML = '';
};

export const toggleFinishDayCard = (finishDayEl, isVisible) => {
  finishDayEl.classList.toggle('hidden', !isVisible);
};

export const renderFinishDayState = (elements, complete) => {
  elements.finishDayMsg.textContent = complete
    ? 'Day complete! Fantastic perseverance. You earned every star today.'
    : 'Complete both sessions first.';
  elements.finishDayBtn.textContent = complete ? 'Celebrate Day Complete' : 'Mark Day Complete';
};
