/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
import { createTag } from '../block-helpers.js';

function injectScript(placeholderScript, block) {
  const script = document.createElement('script');
  if (placeholderScript.dataset) {
    const dataset = { ...placeholderScript.dataset };
    for (const [key, value] of Object.entries(dataset)) {
      script.dataset[key] = value.toString();
    }
  }

  if (placeholderScript.src) {
    script.src = placeholderScript.src;
  }

  if (placeholderScript.async) {
    script.async = placeholderScript.async;
  }

  block.append(script);
}

function extractWallParameters($block) {
  const $parameterContainers = Array.from($block.children);

  const parameters = {
      src: 'https://walls.io/js/wallsio-widget-1.2.js',
      async: true,
      'data-width': '100%',
      'data-autoheight': 1,
      'data-lazyload': 1,
  };

  $parameterContainers.forEach(($parameterContainer) => {
    const parameterTitle = $parameterContainer.children[0].textContent;
    const parameterValue = $parameterContainer.children[1].textContent;

    if (parameterTitle === 'Walls.io URL' && parameterValue.includes('https://my.walls.io')) {
      parameters['data-wallurl'] = parameterValue;
    }

    if (parameterTitle === 'Height (px)') {
      parameters['data-height'] = parameterValue.replace('px', '');
    }

    if (parameterTitle === 'Title') {
      parameters['data-title'] = parameterValue;
    }
  });

  return parameters;
}

export default function decorate($block) {
  const parameters = extractWallParameters($block);

  $block.innerHTML = '';

  if (parameters['data-wallurl']) {
    const script = createTag('script', parameters, null);
    $block.appendChild(script);
  } else {
    $block.innerHTML = 'The Walls.io block requires a valid Walls.io URL to function.';
  }
}
