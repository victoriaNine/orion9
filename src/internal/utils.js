const eventsMap = {
  down: { touch: 'touchstart', desktop: 'mousedown' },
  up: { touch: 'touchend', desktop: 'mouseup' },
  move: { touch: 'touchmove', desktop: 'mousemove' },
};

const navigatorToAppLanguageCode = {
  ja: 'jp'
};

const langRegex = /^\/(fr|en|jp)\//;

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

function getLanguageCode (code, reverseLookup) {
  const navigatorLanguageCodes = Object.keys(navigatorToAppLanguageCode);
  const appLanguageCodes = Object.keys(navigatorToAppLanguageCode).map((key) => navigatorToAppLanguageCode[key]);

  if (reverseLookup && appLanguageCodes.includes(code)) {
    // Retrieve navigator language code for a given app language code
    return navigatorLanguageCodes.find((key) => navigatorToAppLanguageCode[key] === code);
  } else if (navigatorLanguageCodes.includes(code)) {
    // Retrieve app language code for a given navigator language code
    return navigatorToAppLanguageCode[code];
  }

  // If there is no conversion to be made, return the original code
  return code;
}

function replaceStringToJSX (string, match, jsx, join) {
  const result = [];

  string.split(match).forEach((part, index, array) => {
    result.push(part);
    (index < array.length - 1) && result.push(jsx);
  });

  return join ? result.join("") : result;
}

function getFirstChild (props) {
  return props.children[0] || null;
}

export {
  eventsMap,
  langRegex,
  getLanguageFromPath,
  getLocationWithoutLang,
  getLocationParams,
  getPageName,
  getWorkIdFromPath,
  getLanguageCode,
  replaceStringToJSX,
  getFirstChild,
};
