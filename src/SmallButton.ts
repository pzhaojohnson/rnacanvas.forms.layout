import * as styles from './SmallButton.css';

import { Tooltip } from '@rnacanvas/tooltips';

export class SmallButton {
  readonly domNode = document.createElement('div');

  #button = document.createElement('p');

  readonly tooltip = new Tooltip('');

  constructor(textContent?: string, onClick?: () => void) {
    this.domNode.classList.add(styles.container);

    this.#button.classList.add(styles.smallButton);

    textContent ? this.textContent = textContent : {};

    onClick ? this.onClick = onClick : {};

    this.domNode.append(this.#button);

    this.tooltip.owner = this.#button;
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
}
