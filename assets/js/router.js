import { renderIndexPage } from './ui/render-index.js';
import { renderDayPage } from './ui/render-day.js';
import { renderParentPage } from './ui/render-parent.js';

export const route = (state) => {
  const page = document.body.dataset.page;
  if (page === 'index') return renderIndexPage(state);
  if (page === 'day') return renderDayPage(state);
  if (page === 'parent') return renderParentPage(state);
};
