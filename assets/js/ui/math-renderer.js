const OPERATORS = { '+': 'plus', '-': 'minus', '×': 'times' };

export const renderMath = (str) =>
  str.replace(/ ([+\-×]) /g, (_, op) => ` <span class="op op--${OPERATORS[op]}">${op}</span> `);
