import * as $ from 'jquery';

import * as styles from './TextInput.css';

export function TextInput() {
  let textInput = document.createElement('input');

  $(textInput)
    .attr({ 'type': 'text' })
    .addClass(styles.textInput);

  // prevent unintentional paste event propagation
  textInput.addEventListener('paste', event => event.stopPropagation());

  return textInput;
}
