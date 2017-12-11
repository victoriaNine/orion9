import { TimelineMax } from 'gsap';


/******
// DOM Events
*******/
const eventsMap = {
  down: { touch: 'touchstart', desktop: 'mousedown' },
  up: { touch: 'touchend', desktop: 'mouseup' },
  move: { touch: 'touchmove', desktop: 'mousemove' },
};


/******
// Language
*******/
const navigatorToAppLanguageCode = {
  fr: 'fr',
  en: 'en',
  ja: 'jp'
};

const langRegex = new RegExp(`^/(${getAppLanguageList().join('|')})/`);

function getLanguageFromPath (location) {
  return location.match(langRegex);
}

function getLocationWithoutLang (location) {
  return location.replace(langRegex, '/');
}

function getLocationParams (location) {
  return getLocationWithoutLang(location).split('/').slice(1);
}

function getPageName (location) {
  return getLocationParams(location)[0];
}

function getWorkIdFromPath (location) {
  const locationParams = getLocationParams(location);
  return locationParams[locationParams.length - 1];
}

function getNavigatorLanguageList () {
  return Object.keys(navigatorToAppLanguageCode);
}

function getAppLanguageList () {
  return Object.keys(navigatorToAppLanguageCode).map((key) => navigatorToAppLanguageCode[key]);
}

function getDefaultLanguageCode () {
  return getAppLanguageList()[1];
}

function getAppLanguageCode (code) {
  const navigatorLanguageList = getNavigatorLanguageList();

  if (navigatorLanguageList.includes(code)) {
    // Retrieve app language code for a given navigator language code
    return navigatorToAppLanguageCode[code];
  }

  // If there is no conversion to be made, return the original code
  return code;
}

function getNavigatorLanguageCode (code) {
  const navigatorLanguageList = getNavigatorLanguageList();
  const appLanguageList = getAppLanguageList();

  if (appLanguageList.includes(code)) {
    // Retrieve navigator language code for a given app language code
    return navigatorLanguageList.find((key) => navigatorToAppLanguageCode[key] === code);
  }

  // If there is no conversion to be made, return the original code
  return code;
}


/******
// JSX
*******/
function replaceStringToJSX (string, match, jsx, join) {
  const result = [];

  string.split(match).forEach((part, index, array) => {
    result.push(part);
    (index < array.length - 1) && result.push(jsx);
  });

  return join ? result.join("") : result;
}


/******
// DOM
*******/
function getFirstChild (props) {
  return props.children[0] || null;
}


/******
// Transitions
*******/
const transitionYDelta = 12;

// Generic transition
function transitionIn (element, callback) {
  const tl = new TimelineMax({ delay: 0.2, onComplete: () => { callback && callback(); } });
  tl.from(element, 0.2, { opacity: 0, y: -1 * transitionYDelta, clearProps: "all" });

  return tl;
}

function transitionOut (element, callback) {
  const tl = new TimelineMax({ onComplete: () => { callback && callback(); } });
  tl.to(element, 0.2, { opacity: 0, y: -1 * transitionYDelta, clearProps: "all" });

  return tl;
}


export {
  eventsMap,
  getLanguageFromPath,
  getLocationWithoutLang,
  getLocationParams,
  getPageName,
  getWorkIdFromPath,
  getNavigatorLanguageList,
  getAppLanguageList,
  getAppLanguageCode,
  getNavigatorLanguageCode,
  getDefaultLanguageCode,
  replaceStringToJSX,
  getFirstChild,

  transitionYDelta,
  transitionIn,
  transitionOut,
};
