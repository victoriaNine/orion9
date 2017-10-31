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
function init() {
  root = render(<App />, document.body, root);
}

// in development, set up HMR:
if (module.hot) {
  require('preact/devtools');   // turn this on if you want to enable React DevTools!
  module.hot.accept('Containers/App', () => requestAnimationFrame(init) );
}

init();
