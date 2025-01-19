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
  let draw = SVG();

  draw
    .viewbox(-3.5, -3.5, 25, 25)
    .attr({ 'width': '25px', 'height': '25px' })
    .css({ 'transform': 'rotate(45deg)' });

  draw.path()
    .attr('d', 'M 17 9 A 8 8 270 1 1 9 1')
    .attr('stroke', 'white')
    .attr('stroke-width', 1.5)
    .attr('fill', 'none');

  draw.path()
    .attr('d', 'M 9 -3 L 13 1 L 9 5 z')
    .attr('stroke', 'white')
    .attr('stroke-width', 1)
    .attr('fill', 'white');

  return draw.node;
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
