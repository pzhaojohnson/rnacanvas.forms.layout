import type { Nucleobase } from './Nucleobase';

import type { LiveSet } from './LiveSet';

import type { LayoutFormOptions } from './LayoutFormOptions';

import * as $ from 'jquery';

import { SVG } from '@svgdotjs/svg.js';

import * as styles from './RotateButton.css';

import { rotate } from '@rnacanvas/layout';

import { direction } from '@rnacanvas/points';

import { midpoint } from '@rnacanvas/points';

function RotateIcon() {
  let rotateIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

  rotateIcon.setAttribute('viewBox', '0 0 24 24');

  rotateIcon.setAttribute('width', '24');
  rotateIcon.setAttribute('height', '24');

  rotateIcon.innerHTML = `
    <path
      d="M 18 18 A 6 6 0 1 1 6, 6"
      stroke="white" stroke-width="1" fill="none"
    ></path>
    <path
      d="M 6 18 A 6 6 0 1 1 18, 6"
      stroke="white"l stroke-width="1" fill="none"
    ></path>
    <path
      d="M 18 6 l 3 -3 v 6 h -6 z"
      stroke="white" stroke-width="1" fill="white"
    ></path>
  `;

  return rotateIcon;
}

export class RotateButton {
  /**
   * The actual DOM node that is the rotate button.
   */
  readonly domNode;

  constructor(selectedBases: LiveSet<Nucleobase>, options?: LayoutFormOptions) {
    this.domNode = document.createElement('div');

    $(this.domNode)
      .addClass(styles.rotateButton)
      .append(RotateIcon());

    let isActive = false;

    let movedBases = false;

    let previousDirection = 0;

    this.domNode.addEventListener('mousedown', event => {
      isActive = true;

      let selectedBasesArray = [...selectedBases];

      if (selectedBasesArray.length > 0) {
        let firstSelectedBase = selectedBasesArray[0];
        let lastSelectedBase = selectedBasesArray[selectedBasesArray.length - 1];

        previousDirection = direction(
          midpoint(firstSelectedBase.getClientCenterPoint(), lastSelectedBase.getClientCenterPoint()),
          { x: event.clientX, y: event.clientY },
        );
      }
    });

    window.addEventListener('mousemove', event => {
      if (isActive) {
        let selectedBasesArray = [...selectedBases];

        if (selectedBasesArray.length > 0) {
          let firstSelectedBase = selectedBasesArray[0];
          let lastSelectedBase = selectedBasesArray[selectedBasesArray.length - 1];

          let currentDirection = direction(
            midpoint(firstSelectedBase.getClientCenterPoint(), lastSelectedBase.getClientCenterPoint()),
            { x: event.clientX, y: event.clientY },
          );

          if (!movedBases) {
            options?.beforeMovingBases ? options.beforeMovingBases() : {};
          }

          rotate(selectedBasesArray, currentDirection - previousDirection);

          movedBases = true;

          previousDirection = currentDirection;
        }
      }
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
