import * as $ from 'jquery';

import * as styles from './Header.css';

/**
 * The header of the bases-layout form.
 */
export function Header() {
  let header = document.createElement('p');

  $(header)
    .addClass(styles.header)
    .append('Bases Layout');

  return header;
}
