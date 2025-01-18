import * as $ from 'jquery';

import * as styles from './CloseButton.css';

export function CloseButton() {
  let closeButton = document.createElement('p');

  $(closeButton)
    .addClass(styles.closeButton)
    .text('Close');

  return closeButton;
}
