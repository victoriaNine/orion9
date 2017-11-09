import 'isomorphic-fetch';
import 'babel-polyfill';
import { h, render } from 'preact';

import App from 'Containers/App';

if (!__IS_DEV__) {
  require('Internal/ga');
  require('Internal/pwa');
} else {
  require('Internal/stats').default();
}

let root;
let appDOM;
let initialized = false;
const appNode = <App ref={(ref) => { appDOM = ref.base; }}/>;

function init() {
  if (initialized) {
    root = render(appNode, document.body, root);
  } else {
    const wrapper = document.createElement("div");
    root = render(appNode, wrapper);
    document.body.insertBefore(appDOM, document.body.querySelector("script"));
    initialized = true;
  }
}

// in development, set up HMR:
if (module.hot) {
  require('preact/devtools');   // turn this on if you want to enable React DevTools!
  module.hot.accept('Containers/App', () => requestAnimationFrame(init) );
}

init();
