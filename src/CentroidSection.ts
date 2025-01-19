import type { Nucleobase } from './Nucleobase';

import type { LiveSet } from './LiveSet';

import type { LayoutFormOptions } from './LayoutFormOptions';

import * as $ from 'jquery';

import * as styles from './CentroidSection.css';

import { TextInput } from './TextInput';

import { TextInputField } from './TextInputField';

import { Centroid } from '@rnacanvas/layout';

import { isFiniteNumber } from '@rnacanvas/value-check';

import { areWithin } from '@rnacanvas/math';

const centroidCoordinateNames = ['x', 'y'] as const;

type CentroidCoordinateName = typeof centroidCoordinateNames[number];

class CentroidCoordinateInput {
  private readonly coordinateName: CentroidCoordinateName;

  private readonly selectedBases: LiveSet<Nucleobase>;

  private readonly options?: LayoutFormOptions;

  readonly domNode = TextInput();

  constructor(coordinateName: CentroidCoordinateName, selectedBases: LiveSet<Nucleobase>, options?: LayoutFormOptions) {
    this.coordinateName = coordinateName;

    this.selectedBases = selectedBases;

    this.options = options;

    this.domNode.addEventListener('blur', () => this.handleSubmit());

    this.domNode.addEventListener('keyup', event => {
      if (event.key.toLowerCase() == 'enter') {
        this.handleSubmit();
      }
    });

    this.refresh();
  }

  refresh(): void {
    let centroid = new Centroid([...this.selectedBases]);
    let coordinate = centroid.get()[this.coordinateName];

    // round to two decimal places and trim trailing zeros after the decimal point
    this.domNode.value = Number.parseFloat(coordinate.toFixed(2)).toString();
  }

  private handleSubmit(): void {
    // the submitted value
    let value = Number.parseFloat(this.domNode.value);

    // ignore nonfinite inputs
    if (!isFiniteNumber(value)) { return; }

    let centroid = new Centroid([...this.selectedBases]);

    // require that the submitted value be far away enough from the current value
    if (areWithin(value, centroid.get()[this.coordinateName], 0.001)) { return; }

    this.options?.beforeMovingBases ? this.options.beforeMovingBases() : {};

    centroid.set({
      x: centroid.get().x,
      y: centroid.get().y,
      [this.coordinateName]: value,
    });

    this.options?.afterMovingBases ? this.options.afterMovingBases() : {};
  }
}

export class CentroidSection {
  private centroidXInput: CentroidCoordinateInput;
  private centroidYInput: CentroidCoordinateInput;

  readonly domNode: HTMLDivElement;

  constructor(private selectedBases: LiveSet<Nucleobase>, options?: LayoutFormOptions) {
    this.centroidXInput = new CentroidCoordinateInput('x', selectedBases, options);
    this.centroidYInput = new CentroidCoordinateInput('y', selectedBases, options);

    let centroidXField = TextInputField('X', this.centroidXInput.domNode);
    let centroidYField = TextInputField('Y', this.centroidYInput.domNode);

    $(centroidYField).css({ marginTop: '11px' });

    let fieldsContainer = document.createElement('div');

    $(fieldsContainer)
      .append(centroidXField, centroidYField)
      .css({ display: 'flex', flexDirection: 'column' });

    let centerLabel = document.createElement('p');

    $(centerLabel)
      .addClass(styles.centerLabel)
      .append('Center');

    this.domNode = document.createElement('div');

    $(this.domNode)
      .addClass(styles.centroidSection)
      .append(fieldsContainer, centerLabel);
  }

  refresh(): void {
    this.centroidXInput.refresh();
    this.centroidYInput.refresh();
  }
}
