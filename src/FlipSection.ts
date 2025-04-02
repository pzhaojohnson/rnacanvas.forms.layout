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
    let flipXButton = new LightSolidButton('X');
    let flipYButton = new LightSolidButton('Y');
    let flipSelfXButton = new LightSolidButton('Self-X');
    let flipSelfYButton = new LightSolidButton('Self-Y');

    flipXButton.onClick = () => {
      options?.beforeMovingBases ? options.beforeMovingBases() : {};
      flipX([...selectedBases]);
      options?.afterMovingBases ? options.afterMovingBases() : {};
    };

    flipYButton.onClick = () => {
      options?.beforeMovingBases ? options.beforeMovingBases() : {};
      flipY([...selectedBases]);
      options?.afterMovingBases ? options.afterMovingBases() : {};
    };

    flipSelfXButton.onClick = () => {
      options?.beforeMovingBases ? options.beforeMovingBases() : {};
      flipSelfX([...selectedBases]);
      options?.afterMovingBases ? options.afterMovingBases() : {};
    };

    flipSelfYButton.onClick = () => {
      options?.beforeMovingBases ? options.beforeMovingBases() : {};
      flipSelfY([...selectedBases]);
      options?.afterMovingBases ? options.afterMovingBases() : {};
    };

    let flipLabel = document.createElement('p');

    $(flipLabel)
      .addClass(styles.flipLabel)
      .text('Flip:');

    this.domNode = document.createElement('div');

    $(this.domNode)
      .addClass(styles.flipSection)
      .append(flipLabel, flipXButton.domNode, flipYButton.domNode, flipSelfXButton.domNode, flipSelfYButton.domNode);

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

    flipXButton.tooltip = '[ ⇧ F ]';
    flipYButton.tooltip = '[ ⌥ ⇧ F ]';
    flipSelfXButton.tooltip = '[ F ]';
    flipSelfYButton.tooltip = '[ ⌥ F ]';
  }

  get keyBindings() {
    return [...this.#keyBindings];
  }
}
