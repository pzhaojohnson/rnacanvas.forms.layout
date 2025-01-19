import type { Nucleobase } from './Nucleobase';

import type { LiveSet } from './LiveSet';

import type { LayoutFormOptions } from './LayoutFormOptions';

import * as $ from 'jquery';

import { SVG } from '@svgdotjs/svg.js';

import * as styles from './MoreCoordinatesSection.css';

import { TextInput } from './TextInput';

import { TextInputField } from './TextInputField';

import { MinCenterX, MaxCenterX } from '@rnacanvas/layout';

import { MinCenterY, MaxCenterY } from '@rnacanvas/layout';

import { isFiniteNumber } from '@rnacanvas/value-check';

import { areWithin } from '@rnacanvas/math';

function HeaderCaret() {
  let draw = SVG();

  draw.addClass(styles.headerCaret);

  draw
    .viewbox(0, 0, 6, 10)
    .attr({ 'width': '6px', 'height': '10px' });

  draw.path()
    .attr('d', 'M 1 1 L 5 5 L 1 9')
    .attr('stroke', 'black')
    .attr('stroke-width', 2)
    .attr('stroke-linecap', 'round')
    .attr('stroke-linejoin', 'round')
    .attr('fill', 'none');

  return draw.node;
}

function Header() {
  let header = document.createElement('button');

  $(header)
    .addClass(styles.header)
    .append(HeaderCaret(), 'More Coordinates');

  return header;
}

const coordinateNames = ['Left', 'Right', 'Top', 'Bottom'] as const;

type CoordinateName = typeof coordinateNames[number];

const Coordinates = {
  'Left': MinCenterX,
  'Right': MaxCenterX,
  'Top': MinCenterY,
  'Bottom': MaxCenterY,
};

class CoordinateInput {
  private readonly coordinateName: CoordinateName;

  /**
   * The type of coordinate that this "coordinate" input is for.
   */
  private readonly Coordinate: typeof Coordinates[CoordinateName];

  private readonly selectedBases: LiveSet<Nucleobase>;

  private readonly options?: LayoutFormOptions;

  /**
   * The actual DOM node that is the "coordinate" input.
   */
  readonly domNode: HTMLInputElement;

  constructor(coordinateName: CoordinateName, selectedBases: LiveSet<Nucleobase>, options?: LayoutFormOptions) {
    this.coordinateName = coordinateName;

    this.Coordinate = Coordinates[coordinateName];

    this.selectedBases = selectedBases;

    this.options = options;

    this.domNode = TextInput();

    this.domNode.addEventListener('blur', () => this.handleSubmit());

    this.domNode.addEventListener('keyup', event => {
      if (event.key.toLowerCase() == 'enter') {
        this.handleSubmit();
      }
    });
  }

  refresh(): void {
    let Coordinate = this.Coordinate
    let coordinate = new Coordinate([...this.selectedBases]);

    // round to two decimal places and remove trailing zeros after the decimal point
    this.domNode.value = Number.parseFloat(coordinate.get().toFixed(2)).toString();
  }

  private handleSubmit(): void {
    // the submitted value
    let value = Number.parseFloat(this.domNode.value);
    if (!isFiniteNumber(value)) { return; }

    let Coordinate = this.Coordinate;
    let coordinate = new Coordinate([...this.selectedBases]);

    if (areWithin(value, coordinate.get(), 0.001)) { return; }

    this.options?.beforeMovingBases ? this.options.beforeMovingBases() : {};
    coordinate.set(value);
    this.options?.afterMovingBases ? this.options.afterMovingBases : {};
  }
}

class CoordinateField {
  private readonly coordinateInput: CoordinateInput;

  /**
   * The actual DOM node that is the "coordinate" field.
   */
  readonly domNode: ReturnType<typeof TextInputField>;

  constructor(coordinateName: CoordinateName, selectedBases: LiveSet<Nucleobase>, options?: LayoutFormOptions) {
    this.coordinateInput = new CoordinateInput(coordinateName, selectedBases, options);

    this.domNode = TextInputField(coordinateName, this.coordinateInput.domNode);
  }

  refresh(): void {
    this.coordinateInput.refresh();
  }
}

export class MoreCoordinatesSection {
  private readonly fields: CoordinateField[];

  /**
   * The actual DOM node that is the "more coordinates" section.
   */
  readonly domNode: HTMLDivElement;

  constructor(selectedBases: LiveSet<Nucleobase>, options?: LayoutFormOptions) {
    let header = Header();

    let content = document.createElement('div');

    this.fields = coordinateNames.map(name => new CoordinateField(name, selectedBases, options));

    $(content)
      .addClass(styles.content)
      .append(...this.fields.map(f => f.domNode));

    this.domNode = document.createElement('div');

    $(this.domNode)
      .addClass(styles.moreCoordinatesSection);

    $(header).on('click', () => $(this.domNode).toggleClass(styles.open));

    $(this.domNode)
      .append(header)
      .append(content);
  }

  refresh(): void {
    this.fields.forEach(f => f.refresh());
  }
}
