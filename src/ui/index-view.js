import { SESSION_KEYS, STATUS, TOTAL_DAYS } from '../content/config.ts';
import { getDayUrl, isDayUnlocked } from '../content/generators.ts';
import { getDayProgress } from '../state.ts';
import { formatDuration, renderTracker } from './components.js';

export const getIndexElements = () => ({
  progressTracker: document.querySelector('[data-progress-tracker]'),
  doneCount: document.querySelector('[data-done-count]'),
  activeDay: document.querySelector('[data-active-day]'),
  totalTime: document.querySelector('[data-total-time]'),
  primaryMissionLink: document.querySelector('[data-primary-mission-link]'),
  missionSpotlight: document.querySelector('[data-mission-spotlight]'),
  adventureStats: document.querySelector('[data-adventure-stats]'),
  nextGoal: document.querySelector('[data-next-goal]'),
  journeyStatus: document.querySelector('[data-journey-status]'),
  continueDay: document.querySelector('[data-continue-day]'),
  dayGrid: document.querySelector('[data-day-grid]')
});

const getDayStatus = (progress) => {
  if (progress.dayCompleted) return STATUS.COMPLETED;
  if (progress.totalSeconds > 0) return STATUS.IN_PROGRESS;
  return STATUS.NOT_STARTED;
};

const findNextMissionDay = (state) => {
  if (state.activeDay) {
    const activeProgress = getDayProgress(state, state.activeDay);
    if (!activeProgress.dayCompleted) {
      return state.activeDay;
    }
  }

  for (let day = 1; day <= TOTAL_DAYS; day += 1) {
    const progress = getDayProgress(state, day);
    if (!progress.dayCompleted && isDayUnlocked(day, state)) {
      return day;
    }
  }

  return TOTAL_DAYS;
};

const countCompletedDaysInARow = (doneDays) => {
  let streak = 0;
  for (let day = 1; day <= TOTAL_DAYS; day += 1) {
    if (!doneDays.includes(day)) break;
    streak += 1;
  }
  return streak;
};

export const renderIndexSummary = (elements, state) => {
  renderTracker(elements.progressTracker, 0, state.doneDays);
  elements.doneCount.textContent = `${state.doneDays.length} / ${TOTAL_DAYS}`;
  elements.activeDay.textContent = state.activeDay ? `Day ${state.activeDay}` : 'None yet';
  const totalSeconds = Object.values(state.progress).reduce((sum, day) => sum + (day.totalSeconds || 0), 0);
  elements.totalTime.textContent = formatDuration(totalSeconds);
  const missionDay = findNextMissionDay(state);
  elements.primaryMissionLink.href = getDayUrl(missionDay);
};

const countCompletedStars = (progress) => {
  return Object.values(progress).reduce((sum, day) => {
    return sum + SESSION_KEYS.reduce((sessionSum, sessionKey) => {
      return sessionSum + Object.values(day[sessionKey].sections).filter((section) => section.status === STATUS.COMPLETED).length;
    }, 0);
  }, 0);
};

const getMissionStatusLabel = (status, unlocked) => {
  if (!unlocked) return 'Locked';
  if (status === STATUS.COMPLETED) return 'Complete';
  if (status === STATUS.IN_PROGRESS) return 'In Progress';
  return 'Ready';
};

const renderAdventureStats = (wrap, state) => {
  const totalStars = countCompletedStars(state.progress);
  const streak = countCompletedDaysInARow(state.doneDays);
  const missionDay = findNextMissionDay(state);

  wrap.innerHTML = `<article class="summary-item summary-item--highlight">
      <strong>Stars earned</strong>
      <p>${totalStars}</p>
    </article>
    <article class="summary-item">
      <strong>Days completed</strong>
      <p>${state.doneDays.length}</p>
    </article>
    <article class="summary-item">
      <strong>Mission streak</strong>
      <p>${streak}</p>
    </article>
    <article class="summary-item">
      <strong>Next mission</strong>
      <p>Day ${missionDay}</p>
    </article>`;
};

const renderMissionSpotlight = (wrap, state, getDayConfig) => {
  const missionDay = findNextMissionDay(state);
  const cfg = getDayConfig(missionDay);
  const progress = getDayProgress(state, missionDay);
  const status = getDayStatus(progress);
  const statusLabel = getMissionStatusLabel(status, true);
  const completedStars = countDayStars(progress);
  const actionLabel = status === STATUS.IN_PROGRESS ? `Continue Day ${missionDay}` : `Start Day ${missionDay}`;
  const supportCopy = status === STATUS.COMPLETED
    ? 'This mission is complete. Replay it anytime or move ahead on the path.'
    : status === STATUS.IN_PROGRESS
      ? 'You already started this mission. Jump back in and finish collecting stars.'
      : 'This is the clearest next step on your path right now.';

  wrap.innerHTML = `<div class="mission-spotlight__top">
      <div>
        <p class="eyebrow">Today&apos;s mission</p>
        <h2>Day ${missionDay} ${cfg.theme.icon} - ${cfg.theme.name}</h2>
      </div>
      <span class="status-badge status-badge--${status}">${statusLabel}</span>
    </div>
    <p class="mission-spotlight__note">${cfg.note}</p>
    <p class="muted">${cfg.inspiration}</p>
    <div class="mission-spotlight__meta">
      <span class="chip">${cfg.theme.name}</span>
      <span class="reward-pill">${completedStars} / 10 stars earned</span>
    </div>
    <p class="mission-spotlight__support">${supportCopy}</p>
    <div class="button-row">
      <a class="btn btn-primary" href="${getDayUrl(missionDay)}">${actionLabel}</a>
    </div>`;
};

const renderJourneyBanner = (elements, state) => {
  const missionDay = findNextMissionDay(state);
  const progress = getDayProgress(state, missionDay);
  const status = getDayStatus(progress);
  elements.nextGoal.textContent = `Next goal: Day ${missionDay}`;
  elements.journeyStatus.textContent = getMissionStatusLabel(status, true);
  elements.journeyStatus.className = `status-badge status-badge--${status}`;
};

export const renderContinueDayPanel = (wrap, state) => {
  const active = state.activeDay && getDayProgress(state, state.activeDay);
  const totalStars = countCompletedStars(state.progress);
  wrap.innerHTML = active && !active.dayCompleted
    ? `<section class="card continue-day-panel" aria-label="Continue current day">
        <div class="mission-card__top">
          <span class="mission-card__eyebrow">Current mission</span>
          <span class="status-badge status-badge--progress">In Progress</span>
        </div>
        <div class="button-group button-group--split button-group--stack-mobile">
          <div class="continue-day-copy">
            <h3>Continue Day ${state.activeDay}</h3>
            <p>Jump back into your in-progress practice and keep collecting stars.</p>
          </div>
          <a class="btn btn-primary" href="${getDayUrl(state.activeDay)}">Continue Day ${state.activeDay}</a>
        </div>
        <p class="continue-day-panel__stars">Stars earned so far: <strong>${totalStars}</strong></p>
      </section>`
    : '';
};

const countDayStars = (progress) => {
  return SESSION_KEYS.reduce((sum, sessionKey) => {
    return sum + Object.values(progress[sessionKey].sections).filter((section) => section.status === STATUS.COMPLETED).length;
  }, 0);
};

const createDayCard = ({ day, cfg, progress, status, unlocked }) => {
  const card = document.createElement(unlocked ? 'a' : 'div');
  card.className = `card day-card ${unlocked ? `day-card--${status}` : 'day-card--locked'}`;
  const statusLabel = getMissionStatusLabel(status, unlocked);
  const statusClass = unlocked ? status : 'locked';

  if (unlocked) {
    const completedStars = countDayStars(progress);
    card.href = getDayUrl(day);
    card.innerHTML = `<div class="mission-card__top">
        <span class="mission-card__eyebrow">Mission Day ${day}</span>
        <span class="status-badge status-badge--${statusClass}">${statusLabel}</span>
      </div>
      <h3>Day ${day} ${cfg.theme.icon}</h3>
      <p>${cfg.note}</p>
      <div class="mission-card__meta">
        <span class="chip">${cfg.theme.name}</span>
        <span class="reward-pill">Goal: 10 stars</span>
      </div>
      <p class="day-card__stars">${completedStars} / 10 stars earned</p>`;
    return card;
  }

  card.setAttribute('aria-disabled', 'true');
  card.innerHTML = `<div class="mission-card__top">
      <span class="mission-card__eyebrow">Mission Day ${day}</span>
      <span class="status-badge status-badge--locked">${statusLabel}</span>
    </div>
    <h3>Day ${day} &#128274;</h3>
    <p>${cfg.note}</p>
    <div class="mission-card__meta">
      <span class="chip">${cfg.theme.name}</span>
      <span class="reward-pill">Goal: 10 stars</span>
    </div>
    <p class="day-card__stars">Unlock the earlier day first</p>`;
  return card;
};

export const renderDayGrid = (grid, state, getDayConfig) => {
  grid.innerHTML = '';
  const missionDay = findNextMissionDay(state);

  for (let day = 1; day <= TOTAL_DAYS; day += 1) {
    const cfg = getDayConfig(day);
    const progress = getDayProgress(state, day);
    const unlocked = isDayUnlocked(day, state);
    const status = getDayStatus(progress);
    const card = createDayCard({ day, cfg, progress, status, unlocked });
    if (day === missionDay && unlocked && status !== STATUS.COMPLETED) {
      card.classList.add('day-card--spotlight');
    }
    grid.appendChild(card);
  }
};

export const renderMissionHub = (elements, state, getDayConfig) => {
  renderAdventureStats(elements.adventureStats, state);
  renderMissionSpotlight(elements.missionSpotlight, state, getDayConfig);
  renderJourneyBanner(elements, state);
};
