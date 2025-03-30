import * as $ from 'jquery';

import * as styles from './DarkSolidButton.css';

export class DarkSolidButton {
  readonly domNode = document.createElement('div');

  #button;

  #tooltip;

  constructor(textContent?: string, onClick?: () => void) {
    this.domNode.classList.add(styles.container);

    this.#button = document.createElement('p');

    $(this.#button)
      .addClass(styles.darkSolidButton);

    textContent ? this.#button.textContent = textContent : {};

    onClick ? this.#button.onclick = onClick : {};

    this.#tooltip = new Tooltip();

    this.domNode.append(this.#button, this.#tooltip.domNode);
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
    this.#tooltip.textContent = this.textContent;
  }
}

class Tooltip {
  readonly domNode = document.createElement('div');

  #p = document.createElement('p');

  constructor() {
    this.domNode.classList.add(styles['tooltip']);

    // hidden by default (until is given text content)
    this.domNode.style.visibility = 'hidden';

    this.#p.classList.add(styles['tooltip-text']);

    let textContainer = document.createElement('div');
    textContainer.classList.add(styles['tooltip-text-container']);
    textContainer.append(this.#p);

    this.domNode.append(textContainer);
  }

  get textContent() {
    return this.#p.textContent;
  }

  set textContent(textContent) {
    this.#p.textContent = textContent;

    this.domNode.style.visibility = textContent ? 'visible' : 'hidden';
  }
}
