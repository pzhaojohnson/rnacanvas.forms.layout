import { TextInput } from './TextInput';

import { isFiniteNumber } from '@rnacanvas/value-check';

const defaultValue = '0';

/**
 * A text input element that will change its value back to a finite number string
 * on blur or Enter key press if the user has input a string that does not parse to a finite number.
 */
export function FiniteNumberInput() {
  let finiteNumberInput = TextInput();

  finiteNumberInput.value = defaultValue;

  // the value of the finite number input when last focused
  let lastFocusValue = defaultValue;

  finiteNumberInput.addEventListener('focus', () => lastFocusValue = finiteNumberInput.value);

  let handleSubmit = () => {
    let value = Number.parseFloat(finiteNumberInput.value);

    if (!isFiniteNumber(value)) {
      finiteNumberInput.value = lastFocusValue;
    }
  };

  finiteNumberInput.addEventListener('blur', handleSubmit);

  finiteNumberInput.addEventListener('keyup', event => {
    if (event.key.toLowerCase() == 'enter') {
      handleSubmit();
    }
  });

  return finiteNumberInput;
}
