import type { Nucleobase } from './Nucleobase';

import type { LiveSet } from './LiveSet';

import * as $ from 'jquery';

import * as styles from './NumSelectedBasesView.css';

/**
 * Shows the number of selected bases to the user.
 */
export class NumSelectedBasesView {
  /**
   * The actual DOM node that is the "number of selected bases" view.
   */
  readonly domNode: HTMLParagraphElement;

  /**
   * The span element containing the number of currently selected bases.
   */
  private readonly numSpan: HTMLSpanElement;

  /**
   * Text trailing the number span.
   */
  private readonly trailingText: HTMLSpanElement;

  constructor(private selectedBases: LiveSet<Nucleobase>) {
    this.numSpan = document.createElement('span');

    $(this.numSpan).addClass(styles.numSpan);

    this.trailingText = document.createElement('span');

    this.domNode = document.createElement('p');

    $(this.domNode)
      .addClass(styles.numSelectedBasesView)
      .append(this.numSpan, this.trailingText);
  }

  refresh(): void {
    let num = [...this.selectedBases].length;
    this.numSpan.textContent = num.toString();
    this.trailingText.textContent = num == 1 ? ' base is selected.' : ' bases are selected.';
  }
}
