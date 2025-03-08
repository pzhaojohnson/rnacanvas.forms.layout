import type { Nucleobase } from './Nucleobase';

import type { Drawing } from './Drawing';

import type { LiveSet } from './LiveSet';

import type { LayoutFormOptions } from './LayoutFormOptions';

import * as $ from 'jquery';

import * as styles from './ShiftButton.css';

import { shift } from '@rnacanvas/layout';

export class ShiftButton {
  readonly domNode;

  constructor(selectedBases: LiveSet<Nucleobase>, parentDrawing: Drawing, options?: LayoutFormOptions) {
    this.domNode = document.createElement('div');

    $(this.domNode)
      .addClass(styles.shiftButton)
      .append(ShiftIcon());

    let isActive = false;

    let movedBases = false;

    this.domNode.addEventListener('mousedown', () => isActive = true);

    window.addEventListener('mousemove', event => {
      if (!isActive) { return; }

      let selectedBasesArray = [...selectedBases];
      if (selectedBasesArray.length == 0) { return; }

      let x = event.movementX / parentDrawing.horizontalClientScaling;
      let y = event.movementY / parentDrawing.verticalClientScaling;
      if (!Number.isFinite(x) || !Number.isFinite(y)) { return; }

      if (!movedBases) {
        options?.beforeMovingBases ? options.beforeMovingBases() : {};
      }

      shift(selectedBasesArray, { x, y });

      movedBases = true;
    });

    window.addEventListener('mouseup', () => {
      if (isActive && movedBases) {
        options?.afterMovingBases ? options.afterMovingBases() : {};
      }

      isActive = false;
      movedBases = false;
    });
  }
}

function ShiftIcon() {
  let shiftIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

  shiftIcon.setAttribute('viewBox', '0 0 24 24');

  shiftIcon.setAttribute('width', '24');
  shiftIcon.setAttribute('height', '24');

  shiftIcon.innerHTML = `
    <path
      d="M 12 12 v 7 h -3 l 3 3 l 3 -3 h -3 v -7 v -7 h -3 l 3 -3 l 3 3 h -3 v 7 h -7 v 3 l -3 -3 l 3 -3 v 3 h 7 h 7 v -3 l 3 3 l -3 3 v -3 h -7 z"
      stroke="white" stroke-width="1" fill="white"
    ></path>
  `;

  return shiftIcon;
}

