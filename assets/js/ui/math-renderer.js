const OPERATORS = { '+': 'plus', '-': 'minus', '×': 'times' };

export const renderMath = (str) =>
  str.replace(/[+\-×]/g, (op) => `<span class="op op--${OPERATORS[op]}">${op}</span>`);
