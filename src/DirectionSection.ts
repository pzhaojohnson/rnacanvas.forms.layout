import type { Nucleobase } from './Nucleobase';

import type { LiveSet } from './LiveSet';

import type { LayoutFormOptions } from './LayoutFormOptions';

import * as $ from 'jquery';

import { TextInput } from './TextInput';

import { TextInputField } from './TextInputField';

import { RotateButton } from './RotateButton';

import { Direction } from '@rnacanvas/bases-layout';

import { degrees, radians } from '@rnacanvas/math';

import { isFiniteNumber } from '@rnacanvas/value-check';

import { areWithin } from '@rnacanvas/math';

const degreeCharacter = String.fromCharCode(176);

class DirectionInput {
  /**
   * The actual DOM node that is the "direction" input.
   */
  readonly domNode = TextInput();

  constructor(private selectedBases: LiveSet<Nucleobase>, private options?: LayoutFormOptions) {
    this.domNode.addEventListener('blur', () => this.handleSubmit());

    this.domNode.addEventListener('keyup', event => {
      if (event.key.toLowerCase() == 'enter') {
        this.handleSubmit();
      }
    });
  }

  refresh(): void {
    let direction = new Direction([...this.selectedBases]);

    // round to two decimal places and trim trailing zeros after the decimal point
    this.domNode.value = Number.parseFloat(degrees(direction.get()).toFixed(2)).toString();
    this.domNode.value += degreeCharacter;
  }

  handleSubmit(): void {
    // the submitted value
    let value = radians(Number.parseFloat(this.domNode.value));

    if (!isFiniteNumber(value)) { return; }

    let direction = new Direction([...this.selectedBases]);

    if (areWithin(value, direction.get(), 0.001)) { return; }

    this.options?.beforeMovingBases ? this.options.beforeMovingBases() : {};

    direction.set(value);

    this.options?.afterMovingBases ? this.options.afterMovingBases() : {};
  }
}

export class DirectionSection {
  /**
   * The actual DOM node that is the "direction" section.
   */
  readonly domNode: HTMLDivElement;

  private readonly directionInput: DirectionInput;

  constructor(selectedBases: LiveSet<Nucleobase>, options?: LayoutFormOptions) {
    this.directionInput = new DirectionInput(selectedBases, options);

    let directionField = TextInputField('Rotation', this.directionInput.domNode);

    let rotateButton = new RotateButton(selectedBases, options);

    this.domNode = document.createElement('div');

    $(this.domNode)
      .append(directionField)
      .append(rotateButton.domNode)
      .css({ display: 'flex', flexDirection: 'row', alignItems: 'center' });

    $(this.domNode).css({ marginTop: '33px' });
  }

  refresh(): void {
    this.directionInput.refresh();
  }
}
