import type { Nucleobase } from './Nucleobase';

import type { LiveSet } from './LiveSet';

import type { LayoutFormOptions } from './LayoutFormOptions';

import * as $ from 'jquery';

import * as styles from './FlipSection.css';

import { LightSolidButton } from './LightSolidButton';

import { flipX, flipY } from '@rnacanvas/layout';

import { flipSelfX, flipSelfY } from '@rnacanvas/layout';

import { KeyBinding } from '@rnacanvas/utilities';

export class FlipSection {
  readonly domNode;

  #keyBindings;

  constructor(selectedBases: LiveSet<Nucleobase>, options?: LayoutFormOptions) {
    let flipXButton = LightSolidButton();
    let flipYButton = LightSolidButton();
    let flipSelfXButton = LightSolidButton();
    let flipSelfYButton = LightSolidButton();

    $(flipXButton).text('X');
    $(flipYButton).text('Y');
    $(flipSelfXButton).text('Self-X');
    $(flipSelfYButton).text('Self-Y');

    $(flipXButton).on('click', () => {
      options?.beforeMovingBases ? options.beforeMovingBases() : {};
      flipX([...selectedBases]);
      options?.afterMovingBases ? options.afterMovingBases() : {};
    });

    $(flipYButton).on('click', () => {
      options?.beforeMovingBases ? options.beforeMovingBases() : {};
      flipY([...selectedBases]);
      options?.afterMovingBases ? options.afterMovingBases() : {};
    });

    $(flipSelfXButton).on('click', () => {
      options?.beforeMovingBases ? options.beforeMovingBases() : {};
      flipSelfX([...selectedBases]);
      options?.afterMovingBases ? options.afterMovingBases() : {};
    });

    $(flipSelfYButton).on('click', () => {
      options?.beforeMovingBases ? options.beforeMovingBases() : {};
      flipSelfY([...selectedBases]);
      options?.afterMovingBases ? options.afterMovingBases() : {};
    });

    let flipLabel = document.createElement('p');

    $(flipLabel)
      .addClass(styles.flipLabel)
      .text('Flip:');

    this.domNode = document.createElement('div');

    $(this.domNode)
      .addClass(styles.flipSection)
      .append(flipLabel, flipXButton, flipYButton, flipSelfXButton, flipSelfYButton);

    this.#keyBindings = [
      new KeyBinding('F', () => flipXButton.click(), { shiftKey: true }),
      new KeyBinding('F', () => flipYButton.click(), { shiftKey: true, altKey: true }),
      // holding the Alt key can change other character keys
      new KeyBinding('Ï', () => flipYButton.click(), { shiftKey: true, altKey: true }),
      new KeyBinding('F', () => flipSelfXButton.click()),
      new KeyBinding('F', () => flipSelfYButton.click(), { altKey: true }),
      // holding the Alt key can change other character keys
      new KeyBinding('Ƒ', () => flipSelfYButton.click(), { altKey: true }),
    ];
  }

  get keyBindings() {
    return [...this.#keyBindings];
  }
}
