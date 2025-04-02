import * as $ from 'jquery';

import * as styles from './LightSolidButton.css';

export class LightSolidButton {
  readonly domNode = document.createElement('div');

  #button = document.createElement('p');

  #tooltip = new Tooltip();

  constructor(textContent?: string, onClick?: () => void) {
    this.domNode.classList.add(styles.container);

    this.#button.classList.add(styles.lightSolidButton);

    textContent ? this.textContent = textContent : {};

    onClick ? this.onClick = onClick : {};

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
    this.#tooltip.textContent = tooltip;
  }
}

class Tooltip {
  readonly domNode = document.createElement('div');

  #p = document.createElement('p');

  constructor() {
    this.domNode.classList.add(styles['tooltip']);

    // hidden by default (until is given text content)
    this.domNode.style.visibility = 'hidden';

    this.#p.classList.add(styles.tooltipText);

    let textContainer = document.createElement('div');
    textContainer.classList.add(styles.tooltipTextContainer);
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
