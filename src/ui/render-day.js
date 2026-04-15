import { CATEGORY_ORDER, SCORE_SOURCE, SESSION_KEYS, STATUS } from '../content/config.ts';
import { getBonusQuestions } from '../content/bonus-generators.ts';
import { parseDayFromSearch, getDayUrl } from '../content/generators.ts';
import { getDayConfig, getRequiredQuestions } from '../content/question-bank.ts';
import { getDayProgress } from '../state.ts';
import { markSectionCompleted, recalcDay } from '../features/progress.ts';
import { startTimer, stopTimer } from '../features/timer.ts';
import { saveState } from '../storage.ts';
import {
  applyDayTheme,
  getDayElements,
  hideRewardFlash,
  hideSessionCelebration,
  renderDayHeader,
  renderDayJump,
  renderDayMissionBoard,
  renderDayNavigation,
  renderDayProgressStrip,
  renderFinishDayState,
  renderRewardFlash,
  renderSectionPills,
  renderSessionCelebration,
  renderSessionComplete,
  renderSessionFocus,
  renderSessionSection,
  renderSessionTimer,
  renderSessionTitle,
  toggleFinishDayCard
} from './day-view.js';

const countCompletedStars = (dayProgress) => {
  return SESSION_KEYS.reduce((sum, sessionKey) => {
    return sum + CATEGORY_ORDER.reduce((sectionSum, category) => {
      return sectionSum + (dayProgress[sessionKey].sections[category].status === STATUS.COMPLETED ? 1 : 0);
    }, 0);
  }, 0);
};

export const renderDayPage = (state) => {
  const day = parseDayFromSearch(window.location.search);
  const cfg = getDayConfig(day);
  const dayProgress = getDayProgress(state, day);
  const elements = getDayElements();
  let session = state.activeSession || 'morning';
  let section = state.activeSection || CATEGORY_ORDER[0];
  let timerInterval = null;
  let rewardFlashTimeout = null;

  applyDayTheme(cfg);
  renderDayHeader(elements, { day, cfg, doneDays: state.doneDays });
  renderDayJump(elements.dayJump, day);
  renderDayNavigation(elements, day);

  elements.dayJump.onchange = () => {
    window.location.href = getDayUrl(Number(elements.dayJump.value));
  };

  const syncSessionTimer = () => {
    const live = state.timerState?.isRunning && state.timerState.day === day && state.timerState.session === session;
    const baseSeconds = dayProgress[session]?.totalSeconds || 0;
    const runningSeconds = live ? Math.floor((Date.now() - state.timerState.startedAt) / 1000) : 0;
    renderSessionTimer(elements.sessionTimer, baseSeconds + Math.max(0, runningSeconds));
  };

  const restartTimerTicker = () => {
    if (timerInterval) clearInterval(timerInterval);
    syncSessionTimer();
    timerInterval = window.setInterval(syncSessionTimer, 1000);
  };

  const flashReward = (payload) => {
    if (rewardFlashTimeout) clearTimeout(rewardFlashTimeout);
    renderRewardFlash(elements.rewardFlash, payload);
    rewardFlashTimeout = window.setTimeout(() => {
      hideRewardFlash(elements.rewardFlash);
      rewardFlashTimeout = null;
    }, 2600);
  };

  const updateDayProgressStrip = () => {
    renderDayProgressStrip(elements.dayProgressStrip, { dayProgress, session, section });
  };

  const updateMissionBoard = () => {
    renderDayMissionBoard(elements.dayMissionBoard, { dayProgress, activeSession: session });
    renderSessionFocus(elements, { session, section, dayProgress });
  };

  const updatePills = () => {
    renderSectionPills(elements.sectionPills, dayProgress, session);
    elements.sectionPills.querySelectorAll('[data-section]').forEach((button) => {
      button.onclick = () => {
        section = button.dataset.section;
        startTimer(state, day, session, section);
        renderCurrentSection();
        updatePills();
        syncSessionTimer();
        updateDayProgressStrip();
        updateMissionBoard();
        saveState(state);
      };
    });
  };

  const renderCurrentSection = () => {
    const requiredQuestions = getRequiredQuestions({ day, session, category: section });
    const bonusKey = `${day}-${session}-${section}`;
    const attempts = state.bonusAttempts[bonusKey] || [];

    renderSessionSection(elements.sessionContent, {
      section,
      requiredQuestions,
      attempts,
      isLastSection: section === 'Problem Solving'
    });

    const hintToggle = elements.sessionContent.querySelector('[data-toggle-hint]');
    const hintPanel = elements.sessionContent.querySelector('[data-hint-panel]');
    const scratchpadToggle = elements.sessionContent.querySelector('[data-toggle-scratchpad]');
    const scratchpad = elements.sessionContent.querySelector('[data-scratchpad]');

    hintToggle.onclick = () => {
      const isHidden = hintPanel.classList.contains('hidden');
      hintPanel.classList.toggle('hidden', !isHidden);
      hintToggle.setAttribute('aria-expanded', String(isHidden));
      hintToggle.textContent = isHidden ? 'Hide Hint' : 'Show Hint';
    };

    scratchpadToggle.onclick = () => {
      const isHidden = scratchpad.classList.contains('hidden');
      scratchpad.classList.toggle('hidden', !isHidden);
      scratchpadToggle.setAttribute('aria-expanded', String(isHidden));
      scratchpadToggle.textContent = isHidden ? 'Close Scratchpad' : 'Open Scratchpad';
    };

    elements.sessionContent.querySelector('[data-get-bonus]').onclick = () => {
      const nextAttempt = attempts.length + 1;
      if (nextAttempt > 3) return;

      const questions = getBonusQuestions({ day, session, category: section, attempt: nextAttempt });
      const entry = {
        day,
        session,
        section,
        attempt: nextAttempt,
        source: SCORE_SOURCE.BONUS,
        generatedAt: new Date().toISOString(),
        questions
      };

      state.bonusAttempts[bonusKey] = [...attempts, entry];
      saveState(state);
      renderCurrentSection();
    };

    elements.sessionContent.querySelector('[data-next]').onclick = () => {
      const completedSection = section;
      stopTimer(state);
      markSectionCompleted(state, day, session, section);
      const sectionIndex = CATEGORY_ORDER.indexOf(section);
      const completedStars = countCompletedStars(dayProgress);

      if (sectionIndex < CATEGORY_ORDER.length - 1) {
        section = CATEGORY_ORDER[sectionIndex + 1];
        startTimer(state, day, session, section);
        state.activeSession = session;
        state.activeSection = section;
      }

      saveState(state);
      recalcDay(state, day);
      flashReward({
        title: `${completedSection} cleared`,
        body: dayProgress.dayCompleted
          ? 'That was the last section needed for the whole day.'
          : sectionIndex < CATEGORY_ORDER.length - 1
            ? `Star earned. ${section} is next on your path.`
            : 'Star earned. You wrapped up the whole session.',
        tokens: [
          'Star earned',
          `${completedStars} total stars`,
          sectionIndex < CATEGORY_ORDER.length - 1 ? `Next: ${section}` : 'Big win'
        ]
      });

      if (sectionIndex < CATEGORY_ORDER.length - 1) {
        renderCurrentSection();
      } else {
        const sessionLabel = session === SESSION_KEYS[0] ? 'Morning session' : 'Afternoon session';
        const nextSessionLabel = session === SESSION_KEYS[0] ? 'Afternoon session' : 'Morning session';
        renderSessionComplete(elements.sessionContent, {
          sessionLabel,
          nextSessionLabel,
          dayCompleted: dayProgress.dayCompleted
        });
        renderSessionCelebration(elements.sessionCelebration, {
          sessionLabel,
          completedStars: countCompletedStars(dayProgress),
          totalStars: CATEGORY_ORDER.length * SESSION_KEYS.length,
          dayCompleted: dayProgress.dayCompleted
        });
      }

      syncSessionTimer();
      toggleFinishDayCard(elements.finishDay, dayProgress.dayCompleted);
      renderFinishDayState(elements, dayProgress.dayCompleted);
      updateDayProgressStrip();
      updateMissionBoard();
      updatePills();
    };
  };

  elements.startSessionButtons.forEach((button) => {
    button.onclick = () => {
      session = button.dataset.startSession;
      section = CATEGORY_ORDER[0];
      renderSessionTitle(elements.sessionTitle, `${session === SESSION_KEYS[0] ? 'Morning' : 'Afternoon'} Session`);
      startTimer(state, day, session, section);
      hideSessionCelebration(elements.sessionCelebration);
      hideRewardFlash(elements.rewardFlash);
      saveState(state);
      renderCurrentSection();
      updatePills();
      updateDayProgressStrip();
      updateMissionBoard();
      restartTimerTicker();
    };
  });

  elements.finishDayBtn.onclick = () => {
    recalcDay(state, day);
    const complete = getDayProgress(state, day).dayCompleted;
    renderFinishDayState(elements, complete);
    if (complete) {
      flashReward({
        title: `Day ${day} complete`,
        body: 'Mission complete. Every section star is saved and the next adventure is ready.',
        tokens: ['Day cleared', '10/10 stars', 'Next mission unlocked']
      });
      renderSessionCelebration(elements.sessionCelebration, {
        sessionLabel: `Day ${day}`,
        completedStars: countCompletedStars(dayProgress),
        totalStars: CATEGORY_ORDER.length * SESSION_KEYS.length,
        dayCompleted: true
      });
      saveState(state);
    }
  };

  elements.parentLink.href = 'parent.html';
  hideSessionCelebration(elements.sessionCelebration);
  hideRewardFlash(elements.rewardFlash);
  toggleFinishDayCard(elements.finishDay, dayProgress.dayCompleted);
  renderFinishDayState(elements, dayProgress.dayCompleted);
  updateDayProgressStrip();
  updateMissionBoard();
  restartTimerTicker();
  window.addEventListener('beforeunload', () => {
    if (timerInterval) clearInterval(timerInterval);
    if (rewardFlashTimeout) clearTimeout(rewardFlashTimeout);
  });
};
