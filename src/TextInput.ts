import * as $ from 'jquery';

import * as styles from './TextInput.css';

export function TextInput() {
  let textInput = document.createElement('input');

  $(textInput)
    .attr({ 'type': 'text' })
    .addClass(styles.textInput);

  return textInput;
}
