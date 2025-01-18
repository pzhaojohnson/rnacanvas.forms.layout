import * as $ from 'jquery';

import * as styles from './TextInputField.css';

/**
 * Returns an HTML element (that is the text input field)
 * containing the provided text input element
 * with the provided name text placed to the right of it.
 */
export function TextInputField(name: string, textInput: HTMLInputElement) {
  let textInputField = document.createElement('label');

  let nameSpan = document.createElement('span');

  $(nameSpan)
    .append(name)
    .css({ paddingLeft: '8px' });

  $(textInputField)
    .addClass(styles.textInputField)
    .append(textInput, nameSpan);

  return textInputField;
}
