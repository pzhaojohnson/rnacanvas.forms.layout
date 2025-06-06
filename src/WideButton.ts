import * as $ from 'jquery';

import * as styles from './WideButton.css';

import { Tooltip } from '@rnacanvas/tooltips';

export class WideButton {
  readonly domNode = document.createElement('div');

  #button;

  #tooltip;

  constructor(textContent?: string, onClick?: () => void) {
    this.domNode.classList.add(styles.container);

    this.#button = document.createElement('p');

    $(this.#button)
      .addClass(styles.wideButton);

    textContent ? this.#button.textContent = textContent : {};

    onClick ? this.#button.onclick = onClick : {};

    this.#tooltip = new Tooltip('');

    this.domNode.append(this.#button);

    this.#tooltip.owner = this.#button;
  }

  get textContent() {
    return this.#button.textContent;
  }

  set textContent(textContent) {
    this.#button.textContent = textContent;
  }

  get onClick() {
    return this.#button.onclick;
  }

  set onClick(onClick) {
    this.#button.onclick = onClick;
  }

  click(): void {
    this.#button.click();
  }

  get tooltip() {
    return this.#tooltip.textContent;
  }

  set tooltip(tooltip) {
    this.#tooltip.textContent = tooltip;
  }
}
